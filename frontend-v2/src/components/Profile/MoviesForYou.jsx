import React from "react";
import { FiRefreshCw, FiStar } from "react-icons/fi";

const MoviesForYou = ({ suggestedMovies }) => {
  return (
    <div className="dashbox">
      <div className="dashbox__title">
        <h3>
          <FiStar /> Movies for you
        </h3>
        <div className="dashbox__wrap">
          <a className="dashbox__refresh" href="#">
            <FiRefreshCw />
          </a>
          <a className="dashbox__more" href="catalog.html">
            View All
          </a>
        </div>
      </div>
      <div className="dashbox__table-wrap dashbox__table-wrap--1">
        <table className="dashbox__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>CATEGORY</th>
              <th>RATING</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(suggestedMovies) && suggestedMovies.length > 0 ? (
              suggestedMovies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <div className="dashbox__table-text dashbox__table-text--grey">
                      {movie.id}
                    </div>
                  </td>
                  <td>
                    <div className="dashbox__table-text">
                      <a href={`details.html?id=${movie.id}`}>{movie.title}</a>
                    </div>
                  </td>
                  <td>
                    <div className="dashbox__table-text">
                      {movie.category || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="dashbox__table-text dashbox__table-text--rate">
                      <FiStar /> {movie.rating || "N/A"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <div className="dashbox__table-text">
                    No suggested movies available
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoviesForYou;
