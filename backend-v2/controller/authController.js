const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Path to your User model
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "User",
    });

    await user.save();

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({
        accessToken,
        refreshToken,
        user: { id: user._id, username, email, role },
      });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout a user (client-side token invalidation)
const logoutUser = async (req, res) => {
  try {
    // Since JWT is stateless, logout is typically handled client-side by discarding tokens
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Get current authenticated user
const getCurrentUser = async (req, res) => {
  try {
    // Assuming middleware attaches user to req
    const user = await User.findById(req.user.userId)
      .select("-password") // Exclude password
      .populate("followers following watchlist favorites diary.movie");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
};
