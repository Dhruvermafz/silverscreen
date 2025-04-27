import React, { useState } from "react";
import { Card, Button, Modal, Input, Rate } from "antd";

const MovieCard = ({ movie }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleReviewChange = (e) => setReview(e.target.value);

  const handleRatingChange = (value) => setRating(value);

  const handleAddReview = () => {
    // Save the review (you could send it to an API or store it locally)
    console.log("Review added:", { movieId: movie.id, review, rating });
    setIsModalVisible(false);
  };

  return (
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
        title={movie.title}
        description={`Released: ${movie.releaseDate}`}
      />
      <p>Rating: {movie.rating}</p>

      <Modal
        title="Add a Review"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddReview}
      >
        <div>
          <h4>Rate the Movie</h4>
          <Rate value={rating} onChange={handleRatingChange} />
        </div>
        <div>
          <h4>Your Review</h4>
          <Input.TextArea
            value={review}
            onChange={handleReviewChange}
            rows={4}
            placeholder="Write your review here"
          />
        </div>
      </Modal>
    </Card>
  );
};

export default MovieCard;
