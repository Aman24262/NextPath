const User = require('../models/user.model');

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

        // 1. Update the profile fields including the avatar image
        user.profile.avatar = req.body.avatar || user.profile.avatar;
        user.profile.educationLevel = req.body.educationLevel || user.profile.educationLevel;
        user.profile.stream = req.body.stream || user.profile.stream;
        user.profile.skills = req.body.skills || user.profile.skills;
        user.profile.goals = req.body.goals || user.profile.goals;

        // 2. THE FIX: Use updateOne to bypass the pre('save') hook!
        await User.updateOne(
            { _id: req.user.id },
            { $set: { profile: user.profile } }
        );

        // 3. Fetch the freshly updated user to send back to React
        const updatedUser = await User.findById(req.user.id);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profile: updatedUser.profile
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