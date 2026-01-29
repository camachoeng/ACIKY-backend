const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingLimiter } = require('../middleware/rateLimiter');

// Send booking request (with rate limiting)
router.post('/', bookingLimiter, bookingController.sendBookingRequest);

module.exports = router;
