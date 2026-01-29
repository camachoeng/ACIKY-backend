// Parse authentication token from Authorization header
// Returns userId if valid, null otherwise
const parseAuthToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const userData = JSON.parse(Buffer.from(token, 'base64').toString());

        if (!userData.id || !userData.loginTime) {
            return null;
        }

        // Validate token age (24 hours)
        const tokenAge = Date.now() - userData.loginTime;
        if (tokenAge >= 86400000) { // 24 hours in milliseconds
            return null;
        }

        return userData.id;
    } catch (error) {
        console.error('Token parsing error:', error);
        return null;
    }
};

// Get userId from session or authorization header
const getUserId = (req) => {
    // Check session first
    if (req.session && req.session.userId) {
        return req.session.userId;
    }

    // Fallback to Authorization header
    const authHeader = req.headers.authorization;
    return parseAuthToken(authHeader);
};

module.exports = {
    parseAuthToken,
    getUserId
};
