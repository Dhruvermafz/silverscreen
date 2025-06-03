const User = require("../models/user");
const Reviews = require("../models/reviews");
const MovieRequest = require("../models/movieRequest");
const mongoose = require("mongoose");
// Ensure this model exists
// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      email: req.body.email,
      username: req.body.username,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getAllMembers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "username avatar bio rating favoriteMovies"
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch members." });
  }
};
// POST /api/users/:id/follow
exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId)
      return res.status(400).json({ error: "You can't follow yourself." });

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ error: "User not found." });

    if (currentUser.following.includes(targetUserId))
      return res.status(400).json({ error: "Already following this user." });

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true, message: "User followed." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// POST /api/users/:id/unfollow
exports.unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ error: "User not found." });

    if (!currentUser.following.includes(targetUserId))
      return res.status(400).json({ error: "Not following this user." });

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ success: true, message: "User unfollowed." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
// Get user movie requests

exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const requests = await MovieRequest.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (err) {
    console.error("Error in getUserRequests:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getUserReviews = async (req, res) => {
  const reviews = await Reviews.find({ user: req.params.id })
    .populate("movie", "title")
    .sort({ createdAt: -1 });
  res.json(reviews);
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update preferences", error });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!["viewer", "filmmaker", "reviewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error });
  }
};
exports.completeOnboarding = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isNewUser } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { isNewUser },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update onboarding status", error });
  }
};
// userController.js (append to existing)

// POST /api/admin/users
exports.addUser = async (req, res) => {
  try {
    const { fullName, email, username, pricingPlan, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !username || !pricingPlan || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      username,
      pricingPlan,
      password, // Assume password is hashed in User model pre-save hook
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "banned"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
