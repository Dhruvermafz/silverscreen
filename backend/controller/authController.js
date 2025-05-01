const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validator = require("validator"); // For email validation
const logger = require("../utils/logger"); // Custom logger (defined below)

// Function to create a JWT token
const createToken = (user) => {
  try {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    logger.error("JWT signing error", {
      error: error.message,
      stack: error.stack,
    });
    throw new Error("Failed to generate authentication token");
  }
};

// Centralized error response helper
const sendErrorResponse = (res, status, message, details = null) => {
  const response = { error: message };
  if (details) response.details = details;
  logger.warn(`Error response: ${message}`, { status, details });
  return res.status(status).json(response);
};

// Register endpoint
exports.register = async (req, res) => {
  try {
    const { email, password, username, ...otherFields } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      return sendErrorResponse(
        res,
        400,
        "Email, username, and password are required"
      );
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return sendErrorResponse(res, 400, "Invalid email format");
    }

    // Validate password strength (e.g., min 8 chars, includes number, special char)
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return sendErrorResponse(
        res,
        400,
        "Password must be at least 8 characters long and include lowercase, uppercase, number, and special character"
      );
    }

    // Validate username (e.g., alphanumeric, 3-20 chars)
    if (!validator.isAlphanumeric(username, "en-US", { ignore: "_-" })) {
      return sendErrorResponse(
        res,
        400,
        "Username must be alphanumeric (letters, numbers, underscores, or hyphens)"
      );
    }
    if (!validator.isLength(username, { min: 3, max: 20 })) {
      return sendErrorResponse(
        res,
        400,
        "Username must be between 3 and 20 characters"
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, "User with this email already exists");
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return sendErrorResponse(res, 400, "Username is already taken");
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      username,
      ...otherFields,
    });

    logger.info("User registered successfully", { userId: user._id, email });

    // Respond with user data (no token)
    res.status(201).json({
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    // Handle specific errors
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((err) => err.message);
      return sendErrorResponse(res, 400, "Invalid input data", details);
    }
    if (error.name === "MongoServerError" && error.code === 11000) {
      return sendErrorResponse(res, 400, "Duplicate email or username");
    }

    // Log unexpected errors
    logger.error("Registration error", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });

    // Generic server error
    sendErrorResponse(res, 500, "Server error during registration");
  }
};

// Login endpoint
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return sendErrorResponse(res, 400, "Email and password are required");
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return sendErrorResponse(res, 400, "Invalid email format");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendErrorResponse(res, 401, "Invalid email or password");
    }

    // Generate JWT token
    const token = createToken(user);

    logger.info("User logged in successfully", { userId: user._id, email });

    // Respond with user data and token
    res.json({
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    // Log unexpected errors
    logger.error("Login error", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });

    // Generic server error
    sendErrorResponse(res, 500, "Server error during login");
  }
};
