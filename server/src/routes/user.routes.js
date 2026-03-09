const express = require('express');
const { protect } = require('../middlewares/auth.middleware'); // Import our security guard

// FIXED: Combine all controller functions into one require statement!


const { 
    updateProfile, 
    getProfile, 
    getDashboardStats,
    updateStats, // <-- Add this new one!
    getAllUsers,
} = require('../controllers/user.controller');

const router = express.Router();

// Apply the 'protect' middleware to these routes
// This means a user MUST pass a valid JWT token to access them
router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

router.get('/dashboard', protect, getDashboardStats);

// Route to update statistics
router.put('/stats', protect, updateStats);

// Admin Route to view all users
router.get('/', protect, getAllUsers);

module.exports = router;