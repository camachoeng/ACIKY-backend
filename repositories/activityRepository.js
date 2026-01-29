const db = require('../config/database');

/**
 * Activity Repository - Database access layer
 * All SQL queries for activities are centralized here
 */

class ActivityRepository {
    /**
     * Find all activities with filters
     */
    async findAll({ active, featured, difficulty_level, limit, offset }) {
        let query = `
            SELECT
                a.*,
                u.username as instructor_name,
                u.email as instructor_email
            FROM activities a
            LEFT JOIN users u ON a.instructor_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (active === 'true' || active === true) {
            query += ' AND a.active = true';
        }

        if (featured !== undefined) {
            query += ' AND a.featured = ?';
            params.push(featured === 'true' || featured === true);
        }

        if (difficulty_level) {
            query += ' AND a.difficulty_level = ?';
            params.push(difficulty_level);
        }

        query += ' ORDER BY a.featured DESC, a.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [activities] = await db.query(query, params);
        return activities;
    }

    /**
     * Find activity by ID with instructor info
     */
    async findById(id) {
        const [activities] = await db.query(`
            SELECT
                a.*,
                u.username as instructor_name,
                u.email as instructor_email,
                u.bio as instructor_bio
            FROM activities a
            LEFT JOIN users u ON a.instructor_id = u.id
            WHERE a.id = ?
        `, [id]);

        return activities[0] || null;
    }

    /**
     * Create activity
     */
    async create({
        name,
        description,
        short_description,
        schedule,
        duration,
        location,
        instructor_id,
        price,
        icon,
        difficulty_level,
        active,
        featured
    }) {
        const [result] = await db.query(`
            INSERT INTO activities
            (name, description, short_description, schedule, duration, location,
             instructor_id, price, icon, difficulty_level, active, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name,
            description,
            short_description,
            schedule,
            duration,
            location,
            instructor_id,
            price,
            icon,
            difficulty_level,
            active,
            featured
        ]);

        return result.insertId;
    }

    /**
     * Check if activity exists
     */
    async exists(id) {
        const [activities] = await db.query(
            'SELECT id FROM activities WHERE id = ?',
            [id]
        );
        return activities.length > 0;
    }

    /**
     * Update activity
     */
    async update(id, fields, values) {
        if (fields.length === 0) return 0;

        values.push(id);
        const [result] = await db.query(
            `UPDATE activities SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows;
    }

    /**
     * Delete activity
     */
    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM activities WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = new ActivityRepository();
