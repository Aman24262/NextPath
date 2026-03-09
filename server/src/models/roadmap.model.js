const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false } // ✨ This is the secret to Step 8!
});

const phaseSchema = new mongoose.Schema({
    phase: { type: String, required: true },
    focus: { type: String, required: true },
    milestones: [milestoneSchema]
});

const roadmapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    careerTitle: {
        type: String,
        required: true
    },
    phases: [phaseSchema],
    completionPercentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Roadmap', roadmapSchema);