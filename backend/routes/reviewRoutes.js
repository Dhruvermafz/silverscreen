const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", auth, addReview);
router.get("/:movieId", getReviews);
router.delete("/:reviewId", auth, deleteReview);

module.exports = router;
