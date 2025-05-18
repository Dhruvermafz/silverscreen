import React from "react";
import { FiPlay, FiBookmark } from "react-icons/fi";
// Adjust path to your Pagination component
import coverImage from "../../img/covers/cover.jpg"; // Adjust path as needed
import Pagination from "../Common/Pagination";
const FavoritesList = ({
  favoriteMovies,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div
      className="tab-pane fade"
      id="tab-3"
      role="tabpanel"
      aria-labelledby="3-tab"
      tabIndex="0"
    >
      <div className="row">
        {Array.isArray(favoriteMovies) && favoriteMovies.length > 0 ? (
          favoriteMovies.map((item) => (
            <div className="col-6 col-sm-4 col-lg-3 col-xl-2" key={item.id}>
              <div className="item">
                <div className="item__cover">
                  <img src={item.poster || coverImage} alt={item.title} />
                  <a href={`details.html?id=${item.id}`} className="item__play">
                    <FiPlay />
                  </a>
                  <span className="item__rate item__rate--green">
                    {item.rating || "N/A"}
                  </span>
                  <button
                    className="item__favorite item__favorite--active"
                    type="button"
                  >
                    <FiBookmark />
                  </button>
                </div>
                <div className="item__content">
                  <h3 className="item__title">
                    <a href={`details.html?id=${item.id}`}>{item.title}</a>
                  </h3>
                  <span className="item__category">
                    {(item.categories || []).map((category, index) => (
                      <a href="#" key={index}>
                        {category}
                      </a>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No favorite movies available</p>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default FavoritesList;
