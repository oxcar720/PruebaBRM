const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const logController = require('../controllers/logController');

const router = express.Router();

router.get('/logs', authMiddleware([1]), logController.getLogs);

module.exports = router;
