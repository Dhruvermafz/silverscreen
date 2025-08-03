const BugReport = require("../models/bugReport");
const path = require("path");
const fs = require("fs");

// Custom error class for better error handling[](https://www.toptal.com/nodejs/node-js-error-handling)
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Create a new bug report
exports.createBugReport = async (req, res, next) => {
  try {
    const { description, pageUrl } = req.body;
    const userId = req.user?._id; // Assumes user is attached via auth middleware
    let screenshotPath = null;

    // Handle screenshot upload
    if (req.file) {
      const uploadDir = path.join(__dirname, "../uploads/bug-screenshots");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      screenshotPath = `/uploads/bug-screenshots/${req.file.filename}`;
    }

    // Validate inputs
    if (!description || !pageUrl) {
      throw new CustomError("Description and page URL are required", 400);
    }

    // Create bug report
    const bugReport = new BugReport({
      description,
      pageUrl,
      screenshot: screenshotPath,
      userId,
    });

    await bugReport.save();

    // Log to console (replace with email or external service like BugSnag)[](https://www.bugsnag.com/platforms/node-js/)
    console.log(`New bug report received:
      Description: ${description}
      Page URL: ${pageUrl}
      Screenshot: ${screenshotPath || "None"}
      User: ${userId || "Anonymous"}`);

    res.status(201).json({
      success: true,
      message: "Bug report submitted successfully",
      data: bugReport,
    });
  } catch (error) {
    // Handle operational errors[](https://www.toptal.com/nodejs/node-js-error-handling)
    if (!error.isOperational) {
      error = new CustomError("Internal server error", 500);
    }
    next(error);
  }
};
