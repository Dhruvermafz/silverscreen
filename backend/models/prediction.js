const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  predictedGross: { type: Number, required: true },
  reason: { type: String, required: true },
  actualGross: { type: Number },
  isCorrect: { type: Boolean },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prediction", predictionSchema);
