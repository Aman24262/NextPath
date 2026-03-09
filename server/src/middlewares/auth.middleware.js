const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID inside the token and attach it to the request object
            req.user = await User.findById(decoded.id).select('-password');

            // Move to the next function (the actual controller)
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};