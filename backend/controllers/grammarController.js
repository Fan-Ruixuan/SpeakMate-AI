const result = require('../utils/result');

exports.correctGrammar = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.json(result.fail('Text to correct is required'));
    }

    console.log('Received grammar correction request:', {
      textLength: text.length,
      text: text.trim().substring(0, 50) + '...'
    });

    const correctionResult = simulateGrammarCorrection(text.trim());

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

function getOverallSuggestion(errorCount, textLength) {
  if (errorCount === 0) {
    return 'Excellent! No grammar or spelling errors found in your sentence.';
  } else if (errorCount <= 2) {
    return 'Good job! Just a couple of minor issues to fix.';
  } else if (errorCount <= 5) {
    return 'Not bad! Review the suggested corrections carefully.';
  } else {
    return 'Keep practicing! Focus on one type of error at a time.';
  }
}
