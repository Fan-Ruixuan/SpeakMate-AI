const express = require('express');
const router = express.Router();
const sceneController = require('../controllers/sceneController');
router.get('/list', sceneController.getList);
module.exports = router;