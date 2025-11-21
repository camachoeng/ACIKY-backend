// Authentication and authorization middleware

// Check if user is logged in
exports.requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

// Check if user has admin role
exports.requireAdmin = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const db = require('../config/database');
        const [users] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [req.session.userId]
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

// Check if user has admin or instructor/teacher role
exports.requireInstructor = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const db = require('../config/database');
        const [users] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [req.session.userId]
        );

        if (users.length === 0 || !['admin', 'instructor', 'teacher'].includes(users[0].role)) {
            return res.status(403).json({
                success: false,
                message: 'Teacher, instructor or admin access required'
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
