const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

// Authentication Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Profile & Dashboard Routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/dashboard', protect, userController.getDashboardStats);
router.put('/stats', protect, userController.updateStats);
router.get('/', protect, userController.getAllUsers);

module.exports = router;