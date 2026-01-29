const userService = require('../services/userService');

/**
 * User Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get all instructors for assignment to activities
exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await userService.getAllInstructors();

        res.json({
            success: true,
            data: instructors
        });

    } catch (error) {
        console.error('Get instructors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching instructors'
        });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

// Get single user by ID (admin only)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
};

// Create new user (admin only)
exports.createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Create user error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error creating user'
        });
    }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.session.userId;

        const user = await userService.updateUser(id, req.body, currentUserId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Update user error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error updating user'
        });
    }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.session.userId;

        const deleted = await userService.deleteUser(id, currentUserId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Delete user error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error deleting user'
        });
    }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const currentUserId = req.session.userId;

        const updated = await userService.updateUserRole(id, role, currentUserId);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully'
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Update user role error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error updating user role'
        });
    }
};
