import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Row, Col, Pagination, Space, Switch, Spin } from "antd";
import {
  SearchOutlined,
  FileAddOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import MovieCard from "./MovieCard";
import MovieFilter from "./MovieFilter";
import MovieSidebar from "./MovieSidebar";
import AddMovieRequest from "./MovieRequest";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./movies.css";

const { Search } = Input;

const MovieWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, selectedFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && total > movies.length) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, total, movies.length]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await getMoviesFromAPI(
        searchQuery,
        selectedFilter,
        page
      );
      setMovies((prev) =>
        page === 1 ? response.movies : [...prev, ...response.movies]
      );
      setTotal(response.totalResults);
      if (response.movies.length === 0 && page === 1) {
        toast.info("No movies found", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch movies", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
    setMovies([]);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilter(filters);
    setPage(1);
    setMovies([]);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="movie-wrapper">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={18}>
          {/* Controls */}
          <div className="movie-wrapper-controls">
            <Space size="middle" wrap>
              <Search
                placeholder="Search movies"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                prefix={<SearchOutlined />}
                className="movie-wrapper-search"
                aria-label="Search movies"
              />
              <MovieFilter onChange={handleFilterChange} />
              <Button
                icon={<FileAddOutlined />}
                onClick={() => setIsRequestModalVisible(true)}
                aria-label="Request a movie"
              >
                Request Movie
              </Button>
              <Switch
                checked={isGridView}
                onChange={() => setIsGridView(!isGridView)}
                checkedChildren={<AppstoreOutlined />}
                unCheckedChildren={<UnorderedListOutlined />}
                aria-label="Toggle view mode"
              />
            </Space>
          </div>

          {/* Movies Grid/List */}
          <Row gutter={[16, 16]} className="movie-wrapper-grid">
            {loading && movies.length === 0 ? (
              <Col span={24} className="movie-wrapper-loading">
                <Spin size="large" />
              </Col>
            ) : movies.length === 0 ? (
              <Col span={24}>
                <p className="movie-wrapper-empty">No movies found</p>
              </Col>
            ) : (
              movies.map((movie) => (
                <Col xs={24} sm={12} md={isGridView ? 8 : 24} key={movie.id}>
                  <MovieCard movie={movie} isCompact={!isGridView} />
                </Col>
              ))
            )}
          </Row>
          <div ref={loaderRef} className="movie-wrapper-loader" />
          {total > 10 && (
            <Pagination
              current={page}
              total={total}
              pageSize={10}
              onChange={handlePageChange}
              className="movie-wrapper-pagination"
            />
          )}
        </Col>
        <Col xs={24} md={6}>
          <MovieSidebar />
        </Col>
      </Row>

      <AddMovieRequest
        isVisible={isRequestModalVisible}
        onClose={() => setIsRequestModalVisible(false)}
      />
    </div>
  );
};

export default MovieWrapper;
