const mongoose = require("mongoose");

const flagSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["reviewer_role_appeal", "other_complaint"],
    required: true,
  },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  evidence: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  adminResponse: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model("Flag", flagSchema);
