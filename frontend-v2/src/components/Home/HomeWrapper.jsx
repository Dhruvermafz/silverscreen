import React, { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import MovieCard from "../Films/MovieCard";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import { useGetProfileQuery } from "../../actions/userApi";

const HomeWrapper = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);

  const [likedMovies, setLikedMovies] = useState(() => new Set());
  const [reviewModals, setReviewModals] = useState({});

  const { data: authUser, isLoading: profileLoading } = useGetProfileQuery();

  // Lists from user profile
  const lists = useMemo(() => authUser?.lists || [], [authUser]);

  // Fetch trending movies (hero slider)
  const fetchTrending = useCallback(async () => {
    setLoadingTrending(true);
    try {
      const { movies } = await getMoviesFromAPI(
        "",
        { sort: "popularity.desc" },
        1,
      );
      setTrendingMovies(movies?.slice(0, 10) || []);
    } catch (err) {
      console.error("Trending fetch failed:", err);
      message.error("Failed to load trending movies");
      setTrendingMovies([]);
    } finally {
      setLoadingTrending(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  // Fetch latest releases
  const fetchLatest = useCallback(async () => {
    setLoadingLatest(true);
    try {
      const { movies } = await getMoviesFromAPI(
        "",
        { sort: "release_date.desc" },
        1,
      );
      setLatestMovies(movies?.slice(0, 20) || []);
    } catch (err) {
      console.error("Latest movies fetch failed:", err);
      message.error("Failed to load latest releases");
      setLatestMovies([]);
    } finally {
      setLoadingLatest(false);
    }
  }, []);

  useEffect(() => {
    fetchLatest();
  }, [fetchLatest]);

  // Like handler
  const handleToggleLike = useCallback((movie) => {
    setLikedMovies((prev) => {
      const next = new Set(prev);
      if (next.has(movie.id)) {
        next.delete(movie.id);
        message.info(`Removed ${movie.title} from favorites`);
      } else {
        next.add(movie.id);
        message.info(`Added ${movie.title} to favorites`);
      }
      return next;
    });
  }, []);

  // Add to list (placeholder)
  const handleAddToList = useCallback((movie, listId) => {
    // TODO: real API call
    message.success(`Added ${movie.title} to list`);
  }, []);

  // Review modal handlers
  const handleReviewClick = useCallback((movie) => {
    setReviewModals((prev) => ({ ...prev, [movie.id]: true }));
  }, []);

  const handleModalClose = useCallback((movie) => {
    setReviewModals((prev) => ({ ...prev, [movie.id]: false }));
  }, []);

  // Memoized card renderer
  const renderMovieCard = useCallback(
    (movie) => {
      if (!movie?.id) return null;

      return (
        <SwiperSlide key={movie.id}>
          <MovieCard
            movie={{
              ...movie,
              isLiked: likedMovies.has(movie.id),
              showReviewModal: !!reviewModals[movie.id],
            }}
            lists={lists}
            profile={authUser}
            isGridView={false}
            handleToggleLike={() => handleToggleLike(movie)}
            handleAddToList={(listId) => handleAddToList(movie, listId)}
            handleReviewClick={() => handleReviewClick(movie)}
            handleModalClose={() => handleModalClose(movie)}
          />
        </SwiperSlide>
      );
    },
    [
      likedMovies,
      reviewModals,
      lists,
      authUser,
      handleToggleLike,
      handleAddToList,
      handleReviewClick,
      handleModalClose,
    ],
  );

  if (profileLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Slider - Trending */}
      <section className="mn-hero mb-5 position-relative overflow-hidden">
        {loadingTrending ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : trendingMovies.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No trending movies available</h3>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 5000 }}
            loop
            className="hero-swiper"
          >
            {trendingMovies.slice(0, 6).map((movie) => (
              <SwiperSlide key={movie.id}>
                <div
                  className="hero-slide d-flex align-items-center"
                  style={{
                    backgroundImage: `linear-gradient(
                      to bottom,
                      rgba(0,0,0,0.15) 0%,
                      rgba(0,0,0,0.45) 70%,
                      rgba(0,0,0,0.65) 100%
                    ), url(${
                      movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : movie.posterUrl || "/assets/imgs/placeholder.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "70vh",
                  }}
                >
                  <div className="container">
                    <div className="hero-content text-white">
                      <p className="badge bg-primary text-white mb-3 fs-6">
                        ★ {movie.rating?.toFixed(1) || "N/A"} / 10
                      </p>
                      <h1 className="display-4 fw-bold mb-3 text-shadow">
                        {movie.title}
                      </h1>
                      <p
                        className="lead mb-4 text-shadow"
                        style={{ maxWidth: "640px" }}
                      >
                        {movie.overview?.substring(0, 220) ||
                          "No overview available."}
                        {movie.overview?.length > 220 ? "..." : ""}
                      </p>
                      <Link
                        to={`/movies/${movie.id}`}
                        className="btn btn-danger btn-lg px-4"
                      >
                        Watch Now
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <div className="container">
        {/* Latest Releases Section */}
        <section className="mn-section py-5">
          <div className="mn-title mb-4">
            <h2 className="fw-bold">Latest Releases</h2>
          </div>

          {loadingLatest ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : latestMovies.length === 0 ? (
            <p className="text-center text-muted py-5">
              No new releases available right now.
            </p>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={latestMovies.length > 6}
              slidesPerView={2}
              spaceBetween={16}
              breakpoints={{
                576: { slidesPerView: 3, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 24 },
                992: { slidesPerView: 5, spaceBetween: 24 },
                1200: { slidesPerView: 6, spaceBetween: 28 },
              }}
            >
              {latestMovies.map(renderMovieCard)}
            </Swiper>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomeWrapper;
