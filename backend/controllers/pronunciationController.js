const result = require('../utils/result');

exports.evaluatePronunciation = async (req, res) => {
  try {
    const audioFile = req.file;
    const referenceText = req.body.referenceText;

    if (!referenceText || referenceText.trim() === '') {
      return res.json(result.fail('Reference text is required'));
    }

    console.log('Received pronunciation evaluation request:', {
      audioSize: audioFile ? audioFile.size : 'no audio',
      referenceText: referenceText.trim().substring(0, 50) + '...'
    });

    const evaluationResult = simulatePronunciationEvaluation(referenceText);

    res.json(result.success(evaluationResult));
  } catch (err) {
    console.error('Pronunciation evaluation error:', err);
    res.status(500).json(result.fail('Pronunciation evaluation error: ' + err.message));
  }
};

function simulatePronunciationEvaluation(referenceText) {
  const words = referenceText.toLowerCase().split(/\s+/);
  const maxErrors = Math.min(words.length, 5);
  
  const totalScore = Math.floor(Math.random() * 30) + 70;
  
  let errorCount;
  if (totalScore >= 90) {
    errorCount = Math.random() < 0.7 ? 0 : 1;
  } else if (totalScore >= 80) {
    errorCount = 1;
  } else if (totalScore >= 70) {
    errorCount = 2;
  } else {
    errorCount = Math.min(Math.floor(Math.random() * 3) + 3, maxErrors);
  }

  const baseAccuracy = 95 - errorCount * 8;
  const accuracy = Math.min(100, Math.max(60, baseAccuracy + Math.floor(Math.random() * 10)));
  
  const baseFluency = 90 - errorCount * 3;
  const fluency = Math.min(100, Math.max(70, baseFluency + Math.floor(Math.random() * 10)));

  const phonemeErrors = [];
  const vowels = ['ae', 'ei', 'ai', 'ou', 'ow', 'oy', 'au', 'ew', 'i:', 'a:'];
  const consonants = ['th', 'sh', 'ch', 'r', 'l', 's', 'z', 'v', 'f', 'p', 'b', 't', 'd', 'k', 'g'];
  const phonemes = [...vowels, ...consonants];
  
  const usedWordIndices = new Set();
  
  for (let i = 0; i < errorCount; i++) {
    let wordIndex;
    do {
      wordIndex = Math.floor(Math.random() * words.length);
    } while (usedWordIndices.has(wordIndex));
    usedWordIndices.add(wordIndex);
    
    const word = words[wordIndex] || 'word';
    const targetPhoneme = phonemes[Math.floor(Math.random() * phonemes.length)];
    let actualPhoneme;
    do {
      actualPhoneme = phonemes[Math.floor(Math.random() * phonemes.length)];
    } while (actualPhoneme === targetPhoneme);
    
    phonemeErrors.push({
      word,
      targetPhoneme,
      actualPhoneme,
      position: i + 1
    });
  }

  const completeness = Math.min(100, Math.max(50, 100 - errorCount * 10 + Math.floor(Math.random() * 10)));

  return {
    totalScore,
    fluency,
    accuracy,
    completeness,
    phonemeErrors,
    suggestion: getSuggestion(totalScore, errorCount),
    referenceText
  };
}

function getSuggestion(score, errorCount) {
  if (score >= 90) {
    if (errorCount === 0) {
      return '🎉 Excellent pronunciation! Keep up the good work!';
    }
    return '👏 Great job! Just a few minor issues. A bit more practice and you’ll be perfect.';
  } else if (score >= 80) {
    return '👍 Good performance! Focus on the highlighted ' + (errorCount === 1 ? 'phoneme' : 'phonemes') + ' to improve.';
  } else if (score >= 70) {
    return '💪 Not bad! Practice more on the vowel and consonant sounds.';
  } else {
    return '📚 Keep practicing! Pay attention to pronunciation of individual sounds.';
  }
}