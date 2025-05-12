const express = require("express");
const router = express.Router();
const groupController = require("./controllers/GroupController");
const authMiddleware = require("./middleware/auth");

router.post("/", authMiddleware, groupController.createGroup);
router.put("/:groupId", authMiddleware, groupController.updateGroupDetails);
router.delete("/:groupId", authMiddleware, groupController.deleteGroup);
router.post("/:groupId/join", authMiddleware, groupController.joinGroup);
router.post("/:groupId/leave", authMiddleware, groupController.leaveGroup);
router.get("/:groupId", groupController.getGroupById);
router.get("/:groupId/posts", groupController.getGroupPosts);
router.post("/:groupId/posts", authMiddleware, groupController.postToGroup);
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  groupController.commentOnGroupPost
);
router.post(
  "/:groupId/moderator/:userId",
  authMiddleware,
  groupController.promoteToModerator
);
router.post(
  "/:groupId/ban/:userId",
  authMiddleware,
  groupController.banUserFromGroup
);
router.get("/", groupController.getAllGroups);
router.get("/search", groupController.searchGroups);

module.exports = router;
