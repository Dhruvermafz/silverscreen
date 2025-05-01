import React, { useState } from "react";
import { Card, Button, Modal, Input, Rate } from "antd";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleReviewChange = (e) => setReview(e.target.value);
  const handleRatingChange = (value) => setRating(value);

  const handleAddReview = () => {
    console.log("Review added:", {
      movieId: movie.id,
      review,
      rating,
    });
    setIsModalVisible(false);
    setReview("");
    setRating(0);
  };

  return (
    <>
      <Card
        hoverable
        cover={<img alt={movie.title} src={movie.posterUrl} />}
        actions={[
          <Button onClick={() => setIsModalVisible(true)} type="link">
            Add Review
          </Button>,
        ]}
      >
        <Card.Meta
          title={
            <span
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              {movie.title}
            </span>
          }
          description={`Released: ${movie.releaseDate}`}
        />
        <p>Rating: {movie.rating}</p>
      </Card>

      <Modal
        title={`Add a Review for "${movie.title}"`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddReview}
      >
        <div>
          <h4>Rate the Movie</h4>
          <Rate value={rating} onChange={handleRatingChange} />
        </div>
        <div style={{ marginTop: 16 }}>
          <h4>Your Review</h4>
          <Input.TextArea
            value={review}
            onChange={handleReviewChange}
            rows={4}
            placeholder="Write your review here"
          />
        </div>
      </Modal>
    </>
  );
};

export default MovieCard;
