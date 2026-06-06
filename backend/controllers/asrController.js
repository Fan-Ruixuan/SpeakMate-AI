const result = require('../utils/result');
exports.recognizeSpeech = async (req, res) => {
  try {
    const { audio } = req.body;
    if (!audio) return res.json(result.fail('Audio data is required'));
    const text = "Hello, this is standard ASR output";
    res.json(result.success({ text }));
  } catch (err) {
    res.json(result.fail('ASR error: ' + err.message));
  }
};