import React from "react";
import { FiRefreshCw, FiStar } from "react-icons/fi";

const LatestReviews = ({ reviews }) => {
  return (
    <div className="dashbox">
      <div className="dashbox__title">
        <h3>
          <FiStar /> Latest reviews
        </h3>
        <div className="dashbox__wrap">
          <a className="dashbox__refresh" href="#">
            <FiRefreshCw />
          </a>
          <a className="dashbox__more" href="#">
            View All
          </a>
        </div>
      </div>
      <div className="dashbox__table-wrap dashbox__table-wrap--2">
        <table className="dashbox__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ITEM</th>
              <th>AUTHOR</th>
              <th>RATING</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <div className="dashbox__table-text dashbox__table-text--grey">
                      {review.id}
                    </div>
                  </td>
                  <td>
                    <div className="dashbox__table-text">
                      <a href="details.html">{review.item}</a>
                    </div>
                  </td>
                  <td>
                    <div className="dashbox__table-text">{review.author}</div>
                  </td>
                  <td>
                    <div className="dashbox__table-text dashbox__table-text--rate">
                      <FiStar /> {review.rating}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <div className="dashbox__table-text">
                    No reviews available
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

export default LatestReviews;
