const db = require('../config/database');

// Create new testimonial (public)
exports.createTestimonial = async (req, res) => {
    try {
        const { author_name, location, content, rating, activity_id } = req.body;

        // Validation
        if (!author_name || !content || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, content and rating are required' 
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Insert testimonial with approved=0 (pending)
        const [result] = await db.query(
            'INSERT INTO testimonials (author_name, location, content, rating, activity_id, approved, featured) VALUES (?, ?, ?, ?, ?, 0, 0)',
            [author_name, location || null, content, rating, activity_id || null]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Testimonial submitted successfully. It will be reviewed before publication.',
            testimonialId: result.insertId
        });

    } catch (error) {
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
        const [testimonials] = await db.query(
            `SELECT t.id, t.author_name, t.location, t.content, t.rating, t.featured, t.created_at, 
                    a.name as activity_name
             FROM testimonials t
             LEFT JOIN activities a ON t.activity_id = a.id
             WHERE t.approved = 1 
             ORDER BY t.featured DESC, t.created_at DESC`
        );

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
        const [testimonials] = await db.query(
            `SELECT t.*, a.name as activity_name
             FROM testimonials t
             LEFT JOIN activities a ON t.activity_id = a.id
             ORDER BY t.created_at DESC`
        );

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

        // Validation - approved should be 0 or 1
        if (approved !== 0 && approved !== 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status. Must be 0 (rejected) or 1 (approved)' 
            });
        }

        const [result] = await db.query(
            'UPDATE testimonials SET approved = ? WHERE id = ?',
            [approved, id]
        );

        if (result.affectedRows === 0) {
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

        const [result] = await db.query(
            'UPDATE testimonials SET featured = NOT featured WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
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

        const [result] = await db.query(
            'DELETE FROM testimonials WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
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
