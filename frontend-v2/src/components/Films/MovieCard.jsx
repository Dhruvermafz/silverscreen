import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { Dropdown } from "react-bootstrap";
import MovieReview from "./MovieReview";

const MovieCard = ({
  movie,
  lists = [],
  profile,
  isGridView = true, // true for grid, false for carousel
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

  if (!movie || !movie.id) return null;

  return (
    <>
      <div
        className={`movie-card ${
          isGridView ? "movie-card--grid" : "movie-card--carousel"
        }`}
      >
        <div className="movie-card__poster">
          <Link to={`/movies/${movie.id}`}>
            <img
              src={movie.posterUrl || "/assets/imgs/placeholder.png"}
              alt={movie.title}
              className="movie-card__image"
              loading="lazy"
            />
            {movie.isNew && (
              <span className="movie-card__badge movie-card__badge--new">
                NEW
              </span>
            )}
            {movie.categoryLabel && (
              <span className="movie-card__badge movie-card__badge--category">
                {movie.categoryLabel}
              </span>
            )}
            <div className="movie-card__rating">
              <i className="ri-star-fill"></i>{" "}
              {movie.rating?.toFixed(1) || "N/A"}
            </div>
          </Link>

          {/* Hover Actions */}
          <div className="movie-card__actions">
            <button
              className={`movie-card__action-btn ${
                movie.isLiked ? "active" : ""
              }`}
              onClick={handleToggleLike(movie)}
              title="Add to Favorites"
            >
              <i className="ri-heart-line"></i>
            </button>

            {profile && lists.length > 0 && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="movie-card__action-btn p-0"
                  title="Add to List"
                >
                  <i className="ri-play-list-add-line"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {lists.map((list) => (
                    <Dropdown.Item
                      key={list._id}
                      onClick={() => {
                        handleAddToList(movie, list._id);
                        message.success(`Added to "${list.name}"`);
                      }}
                    >
                      {list.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            <button
              className="movie-card__action-btn"
              onClick={handleReviewClick(movie)}
              title="Write a Review"
            >
              <i className="ri-chat-4-fill"></i>
            </button>
          </div>
        </div>

        <div className="movie-card__content">
          <h3 className="movie-card__title">
            <Link to={`/movies/${movie.id}`} className="text-truncate d-block">
              {movie.title}
            </Link>
          </h3>

          <div className="movie-card__meta">
            <span
              className="movie-card__year"
              onClick={() =>
                handleYearClick(
                  movie.release_date?.substring(0, 4) || "Unknown"
                )
              }
            >
              {movie.release_date?.substring(0, 4) || "N/A"}
            </span>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-card__genres">
              {movie.genres.slice(0, 2).map((g, index) => (
                <span
                  key={g.id}
                  className="movie-card__genre-tag"
                  onClick={() => handleGenreClick(g.name)}
                >
                  {g.name}
                  {index < Math.min(movie.genres.length - 1, 1) && ", "}
                </span>
              ))}
              {movie.genres.length > 2 && (
                <span className="movie-card__genre-more">
                  +{movie.genres.length - 2}
                </span>
              )}
            </div>
          )}

          <p className="movie-card__overview">
            {movie.overview
              ? movie.overview.length > 100
                ? `${movie.overview.substring(0, 100)}...`
                : movie.overview
              : "No description available."}
          </p>
        </div>
      </div>

      {/* Review Modal */}
      {movie.showReviewModal && (
        <MovieReview
          movieId={movie.id}
          triggerModal={movie.showReviewModal}
          onModalClose={handleModalClose(movie)}
        />
      )}
    </>
  );
};

export default MovieCard;
