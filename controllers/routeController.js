const db = require('../config/database');

// Get all routes (public)
exports.getAllRoutes = async (req, res) => {
    try {
        const { status } = req.query;

        let query = 'SELECT * FROM routes WHERE 1=1';
        const params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const [routes] = await db.query(query, params);

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

        const [routes] = await db.query(
            'SELECT * FROM routes WHERE id = ?',
            [id]
        );

        if (routes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }

        res.json({
            success: true,
            data: routes[0]
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
        const {
            name,
            origin,
            destination,
            description,
            frequency,
            status,
            participants_count,
            spaces_established
        } = req.body;

        // Validation
        if (!name || !origin || !destination) {
            return res.status(400).json({
                success: false,
                message: 'Name, origin, and destination are required'
            });
        }

        const [result] = await db.query(`
            INSERT INTO routes 
            (name, origin, destination, description, frequency, status, 
             participants_count, spaces_established)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name,
            origin,
            destination,
            description || null,
            frequency || null,
            status || 'planning',
            participants_count || 0,
            spaces_established || 0
        ]);

        res.status(201).json({
            success: true,
            message: 'Route created successfully',
            data: { id: result.insertId }
        });

    } catch (error) {
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
        const updates = req.body;

        // Check if route exists
        const [existing] = await db.query(
            'SELECT id FROM routes WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }

        // Build dynamic update query
        const allowedFields = [
            'name', 'origin', 'destination', 'description', 'frequency',
            'status', 'participants_count', 'spaces_established'
        ];

        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        values.push(id);

        await db.query(
            `UPDATE routes SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({
            success: true,
            message: 'Route updated successfully'
        });

    } catch (error) {
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

        const [result] = await db.query(
            'DELETE FROM routes WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
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
