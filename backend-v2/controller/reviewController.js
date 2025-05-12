const mongoose = require("mongoose");
const Review = require("../models/review"); // Adjust path to your Review model
const Movie = require("../models/movie"); // Adjust path to your Movie model
const User = require("../models/user"); // Adjust path to your User model

// Add a review for a film
const addReview = async (req, res) => {
  try {
    const { filmId } = req.params;
    const { rating, reviewText, isSpoiler } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }
    if (!rating || rating < 0 || rating > 10) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 10" });
    }
    if (!reviewText) {
      return res.status(400).json({ message: "Review text is required" });
    }

    // Check if movie exists
    const movie = await Movie.findById(filmId);
    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: userId,
      movie: filmId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this film" });
    }

    // Create review
    const review = new Review({
      user: userId,
      movie: filmId,
      rating,
      reviewText,
      isSpoiler: isSpoiler || false,
    });

    await review.save();

    // Update movie's average rating
    const reviews = await Review.find({ movie: filmId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Movie.findByIdAndUpdate(filmId, {
      averageRating: avgRating.toFixed(2),
    });

    // Add to user's diary
    await User.findByIdAndUpdate(userId, {
      $push: {
        diary: {
          movie: filmId,
          watchedAt: new Date(),
          review: reviewText,
          rating,
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a review
const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText, isSpoiler } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
    if (rating && (rating < 0 || rating > 10)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 10" });
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is authorized
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update review
    review.rating = rating !== undefined ? rating : review.rating;
    review.reviewText = reviewText || review.reviewText;
    review.isSpoiler = isSpoiler !== undefined ? isSpoiler : review.isSpoiler;
    review.updatedAt = Date.now();

    await review.save();

    // Update movie's average rating
    const reviews = await Review.find({ movie: review.movie });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Movie.findByIdAndUpdate(review.movie, {
      averageRating: avgRating.toFixed(2),
    });

    // Update user's diary
    await User.updateOne(
      { _id: userId, "diary.movie": review.movie },
      {
        $set: {
          "diary.$.review": review.reviewText,
          "diary.$.rating": review.rating,
          "diary.$.watchedAt": new Date(),
        },
      }
    );

    res.json(review);
  } catch (error) {
    console.error("Edit review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is authorized
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete review
    await Review.deleteOne({ _id: reviewId });

    // Update movie's average rating
    const reviews = await Review.find({ movie: review.movie });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Movie.findByIdAndUpdate(review.movie, {
      averageRating: avgRating.toFixed(2),
    });

    // Remove from user's diary
    await User.updateOne(
      { _id: userId },
      { $pull: { diary: { movie: review.movie } } }
    );

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews by film
const getReviewsByFilm = async (req, res) => {
  try {
    const { filmId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return res.status(400).json({ message: "Invalid film ID" });
    }

    // Check if movie exists
    const movie = await Movie.findById(filmId);
    if (!movie) {
      return res.status(404).json({ message: "Film not found" });
    }

    const reviews = await Review.find({ movie: filmId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 }); // Newest first

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews by film error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews by user
const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = await Review.find({ user: userId })
      .populate("movie", "title poster")
      .sort({ createdAt: -1 }); // Newest first

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews by user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle spoiler status of a review
const toggleSpoiler = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is authorized
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Toggle spoiler status
    review.isSpoiler = !review.isSpoiler;
    review.updatedAt = Date.now();

    await review.save();

    res.json(review);
  } catch (error) {
    console.error("Toggle spoiler error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Rate a review as helpful
const rateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Prevent user from marking their own review as helpful
    if (review.user.toString() === userId) {
      return res.status(400).json({ message: "Cannot rate your own review" });
    }

    // Toggle helpful status
    const isHelpful = review.helpful.includes(userId);
    if (isHelpful) {
      review.helpful = review.helpful.filter((id) => id.toString() !== userId);
    } else {
      review.helpful.push(userId);
    }

    await review.save();

    res.json({
      message: isHelpful ? "Removed helpful mark" : "Marked as helpful",
      helpfulCount: review.helpful.length,
    });
  } catch (error) {
    console.error("Rate review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addReview,
  editReview,
  deleteReview,
  getReviewsByFilm,
  getReviewsByUser,
  toggleSpoiler,
  rateReview,
};
