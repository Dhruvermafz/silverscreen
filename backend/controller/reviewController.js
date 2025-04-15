const Review = require("../models/reviews");

exports.addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const review = await Review.create({
    user: req.user.id,
    movie: movieId,
    rating,
    comment,
  });
  res.json(review);
};

exports.getReviews = async (req, res) => {
  const { movieId } = req.params;
  const reviews = await Review.find({ movie: movieId }).populate(
    "user",
    "username"
  );
  res.json(reviews);
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (review.user.toString() !== req.user.id)
    return res.status(403).json({ error: "Not allowed" });

  await review.remove();
  res.json({ message: "Review deleted" });
};
// getAllReviews, updateReview
