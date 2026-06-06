const express = require('express');
const router = express.Router();

router.use('/user', require('./userRoute'));
router.use('/asr', require('./asrRoute'));

module.exports = router;