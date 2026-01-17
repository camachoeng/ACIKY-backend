const db = require('../config/database');

// Get all spaces (public)
exports.getAllSpaces = async (req, res) => {
    try {
        const { active = true, limit = 20, offset = 0 } = req.query;

        let query = `
            SELECT 
                s.*
            FROM spaces s
            WHERE 1=1
        `;
        const params = [];

        if (active === 'true' || active === true) {
            query += ' AND s.active = true';
        }

        query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [spaces] = await db.query(query, params);

        // Get instructors and disciplines for each space
        for (let space of spaces) {
            // Get instructors
            const [instructors] = await db.query(`
                SELECT u.id, u.username, u.email
                FROM users u
                INNER JOIN spaces_instructors si ON u.id = si.user_id
                WHERE si.space_id = ? AND u.role = 'instructor'
            `, [space.id]);
            space.instructors = instructors;

            // Get disciplines
            const [disciplines] = await db.query(`
                SELECT discipline_name
                FROM spaces_disciplines
                WHERE space_id = ?
            `, [space.id]);
            space.disciplines = disciplines.map(d => d.discipline_name);
        }

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

        const [spaces] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);

        if (spaces.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        const space = spaces[0];

        // Get instructors
        const [instructors] = await db.query(`
            SELECT u.id, u.username, u.email
            FROM users u
            INNER JOIN spaces_instructors si ON u.id = si.user_id
            WHERE si.space_id = ? AND u.role = 'instructor'
        `, [space.id]);
        space.instructors = instructors;

        // Get disciplines
        const [disciplines] = await db.query(`
            SELECT discipline_name
            FROM spaces_disciplines
            WHERE space_id = ?
        `, [space.id]);
        space.disciplines = disciplines.map(d => d.discipline_name);

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
        const { name, image, address, phone, email, location, instructor_ids = [], disciplines = [] } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Space name is required'
            });
        }

        // Insert space
        const [result] = await db.query(
            `INSERT INTO spaces (name, image, address, phone, email, location) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, image, address, phone, email, location]
        );

        const spaceId = result.insertId;

        // Add instructors if provided
        if (instructor_ids && instructor_ids.length > 0) {
            for (let userId of instructor_ids) {
                await db.query(
                    'INSERT INTO spaces_instructors (space_id, user_id) VALUES (?, ?)',
                    [spaceId, userId]
                );
            }
        }

        // Add disciplines if provided
        if (disciplines && disciplines.length > 0) {
            for (let discipline of disciplines) {
                await db.query(
                    'INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES (?, ?)',
                    [spaceId, discipline]
                );
            }
        }

        // Get the complete space data
        const [spaces] = await db.query('SELECT * FROM spaces WHERE id = ?', [spaceId]);
        const space = spaces[0];

        // Get instructors
        const [instructors] = await db.query(`
            SELECT u.id, u.username, u.email
            FROM users u
            INNER JOIN spaces_instructors si ON u.id = si.user_id
            WHERE si.space_id = ?
        `, [spaceId]);
        space.instructors = instructors;

        // Get disciplines
        const [disciplinesList] = await db.query(`
            SELECT discipline_name
            FROM spaces_disciplines
            WHERE space_id = ?
        `, [spaceId]);
        space.disciplines = disciplinesList.map(d => d.discipline_name);

        res.status(201).json({
            success: true,
            message: 'Space created successfully',
            data: space
        });

    } catch (error) {
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
        const { name, image, address, phone, email, location, active, instructor_ids, disciplines } = req.body;

        // Check if space exists
        const [existing] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        // Update basic fields
        const updateFields = [];
        const updateValues = [];

        if (name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (image !== undefined) {
            updateFields.push('image = ?');
            updateValues.push(image);
        }
        if (address !== undefined) {
            updateFields.push('address = ?');
            updateValues.push(address);
        }
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            updateValues.push(phone);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (location !== undefined) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }
        if (active !== undefined) {
            updateFields.push('active = ?');
            updateValues.push(active);
        }

        if (updateFields.length > 0) {
            updateValues.push(id);
            await db.query(
                `UPDATE spaces SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        // Update instructors if provided
        if (instructor_ids !== undefined) {
            // Remove all existing instructors
            await db.query('DELETE FROM spaces_instructors WHERE space_id = ?', [id]);
            
            // Add new instructors
            if (instructor_ids.length > 0) {
                for (let userId of instructor_ids) {
                    await db.query(
                        'INSERT INTO spaces_instructors (space_id, user_id) VALUES (?, ?)',
                        [id, userId]
                    );
                }
            }
        }

        // Update disciplines if provided
        if (disciplines !== undefined) {
            // Remove all existing disciplines
            await db.query('DELETE FROM spaces_disciplines WHERE space_id = ?', [id]);
            
            // Add new disciplines
            if (disciplines.length > 0) {
                for (let discipline of disciplines) {
                    await db.query(
                        'INSERT INTO spaces_disciplines (space_id, discipline_name) VALUES (?, ?)',
                        [id, discipline]
                    );
                }
            }
        }

        // Get updated space data
        const [spaces] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        const space = spaces[0];

        // Get instructors
        const [instructors] = await db.query(`
            SELECT u.id, u.username, u.email
            FROM users u
            INNER JOIN spaces_instructors si ON u.id = si.user_id
            WHERE si.space_id = ?
        `, [id]);
        space.instructors = instructors;

        // Get disciplines
        const [disciplinesList] = await db.query(`
            SELECT discipline_name
            FROM spaces_disciplines
            WHERE space_id = ?
        `, [id]);
        space.disciplines = disciplinesList.map(d => d.discipline_name);

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

        // Check if space exists
        const [existing] = await db.query('SELECT * FROM spaces WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        // Delete space (cascade will handle junction tables)
        await db.query('DELETE FROM spaces WHERE id = ?', [id]);

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

        if (!spaceId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Space ID and User ID are required'
            });
        }

        // Verify user is an instructor
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ? AND role = "instructor"',
            [userId]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User is not an instructor'
            });
        }

        // Add instructor to space
        await db.query(
            'INSERT INTO spaces_instructors (space_id, user_id) VALUES (?, ?)',
            [spaceId, userId]
        );

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

        if (!spaceId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Space ID and User ID are required'
            });
        }

        await db.query(
            'DELETE FROM spaces_instructors WHERE space_id = ? AND user_id = ?',
            [spaceId, userId]
        );

        res.json({
            success: true,
            message: 'Instructor removed from space successfully'
        });

    } catch (error) {
        console.error('Remove instructor from space error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing instructor from space'
        });
    }
};
