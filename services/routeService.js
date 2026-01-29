const routeRepository = require('../repositories/routeRepository');

/**
 * Route Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class RouteService {
    /**
     * Get all routes with optional status filter
     */
    async getAllRoutes(status = null) {
        return await routeRepository.findAll(status);
    }

    /**
     * Get single route by ID
     */
    async getRouteById(id) {
        return await routeRepository.findById(id);
    }

    /**
     * Create route
     */
    async createRoute(data) {
        const {
            name,
            origin,
            destination,
            description,
            frequency,
            status,
            participants_count,
            spaces_established
        } = data;

        // Validation
        if (!name || !origin || !destination) {
            throw new Error('Name, origin, and destination are required');
        }

        const routeId = await routeRepository.create({
            name,
            origin,
            destination,
            description: description || null,
            frequency: frequency || null,
            status: status || 'planning',
            participants_count: participants_count || 0,
            spaces_established: spaces_established || 0
        });

        return routeId;
    }

    /**
     * Update route
     */
    async updateRoute(id, data) {
        // Check if route exists
        const exists = await routeRepository.exists(id);
        if (!exists) {
            return null;
        }

        // Build dynamic update query
        const allowedFields = [
            'name', 'origin', 'destination', 'description', 'frequency',
            'status', 'participants_count', 'spaces_established'
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
            throw new Error('No valid fields to update');
        }

        await routeRepository.update(id, fields, values);
        return true;
    }

    /**
     * Delete route
     */
    async deleteRoute(id) {
        const affectedRows = await routeRepository.delete(id);
        return affectedRows > 0;
    }
}

module.exports = new RouteService();
