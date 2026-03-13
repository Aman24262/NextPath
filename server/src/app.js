const express = require('express');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendation.routes');
const roadmapRoutes = require('./routes/roadmap.routes');
const progressRoutes = require('./routes/progress.routes');
const notificationRoutes = require('./routes/notification.routes');



// 1. Import All Routes
const googleRoutes = require('./routes/google.routes');
const userRoutes = require('./routes/user.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const adminRoutes = require('./routes/admin.routes');

// 2. Import Error Middleware
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 3. Global Middlewares
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // Initialize Passport Config

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Your local Vite port
  credentials: true
})); 

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'super_secret_fallback',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

// 4. Mount Routes
app.use('/api/auth/google', require('./routes/google.routes')); // Added Google Auth
app.use('/api/auth/google', googleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/admin', adminRoutes);

// Add this where your other routes are:
app.use('/api/recommendations', require('./routes/recommendation.routes'));

app.use('/api/roadmaps', roadmapRoutes);

app.use('/api/progress', progressRoutes);

app.use('/api/notifications', notificationRoutes);

// Add this line where your other routes are:
app.use('/api/assessment', require('./routes/assessment.routes'));

// 5. Base Route
app.get('/', (req, res) => {
    res.status(200).json({ message: '🚀 Micro Career Solver API is running perfectly!' });
});

// 6. Handle Undefined Routes (404)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// 7. Global Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;