const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
// We combine all your controller functions into one clean import line
const { 
    getQuestions, 
    createQuestion, 
    analyzeAssessment, 
    getAssessment 
} = require('../controllers/assessment.controller');

// GET request for students to take the test
router.route('/questions').get(protect, getQuestions);

// POST request to add new questions to the database
router.route('/questions').post(protect, createQuestion);

// ✨ THE MISSING AI ROUTE: POST request to analyze answers and get Top 3 Career Matches
router.route('/analyze').post(protect, analyzeAssessment);

// GET request to fetch the user's saved assessment
router.route('/current').get(protect, getAssessment);

module.exports = router;