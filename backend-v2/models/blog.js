const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
