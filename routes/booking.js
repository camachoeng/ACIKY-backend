const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Send booking request
router.post('/', bookingController.sendBookingRequest);

module.exports = router;
