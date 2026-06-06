const result = require('../utils/result');
exports.recognizeSpeech = async (req, res) => {
  try {
    const { audio } = req.body;
    const recognizedText = "Hello, this is ASR result";
    res.json(result.success({ text: recognizedText }));
  } catch (error) {
    res.json(result.fail('ASR recognition failed'));
  }
};