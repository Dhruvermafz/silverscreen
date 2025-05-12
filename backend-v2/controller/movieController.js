const mongoose = require("mongoose");
const Movie = require("../models/movie"); // Adjust path to your Movie model

// Get film by ID
const getFilmById = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }

    const movie = await Movie.findById(filmId);

    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    res.json(movie);
  } catch (error) {
    console.error("Get film by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search films by query
const searchFilms = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search by title, genre, cast, or tags (case-insensitive)
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { cast: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).limit(20); // Limit results for performance

    res.json(movies);
  } catch (error) {
    console.error("Search films error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get trending films
const getTrendingFilms = async (req, res) => {
  try {
    // Assume trending based on averageRating and recent release
    const movies = await Movie.find()
      .sort({ averageRating: -1, releaseDate: -1 }) // Sort by rating and recency
      .limit(10); // Top 10 trending films

    res.json(movies);
  } catch (error) {
    console.error("Get trending films error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get box office data for a film
const getBoxOfficeData = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }

    const movie = await Movie.findById(filmId).select("title");

    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    // Placeholder: Box office data typically requires an external API (e.g., IMDb, Box Office Mojo)
    // For now, return a mock response
    const boxOfficeData = {
      filmId,
      title: movie.title,
      boxOffice: {
        domestic: "N/A",
        worldwide: "N/A",
        budget: "N/A",
        // Add real data via API integration
      },
    };

    res.json(boxOfficeData);
  } catch (error) {
    console.error("Get box office data error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get streaming availability for a film
const getStreamingAvailability = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }

    const movie = await Movie.findById(filmId).select("title streaming");

    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    res.json({
      filmId,
      title: movie.title,
      streaming: movie.streaming || [], // Return streaming platforms
    });
  } catch (error) {
    console.error("Get streaming availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cast and crew for a film
const getCastAndCrew = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }

    const movie = await Movie.findById(filmId).select("title cast crew");

    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    res.json({
      filmId,
      title: movie.title,
      cast: movie.cast || [],
      crew: movie.crew || [],
    });
  } catch (error) {
    console.error("Get cast and crew error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFilmById,
  searchFilms,
  getTrendingFilms,
  getBoxOfficeData,
  getStreamingAvailability,
  getCastAndCrew,
};
