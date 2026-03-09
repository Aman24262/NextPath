const Groq = require('groq-sdk');
const Roadmap = require('../models/roadmap.model');

exports.generateRoadmap = async (req, res) => {
    try {
        const { careerTitle } = req.body;
        const userId = req.user._id;

        if (!careerTitle) return res.status(400).json({ message: 'Career title is required.' });

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // We explicitly ask for a JSON object with a "roadmap" key so Groq's JSON mode accepts it
        const prompt = `Create a realistic 6-month learning roadmap for a beginner ${careerTitle}. 
        You MUST reply with a valid JSON OBJECT containing a single key called "roadmap". 
        The value of "roadmap" must be an array of 6 objects. 
        Each object must have: "phase" (string), "focus" (string), and "milestones" (an array of exactly 4 strings).`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            // ✨ THE MAGIC BULLET: This strictly forces the AI to output 100% flawless JSON
            response_format: { type: 'json_object' } 
        });

        const responseText = chatCompletion.choices[0].message.content;
        
        // No more messy string extraction needed, it's guaranteed to be clean!
        const parsedResponse = JSON.parse(responseText);
        const roadmapData = parsedResponse.roadmap; // Extract the array from the object

        const formattedPhases = roadmapData.map(phase => ({
            phase: phase.phase,
            focus: phase.focus,
            milestones: phase.milestones.map(m => ({ text: m, completed: false }))
        }));

        await Roadmap.deleteMany({ user: userId });

        const savedRoadmap = await Roadmap.create({
            user: userId,
            careerTitle: careerTitle,
            phases: formattedPhases,
            completionPercentage: 0
        });

        res.status(200).json({ success: true, career: careerTitle, data: savedRoadmap });

    } catch (error) {
        console.error('❌ Roadmap Generation Error:', error.message);
        res.status(500).json({ message: 'Server failed to parse the AI roadmap.' });
    }
};

exports.getCurrentRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ user: req.user._id });
        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'No active roadmap found.' });
        }
        res.status(200).json({ success: true, data: roadmap });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching roadmap' });
    }
};

exports.toggleMilestone = async (req, res) => {
    try {
        const roadmapId = req.params.id;
        const milestoneId = req.params.milestoneId;

        // 1. Find the user's roadmap in the database
        const roadmap = await Roadmap.findById(roadmapId);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        let totalMilestones = 0;
        let completedCount = 0;

        // 2. Loop through all phases and milestones
        roadmap.phases.forEach(phase => {
            phase.milestones.forEach(milestone => {
                // If we find the exact milestone the user clicked, flip it!
                if (milestone._id.toString() === milestoneId) {
                    milestone.completed = !milestone.completed; 
                }
                
                // Count up the totals for our math
                totalMilestones++;
                if (milestone.completed) {
                    completedCount++;
                }
            });
        });

        // ✨ 3. THE MAGIC MATH: Calculate the new overall percentage
        let newPercentage = 0;
        if (totalMilestones > 0) {
            newPercentage = Math.round((completedCount / totalMilestones) * 100);
        }
        
        roadmap.completionPercentage = newPercentage;

        roadmap.markModified('phases');

        // 4. Save the new true/false status AND the new percentage to MongoDB
        await roadmap.save(); 

        res.status(200).json({ 
            success: true, 
            completionPercentage: roadmap.completionPercentage,
            completedCount: completedCount
        });

    } catch (error) {
        console.error('❌ Error toggling milestone:', error);
        res.status(500).json({ message: 'Server failed to update milestone.' });
    }
};