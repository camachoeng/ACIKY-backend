// Email validation using standard regex
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Email is required' };
    }

    const trimmedEmail = email.trim();

    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, message: 'Invalid email format' };
    }

    return { valid: true, email: trimmedEmail };
};

// Password strength validation
const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, message: 'Password is required' };
    }

    // Minimum 8 characters
    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password must be at least 8 characters long'
        };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one number'
        };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one special character (!@#$%^&*...)'
        };
    }

    return { valid: true };
};

// Username validation
const validateUsername = (username) => {
    if (!username || typeof username !== 'string') {
        return { valid: false, message: 'Username is required' };
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
        return {
            valid: false,
            message: 'Username must be at least 3 characters long'
        };
    }

    if (trimmedUsername.length > 30) {
        return {
            valid: false,
            message: 'Username must not exceed 30 characters'
        };
    }

    // Only allow alphanumeric, underscore, and hyphen
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
        return {
            valid: false,
            message: 'Username can only contain letters, numbers, underscores, and hyphens'
        };
    }

    return { valid: true, username: trimmedUsername };
};

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername
};
