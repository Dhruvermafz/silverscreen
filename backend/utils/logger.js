const winston = require("winston");

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Log to console
    new winston.transports.Console(),
    // Log errors to file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Log all info to combined log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Export logger
module.exports = logger;
