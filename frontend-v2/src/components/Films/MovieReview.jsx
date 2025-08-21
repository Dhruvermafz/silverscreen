import React, { useState, useEffect, useRef } from "react";
import { message, Modal, Button, Form, Input, Select, Carousel } from "antd";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
} from "../../actions/reviewApi";

const { Option } = Select;

const MovieReview = ({
  movieId,
  triggerModal = false,
  onModalClose = () => {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(triggerModal);
  const [ratingCategory, setRatingCategory] = useState("");
  const [editReviewId, setEditReviewId] = useState(null); // Track review being edited
  const [form] = Form.useForm();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsQuery({ movieId });
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] =
    useUpdateReviewMutation();
  const { data: editReview, isLoading: isEditReviewLoading } =
    useGetReviewByIdQuery(
      editReviewId,
      { skip: !editReviewId } // Only fetch when editReviewId is set
    );
  const firstFocusableElement = useRef(null);
  const carouselRef = useRef(null);

  // Rating categories
  const ratingCategories = [
    "GREAT",
    "MEH",
    "ITS A EXPERIENCE",
    "IGNORE",
    "FUN TO WATCH",
    "ONE TIME WATCH",
  ];

  // Handle modal open/close
  useEffect(() => {
    setIsModalOpen(triggerModal);
  }, [triggerModal]);

  // Populate form for editing
  useEffect(() => {
    if (editReview && editReviewId) {
      form.setFieldsValue({
        ratingCategory: editReview.ratingCategory,
        comment: editReview.content,
      });
      setRatingCategory(editReview.ratingCategory);
    }
  }, [editReview, editReviewId, form]);

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

  // Handle opening the modal (for adding or editing)
  const showModal = (reviewId = null) => {
    if (!profile) {
      message.error("Please log in to add or edit a review", 2);
      return;
    }
    setEditReviewId(reviewId);
    setIsModalOpen(true);
    if (!reviewId) {
      // Clear form for new review
      setRatingCategory("");
      form.resetFields();
    }
  };

  // Handle closing the modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setRatingCategory("");
    setEditReviewId(null);
    form.resetFields();
    onModalClose();
  };

  // Handle review submission (add or update)
  const handleSubmit = async (values) => {
    if (!profile) return;

    const { comment, ratingCategory } = values;

    if (!ratingCategory || !comment) {
      message.error("Please provide a rating category and a review", 2);
      return;
    }

    const reviewData = {
      movieId: movieId.toString(),
      ratingCategory,
      comment,
      author: profile.name || "Anonymous",
      created_at: new Date().toISOString(),
    };

    try {
      if (editReviewId) {
        // Update existing review
        await updateReview({ reviewId: editReviewId, ...reviewData }).unwrap();
        message.success("Review updated successfully", 2);
      } else {
        // Add new review
        await addReview(reviewData).unwrap();
        message.success("Review submitted successfully", 2);
      }
      setIsModalOpen(false);
      setRatingCategory("");
      setEditReviewId(null);
      form.resetFields();
      onModalClose();
    } catch (error) {
      console.error(
        `Error ${editReviewId ? "updating" : "adding"} review:`,
        error
      );
      const errorMessage =
        error.status === 400
          ? error.data?.error || "Invalid input"
          : error.status === 403
          ? "You are not authorized to perform this action"
          : error.status === 404
          ? editReviewId
            ? "Review not found"
            : "Movie not found in TMDb"
          : error?.data?.message ||
            `Failed to ${editReviewId ? "update" : "submit"} review`;
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

  // Custom carousel navigation
  const goToPrev = () => {
    carouselRef.current?.prev();
  };

  const goToNext = () => {
    carouselRef.current?.next();
  };

  return (
    <div className="container my-4">
      <Button
        type="primary"
        onClick={() => showModal()}
        disabled={isProfileLoading || !profile}
        className="mb-3"
      >
        Add Review
      </Button>
      <Modal
        title={editReviewId ? "Edit Review" : "Write a Review"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        aria-labelledby="reviewModalLabel"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Rating Category"
            name="ratingCategory"
            rules={[
              { required: true, message: "Please select a rating category" },
            ]}
          >
            <Select
              value={ratingCategory}
              onChange={setRatingCategory}
              placeholder="Select a rating category"
              ref={firstFocusableElement}
            >
              {ratingCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
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
                loading={isAddingReview || isUpdatingReview}
                disabled={isAddingReview || isUpdatingReview}
              >
                {editReviewId ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {isReviewsLoading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div>No reviews yet.</div>
      ) : (
        <div>
          <Carousel ref={carouselRef} dots={false}>
            {reviews.map((review) => (
              <div key={review.id}>
                <div className="p-4">
                  <h3>{review.movieTitle}</h3>
                  <p>Author: {review.author}</p>
                  <p>Rating: {review.ratingCategory}</p>
                  <p>Comment: {truncateText(review.content, 250)}</p>
                  <p>Posted: {formatDate(review.createdAt)}</p>
                  {profile?.id === review.user?._id && (
                    <div>
                      <Button
                        type="link"
                        onClick={() => showModal(review.id)}
                        disabled={isEditReviewLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Carousel>
          <div className="text-center mt-3">
            <Button onClick={goToPrev} style={{ marginRight: "8px" }}>
              Previous
            </Button>
            <Button onClick={goToNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieReview;
