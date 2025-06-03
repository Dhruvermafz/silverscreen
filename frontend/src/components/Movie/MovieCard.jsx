import React, { useState } from "react";
import {
  Button,
  Modal,
  Input,
  Rate,
  Space,
  Dropdown,
  Menu,
  Tooltip,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom"; // Use Link for navigation
import { useGetListsQuery } from "../../actions/listApi"; // Updated typo in import
import { toast } from "react-toastify";
import "./movies.css"; // Updated CSS file name for consistency

const { TextArea } = Input;

const MovieCard = ({ movie, isCompact = true, onAddToList }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { data: lists = [], isLoading: listsLoading } = useGetListsQuery({}); // Empty object for fetch

  const handleAddReview = () => {
    if (!rating || !review.trim()) {
      toast.error("Please provide a rating and review");
      return;
    }
    toast.success("Review submitted!");
    setModalOpen(false);
    setReview("");
    setRating(0);
  };

  const handleToggleLike = (e) => {
    e.preventDefault(); // Prevent link navigation
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Liked movie!");
  };

  const handleShare = (e) => {
    e.preventDefault(); // Prevent link navigation
    const shareUrl = `${window.location.origin}/movies/${movie.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied!");
  };

  const addToListMenu = (
    <Menu>
      {listsLoading ? (
        <Menu.Item disabled>Loading...</Menu.Item>
      ) : lists.length === 0 ? (
        <Menu.Item disabled>No lists available</Menu.Item>
      ) : (
        lists.map((list) => (
          <Menu.Item key={list.id} onClick={() => onAddToList(movie, list.id)}>
            {list.name}
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  // Ensure movie has required properties
  if (!movie?.id || !movie?.title) {
    return null; // Skip rendering if movie is invalid
  }

  return (
    <div className={`movie-card ${isCompact ? "movie-card-compact" : ""}`}>
      <Link to={`/movies/${movie.id}`} className="movie-card-link">
        <div
          className="movie-card-image"
          style={{
            backgroundImage: `url(${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/300x450"
            })`,
          }}
          role="img"
          aria-label={movie.title}
        >
          <div className="movie-card-overlay">
            <div className="movie-card-content">
              <h3 className="movie-card-title">{movie.title}</h3>
              {isCompact && (
                <>
                  <p className="movie-card-meta">
                    {movie.release_date?.substring(0, 4) || "N/A"} •{" "}
                    {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
                  </p>
                  <p className="movie-card-rating">
                    <Rate disabled value={movie.vote_average / 2} allowHalf /> (
                    {movie.vote_average?.toFixed(1) || "N/A"})
                  </p>
                  <Space size="small" className="movie-card-actions">
                    <Tooltip title="Review">
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalOpen(true);
                        }}
                        aria-label={`Review ${movie.title}`}
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
                          onClick={(e) => e.preventDefault()}
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
      </Link>

      <Modal
        title={`Review "${movie.title}"`}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleAddReview}
        okText="Submit"
        cancelText="Cancel"
        width={400}
        aria-label={`Review modal for ${movie.title}`}
      >
        <Rate
          value={rating}
          onChange={setRating}
          style={{ marginBottom: 16 }}
          aria-label="Rate movie"
        />
        <TextArea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Write your review"
          aria-label="Movie review input"
        />
      </Modal>
    </div>
  );
};

export default MovieCard;
