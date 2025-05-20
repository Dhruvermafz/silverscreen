const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetType: {
      type: String,
      enum: ["Review", "Blog", "Comment", "GroupPost", "NewsPost"],
    },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    reason: String,
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Dismissed"],
      default: "Pending",
    },
    moderatorNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
