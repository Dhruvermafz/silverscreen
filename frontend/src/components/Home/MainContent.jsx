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
        const fetchedGenres = await getGenresFromAPI();
        const paginatedGenres = fetchedGenres.slice(0, page * 2); // Load 2 genres per page
        setGenres(paginatedGenres);
        setHasMoreGenres(fetchedGenres.length > paginatedGenres.length);

        const trendingData = await getMoviesFromAPI(
          "",
          { sort: "popularity.desc" },
          1
        );
        setTrendingMovies(trendingData.movies || []);

        const moviesData = {};
        await Promise.all(
          paginatedGenres.map(async (genre) => {
            const data = await getMoviesFromAPI("", { genre: genre.id }, 1);
            moviesData[genre.id] = data.movies.slice(0, 10) || []; // Limit to 10 movies per genre
          })
        );
        setMoviesByGenre(moviesData);
      } catch (error) {
        toast.error("Failed to load movies", {
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
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMoreGenres, loading]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
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
        <div className="main-content-loading">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 24]}>
          {/* Trending Movies Section */}
          <Col span={24}>
            <Title level={3} className="main-content-title">
              Trending Movies
            </Title>
            {trendingMovies.length > 0 ? (
              <>
                <Slider {...sliderSettings} className="main-content-slider">
                  {trendingMovies.map((movie) => (
                    <div key={movie.id} className="main-content-slide">
                      <MovieCard movie={movie} isCompact />
                    </div>
                  ))}
                </Slider>
                <Button
                  type="link"
                  href="/movies/trending"
                  className="main-content-view-all"
                  aria-label="View all trending movies"
                >
                  View All
                </Button>
              </>
            ) : (
              <Text className="main-content-empty">
                No trending movies found
              </Text>
            )}
          </Col>

          {/* Genre Sections */}
          {genres.map((genre) => (
            <Col span={24} key={genre.id}>
              <Title level={3} className="main-content-title">
                {genre.name}
              </Title>
              {moviesByGenre[genre.id]?.length > 0 ? (
                <>
                  <Slider {...sliderSettings} className="main-content-slider">
                    {moviesByGenre[genre.id].map((movie) => (
                      <div key={movie.id} className="main-content-slide">
                        <MovieCard movie={movie} isCompact />
                      </div>
                    ))}
                  </Slider>
                  <Button
                    type="link"
                    href={`/movies/genre/${genre.id}`}
                    className="main-content-view-all"
                    aria-label={`View all ${genre.name} movies`}
                  >
                    View All
                  </Button>
                </>
              ) : (
                <Text className="main-content-empty">
                  No movies found for {genre.name}
                </Text>
              )}
            </Col>
          ))}
          <Col span={24}>
            <div ref={loaderRef} className="main-content-loader" />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MainContent;
