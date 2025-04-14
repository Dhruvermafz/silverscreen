const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  tmdbId: { type: Number, required: true, unique: true },
  title: String,
  posterPath: String,
  overview: String,
  releaseDate: String,
});

module.exports = mongoose.model("Movie", movieSchema);
