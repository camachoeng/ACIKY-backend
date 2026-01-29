const spaceRepository = require('../repositories/spaceRepository');

/**
 * Space Service - Business logic layer
 * Handles business rules and orchestrates data flow
 */

class SpaceService {
    /**
     * Get all spaces with instructors and disciplines
     * Uses optimized batch loading to avoid N+1 queries
     */
    async getAllSpaces(filters) {
        const spaces = await spaceRepository.findAll(filters);

        if (spaces.length === 0) {
            return [];
        }

        // Get all space IDs for batch queries
        const spaceIds = spaces.map(s => s.id);

        // Batch load instructors and disciplines (3 queries total instead of 1+2N)
        const [instructorsData, disciplinesData] = await Promise.all([
            spaceRepository.findInstructorsBySpaceIds(spaceIds),
            spaceRepository.findDisciplinesBySpaceIds(spaceIds)
        ]);

        // Group instructors and disciplines by space_id
        const instructorsBySpace = this._groupBySpaceId(instructorsData, (instructor) => ({
            id: instructor.id,
            username: instructor.username,
            email: instructor.email
        }));

        const disciplinesBySpace = this._groupBySpaceId(disciplinesData, (discipline) =>
            discipline.discipline_name
        );

        // Attach instructors and disciplines to each space
        spaces.forEach(space => {
            space.instructors = instructorsBySpace[space.id] || [];
            space.disciplines = disciplinesBySpace[space.id] || [];
        });

        return spaces;
    }

    /**
     * Get single space by ID with instructors and disciplines
     */
    async getSpaceById(id) {
        const space = await spaceRepository.findById(id);

        if (!space) {
            return null;
        }

        // Load related data in parallel
        const [instructors, disciplines] = await Promise.all([
            spaceRepository.findInstructorsBySpaceId(space.id),
            spaceRepository.findDisciplinesBySpaceId(space.id)
        ]);

        space.instructors = instructors;
        space.disciplines = disciplines;

        return space;
    }

    /**
     * Create a new space with instructors and disciplines
     */
    async createSpace(data) {
        const { name, image, address, phone, email, location, instructor_ids = [], disciplines = [] } = data;

        // Validation
        if (!name) {
            throw new Error('Space name is required');
        }

        // Create space
        const spaceId = await spaceRepository.create({
            name,
            image,
            address,
            phone,
            email,
            location
        });

        // Add instructors and disciplines in parallel
        await Promise.all([
            spaceRepository.addInstructors(spaceId, instructor_ids),
            spaceRepository.addDisciplines(spaceId, disciplines)
        ]);

        // Return complete space data
        return await this.getSpaceById(spaceId);
    }

    /**
     * Update space
     */
    async updateSpace(id, data) {
        const { name, image, address, phone, email, location, active, instructor_ids, disciplines } = data;

        // Check if space exists
        const existing = await spaceRepository.findById(id);
        if (!existing) {
            return null;
        }

        // Update basic fields
        const updateFields = { name, image, address, phone, email, location, active };
        await spaceRepository.update(id, updateFields);

        // Update instructors if provided
        if (instructor_ids !== undefined) {
            await spaceRepository.removeAllInstructors(id);
            await spaceRepository.addInstructors(id, instructor_ids);
        }

        // Update disciplines if provided
        if (disciplines !== undefined) {
            await spaceRepository.removeAllDisciplines(id);
            await spaceRepository.addDisciplines(id, disciplines);
        }

        // Return updated space data
        return await this.getSpaceById(id);
    }

    /**
     * Delete space
     */
    async deleteSpace(id) {
        // Check if space exists
        const existing = await spaceRepository.findById(id);
        if (!existing) {
            return false;
        }

        await spaceRepository.delete(id);
        return true;
    }

    /**
     * Add instructor to space
     */
    async addInstructorToSpace(spaceId, userId) {
        if (!spaceId || !userId) {
            throw new Error('Space ID and User ID are required');
        }

        // Verify user is an instructor
        const isInstructor = await spaceRepository.isUserInstructor(userId);
        if (!isInstructor) {
            throw new Error('User is not an instructor');
        }

        await spaceRepository.addInstructor(spaceId, userId);
    }

    /**
     * Remove instructor from space
     */
    async removeInstructorFromSpace(spaceId, userId) {
        if (!spaceId || !userId) {
            throw new Error('Space ID and User ID are required');
        }

        await spaceRepository.removeInstructor(spaceId, userId);
    }

    /**
     * Helper: Group data by space_id
     */
    _groupBySpaceId(data, mapper) {
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.space_id]) {
                grouped[item.space_id] = [];
            }
            grouped[item.space_id].push(mapper ? mapper(item) : item);
        });

        return grouped;
    }
}

module.exports = new SpaceService();
