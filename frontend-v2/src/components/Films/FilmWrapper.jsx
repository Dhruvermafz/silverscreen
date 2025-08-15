// FilmWrapper.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  useGetListsQuery,
  useAddMovieToListMutation,
} from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";
import debounce from "lodash.debounce";
import ProductCard from "./MovieCard";
import Pagination from "../Common/Pagination";
const FilmWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    genres: [],
    sort: "popularity.desc",
    yearRange: [1900, new Date().getFullYear()],
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [genres, setGenres] = useState([]);
  const [addMovieToList] = useAddMovieToListMutation();
  const { data: lists = [] } = useGetListsQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const navigate = useNavigate();

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres);
      } catch (error) {
        message.error("Failed to load genres", 2);
      }
    };
    fetchGenres();
  }, []);

  // Memoized fetchMovies
  const fetchMovies = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await getMoviesFromAPI(
        searchQuery,
        selectedFilter,
        page
      );
      setMovies(response.movies || []);
      setTotal(response.totalResults || 0);
      if (response.movies.length === 0 && page === 1) {
        message.info("No movies found", 2);
      }
    } catch (error) {
      message.error("Failed to fetch movies", 2);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedFilter]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setPage(1);
    }, 300),
    []
  );

  // Immediate search handler
  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch.cancel();
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // Fetch movies on mount and when dependencies change
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleAddToList = async (movie, listId) => {
    try {
      await addMovieToList({
        listId,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        },
      }).unwrap();
      message.success(`${movie.title} added to list`, 2);
    } catch (error) {
      message.error(error?.data?.message || "Failed to add movie to list", 2);
    }
  };

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilter(filters);
    setPage(1);
  }, []);

  const handleGenreChange = (genreId) => {
    const newGenres = selectedFilter.genres.includes(genreId.toString())
      ? selectedFilter.genres.filter((id) => id !== genreId.toString())
      : [...selectedFilter.genres, genreId.toString()];
    handleFilterChange({ ...selectedFilter, genres: newGenres });
  };

  const handleClearGenres = () => {
    handleFilterChange({ ...selectedFilter, genres: [] });
  };

  const handleSortChange = (value) => {
    handleFilterChange({ ...selectedFilter, sort: value });
  };

  const handleYearRangeChange = (value) => {
    handleFilterChange({ ...selectedFilter, yearRange: value });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleLike = (movie) => (e) => {
    e.stopPropagation();
    message.success(movie.isLiked ? "Removed from likes" : "Liked movie", 2);
    setMovies((prev) =>
      prev.map((m) => (m.id === movie.id ? { ...m, isLiked: !m.isLiked } : m))
    );
  };

  const handleReviewClick = (movie) => (e) => {
    e.stopPropagation();
    if (!profile) {
      message.error("Please log in to add a review", 2);
      return;
    }
    setMovies((prev) =>
      prev.map((m) => (m.id === movie.id ? { ...m, showReviewModal: true } : m))
    );
  };

  const handleModalClose = (movie) => () => {
    setMovies((prev) =>
      prev.map((m) =>
        m.id === movie.id ? { ...m, showReviewModal: false } : m
      )
    );
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const pageSize = 20;

  return (
    <section className="mn-shop">
      <div className="row">
        {/* Sidebar */}
        <div
          className={`filter-sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
          onClick={toggleSidebar}
        ></div>
        <div
          className={`mn-shop-sidebar mn-filter-sidebar col-lg-3 col-md-12 ${
            isSidebarOpen ? "active" : ""
          }`}
        >
          <div id="shop_sidebar">
            <div className="mn-sidebar-wrap">
              <div className="mn-sidebar-block">
                <div className="mn-sb-title">
                  <h3 className="mn-sidebar-title">Filters</h3>
                  <a
                    href="javascript:void(0)"
                    className="filter-close"
                    onClick={toggleSidebar}
                  >
                    <i className="ri-close-large-line"></i>
                  </a>
                </div>
                <div className="mn-sb-block-content p-t-15">
                  <h5 className="section-title style-1 mb-30">Genres</h5>
                  <ul>
                    {genres.map((genre) => (
                      <li key={genre.id}>
                        <div className="mn-sidebar-block-item">
                          <input
                            type="checkbox"
                            value={genre.id}
                            checked={selectedFilter.genres.includes(
                              genre.id.toString()
                            )}
                            onChange={() => handleGenreChange(genre.id)}
                            id={`genre-${genre.id}`}
                          />
                          <label htmlFor={`genre-${genre.id}`}>
                            <span>{genre.name}</span>
                          </label>
                          <span className="checked"></span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mn-sb-block-content">
                  <h5 className="section-title style-1 mb-30">Year Range</h5>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      value={selectedFilter.yearRange[0]}
                      onChange={(e) =>
                        handleYearRangeChange([
                          Number(e.target.value),
                          selectedFilter.yearRange[1],
                        ])
                      }
                      min="1900"
                      max={new Date().getFullYear()}
                      aria-label="Start year"
                    />
                    <input
                      type="number"
                      className="form-control"
                      value={selectedFilter.yearRange[1]}
                      onChange={(e) =>
                        handleYearRangeChange([
                          selectedFilter.yearRange[0],
                          Number(e.target.value),
                        ])
                      }
                      min="1900"
                      max={new Date().getFullYear()}
                      aria-label="End year"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mn-shop-rightside col-md-12 m-t-991">
          {/* Shop Top */}
          <div className="mn-pro-list-top d-flex">
            <div className="col-md-6 mn-grid-list">
              <div className="mn-gl-btn">
                <button
                  className="grid-btn filter-toggle-icon"
                  onClick={toggleSidebar}
                >
                  <i className="ri-filter-2-line"></i>
                </button>
                <button
                  className={`grid-btn btn-grid-50 ${
                    isGridView ? "active" : ""
                  }`}
                  onClick={() => setIsGridView(true)}
                  aria-label="Grid view"
                >
                  <i className="ri-gallery-view-2"></i>
                </button>
                <button
                  className={`grid-btn btn-list-50 ${
                    !isGridView ? "active" : ""
                  }`}
                  onClick={() => setIsGridView(false)}
                  aria-label="List view"
                >
                  <i className="ri-list-check-2"></i>
                </button>
              </div>
            </div>
            <div className="col-md-6 mn-sort-select">
              <div className="mn-select-inner">
                <select
                  name="mn-select"
                  id="mn-select"
                  value={selectedFilter.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="release_date.desc">Newest</option>
                  <option value="vote_average.desc">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Select Bar */}
          <div className="mn-select-bar d-flex">
            {selectedFilter.genres.map((genreId) => {
              const genre = genres.find((g) => g.id.toString() === genreId);
              return genre ? (
                <span key={genre.id} className="mn-select-btn">
                  {genre.name}
                  <a
                    className="mn-select-cancel"
                    href="javascript:void(0)"
                    onClick={() => handleGenreChange(genre.id)}
                  >
                    ×
                  </a>
                </span>
              ) : null;
            })}
            {selectedFilter.genres.length > 0 && (
              <span className="mn-select-btn mn-select-btn-clear">
                <a
                  className="mn-select-clear"
                  href="javascript:void(0)"
                  onClick={handleClearGenres}
                >
                  Clear All
                </a>
              </span>
            )}
          </div>

          {/* Shop Content */}
          <div className="shop-pro-content">
            <div className="row">
              <div className="col-12 mb-3">
                <form onSubmit={handleSearch}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search movies..."
                      value={searchQuery}
                      onChange={(e) => debouncedSearch(e.target.value)}
                      aria-label="Search movies"
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="ri-search-line"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className={`shop-pro-inner ${isGridView ? "" : "list-view-50"}`}>
            <div className="row">
              {loading && page === 1 ? (
                <div className="col-12 text-center">
                  <p>Loading movies...</p>
                </div>
              ) : movies.length === 0 ? (
                <div className="col-12 text-center">
                  <p>No movies found.</p>
                </div>
              ) : (
                movies.map((movie) => (
                  <ProductCard
                    key={movie.id}
                    movie={movie}
                    lists={lists}
                    profile={profile}
                    isGridView={isGridView}
                    handleToggleLike={handleToggleLike}
                    handleAddToList={handleAddToList}
                    handleReviewClick={handleReviewClick}
                    handleModalClose={handleModalClose}
                  />
                ))
              )}
            </div>
          </div>
          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
};

export default FilmWrapper;
