const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAdmin } = require('../middleware/auth');

// Get all teachers (for dropdown in activity form)
router.get('/teachers', userController.getAllTeachers);

// Get all users (admin only)
router.get('/', requireAdmin, userController.getAllUsers);

// Update user role (admin only)
router.put('/:id/role', requireAdmin, userController.updateUserRole);

module.exports = router;
