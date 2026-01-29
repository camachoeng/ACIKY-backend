const galleryService = require('../services/galleryService');

/**
 * Gallery Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get all gallery images for gallery page (only visible, all categories)
exports.getAllImages = async (req, res) => {
    try {
        const images = await galleryService.getAllVisibleImages();

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
        const images = await galleryService.getAllImages(category);

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
        const imageId = await galleryService.createImage(req.body, req.session.userId);

        res.status(201).json({
            success: true,
            message: 'Gallery image created successfully',
            imageId
        });

    } catch (error) {
        if (error.message === 'Title, image URL, and category are required' ||
            error.message === 'Invalid category. Must be "posturas" or "mudras"' ||
            error.message === 'Invalid image URL') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

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
        const updated = await galleryService.updateImage(id, req.body);

        if (!updated) {
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
        if (error.message === 'Invalid category. Must be "posturas" or "mudras"' ||
            error.message === 'Invalid image URL') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

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
        const deleted = await galleryService.deleteImage(id);

        if (!deleted) {
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
