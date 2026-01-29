const testimonialService = require('../services/testimonialService');

/**
 * Testimonial Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Create new testimonial (public)
exports.createTestimonial = async (req, res) => {
    try {
        const testimonialId = await testimonialService.createTestimonial(req.body);

        res.status(201).json({
            success: true,
            message: 'Testimonial submitted successfully. It will be reviewed before publication.',
            testimonialId
        });

    } catch (error) {
        if (error.message === 'Name, content and rating are required' ||
            error.message === 'Rating must be between 1 and 5') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Create testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating testimonial'
        });
    }
};

// Get all approved testimonials (public)
exports.getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await testimonialService.getApprovedTestimonials();

        res.json({
            success: true,
            data: testimonials
        });

    } catch (error) {
        console.error('Get approved testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching testimonials'
        });
    }
};

// Get all testimonials (admin only)
exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await testimonialService.getAllTestimonials();

        res.json({
            success: true,
            data: testimonials
        });

    } catch (error) {
        console.error('Get all testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching testimonials'
        });
    }
};

// Update testimonial approval status (admin only)
exports.updateTestimonialStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved } = req.body;

        const updated = await testimonialService.updateApprovalStatus(id, approved);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            message: 'Testimonial status updated successfully'
        });

    } catch (error) {
        if (error.message === 'Invalid status. Must be 0 (rejected) or 1 (approved)') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Update testimonial status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating testimonial'
        });
    }
};

// Toggle featured status (admin only)
exports.toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        const toggled = await testimonialService.toggleFeatured(id);

        if (!toggled) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            message: 'Featured status updated successfully'
        });

    } catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating testimonial'
        });
    }
};

// Delete testimonial (admin only)
exports.deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await testimonialService.deleteTestimonial(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        res.json({
            success: true,
            message: 'Testimonial deleted successfully'
        });

    } catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting testimonial'
        });
    }
};
