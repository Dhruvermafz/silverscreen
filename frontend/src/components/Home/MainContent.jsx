import React, { useState } from "react";
import { Card, Rate, Input, Button } from "antd";
import { MessageOutlined, StarFilled } from "@ant-design/icons";

const { TextArea } = Input;

const MainContent = () => {
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const toggleReviewForm = () => setShowForm(!showForm);

  const submitReview = () => {
    if (reviewText.trim()) {
      setReviews([...reviews, reviewText]);
      setReviewText("");
      setShowForm(false);
    }
  };

  return (
    <div className="main-content-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          key="movie-1"
          className="movie-card"
          cover={
            <img
              alt="Call Me By Your Name movie poster"
              src="https://resizing.flixster.com/fqA2ALSWe0CIjYaDdkDiW4ONqLI=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p14169043_v_v13_at.jpg"
              className="movie-image"
            />
          }
        >
          <h2 className="movie-title">Call Me By Your Name</h2>
          <p className="movie-info">2017 · Drama</p>

          <div className="flex items-center mt-2 space-x-1">
            <Rate disabled defaultValue={4} />
          </div>

          <div className="review-section">
            <h3 className="text-lg font-bold">User Reviews</h3>
            <div className="user-reviews">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    {review}
                  </div>
                ))
              ) : (
                <p className="review-placeholder">No reviews yet.</p>
              )}
            </div>

            {showForm && (
              <div className="mt-2">
                <TextArea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                  className="review-textarea"
                />
                <Button
                  type="primary"
                  className="review-button"
                  onClick={submitReview}
                >
                  Submit Review
                </Button>
              </div>
            )}

            <Button
              className="add-review-button"
              icon={<MessageOutlined />}
              onClick={toggleReviewForm}
            >
              {showForm ? "Cancel" : "Add Review"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MainContent;
