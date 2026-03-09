const express = require('express');
const router = express.Router();
const { generateRoadmap, getCurrentRoadmap } = require('../controllers/roadmap.controller');
const { protect } = require('../middlewares/auth.middleware');
const { toggleMilestone } = require('../controllers/roadmap.controller');

// POST request to generate a brand new syllabus
router.route('/generate').post(protect, generateRoadmap);

// GET request to fetch the user's saved syllabus
router.route('/current').get(protect, getCurrentRoadmap); // ✨ New Route!

router.route('/:id/milestone/:milestoneId').put(protect, toggleMilestone);

module.exports = router;