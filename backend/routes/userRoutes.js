const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const protect = require("../middleware/authMiddleware");

// GET logged-in user's profile
router.get("/profile", protect, userController.getProfile);

// UPDATE profile
router.put("/profile", protect, userController.updateProfile);

// GET all users
router.get("/", userController.getAllUsers);

// GET user by ID
router.get("/:id", protect, userController.getUserById);

// DELETE user by ID
router.delete("/:id", protect, userController.deleteUser);
router.get("/members", userController.getAllMembers);

module.exports = router;
