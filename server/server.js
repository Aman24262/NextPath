require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/user.routes.js');

const app = express();

// 1. Middleware
app.use(express.json()); 
app.use(cors({
  // This allows your specific Vercel domain to talk to this server
  origin: ['https://next-path-henna.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// 2. Diagnostic Route (To check if server is alive)
app.get('/', (req, res) => {
    res.send("✅ NextPath Backend is Live and Running!");
});

// 3. Main Routes
// This maps to your frontend calls like /api/auth/register and /api/auth/login
app.use('/api/auth', userRoutes);

// 4. Catch-all for 404 Errors (Diagnostic)
app.use((req, res) => {
    console.log(`❌ 404 Attempted on: ${req.originalUrl}`);
    res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});

// 5. Database Connection & Server Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is successfully running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
});