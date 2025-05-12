// controllers/ModerationController.js
const mongoose = require("mongoose");
const Report = require("../models/report"); // Adjust path to your Report model
const User = require("../models/user"); // Adjust path to your User model
const Review = require("../models/review"); // Adjust path to your Review model
const GroupPost = require("../models/groupPost"); // Adjust path to your GroupPost model
const NewsPost = require("../models/newsPost"); // Adjust path to your NewsPost model
const Comment = require("../models/comment"); // Adjust path to your Comment model

// Flag content for moderation
const flagContent = async (req, res) => {
  try {
    const { contentId, type } = req.params;
    const { reason } = req.body;
    const reporterId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }
    if (
      !["Review", "Comment", "GroupPost", "NewsPost", "Blog"].includes(type)
    ) {
      return res.status(400).json({ message: "Invalid content type" });
    }
    if (!reason) {
      return res
        .status(400)
        .json({ message: "Reason for flagging is required" });
    }

    // Check if content exists
    let content;
    switch (type) {
      case "Review":
        content = await Review.findById(contentId);
        break;
      case "Comment":
        content = await Comment.findById(contentId);
        break;
      case "GroupPost":
        content = await GroupPost.findById(contentId);
        break;
      case "NewsPost":
        content = await NewsPost.findById(contentId);
        break;
      case "Blog":
        // Placeholder: No Blog schema provided
        return res
          .status(400)
          .json({ message: "Blog content type not supported yet" });
      default:
        return res.status(400).json({ message: "Invalid content type" });
    }

    if (!content) {
      return res.status(404).json({ message: `${type} not found` });
    }

    // Check if already flagged by this user
    const existingReport = await Report.findOne({
      reporter: reporterId,
      targetType: type,
      targetId: contentId,
      status: "Pending",
    });
    if (existingReport) {
      return res
        .status(400)
        .json({ message: "You have already flagged this content" });
    }

    // Create report
    const report = new Report({
      reporter: reporterId,
      targetType: type,
      targetId: contentId,
      reason,
    });

    await report.save();

    res.status(201).json({ message: "Content flagged successfully", report });
  } catch (error) {
    console.error("Flag content error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Review flagged content (get pending reports)
const reviewFlaggedContent = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    // Check if user is a moderator or admin
    const user = await User.findById(userId);
    if (!user || !["Moderator", "Admin"].includes(user.role)) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only moderators or admins can review reports",
        });
    }

    const reports = await Report.find({ status: "Pending" })
      .populate("reporter", "username")
      .populate({
        path: "targetId",
        select: "content reviewText title body", // Adjust fields based on content type
        match: {
          targetType: { $in: ["Review", "Comment", "GroupPost", "NewsPost"] },
        },
        populate: { path: "user author", select: "username" }, // Populate content creator
      })
      .sort({ createdAt: -1 }); // Newest first

    res.json(reports);
  } catch (error) {
    console.error("Review flagged content error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ban a user
const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const moderatorId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if moderator is authorized
    const moderator = await User.findById(moderatorId);
    if (!moderator || !["Moderator", "Admin"].includes(moderator.role)) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only moderators or admins can ban users",
        });
    }

    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent banning moderators or admins
    if (["Moderator", "Admin"].includes(targetUser.role)) {
      return res
        .status(400)
        .json({ message: "Cannot ban moderators or admins" });
    }

    // Ban user (e.g., set a banned status or delete account)
    // For simplicity, we'll delete the user; adjust as needed
    await User.deleteOne({ _id: userId });

    // Optionally, remove user's content
    await Review.deleteMany({ user: userId });
    await GroupPost.deleteMany({ user: userId });
    await NewsPost.deleteMany({ author: userId });
    await Comment.deleteMany({ user: userId });

    // Resolve related reports
    await Report.updateMany(
      { reporter: userId, status: "Pending" },
      { status: "Resolved", moderatorNote: "User banned" }
    );

    res.json({ message: `User ${targetUser.username} banned successfully` });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Warn a user
const warnUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const moderatorId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!reason) {
      return res
        .status(400)
        .json({ message: "Reason for warning is required" });
    }

    // Check if moderator is authorized
    const moderator = await User.findById(moderatorId);
    if (!moderator || !["Moderator", "Admin"].includes(moderator.role)) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only moderators or admins can warn users",
        });
    }

    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent warning moderators or admins
    if (["Moderator", "Admin"].includes(targetUser.role)) {
      return res
        .status(400)
        .json({ message: "Cannot warn moderators or admins" });
    }

    // Here, you could implement a warning system (e.g., store warnings in User schema)
    // For simplicity, we'll return a message; adjust to store warnings if needed
    // Example: Add a warnings array to User schema and push { reason, date, moderator }

    res.json({ message: `User ${targetUser.username} warned for: ${reason}` });
  } catch (error) {
    console.error("Warn user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reports
const getReports = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    // Check if user is a moderator or admin
    const user = await User.findById(userId);
    if (!user || !["Moderator", "Admin"].includes(user.role)) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only moderators or admins can view reports",
        });
    }

    const reports = await Report.find()
      .populate("reporter", "username")
      .populate({
        path: "targetId",
        select: "content reviewText title body",
        match: {
          targetType: { $in: ["Review", "Comment", "GroupPost", "NewsPost"] },
        },
        populate: { path: "user author", select: "username" },
      })
      .sort({ createdAt: -1 }); // Newest first

    res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resolve a report
const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, moderatorNote } = req.body;
    const moderatorId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }
    if (!["Resolved", "Dismissed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be Resolved or Dismissed" });
    }

    // Check if moderator is authorized
    const moderator = await User.findById(moderatorId);
    if (!moderator || !["Moderator", "Admin"].includes(moderator.role)) {
      return res
        .status(403)
        .json({
          message:
            "Unauthorized: Only moderators or admins can resolve reports",
        });
    }

    // Find report
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update report
    report.status = status;
    report.moderatorNote = moderatorNote || report.moderatorNote;
    report.updatedAt = Date.now();

    await report.save();

    // Optionally, take action based on resolution (e.g., delete content if Resolved)
    if (status === "Resolved" && report.targetType !== "Blog") {
      switch (report.targetType) {
        case "Review":
          await Review.deleteOne({ _id: report.targetId });
          break;
        case "Comment":
          await Comment.deleteOne({ _id: report.targetId });
          break;
        case "GroupPost":
          await GroupPost.deleteOne({ _id: report.targetId });
          break;
        case "NewsPost":
          await NewsPost.deleteOne({ _id: report.targetId });
          break;
      }
    }

    res.json({
      message: `Report ${status.toLowerCase()} successfully`,
      report,
    });
  } catch (error) {
    console.error("Resolve report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  flagContent,
  reviewFlaggedContent,
  banUser,
  warnUser,
  getReports,
  resolveReport,
};
