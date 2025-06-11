const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const { auth } = require("../middleware/auth");
const {
  calculateLeaderboard,
  calculateChartData,
} = require("../services/analyticsService");
const { getPopularMovies } = require("../services/tmdbService");

// Get box office data (Portal)
router.get("/data", async (req, res, next) => {
  try {
    const { genre, page = 1 } = req.query;
    let movies;
    if (genre) {
      movies = await Movie.find({ genres: genre })
        .skip((page - 1) * 20)
        .limit(20);
    } else {
      movies = await Movie.find()
        .skip((page - 1) * 20)
        .limit(20);
    }
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res, next) => {
  try {
    const { period = "yearly" } = req.query;
    const leaderboard = await calculateLeaderboard(period);
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
});

// Get chart data
router.get("/charts", async (req, res, next) => {
  try {
    const chartData = await calculateChartData();
    res.json(chartData);
  } catch (err) {
    next(err);
  }
});

// Sync popular movies from TMDB (Admin only)
router.post("/sync", auth, async (req, res, next) => {
  try {
    const { page = 1 } = req.body;
    const tmdbMovies = await getPopularMovies(page);
    const movies = await Promise.all(
      tmdbMovies.map(async (movie) => {
        const existingMovie = await Movie.findOne({ tmdbId: movie.tmdbId });
        if (!existingMovie) {
          return new Movie({
            ...movie,
            grossRevenue: Math.floor(Math.random() * 1000000000), // Mock data
          }).save();
        }
        return existingMovie;
      })
    );
    res.json({ message: "Movies synced successfully", movies });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
