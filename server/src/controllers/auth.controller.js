const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 2. Create the new user (Password hashing happens automatically in the model!)
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // 3. If successful, send back the user data AND the JWT token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user. We MUST add .select('+password') because we hid it in the model
        const user = await User.findOne({ email }).select('+password');

        // 2. Check if user exists AND if the entered password matches the hashed password
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // We use 401 Unauthorized for bad credentials
            res.status(401).json({ message: 'Invalid email or password' }); 
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};