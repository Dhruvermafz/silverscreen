import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { message, Slider, Select } from "antd";
import {
  useGetListsQuery,
  useAddMovieToListMutation,
} from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
  getLanguagesFromAPI, // New API call for languages
} from "../../actions/getMoviesFromAPI";
import debounce from "lodash.debounce";
import MovieCard from "./MovieCard";
import Pagination from "../Common/Pagination";
import { getCustomCategories } from "../../actions/getMoviesFromAPI";
const FilmWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    genres: [],
    sort: "popularity.desc",
    yearRange: [1900, new Date().getFullYear()],
    language: "",
    runtimeRange: [0, 300], // Runtime in minutes
    voteAverageRange: [0, 10], // Vote average 0-10
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [addMovieToList] = useAddMovieToListMutation();
  const { data: lists = [] } = useGetListsQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const genre = queryParams.get("genre");
    const year = queryParams.get("year");
    const language = queryParams.get("language");
    const sort = queryParams.get("sort");

    let newFilter = { ...selectedFilter };

    if (genre) {
      const genreObj = genres.find(
        (g) => g.name.toLowerCase() === genre.toLowerCase()
      );
      if (genreObj) newFilter.genres = [genreObj.id.toString()];
    }
    if (year && !isNaN(year)) {
      newFilter.yearRange = [Number(year), Number(year)];
    }
    if (language) {
      newFilter.language = language;
    }
    if (sort) {
      newFilter.sort = sort;
    }

    setSelectedFilter(newFilter);
    setPage(1);
  }, [location.search, genres]);

  // Fetch genres and languages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedGenres, fetchedLanguages] = await Promise.all([
          getGenresFromAPI(),
          getLanguagesFromAPI(),
        ]);
        setGenres(fetchedGenres);
        setLanguages(fetchedLanguages);
      } catch (error) {
        message.error("Failed to load genres or languages", 2);
      }
    };
    fetchData();
  }, []);

  // Update URL with current filters
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedFilter.genres.length > 0) {
      const genre = genres.find(
        (g) => g.id.toString() === selectedFilter.genres[0]
      );
      if (genre) params.set("genre", genre.name.toLowerCase());
    }
    if (selectedFilter.yearRange[0] === selectedFilter.yearRange[1]) {
      params.set("year", selectedFilter.yearRange[0]);
    }
    if (selectedFilter.language) {
      params.set("language", selectedFilter.language);
    }
    if (selectedFilter.sort !== "popularity.desc") {
      params.set("sort", selectedFilter.sort);
    }
    navigate(`/explore?${params.toString()}`, { replace: true });
  }, [selectedFilter, genres, navigate]);

  // Fetch movies
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
      updateURL();
    } catch (error) {
      message.error("Failed to fetch movies", 2);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedFilter, updateURL]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setPage(1);
    }, 300),
    []
  );

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch.cancel();
    setSearchQuery(e.target.value);
    setPage(1);
    navigate("/explore");
  };

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

  const handleFilterChange = useCallback((newFilters) => {
    setSelectedFilter(newFilters);
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

  const handleLanguageChange = (value) => {
    handleFilterChange({ ...selectedFilter, language: value });
  };

  const handleRuntimeRangeChange = (value) => {
    handleFilterChange({ ...selectedFilter, runtimeRange: value });
  };

  const handleVoteAverageChange = (value) => {
    handleFilterChange({ ...selectedFilter, voteAverageRange: value });
  };

  const resetFilters = () => {
    handleFilterChange({
      genres: [],
      sort: "popularity.desc",
      yearRange: [1900, new Date().getFullYear()],
      language: "",
      runtimeRange: [0, 300],
      voteAverageRange: [0, 10],
    });
    navigate("/explore");
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                    <a
                      href="javascript:void(0)"
                      className="filter-close"
                      onClick={toggleSidebar}
                    >
                      <i className="ri-close-large-line"></i>
                    </a>
                  </div>
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
                // Add to sidebar (before Genres section)
                <div className="mn-sb-block-content p-t-15">
                  <h5 className="section-title style-1 mb-30">Vibe Check</h5>
                  <Select
                    style={{ width: "100%" }}
                    value={selectedCategory}
                    onChange={(value) => {
                      setSelectedCategory(value);
                      handleFilterChange({
                        ...selectedFilter,
                        category: value,
                      });
                    }}
                    placeholder="Pick a vibe"
                    allowClear
                  >
                    {getCustomCategories().map((cat) => (
                      <Select.Option key={cat.key} value={cat.key}>
                        {cat.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="mn-sb-block-content">
                  <h5 className="section-title style-1 mb-30">Year Range</h5>
                  <Slider
                    range
                    min={1900}
                    max={new Date().getFullYear()}
                    value={selectedFilter.yearRange}
                    onChange={handleYearRangeChange}
                    tooltip={{ formatter: (value) => value }}
                  />
                </div>
                <div className="mn-sb-block-content">
                  <h5 className="section-title style-1 mb-30">Language</h5>
                  <Select
                    style={{ width: "100%" }}
                    value={selectedFilter.language}
                    onChange={handleLanguageChange}
                    placeholder="Select language"
                    allowClear
                  >
                    {languages.map((lang) => (
                      <Select.Option
                        key={lang.iso_639_1}
                        value={lang.iso_639_1}
                      >
                        {lang.english_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="mn-sb-block-content">
                  <h5 className="section-title style-1 mb-30">
                    Runtime (minutes)
                  </h5>
                  <Slider
                    range
                    min={0}
                    max={300}
                    value={selectedFilter.runtimeRange}
                    onChange={handleRuntimeRangeChange}
                    tooltip={{ formatter: (value) => `${value} min` }}
                  />
                </div>
                <div className="mn-sb-block-content">
                  <h5 className="section-title style-1 mb-30">Vote Average</h5>
                  <Slider
                    range
                    min={0}
                    max={10}
                    step={0.1}
                    value={selectedFilter.voteAverageRange}
                    onChange={handleVoteAverageChange}
                    tooltip={{ formatter: (value) => value.toFixed(1) }}
                  />
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
                  <option value="popularity.desc">
                    Popularity (High to Low)
                  </option>
                  <option value="popularity.asc">
                    Popularity (Low to High)
                  </option>
                  <option value="release_date.desc">Newest First</option>
                  <option value="release_date.asc">Oldest First</option>
                  <option value="vote_average.desc">
                    Rating (High to Low)
                  </option>
                  <option value="vote_average.asc">Rating (Low to High)</option>
                  <option value="revenue.desc">Revenue (High to Low)</option>
                  <option value="revenue.asc">Revenue (Low to High)</option>
                  <option value="vote_count.desc">Most Voted</option>
                  <option value="original_title.asc">Title (A-Z)</option>
                  <option value="original_title.desc">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Select Bar */}
          <div className="mn-select-bar d-flex flex-wrap">
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
            {selectedFilter.language && (
              <span className="mn-select-btn">
                Language:{" "}
                {
                  languages.find((l) => l.iso_639_1 === selectedFilter.language)
                    ?.english_name
                }
                <a
                  className="mn-select-cancel"
                  href="javascript:void(0)"
                  onClick={() => handleLanguageChange("")}
                >
                  ×
                </a>
              </span>
            )}
            {(selectedFilter.yearRange[0] !== 1900 ||
              selectedFilter.yearRange[1] !== new Date().getFullYear()) && (
              <span className="mn-select-btn">
                Year: {selectedFilter.yearRange[0]} -{" "}
                {selectedFilter.yearRange[1]}
                <a
                  className="mn-select-cancel"
                  href="javascript:void(0)"
                  onClick={() =>
                    handleYearRangeChange([1900, new Date().getFullYear()])
                  }
                >
                  ×
                </a>
              </span>
            )}
            {(selectedFilter.runtimeRange[0] !== 0 ||
              selectedFilter.runtimeRange[1] !== 300) && (
              <span className="mn-select-btn">
                Runtime: {selectedFilter.runtimeRange[0]} -{" "}
                {selectedFilter.runtimeRange[1]} min
                <a
                  className="mn-select-cancel"
                  href="javascript:void(0)"
                  onClick={() => handleRuntimeRangeChange([0, 300])}
                >
                  ×
                </a>
              </span>
            )}
            {(selectedFilter.voteAverageRange[0] !== 0 ||
              selectedFilter.voteAverageRange[1] !== 10) && (
              <span className="mn-select-btn">
                Rating: {selectedFilter.voteAverageRange[0].toFixed(1)} -{" "}
                {selectedFilter.voteAverageRange[1].toFixed(1)}
                <a
                  className="mn-select-cancel"
                  href="javascript:void(0)"
                  onClick={() => handleVoteAverageChange([0, 10])}
                >
                  ×
                </a>
              </span>
            )}
            {(selectedFilter.genres.length > 0 ||
              selectedFilter.language ||
              selectedFilter.yearRange[0] !== 1900 ||
              selectedFilter.yearRange[1] !== new Date().getFullYear() ||
              selectedFilter.runtimeRange[0] !== 0 ||
              selectedFilter.runtimeRange[1] !== 300 ||
              selectedFilter.voteAverageRange[0] !== 0 ||
              selectedFilter.voteAverageRange[1] !== 10) && (
              <span className="mn-select-btn mn-select-btn-clear">
                <a
                  className="mn-select-clear"
                  href="javascript:void(0)"
                  onClick={resetFilters}
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
                  <MovieCard
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
