const express = require('express');
const router = express.Router();
const { generateCareerMatch } = require('../controllers/recommendation.controller');
const { protect } = require('../middlewares/auth.middleware');

// POST request to send scores and get AI recommendations
router.route('/generate').post(protect, generateCareerMatch);

module.exports = router;