import React, { useState, useEffect, useRef } from "react";
import { message, Modal, Button, Form, Input, Carousel } from "antd";
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
  const [form] = Form.useForm();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsQuery(movieId);
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const firstFocusableElement = useRef(null);
  const carouselRef = useRef(null);

  // Handle modal open/close
  useEffect(() => {
    setIsModalOpen(triggerModal);
  }, [triggerModal]);

  // Focus management for accessibility
  useEffect(() => {
    if (isModalOpen && firstFocusableElement.current) {
      firstFocusableElement.current.focus();
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
    form.resetFields();
    onModalClose();
  };

  // Handle review submission
  const handleSubmit = async (values) => {
    if (!profile) return;

    const { comment } = values;

    if (!rating || !comment) {
      message.error("Please provide a rating and a review", 2);
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
      form.resetFields();
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

  // Custom carousel navigation
  const goToPrev = () => {
    carouselRef.current?.prev();
  };

  const goToNext = () => {
    carouselRef.current?.next();
  };

  return (
    <div className="container my-4">
      <Modal
        title="Write a Review"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        aria-labelledby="reviewModalLabel"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="Rating">
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
          </Form.Item>
          <Form.Item
            label="Your Review"
            name="comment"
            rules={[
              { required: true, message: "Please enter a review" },
              { min: 10, message: "Review must be at least 10 characters" },
              { max: 500, message: "Review cannot exceed 500 characters" },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={500}
              placeholder="Write your review here"
              showCount
              ref={firstFocusableElement}
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: "right" }}>
              <Button
                type="default"
                onClick={handleCancel}
                style={{ marginRight: "8px" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isAddingReview}
                disabled={isAddingReview}
              >
                Submit Review
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieReview;
