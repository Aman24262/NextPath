require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/user.routes.js');

const app = express();

// Middleware FIRST
app.use(express.json()); 
app.use(cors({
  origin: ['https://next-path-ten.vercel.app', 'http://localhost:5173'], // We will use this Vercel link again
  credentials: true
}));

// Routes SECOND (Use /api/auth to match your React calls)
app.use('/api/auth', userRoutes); 

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`✅ Backend Live on ${PORT}`));
});