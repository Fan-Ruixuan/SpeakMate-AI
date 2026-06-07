const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');

router.get('/stats', vocabularyController.getErrorStats);
router.post('/collect', vocabularyController.collectVocabulary);
router.get('/', vocabularyController.getVocabularyList);
router.post('/', vocabularyController.addVocabulary);
router.delete('/:id', vocabularyController.deleteVocabulary);

module.exports = router;
