const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { validateEmail, validatePassword, validateUsername } = require('../utils/validation');

/**
 * Auth Service - Business logic for authentication
 */

class AuthService {
    /**
     * Register new user
     */
    async register({ username, email, password }) {
        // Validation
        if (!username || !email || !password) {
            throw new Error('All fields are required');
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

        // Use trimmed values from validation
        const trimmedUsername = usernameValidation.username;
        const trimmedEmail = emailValidation.email;

        // Check if user already exists
        const existingUsers = await userRepository.findByEmailOrUsername(trimmedEmail, trimmedUsername);

        if (existingUsers.length > 0) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = await userRepository.create({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword
        });

        return { userId };
    }

    /**
     * Login user
     */
    async login({ email, password }) {
        // Validation
        if (!email || !password) {
            const error = new Error('Email and password are required');
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

        // Find user
        const user = await userRepository.findByEmail(emailValidation.email);

        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Return user data (without password)
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, { username, email, currentPassword, newPassword }) {
        // Validation
        if (!username || !email) {
            const error = new Error('Username and email are required');
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

        const trimmedUsername = usernameValidation.username;
        const trimmedEmail = emailValidation.email;

        // Check if new username/email already exists (excluding current user)
        const existingUsers = await userRepository.findByEmailOrUsernameExcludingId(
            trimmedEmail,
            trimmedUsername,
            userId
        );

        if (existingUsers.length > 0) {
            const error = new Error('Username or email already in use');
            error.statusCode = 400;
            throw error;
        }

        // If user wants to change password, verify current password first
        if (newPassword) {
            if (!currentPassword) {
                const error = new Error('Current password is required to set a new password');
                error.statusCode = 400;
                throw error;
            }

            // Validate new password strength
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.valid) {
                const error = new Error(passwordValidation.message);
                error.statusCode = 400;
                throw error;
            }

            // Get current user data
            const user = await userRepository.findById(userId);

            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                const error = new Error('Current password is incorrect');
                error.statusCode = 401;
                throw error;
            }

            // Hash new password and update
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userRepository.update(userId, {
                username: trimmedUsername,
                email: trimmedEmail,
                password: hashedPassword
            });
        } else {
            // Update without password change
            await userRepository.update(userId, {
                username: trimmedUsername,
                email: trimmedEmail
            });
        }

        // Return updated user data
        const updatedUser = await userRepository.findById(userId);
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        };
    }
}

module.exports = new AuthService();
