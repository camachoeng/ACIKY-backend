// Authentication and authorization middleware

// Check if user is logged in
exports.requireAuth = (req, res, next) => {
    // Check session first
    if (req.session.userId) {
        return next();
    }
    
    // Fallback to Authorization header for Safari mobile (session cookies blocked)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const userData = JSON.parse(Buffer.from(token, 'base64').toString());
            if (userData.id && userData.loginTime) {
                // Validate token age (24 hours)
                const tokenAge = Date.now() - userData.loginTime;
                if (tokenAge < 86400000) {
                    req.session.userId = userData.id;
                    return next();
                }
            }
        } catch (error) {
            console.error('Token parsing error:', error);
        }
    }
    
    return res.status(401).json({
        success: false,
        message: 'Authentication required'
    });
};

// Check if user has admin role
exports.requireAdmin = async (req, res, next) => {
    try {
        let userId = req.session.userId;
        
        // Fallback to Authorization header for Safari mobile
        if (!userId) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
                    if (userData.id && userData.loginTime) {
                        const tokenAge = Date.now() - userData.loginTime;
                        if (tokenAge < 86400000) {
                            userId = userData.id;
                        }
                    }
                } catch (error) {
                    console.error('Token parsing error:', error);
                }
            }
        }
        
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
        let userId = req.session.userId;
        
        // Fallback to Authorization header for Safari mobile
        if (!userId) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
                    if (userData.id && userData.loginTime) {
                        const tokenAge = Date.now() - userData.loginTime;
                        if (tokenAge < 86400000) {
                            userId = userData.id;
                        }
                    }
                } catch (error) {
                    console.error('Token parsing error:', error);
                }
            }
        }
        
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
