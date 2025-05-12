const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: String,
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupPost" }],
    rules: [String],
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
