const Review = require("../models/reviews");
const axios = require("axios");

// Add a review
exports.addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    // Validate movieId format (must be a numeric string)
    if (!movieId || !/^\d+$/.test(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    // Optional: Validate movieId with TMDb API
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }
      );
      if (!response.data) {
        return res.status(404).json({ error: "Movie not found in TMDb" });
      }
    } catch (tmdbError) {
      // Log error but allow review to proceed (optional fallback)
      console.error("TMDb API error:", tmdbError.message);
      // Optionally: Skip review creation if TMDb validation fails
      // return res.status(404).json({ error: "Movie not found in TMDb" });
    }

    const review = await Review.create({
      user: req.user.id,
      movie: movieId, // Store TMDb movie ID as string
      rating,
      comment,
    });

    // Populate user field for response
    const populatedReview = await review.populate("user", "username");
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Get reviews for a movie
exports.getReviews = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Validate movieId format
    if (!movieId || !/^\d+$/.test(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const reviews = await Review.find({ movie: movieId }).populate(
      "user",
      "username"
    );
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
