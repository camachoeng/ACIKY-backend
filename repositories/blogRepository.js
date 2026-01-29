const db = require('../config/database');

/**
 * Blog Repository - Database access layer
 * All SQL queries for blog posts are centralized here
 */

class BlogRepository {
    /**
     * Find all blog posts with filters
     */
    async findAll({ published, category, limit, offset }) {
        let query = `
            SELECT
                bp.*,
                u.username as author_name
            FROM blog_posts bp
            LEFT JOIN users u ON bp.author_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (published === 'true' || published === true) {
            query += ' AND bp.published = true';
        }

        if (category) {
            query += ' AND bp.category = ?';
            params.push(category);
        }

        query += ' ORDER BY bp.published_at DESC, bp.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [posts] = await db.query(query, params);
        return posts;
    }

    /**
     * Find blog post by slug
     */
    async findBySlug(slug) {
        const [posts] = await db.query(`
            SELECT
                bp.*,
                u.username as author_name,
                u.bio as author_bio
            FROM blog_posts bp
            LEFT JOIN users u ON bp.author_id = u.id
            WHERE bp.slug = ?
        `, [slug]);

        return posts[0] || null;
    }

    /**
     * Check if slug exists
     */
    async slugExists(slug) {
        const [existing] = await db.query(
            'SELECT id FROM blog_posts WHERE slug = ?',
            [slug]
        );
        return existing.length > 0;
    }

    /**
     * Increment view counter
     */
    async incrementViews(id) {
        await db.query(
            'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
            [id]
        );
    }

    /**
     * Create blog post
     */
    async create({ title, slug, content, excerpt, category, tags, featured_image, published, author_id }) {
        const [result] = await db.query(`
            INSERT INTO blog_posts
            (title, slug, content, excerpt, category, tags, featured_image, published, author_id, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            slug,
            content,
            excerpt,
            category,
            tags,
            featured_image,
            published,
            author_id,
            published ? new Date() : null
        ]);

        return result.insertId;
    }

    /**
     * Find post by ID
     */
    async findById(id) {
        const [posts] = await db.query(
            'SELECT id, published FROM blog_posts WHERE id = ?',
            [id]
        );
        return posts[0] || null;
    }

    /**
     * Update blog post
     */
    async update(id, { title, slug, content, excerpt, category, tags, featured_image, published, shouldUpdatePublishedAt }) {
        const [result] = await db.query(`
            UPDATE blog_posts
            SET
                title = COALESCE(?, title),
                slug = COALESCE(?, slug),
                content = COALESCE(?, content),
                excerpt = COALESCE(?, excerpt),
                category = COALESCE(?, category),
                tags = COALESCE(?, tags),
                featured_image = COALESCE(?, featured_image),
                published = COALESCE(?, published),
                published_at = CASE
                    WHEN ? THEN NOW()
                    ELSE published_at
                END
            WHERE id = ?
        `, [
            title,
            slug,
            content,
            excerpt,
            category,
            tags,
            featured_image,
            published,
            shouldUpdatePublishedAt,
            id
        ]);

        return result.affectedRows;
    }

    /**
     * Delete blog post
     */
    async delete(id) {
        const [result] = await db.query(
            'DELETE FROM blog_posts WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = new BlogRepository();
