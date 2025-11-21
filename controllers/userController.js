const db = require('../config/database');

// Get all instructors for assignment to activities
exports.getAllInstructors = async (req, res) => {
    try {
        const [instructors] = await db.query(
            `SELECT id, username, email, role 
             FROM users 
             WHERE role IN ('instructor') 
             ORDER BY username ASC`
        );

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
        console.error('Get all users error:', error);
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
        const validRoles = ['user', 'instructor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be: user, instructor, or admin'
            });
        }

        // Prevent user from changing their own role
        if (parseInt(id) === req.session.userId) {
            return res.status(403).json({
                success: false,
                message: 'Cannot change your own role'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );

        if (result.affectedRows === 0) {
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
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role'
        });
    }
};

