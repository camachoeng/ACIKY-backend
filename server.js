const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Your frontend Live Server URL
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,        // set to false for development (http)
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,  // 24 hours
        sameSite: 'lax'      // CRITICAL: change from 'strict' to 'lax'
    }
}));

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const activityRoutes = require('./routes/activities');
const routeRoutes = require('./routes/routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/routes', routeRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'ACIKY Yoga Backend API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
