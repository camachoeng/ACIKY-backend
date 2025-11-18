const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'http://127.0.0.1:5500', // Local development
    'https://camachoeng.github.io' // Production
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true }));

// Set charset for all responses
app.use((req, res, next) => {
    res.charset = 'utf-8';
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true for HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // 'none' for cross-origin
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
