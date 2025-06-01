import React, { useState } from "react";
import { Button, Modal, Input, Rate, Space } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./moviecard.css";

const { TextArea } = Input;

const MovieCard = ({ movie, isCompact = false }) => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleAddReview = () => {
    toast.success("Review submitted!", {
      position: "top-right",
      autoClose: 2000,
    });
    setReviewModalVisible(false);
    setReview("");
    setRating(0);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Liked movie", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className={`movie-card ${isCompact ? "movie-card-compact" : ""}`}>
      <div
        className="movie-card-image"
        style={{
          backgroundImage: `url(${
            movie.posterUrl || "https://via.placeholder.com/300"
          })`,
        }}
        onClick={() => navigate(`/movies/${movie.id}`)}
        role="img"
        aria-label={movie.title}
      >
        <div className="movie-card-overlay">
          <div className="movie-card-content">
            <h3 className="movie-card-title">{movie.title}</h3>
            {!isCompact && (
              <>
                <p className="movie-card-meta">
                  {movie.releaseDate?.substring(0, 4) || "N/A"} •{" "}
                  {movie.genre || "N/A"}
                </p>
                <p className="movie-card-rating">
                  <Rate disabled value={movie.rating / 2} allowHalf /> (
                  {movie.rating || "N/A"})
                </p>
                <Space size="small" className="movie-card-actions">
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReviewModalVisible(true);
                    }}
                    aria-label={`Review ${movie.title}`}
                  >
                    Review
                  </Button>
                  <Button
                    size="small"
                    icon={<HeartOutlined />}
                    type={isLiked ? "primary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike();
                    }}
                    aria-label={
                      isLiked ? `Unlike ${movie.title}` : `Like ${movie.title}`
                    }
                  />
                </Space>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={`Review "${movie.title}"`}
        open={isReviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleAddReview}
        okText="Submit"
        width={400}
      >
        <Rate value={rating} onChange={setRating} aria-label="Rate movie" />
        <TextArea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Write your review"
          className="movie-card-review-input"
          aria-label="Movie review"
        />
      </Modal>
    </div>
  );
};

export default MovieCard;
