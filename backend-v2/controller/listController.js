const mongoose = require("mongoose");
const List = require("../models/list"); // Adjust path to your List model
const Movie = require("../models/movie"); // Adjust path to your Movie model
const User = require("../models/user"); // Adjust path to your User model

// Create a new list
const createList = async (req, res) => {
  try {
    const { title, description, tags, isCollaborative, collaborators } =
      req.body;
    const creatorId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate collaborators if provided
    if (collaborators && collaborators.length > 0) {
      const validCollaborators = await User.find({
        _id: { $in: collaborators },
      });
      if (validCollaborators.length !== collaborators.length) {
        return res
          .status(400)
          .json({ message: "One or more collaborators are invalid" });
      }
    }

    // Create list
    const list = new List({
      title,
      description,
      creator: creatorId,
      tags,
      isCollaborative: isCollaborative || false,
      collaborators: collaborators || [],
    });

    await list.save();

    res.status(201).json(list);
  } catch (error) {
    console.error("Create list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a list
const editList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description, tags, isCollaborative, collaborators } =
      req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid list ID" });
    }

    // Find list
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Check authorization (creator or collaborator for collaborative lists)
    const isCreator = list.creator.toString() === userId;
    const isCollaborator =
      list.isCollaborative && list.collaborators.includes(userId);
    if (!isCreator && !isCollaborator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Validate collaborators if provided
    if (collaborators && collaborators.length > 0) {
      const validCollaborators = await User.find({
        _id: { $in: collaborators },
      });
      if (validCollaborators.length !== collaborators.length) {
        return res
          .status(400)
          .json({ message: "One or more collaborators are invalid" });
      }
    }

    // Update list
    list.title = title || list.title;
    list.description =
      description !== undefined ? description : list.description;
    list.tags = tags || list.tags;
    list.isCollaborative =
      isCollaborative !== undefined ? isCollaborative : list.isCollaborative;
    list.collaborators = collaborators || list.collaborators;
    list.updatedAt = Date.now();

    await list.save();

    res.json(list);
  } catch (error) {
    console.error("Edit list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a list
const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid list ID" });
    }

    // Find list
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Check if user is creator
    if (list.creator.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete list
    await List.deleteOne({ _id: listId });

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Delete list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get list by ID
const getListById = async (req, res) => {
  try {
    const { listId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid list ID" });
    }

    const list = await List.findById(listId)
      .populate("creator", "username avatar")
      .populate("movies", "title poster releaseDate")
      .populate("collaborators", "username avatar");

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json(list);
  } catch (error) {
    console.error("Get list by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a film to a list
const addFilmToList = async (req, res) => {
  try {
    const { listId, filmId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(listId) ||
      !mongoose.Types.ObjectId.isValid(filmId)
    ) {
      return res.status(400).json({ message: "Invalid list or film ID" });
    }

    // Find list and movie
    const list = await List.findById(listId);
    const movie = await Movie.findById(filmId);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    // Check authorization (creator or collaborator for collaborative lists)
    const isCreator = list.creator.toString() === userId;
    const isCollaborator =
      list.isCollaborative && list.collaborators.includes(userId);
    if (!isCreator && !isCollaborator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if movie is already in list
    if (list.movies.includes(filmId)) {
      return res.status(400).json({ message: "Film already in list" });
    }

    // Add movie to list
    list.movies.push(filmId);
    list.updatedAt = Date.now();

    await list.save();

    res.json({ message: `Film added to ${list.title}` });
  } catch (error) {
    console.error("Add film to list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a film from a list
const removeFilmFromList = async (req, res) => {
  try {
    const { listId, filmId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectIds
    if (
      !mongoose.Types.integrableId(listId) ||
      !mongoose.Types.ObjectId.isValid(filmId)
    ) {
      return res.status(400).json({ message: "Invalid list or film ID" });
    }

    // Find list
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Check authorization (creator or collaborator for collaborative lists)
    const isCreator = list.creator.toString() === userId;
    const isCollaborator =
      list.isCollaborative && list.collaborators.includes(userId);
    if (!isCreator && !isCollaborator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if movie is in list
    if (!list.movies.includes(filmId)) {
      return res.status(400).json({ message: "Film not in list" });
    }

    // Remove movie from list
    list.movies = list.movies.filter((id) => id.toString() !== filmId);
    list.updatedAt = Date.now();

    await list.save();

    res.json({ message: `Film removed from ${list.title}` });
  } catch (error) {
    console.error("Remove film from list error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get lists by user
const getListsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lists = await List.find({
      $or: [{ creator: userId }, { collaborators: userId }],
    })
      .populate("creator", "username avatar")
      .populate("movies", "title poster releaseDate")
      .populate("collaborators", "username avatar")
      .sort({ createdAt: -1 }); // Newest first

    res.json(lists);
  } catch (error) {
    console.error("Get lists by user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get featured lists
const getFeaturedLists = async (req, res) => {
  try {
    // Assume featured lists based on number of movies and recent updates
    // You can enhance this with metrics like popularity or curator status
    const lists = await List.find()
      .populate("creator", "username avatar")
      .populate("movies", "title poster releaseDate")
      .populate("collaborators", "username avatar")
      .sort({ "movies.length": -1, updatedAt: -1 }) // Sort by movie count and recency
      .limit(10); // Top 10 featured lists

    res.json(lists);
  } catch (error) {
    console.error("Get featured lists error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createList,
  editList,
  deleteList,
  getListById,
  addFilmToList,
  removeFilmFromList,
  getListsByUser,
  getFeaturedLists,
};
