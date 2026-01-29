const statsRepository = require('../repositories/statsRepository');

/**
 * Stats Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class StatsService {
    /**
     * Get community statistics
     * Calculates students, instructors, spaces, and total classes
     */
    async getCommunityStats() {
        // Get counts in parallel
        const [students, instructors, spaces, activities] = await Promise.all([
            statsRepository.countUsersByRole('user'),
            statsRepository.countUsersByRole('instructor'),
            statsRepository.countUniqueActiveLocations(),
            statsRepository.findAllActiveActivities()
        ]);

        // Calculate approximate total classes realized
        // Assume each activity happens once per week on average
        const totalClasses = this._calculateTotalClasses(activities);

        return {
            students,
            instructors,
            spaces,
            classes: totalClasses
        };
    }

    /**
     * Calculate total classes based on activity age
     * Business logic: Each activity happens once per week on average
     */
    _calculateTotalClasses(activities) {
        const now = new Date();
        let totalClasses = 0;

        activities.forEach(activity => {
            const createdDate = new Date(activity.created_at);
            const daysDifference = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
            const weeksDifference = Math.floor(daysDifference / 7);
            totalClasses += weeksDifference; // 1 class per week per activity
        });

        return totalClasses;
    }
}

module.exports = new StatsService();
