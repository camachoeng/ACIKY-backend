const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Check authentication status
router.get('/check', authController.checkAuth);

// Update profile route
router.put('/profile', authController.updateProfile);

module.exports = router;
