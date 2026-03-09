const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Generate Top 3 Careers using AI based on student traits
// @route   POST /api/recommendations/generate
// @access  Private
exports.generateCareerMatch = async (req, res) => {
    try {
        const { traitScores } = req.body; 

        if (!traitScores) {
            return res.status(400).json({ message: 'Trait scores are required.' });
        }

        // 🚨 SAFETY CHECK 1: Ensure the API Key actually exists
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing from your .env file!");
            return res.status(500).json({ message: 'Server is missing AI configuration.' });
        }

        // Initialize inside the function to guarantee .env is fully loaded
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert career counselor and data-driven analyst. 
        A student has just taken a career assessment. Their scores (out of a maximum of 15 points per category) are:
        - Analytical: ${traitScores.Analytical}
        - Creative: ${traitScores.Creative}
        - Social: ${traitScores.Social}
        - Technical: ${traitScores.Technical}
        - Management: ${traitScores.Management}

        Based strictly on these scores, determine the top 3 most accurate career paths for this student.
        
        You MUST return the result as a raw JSON array of objects. Do not use markdown formatting, code blocks, or introductory text. Just the JSON array.
        Each object in the array must have exactly these keys:
        "title" (string: name of the career)
        "matchPercentage" (number: calculated match between 70 and 99)
        "difficulty" (string: 'Beginner', 'Intermediate', or 'Advanced')
        "estimatedLearningTime" (string: e.g., '6 Months')
        "reason" (string: a personalized 2-sentence explanation of WHY this fits their specific score breakdown)
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 🚨 SAFETY CHECK 2: Print exactly what Gemini said to your backend terminal
        console.log("🤖 RAW AI RESPONSE:", responseText);

        let aiRecommendations;
        try {
            // Clean the string just in case Gemini added markdown blocks
            const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            aiRecommendations = JSON.parse(cleanJsonString);
        } catch (parseError) {
            console.error("❌ JSON PARSE ERROR. The AI didn't format it correctly:", parseError);
            return res.status(500).json({ message: 'AI returned invalid data format.' });
        }

        res.status(200).json({
            success: true,
            data: aiRecommendations
        });

    } catch (error) {
        console.error('❌ GOOGLE API ERROR:', error.message);
        res.status(500).json({ message: 'Failed to communicate with Google AI' });
    }
};