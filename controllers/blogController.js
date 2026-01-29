const blogService = require('../services/blogService');

/**
 * Blog Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get all blog posts (public)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await blogService.getAllPosts(req.query);

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
        const post = await blogService.getPostBySlug(slug);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            data: post
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
        const postId = await blogService.createPost(req.body, req.session.userId);

        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: { id: postId }
        });

    } catch (error) {
        if (error.message === 'Title, slug, and content are required' ||
            error.message === 'Slug already exists') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

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
        const updated = await blogService.updatePost(id, req.body);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

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
        const deleted = await blogService.deletePost(id);

        if (!deleted) {
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
