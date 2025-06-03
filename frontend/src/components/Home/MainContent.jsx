import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Spin, Typography, Button, Select, Space } from "antd";
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
const { Option } = Select;

const MainContent = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]); // Selected genres from dropdown
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState({}); // Per-genre loading state
  const [pageByGenre, setPageByGenre] = useState({}); // Per-genre page tracking
  const loaderRefs = useRef({}); // Per-genre loader refs for infinite scrolling

  // Fetch all genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres);
        // Initialize page tracking for each genre
        const initialPages = fetchedGenres.reduce(
          (acc, genre) => ({ ...acc, [genre.id]: 1 }),
          {}
        );
        setPageByGenre(initialPages);
      } catch (error) {
        toast.error("Failed to load genres", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Fetch trending movies on mount
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoadingTrending(true);
      try {
        const trendingData = await getMoviesFromAPI(
          "",
          { sort: "popularity.desc" },
          1
        );
        setTrendingMovies(trendingData.movies || []);
      } catch (error) {
        toast.error("Failed to load trending movies", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrendingMovies();
  }, []);

  // Fetch movies for selected genres when selection changes or page updates
  useEffect(() => {
    const fetchMoviesForGenres = async () => {
      const newMoviesData = { ...moviesByGenre };
      const newLoadingMovies = { ...loadingMovies };

      await Promise.all(
        selectedGenres.map(async (genreId) => {
          if (!newMoviesData[genreId]) {
            newMoviesData[genreId] = [];
          }
          newLoadingMovies[genreId] = true;
          setLoadingMovies({ ...newLoadingMovies });

          try {
            const data = await getMoviesFromAPI(
              "",
              { genre: genreId },
              pageByGenre[genreId] || 1
            );
            const newMovies = data.movies || [];
            newMoviesData[genreId] = [
              ...(pageByGenre[genreId] === 1
                ? []
                : newMoviesData[genreId] || []),
              ...newMovies.slice(0, 10), // Limit to 10 movies per page
            ];
          } catch (error) {
            toast.error(`Failed to load movies for genre ${genreId}`, {
              position: "top-right",
              autoClose: 2000,
            });
          } finally {
            newLoadingMovies[genreId] = false;
            setLoadingMovies({ ...newLoadingMovies });
          }
        })
      );

      setMoviesByGenre(newMoviesData);
    };

    if (selectedGenres.length > 0) {
      fetchMoviesForGenres();
    }
  }, [selectedGenres, pageByGenre]);

  // Set up IntersectionObserver for each genre's loader
  useEffect(() => {
    const observers = {};

    selectedGenres.forEach((genreId) => {
      if (loaderRefs.current[genreId]) {
        observers[genreId] = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              !loadingMovies[genreId] &&
              moviesByGenre[genreId]?.length < 50 // Limit to 50 movies per genre
            ) {
              setPageByGenre((prev) => ({
                ...prev,
                [genreId]: (prev[genreId] || 1) + 1,
              }));
            }
          },
          { threshold: 0.5 }
        );
        observers[genreId].observe(loaderRefs.current[genreId]);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, [selectedGenres, loadingMovies, moviesByGenre]);

  const handleGenreChange = (value) => {
    setSelectedGenres(value);
    // Reset pages for newly selected genres
    const newPages = { ...pageByGenre };
    value.forEach((genreId) => {
      if (!newPages[genreId]) {
        newPages[genreId] = 1;
      }
    });
    setPageByGenre(newPages);
  };

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
      <Row gutter={[16, 24]}>
        {/* Genre Selection Dropdown */}
        <Col span={24}>
          <Space style={{ marginBottom: 16, width: "100%" }}>
            <Title level={4} style={{ margin: 0 }}>
              Select Genres
            </Title>
            <Select
              mode="multiple"
              style={{ width: "100%", maxWidth: 600 }}
              placeholder="Select genres to explore"
              value={selectedGenres}
              onChange={handleGenreChange}
              loading={loadingGenres}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {genres.map((genre) => (
                <Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>

        {/* Trending Movies Section */}
        <Col span={24}>
          <Title level={3} className="main-content-title">
            Trending Movies
          </Title>
          {loadingTrending ? (
            <Spin size="large" />
          ) : trendingMovies.length > 0 ? (
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
            <Text className="main-content-empty">No trending movies found</Text>
          )}
        </Col>

        {/* Selected Genres Sections */}
        {selectedGenres.length === 0 && !loadingGenres ? (
          <Col span={24}>
            <Text className="main-content-empty">
              Please select one or more genres to view movies
            </Text>
          </Col>
        ) : (
          selectedGenres.map((genreId) => {
            const genre = genres.find((g) => g.id === genreId);
            return (
              <Col span={24} key={genreId}>
                <Title level={3} className="main-content-title">
                  {genre?.name || "Unknown Genre"}
                </Title>
                {loadingMovies[genreId] && !moviesByGenre[genreId]?.length ? (
                  <Spin size="large" />
                ) : moviesByGenre[genreId]?.length > 0 ? (
                  <>
                    <Slider {...sliderSettings} className="main-content-slider">
                      {moviesByGenre[genreId].map((movie) => (
                        <div key={movie.id} className="main-content-slide">
                          <MovieCard movie={movie} isCompact />
                        </div>
                      ))}
                    </Slider>
                    <Button
                      type="link"
                      href={`/movies/genre/${genreId}`}
                      className="main-content-view-all"
                      aria-label={`View all ${genre?.name || "genre"} movies`}
                    >
                      View All
                    </Button>
                    <div
                      ref={(el) => (loaderRefs.current[genreId] = el)}
                      className="main-content-loader"
                    />
                    {loadingMovies[genreId] && (
                      <Spin size="small" style={{ marginTop: 16 }} />
                    )}
                  </>
                ) : (
                  <Text className="main-content-empty">
                    No movies found for {genre?.name || "this genre"}
                  </Text>
                )}
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
};

export default MainContent;
