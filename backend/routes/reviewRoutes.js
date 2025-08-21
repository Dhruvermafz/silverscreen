const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  addReview,
  getReviews,
  deleteReview,
  getReviewById,
  updateReview,
} = require("../controller/reviewController");

// Add a new review (requires authentication)
router.post("/", protect, addReview);

// Get all reviews for a movie
router.get("/:movieId", getReviews);

// Get a single review by ID
router.get("/review/:reviewId", getReviewById);

// Update a review (requires authentication)
router.put("/:reviewId", protect, updateReview);

// Delete a review (requires authentication)
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
