const db = require('../config/database');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const [teachers] = await db.query(
            `SELECT id, username, email, role 
             FROM users 
             WHERE role IN ('teacher', 'admin', 'instructor') 
             ORDER BY username ASC`
        );

        res.json({
            success: true,
            data: teachers
        });

    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching teachers'
        });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, username, email, role, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        const validRoles = ['user', 'teacher', 'instructor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        await db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );

        res.json({
            success: true,
            message: 'User role updated successfully'
        });

    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role'
        });
    }
};
