import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import Pagination from "../Common/Pagination";
import "./search.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pageSize = 12;

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setTotalResults(0);
        return;
      }
      setIsLoading(true);
      try {
        const { movies, totalResults } = await getMoviesFromAPI(
          query,
          {},
          currentPage
        );
        setSearchResults(movies);
        setTotalResults(totalResults);
        setIsLoading(false);
        // Save to recent searches
        if (query && !recentSearches.includes(query)) {
          const updatedSearches = [query, ...recentSearches.slice(0, 4)]; // Keep last 5
          setRecentSearches(updatedSearches);
          localStorage.setItem(
            "recentSearches",
            JSON.stringify(updatedSearches)
          );
        }
      } catch (err) {
        setError(err.message || "Failed to fetch search results");
        setIsLoading(false);
        message.error("Failed to fetch search results", 2);
      }
    }, 500),
    [currentPage, recentSearches]
  );

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Clear individual recent search
  const handleClearSearch = (search) => {
    const updatedSearches = recentSearches.filter((s) => s !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  // Clear all recent searches
  const handleClearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    message.success("Cleared all recent searches", 2);
  };

  // Handle page change
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
  }, [currentPage, searchQuery, debouncedSearch]);

  // Toggle search panel (for mobile)
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  if (error) {
    return (
      <div className="mn-error text-center my-5 animate__animated animate__fadeIn">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      {/* Search Page */}
      <section className="mn-search-page my-5" aria-label="Search movies">
        <div className="mn-container">
          {/* Search Sidebar */}
          <div className={`mn-side-search ${isSearchOpen ? "open" : ""}`}>
            <div className="mn-search-inner">
              <div className="mn-search-title">
                <span>Search</span>
                <a
                  href="javascript:void(0)"
                  className="mn-search-close"
                  onClick={toggleSearch}
                  aria-label="Close search"
                >
                  <i className="ri-close-line"></i>
                </a>
              </div>
              <div className="mn-search">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    aria-label="Search movies"
                  />
                  <a href="javascript:void(0)" aria-label="Search">
                    <i className="ri-search-line"></i>
                  </a>
                </form>
              </div>
              <div className="mn-search-list">
                {recentSearches.length > 0 && (
                  <div className="mn-search-also">
                    <div className="mn-search-title">
                      <span>Recent Searches</span>
                      <a
                        href="javascript:void(0)"
                        onClick={handleClearAllSearches}
                        aria-label="Clear all recent searches"
                      >
                        Clear All
                      </a>
                    </div>
                    <ul>
                      {recentSearches.map((search, index) => (
                        <li key={index}>
                          <Link
                            to="#"
                            onClick={() => setSearchQuery(search)}
                            aria-label={`Search for ${search}`}
                          >
                            {search}
                          </Link>
                          <a
                            href="javascript:void(0)"
                            className="search-remove-item"
                            onClick={() => handleClearSearch(search)}
                            aria-label={`Remove ${search} from recent searches`}
                          >
                            ×
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="mn-search-results">
            <h2 className="mn-title">
              Search Results {searchQuery && <span>for "{searchQuery}"</span>}
            </h2>
            {isLoading ? (
              <div className="mn-loading text-center my-5 animate__animated animate__fadeIn">
                <div className="mn-spinner"></div>
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="mn-grid animate__animated animate__fadeIn">
                  {searchResults.map((movie) => (
                    <div key={movie.id} className="mn-grid-item">
                      <div className="mn-profile-card">
                        <div className="mn-profile-img">
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                : "https://via.placeholder.com/200?text=Movie+Poster"
                            }
                            alt={movie.title}
                            loading="lazy"
                          />
                          <div className="mn-options">
                            <Link
                              to={`/movies/${movie.id}`}
                              aria-label={`View details for ${movie.title}`}
                            >
                              <i className="ri-eye-line"></i>
                            </Link>
                          </div>
                        </div>
                        <div className="mn-profile-detail">
                          <h5 className="mn-profile-title">
                            <Link to={`/movies/${movie.id}`}>
                              {movie.title}
                            </Link>
                          </h5>
                          <div className="mn-pro-rating">
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`ri-star-fill ${
                                  index < Math.round(movie.rating / 2)
                                    ? ""
                                    : "grey"
                                }`}
                              ></i>
                            ))}
                          </div>
                          <p className="mn-profile-text">
                            {movie.release_date?.substring(0, 4) || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  totalItems={totalResults}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  currentPage={currentPage}
                />
              </>
            ) : (
              <p className="mn-text-muted">
                {searchQuery
                  ? "No movies found for your search."
                  : "Enter a search term to find movies."}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
