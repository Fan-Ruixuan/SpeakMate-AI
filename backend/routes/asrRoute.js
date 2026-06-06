const express = require('express');
const router = express.Router();
const multer = require('multer');
const asrController = require('../controllers/asrController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/recognize', upload.single('audio'), asrController.recognizeSpeech);
module.exports = router;
