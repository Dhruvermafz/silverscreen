class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent Error constructor
    this.statusCode = statusCode || 500; // Default to 500 if not provided
    this.isOperational = true; // Mark as operational error

    // Ensure the error stack trace is captured
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
