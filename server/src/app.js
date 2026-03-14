const express = require('express');
const cors = require('cors');
const recommendationRoutes = require('./routes/recommendation.routes');
const roadmapRoutes = require('./routes/roadmap.routes');
const progressRoutes = require('./routes/progress.routes');
const notificationRoutes = require('./routes/notification.routes');



// 1. Import All Routes
const userRoutes = require('./routes/user.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const adminRoutes = require('./routes/admin.routes');

// 2. Import Error Middleware
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 3. Global Middlewares

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Your local Vite port
  credentials: true
})); 

// 4. Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notifications', notificationRoutes);

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