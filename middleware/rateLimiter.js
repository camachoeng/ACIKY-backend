const rateLimit = require('express-rate-limit');

// Rate limiter for authentication endpoints (login, register)
// Allows 5 requests per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count all requests
    skipFailedRequests: false
});

// Rate limiter for contact form
// Allows 3 requests per hour per IP
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per windowMs
    message: {
        success: false,
        message: 'Too many contact form submissions. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter for booking requests
// Allows 5 requests per hour per IP
const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many booking requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// General API rate limiter (for all other endpoints)
// Allows 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for authenticated admin users
        return req.session && req.session.role === 'admin';
    }
});

module.exports = {
    authLimiter,
    contactLimiter,
    bookingLimiter,
    generalLimiter
};
