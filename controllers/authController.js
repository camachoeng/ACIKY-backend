const authService = require('../services/authService');

/**
 * Auth Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Register new user
exports.register = async (req, res) => {
    try {
        const { userId } = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Register error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const user = await authService.login(req.body);

        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.role = user.role;

        res.json({
            success: true,
            message: 'Login successful',
            user
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Login error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Server error during login'
        });
    }
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
};

// Check if user is logged in
exports.checkAuth = (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            isAuthenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                email: req.session.email,
                role: req.session.role
            }
        });
    } else {
        res.json({
            success: true,
            isAuthenticated: false
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        console.log('Update profile - session:', req.session);
        console.log('Update profile - userId:', req.session.userId);

        const userId = req.session.userId;

        if (!userId) {
            console.log('No userId in session - not authenticated');
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        const user = await authService.updateProfile(userId, req.body);

        // Update session data
        req.session.username = user.username;
        req.session.email = user.email;

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.error('Update profile error:', error);

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Server error during profile update'
        });
    }
};
