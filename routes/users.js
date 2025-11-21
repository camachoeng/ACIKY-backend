const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all instructors (for dropdown in activity form)
router.get('/instructors', userController.getAllInstructors);

module.exports = router;
