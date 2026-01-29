const galleryRepository = require('../repositories/galleryRepository');
const { sanitizeText, sanitizeUrl } = require('../utils/sanitize');

/**
 * Gallery Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class GalleryService {
    /**
     * Get all visible gallery images
     */
    async getAllVisibleImages() {
        return await galleryRepository.findAllVisible();
    }

    /**
     * Get all gallery images for admin
     */
    async getAllImages(category = null) {
        return await galleryRepository.findAll(category);
    }

    /**
     * Create new gallery image
     */
    async createImage(data, userId) {
        const { title, description, image_url, thumbnail_url, category, alt_text, display_order } = data;

        // Validation
        if (!title || !image_url || !category) {
            throw new Error('Title, image URL, and category are required');
        }

        // Validate category values
        const validCategories = ['posturas', 'mudras'];
        if (!validCategories.includes(category)) {
            throw new Error('Invalid category. Must be "posturas" or "mudras"');
        }

        // Sanitize inputs to prevent XSS
        const sanitizedTitle = sanitizeText(title);
        const sanitizedDescription = description ? sanitizeText(description) : null;
        const sanitizedImageUrl = sanitizeUrl(image_url);
        const sanitizedThumbnailUrl = thumbnail_url ? sanitizeUrl(thumbnail_url) : sanitizedImageUrl;
        const sanitizedAltText = alt_text ? sanitizeText(alt_text) : sanitizedTitle;

        // Validate sanitized URLs
        if (!sanitizedImageUrl) {
            throw new Error('Invalid image URL');
        }

        const imageId = await galleryRepository.create({
            title: sanitizedTitle,
            description: sanitizedDescription,
            image_url: sanitizedImageUrl,
            thumbnail_url: sanitizedThumbnailUrl,
            category,
            alt_text: sanitizedAltText,
            display_order: display_order || 0,
            uploaded_by: userId
        });

        return imageId;
    }

    /**
     * Update gallery image
     */
    async updateImage(id, data) {
        const { title, description, image_url, thumbnail_url, category, alt_text, display_order, visible } = data;

        // Validate category values if provided
        const validCategories = ['posturas', 'mudras'];
        if (category && !validCategories.includes(category)) {
            throw new Error('Invalid category. Must be "posturas" or "mudras"');
        }

        // Sanitize inputs to prevent XSS
        const sanitizedTitle = title ? sanitizeText(title) : title;
        const sanitizedDescription = description ? sanitizeText(description) : description;
        const sanitizedImageUrl = image_url ? sanitizeUrl(image_url) : image_url;
        const sanitizedThumbnailUrl = thumbnail_url ? sanitizeUrl(thumbnail_url) : thumbnail_url;
        const sanitizedAltText = alt_text ? sanitizeText(alt_text) : alt_text;

        // Validate sanitized URLs if provided
        if (image_url && !sanitizedImageUrl) {
            throw new Error('Invalid image URL');
        }

        const affectedRows = await galleryRepository.update(id, {
            title: sanitizedTitle,
            description: sanitizedDescription,
            image_url: sanitizedImageUrl,
            thumbnail_url: sanitizedThumbnailUrl,
            category,
            alt_text: sanitizedAltText,
            display_order,
            visible
        });

        return affectedRows > 0;
    }

    /**
     * Delete gallery image
     */
    async deleteImage(id) {
        const affectedRows = await galleryRepository.delete(id);
        return affectedRows > 0;
    }
}

module.exports = new GalleryService();
