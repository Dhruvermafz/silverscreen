const mongoose = require("mongoose");
const User = require("../models/user"); // Adjust path to your User model

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("-password") // Exclude password
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, bio, avatar } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user is authorized (assuming req.user from auth middleware)
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check for duplicate username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio, avatar, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's watchlist
const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("watchlist")
      .populate("watchlist", "title releaseDate poster");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.watchlist);
  } catch (error) {
    console.error("Get watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's favorites
const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("favorites")
      .populate("favorites", "title releaseDate poster");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's diary
const getUserDiary = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("diary")
      .populate("diary.movie", "title releaseDate poster");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.diary);
  } catch (error) {
    console.error("Get user diary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user stats
const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select(
      "diary followers following watchlist favorites"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate stats
    const totalWatched = user.diary.length;
    const totalRatings = user.diary.filter((entry) => entry.rating).length;
    const averageRating =
      totalRatings > 0
        ? (
            user.diary.reduce((sum, entry) => sum + (entry.rating || 0), 0) /
            totalRatings
          ).toFixed(2)
        : 0;
    const totalFollowers = user.followers.length;
    const totalFollowing = user.following.length;
    const totalWatchlist = user.watchlist.length;
    const totalFavorites = user.favorites.length;

    res.json({
      totalWatched,
      totalRatings,
      averageRating,
      totalFollowers,
      totalFollowing,
      totalWatchlist,
      totalFavorites,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Invalid target user ID" });
    }

    // Prevent self-follow
    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Update following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    });

    res.json({ message: `Now following ${targetUser.username}` });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Invalid target user ID" });
    }

    // Prevent self-unfollow
    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "Cannot unfollow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Update following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId },
    });

    res.json({ message: `Unfollowed ${targetUser.username}` });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWatchlist,
  getFavorites,
  getUserDiary,
  getUserStats,
  followUser,
  unfollowUser,
};
