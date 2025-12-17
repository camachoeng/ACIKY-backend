const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'http://127.0.0.1:5500', // Local development
    'http://192.168.1.70:5500', // Local network (phone access)
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

// Trust proxy for Heroku
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production', // trust first proxy
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true for HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days for better mobile compatibility
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.herokuapp.com' : undefined
    }
}));

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const activityRoutes = require('./routes/activities');
const routeRoutes = require('./routes/routes');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/booking');
const testimonialRoutes = require('./routes/testimonials');
const statsRoutes = require('./routes/stats');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'ACIKY Yoga Backend API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
