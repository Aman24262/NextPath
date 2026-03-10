require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/user.routes.js');

const app = express();

// 1. Middleware
app.use(express.json()); 
app.use(cors({
  origin: ['https://next-path-ten.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// 2. Diagnostic Log (The Truth-Finder)
console.log("--- Server Route Check ---");
console.log("Expecting path: /api/users/register");

// 3. Routes
app.use('/api/users', userRoutes);

// 4. Catch-all for 404s (This will tell us EXACTLY what URL failed)
app.use((req, res) => {
    console.log(`❌ 404 Attempted on: ${req.originalUrl}`);
    res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});

// 5. Server Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});