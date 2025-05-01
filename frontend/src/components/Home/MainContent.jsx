import React, { useState, useEffect } from "react";
import { Row, Col, Button, Spin } from "antd";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import MovieCard from "../Movie/MovieCard";
const MainContent = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState("28"); // Default to Action genre

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const data = await getMoviesFromAPI("", { genre }, 1);
      setMovies(data.movies);
      setLoading(false);
    };

    fetchMovies();
  }, [genre]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Genre Selector */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Button onClick={() => setGenre("28")}>Action</Button>
        <Button onClick={() => setGenre("35")}>Comedy</Button>
        <Button onClick={() => setGenre("18")}>Drama</Button>
        {/* Add more genres as needed */}
      </div>

      <Row gutter={[16, 16]}>
        {loading ? (
          <Spin size="large" />
        ) : (
          movies.map((movie) => (
            <Col key={movie.id} span={8}>
              <MovieCard movie={movie} />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default MainContent;
