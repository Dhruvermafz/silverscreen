const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    tags: [String],
    isCollaborative: { type: Boolean, default: false },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
