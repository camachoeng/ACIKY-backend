// Authentication and authorization middleware
const { getUserId } = require('../utils/authToken');

// Check if user is logged in
exports.requireAuth = (req, res, next) => {
    const userId = getUserId(req);

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Set userId in session if not already set (for token-based auth)
    if (!req.session.userId) {
        req.session.userId = userId;
    }

    next();
};

// Check if user has admin role
exports.requireAdmin = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const db = require('../config/database');
        const [users] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0 || users[0].role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authorization check failed'
        });
    }
};

// Check if user has admin or instructor role
exports.requireInstructor = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const db = require('../config/database');
        const [users] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0 || !['admin', 'instructor'].includes(users[0].role)) {
            return res.status(403).json({
                success: false,
                message: 'Instructor or admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authorization check failed'
        });
    }
};
