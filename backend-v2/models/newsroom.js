const mongoose = require("mongoose");

const newsroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    editors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "NewsPost" }],
    allowComments: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Newsroom", newsroomSchema);
