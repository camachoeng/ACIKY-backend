const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { validateEmail, validatePassword, validateUsername } = require('../utils/validation');

/**
 * User Service - Business logic for user management
 */

class UserService {
    /**
     * Get all instructors
     */
    async getAllInstructors() {
        return await userRepository.findAll({ role: 'instructor' });
    }

    /**
     * Get all users
     */
    async getAllUsers(filters = {}) {
        return await userRepository.findAll(filters);
    }

    /**
     * Get user by ID
     */
    async getUserById(id) {
        const user = await userRepository.findById(id);

        if (!user) {
            return null;
        }

        // Remove password from response
        delete user.password;
        return user;
    }

    /**
     * Create new user
     */
    async createUser({ username, email, password, role = 'user' }) {
        // Validation
        if (!username || !email || !password) {
            const error = new Error('Username, email, and password are required');
            error.statusCode = 400;
            throw error;
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
            const error = new Error(usernameValidation.message);
            error.statusCode = 400;
            throw error;
        }

        // Validate email format
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            const error = new Error(emailValidation.message);
            error.statusCode = 400;
            throw error;
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            const error = new Error(passwordValidation.message);
            error.statusCode = 400;
            throw error;
        }

        // Validate role
        const validRoles = ['user', 'instructor', 'admin'];
        if (!validRoles.includes(role)) {
            const error = new Error('Invalid role. Must be: user, instructor, or admin');
            error.statusCode = 400;
            throw error;
        }

        const trimmedUsername = usernameValidation.username;
        const trimmedEmail = emailValidation.email;

        // Check if email already exists
        const existingUser = await userRepository.findByEmail(trimmedEmail);
        if (existingUser) {
            const error = new Error('Email already registered');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = await userRepository.create({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword,
            role
        });

        return {
            id: userId,
            username: trimmedUsername,
            email: trimmedEmail,
            role
        };
    }

    /**
     * Update user
     */
    async updateUser(id, { username, email, password, role }, currentUserId) {
        // Check if user exists
        const existing = await userRepository.findById(id);
        if (!existing) {
            return null;
        }

        // Prevent admin from changing their own role to non-admin
        if (parseInt(id) === currentUserId && role && role !== 'admin') {
            const error = new Error('Cannot change your own admin role');
            error.statusCode = 403;
            throw error;
        }

        const updateFields = {};

        if (username !== undefined) {
            // Validate username
            const usernameValidation = validateUsername(username);
            if (!usernameValidation.valid) {
                const error = new Error(usernameValidation.message);
                error.statusCode = 400;
                throw error;
            }
            updateFields.username = usernameValidation.username;
        }

        if (email !== undefined) {
            // Validate email format
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                const error = new Error(emailValidation.message);
                error.statusCode = 400;
                throw error;
            }

            // Check if new email is already taken by another user
            const emailCheck = await userRepository.findByEmailOrUsernameExcludingId(
                emailValidation.email,
                '',
                id
            );
            if (emailCheck.length > 0) {
                const error = new Error('Email already in use by another user');
                error.statusCode = 400;
                throw error;
            }
            updateFields.email = emailValidation.email;
        }

        if (password !== undefined && password.trim() !== '') {
            // Validate password strength
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                const error = new Error(passwordValidation.message);
                error.statusCode = 400;
                throw error;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        if (role !== undefined) {
            const validRoles = ['user', 'instructor', 'admin'];
            if (!validRoles.includes(role)) {
                const error = new Error('Invalid role');
                error.statusCode = 400;
                throw error;
            }
            updateFields.role = role;
        }

        if (Object.keys(updateFields).length > 0) {
            await userRepository.update(id, updateFields);
        }

        // Get updated user
        return await this.getUserById(id);
    }

    /**
     * Delete user
     */
    async deleteUser(id, currentUserId) {
        // Prevent admin from deleting themselves
        if (parseInt(id) === currentUserId) {
            const error = new Error('Cannot delete your own account');
            error.statusCode = 403;
            throw error;
        }

        // Check if user exists
        const existing = await userRepository.findById(id);
        if (!existing) {
            return false;
        }

        await userRepository.delete(id);
        return true;
    }

    /**
     * Update user role
     */
    async updateUserRole(id, role, currentUserId) {
        // Validate role
        const validRoles = ['user', 'instructor', 'admin'];
        if (!validRoles.includes(role)) {
            const error = new Error('Invalid role. Must be: user, instructor, or admin');
            error.statusCode = 400;
            throw error;
        }

        // Prevent user from changing their own role
        if (parseInt(id) === currentUserId) {
            const error = new Error('Cannot change your own role');
            error.statusCode = 403;
            throw error;
        }

        // Check if user exists
        const existing = await userRepository.findById(id);
        if (!existing) {
            return false;
        }

        await userRepository.update(id, { role });
        return true;
    }
}

module.exports = new UserService();
