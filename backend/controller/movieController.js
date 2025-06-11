const { check, validationResult } = require("express-validator");
const Movie = require("../models/movies");
const MovieRequest = require("../models/movieRequest");
const User = require("../models/user");
const Flag = require("../models/flags");
const axios = require("axios");

// TMDB Service
const TMDB_API_URL = process.env.TMDB_API_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const syncMovieFromTMDB = async (tmdbId) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${tmdbId}`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });
    const movie = response.data;
    return {
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genres.map((g) => g.name),
      grossRevenue: 0, // Mock; replace with real data
    };
  } catch (err) {
    throw new Error(`Failed to sync TMDB movie ${tmdbId}`);
  }
};

// Validation middleware
const validateMovie = [
  check("tmdbId").isNumeric().withMessage("Valid TMDB ID required"),
  check("title").notEmpty().withMessage("Title is required"),
  check("genres").isArray().withMessage("Genres must be an array"),
];

// GET: All movies from DB
const getAllMovies = async (req, res) => {
  try {
    const { genre, page = 1, limit = 20 } = req.query;
    const query = genre ? { genres: genre } : {};
    const movies = await Movie.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("tmdbId title posterPath releaseDate grossRevenue genres");
    const total = await Movie.countDocuments(query);
    res
      .status(200)
      .json({ movies, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch movies", message: error.message });
  }
};

// POST: Add a new movie (Admin/Analyst only)
const addMovie = [
  ...validateMovie,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { tmdbId } = req.body;
      let movie = await Movie.findOne({ tmdbId });
      if (movie) {
        return res.status(400).json({ error: "Movie already exists" });
      }
      const tmdbData = await syncMovieFromTMDB(tmdbId);
      movie = new Movie({ ...tmdbData, ...req.body });
      await movie.save();
      res.status(201).json({ message: "Movie added successfully", movie });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to add movie", message: error.message });
    }
  },
];

// PUT: Update a movie (Admin/Analyst only)
const updateMovie = [
  check("tmdbId").optional().isNumeric().withMessage("Valid TMDB ID required"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      // Prevent updating tmdbId
      if (req.body.tmdbId && req.body.tmdbId !== movie.tmdbId) {
        return res.status(400).json({ error: "Cannot update tmdbId" });
      }
      const updated = await Movie.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      res.json({ message: "Movie updated successfully", movie: updated });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update movie", message: error.message });
    }
  },
];

// DELETE: Delete a movie (Admin only)
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    await Movie.findByIdAndDelete(id);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete movie", message: error.message });
  }
};

// POST: Submit a movie request
const addMovieRequest = [
  check("title").notEmpty().withMessage("Title is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("reason").notEmpty().withMessage("Reason is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { tmdbId, title, description, genres, reason } = req.body;
      const userId = req.user.id;
      let movie = tmdbId ? await Movie.findOne({ tmdbId }) : null;
      if (tmdbId && !movie) {
        const tmdbData = await syncMovieFromTMDB(tmdbId);
        movie = new Movie(tmdbData);
        await movie.save();
      }
      const newRequest = new MovieRequest({
        tmdbId,
        title,
        description,
        genres,
        reason,
        userId,
      });
      await newRequest.save();
      // Create flag for moderation
      const flag = new Flag({
        contentType: "movieRequest",
        contentId: newRequest._id,
        reason: `Movie Request: ${title} - ${reason}`,
        userId,
      });
      await flag.save();
      res
        .status(201)
        .json({ message: "Movie request submitted", request: newRequest });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to submit request", message: error.message });
    }
  },
];

// DELETE: Remove a movie request (User or Admin)
const deleteMovieRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const request = await MovieRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    if (request.userId.toString() !== userId && req.user.role !== "Analyst") {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this request" });
    }
    await MovieRequest.findByIdAndDelete(id);
    await Flag.deleteMany({ contentType: "movieRequest", contentId: id });
    res.json({ message: "Movie request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete request", message: error.message });
  }
};

// POST: Suggest a movie to another user
const suggestMovieToUser = [
  check("tmdbId").isNumeric().withMessage("Valid TMDB ID required"),
  check("message").notEmpty().withMessage("Message is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const senderId = req.user.id;
    const { receiverId } = req.params;
    const { tmdbId, message } = req.body;

    try {
      const sender = await User.findById(senderId).select("username");
      const receiver = await User.findById(receiverId).select(
        "username suggestedMovies"
      );
      const movie = await Movie.findOne({ tmdbId }).select(
        "tmdbId title posterPath"
      );

      if (!sender || !receiver) {
        return res.status(404).json({ error: "Sender or receiver not found" });
      }
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      receiver.suggestedMovies.push({
        movieId: movie.tmdbId,
        suggestedBy: sender._id,
        message,
      });
      await receiver.save();

      res.json({
        message: `Movie "${movie.title}" suggested to ${receiver.username}`,
        suggestion: {
          from: sender.username,
          to: receiver.username,
          movie: {
            id: movie.tmdbId,
            title: movie.title,
            posterPath: movie.posterPath,
          },
          note: message,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to suggest movie", message: error.message });
    }
  },
];

// GET: Get movie suggestions for the logged-in user
const getSuggestionsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("suggestedMovies.suggestedBy", "username")
      .select("suggestedMovies")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const suggestions = await Promise.all(
      user.suggestedMovies.map(async (suggestion) => {
        const movie = await Movie.findOne({
          tmdbId: suggestion.movieId,
        }).select("tmdbId title posterPath");
        return {
          ...suggestion,
          movie: movie
            ? {
                id: movie.tmdbId,
                title: movie.title,
                posterPath: movie.posterPath,
              }
            : null,
        };
      })
    );

    res.json({ suggestions });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch suggestions", message: error.message });
  }
};

// GET: Get box office leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { period = "yearly" } = req.query;
    let dateFilter = {};
    const now = new Date();
    if (period === "weekly") {
      dateFilter = {
        releaseDate: {
          $gte: new Date(now.setDate(now.getDate() - 7))
            .toISOString()
            .split("T")[0],
        },
      };
    } else if (period === "monthly") {
      dateFilter = {
        releaseDate: {
          $gte: new Date(now.setMonth(now.getMonth() - 1))
            .toISOString()
            .split("T")[0],
        },
      };
    } else if (period === "yearly") {
      dateFilter = {
        releaseDate: {
          $gte: new Date(now.setFullYear(now.getFullYear() - 1))
            .toISOString()
            .split("T")[0],
        },
      };
    }

    const movies = await Movie.find(dateFilter)
      .sort({ grossRevenue: -1 })
      .limit(10)
      .select("tmdbId title grossRevenue releaseDate");

    res.json({ leaderboard: movies });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch leaderboard", message: error.message });
  }
};

// GET: Get chart data
const getChartData = async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ grossRevenue: -1 })
      .limit(5)
      .select("title grossRevenue");

    const chartData = {
      labels: movies.map((m) => m.title),
      datasets: [
        {
          label: "Gross Revenue (USD)",
          data: movies.map((m) => m.grossRevenue),
        },
      ],
    };

    res.json({ chartData });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch chart data", message: error.message });
  }
};

module.exports = {
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  addMovieRequest,
  deleteMovieRequest,
  suggestMovieToUser,
  getSuggestionsForUser,
  getLeaderboard,
  getChartData,
};
