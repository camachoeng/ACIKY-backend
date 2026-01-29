// Global error handler middleware
// This should be the last middleware in your Express app

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error('Error occurred:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error status and message
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';

    // Generate error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Construct error response
    const errorResponse = {
        success: false,
        errorId,
        message: process.env.NODE_ENV === 'production'
            ? 'An error occurred. Please try again later.'
            : message
    };

    // In development, include more details
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = {
            message: err.message,
            stack: err.stack,
            details: err.details || null
        };
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
