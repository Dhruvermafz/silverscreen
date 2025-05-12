const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "Critic", "Moderator", "Admin", "Filmmaker"],
      default: "User",
    },
    bio: String,
    avatar: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    diary: [
      {
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        watchedAt: Date,
        review: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
