const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please provide the question text'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please assign a category to this question'],
        // These are the exact categories from your project blueprint!
        enum: ['Analytical', 'Creative', 'Social', 'Technical', 'Management']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);