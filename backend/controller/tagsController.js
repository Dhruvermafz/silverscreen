// controllers/TagController.js
const mongoose = require("mongoose");
const Tag = require("../models/tags"); // Adjust path to your Tag model
const Movie = require("../models/movies"); // Adjust path to your Movie model

// Add a tag to a film
const addTagToFilm = async (req, res) => {
  try {
    const { filmId } = req.params;
    const { tagName } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }
    if (!tagName || typeof tagName !== "string" || tagName.trim() === "") {
      return res.status(400).json({ message: "Valid tag name is required" });
    }

    // Check if movie exists
    const movie = await Movie.findById(filmId);
    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    // Normalize tag name (lowercase, trimmed)
    const normalizedTagName = tagName.trim().toLowerCase();

    // Find or create tag
    let tag = await Tag.findOne({ name: normalizedTagName });
    if (!tag) {
      tag = new Tag({
        name: normalizedTagName,
        movies: [filmId],
        usageCount: 1,
      });
    } else {
      // Check if movie is already tagged
      if (tag.movies.includes(filmId)) {
        return res.status(400).json({ message: "Film already has this tag" });
      }
      tag.movies.push(filmId);
      tag.usageCount += 1;
    }

    await tag.save();

    // Add tag to movie's tags array
    if (!movie.tags.includes(normalizedTagName)) {
      movie.tags.push(normalizedTagName);
      await movie.save();
    }

    res.json({ message: `Tag "${normalizedTagName}" added to film`, tag });
  } catch (error) {
    console.error("Add tag to film error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tags by film
const getTagsByFilm = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }

    // Find movie
    const movie = await Movie.findById(filmId).select("tags");
    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    // Get tags from Tag collection that reference this movie
    const tags = await Tag.find({ movies: filmId }).select("name usageCount");

    res.json({
      filmId,
      tags: tags.map((tag) => ({
        name: tag.name,
        usageCount: tag.usageCount,
      })),
    });
  } catch (error) {
    console.error("Get tags by film error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().select("name usageCount").sort({ name: 1 }); // Sort alphabetically

    res.json(tags);
  } catch (error) {
    console.error("Get all tags error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get films by tag
const getTaggedFilms = async (req, res) => {
  try {
    const { tagName } = req.params;

    if (!tagName || typeof tagName !== "string" || tagName.trim() === "") {
      return res.status(400).json({ message: "Valid tag name is required" });
    }

    // Normalize tag name
    const normalizedTagName = tagName.trim().toLowerCase();

    // Find tag
    const tag = await Tag.findOne({ name: normalizedTagName }).populate(
      "movies",
      "title poster releaseDate averageRating"
    );
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json({
      tag: normalizedTagName,
      films: tag.movies,
    });
  } catch (error) {
    console.error("Get tagged films error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get popular tags
const getPopularTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .select("name usageCount")
      .sort({ usageCount: -1, name: 1 }) // Sort by usage count (desc), then name
      .limit(10); // Top 10 popular tags

    res.json(tags);
  } catch (error) {
    console.error("Get popular tags error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addTagToFilm,
  getTagsByFilm,
  getAllTags,
  getTaggedFilms,
  getPopularTags,
};
