const bcrypt = require('bcrypt');
const db = require('../config/database');

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.role = user.role;

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
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
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated' 
            });
        }

        const { username, email, currentPassword, newPassword } = req.body;

        // Validation
        if (!username || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and email are required' 
            });
        }

        // Check if new username/email already exists (excluding current user)
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?',
            [email, username, userId]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username or email already in use' 
            });
        }

        // If user wants to change password, verify current password first
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Current password is required to set a new password' 
                });
            }

            // Get current user data
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
            
            if (users.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            const user = users[0];

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Current password is incorrect' 
                });
            }

            // Hash new password and update
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.query(
                'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
                [username, email, hashedPassword, userId]
            );
        } else {
            // Update without password change
            await db.query(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [username, email, userId]
            );
        }

        // Update session data
        req.session.username = username;
        req.session.email = email;

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: {
                id: userId,
                username: username,
                email: email,
                role: req.session.role
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during profile update' 
        });
    }
};
