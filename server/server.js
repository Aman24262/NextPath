require('dotenv').config();

const express = require('express');
const passport = require('passport');

const connectDB = require('./src/config/db.js');
const cronJobs = require('./src/jobs/cronJobs.js');
const app = require('./src/app.js');

// Load passport config
require('./src/config/passport');

// Google Auth Routes
const googleRoutes = require("./src/routes/google.routes");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(passport.initialize());

// Google OAuth routes
app.use("/api/auth/google", googleRoutes);

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Local Server running on http://localhost:${PORT}`);
      // Initialize Background Cron Jobs
      cronJobs.initCronJobs();
    });
  })
  .catch((err) => {
    console.error('❌ Database Connection Failed:', err.message);
    process.exit(1);
  });