const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String },
});

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Every list must be associated with a user
    },
    isPrivate: {
      type: Boolean,
      default: false, // Default to public lists; set to true for private
    },
    movies: [movieSchema],
  },
  { timestamps: true }
);

// Index for efficient querying by userId and isPrivate
// listSchema.index({ userId: 1, isPrivate: 1 });

module.exports = mongoose.model("List", listSchema);
