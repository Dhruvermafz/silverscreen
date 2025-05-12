import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Divider, Row, Col, Card } from "antd";
import axios from "axios";
import MovieReview from "./MovieReview";
const { Title, Paragraph } = Typography;

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [isRecsLoading, setIsRecsLoading] = useState(true);

  // Fetch movie details by ID using custom API
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=967df4e131f467edcdd674b650bf257c&language=en-US`
        );
        setMovie(response.data);
        setIsMovieLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setIsMovieLoading(false);
      }
    };

    // Fetch recommended movies
    const fetchRecommendedMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=967df4e131f467edcdd674b650bf257c&language=en-US&page=1`
        );
        setRecommendedMovies(response.data.results);
        setIsRecsLoading(false);
      } catch (error) {
        console.error("Error fetching recommended movies:", error);
        setIsRecsLoading(false);
      }
    };

    fetchMovieDetails();
    fetchRecommendedMovies();
  }, [id]);

  if (isMovieLoading) return <p>Loading movie details...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div style={{ padding: 24 }}>
      {/* Section 1: Movie Info */}
      <Row gutter={24}>
        <Col span={8}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Movie DB Image URL
            alt={movie.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Col>
        <Col span={16}>
          <Title>{movie.title}</Title>
          <Paragraph>
            <strong>Release Date:</strong> {movie.release_date}
          </Paragraph>
          <Paragraph>
            <strong>Genres:</strong>{" "}
            {movie.genres?.map((genre) => genre.name).join(", ")}
          </Paragraph>
          <Paragraph>
            <strong>Description:</strong> {movie.overview}
          </Paragraph>
          <Paragraph>
            <strong>Rating:</strong> {movie.vote_average} / 10
          </Paragraph>
          <MovieReview />
        </Col>
      </Row>

      <Divider />

      {/* Section 2: Similar/Recommended Movies */}
      <Title level={3}>You Might Also Like</Title>
      {isRecsLoading ? (
        <p>Loading recommendations...</p>
      ) : (
        <Row gutter={[16, 16]}>
          {recommendedMovies.map((rec) => (
            <Col span={6} key={rec.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={rec.title}
                    src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                  />
                }
                onClick={() => (window.location.href = `/movies/${rec.id}`)}
              >
                <Card.Meta title={rec.title} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MoviePage;
