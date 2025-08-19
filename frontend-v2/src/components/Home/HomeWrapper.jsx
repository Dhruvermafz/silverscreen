import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../Common/Pagination";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  getGenresFromAPI,
  getMoviesFromAPI,
} from "../../actions/getMoviesFromAPI";
import MovieCard from "../Films/MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
const HomeWrapper = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [totalItemsByGenre, setTotalItemsByGenre] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingNewReleases, setLoadingNewReleases] = useState(false);
  const [loadingTopRated, setLoadingTopRated] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState({});
  const [pageByGenre, setPageByGenre] = useState({});
  const [currentPage, setCurrentPage] = useState({
    trending: 1,
    newReleases: 1,
    topRated: 1,
  });
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [reviewModals, setReviewModals] = useState({});
  const [lists, setLists] = useState([]);
  const pageSize = 8;
  const navigate = useNavigate();
  const { data: authUser, isLoading: profileLoading } = useGetProfileQuery();

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres", 2);
      }
    };
    fetchGenres();
  }, []);

  // Fetch user lists
  useEffect(() => {
    if (authUser?.lists) {
      setLists(authUser.lists || []);
    }
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
      setTrendingMovies(trendingData.movies || []);
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

  // Fetch new releases
  const fetchNewReleases = useCallback(async () => {
    setLoadingNewReleases(true);
    try {
      const newReleaseData = await getMoviesFromAPI(
        "",
        { yearRange: [new Date().getFullYear() - 1, new Date().getFullYear()] },
        currentPage.newReleases
      );
      setNewReleases(newReleaseData.movies || []);
    } catch (error) {
      console.error("Error fetching new releases:", error);
      message.error("Failed to load new releases", 2);
      setNewReleases([]);
    } finally {
      setLoadingNewReleases(false);
    }
  }, [currentPage.newReleases]);

  useEffect(() => {
    fetchNewReleases();
  }, [fetchNewReleases]);

  // Fetch top-rated movies
  const fetchTopRatedMovies = useCallback(async () => {
    setLoadingTopRated(true);
    try {
      const topRatedData = await getMoviesFromAPI(
        "",
        { sort: "vote_average.desc", voteAverageRange: [7, 10] },
        currentPage.topRated
      );
      setTopRatedMovies(topRatedData.movies || []);
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
      message.error("Failed to load top-rated movies", 2);
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
              { genres: [genreId] },
              pageByGenre[genreId] || 1
            );
            newMoviesData[genreId] = data.movies.slice(0, pageSize);
            newTotalItems[genreId] = data.totalResults || 100;
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

  const handleGenreChange = (value) => {
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

  const handleToggleLike = (movie) => () => {
    setLikedMovies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movie.id)) {
        newSet.delete(movie.id);
        message.info(`Removed ${movie.title} from favorites`, 2);
      } else {
        newSet.add(movie.id);
        message.info(`Added ${movie.title} to favorites`, 2);
      }
      return newSet;
    });
  };

  const handleAddToList = (movie, listId) => {
    message.info(`Added ${movie.title} to list`, 2);
    // Implement API call to add movie to list if needed
  };

  const handleReviewClick = (movie) => () => {
    setReviewModals((prev) => ({ ...prev, [movie.id]: true }));
  };

  const handleModalClose = (movie) => () => {
    setReviewModals((prev) => ({ ...prev, [movie.id]: false }));
  };

  const renderMovieCard = (movie, index) => {
    if (!movie?.id || !movie?.title) return null;
    return (
      <MovieCard
        key={movie.id}
        movie={{
          ...movie,
          isNew: movie.release_date
            ? new Date(movie.release_date).getFullYear() ===
              new Date().getFullYear()
            : false,
          isLiked: likedMovies.has(movie.id),
          showReviewModal: reviewModals[movie.id] || false,
        }}
        lists={lists}
        profile={authUser}
        isGridView={true}
        handleToggleLike={handleToggleLike}
        handleAddToList={handleAddToList}
        handleReviewClick={handleReviewClick}
        handleModalClose={handleModalClose}
      />
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
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 3000 }}
              loop
            >
              {trendingMovies.slice(0, 5).map((movie) =>
                movie?.id && movie?.title && movie?.posterUrl ? (
                  <SwiperSlide key={movie.id}>
                    <div
                      className="mn-hero-slide"
                      style={{
                        backgroundImage: `url(${
                          movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                            : movie.posterUrl
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "300px",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="mn-hero-detail">
                        <p className="label">
                          <span>{movie.rating.toFixed(1)} / 10</span>
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
                  </SwiperSlide>
                ) : null
              )}
            </Swiper>
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

        {/* New Releases */}
        <section className="mn-new-product p-tb-15">
          <div className="mn-title">
            <h2>
              New <span>Releases</span>
            </h2>
          </div>
          {loadingNewReleases ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !Array.isArray(newReleases) || newReleases.length === 0 ? (
            <p className="text-center text-muted">No new releases available.</p>
          ) : (
            <div className="row">{newReleases.map(renderMovieCard)}</div>
          )}
          <Pagination
            totalItems={newReleases.length}
            itemsPerPage={pageSize}
            onPageChange={(page) =>
              setCurrentPage({ ...currentPage, newReleases: page })
            }
            currentPage={currentPage.newReleases}
          />
        </section>

        {/* Top Rated */}
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
              No top-rated movies available.
            </p>
          ) : (
            <div className="row">{topRatedMovies.map(renderMovieCard)}</div>
          )}
          <Pagination
            totalItems={topRatedMovies.length}
            itemsPerPage={pageSize}
            onPageChange={(page) =>
              setCurrentPage({ ...currentPage, topRated: page })
            }
            currentPage={currentPage.topRated}
          />
        </section>

        {/* Selected Genres */}
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
