exports.errorHandler = (err, req, res, next) => {
    // If the status code is 200 (OK) but an error happened, default to 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message,
        // Only show the detailed stack trace if we are NOT in production
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};