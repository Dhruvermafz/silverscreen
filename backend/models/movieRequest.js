const mongoose = require("mongoose");

const movieRequestSchema = new mongoose.Schema({
  tmdbId: { type: Number },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: String }],
  reason: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MovieRequest", movieRequestSchema);
