const express = require('express');
const router = express.Router();
const practiceReportController = require('../controllers/practiceReportController');

router.get('/', practiceReportController.getPracticeReport);
router.get('/history', practiceReportController.getPracticeHistory);

module.exports = router;