const express = require("express");
const router = express.Router();
const newsroomController = require("./controllers/NewsroomController");
const authMiddleware = require("./middleware/auth");

router.post("/", authMiddleware, newsroomController.createNewsroom);
router.put("/:newsroomId", authMiddleware, newsroomController.updateNewsroom);
router.get("/:newsroomId", newsroomController.getNewsroomById);
router.post(
  "/:newsroomId/moderator/:userId",
  authMiddleware,
  newsroomController.addNewsroomModerator
);
router.post(
  "/:newsroomId/posts",
  authMiddleware,
  newsroomController.postNewsToNewsroom
);
router.put("/posts/:postId", authMiddleware, newsroomController.editNewsPost);
router.delete(
  "/posts/:postId",
  authMiddleware,
  newsroomController.deleteNewsPost
);
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  newsroomController.commentOnNewsPost
);
router.get("/", newsroomController.getAllNewsrooms);
router.get("/:newsroomId/posts", newsroomController.getAllNewsPosts);

module.exports = router;
