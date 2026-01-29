const blogRepository = require('../repositories/blogRepository');

/**
 * Blog Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class BlogService {
    /**
     * Get all blog posts with filters
     */
    async getAllPosts(filters) {
        const { published = true, category, limit = 10, offset = 0 } = filters;
        return await blogRepository.findAll({ published, category, limit, offset });
    }

    /**
     * Get single blog post by slug and increment views
     */
    async getPostBySlug(slug) {
        const post = await blogRepository.findBySlug(slug);

        if (!post) {
            return null;
        }

        // Increment view counter
        await blogRepository.incrementViews(post.id);

        return post;
    }

    /**
     * Create blog post
     */
    async createPost(data, authorId) {
        const { title, slug, content, excerpt, category, tags, featured_image, published } = data;

        // Validation
        if (!title || !slug || !content) {
            throw new Error('Title, slug, and content are required');
        }

        // Check if slug already exists
        const slugExists = await blogRepository.slugExists(slug);
        if (slugExists) {
            throw new Error('Slug already exists');
        }

        const postId = await blogRepository.create({
            title,
            slug,
            content,
            excerpt: excerpt || null,
            category: category || null,
            tags: tags || null,
            featured_image: featured_image || null,
            published: published || false,
            author_id: authorId
        });

        return postId;
    }

    /**
     * Update blog post
     */
    async updatePost(id, data) {
        const { title, slug, content, excerpt, category, tags, featured_image, published } = data;

        // Check if post exists
        const existing = await blogRepository.findById(id);
        if (!existing) {
            return null;
        }

        // Update published_at if changing from unpublished to published
        const wasUnpublished = !existing.published;
        const nowPublished = published === true || published === 'true';
        const shouldUpdatePublishedAt = wasUnpublished && nowPublished;

        await blogRepository.update(id, {
            title,
            slug,
            content,
            excerpt,
            category,
            tags,
            featured_image,
            published,
            shouldUpdatePublishedAt
        });

        return true;
    }

    /**
     * Delete blog post
     */
    async deletePost(id) {
        const affectedRows = await blogRepository.delete(id);
        return affectedRows > 0;
    }
}

module.exports = new BlogService();
