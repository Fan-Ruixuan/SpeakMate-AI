const result = require('../utils/result');
const vocabularyService = require('../services/vocabularyService');

exports.correctGrammar = async (req, res) => {
  try {
    const { text, userId = '1' } = req.body;

    if (!text || text.trim() === '') {
      return res.json(result.fail('Text to correct is required'));
    }

    const trimmedText = text.trim();

    console.log('Received grammar correction request:', {
      textLength: trimmedText.length,
      text: trimmedText.substring(0, 50) + '...'
    });

    const correctionResult = simulateGrammarCorrection(trimmedText);
    await autoCollectVocabulary(userId, trimmedText, correctionResult.errors);

    res.json(result.success(correctionResult));
  } catch (err) {
    console.error('Grammar correction error:', err);
    res.status(500).json(result.fail('Grammar correction error: ' + err.message));
  }
};

function simulateGrammarCorrection(text) {
  const errors = [];
  
  const commonErrors = [
    { type: 'grammar', pattern: /\bi am\b/gi, replacement: 'I am', message: 'Subject pronoun should be capitalized' },
    { type: 'spelling', pattern: /\brecieve\b/gi, replacement: 'receive', message: 'Correct spelling: "i before e except after c"' },
    { type: 'wording', pattern: /\bvery good\b/gi, replacement: 'excellent', message: 'Use stronger vocabulary' },
    { type: 'grammar', pattern: /\bdon't has\b/gi, replacement: 'don\'t have', message: 'Subject-verb agreement: "have" with plural/modal verbs' },
    { type: 'spelling', pattern: /\boccured\b/gi, replacement: 'occurred', message: 'Double consonant when adding -ed to a word ending with vowel + consonant' },
    { type: 'wording', pattern: /\ba lot of\b/gi, replacement: 'many', message: 'More precise vocabulary for countable nouns' },
    { type: 'grammar', pattern: /\bhe go\b/gi, replacement: 'he goes', message: 'Third person singular present tense requires -s ending' },
    { type: 'punctuation', pattern: /\s\./g, replacement: '.', message: 'No space before punctuation mark' },
  ];

  let correctedText = text;
  
  commonErrors.forEach((error, index) => {
    const matches = [...text.matchAll(error.pattern)];
    
    matches.forEach(match => {
      const originalMatch = match[0];
      const startIndex = match.index || 0;
      const endIndex = startIndex + originalMatch.length;
      
      const alreadyFlagged = errors.some(e => 
        e.startIndex <= startIndex && e.endIndex >= endIndex ||
        e.startIndex >= startIndex && e.startIndex < endIndex
      );
      
      if (!alreadyFlagged) {
        correctedText = correctedText.replace(error.pattern, error.replacement);
        
        errors.push({
          id: errors.length + 1,
          type: error.type,
          message: error.message,
          original: originalMatch,
          replacement: error.replacement,
          startIndex,
          endIndex
        });
      }
    });
  });

  const extraSuggestions = generateExtraSuggestions(text, correctedText);
  
  return {
    originalText: text,
    correctedText: correctedText,
    errors: errors,
    overallSuggestion: getOverallSuggestion(errors.length, text.length)
  };
}

function generateExtraSuggestions(originalText, correctedText) {
  const suggestions = [];
  
  if (originalText.split(' ').length < 5) {
    suggestions.push('Try expanding your sentences with more details');
  }
  
  if (/very/i.test(originalText)) {
    suggestions.push('Avoid overusing "very" - use more precise adjectives instead');
  }
  
  return suggestions;
}

async function autoCollectVocabulary(userId, originalText, errors) {
  const collectTypes = ['spelling', 'wording'];
  const collected = new Set();

  for (const error of errors) {
    if (!collectTypes.includes(error.type)) continue;

    const word =
      error.type === 'spelling'
        ? error.replacement.trim().toLowerCase()
        : error.original.trim().toLowerCase();

    if (!word || collected.has(word)) continue;

    collected.add(word);

    try {
      await vocabularyService.collectWord(userId, word, originalText);
      console.log('Auto collected vocabulary word:', word);
    } catch (err) {
      console.error('Auto collect vocabulary failed:', word, err);
    }
  }
}

function getOverallSuggestion(errorCount, textLength) {
  // 基于错误数量的差异化建议
  if (errorCount === 0) {
    return '🎉 Perfect! 100/100. Your sentence is flawless!';
  } else if (errorCount === 1) {
    return '👍 Excellent! 95/100. Just 1 minor issue to fix.';
  } else if (errorCount === 2) {
    return ' Good effort! 85/100. 2 corrections to review.';
  } else {
    return '📚 Keep practicing! <75/100. Focus on the highlighted errors.';
  }
}
