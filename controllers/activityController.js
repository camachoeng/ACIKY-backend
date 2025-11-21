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
            message: 'Failed to fetch activities'
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
                message: 'Activity not found'
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
            message: 'Failed to fetch activity'
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
            teacher_id,
            price,
            icon,
            difficulty_level,
            active,
            featured
        } = req.body;

        // Use teacher_id if provided, otherwise fall back to instructor_id
        const finalTeacherId = teacher_id || instructor_id || null;

        // Validation - only name is truly required
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
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
            finalTeacherId,
            price || null,
            icon || null,
            difficulty_level || 'all',
            active !== false,
            featured || false
        ]);

        res.status(201).json({
            success: true,
            message: 'Activity created successfully',
            data: { id: result.insertId }
        });

    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create activity'
        });
    }
};

// Update activity (admin only)
exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Handle teacher_id -> instructor_id mapping
        if (updates.teacher_id !== undefined) {
            updates.instructor_id = updates.teacher_id;
            delete updates.teacher_id;
        }

        // Check if activity exists
        const [existing] = await db.query(
            'SELECT id FROM activities WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
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
                message: 'No valid fields to update'
            });
        }

        values.push(id);

        await db.query(
            `UPDATE activities SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({
            success: true,
            message: 'Activity updated successfully'
        });

    } catch (error) {
        console.error('Update activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update activity'
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
                message: 'Activity not found'
            });
        }

        res.json({
            success: true,
            message: 'Activity deleted successfully'
        });

    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete activity'
        });
    }
};
