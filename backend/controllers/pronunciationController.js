const result = require('../utils/result');

exports.evaluatePronunciation = async (req, res) => {
  try {
    const audioFile = req.file;
    const referenceText = req.body.referenceText;

    if (!audioFile) {
      return res.json(result.fail('Audio file is required'));
    }

    if (!referenceText || referenceText.trim() === '') {
      return res.json(result.fail('Reference text is required'));
    }

    console.log('Received pronunciation evaluation request:', {
      audioSize: audioFile.size,
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
  
  const phonemeErrors = [];
  const totalScore = Math.floor(Math.random() * 30) + 70;
  const fluency = Math.floor(Math.random() * 20) + 80;
  const accuracy = Math.floor(Math.random() * 25) + 75;

  const errorCount = Math.floor(Math.random() * 3);
  const vowels = ['aeiou', 'ei', 'ai', 'ou', 'ow', 'oy', 'au', 'ew'];
  
  for (let i = 0; i < errorCount; i++) {
    const randomWordIndex = Math.floor(Math.random() * words.length);
    const word = words[randomWordIndex] || 'word';
    const targetPhoneme = vowels[Math.floor(Math.random() * vowels.length)];
    const actualPhoneme = vowels[Math.floor(Math.random() * vowels.length)];
    
    phonemeErrors.push({
      word,
      targetPhoneme,
      actualPhoneme,
      position: i + 1
    });
  }

  return {
    totalScore,
    fluency,
    accuracy,
    completeness: Math.min(100, Math.floor((words.length - errorCount) / words.length * 100)),
    phonemeErrors,
    suggestion: getSuggestion(totalScore),
    referenceText
  };
}

function getSuggestion(score) {
  if (score >= 90) {
    return 'Excellent pronunciation! Keep up the good work.';
  } else if (score >= 80) {
    return 'Good job! Focus on the highlighted phonemes to improve.';
  } else if (score >= 70) {
    return 'Not bad! Practice more on the vowel sounds.';
  } else {
    return 'Keep practicing! Pay attention to pronunciation of individual sounds.';
  }
}