const Review = require("../models/reviews");
const axios = require("axios");

// Add a review
exports.addReview = async (req, res) => {
  const { movieId, ratingCategory, comment } = req.body;

  try {
    // Validate movieId format (must be a numeric string)
    if (!movieId || !/^\d+$/.test(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    // Validate ratingCategory
    const validCategories = [
      "GREAT",
      "MEH",
      "ITS A EXPERIENCE",
      "IGNORE",
      "FUN TO WATCH",
      "ONE TIME WATCH",
    ];
    if (!ratingCategory || !validCategories.includes(ratingCategory)) {
      return res
        .status(400)
        .json({ error: "Invalid rating category", validCategories });
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
      ratingCategory, // Use ratingCategory instead of rating
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
// Get a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Validate reviewId format (must be a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId).populate("user", "username");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { ratingCategory, comment } = req.body;

  try {
    // Validate reviewId format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user is authorized to update the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // Validate ratingCategory if provided
    if (ratingCategory) {
      const validCategories = [
        "GREAT",
        "MEH",
        "ITS A EXPERIENCE",
        "IGNORE",
        "FUN TO WATCH",
        "ONE TIME WATCH",
      ];
      if (!validCategories.includes(ratingCategory)) {
        return res
          .status(400)
          .json({ error: "Invalid rating category", validCategories });
      }
      review.ratingCategory = ratingCategory;
    }

    // Update comment if provided
    if (comment !== undefined) {
      review.comment = comment;
    }

    // Save the updated review
    await review.save();

    // Populate user field for response
    const populatedReview = await review.populate("user", "username");
    res.json(populatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
