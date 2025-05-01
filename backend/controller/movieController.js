const Movie = require("../models/movies");
const MovieRequest = require("../models/movieRequest");

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

module.exports = {
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  addMovieRequest,
  deleteMovieRequest,
};
