// src/components/Movie/MovieReview.js
import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} from "../../actions/reviewApi";

const MovieReview = ({
  movieId,
  triggerModal = false,
  onModalClose = () => {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(triggerModal);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsQuery(movieId);
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const modalRef = useRef(null);
  const firstFocusableElement = useRef(null);

  // Handle modal open/close
  useEffect(() => {
    setIsModalOpen(triggerModal);
  }, [triggerModal]);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      // Focus management for accessibility
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusableElement.current = focusableElements[0];
      firstFocusableElement.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          handleCancel();
        }
      };
      modalRef.current.addEventListener("keydown", handleKeyDown);
      return () =>
        modalRef.current?.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen]);

  // Truncate text to 250 characters
  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text || "";
    return text.substring(0, maxLength) + "...";
  };

  // Format date as MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Handle opening the modal
  const showModal = () => {
    if (!profile) {
      message.error("Please log in to add a review", 2);
      return;
    }
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setRating(0);
    setComment("");
    onModalClose();
  };

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    if (!rating || !comment) {
      message.error("Please provide a rating and a review", 2);
      return;
    }
    if (comment.length < 10) {
      message.error("Review must be at least 10 characters", 2);
      return;
    }
    if (comment.length > 500) {
      message.error("Review cannot exceed 500 characters", 2);
      return;
    }

    const newReview = {
      movieId: movieId.toString(),
      rating,
      comment,
      author: profile.name || "Anonymous",
      created_at: new Date().toISOString(),
    };

    try {
      await addReview(newReview).unwrap();
      message.success("Review submitted successfully", 2);
      setIsModalOpen(false);
      setRating(0);
      setComment("");
      onModalClose();
    } catch (error) {
      console.error("Error adding review:", error);
      const errorMessage =
        error.status === 400
          ? "Invalid movie ID"
          : error.status === 404
          ? "Movie not found in TMDb"
          : error?.data?.message || "Failed to submit review";
      message.error(errorMessage, 2);
    }
  };

  // Handle review deletion
  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      message.success("Review deleted successfully", 2);
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error(error?.data?.message || "Failed to delete review", 2);
    }
  };

  // Custom star rating component
  const renderStarRating = (value) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${
            i <= Math.round(value * 2) / 2 ? "bi-star-fill" : "bi-star"
          } text-warning`}
          style={{ cursor: "default", fontSize: "1.2rem" }}
        ></i>
      );
    }
    return stars;
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  return (
    <div className="container my-4">
      <h4 className="mb-3">Reviews</h4>

      <button
        className="btn btn-primary mb-3"
        onClick={showModal}
        disabled={isProfileLoading || !profile}
        aria-label="Write a review"
      >
        {isProfileLoading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          "Write a Review"
        )}
      </button>

      {isReviewsLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading reviews...</span>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first to add one!</p>
      ) : (
        <div
          id="reviewCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-title mb-0">
                          {review.author || "Anonymous"}
                        </h6>
                        <div>{renderStarRating(review.rating)}</div>
                      </div>
                      {profile?.name === review.author && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(review.id)}
                          aria-label={`Delete review by ${review.author}`}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                    <p className="card-text mt-2">
                      {truncateText(review.comment, 250)}
                    </p>
                    <p className="card-text text-muted small">
                      Posted on: {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#reviewCarousel"
            data-bs-slide="prev"
            aria-label="Previous review"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#reviewCarousel"
            data-bs-slide="next"
            aria-label="Next review"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
          </button>
        </div>
      )}

      {/* Review Modal */}
      <div
        className={`modal fade ${isModalOpen ? "show d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="reviewModalLabel"
        aria-hidden={!isModalOpen}
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="reviewModalLabel">
                Write a Review
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">
                    Rating
                  </label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi ${
                          star <= rating ? "bi-star-fill" : "bi-star"
                        } text-warning me-1`}
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                        onClick={() => handleRatingChange(star)}
                        aria-label={`Rate ${star} stars`}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Your Review
                  </label>
                  <textarea
                    className="form-control"
                    id="comment"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    placeholder="Write your review here"
                    required
                    aria-describedby="commentHelp"
                  ></textarea>
                  <small id="commentHelp" className="form-text text-muted">
                    {comment.length}/500 characters
                  </small>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isAddingReview}
                    aria-label="Submit review"
                  >
                    {isAddingReview ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default MovieReview;
