// models/Tag.js
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Movies associated with this tag
    usageCount: { type: Number, default: 0 }, // Tracks how many times the tag is used
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
