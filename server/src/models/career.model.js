const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    // This is the core of your recommendation engine!
    // We store the ideal percentages (0-100) required for this career
    traitMatrix: {
        Analytical: { type: Number, required: true },
        Creative: { type: Number, required: true },
        Social: { type: Number, required: true },
        Technical: { type: Number, required: true },
        Management: { type: Number, required: true }
    },
    // Extra details for Step 5 (Career Dashboard)
    salaryRange: { type: String, default: "Varies" },
    marketDemand: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    estimatedLearningTime: { type: String, default: "6 Months" }
}, {
    timestamps: true
});

module.exports = mongoose.model('Career', careerSchema);