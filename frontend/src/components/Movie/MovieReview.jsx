import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Rate,
  Carousel,
  Card,
  Typography,
  Spin,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  useAddReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
} from "../../actions/reviewApi"; // Import review API hooks
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Paragraph } = Typography;

const MovieReview = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(); // Fetch user profile
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsQuery(id); // Fetch reviews for movie
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation(); // Add review mutation
  const [deleteReview] = useDeleteReviewMutation(); // Delete review mutation

  // Truncate text to 250 characters
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle opening/closing the modal
  const showModal = () => {
    if (!profile) {
      toast.error("Please log in to add a review", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle review submission
  const handleSubmit = async (values) => {
    if (!profile) return; // Ensure user is logged in

    const newReview = {
      movieId: id,
      rating: values.rating,
      content: values.content,
      author: profile.name || "Anonymous", // Use profile name
      created_at: new Date().toISOString(),
    };

    try {
      await addReview(newReview).unwrap(); // Use RTK Query mutation
      toast.success("Review submitted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error(error?.data?.message || "Failed to submit review", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handle review deletion
  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap(); // Use RTK Query mutation
      toast.success("Review deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error?.data?.message || "Failed to delete review", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="tmdb-reviews">
      <Title level={4} className="tmdb-section-title">
        Reviews
      </Title>

      {/* Button to add a review */}
      <Button
        type="primary"
        onClick={showModal}
        className="tmdb-action-btn-primary"
        disabled={isProfileLoading || !profile}
        loading={isProfileLoading}
      >
        Write a Review
      </Button>

      {/* Reviews Slider */}
      {isReviewsLoading ? (
        <Spin tip="Loading reviews..." className="tmdb-spin" />
      ) : reviews.length === 0 ? (
        <Paragraph className="tmdb-no-reviews">
          No reviews yet. Be the first to add one!
        </Paragraph>
      ) : (
        <Carousel autoplay dots={true} className="tmdb-review-carousel">
          {reviews.map((review) => (
            <div key={review.id}>
              <Card className="tmdb-review-card">
                <Paragraph className="tmdb-review-author">
                  <strong>{review.author || "Anonymous"}</strong>
                  <Rate
                    disabled
                    value={review.rating || 0}
                    allowHalf
                    className="tmdb-review-rating"
                  />
                  {profile?.name === review.author && (
                    <Popconfirm
                      title="Are you sure you want to delete this review?"
                      onConfirm={() => handleDelete(review.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        className="tmdb-delete-btn"
                        aria-label="Delete review"
                      />
                    </Popconfirm>
                  )}
                </Paragraph>
                <Paragraph className="tmdb-review-content">
                  {truncateText(review.content, 250)}
                </Paragraph>
                <Paragraph className="tmdb-review-date">
                  Posted on: {new Date(review.created_at).toLocaleDateString()}
                </Paragraph>
              </Card>
            </div>
          ))}
        </Carousel>
      )}

      {/* Add Review Modal */}
      <Modal
        title="Write a Review"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="tmdb-review-modal"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please provide a rating" }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            name="content"
            label="Your Review"
            rules={[
              { required: true, message: "Please write a review" },
              { min: 10, message: "Review must be at least 10 characters" },
              { max: 500, message: "Review cannot exceed 500 characters" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Write your review here"
              showCount
              maxLength={500}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="tmdb-action-btn-primary"
              loading={isAddingReview}
            >
              Submit Review
            </Button>
            <Button
              onClick={handleCancel}
              style={{ marginLeft: 8 }}
              className="tmdb-action-btn"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieReview;
