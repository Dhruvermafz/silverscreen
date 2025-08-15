import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Pagination,
  Space,
  Switch,
  Spin,
  Skeleton,
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
import { useAddMovieToListMutation } from "../../actions/listApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import debounce from "lodash.debounce";

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
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [addMovieToList] = useAddMovieToListMutation();

  // Memoized fetchMovies to stabilize useEffect
  const fetchMovies = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getMoviesFromAPI(
        searchQuery,
        selectedFilter,
        page
      );
      const newMovies = response.movies || [];
      setMovies((prev) => (page === 1 ? newMovies : [...prev, ...newMovies]));
      setTotal(response.totalResults || 0);
      setHasMore(
        newMovies.length > 0 &&
          movies.length + newMovies.length < response.totalResults
      );
      if (newMovies.length === 0 && page === 1) {
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
  }, [page, searchQuery, selectedFilter, loading, movies.length]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setPage(1);
      setMovies([]);
    }, 300),
    []
  );

  // Immediate search handler for onSearch
  const handleSearch = (value) => {
    debouncedSearch.cancel(); // Cancel any pending debounced calls
    setSearchQuery(value);
    setPage(1);
    setMovies([]);
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Infinite scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const handleAddToList = async (movie, listId) => {
    try {
      await addMovieToList({
        listId,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.posterUrl,
        },
      }).unwrap();
      toast.success(`${movie.title} added to list`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add movie to list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilter(filters);
    setPage(1);
    setMovies([]);
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
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
                onChange={(e) => debouncedSearch(e.target.value)}
                onSearch={handleSearch}
                prefix={<SearchOutlined />}
                className="movie-wrapper-search"
                aria-label="Search movies"
                allowClear
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
                {[...Array(6)].map((_, i) => (
                  <Col xs={24} sm={12} md={isGridView ? 8 : 24} key={i}>
                    <Skeleton active avatar paragraph={{ rows: 2 }} />
                  </Col>
                ))}
              </Col>
            ) : movies.length === 0 ? (
              <Col span={24}>
                <p className="movie-wrapper-empty">No movies found</p>
              </Col>
            ) : (
              movies.map((movie) => (
                <Col xs={24} sm={12} md={isGridView ? 8 : 24} key={movie.id}>
                  <MovieCard
                    movie={movie}
                    isCompact={!isGridView}
                    onAddToList={handleAddToList}
                  />
                </Col>
              ))
            )}
          </Row>
          <div ref={loaderRef} className="movie-wrapper-loader" />
          {hasMore && (
            <div className="movie-wrapper-load-more">
              {loading ? (
                <Spin size="small" />
              ) : (
                <Button onClick={handleLoadMore} disabled={loading}>
                  Load More
                </Button>
              )}
            </div>
          )}
          {total > 10 && (
            <Pagination
              current={page}
              total={total}
              pageSize={10}
              onChange={handlePageChange}
              className="movie-wrapper-pagination"
              showSizeChanger={false}
            />
          )}
        </Col>
        <Col xs={24} md={6}>
          <MovieSidebar
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
          />
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
