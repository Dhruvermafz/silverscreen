import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Pagination } from "antd";
import { SearchOutlined, FileAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // <-- Add this
import MovieCard from "./MovieCard";
import MovieFilter from "./MovieFilter";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";

const MovieWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate(); // <-- Initialize navigation

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, selectedFilter]);

  const fetchMovies = async () => {
    setLoading(true);
    const response = await getMoviesFromAPI(searchQuery, selectedFilter, page);
    setMovies(response.movies);
    setTotal(response.totalResults);
    setFilteredMovies(response.movies);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilter(filters);
    setPage(1);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Search movies"
          value={searchQuery}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          style={{ width: "300px" }}
        />
        <MovieFilter onChange={handleFilterChange} />
        <Button
          type="primary"
          icon={<FileAddOutlined />}
          onClick={() => navigate("/submit-a-request")} // <-- Navigate to recommendation page
        >
          Request a Movie
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredMovies.map((movie) => (
            <Col span={6} key={movie.id}>
              <MovieCard movie={movie} />
            </Col>
          ))
        )}
      </Row>

      <Pagination
        current={page}
        total={total}
        pageSize={10}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
};

export default MovieWrapper;
