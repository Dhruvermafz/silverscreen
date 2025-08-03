const mongoose = require("mongoose");

const bugReportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Bug description is required"],
    minlength: [10, "Description must be at least 10 characters"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  pageUrl: {
    type: String,
    required: [true, "Page URL is required"],
    match: [/^https?:\/\/.*/, "Invalid URL format"],
  },
  screenshot: {
    type: String, // Store file path or URL for uploaded screenshot
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Optional, for unauthenticated users
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BugReport", bugReportSchema);
