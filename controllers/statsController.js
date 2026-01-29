const statsService = require('../services/statsService');

/**
 * Stats Controller - HTTP handling layer
 * Handles requests/responses and delegates to service layer
 */

// Get community statistics
exports.getCommunityStats = async (req, res) => {
    try {
        const stats = await statsService.getCommunityStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching statistics'
        });
    }
};
