const db = require('../config/database');

/**
 * Space Repository - Database access layer
 * All SQL queries for spaces are centralized here
 */

class SpaceRepository {
    /**
     * Find all spaces with filters
     */
    async findAll({ active = true, limit = 20, offset = 0 }) {
        let query = `
            SELECT s.*
            FROM spaces s
            WHERE 1=1
        `;
        const params = [];

        if (active === 'true' || active === true) {
            query += ' AND s.active = true';
        }

        query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [spaces] = await db.query(query, params);
        return spaces;
    }

    /**
     * Find space by ID
     */
    async findById(id) {
        const [spaces] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        return spaces[0] || null;
    }

    /**
     * Batch load instructors for multiple spaces
     */
    async findInstructorsBySpaceIds(spaceIds) {
        if (!spaceIds || spaceIds.length === 0) return [];

        const [instructorsData] = await db.query(`
            SELECT si.space_id, u.id, u.username, u.email
            FROM users u
            INNER JOIN spaces_instructors si ON u.id = si.user_id
            WHERE si.space_id IN (?) AND u.role = 'instructor'
        `, [spaceIds]);

        return instructorsData;
    }

    /**
     * Find instructors for a single space
     */
    async findInstructorsBySpaceId(spaceId) {
        const [instructors] = await db.query(`
            SELECT u.id, u.username, u.email
            FROM users u
            INNER JOIN spaces_instructors si ON u.id = si.user_id
            WHERE si.space_id = ? AND u.role = 'instructor'
        `, [spaceId]);

        return instructors;
    }

    /**
     * Batch load disciplines for multiple spaces
     */
    async findDisciplinesBySpaceIds(spaceIds) {
        if (!spaceIds || spaceIds.length === 0) return [];

        const [disciplinesData] = await db.query(`
            SELECT space_id, discipline_name
            FROM spaces_disciplines
            WHERE space_id IN (?)
        `, [spaceIds]);

        return disciplinesData;
    }

    /**
     * Find disciplines for a single space
     */
    async findDisciplinesBySpaceId(spaceId) {
        const [disciplines] = await db.query(`
            SELECT discipline_name
            FROM spaces_disciplines
            WHERE space_id = ?
        `, [spaceId]);

        return disciplines.map(d => d.discipline_name);
    }

    /**
     * Create a new space
     */
    async create({ name, image, address, phone, email, location }) {
        const [result] = await db.query(
            `INSERT INTO spaces (name, image, address, phone, email, location)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, image, address, phone, email, location]
        );

        return result.insertId;
    }

    /**
     * Update space
     */
    async update(id, fields) {
        const updateFields = [];
        const updateValues = [];

        const allowedFields = ['name', 'image', 'address', 'phone', 'email', 'location', 'active'];

        allowedFields.forEach(field => {
            if (fields[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                updateValues.push(fields[field]);
            }
        });

        if (updateFields.length === 0) return;

        updateValues.push(id);
        await db.query(
            `UPDATE spaces SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
    }

    /**
     * Delete space by ID
     */
    async delete(id) {
        await db.query('DELETE FROM spaces WHERE id = ?', [id]);
    }

    /**
     * Add instructors to space
     */
    async addInstructors(spaceId, instructorIds) {
        if (!instructorIds || instructorIds.length === 0) return;

        for (let userId of instructorIds) {
            await db.query(
                'INSERT INTO spaces_instructors (space_id, user_id) VALUES (?, ?)',
                [spaceId, userId]
            );
        }
    }

    /**
     * Remove all instructors from space
     */
    async removeAllInstructors(spaceId) {
        await db.query('DELETE FROM spaces_instructors WHERE space_id = ?', [spaceId]);
    }

    /**
     * Add instructor to space
     */
    async addInstructor(spaceId, userId) {
        await db.query(
            'INSERT INTO spaces_instructors (space_id, user_id) VALUES (?, ?)',
            [spaceId, userId]
        );
    }

    /**
     * Remove instructor from space
     */
    async removeInstructor(spaceId, userId) {
        await db.query(
            'DELETE FROM spaces_instructors WHERE space_id = ? AND user_id = ?',
            [spaceId, userId]
        );
    }

    /**
     * Add disciplines to space
     */
    async addDisciplines(spaceId, disciplines) {
        if (!disciplines || disciplines.length === 0) return;

        for (let discipline of disciplines) {
            await db.query(
                'INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES (?, ?)',
                [spaceId, discipline]
            );
        }
    }

    /**
     * Remove all disciplines from space
     */
    async removeAllDisciplines(spaceId) {
        await db.query('DELETE FROM spaces_disciplines WHERE space_id = ?', [spaceId]);
    }

    /**
     * Check if user is an instructor
     */
    async isUserInstructor(userId) {
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ? AND role = "instructor"',
            [userId]
        );
        return users.length > 0;
    }
}

module.exports = new SpaceRepository();
