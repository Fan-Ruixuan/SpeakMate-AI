const express = require('express');
const router = express.Router();
const multer = require('multer');
const pronunciationController = require('../controllers/pronunciationController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/test', (req, res) => {
  res.json({ code: 200, msg: 'test success' });
});

router.post('/evaluate', upload.single('audio'), pronunciationController.evaluatePronunciation);

module.exports = router;