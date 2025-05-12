const express = require("express");
const router = express.Router();
const reviewController = require("./controllers/ReviewController");
const authMiddleware = require("./middleware/auth");

router.post("/:filmId", authMiddleware, reviewController.addReview);
router.put("/:reviewId", authMiddleware, reviewController.editReview);
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);
router.get("/film/:filmId", reviewController.getReviewsByFilm);
router.get("/user/:userId", reviewController.getReviewsByUser);
router.patch(
  "/:reviewId/spoiler",
  authMiddleware,
  reviewController.toggleSpoiler
);
router.patch("/:reviewId/helpful", authMiddleware, reviewController.rateReview);

module.exports = router;
