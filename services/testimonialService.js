const testimonialRepository = require('../repositories/testimonialRepository');
const { sanitizeText } = require('../utils/sanitize');

/**
 * Testimonial Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class TestimonialService {
    /**
     * Create new testimonial (public submission)
     */
    async createTestimonial(data) {
        const { author_name, location, content, rating, activity_id } = data;

        // Validation
        if (!author_name || !content || !rating) {
            throw new Error('Name, content and rating are required');
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        // Sanitize inputs to prevent XSS
        const sanitizedAuthorName = sanitizeText(author_name);
        const sanitizedLocation = location ? sanitizeText(location) : null;
        const sanitizedContent = sanitizeText(content);

        const testimonialId = await testimonialRepository.create({
            author_name: sanitizedAuthorName,
            location: sanitizedLocation,
            content: sanitizedContent,
            rating,
            activity_id: activity_id || null
        });

        return testimonialId;
    }

    /**
     * Get all approved testimonials (public)
     */
    async getApprovedTestimonials() {
        return await testimonialRepository.findAllApproved();
    }

    /**
     * Get all testimonials (admin)
     */
    async getAllTestimonials() {
        return await testimonialRepository.findAll();
    }

    /**
     * Update testimonial approval status (admin)
     */
    async updateApprovalStatus(id, approved) {
        // Validation - approved should be 0 or 1
        if (approved !== 0 && approved !== 1) {
            throw new Error('Invalid status. Must be 0 (rejected) or 1 (approved)');
        }

        const affectedRows = await testimonialRepository.updateApprovalStatus(id, approved);
        return affectedRows > 0;
    }

    /**
     * Toggle featured status (admin)
     */
    async toggleFeatured(id) {
        const affectedRows = await testimonialRepository.toggleFeatured(id);
        return affectedRows > 0;
    }

    /**
     * Delete testimonial (admin)
     */
    async deleteTestimonial(id) {
        const affectedRows = await testimonialRepository.delete(id);
        return affectedRows > 0;
    }
}

module.exports = new TestimonialService();
