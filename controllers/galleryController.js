const db = require('../config/database');

// Get all gallery images for gallery page (only visible, all categories)
exports.getAllImages = async (req, res) => {
    try {
        const [images] = await db.query(
            `SELECT id, title, description, image_url, thumbnail_url, category, alt_text, display_order, created_at
             FROM gallery
             WHERE visible = 1
             ORDER BY category ASC, display_order ASC, created_at DESC`
        );

        res.json({
            success: true,
            data: images
        });

    } catch (error) {
        console.error('Get gallery images error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching gallery images'
        });
    }
};

// Get all images for admin (including invisible, all categories)
exports.getAllImagesAdmin = async (req, res) => {
    try {
        const { category } = req.query;
        
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

        res.json({
            success: true,
            data: images
        });

    } catch (error) {
        console.error('Get all gallery images error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching gallery images'
        });
    }
};

// Create new gallery image
exports.createImage = async (req, res) => {
    try {
        const { title, description, image_url, thumbnail_url, category, alt_text, display_order } = req.body;

        if (!title || !image_url || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, image URL, and category are required'
            });
        }

        // Validate category values
        const validCategories = ['posturas', 'mudras'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category. Must be "posturas" or "mudras"'
            });
        }

        const [result] = await db.query(
            `INSERT INTO gallery (title, description, image_url, thumbnail_url, category, alt_text, display_order, visible, uploaded_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [title, description || null, image_url, thumbnail_url || image_url, category, alt_text || title, display_order || 0, req.session.userId]
        );

        res.status(201).json({
            success: true,
            message: 'Gallery image created successfully',
            imageId: result.insertId
        });

    } catch (error) {
        console.error('Create gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating gallery image'
        });
    }
};

// Update gallery image
exports.updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, thumbnail_url, category, alt_text, display_order, visible } = req.body;

        // Validate category values
        const validCategories = ['posturas', 'mudras'];
        if (category && !validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category. Must be "posturas" or "mudras"'
            });
        }

        const [result] = await db.query(
            `UPDATE gallery
             SET title = ?, description = ?, image_url = ?, thumbnail_url = ?, category = ?, 
                 alt_text = ?, display_order = ?, visible = ?
             WHERE id = ?`,
            [title, description, image_url, thumbnail_url, category, alt_text, display_order, visible, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery image updated successfully'
        });

    } catch (error) {
        console.error('Update gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating gallery image'
        });
    }
};

// Delete gallery image
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM gallery WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery image deleted successfully'
        });

    } catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting gallery image'
        });
    }
};
