const List = require("../models/list");

// Get all public lists
exports.getLists = async (req, res) => {
  try {
    // Fetch only public lists
    const lists = await List.find({ isPrivate: false });
    res.json(lists);
  } catch (error) {
    console.error("Error fetching public lists:", error);
    res.status(500).json({ message: "Error fetching public lists." });
  }
};

// Get all lists by userId (public and private, with authorization)
exports.getListsByUserId = async (req, res) => {
  try {
    const userId = req.user?.id; // Authenticated user's ID
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { userId: targetUserId } = req.params; // User ID from route parameter
    if (!targetUserId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Check if the authenticated user is the target user or an admin
    const isAdmin = req.user?.role === "admin"; // Assuming req.user.role exists
    if (userId !== targetUserId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this user's lists." });
    }

    // Fetch all lists (public and private) for the target user
    const lists = await List.find({ userId: targetUserId });
    res.json(lists);
  } catch (error) {
    console.error("Error fetching lists by user ID:", error);
    res.status(500).json({ message: "Error fetching lists by user ID." });
  }
};

// Create a new list
exports.createList = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { name, isPrivate = false } = req.body;
    if (!name) {
      return res.status(400).json({ message: "List name is required." });
    }

    const newList = new List({
      name,
      userId,
      isPrivate,
      movies: [],
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ message: "Error creating list." });
  }
};

// Delete a list
exports.deleteList = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    // Check if the user is authorized to delete the list
    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this list." });
    }

    await List.findByIdAndDelete(id);
    res.json({ message: "List deleted successfully." });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Error deleting list." });
  }
};

// Add a movie to a specific list
exports.addMovieToList = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

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

    // Check if the user is authorized to modify the list
    if (list.isPrivate && list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this list." });
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

// Update a list
exports.updateList = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const { listId } = req.params;
    const { name, isPrivate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "List name is required." });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found." });
    }

    // Check if the user is authorized to modify the list
    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this list." });
    }

    list.name = name;
    if (isPrivate !== undefined) {
      list.isPrivate = isPrivate;
    }

    await list.save();
    res.status(200).json({ message: "List updated successfully.", list });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ message: "Error updating list." });
  }
};
