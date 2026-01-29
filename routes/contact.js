const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact - Send contact form message (with rate limiting)
router.post('/', contactLimiter, contactController.sendContactMessage);

module.exports = router;
