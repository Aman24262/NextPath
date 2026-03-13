const Groq = require('groq-sdk');
const Question = require('../models/question.model'); 

// @desc    Get all questions for the assessment
exports.getQuestions = async (req, res) => {
    try {
        // First, try to get from DB
        let questions = await Question.find();

        // FALLBACK: If DB is empty, send these immediately so the UI doesn't crash
        if (!questions || questions.length === 0) {
            questions = [
                { _id: "q1", text: "I enjoy solving complex logical puzzles.", category: "Analytical" },
                { _id: "q2", text: "I prefer working in a creative environment.", category: "Creative" },
                { _id: "q3", text: "I am comfortable leading a team of people.", category: "Management" },
                { _id: "q4", text: "I like helping others solve their problems.", category: "Social" },
                { _id: "q5", text: "I enjoy building or fixing things with my hands.", category: "Technical" }
            ];
        }

        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
};

// @desc    Analyze user answers using AI (GROQ)
exports.analyzeAssessment = async (req, res) => {
    try {
        const { traitScores } = req.body; // Matches your Assessment.jsx submit logic

        if (!traitScores) {
            return res.status(400).json({ message: 'Trait scores are required.' });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `
        User Trait Scores: ${JSON.stringify(traitScores)}.
        Based on these scores in Analytical, Creative, Social, Technical, and Management, suggest the top 3 best career matches.
        Return ONLY a raw JSON array. 
        Keys: "title", "matchPercentage" (85-99), "difficulty", "estimatedLearningTime", "reason".
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
        });

        const responseText = chatCompletion.choices[0].message.content;
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const careersData = JSON.parse(cleanJsonString);

        res.status(200).json({ success: true, data: careersData });

    } catch (error) {
        console.error('❌ Groq AI Error:', error);
        res.status(500).json({ message: 'Failed to analyze assessment.' });
    }
};

// @desc    Create a new question
exports.createQuestion = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};

// @desc    Get current assessment
exports.getAssessment = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};