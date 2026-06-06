const express = require('express');
const router = express.Router();
const asrController = require('../controllers/asrController');
router.post('/recognize', asrController.recognizeSpeech);
module.exports = router;