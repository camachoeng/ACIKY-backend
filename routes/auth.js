const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

// Register route (with rate limiting)
router.post('/register', authLimiter, authController.register);

// Login route (with rate limiting)
router.post('/login', authLimiter, authController.login);

// Logout route
router.post('/logout', authController.logout);

// Check authentication status
router.get('/check', authController.checkAuth);

// Update profile route
router.put('/profile', authController.updateProfile);

module.exports = router;
