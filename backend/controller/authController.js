const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Function to create a JWT token
const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register endpoint
exports.register = async (req, res) => {
  try {
    const { email, password, ...otherFields } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Create new user
    const user = await User.create({ email, password, ...otherFields });

    // Respond with user data (no token)
    res.status(201).json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    // Handle specific errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Invalid input data", details: error.errors });
    }
    // Log unexpected errors for debugging
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login endpoint
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Changed to email to align with frontend

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = createToken(user);

    // Respond with user data and token
    res.json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (error) {
    // Log unexpected errors for debugging
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};
