const db = require('../config/database');

// Get all activities (public)
exports.getAllActivities = async (req, res) => {
    try {
        const { 
            active = true, 
            featured, 
            difficulty_level,
            limit = 20, 
            offset = 0 
        } = req.query;

        let query = `
            SELECT 
                a.*,
                u.username as instructor_name
            FROM activities a
            LEFT JOIN users u ON a.instructor_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (active === 'true' || active === true) {
            query += ' AND a.active = true';
        }

        if (featured !== undefined) {
            query += ' AND a.featured = ?';
            params.push(featured === 'true' || featured === true);
        }

        if (difficulty_level) {
            query += ' AND a.difficulty_level = ?';
            params.push(difficulty_level);
        }

        query += ' ORDER BY a.featured DESC, a.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [activities] = await db.query(query, params);

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

        const [activities] = await db.query(`
            SELECT 
                a.*,
                u.username as instructor_name,
                u.bio as instructor_bio
            FROM activities a
            LEFT JOIN users u ON a.instructor_id = u.id
            WHERE a.id = ?
        `, [id]);

        if (activities.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Clase no encontrada'
            });
        }

        res.json({
            success: true,
            data: activities[0]
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
        const {
            name,
            description,
            short_description,
            schedule,
            duration,
            location,
            instructor_id,
            price,
            icon,
            difficulty_level,
            active,
            featured
        } = req.body;

        // Validation - only name is truly required
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es requerido'
            });
        }

        // Use short_description or name as description if description is empty
        const finalDescription = description || short_description || name;

        const [result] = await db.query(`
            INSERT INTO activities 
            (name, description, short_description, schedule, duration, location, 
             instructor_id, price, icon, difficulty_level, active, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name,
            finalDescription,
            short_description || null,
            schedule || null,
            duration || null,
            location || null,
            instructor_id || null,
            price || null,
            icon || null,
            difficulty_level || 'all',
            active !== false,
            featured || false
        ]);

        res.status(201).json({
            success: true,
            message: 'Clase creada exitosamente',
            data: { id: result.insertId }
        });

    } catch (error) {
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
        const updates = req.body;

        // Check if activity exists
        const [existing] = await db.query(
            'SELECT id FROM activities WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Clase no encontrada'
            });
        }

        // Build dynamic update query
        const allowedFields = [
            'name', 'description', 'short_description', 'schedule', 
            'duration', 'location', 'instructor_id', 'price', 'icon',
            'difficulty_level', 'active', 'featured'
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
                message: 'No hay campos válidos para actualizar'
            });
        }

        values.push(id);

        await db.query(
            `UPDATE activities SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({
            success: true,
            message: 'Clase actualizada exitosamente'
        });

    } catch (error) {
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

        const [result] = await db.query(
            'DELETE FROM activities WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
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
