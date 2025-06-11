const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  submissions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      answer: { type: String, required: true },
      isCorrect: { type: Boolean },
      points: { type: Number, default: 0 },
      submittedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
