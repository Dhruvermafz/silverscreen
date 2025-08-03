import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Spin,
  Skeleton,
  Button,
  Space,
  Switch,
  Input,
  Pagination,
  Typography,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import MovieCard from "../Movie/MovieCard";
import MovieFilter from "../Movie/MovieFilter";
import MovieSidebar from "../Movie/MovieSidebar";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import { useAddMovieToListMutation } from "../../actions/listApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Movie/movies.css";
import debounce from "lodash.debounce";

const { Search } = Input;
const { Title } = Typography;

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    sort: "popularity.desc",
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [addMovieToList] = useAddMovieToListMutation();

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
        toast.info("No trending movies found", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch trending movies", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedFilter, loading, movies.length]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setPage(1);
      setMovies([]);
    }, 300),
    []
  );

  const handleSearch = (value) => {
    debouncedSearch.cancel();
    setSearchQuery(value);
    setPage(1);
    setMovies([]);
  };

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

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
    setSelectedFilter({ ...filters, sort: "popularity.desc" });
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
        <Col xs={24}>
          <Title level={2}>Trending Movies</Title>
        </Col>
        <Col xs={24} md={18}>
          <div className="movie-wrapper-controls">
            <Space size="middle" wrap>
              <Search
                placeholder="Search trending movies"
                onChange={(e) => debouncedSearch(e.target.value)}
                onSearch={handleSearch}
                prefix={<SearchOutlined />}
                className="movie-wrapper-search"
                aria-label="Search trending movies"
                allowClear
              />
              <MovieFilter onChange={handleFilterChange} />
              <Switch
                checked={isGridView}
                onChange={() => setIsGridView(!isGridView)}
                checkedChildren={<AppstoreOutlined />}
                unCheckedChildren={<UnorderedListOutlined />}
                aria-label="Toggle view mode"
              />
            </Space>
          </div>

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
                <p className="movie-wrapper-empty">No trending movies found</p>
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
    </div>
  );
};

export default TrendingMovies;
