import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Spin, Typography, Button } from "antd";
import Slider from "react-slick";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";
import MovieCard from "../Movie/MovieCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Title, Text } = Typography;

const MainContent = () => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreGenres, setHasMoreGenres] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchGenresAndMovies = async () => {
      setLoading(true);
      try {
        // Fetch genres dynamically
        const fetchedGenres = await getGenresFromAPI();
        const paginatedGenres = fetchedGenres.slice(0, page * 3); // Load 3 genres per page
        setGenres(paginatedGenres);
        setHasMoreGenres(fetchedGenres.length > paginatedGenres.length);

        // Fetch trending movies
        const trendingData = await getMoviesFromAPI(
          "",
          { sort: "popularity.desc" },
          1
        );
        setTrendingMovies(trendingData.movies || []);

        // Fetch movies for each genre
        const moviesData = {};
        await Promise.all(
          paginatedGenres.map(async (genre) => {
            const data = await getMoviesFromAPI("", { genre: genre.id }, 1);
            moviesData[genre.id] = data.movies || [];
          })
        );
        setMoviesByGenre(moviesData);
      } catch (error) {
        toast.error("Failed to load content", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGenresAndMovies();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreGenres && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMoreGenres, loading]);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="main-content">
      {loading && !genres.length ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Trending Movies Section */}
          <div className="genre-section">
            <Title level={3} className="genre-title">
              Trending Movies
            </Title>
            {trendingMovies.length > 0 ? (
              <Slider {...sliderSettings}>
                {trendingMovies.map((movie) => (
                  <div key={movie.id} className="movie-slide">
                    <MovieCard movie={movie} isCompact />
                  </div>
                ))}
              </Slider>
            ) : (
              <Text className="no-movies">No trending movies found</Text>
            )}
            <Button
              type="link"
              href="/movies/trending"
              style={{ marginTop: 8 }}
              aria-label="View all trending movies"
            >
              View All
            </Button>
          </div>

          {/* Genre Sections */}
          {genres.map((genre) => (
            <div key={genre.id} className="genre-section">
              <Title level={3} className="genre-title">
                {genre.name}
              </Title>
              {moviesByGenre[genre.id] && moviesByGenre[genre.id].length > 0 ? (
                <Slider {...sliderSettings}>
                  {moviesByGenre[genre.id].map((movie) => (
                    <div key={movie.id} className="movie-slide">
                      <MovieCard movie={movie} isCompact />
                    </div>
                  ))}
                </Slider>
              ) : (
                <Text className="no-movies">
                  No movies found for {genre.name}
                </Text>
              )}
              <Button
                type="link"
                href={`/movies/genre/${genre.id}`}
                style={{ marginTop: 8 }}
                aria-label={`View all ${genre.name} movies`}
              >
                View All
              </Button>
            </div>
          ))}
          <div ref={loaderRef} style={{ height: 20 }} />
        </>
      )}
    </div>
  );
};

export default MainContent;
