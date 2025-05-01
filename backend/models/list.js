const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieId: Number,
  title: String,
  posterPath: String,
});

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    movies: [movieSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", listSchema);
