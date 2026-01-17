const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAdmin } = require('../middleware/auth');

// Get all instructors (for dropdown in activity form)
router.get('/instructors', userController.getAllInstructors);

// Get all users (admin only)
router.get('/', requireAdmin, userController.getAllUsers);

// Get single user by ID (admin only)
router.get('/:id', requireAdmin, userController.getUserById);

// Create new user (admin only)
router.post('/', requireAdmin, userController.createUser);

// Update user (admin only)
router.put('/:id', requireAdmin, userController.updateUser);

// Update user role (admin only)
router.put('/:id/role', requireAdmin, userController.updateUserRole);

// Delete user (admin only)
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;
