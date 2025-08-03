import React, { useState } from "react";
import { Button, Space, Dropdown, Menu, Tooltip, Rate } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetListsQuery } from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";
import MovieReview from "./MovieReview"; // Adjust path as needed
import { toast } from "react-toastify";
import "./moviecard.css";

const MovieCard = ({ movie, isCompact = false, onAddToList }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();
  const { data: lists = [] } = useGetListsQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();

  // Log movie data to verify
  console.log("Movie data:", movie);

  const handleToggleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Liked movie", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/movies/${movie.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Movie URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
    if (!profile) {
      toast.error("Please log in to add a review", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setShowReviewModal(true);
  };

  const handleModalClose = () => {
    setShowReviewModal(false);
  };

  const addToListMenu = (
    <Menu>
      {lists.length === 0 ? (
        <Menu.Item disabled>No lists available</Menu.Item>
      ) : (
        lists.map((list) => (
          <Menu.Item
            key={list._id}
            onClick={() => onAddToList(movie, list._id)}
          >
            {list.name}
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <div className={`movie-card ${isCompact ? "movie-card-compact" : ""}`}>
      <div
        className="movie-card-image"
        style={{
          backgroundImage: `url(${
            movie.posterUrl || "https://via.placeholder.com/300"
          })`,
        }}
        onClick={() => {
          if (!movie.id) {
            console.error("Movie ID is undefined:", movie);
            toast.error("Invalid movie ID", {
              position: "top-right",
              autoClose: 2000,
            });
            return;
          }
          console.log("Navigating to:", `/movies/${movie.id}`);
          navigate(`/movies/${movie.id}`);
        }}
        role="img"
        aria-label={movie.title}
      >
        <div className="movie-card-overlay">
          <div className="movie-card-content">
            <h3 className="movie-card-title" style={{ color: "white" }}>
              {movie.title}
            </h3>
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
                  <Tooltip title="Review">
                    <Button
                      size="small"
                      onClick={handleReviewClick}
                      aria-label={`Review ${movie.title}`}
                      disabled={isProfileLoading || !profile}
                    >
                      Review
                    </Button>
                  </Tooltip>
                  <Tooltip title={isLiked ? "Unlike" : "Like"}>
                    <Button
                      size="small"
                      icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                      type={isLiked ? "primary" : "default"}
                      onClick={handleToggleLike}
                      aria-label={
                        isLiked
                          ? `Unlike ${movie.title}`
                          : `Like ${movie.title}`
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Add to List">
                    <Dropdown overlay={addToListMenu} trigger={["click"]}>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Add ${movie.title} to list`}
                      />
                    </Dropdown>
                  </Tooltip>
                  <Tooltip title="Share">
                    <Button
                      size="small"
                      icon={<ShareAltOutlined />}
                      onClick={handleShare}
                      aria-label={`Share ${movie.title}`}
                    />
                  </Tooltip>
                </Space>
              </>
            )}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <MovieReview
          movieId={movie.id}
          triggerModal={showReviewModal}
          onModalClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default MovieCard;
