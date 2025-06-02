const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    favoriteMovies: [{ type: String }],
    rating: { type: Number, default: 0 },
    suggestedMovies: [
      {
        movieId: { type: Number },
        suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        suggestedAt: { type: Date, default: Date.now },
      },
    ],
    role: {
      type: String,
      enum: ["viewer", "filmmaker", "reviewer"],
      default: "viewer",
    },
    preferences: {
      genres: [String],
      cinemas: [String],
      watchingHabits: String,
      contentPreferences: [String],
      languages: [String],
    },
    reviewerStatus: {
      reviewsThisMonth: { type: Number, default: 0 },
      lastReviewDate: Date,
      warnings: [{ message: String, date: Date }],
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
