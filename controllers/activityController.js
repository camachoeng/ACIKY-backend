const activityService = require('../services/activityService');

/**
 * Activity Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get all activities (public)
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await activityService.getAllActivities(req.query);

        res.json({
            success: true,
            data: activities
        });

    } catch (error) {
        console.error('Get all activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las clases'
        });
    }
};

// Get single activity
exports.getActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await activityService.getActivityById(id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Clase no encontrada'
            });
        }

        res.json({
            success: true,
            data: activity
        });

    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la clase'
        });
    }
};

// Create activity (admin only)
exports.createActivity = async (req, res) => {
    try {
        const activityId = await activityService.createActivity(req.body);

        res.status(201).json({
            success: true,
            message: 'Clase creada exitosamente',
            data: { id: activityId }
        });

    } catch (error) {
        if (error.message === 'El nombre es requerido') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Create activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la clase'
        });
    }
};

// Update activity (admin only)
exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await activityService.updateActivity(id, req.body);

        if (updated === null) {
            return res.status(404).json({
                success: false,
                message: 'Clase no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Clase actualizada exitosamente'
        });

    } catch (error) {
        if (error.message === 'No hay campos válidos para actualizar') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error('Update activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la clase'
        });
    }
};

// Delete activity (admin only)
exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await activityService.deleteActivity(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Clase no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Clase eliminada exitosamente'
        });

    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la clase'
        });
    }
};
