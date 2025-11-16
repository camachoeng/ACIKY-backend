const db = require('../config/database');

// Get all blog posts (public)
exports.getAllPosts = async (req, res) => {
    try {
        const { category, published = true, limit = 10, offset = 0 } = req.query;

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

        res.json({
            success: true,
            data: posts,
            total: posts.length
        });

    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog posts'
        });
    }
};

// Get single blog post by slug (public)
exports.getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [posts] = await db.query(`
            SELECT 
                bp.*,
                u.username as author_name,
                u.bio as author_bio
            FROM blog_posts bp
            LEFT JOIN users u ON bp.author_id = u.id
            WHERE bp.slug = ?
        `, [slug]);

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Increment view counter
        await db.query(
            'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
            [posts[0].id]
        );

        res.json({
            success: true,
            data: posts[0]
        });

    } catch (error) {
        console.error('Get post by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog post'
        });
    }
};

// Create blog post (admin only)
exports.createPost = async (req, res) => {
    try {
        const {
            title,
            slug,
            content,
            excerpt,
            category,
            tags,
            featured_image,
            published
        } = req.body;

        // Validation
        if (!title || !slug || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title, slug, and content are required'
            });
        }

        // Check if slug already exists
        const [existing] = await db.query(
            'SELECT id FROM blog_posts WHERE slug = ?',
            [slug]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Slug already exists'
            });
        }

        const [result] = await db.query(`
            INSERT INTO blog_posts 
            (title, slug, content, excerpt, category, tags, featured_image, published, author_id, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title,
            slug,
            content,
            excerpt || null,
            category || null,
            tags || null,
            featured_image || null,
            published || false,
            req.session.userId,
            published ? new Date() : null
        ]);

        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: { id: result.insertId }
        });

    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create blog post'
        });
    }
};

// Update blog post (admin only)
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            slug,
            content,
            excerpt,
            category,
            tags,
            featured_image,
            published
        } = req.body;

        // Check if post exists
        const [existing] = await db.query(
            'SELECT id, published FROM blog_posts WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Update published_at if changing from unpublished to published
        const wasUnpublished = !existing[0].published;
        const nowPublished = published === true || published === 'true';
        const shouldUpdatePublishedAt = wasUnpublished && nowPublished;

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

        res.json({
            success: true,
            message: 'Blog post updated successfully'
        });

    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update blog post'
        });
    }
};

// Delete blog post (admin only)
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM blog_posts WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog post deleted successfully'
        });

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog post'
        });
    }
};
