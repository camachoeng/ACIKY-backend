const db = require('../config/database');
const bcrypt = require('bcrypt');

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

// Get single user by ID (admin only)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
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
        const { username, email, password, role = 'user' } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        // Validate role
        const validRoles = ['user', 'instructor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be: user, instructor, or admin'
            });
        }

        // Check if email already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: result.insertId,
                username,
                email,
                role
            }
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;

        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from changing their own role to non-admin
        if (parseInt(id) === req.session.userId && role && role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot change your own admin role'
            });
        }

        const updateFields = [];
        const updateValues = [];

        if (username !== undefined) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }
        if (email !== undefined) {
            // Check if new email is already taken by another user
            const [emailCheck] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, id]
            );
            if (emailCheck.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use by another user'
                });
            }
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (password !== undefined && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }
        if (role !== undefined) {
            const validRoles = ['user', 'instructor', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role'
                });
            }
            updateFields.push('role = ?');
            updateValues.push(role);
        }

        if (updateFields.length > 0) {
            updateValues.push(id);
            await db.query(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        // Get updated user
        const [updatedUser] = await db.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser[0]
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (parseInt(id) === req.session.userId) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};
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

