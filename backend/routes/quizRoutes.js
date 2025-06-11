const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const { auth, restrictTo } = require("../middleware/auth");

// Create quiz (Admin only)
router.post("/create", auth, restrictTo("Analyst"), async (req, res, next) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const quiz = new Quiz({ question, options, correctAnswer });
    await quiz.save();
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    next(err);
  }
});

// Submit quiz answer
router.post("/submit", auth, async (req, res, next) => {
  try {
    const { quizId, answer } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    const isCorrect = answer === quiz.correctAnswer;
    const points = isCorrect ? 10 : 0;
    quiz.submissions.push({
      userId: req.user.userId,
      answer,
      isCorrect,
      points,
    });
    await quiz.save();
    res.json({ message: "Answer submitted", isCorrect, points });
  } catch (err) {
    next(err);
  }
});

// Get active quiz
router.get("/active", async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne().sort({ createdAt: -1 });
    if (!quiz) {
      return res.status(404).json({ error: "No active quiz" });
    }
    res.json({
      id: quiz._id,
      question: quiz.question,
      options: quiz.options,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
