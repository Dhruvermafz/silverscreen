const Movie = require("../models/movies");
const MovieRequest = require("../models/movieRequest");
const User = require("../models/user");
// GET: All movies from your DB
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

// POST: Add a new movie
const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json({ message: "Movie added", movie: newMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
};

// PUT: Update a movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Movie updated", movie: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie" });
  }
};

// DELETE: Delete a movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.status(200).json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" });
  }
};

// POST: Submit a movie request
const addMovieRequest = async (req, res) => {
  try {
    const newRequest = new MovieRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Request submitted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit request" });
  }
};

// DELETE: Remove a movie request
const deleteMovieRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await MovieRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
};

const suggestMovieToUser = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.params;
  const { tmdbId, message } = req.body;

  if (!tmdbId || !message) {
    return res
      .status(400)
      .json({ error: "Movie ID and message are required." });
  }

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const movie = await Movie.findOne({ tmdbId });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found." });
    }

    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    // Save suggestion in receiver's document
    receiver.suggestedMovies.push({
      movieId: movie.tmdbId,
      suggestedBy: sender._id,
      message,
    });

    await receiver.save();

    res.status(200).json({
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
    console.error("Error suggesting movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getSuggestionsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("suggestedMovies.suggestedBy", "username avatar")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ suggestions: user.suggestedMovies });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
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
};
