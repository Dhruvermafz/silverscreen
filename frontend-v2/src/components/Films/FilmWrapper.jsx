import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { message, Slider, Select, Input, Button, Tag, Space } from "antd";
import {
  useGetListsQuery,
  useAddMovieToListMutation,
} from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
  getLanguagesFromAPI,
  getCustomCategories,
} from "../../actions/getMoviesFromAPI";
import debounce from "lodash.debounce";
import MovieCard from "./MovieCard";
import Pagination from "../Common/Pagination";

const { Search } = Input;

const FilmWrapper = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({
    genres: [],
    sort: "popularity.desc",
    yearRange: [1900, new Date().getFullYear()],
    language: "",
    runtimeRange: [0, 300],
    voteAverageRange: [0, 10],
    category: "", // For custom vibes
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { data: lists = [] } = useGetListsQuery();
  const { data: profile } = useGetProfileQuery();
  const [addMovieToList] = useAddMovieToListMutation();

  const customCategories = useMemo(() => getCustomCategories(), []);

  // Parse URL params on mount or change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreParam = params.get("genre");
    const yearParam = params.get("year");

    let newFilters = { ...filters };

    if (genreParam && genres.length > 0) {
      const genre = genres.find(
        (g) => g.name.toLowerCase() === genreParam.toLowerCase()
      );
      if (genre) newFilters.genres = [genre.id.toString()];
    }

    if (yearParam && !isNaN(yearParam)) {
      const year = Number(yearParam);
      newFilters.yearRange = [year, year];
    }

    setFilters(newFilters);
    setPage(1);
  }, [location.search, genres]);

  // Fetch genres & languages
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fetchedGenres, fetchedLanguages] = await Promise.all([
          getGenresFromAPI(),
          getLanguagesFromAPI(),
        ]);
        setGenres(fetchedGenres || []);
        setLanguages(fetchedLanguages || []);
      } catch (err) {
        message.error("Failed to load filters");
      }
    };
    fetchInitialData();
  }, []);

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPage(1);
    }, 500),
    []
  );

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMoviesFromAPI(
        searchQuery,
        { ...filters, category: selectedCategory || undefined },
        page
      );
      setMovies(response.movies || []);
      setTotal(response.totalResults || 0);

      if (response.movies.length === 0 && page === 1) {
        message.info("No movies found matching your filters");
      }
    } catch (err) {
      message.error("Failed to load movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, selectedCategory, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value || "");
    updateFilters({ ...filters, category: value || "" });
  };

  const handleGenreToggle = (genreId) => {
    const newGenres = filters.genres.includes(genreId.toString())
      ? filters.genres.filter((id) => id !== genreId.toString())
      : [...filters.genres, genreId.toString()];
    updateFilters({ ...filters, genres: newGenres });
  };

  const handleAddToList = async (movie, listId) => {
    try {
      await addMovieToList({
        listId,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || movie.posterUrl?.split("/w500")[1],
        },
      }).unwrap();
      message.success(`Added "${movie.title}" to list`);
    } catch (err) {
      message.error("Failed to add to list");
    }
  };

  const handleToggleLike = (movie) => () => {
    setMovies((prev) =>
      prev.map((m) => (m.id === movie.id ? { ...m, isLiked: !m.isLiked } : m))
    );
  };

  const handleReviewClick = (movie) => () => {
    if (!profile) {
      message.warning("Please log in to review");
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

  const resetAllFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setFilters({
      genres: [],
      sort: "popularity.desc",
      yearRange: [1900, new Date().getFullYear()],
      language: "",
      runtimeRange: [0, 300],
      voteAverageRange: [0, 10],
      category: "",
    });
    navigate("/explore");
    setPage(1);
  };

  const pageSize = 20;
  const currentYear = new Date().getFullYear();

  return (
    <section className="mn-explore py-4">
      <div className="container">
        <div className="row">
          {/* Mobile Filter Toggle */}
          <div className="col-12 mb-4 d-lg-none">
            <Button
              block
              size="large"
              onClick={() => setIsSidebarOpen(true)}
              icon={<i className="ri-filter-3-line me-2" />}
            >
              Filters{" "}
              {filters.genres.length > 0 && `(${filters.genres.length})`}
            </Button>
          </div>

          {/* Sidebar */}
          <div className={`col-lg-3 ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div
              className="explore-sidebar bg-dark rounded-3 p-4 h-100 position-sticky top-0"
              style={{ maxHeight: "95vh", overflowY: "auto" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 text-white">Discover Filters</h4>
                <Button
                  type="text"
                  icon={<i className="ri-close-line" />}
                  onClick={() => setIsSidebarOpen(false)}
                  className="d-lg-none text-white"
                />
              </div>

              {/* Vibe Check */}
              <div className="mb-4">
                <h6 className="text-white mb-3">Vibe Check</h6>
                <Select
                  className="w-100"
                  placeholder="Choose a mood..."
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  allowClear
                  size="large"
                >
                  {customCategories.map((cat) => (
                    <Select.Option key={cat.key} value={cat.key}>
                      {cat.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* Genres */}
              <div className="mb-4">
                <h6 className="text-white mb-3">Genres</h6>
                <Space direction="vertical" className="w-100">
                  {genres.slice(0, 10).map((genre) => (
                    <Tag.CheckableTag
                      key={genre.id}
                      checked={filters.genres.includes(genre.id.toString())}
                      onChange={() => handleGenreToggle(genre.id)}
                      className="py-2 px-3"
                    >
                      {genre.name}
                    </Tag.CheckableTag>
                  ))}
                  {genres.length > 10 && (
                    <Tag className="text-muted">+{genres.length - 10} more</Tag>
                  )}
                </Space>
              </div>

              {/* Other Filters */}
              <div className="mb-4">
                <h6 className="text-white mb-3">Year Range</h6>
                <Slider
                  range
                  min={1900}
                  max={currentYear}
                  value={filters.yearRange}
                  onChange={(v) => updateFilters({ ...filters, yearRange: v })}
                />
              </div>

              <div className="mb-4">
                <h6 className="text-white mb-3">Language</h6>
                <Select
                  className="w-100"
                  placeholder="Any language"
                  value={filters.language || undefined}
                  onChange={(v) =>
                    updateFilters({ ...filters, language: v || "" })
                  }
                  allowClear
                >
                  {languages
                    .filter((l) =>
                      ["en", "hi", "es", "fr", "zh", "ta", "te"].includes(
                        l.iso_639_1
                      )
                    )
                    .map((lang) => (
                      <Select.Option
                        key={lang.iso_639_1}
                        value={lang.iso_639_1}
                      >
                        {lang.english_name}
                      </Select.Option>
                    ))}
                </Select>
              </div>

              <Button block danger onClick={resetAllFilters} className="mt-4">
                Reset All Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Search & Sort Bar */}
            <div className="mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <Search
                    placeholder="Search for movies..."
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={(value) => {
                      setSearchQuery(value);
                      setPage(1);
                    }}
                    onChange={(e) => debouncedFetch(e.target.value)}
                  />
                </div>
                <div className="col-md-4 text-md-end">
                  <Space>
                    <Button
                      icon={<i className="ri-apps-2-line" />}
                      type={isGridView ? "primary" : "default"}
                      onClick={() => setIsGridView(true)}
                    />
                    <Button
                      icon={<i className="ri-list-check-2" />}
                      type={!isGridView ? "primary" : "default"}
                      onClick={() => setIsGridView(false)}
                    />
                    <Select
                      value={filters.sort}
                      onChange={(v) => updateFilters({ ...filters, sort: v })}
                      style={{ width: 200 }}
                    >
                      <Select.Option value="popularity.desc">
                        Most Popular
                      </Select.Option>
                      <Select.Option value="vote_average.desc">
                        Highest Rated
                      </Select.Option>
                      <Select.Option value="release_date.desc">
                        Newest
                      </Select.Option>
                      <Select.Option value="revenue.desc">
                        Box Office
                      </Select.Option>
                    </Select>
                  </Space>
                </div>
              </div>
            </div>

            {/* Active Filters Chips */}
            {(selectedCategory ||
              filters.genres.length > 0 ||
              filters.language ||
              filters.yearRange[0] > 1900) && (
              <div className="mb-4">
                <Space size={[8, 8]} wrap>
                  {selectedCategory && (
                    <Tag
                      color="volcano"
                      closable
                      onClose={() => handleCategoryChange("")}
                    >
                      {
                        customCategories.find((c) => c.key === selectedCategory)
                          ?.label
                      }
                    </Tag>
                  )}
                  {filters.genres.map((id) => {
                    const g = genres.find((gg) => gg.id.toString() === id);
                    return g ? (
                      <Tag
                        key={id}
                        color="blue"
                        closable
                        onClose={() => handleGenreToggle(id)}
                      >
                        {g.name}
                      </Tag>
                    ) : null;
                  })}
                  {filters.language && (
                    <Tag
                      color="green"
                      closable
                      onClose={() =>
                        updateFilters({ ...filters, language: "" })
                      }
                    >
                      {
                        languages.find((l) => l.iso_639_1 === filters.language)
                          ?.english_name
                      }
                    </Tag>
                  )}
                  {filters.yearRange[0] > 1900 && (
                    <Tag
                      color="purple"
                      closable
                      onClose={() =>
                        updateFilters({
                          ...filters,
                          yearRange: [1900, currentYear],
                        })
                      }
                    >
                      {filters.yearRange[0]} - {filters.yearRange[1]}
                    </Tag>
                  )}
                </Space>
              </div>
            )}

            {/* Movies Grid/List */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h5>No movies found</h5>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="row g-4">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className={`${
                      isGridView
                        ? "col-xl-3 col-lg-4 col-md-4 col-sm-6"
                        : "col-12"
                    }`}
                  >
                    <MovieCard
                      movie={movie}
                      lists={lists}
                      profile={profile}
                      isGridView={isGridView}
                      handleToggleLike={handleToggleLike}
                      handleAddToList={handleAddToList}
                      handleReviewClick={handleReviewClick}
                      handleModalClose={handleModalClose}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > pageSize && (
              <div className="mt-5 text-center">
                <Pagination
                  page={page}
                  total={total}
                  pageSize={pageSize}
                  handlePageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-1030 d-lg-none"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </section>
  );
};

export default FilmWrapper;
