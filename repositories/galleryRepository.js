const db = require('../config/database');

/**
 * Gallery Repository - Database access layer
 * All SQL queries for gallery images are centralized here
 */

class GalleryRepository {
    /**
     * Find all visible gallery images
     */
    async findAllVisible() {
        const [images] = await db.query(
            `SELECT id, title, description, image_url, thumbnail_url, category, alt_text, display_order, created_at
             FROM gallery
             WHERE visible = 1
             ORDER BY category ASC, display_order ASC, created_at DESC`
        );
        return images;
    }

    /**
     * Find all gallery images (admin)
     */
    async findAll(category = null) {
        let query = `SELECT id, title, description, image_url, thumbnail_url, category, alt_text,
                            display_order, visible, uploaded_by, created_at
                     FROM gallery`;
        const params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        query += ' ORDER BY category, display_order ASC, created_at DESC';

        const [images] = await db.query(query, params);
        return images;
    }

    /**
     * Create new gallery image
     */
    async create({ title, description, image_url, thumbnail_url, category, alt_text, display_order, uploaded_by }) {
        const [result] = await db.query(
            `INSERT INTO gallery (title, description, image_url, thumbnail_url, category, alt_text, display_order, visible, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [title, description, image_url, thumbnail_url, category, alt_text, display_order, uploaded_by]
        );
        return result.insertId;
    }

    /**
     * Update gallery image
     */
    async update(id, { title, description, image_url, thumbnail_url, category, alt_text, display_order, visible }) {
        const [result] = await db.query(
            `UPDATE gallery
             SET title = ?, description = ?, image_url = ?, thumbnail_url = ?, category = ?,
                 alt_text = ?, display_order = ?, visible = ?
             WHERE id = ?`,
            [title, description, image_url, thumbnail_url, category, alt_text, display_order, visible, id]
        );
        return result.affectedRows;
    }

    /**
     * Delete gallery image
     */
    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM gallery WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = new GalleryRepository();
