const express = require('express');
const ai = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/chat', authMiddleware, ai.Chat);

module.exports = router;