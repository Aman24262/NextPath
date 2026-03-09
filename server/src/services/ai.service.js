const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.generateCareerExplanation = async (userScores, career, userProfile) => {
    try {
        // 1. Verify API Key is loaded
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ CRITICAL: GEMINI_API_KEY is missing from .env file!");
            throw new Error('Missing API Key');
        }

        console.log("✅ API Key found, connecting to Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // 2. Use the standard, most widely available model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
            You are an expert career counselor. Analyze the following user and explain why the career of ${career.title} is a good match for them.
            
            User's Education Level: ${userProfile?.educationLevel || 'Not specified'}
            User's Assessment Scores (Out of 100):
            - Analytical: ${userScores.Analytical}
            - Creative: ${userScores.Creative}
            - Technical: ${userScores.Technical}
            - Social: ${userScores.Social}
            - Management: ${userScores.Management}

            Respond strictly in valid JSON format with the following keys:
            {
                "whyItSuits": "A personalized paragraph explaining why this career fits their scores.",
                "strengths": ["Strength 1", "Strength 2"],
                "weakAreasToImprove": ["Area 1", "Area 2"],
                "realisticTimeline": "e.g., 6-8 months based on their current education level",
                "briefRoadmap": ["Step 1", "Step 2", "Step 3"]
            }
            Do not include markdown formatting.
        `;

        console.log("⏳ Sending prompt to Google AI...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("✅ Received response from Google AI!");

        // 3. Clean the response (Gemini often adds ```json and ``` which breaks the parser)
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedResponse = JSON.parse(cleanJson);
        return parsedResponse;

    } catch (error) {
        // This will print the exact Google error to your VS Code terminal
        console.error("❌ AI Generation Error Details:");
        console.error(error); 
        throw new Error('Failed to generate AI explanation.');
    }
};

/**
 * Generates a detailed, month-by-month roadmap using AI.
 */
exports.generateDetailedRoadmap = async (careerTitle, userProfile) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the same 2.5 model that successfully worked for you!
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
            Act as an expert technical career coach. 
            Create a highly detailed, realistic learning roadmap for a student aiming to become a ${careerTitle}.
            The student's current education level is ${userProfile?.educationLevel || 'Beginner'}.
            Their current known skills are: ${userProfile?.skills?.join(', ') || 'None specified'}.

            Generate a 6-month step-by-step plan.
            Respond strictly in valid JSON format matching this exact array structure:
            [
                {
                    "month": "Month 1",
                    "title": "Core Fundamentals",
                    "tasks": [
                        { "name": "Task 1 description" },
                        { "name": "Task 2 description" }
                    ]
                }
            ]
            Do not include any markdown formatting like \`\`\`json. Just return the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean the response just in case
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("❌ AI Roadmap Generation Error:", error);
        throw new Error('Failed to generate AI roadmap.');
    }
};