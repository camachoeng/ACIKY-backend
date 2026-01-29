const activityRepository = require('../repositories/activityRepository');

/**
 * Activity Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class ActivityService {
    /**
     * Get all activities with filters
     */
    async getAllActivities(filters) {
        const { active = true, featured, difficulty_level, limit = 20, offset = 0 } = filters;
        return await activityRepository.findAll({ active, featured, difficulty_level, limit, offset });
    }

    /**
     * Get single activity by ID
     */
    async getActivityById(id) {
        return await activityRepository.findById(id);
    }

    /**
     * Create activity
     */
    async createActivity(data) {
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
        } = data;

        // Validation - only name is truly required
        if (!name) {
            throw new Error('El nombre es requerido');
        }

        // Use short_description or name as description if description is empty
        const finalDescription = description || short_description || name;

        const activityId = await activityRepository.create({
            name,
            description: finalDescription,
            short_description: short_description || null,
            schedule: schedule || null,
            duration: duration || null,
            location: location || null,
            instructor_id: instructor_id || null,
            price: price || null,
            icon: icon || null,
            difficulty_level: difficulty_level || 'all',
            active: active !== false,
            featured: featured || false
        });

        return activityId;
    }

    /**
     * Update activity
     */
    async updateActivity(id, data) {
        // Check if activity exists
        const exists = await activityRepository.exists(id);
        if (!exists) {
            return null;
        }

        // Build dynamic update query
        const allowedFields = [
            'name', 'description', 'short_description', 'schedule',
            'duration', 'location', 'instructor_id', 'price', 'icon',
            'difficulty_level', 'active', 'featured'
        ];

        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error('No hay campos válidos para actualizar');
        }

        await activityRepository.update(id, fields, values);
        return true;
    }

    /**
     * Delete activity
     */
    async deleteActivity(id) {
        const affectedRows = await activityRepository.delete(id);
        return affectedRows > 0;
    }
}

module.exports = new ActivityService();
