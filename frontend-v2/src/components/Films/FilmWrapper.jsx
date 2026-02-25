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
  getCustomCategories,
} from "../../actions/getMoviesFromAPI";
import debounce from "lodash.debounce";
import MovieCard from "./MovieCard";
import Pagination from "../Common/Pagination";

const { Search } = Input;

// Hardcoded popular languages (most used in movies)
const POPULAR_LANGUAGES = [
  { iso_639_1: "", english_name: "Any Language" },
  { iso_639_1: "en", english_name: "English" },
  { iso_639_1: "hi", english_name: "Hindi" },
  { iso_639_1: "ta", english_name: "Tamil" },
  { iso_639_1: "te", english_name: "Telugu" },
  { iso_639_1: "kn", english_name: "Kannada" },
  { iso_639_1: "ml", english_name: "Malayalam" },
  { iso_639_1: "es", english_name: "Spanish" },
  { iso_639_1: "fr", english_name: "French" },
  { iso_639_1: "zh", english_name: "Chinese" },
  { iso_639_1: "ja", english_name: "Japanese" },
  { iso_639_1: "ko", english_name: "Korean" },
];

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
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const [genres, setGenres] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { data: lists = [] } = useGetListsQuery();
  const { data: profile } = useGetProfileQuery();
  const [addMovieToList] = useAddMovieToListMutation();

  const customCategories = useMemo(() => getCustomCategories(), []);

  // Parse URL query params (genre, year)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreParam = params.get("genre");
    const yearParam = params.get("year");

    let newFilters = { ...filters };

    if (genreParam && genres.length > 0) {
      const genre = genres.find(
        (g) => g.name.toLowerCase() === genreParam.toLowerCase(),
      );
      if (genre) {
        newFilters.genres = [genre.id.toString()];
      }
    }

    if (yearParam && !isNaN(yearParam)) {
      const year = Number(yearParam);
      newFilters.yearRange = [year, year];
    }

    setFilters(newFilters);
    setPage(1);
  }, [location.search, genres]);

  // Load genres once
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres || []);
      } catch (err) {
        message.error("Failed to load genres");
      }
    };
    fetchGenres();
  }, []);

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((value) => {
      setSearchQuery(value.trim());
      setPage(1);
    }, 500),
    [],
  );

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters = {
        ...filters,
        category: selectedCategory || undefined,
      };

      const response = await getMoviesFromAPI(searchQuery, apiFilters, page);

      setMovies(response.movies || []);
      setTotal(response.totalResults || 0);

      if (response.movies.length === 0 && page === 1) {
        message.info("No movies found. Try different filters.");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, selectedCategory, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const updateFilters = useCallback((newPartial) => {
    setFilters((prev) => ({ ...prev, ...newPartial }));
    setPage(1);
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value || "");
  };

  const handleGenreToggle = (genreId) => {
    const idStr = genreId.toString();
    const newGenres = filters.genres.includes(idStr)
      ? filters.genres.filter((id) => id !== idStr)
      : [...filters.genres, idStr];
    updateFilters({ genres: newGenres });
  };

  const handleAddToList = async (movie, listId) => {
    try {
      await addMovieToList({
        listId,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path:
            movie.poster_path || movie.posterUrl?.split("/w500")[1] || "",
        },
      }).unwrap();
      message.success(`Added "${movie.title}" to list`);
    } catch (err) {
      message.error("Failed to add to list");
    }
  };

  const handleToggleLike = useCallback(
    (movie) => () => {
      setMovies((prev) =>
        prev.map((m) =>
          m.id === movie.id ? { ...m, isLiked: !m.isLiked } : m,
        ),
      );
    },
    [],
  );

  const handleReviewClick = useCallback(
    (movie) => () => {
      if (!profile) {
        message.warning("Please log in to write a review");
        return;
      }
      setMovies((prev) =>
        prev.map((m) =>
          m.id === movie.id ? { ...m, showReviewModal: true } : m,
        ),
      );
    },
    [profile],
  );

  const handleModalClose = useCallback(
    (movie) => () => {
      setMovies((prev) =>
        prev.map((m) =>
          m.id === movie.id ? { ...m, showReviewModal: false } : m,
        ),
      );
    },
    [],
  );

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
    });
    navigate("/explore");
    setPage(1);
  };

  const pageSize = 20;
  const currentYear = new Date().getFullYear();

  const hasActiveFilters =
    selectedCategory ||
    filters.genres.length > 0 ||
    filters.language ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < currentYear;

  return (
    <section className="mn-explore py-4">
      <div className="container">
        <div className="row">
          {/* Mobile filter toggle */}
          <div className="col-12 mb-4 d-lg-none">
            <Button
              block
              size="large"
              onClick={() => setIsSidebarOpen(true)}
              icon={<i className="ri-filter-3-line me-2" />}
            >
              Filters {hasActiveFilters && `(${filters.genres.length || ""})`}
            </Button>
          </div>

          {/* Sidebar / Filters */}
          <div className={`col-lg-3 ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <div
              className="explore-sidebar bg-light border rounded-3 p-4 h-100 position-sticky top-0"
              style={{ maxHeight: "95vh", overflowY: "auto" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Filters</h4>
                <Button
                  type="text"
                  icon={<i className="ri-close-line" />}
                  onClick={() => setIsSidebarOpen(false)}
                  className="d-lg-none"
                />
              </div>

              {/* Vibe / Category */}
              <div className="mb-5">
                <h6 className="mb-3">Vibe Check</h6>
                <Select
                  className="w-100"
                  placeholder="Choose a vibe..."
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
              <div className="mb-5">
                <h6 className="mb-3">Genres</h6>
                <Space direction="vertical" className="w-100" wrap>
                  {genres.slice(0, 12).map((genre) => (
                    <Tag.CheckableTag
                      key={genre.id}
                      checked={filters.genres.includes(genre.id.toString())}
                      onChange={() => handleGenreToggle(genre.id)}
                    >
                      {genre.name}
                    </Tag.CheckableTag>
                  ))}
                  {genres.length > 12 && (
                    <div className="text-muted small">
                      +{genres.length - 12} more
                    </div>
                  )}
                </Space>
              </div>

              {/* Year Range */}
              <div className="mb-5">
                <h6 className="mb-3">Release Year</h6>
                <Slider
                  range
                  min={1900}
                  max={currentYear}
                  value={filters.yearRange}
                  onChange={(v) => updateFilters({ yearRange: v })}
                  tooltip={{ formatter: (val) => val }}
                />
              </div>

              {/* Language */}
              <div className="mb-5">
                <h6 className="mb-3">Language</h6>
                <Select
                  className="w-100"
                  placeholder="Any language"
                  value={filters.language || undefined}
                  onChange={(v) => updateFilters({ language: v || "" })}
                  allowClear
                  size="middle"
                >
                  {POPULAR_LANGUAGES.map((lang) => (
                    <Select.Option key={lang.iso_639_1} value={lang.iso_639_1}>
                      {lang.english_name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <Button
                block
                type="primary"
                danger
                size="large"
                onClick={resetAllFilters}
                className="mt-4"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9">
            {/* Search + Sort + View Toggle */}
            <div className="mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-7">
                  <Search
                    placeholder="Search movies..."
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={(value) => {
                      setSearchQuery(value.trim());
                      setPage(1);
                    }}
                    onChange={(e) => debouncedFetch(e.target.value)}
                  />
                </div>
                <div className="col-md-5 text-md-end">
                  <Space wrap>
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
                      onChange={(v) => updateFilters({ sort: v })}
                      style={{ width: 180 }}
                      size="middle"
                    >
                      <Select.Option value="popularity.desc">
                        Popular
                      </Select.Option>
                      <Select.Option value="vote_average.desc">
                        Top Rated
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

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="mb-4">
                <Space size={[8, 8]} wrap>
                  {selectedCategory && (
                    <Tag
                      color="volcano"
                      closable
                      onClose={() => setSelectedCategory("")}
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
                      onClose={() => updateFilters({ language: "" })}
                    >
                      {
                        POPULAR_LANGUAGES.find(
                          (l) => l.iso_639_1 === filters.language,
                        )?.english_name
                      }
                    </Tag>
                  )}
                  {(filters.yearRange[0] > 1900 ||
                    filters.yearRange[1] < currentYear) && (
                    <Tag
                      color="purple"
                      closable
                      onClose={() =>
                        updateFilters({ yearRange: [1900, currentYear] })
                      }
                    >
                      {filters.yearRange[0]} – {filters.yearRange[1]}
                    </Tag>
                  )}
                </Space>
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h4>No movies found</h4>
                <p>Try changing filters or search term</p>
              </div>
            ) : (
              <div className="row g-4">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className={`${
                      isGridView
                        ? "col-xl-3 col-lg-4 col-md-6 col-sm-6"
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
            {total > pageSize && !loading && (
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

      {/* Mobile sidebar overlay */}
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
