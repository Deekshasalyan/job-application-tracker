// middleware/errorHandler.js

/**
 * @desc Handles 404 (Not Found) errors
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes the error to the general error handler below
};

/**
 * @desc General error handler
 */
const errorHandler = (err, req, res, next) => {
    // Determine the status code (default to 500 if the status is still 200)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Send a structured JSON error response
    res.json({
        message: err.message,
        // Only show stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
    });
};

export {
    notFound,
    errorHandler,
};