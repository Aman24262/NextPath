const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        responses: [
            {
                questionId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Question',
                    required: true
                },
                score: { 
                    type: Number, 
                    required: true, 
                    min: 1, 
                    max: 5 // 1 = Strongly Disagree, 5 = Strongly Agree
                }
            }
        ],
        // The final calculated percentages (0-100%)
        categoryScores: {
            Analytical: { type: Number, default: 0 },
            Creative: { type: Number, default: 0 },
            Social: { type: Number, default: 0 },
            Technical: { type: Number, default: 0 },
            Management: { type: Number, default: 0 }
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Assessment', assessmentSchema);