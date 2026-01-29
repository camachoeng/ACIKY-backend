const db = require('../config/database');

/**
 * Testimonial Repository - Database access layer
 * All SQL queries for testimonials are centralized here
 */

class TestimonialRepository {
    /**
     * Create new testimonial
     */
    async create({ author_name, location, content, rating, activity_id }) {
        const [result] = await db.query(
            'INSERT INTO testimonials (author_name, location, content, rating, activity_id, approved, featured) VALUES (?, ?, ?, ?, ?, 0, 0)',
            [author_name, location, content, rating, activity_id]
        );
        return result.insertId;
    }

    /**
     * Find all approved testimonials with activity names
     */
    async findAllApproved() {
        const [testimonials] = await db.query(
            `SELECT t.id, t.author_name, t.location, t.content, t.rating, t.featured, t.created_at,
                    a.name as activity_name
             FROM testimonials t
             LEFT JOIN activities a ON t.activity_id = a.id
             WHERE t.approved = 1
             ORDER BY t.featured DESC, t.created_at DESC`
        );
        return testimonials;
    }

    /**
     * Find all testimonials (admin)
     */
    async findAll() {
        const [testimonials] = await db.query(
            `SELECT t.*, a.name as activity_name
             FROM testimonials t
             LEFT JOIN activities a ON t.activity_id = a.id
             ORDER BY t.created_at DESC`
        );
        return testimonials;
    }

    /**
     * Update testimonial approval status
     */
    async updateApprovalStatus(id, approved) {
        const [result] = await db.query(
            'UPDATE testimonials SET approved = ? WHERE id = ?',
            [approved, id]
        );
        return result.affectedRows;
    }

    /**
     * Toggle featured status
     */
    async toggleFeatured(id) {
        const [result] = await db.query(
            'UPDATE testimonials SET featured = NOT featured WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    /**
     * Delete testimonial
     */
    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM testimonials WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = new TestimonialRepository();
