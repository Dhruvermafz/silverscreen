import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import MovieReview from "./MovieReview";
import { Dropdown, DropdownButton } from "react-bootstrap"; // Import react-bootstrap

const MovieCard = ({
  movie,
  lists,
  profile,
  isGridView,
  handleToggleLike,
  handleAddToList,
  handleReviewClick,
  handleModalClose,
}) => {
  const navigate = useNavigate();

  const handleGenreClick = (genreName) => {
    navigate(`/explore?genre=${encodeURIComponent(genreName)}`);
  };

  const handleYearClick = (year) => {
    navigate(`/explore?year=${year}`);
  };

  return (
    <div
      className={`col-lg-2 col-md-3 col-sm-4 col-6 m-b-24 mn-product-box pro-gl-content ${
        isGridView ? "" : "width-50"
      }`}
    >
      <div className="mn-product-card">
        <div className="mn-product-img">
          {movie.isNew && (
            <div className="lbl">
              <span className="new">New</span>
            </div>
          )}
          <div className="mn-img">
            <Link to={`/movies/${movie.id}`} className="image">
              <img
                className="main-img"
                src={movie.posterUrl || "/assets/imgs/placeholder.png"}
                alt={movie.title}
              />
              <img
                className="hover-img"
                src={movie.posterUrl || "/assets/imgs/placeholder.png"}
                alt={movie.title}
              />
            </Link>
          </div>
        </div>
        <div className="mn-product-detail">
          <div className="cat">
            {movie.genres?.length > 0
              ? movie.genres.map((g, index) => (
                  <span key={g.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleGenreClick(g.name);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {g.name}
                    </a>
                    {index < movie.genres.length - 1 && ", "}
                  </span>
                ))
              : "N/A"}
          </div>
          {movie.categoryLabel && (
            <span className="category-badge">{movie.categoryLabel}</span>
          )}
          <h5>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </h5>
          <p className="mn-info">
            {movie.overview?.substring(0, 100) || "No description available"}...
          </p>
          <div className="mn-price">
            <div className="mn-price-new">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleYearClick(
                    movie.release_date?.substring(0, 4) || "Unknown"
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                {movie.release_date?.substring(0, 4) || "Unknown"}
              </a>
            </div>
          </div>
          <div className="mn-pro-option">
            <a
              className={`mn-wishlist ${movie.isLiked ? "active" : ""}`}
              data-tooltip
              title="Like"
              onClick={handleToggleLike(movie)}
            >
              <i className="ri-heart-line"></i>
            </a>
            {profile && (
              <DropdownButton
                id={`dropdown-${movie.id}`}
                title={<i className="ri-play-list-add-line"></i>}
                variant="link"
                className="mn-add-cart"
                align="end"
              >
                {lists.length === 0 ? (
                  <Dropdown.Item disabled>No lists available</Dropdown.Item>
                ) : (
                  lists.map((list) => (
                    <Dropdown.Item
                      key={list._id}
                      onClick={() => handleAddToList(movie, list._id)}
                    >
                      {list.name}
                    </Dropdown.Item>
                  ))
                )}
              </DropdownButton>
            )}
            <a
              className="mn-wishlist"
              title="Add Review"
              onClick={handleReviewClick(movie)}
            >
              <i className="ri-chat-4-fill"></i>
            </a>
          </div>
        </div>
      </div>
      {movie.showReviewModal && (
        <MovieReview
          movieId={movie.id}
          triggerModal={movie.showReviewModal}
          onModalClose={handleModalClose(movie)}
        />
      )}
    </div>
  );
};

export default MovieCard;
