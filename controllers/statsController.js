const db = require('../config/database');

// Get community statistics
exports.getCommunityStats = async (req, res) => {
    try {
        // Get total active students (users with role 'user')
        const [students] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role = "user"'
        );

        // Get total instructors
        const [instructors] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role = "instructor"'
        );

        // Get unique locations from activities (spaces)
        const [spaces] = await db.query(
            'SELECT COUNT(DISTINCT location) as count FROM activities WHERE active = 1 AND location IS NOT NULL'
        );

        // Get activities with their creation dates to estimate total classes
        const [activities] = await db.query(
            'SELECT created_at FROM activities WHERE active = 1'
        );

        // Calculate approximate total classes realized
        // Assume each activity happens once per week on average
        let totalClasses = 0;
        const now = new Date();
        
        activities.forEach(activity => {
            const createdDate = new Date(activity.created_at);
            const daysDifference = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
            const weeksDifference = Math.floor(daysDifference / 7);
            totalClasses += weeksDifference; // 1 class per week per activity
        });

        res.json({
            success: true,
            data: {
                students: students[0].count,
                instructors: instructors[0].count,
                spaces: spaces[0].count,
                classes: totalClasses
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching statistics'
        });
    }
};
