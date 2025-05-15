import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Pagination,
  Space,
  Switch,
  Carousel,
} from "antd";
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

const MovieWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  }, [page, searchQuery, selectedFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

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
      setFilteredMovies(response.movies);
      setTotal(response.totalResults);
      setHasMore(response.movies.length > 0);
      if (response.movies.length === 0) {
        toast.info("No more movies to load", {
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setMovies([]);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilter(filters);
    setPage(1);
    setMovies([]);
  };

  const handlePageChange = (page) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="movie-wrapper">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={18}>
          {/* Featured Carousel */}
          <Carousel autoplay className="featured-carousel">
            {movies.slice(0, 3).map((movie) => (
              <div key={movie.id} className="carousel-item">
                <img
                  src={
                    movie.posterUrl || "https://via.placeholder.com/1200x400"
                  }
                  alt={movie.title}
                  style={{ width: "100%", height: 400, objectFit: "cover" }}
                />
                <div className="carousel-caption">
                  <h2>{movie.title}</h2>
                  <Button
                    type="primary"
                    onClick={() =>
                      (window.location.href = `/movies/${movie.id}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>

          {/* Controls */}
          <Space style={{ margin: "16px 0", flexWrap: "wrap", gap: 10 }}>
            <Input
              placeholder="Search movies"
              value={searchQuery}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              aria-label="Search movies"
            />
            <MovieFilter onChange={handleFilterChange} />
            <Button
              type="primary"
              icon={<FileAddOutlined />}
              onClick={() => setIsRequestModalVisible(true)}
              aria-label="Request a movie"
            >
              Request a Movie
            </Button>
            <Switch
              checked={isGridView}
              onChange={() => setIsGridView(!isGridView)}
              checkedChildren={<AppstoreOutlined />}
              unCheckedChildren={<UnorderedListOutlined />}
              aria-label="Toggle view mode"
            />
          </Space>

          <Row gutter={[16, 16]}>
            {loading && movies.length === 0 ? (
              <Col span={24}>
                <p>Loading...</p>
              </Col>
            ) : (
              movies.map((movie) => (
                <Col xs={24} sm={12} md={isGridView ? 8 : 24} key={movie.id}>
                  <MovieCard movie={movie} isCompact={!isGridView} />
                </Col>
              ))
            )}
          </Row>
          <div ref={loaderRef} style={{ height: 20 }} />
          {total > 10 && (
            <Pagination
              current={page}
              total={total}
              pageSize={10}
              onChange={handlePageChange}
              style={{ textAlign: "center", marginTop: 20 }}
            />
          )}
        </Col>
        <Col xs={0} md={6}>
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
