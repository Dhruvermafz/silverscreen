import React, { useState } from "react";
import {
  Button,
  Modal,
  Input,
  Rate,
  Dropdown,
  Menu,
  Space,
  Tooltip,
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  FlagOutlined,
  UserAddOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AddToListModal from "../modals/AddtoListModal";
import RecommendToUserModal from "../modals/RecommendToUserModal";
import ReportMovieModal from "../modals/ReportMovieModal";
import { toast } from "react-toastify";
import "./moviecard.css";

const { TextArea } = Input;

const MovieCard = ({ movie, isCompact = false }) => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [isListModalVisible, setListModalVisible] = useState(false);
  const [isRecommendModalVisible, setRecommendModalVisible] = useState(false);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleAddReview = () => {
    // Mock review submission
    toast.success("Review added!", { position: "top-right", autoClose: 2000 });
    setReviewModalVisible(false);
    setReview("");
    setRating(0);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Added to likes", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleShare = () => {
    // Mock share
    navigator.clipboard.writeText(
      `${window.location.origin}/movies/${movie.id}`
    );
    toast.success("Movie URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "list":
        setListModalVisible(true);
        break;
      case "recommend":
        setRecommendModalVisible(true);
        break;
      case "report":
        setReportModalVisible(true);
        break;
      case "share":
        handleShare();
        break;
      default:
        break;
    }
  };

  const dropdownMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="list" icon={<PlusOutlined />}>
        Add to List
      </Menu.Item>
      <Menu.Item key="recommend" icon={<UserAddOutlined />}>
        Recommend to User
      </Menu.Item>
      <Menu.Item key="share" icon={<ShareAltOutlined />}>
        Share
      </Menu.Item>
      <Menu.Item key="report" icon={<FlagOutlined />} danger>
        Report Movie
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`movie-card ${isCompact ? "compact" : ""}`}>
      <div
        className="movie-card-image"
        style={{
          backgroundImage: `url(${
            movie.posterUrl || "https://via.placeholder.com/300"
          })`,
        }}
        role="img"
        aria-label={movie.title}
      >
        <div className="movie-card-overlay">
          <div className="movie-card-content">
            <h3
              className="movie-card-title"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              {movie.title}
            </h3>
            <p className="movie-card-meta">
              {movie.releaseDate?.substring(0, 4) || "Unknown"} •{" "}
              {movie.genre || "N/A"}
            </p>
            <p className="movie-card-rating">
              <Rate disabled value={movie.rating / 2} allowHalf /> (
              {movie.rating || "N/A"})
            </p>
            <Space className="movie-card-actions">
              <Tooltip title="Add review">
                <Button
                  type="primary"
                  onClick={() => setReviewModalVisible(true)}
                  aria-label={`Add review for ${movie.title}`}
                >
                  Review
                </Button>
              </Tooltip>
              <Tooltip title={isLiked ? "Remove from likes" : "Like movie"}>
                <Button
                  icon={<HeartOutlined />}
                  type={isLiked ? "primary" : "default"}
                  onClick={handleToggleLike}
                  aria-label={
                    isLiked ? `Unlike ${movie.title}` : `Like ${movie.title}`
                  }
                />
              </Tooltip>
              <Dropdown overlay={dropdownMenu} trigger={["click"]}>
                <Button
                  type="text"
                  icon={<EllipsisOutlined />}
                  aria-label="More options"
                />
              </Dropdown>
            </Space>
          </div>
        </div>
      </div>

      <Modal
        title={`Add a Review for "${movie.title}"`}
        open={isReviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleAddReview}
        okText="Submit"
      >
        <h4>Rate the Movie</h4>
        <Rate value={rating} onChange={(val) => setRating(val)} />
        <h4 style={{ marginTop: 16 }}>Your Review</h4>
        <TextArea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Write your review here"
          aria-label="Movie review"
        />
      </Modal>

      <AddToListModal
        open={isListModalVisible}
        onClose={() => setListModalVisible(false)}
        movie={movie}
      />
      <RecommendToUserModal
        open={isRecommendModalVisible}
        onClose={() => setRecommendModalVisible(false)}
        movieId={movie.id}
      />
      <ReportMovieModal
        open={isReportModalVisible}
        onClose={() => setReportModalVisible(false)}
        movieId={movie.id}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieCard;
