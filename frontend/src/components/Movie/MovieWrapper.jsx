import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Pagination } from "antd";
import { SearchOutlined, FileAddOutlined } from "@ant-design/icons";
import MovieCard from "./MovieCard";
import MovieFilter from "./MovieFilter";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import AddMovieRequest from "./MovieRequest";
const MovieWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false); // 💡 Modal state

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
          onClick={() => setIsRequestModalVisible(true)} // ✅ Show modal
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

      {/* ✅ Include modal and control via props */}
      <AddMovieRequest
        isVisible={isRequestModalVisible}
        onClose={() => setIsRequestModalVisible(false)}
      />
    </div>
  );
};

export default MovieWrapper;
