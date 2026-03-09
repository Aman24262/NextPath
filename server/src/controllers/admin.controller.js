const Career = require('../models/career.model');
const Question = require('../models/question.model');

// @desc    Create a new career profile
// @route   POST /api/admin/careers
// @access  Private/Admin
exports.createCareer = async (req, res) => {
    try {
        const career = await Career.create(req.body);
        res.status(201).json({
            success: true,
            data: career
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating career', error: error.message });
    }
};

// @desc    Create a new assessment question
// @route   POST /api/admin/questions
// @access  Private/Admin
exports.createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating question', error: error.message });
    }
};