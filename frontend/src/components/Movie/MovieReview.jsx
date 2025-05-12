import React, { useEffect, useState } from "react";
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
} from "antd";
import axios from "axios";
const { Title, Paragraph } = Typography;

const MovieReview = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // TMDB API key
  const API_KEY = "967df4e131f467edcdd674b650bf257c";
  // Placeholder for custom backend API URL

  const BACKEND_API_URL = "https://your-backend-api.com/reviews";

  // Fetch reviews from TMDB
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`
        );
        setReviews(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Truncate text to 100 characters
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle opening/closing the modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle review submission
  const handleSubmit = async (values) => {
    const newReview = {
      movieId: id,
      rating: values.rating,
      content: values.content,
      author: values.author || "Anonymous",
      created_at: new Date().toISOString(),
    };

    try {
      // Send review to backend API (replace with actual endpoint)
      await axios.post(BACKEND_API_URL, newReview);
      setReviews([...reviews, { ...newReview, id: Date.now() }]); // Temporary ID
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Reviews</Title>

      {/* Button to add a review */}
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add Review
      </Button>

      {/* Reviews Slider */}
      {isLoading ? (
        <Spin tip="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <Paragraph>No reviews yet. Be the first to add one!</Paragraph>
      ) : (
        <Carousel autoplay dots={true} style={{ width: "100%", marginTop: 16 }}>
          {reviews.map((review) => (
            <div key={review.id}>
              <Card style={{ margin: "0 16px" }}>
                <Paragraph>
                  <strong>{review.author || "Anonymous"}</strong> rated:{" "}
                  <Rate disabled value={review.rating || 0} allowHalf />
                </Paragraph>
                <Paragraph>{truncateText(review.content, 250)}</Paragraph>
                <Paragraph type="secondary">
                  Posted on: {new Date(review.created_at).toLocaleDateString()}
                </Paragraph>
              </Card>
            </div>
          ))}
        </Carousel>
      )}

      {/* Add Review Modal */}
      <Modal
        title="Add a Review"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="author"
            label="Your Name (Optional)"
            rules={[{ max: 50, message: "Name must be 50 characters or less" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please provide a rating" }]}
          >
            <Rate allowHalf />
          </Form.Item>
          <Form.Item
            name="content"
            label="Review"
            rules={[
              { required: true, message: "Please write a review" },
              { min: 10, message: "Review must be at least 10 characters" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Write your review here" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Review
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieReview;
