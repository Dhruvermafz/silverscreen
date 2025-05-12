const express = require("express");
const router = express.Router();
const userController = require("./controllers/UserController");
const authMiddleware = require("./middleware/auth");

router.get("/:userId", userController.getUserProfile);
router.put("/:userId", authMiddleware, userController.updateUserProfile);
router.get("/:userId/watchlist", userController.getWatchlist);
router.get("/:userId/favorites", userController.getFavorites);
router.get("/:userId/diary", userController.getUserDiary);
router.get("/:userId/stats", userController.getUserStats);
router.post("/:targetUserId/follow", authMiddleware, userController.followUser);
router.post(
  "/:targetUserId/unfollow",
  authMiddleware,
  userController.unfollowUser
);

module.exports = router;
