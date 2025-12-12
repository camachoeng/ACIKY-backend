const db = require('../config/database');

// Create new testimonial (public)
exports.createTestimonial = async (req, res) => {
    try {
        const { user_name, email, message, rating } = req.body;

        // Validation
        if (!user_name || !email || !message || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Insert testimonial with pending status
        const [result] = await db.query(
            'INSERT INTO testimonials (user_name, email, message, rating, status) VALUES (?, ?, ?, ?, ?)',
            [user_name, email, message, rating, 'pending']
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
            'SELECT id, user_name, message, rating, created_at FROM testimonials WHERE status = ? ORDER BY created_at DESC',
            ['approved']
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
            'SELECT * FROM testimonials ORDER BY created_at DESC'
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

// Update testimonial status (admin only)
exports.updateTestimonialStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validation
        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status. Must be: pending, approved, or rejected' 
            });
        }

        const [result] = await db.query(
            'UPDATE testimonials SET status = ? WHERE id = ?',
            [status, id]
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
