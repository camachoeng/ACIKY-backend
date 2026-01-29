const spaceService = require('../services/spaceService');

/**
 * Space Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get all spaces (public)
exports.getAllSpaces = async (req, res) => {
    try {
        const filters = {
            active: req.query.active,
            limit: req.query.limit,
            offset: req.query.offset
        };

        const spaces = await spaceService.getAllSpaces(filters);

        res.json({
            success: true,
            data: spaces
        });

    } catch (error) {
        console.error('Get all spaces error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving spaces'
        });
    }
};

// Get single space by ID (public)
exports.getSpaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const space = await spaceService.getSpaceById(id);

        if (!space) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        res.json({
            success: true,
            data: space
        });

    } catch (error) {
        console.error('Get space by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving space'
        });
    }
};

// Create new space (admin only)
exports.createSpace = async (req, res) => {
    try {
        const space = await spaceService.createSpace(req.body);

        res.status(201).json({
            success: true,
            message: 'Space created successfully',
            data: space
        });

    } catch (error) {
        if (error.message === 'Space name is required') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Create space error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating space'
        });
    }
};

// Update space (admin only)
exports.updateSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const space = await spaceService.updateSpace(id, req.body);

        if (!space) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        res.json({
            success: true,
            message: 'Space updated successfully',
            data: space
        });

    } catch (error) {
        console.error('Update space error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating space'
        });
    }
};

// Delete space (admin only)
exports.deleteSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await spaceService.deleteSpace(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        res.json({
            success: true,
            message: 'Space deleted successfully'
        });

    } catch (error) {
        console.error('Delete space error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting space'
        });
    }
};

// Add instructor to space (admin only)
exports.addInstructor = async (req, res) => {
    try {
        const { spaceId, userId } = req.body;
        await spaceService.addInstructorToSpace(spaceId, userId);

        res.json({
            success: true,
            message: 'Instructor added to space successfully'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Instructor already assigned to this space'
            });
        }

        if (error.message === 'Space ID and User ID are required' ||
            error.message === 'User is not an instructor') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Add instructor to space error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding instructor to space'
        });
    }
};

// Remove instructor from space (admin only)
exports.removeInstructor = async (req, res) => {
    try {
        const { spaceId, userId } = req.body;
        await spaceService.removeInstructorFromSpace(spaceId, userId);

        res.json({
            success: true,
            message: 'Instructor removed from space successfully'
        });

    } catch (error) {
        if (error.message === 'Space ID and User ID are required') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Remove instructor from space error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing instructor from space'
        });
    }
};
