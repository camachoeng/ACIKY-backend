const db = require('../config/database');

// Get all instructors for assignment to activities
exports.getAllInstructors = async (req, res) => {
    try {
        const [instructors] = await db.query(
            `SELECT id, username, email, role 
             FROM users 
             WHERE role IN ('instructor') 
             ORDER BY username ASC`
        );

        res.json({
            success: true,
            data: instructors
        });

    } catch (error) {
        console.error('Get instructors error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching instructors'
        });
    }
};
