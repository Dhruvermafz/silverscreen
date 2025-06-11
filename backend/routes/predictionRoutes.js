const express = require("express");
const router = express.Router();
const Prediction = require("../models/prediction");
const Movie = require("../models/Movie");
const { auth } = require("../middleware/auth");

// Submit prediction
router.post("/submit", auth, async (req, res, next) => {
  try {
    const { movieId, predictedGross, reason } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    const prediction = new Prediction({
      userId: req.user.userId,
      movieId,
      predictedGross,
      reason,
    });
    await prediction.save();
    res.status(201).json({ message: "Prediction submitted", prediction });
  } catch (err) {
    next(err);
  }
});

// Score predictions (Admin only)
router.post("/score", auth, restrictTo("Analyst"), async (req, res, next) => {
  try {
    const { predictionId, actualGross } = req.body;
    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }
    const accuracy =
      1 - Math.abs(actualGross - prediction.predictedGross) / actualGross;
    prediction.actualGross = actualGross;
    prediction.isCorrect = accuracy > 0.9; // 90% accuracy threshold
    prediction.score = Math.round(accuracy * 100);
    await prediction.save();
    // Update analyst accuracy
    const analyst = await Analyst.findOne({ userId: prediction.userId });
    if (analyst) {
      const predictions = await Prediction.find({ userId: prediction.userId });
      analyst.predictionAccuracy =
        predictions.reduce((sum, p) => sum + (p.score || 0), 0) /
        predictions.length;
      await analyst.save();
    }
    res.json({ message: "Prediction scored", prediction });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
