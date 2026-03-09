require('dotenv').config();
const app = require('./src/app.js');
const connectDB = require('./src/config/db.js');

// FIXED: Changed 'import' to 'require' and matched your filename
const userRoutes = require('./src/routes/user.routes.js'); 

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);

app.use(cors({
  origin: ['https://next-path-ten.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));



// Connect to the database first, THEN start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is successfully running on port ${PORT}`);
    });
});