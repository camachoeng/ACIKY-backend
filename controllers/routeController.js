const routeService = require('../services/routeService');

/**
 * Route Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get all routes (public)
exports.getAllRoutes = async (req, res) => {
    try {
        const { status } = req.query;
        const routes = await routeService.getAllRoutes(status);

        res.json({
            success: true,
            data: routes
        });

    } catch (error) {
        console.error('Get all routes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch routes'
        });
    }
};

// Get single route
exports.getRouteById = async (req, res) => {
    try {
        const { id } = req.params;
        const route = await routeService.getRouteById(id);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }

        res.json({
            success: true,
            data: route
        });

    } catch (error) {
        console.error('Get route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch route'
        });
    }
};

// Create route (admin only)
exports.createRoute = async (req, res) => {
    try {
        const routeId = await routeService.createRoute(req.body);

        res.status(201).json({
            success: true,
            message: 'Route created successfully',
            data: { id: routeId }
        });

    } catch (error) {
        if (error.message === 'Name, origin, and destination are required') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Create route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create route'
        });
    }
};

// Update route (admin only)
exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await routeService.updateRoute(id, req.body);

        if (updated === null) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }

        res.json({
            success: true,
            message: 'Route updated successfully'
        });

    } catch (error) {
        if (error.message === 'No valid fields to update') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Update route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update route'
        });
    }
};

// Delete route (admin only)
exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await routeService.deleteRoute(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }

        res.json({
            success: true,
            message: 'Route deleted successfully'
        });

    } catch (error) {
        console.error('Delete route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete route'
        });
    }
};
