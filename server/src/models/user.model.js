const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false 
        },
        role: {
            type: String,
            enum: ['Student', 'Admin'],
            default: 'Student'
        },
        stats: {
            currentStreak: { type: Number, default: 0 },
            goalsCompleted: { type: Number, default: 0 },
            totalGoals: { type: Number, default: 0 },
            focusScore: { type: Number, default: 0 }
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        // NEW: Profile fields for Smart Onboarding
        profile: {
            avatar: { type: String, default: '' },
            educationLevel: {
                type: String,
                enum: ['10th', '12th', 'Undergraduate', 'Graduate', 'Postgraduate'],
                default: 'Undergraduate'
            },
            stream: {
                type: String,
                trim: true
            },
            skills: {
                type: [String], // Array of strings (e.g., ['HTML', 'CSS', 'JavaScript'])
                default: []
            },
            goals: {
                type: String,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);

// This runs automatically BEFORE saving a user to the database
userSchema.pre('save', async function (next) {  // <-- ADD 'next' HERE
    if (!this.isModified('password')) {
        return next();
    }
    
    // Keep whatever password hashing logic you already have here!
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Make sure next() is called at the end too
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);