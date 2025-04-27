import React, { useState, useEffect } from "react";
import { Card, Rate, Input, Button, Row, Col, Spin } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
const { TextArea } = Input;

const MainContent = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState("28"); // Default to Action genre
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  // Fetch movies when genre changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const data = await getMoviesFromAPI("", { genre }, 1);
      setMovies(data.movies);
      setLoading(false);
    };

    fetchMovies();
  }, [genre]);

  const toggleReviewForm = () => setShowForm(!showForm);

  const submitReview = (movieId) => {
    if (reviewText.trim()) {
      setReviews((prevReviews) => [...prevReviews, { movieId, reviewText }]);
      setReviewText("");
      setShowForm(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Genre Selector */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Button onClick={() => setGenre("28")}>Action</Button>
        <Button onClick={() => setGenre("35")}>Comedy</Button>
        <Button onClick={() => setGenre("18")}>Drama</Button>
        {/* Add more genres here */}
      </div>

      <Row gutter={[16, 16]}>
        {loading ? (
          <Spin size="large" />
        ) : (
          movies.map((movie) => (
            <Col key={movie.id} span={8}>
              <Card
                hoverable
                cover={<img alt={movie.title} src={movie.posterUrl} />}
              >
                <h3>{movie.title}</h3>
                <p>{movie.releaseDate}</p>
                <Rate disabled defaultValue={movie.rating / 2} />

                {/* Reviews Section */}
                <div>
                  <Button
                    icon={<MessageOutlined />}
                    onClick={() => toggleReviewForm()}
                  >
                    {showForm ? "Cancel" : "Add Review"}
                  </Button>

                  {showForm && (
                    <div>
                      <TextArea
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                      />
                      <Button
                        type="primary"
                        onClick={() => submitReview(movie.id)}
                      >
                        Submit Review
                      </Button>
                    </div>
                  )}

                  {/* Display User Reviews */}
                  <div style={{ marginTop: "10px" }}>
                    {reviews
                      .filter((review) => review.movieId === movie.id)
                      .map((review, index) => (
                        <div key={index} style={{ marginTop: "5px" }}>
                          <p>{review.reviewText}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default MainContent;
