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
