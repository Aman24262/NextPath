const express = require('express');
const passport = require('passport');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// @desc    Initiate Google OAuth Flow
// @route   GET /api/auth/google
// @access  Public
router.get(
    '/',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get(
    '/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=true' }),
    (req, res) => {
        // Upon successful login, Passport attaches the user to req.user

        // 1. Generate the JWT token for our API
        const token = generateToken(req.user._id);

        // 2. Prepare the user JSON to send back (WITHOUT the avatar!)
        // The avatar could be a 2MB base64 string which would crash the URL header with HTTP 431
        const userObj = req.user.toObject ? req.user.toObject() : req.user;
        const safeProfile = userObj.profile || {};
        
        if (safeProfile.avatar) {
            delete safeProfile.avatar; 
        }

        const userData = {
            _id: userObj._id,
            name: userObj.name,
            email: userObj.email,
            role: userObj.role || 'Student',
            profile: safeProfile
        };

        // 3. Encode the data to pass safely in the URL (Optional but recommended to prevent URL breaks)
        const encodedUser = encodeURIComponent(JSON.stringify(userData));

        // 4. Redirect the user back to the React frontend with the token and user data
        res.redirect(`http://localhost:5173/oauth-callback?token=${token}&user=${encodedUser}`);
    }
);

module.exports = router;
