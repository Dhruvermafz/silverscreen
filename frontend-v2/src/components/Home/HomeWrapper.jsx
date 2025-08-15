import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../Common/Pagination";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  getGenresFromAPI,
  getMoviesFromAPI,
} from "../../actions/getMoviesFromAPI";

const HomeWrapper = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [totalItemsByGenre, setTotalItemsByGenre] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingNowPlaying, setLoadingNowPlaying] = useState(false);
  const [loadingTopRated, setLoadingTopRated] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState({});
  const [pageByGenre, setPageByGenre] = useState({});
  const [isMoodboardMaximized, setIsMoodboardMaximized] = useState(true);
  const [currentPage, setCurrentPage] = useState({
    trending: 1,
    nowPlaying: 1,
    topRated: 1,
  });
  const pageSize = 8;
  const navigate = useNavigate();
  const { data: authUser } = useGetProfileQuery();

  // Fetch genres on mount and prefill from user preferences
  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres || []);
        const initialPages = fetchedGenres.reduce(
          (acc, genre) => ({ ...acc, [genre.id]: 1 }),
          {}
        );
        setPageByGenre(initialPages);
        if (authUser?.favoriteGenres) {
          const userGenreIds = fetchedGenres
            .filter((g) => authUser.favoriteGenres.includes(g.name))
            .map((g) => g.id);
          setSelectedGenres(userGenreIds);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres", 2);
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, [authUser]);

  // Fetch trending movies
  const fetchTrendingMovies = useCallback(async () => {
    setLoadingTrending(true);
    try {
      const trendingData = await getMoviesFromAPI(
        "",
        { sort: "popularity.desc" },
        currentPage.trending
      );
      setTrendingMovies(
        Array.isArray(trendingData?.movies) ? trendingData.movies : []
      );
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      message.error("Failed to load trending movies", 2);
      setTrendingMovies([]);
    } finally {
      setLoadingTrending(false);
    }
  }, [currentPage.trending]);

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  // Fetch now playing movies
  const fetchNowPlayingMovies = useCallback(async () => {
    setLoadingNowPlaying(true);
    try {
      const nowPlayingData = await getMoviesFromAPI(
        "",
        { now_playing: true },
        currentPage.nowPlaying
      );
      setNowPlayingMovies(
        Array.isArray(nowPlayingData?.movies) ? nowPlayingData.movies : []
      );
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      message.error("Failed to load now playing movies", 2);
      setNowPlayingMovies([]);
    } finally {
      setLoadingNowPlaying(false);
    }
  }, [currentPage.nowPlaying]);

  useEffect(() => {
    fetchNowPlayingMovies();
  }, [fetchNowPlayingMovies]);

  // Fetch top rated movies
  const fetchTopRatedMovies = useCallback(async () => {
    setLoadingTopRated(true);
    try {
      const topRatedData = await getMoviesFromAPI(
        "",
        { sort: "vote_average.desc" },
        currentPage.topRated
      );
      setTopRatedMovies(
        Array.isArray(topRatedData?.movies) ? topRatedData.movies : []
      );
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      message.error("Failed to load top rated movies", 2);
      setTopRatedMovies([]);
    } finally {
      setLoadingTopRated(false);
    }
  }, [currentPage.topRated]);

  useEffect(() => {
    fetchTopRatedMovies();
  }, [fetchTopRatedMovies]);

  // Fetch movies for selected genres
  useEffect(() => {
    const fetchMoviesForGenres = async () => {
      const newMoviesData = {};
      const newTotalItems = { ...totalItemsByGenre };
      const newLoadingMovies = { ...loadingMovies };

      await Promise.all(
        selectedGenres.map(async (genreId) => {
          newLoadingMovies[genreId] = true;
          setLoadingMovies({ ...newLoadingMovies });

          try {
            const data = await getMoviesFromAPI(
              "",
              { genre: genreId },
              pageByGenre[genreId] || 1
            );
            newMoviesData[genreId] = Array.isArray(data?.movies)
              ? data.movies.slice(0, pageSize)
              : [];
            newTotalItems[genreId] = data?.totalResults || 100;
          } catch (error) {
            console.error(`Error fetching movies for genre ${genreId}:`, error);
            message.error(`Failed to load movies for this genre`, 2);
            newMoviesData[genreId] = [];
            newTotalItems[genreId] = 0;
          } finally {
            newLoadingMovies[genreId] = false;
            setLoadingMovies({ ...newLoadingMovies });
          }
        })
      );

      setMoviesByGenre(newMoviesData);
      setTotalItemsByGenre(newTotalItems);
    };

    if (selectedGenres.length > 0) {
      fetchMoviesForGenres();
    } else {
      setMoviesByGenre({});
      setTotalItemsByGenre({});
    }
  }, [selectedGenres, pageByGenre]);

  const handleGenreChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    ).map(Number);
    setSelectedGenres(value);
    const newPages = { ...pageByGenre };
    value.forEach((genreId) => {
      if (!newPages[genreId]) {
        newPages[genreId] = 1;
      }
    });
    setPageByGenre(newPages);
  };

  const handleGenrePageChange = (genreId, page) => {
    setPageByGenre((prev) => ({ ...prev, [genreId]: page }));
  };

  const toggleMoodboard = () => {
    setIsMoodboardMaximized(!isMoodboardMaximized);
  };

  const handleQuickView = (movie) => {
    navigate(`/movies/${movie.id}`);
  };

  const renderMovieCard = (movie, index) => {
    if (!movie?.id || !movie?.title) return null;
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={movie.id}>
        <div className="mn-product-card">
          <div className="mn-product-img">
            <div className="lbl">
              <span
                className={
                  index % 3 === 0
                    ? "trending"
                    : index % 2 === 0
                    ? "new"
                    : "sale"
                }
              >
                {index % 3 === 0
                  ? "Trending"
                  : index % 2 === 0
                  ? "New"
                  : "Popular"}
              </span>
            </div>
            <div className="mn-img">
              <Link to={`/movies/${movie.id}`} className="image">
                <img
                  className="main-img"
                  src={movie.posterUrl || "/assets/imgs/placeholder.png"}
                  alt={movie.title}
                />
                <img
                  className="hover-img"
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                      : movie.posterUrl || "/assets/imgs/placeholder.png"
                  }
                  alt={movie.title}
                />
              </Link>
              <div className="mn-options">
                <ul>
                  <li>
                    <a
                      href="javascript:void(0)"
                      data-tooltip="Quick View"
                      onClick={() => handleQuickView(movie)}
                      aria-label={`View details for ${movie.title}`}
                    >
                      <i className="ri-eye-line"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      data-tooltip="Compare"
                      className="mn-compare"
                      onClick={() => message.info("Added to compare", 2)}
                      aria-label={`Compare ${movie.title}`}
                    >
                      <i className="ri-repeat-line"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      data-tooltip="Add To Watchlist"
                      className="mn-add-cart"
                      onClick={() => message.info("Added to watchlist", 2)}
                      aria-label={`Add ${movie.title} to watchlist`}
                    >
                      <i className="ri-heart-line"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mn-product-detail">
            <div className="cat">
              <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              <ul>
                <li>{movie.release_date?.split("-")[0] || "N/A"}</li>
              </ul>
            </div>
            <h5>
              <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
            </h5>
            <div className="mn-price">
              <div className="mn-price-new">
                {movie.rating?.toFixed(1) || "N/A"}/10
              </div>
            </div>
            <div className="mn-pro-option">
              <div className="mn-pro-color">
                <ul className="mn-opt-swatch">
                  <li>
                    <a
                      href="#"
                      className="mn-opt-clr-img"
                      data-tooltip="Rating"
                    >
                      <span style={{ backgroundColor: "#f3f3f3" }}></span>
                    </a>
                  </li>
                </ul>
              </div>
              <a
                href="javascript:void(0)"
                className="mn-wishlist"
                data-tooltip="Wishlist"
                onClick={() => message.info("Added to watchlist", 2)}
                aria-label={`Add ${movie.title} to watchlist`}
              >
                <i className="ri-heart-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-xxl-12">
        {/* Hero Section */}
        <section className="mn-hero m-b-15">
          {loadingTrending ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !Array.isArray(trendingMovies) || trendingMovies.length === 0 ? (
            <p className="text-center text-muted">
              No trending movies available.
            </p>
          ) : (
            <div className="row">
              {trendingMovies.slice(0, 5).map((movie, index) =>
                movie?.id && movie?.title && movie?.backdrop_path ? (
                  <div
                    key={movie.id}
                    className="col-lg-12 mb-3"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minHeight: "300px",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="mn-hero-detail p-4">
                      <p className="label">
                        <span>{movie.rating?.toFixed(1) || "N/A"}/10</span>
                      </p>
                      <h1>{movie.title}</h1>
                      <p>
                        {movie.overview?.slice(0, 100) ||
                          "No description available"}
                        ...
                      </p>
                      <Link to={`/movies/${movie.id}`} className="mn-btn-2">
                        <span>Watch Now</span>
                      </Link>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
          <Pagination
            totalItems={trendingMovies.length}
            itemsPerPage={pageSize}
            onPageChange={(page) =>
              setCurrentPage({ ...currentPage, trending: page })
            }
            currentPage={currentPage.trending}
          />
        </section>

        {/* Moodboard */}
        <section
          className={`mn-category p-tb-15 ${
            isMoodboardMaximized ? "" : "d-none"
          }`}
        >
          <div className="mn-title">
            <h2>
              What's Your <span>Mood Today?</span>
            </h2>
          </div>
          {loadingGenres ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <select
              multiple
              className="form-select"
              value={selectedGenres}
              onChange={handleGenreChange}
              aria-label="Select genres"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={String(genre.id)}>
                  {genre.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="mn-btn-2 mt-2"
            onClick={toggleMoodboard}
            aria-label="Minimize moodboard"
          >
            <span>Minimize</span>
          </button>
        </section>
        {!isMoodboardMaximized && (
          <button
            className="mn-btn-2 position-fixed bottom-0 end-0 m-3"
            onClick={toggleMoodboard}
            aria-label="Open moodboard"
          >
            <span>Moodboard</span>
          </button>
        )}

        {/* Category Section */}
        <section className="mn-category p-tb-15">
          <div className="mn-title">
            <h2>
              Explore <span>Genres</span>
            </h2>
          </div>
          <div className="row">
            {genres.map((genre, index) => (
              <div
                key={genre.id}
                className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"
              >
                <div className={`mn-cat-card cat-card-${index + 1}`}>
                  <p className="lbl">
                    <span>{genre.name}</span>
                  </p>
                  <span className="bg">{genre.name}</span>
                  <h4>Movies</h4>
                  <h3>{genre.name}</h3>
                  <p>Items ({totalItemsByGenre[genre.id] || 0})</p>
                  <ul className="d-flex flex-wrap">
                    {moviesByGenre[genre.id]?.slice(0, 3).map((movie) => (
                      <li key={movie.id} className="me-2">
                        <Link to={`/movies/${movie.id}`}>
                          <img
                            src={
                              movie.posterUrl || "/assets/imgs/placeholder.png"
                            }
                            alt={movie.title}
                            style={{
                              width: "50px",
                              height: "75px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Now Playing Movies */}
        <section className="mn-new-product p-tb-15">
          <div className="mn-title">
            <h2>
              Now <span>Playing</span>
            </h2>
          </div>
          {loadingNowPlaying ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !Array.isArray(nowPlayingMovies) ||
            nowPlayingMovies.length === 0 ? (
            <p className="text-center text-muted">
              No now playing movies available.
            </p>
          ) : (
            <div className="row">{nowPlayingMovies.map(renderMovieCard)}</div>
          )}
          <Pagination
            totalItems={totalItemsByGenre.nowPlaying || nowPlayingMovies.length}
            itemsPerPage={pageSize}
            onPageChange={(page) =>
              setCurrentPage({ ...currentPage, nowPlaying: page })
            }
            currentPage={currentPage.nowPlaying}
          />
        </section>

        {/* Top Rated Movies */}
        <section className="mn-new-product p-tb-15">
          <div className="mn-title">
            <h2>
              Top <span>Rated</span>
            </h2>
          </div>
          {loadingTopRated ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !Array.isArray(topRatedMovies) || topRatedMovies.length === 0 ? (
            <p className="text-center text-muted">
              No top rated movies available.
            </p>
          ) : (
            <div className="row">{topRatedMovies.map(renderMovieCard)}</div>
          )}
          <Pagination
            totalItems={totalItemsByGenre.topRated || topRatedMovies.length}
            itemsPerPage={pageSize}
            onPageChange={(page) =>
              setCurrentPage({ ...currentPage, topRated: page })
            }
            currentPage={currentPage.topRated}
          />
        </section>

        {/* Movies by Selected Genres */}
        {selectedGenres.map((genreId) => {
          const genre = genres.find((g) => g.id === genreId);
          return (
            <section key={genreId} className="mn-new-product p-tb-15">
              <div className="mn-title">
                <h2>
                  {genre?.name || "Unknown Genre"} <span>Movies</span>
                </h2>
              </div>
              {loadingMovies[genreId] ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : !Array.isArray(moviesByGenre[genreId]) ||
                moviesByGenre[genreId].length === 0 ? (
                <p className="text-center text-muted">
                  No movies available for this genre.
                </p>
              ) : (
                <div className="row">
                  {moviesByGenre[genreId].map(renderMovieCard)}
                </div>
              )}
              <Pagination
                totalItems={totalItemsByGenre[genreId] || 0}
                itemsPerPage={pageSize}
                onPageChange={(page) => handleGenrePageChange(genreId, page)}
                currentPage={pageByGenre[genreId] || 1}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HomeWrapper;
