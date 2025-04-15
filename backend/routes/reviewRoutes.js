const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controller/reviewController");

router.post("/", protect, addReview);
router.get("/:movieId", getReviews);
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
