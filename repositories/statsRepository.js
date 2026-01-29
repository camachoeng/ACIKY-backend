const db = require('../config/database');

/**
 * Stats Repository - Database access layer
 * All SQL queries for statistics are centralized here
 */

class StatsRepository {
    /**
     * Get total count of users by role
     */
    async countUsersByRole(role) {
        const [result] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            [role]
        );
        return result[0].count;
    }

    /**
     * Get count of unique locations from activities
     */
    async countUniqueActiveLocations() {
        const [result] = await db.query(
            'SELECT COUNT(DISTINCT location) as count FROM activities WHERE active = 1 AND location IS NOT NULL'
        );
        return result[0].count;
    }

    /**
     * Get all active activities with creation dates
     */
    async findAllActiveActivities() {
        const [activities] = await db.query(
            'SELECT created_at FROM activities WHERE active = 1'
        );
        return activities;
    }
}

module.exports = new StatsRepository();
