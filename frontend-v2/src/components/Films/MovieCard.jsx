// ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import MovieReview from "./MovieReview";

const ProductCard = ({
  movie,
  lists,
  profile,
  isGridView,
  handleToggleLike,
  handleAddToList,
  handleReviewClick,
  handleModalClose,
}) => {
  return (
    <div
      className={`col-lg-3 col-md-4 col-sm-6 col-12 m-b-24 mn-product-box pro-gl-content ${
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
            <Link to={`/movies/${movie.id}`}>
              {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
            </Link>
          </div>
          <h5>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </h5>
          <p className="mn-info">
            {movie.overview?.substring(0, 100) || "No description available"}...
          </p>
          <div className="mn-price">
            <div className="mn-price-new">
              {movie.release_date?.substring(0, 4) || "Unknown"}
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
            <a
              href="javascript:void(0)"
              data-tooltip
              title="Add to List"
              className="mn-add-cart"
            >
              <i className="ri-play-list-add-line"></i>
            </a>
            {profile && (
              <ul className="dropdown-menu show">
                {lists.length === 0 ? (
                  <li>
                    <span className="dropdown-item disabled">
                      No lists available
                    </span>
                  </li>
                ) : (
                  lists.map((list) => (
                    <li key={list._id}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleAddToList(movie, list._id)}
                      >
                        {list.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
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
          visible={movie.showReviewModal}
          onClose={handleModalClose(movie)}
        />
      )}
    </div>
  );
};

export default ProductCard;
