const express = require("express");
const router = express.Router();
const {
  getLists,
  getListsByUserId,
  createList,
  deleteList,
  addMovieToList,
  updateList,
} = require("../controller/listController");
const protect = require("../middleware/authMiddleware");
// Get all public lists
router.get("/", protect, getLists);

// Get all lists by user ID (public and private, with authorization)
router.get("/user/:userId", protect, getListsByUserId);

// Create a new list
router.post("/", protect, createList);

// Delete a list
router.delete("/:id", protect, deleteList);

// Add a movie to a list
router.post("/:listId/movies", protect, addMovieToList);

// Update a list
router.put("/:listId", protect, updateList);

module.exports = router;
