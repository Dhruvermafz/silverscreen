const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    releaseDate: Date,
    language: String,
    genre: [String],
    runtime: Number,
    cast: [String],
    crew: [String],
    poster: String,
    trailerUrl: String,
    streaming: [String],
    averageRating: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
