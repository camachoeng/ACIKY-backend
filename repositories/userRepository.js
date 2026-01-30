const db = require('../config/database');

/**
 * User Repository - Database access layer for users
 */

class UserRepository {
    /**
     * Find user by email
     */
    async findByEmail(email) {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return users[0] || null;
    }

    /**
     * Find user by username
     */
    async findByUsername(username) {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return users[0] || null;
    }

    /**
     * Find user by ID
     */
    async findById(id) {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return users[0] || null;
    }

    /**
     * Find user by email or username
     */
    async findByEmailOrUsername(email, username) {
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        return users;
    }

    /**
     * Find user by email or username excluding a specific user ID
     */
    async findByEmailOrUsernameExcludingId(email, username, excludeId) {
        const [users] = await db.query(
            'SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?',
            [email, username, excludeId]
        );
        return users;
    }

    /**
     * Find all users
     */
    async findAll({ role, limit = 50, offset = 0 }) {
        let query = 'SELECT id, username, email, role, created_at FROM users WHERE 1=1';
        const params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [users] = await db.query(query, params);
        return users;
    }

    /**
     * Count users
     */
    async count({ role }) {
        let query = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
        const params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        const [result] = await db.query(query, params);
        return result[0].count;
    }

    /**
     * Create new user
     */
    async create({ username, email, password, role = 'user' }) {
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role]
        );
        return result.insertId;
    }

    /**
     * Update user
     */
    async update(id, fields) {
        const updateFields = [];
        const updateValues = [];

        const allowedFields = ['username', 'email', 'password', 'role'];

        allowedFields.forEach(field => {
            if (fields[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(fields[field]);
            }
        });

        if (updateFields.length === 0) return;

        updateValues.push(id);
        await db.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
    }

    /**
     * Delete user
     */
    async delete(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = new UserRepository();
