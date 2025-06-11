const express = require("express");
const router = express.Router();
const News = require("../models/News");
const { auth, restrictTo } = require("../middleware/auth");

// Create news article (Admin only)
router.post("/create", auth, restrictTo("Analyst"), async (req, res, next) => {
  try {
    const { title, excerpt, source, date } = req.body;
    const news = new News({ title, excerpt, source, date });
    await news.save();
    res.status(201).json({ message: "News created", news });
  } catch (err) {
    next(err);
  }
});

// Get news articles
router.get("/", async (req, res, next) => {
  try {
    const news = await News.find().sort({ date: -1 }).limit(10);
    res.json(news);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
