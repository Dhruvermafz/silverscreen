const express = require("express");
const router = express.Router();
const moderationController = require("./controllers/ModerationController");
const authMiddleware = require("./middleware/auth");

router.post(
  "/flag/:contentId/:type",
  authMiddleware,
  moderationController.flagContent
);
router.get(
  "/flagged",
  authMiddleware,
  moderationController.reviewFlaggedContent
);
router.post("/ban/:userId", authMiddleware, moderationController.banUser);
router.post("/warn/:userId", authMiddleware, moderationController.warnUser);
router.get("/reports", authMiddleware, moderationController.getReports);
router.patch(
  "/resolve/:reportId",
  authMiddleware,
  moderationController.resolveReport
);

module.exports = router;
