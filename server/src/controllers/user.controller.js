const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Get current logged-in user profile
// @route   GET /api/users/profile
// @access  Private (Requires Token)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile', error: error.message });
    }
};

// @desc    Update user profile & avatar (Smart Onboarding)
// @route   PUT /api/users/profile
// @access  Private (Requires Token)
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

    // 1. Update regular fields (Name & Password)
        if (req.body.name) {
            user.name = req.body.name;
        }
        
        // If a new password is provided, set it. Our userSchema.pre('save') 
        // will automatically detect the modification and hash the new password.
        if (req.body.password && req.body.password.trim() !== '') {
            user.password = req.body.password;
        }

        // 2. Update the profile fields including the avatar image
        user.profile.avatar = req.body.avatar || user.profile.avatar;
        user.profile.educationLevel = req.body.educationLevel || user.profile.educationLevel;
        user.profile.stream = req.body.stream || user.profile.stream;
        user.profile.skills = req.body.skills || user.profile.skills;
        user.profile.goals = req.body.goals || user.profile.goals;

        // 3. THE FIX: Use save() instead of updateOne to run pre-save hooks (like password hashing)
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profile: user.profile
        });
        
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: 'Server error updating profile', error: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard
// @access  Private (Requires Token)
exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      stats: user.stats || {
        currentStreak: 0,
        goalsCompleted: 0,
        totalGoals: 10,
        focusScore: 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user dashboard stats (e.g., after completing a daily task)
// @route   PUT /api/users/stats
// @access  Private
exports.updateStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.stats) {
            user.stats = {
                currentStreak: 0,
                goalsCompleted: 0,
                totalGoals: 10,
                focusScore: 0
            };
        }

        user.stats.currentStreak += 1;
        user.stats.goalsCompleted += 1;
        user.stats.focusScore = Math.min(100, user.stats.focusScore + 5); 

        await User.updateOne(
            { _id: req.user.id },
            { $set: { stats: user.stats } }
        );

        res.status(200).json({
            success: true,
            stats: user.stats
        });
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ message: 'Server Error updating stats' });
    }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding passwords, sorted by newest first
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server Error fetching users' });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            // Send Welcome Email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to NextPath! 🚀',
                    message: `
                        <h1>Welcome to NextPath, ${user.name}!</h1>
                        <p>We're thrilled to have you on board. NextPath is your personal guide to building a successful career path.</p>
                        <p>To get started, please log in and complete your initial assessment so we can personalize your experience!</p>
                        <br/>
                        <p>Best Regards,</p>
                        <p>The NextPath Team</p>
                    `
                });
            } catch (emailError) {
                console.error("Welcome email failed to send:", emailError);
                // We don't fail the registration if the email fails
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data received" });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find user by email and include password field (select: false in schema)
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Make sure to remove password from the response object explicitly
        user.password = undefined;

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};