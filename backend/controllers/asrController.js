const result = require('../utils/result');

exports.recognizeSpeech = async (req, res) => {
  try {
    const audioFile = req.file;
    if (!audioFile) return res.json(result.fail('Audio file is required'));
    
    console.log('Received audio file:', audioFile.originalname, audioFile.size, 'bytes');
    
    const text = "Hello, this is standard ASR output";
    res.json(result.success(text));
  } catch (err) {
    res.status(500).json(result.fail('ASR error: ' + err.message));
  }
};
