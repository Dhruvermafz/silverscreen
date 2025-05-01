const List = require("../models/list");

// Get all lists
exports.getLists = async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lists." });
  }
};

// Create a new list
exports.createList = async (req, res) => {
  try {
    const { name } = req.body;
    const newList = new List({ name, movies: [] });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: "Error creating list." });
  }
};

// Delete a list
exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
    res.json({ message: "List deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting list." });
  }
};

// Add a movie to a specific list
exports.addMovieToList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { movie } = req.body;

    if (!movie || !movie.id || !movie.title) {
      return res
        .status(400)
        .json({ message: "Movie object with id and title is required." });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    // Prevent duplicates
    const alreadyExists = list.movies.some((m) => m.movieId === movie.id);
    if (alreadyExists) {
      return res.status(400).json({ message: "Movie already in the list." });
    }

    // Add movie
    list.movies.push({
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
    });

    await list.save();
    res.status(200).json({ message: "Movie added to list.", list });
  } catch (error) {
    console.error("Error adding movie to list:", error);
    res.status(500).json({ message: "Error adding movie to list." });
  }
};
