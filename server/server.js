require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/user.routes.js');

const app = express();

// 1. Middleware
app.use(express.json()); // This is crucial so your server can read the email/password you send!
app.use(cors({
  origin: ['https://next-path-ten.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 2. Routes
app.use('/api/users', userRoutes);

// 3. Database & Server Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is successfully running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
});