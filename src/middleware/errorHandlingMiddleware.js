// errorHandlingMiddleware.js
function errorHandlingMiddleware(err, req, res, next) {
    // Log the error for debugging purposes
    console.error(err);

    // Determine the status code based on the error
    const statusCode = err.statusCode || 500; // Default to 500 if statusCode not set

    // Send a generic error message or a specific one if defined
    res.status(statusCode).json({
        error: {
            message: err.message || 'An unexpected error occurred on the server.',
            status: statusCode,
            timestamp: new Date(),
        },
    });
}

module.exports = errorHandlingMiddleware;
