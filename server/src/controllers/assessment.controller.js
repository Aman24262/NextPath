const Groq = require('groq-sdk');
// NOTE: Make sure this path matches where your Question model is saved!
const Question = require('../models/question.model'); 

// @desc    Get all questions for the assessment
// @route   GET /api/assessment/questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
};

// @desc    Create a new question (Admin)
// @route   POST /api/assessment/questions
exports.createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, data: question });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating question' });
    }
};

// @desc    Analyze user answers and return Top 3 Career Matches (GROQ POWERED!)
// @route   POST /api/assessment/analyze
exports.analyzeAssessment = async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers) {
            return res.status(400).json({ message: 'Assessment answers are required.' });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `
        You are an expert career counselor. Analyze these user assessment answers: ${JSON.stringify(answers)}.
        Based on their skills and preferences, suggest the top 3 best career matches.
        
        You MUST return ONLY a raw JSON array of 3 objects. Do not use markdown blocks or introductory text.
        Each object must have exactly these keys:
        "title" (string: the career name),
        "matchPercentage" (number: 85 to 99),
        "difficulty" (string: Beginner, Intermediate, or Advanced),
        "estimatedLearningTime" (string: e.g., "1-2 Years"),
        "reason" (string: a 2-sentence explanation of why this fits their answers).
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
        });

        const responseText = chatCompletion.choices[0].message.content;
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const careersData = JSON.parse(cleanJsonString);

        res.status(200).json({
            success: true,
            data: careersData
        });

    } catch (error) {
        console.error('❌ Groq AI Error:', error);
        res.status(500).json({ message: 'Failed to analyze assessment.' });
    }
};

// @desc    Dummy route just in case your router needs it
exports.getAssessment = async (req, res) => {
    res.status(200).json({ success: true, message: "Assessment route active." });
};