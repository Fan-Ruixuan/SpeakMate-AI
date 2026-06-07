const express = require('express');
const router = express.Router();
const grammarController = require('../controllers/grammarController');

router.post('/correct', grammarController.correctGrammar);

module.exports = router;
