import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieCard from "../Films/MovieCard";
import {
  getGenresFromAPI,
  getMoviesFromAPI,
  getCustomCategories,
} from "../../actions/getMoviesFromAPI";
import { useGetProfileQuery } from "../../actions/userApi";

const HomeWrapper = () => {
  const [genres, setGenres] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [customCategoryMovies, setCustomCategoryMovies] = useState({});
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState({});
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [reviewModals, setReviewModals] = useState({});
  const [lists, setLists] = useState([]);

  const { data: authUser } = useGetProfileQuery();
  const customCategories = getCustomCategories();

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres");
      }
    };
    fetchGenres();
  }, []);

  // Update lists from profile
  useEffect(() => {
    if (authUser?.lists) {
      setLists(authUser.lists || []);
    }
  }, [authUser]);

  // Fetch Trending Movies (Hero Slider)
  const fetchTrending = useCallback(async () => {
    setLoadingTrending(true);
    try {
      const data = await getMoviesFromAPI("", { sort: "popularity.desc" }, 1);
      setTrendingMovies(data.movies.slice(0, 10));
    } catch (error) {
      message.error("Failed to load trending movies");
      setTrendingMovies([]);
    } finally {
      setLoadingTrending(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  // Fetch Custom Categories
  useEffect(() => {
    const fetchAllCategories = async () => {
      const newLoading = {};
      const newMovies = {};

      await Promise.all(
        customCategories.map(async ({ key }) => {
          newLoading[key] = true;
          setLoadingCategories((prev) => ({ ...prev, [key]: true }));

          try {
            const data = await getMoviesFromAPI("", { category: key }, 1);
            newMovies[key] = data.movies.slice(0, 20); // Enough for carousel
          } catch (error) {
            console.error(`Error loading ${key}:`, error);
            newMovies[key] = [];
          } finally {
            newLoading[key] = false;
            setLoadingCategories((prev) => ({ ...prev, [key]: false }));
          }
        })
      );

      setCustomCategoryMovies(newMovies);
    };

    fetchAllCategories();
  }, []);

  const handleToggleLike = (movie) => () => {
    setLikedMovies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movie.id)) {
        newSet.delete(movie.id);
        message.info(`Removed ${movie.title} from favorites`);
      } else {
        newSet.add(movie.id);
        message.info(`Added ${movie.title} to favorites`);
      }
      return newSet;
    });
  };

  const handleAddToList = (movie, listId) => {
    message.info(`Added ${movie.title} to your list`);
  };

  const handleReviewClick = (movie) => () => {
    setReviewModals((prev) => ({ ...prev, [movie.id]: true }));
  };

  const handleModalClose = (movie) => () => {
    setReviewModals((prev) => ({ ...prev, [movie.id]: false }));
  };

  const renderMovieCard = (movie) => {
    if (!movie?.id) return null;
    return (
      <SwiperSlide key={movie.id}>
        <MovieCard
          movie={{
            ...movie,
            isLiked: likedMovies.has(movie.id),
            showReviewModal: reviewModals[movie.id] || false,
          }}
          lists={lists}
          profile={authUser}
          isGridView={false}
          handleToggleLike={handleToggleLike}
          handleAddToList={handleAddToList}
          handleReviewClick={handleReviewClick}
          handleModalClose={handleModalClose}
        />
      </SwiperSlide>
    );
  };

  const renderSection = (key, label) => {
    const movies = customCategoryMovies[key] || [];
    const loading = loadingCategories[key];

    return (
      <section className="mn-section p-tb-30" key={key}>
        <div className="mn-title mb-4">
          <h2>
            {label} <span></span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <p className="text-center text-muted py-5">
            No movies found in this category.
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={movies.length > 4}
            slidesPerView={2}
            spaceBetween={20}
            breakpoints={{
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
              1200: { slidesPerView: 6 },
            }}
          >
            {movies.map(renderMovieCard)}
          </Swiper>
        )}
      </section>
    );
  };

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="mn-hero mb-5 position-relative">
        {loadingTrending ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status" />
          </div>
        ) : trendingMovies.length === 0 ? (
          <div className="text-center py-5 text-white">
            <h3>No trending movies available</h3>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 4000 }}
            loop
            className="hero-swiper"
          >
            {trendingMovies.slice(0, 6).map((movie) => (
              <SwiperSlide key={movie.id}>
                <div
                  className="hero-slide"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${
                      movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : movie.posterUrl
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="container">
                    <div className="hero-content text-white">
                      <p className="badge bg-warning text-dark mb-2">
                        ★ {movie.rating?.toFixed(1)} / 10
                      </p>
                      <h1 className="display-4 fw-bold mb-3">{movie.title}</h1>
                      <p className="lead mb-4" style={{ maxWidth: "600px" }}>
                        {movie.overview || "No overview available."}
                      </p>
                      <Link
                        to={`/movies/${movie.id}`}
                        className="btn btn-danger btn-lg"
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
        {/* Custom Categories */}
        {customCategories.map(({ key, label }) => renderSection(key, label))}

        {/* Optional: Genre Filter Tags (Uncomment if you want user-selectable genres) */}
        {/* 
        <section className="mn-section p-tb-30">
          <div className="mn-title mb-4">
            <h2>Browse by Genre</h2>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleGenreSelect(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </section>
        */}
      </div>
    </div>
  );
};

export default HomeWrapper;
