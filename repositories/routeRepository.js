const db = require('../config/database');

/**
 * Route Repository - Database access layer
 * All SQL queries for routes are centralized here
 */

class RouteRepository {
    /**
     * Find all routes with optional status filter
     */
    async findAll(status = null) {
        let query = 'SELECT * FROM routes WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const [routes] = await db.query(query, params);
        return routes;
    }

    /**
     * Find route by ID
     */
    async findById(id) {
        const [routes] = await db.query(
            'SELECT * FROM routes WHERE id = ?',
            [id]
        );
        return routes[0] || null;
    }

    /**
     * Create route
     */
    async create({
        name,
        origin,
        destination,
        description,
        frequency,
        status,
        participants_count,
        spaces_established
    }) {
        const [result] = await db.query(`
            INSERT INTO routes
            (name, origin, destination, description, frequency, status,
             participants_count, spaces_established)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name,
            origin,
            destination,
            description,
            frequency,
            status,
            participants_count,
            spaces_established
        ]);

        return result.insertId;
    }

    /**
     * Check if route exists
     */
    async exists(id) {
        const [routes] = await db.query(
            'SELECT id FROM routes WHERE id = ?',
            [id]
        );
        return routes.length > 0;
    }

    /**
     * Update route
     */
    async update(id, fields, values) {
        if (fields.length === 0) return 0;

        values.push(id);
        const [result] = await db.query(
            `UPDATE routes SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows;
    }

    /**
     * Delete route
     */
    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM routes WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = new RouteRepository();
