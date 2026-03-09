// We pass an array of allowed roles (e.g., ['Admin'])
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // req.user is set by the protect middleware we just wrote!
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route` 
            });
        }
        next();
    };
};