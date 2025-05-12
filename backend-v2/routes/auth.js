const express = require("express");
const router = express.Router();
const authController = require("./controllers/AuthController");
const { authenticateToken } = require("./middleware/auth");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", authenticateToken, authController.getCurrentUser);

module.exports = router;
