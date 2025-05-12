const mongoose = require("mongoose");

const newsPostSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    newsroom: { type: mongoose.Schema.Types.ObjectId, ref: "Newsroom" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsPost", newsPostSchema);
