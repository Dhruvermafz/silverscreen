import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Spin,
  Typography,
  Button,
  Select,
  Space,
  Card,
  FloatButton,
} from "antd";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";
import MovieCard from "../Movie/MovieCard";
import { toast } from "react-toastify";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./main.css"; // Updated CSS file

const { Title, Text } = Typography;
const { Option } = Select;

const MainContent = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState({});
  const [pageByGenre, setPageByGenre] = useState({});
  const [isMoodboardMaximized, setIsMoodboardMaximized] = useState(true); // Moodboard state
  const loaderRefs = useRef({});
  const navigate = useNavigate();

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres);
        const initialPages = fetchedGenres.reduce(
          (acc, genre) => ({ ...acc, [genre.id]: 1 }),
          {}
        );
        setPageByGenre(initialPages);
      } catch (error) {
        toast.error("Failed to load moods", {
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

  // Fetch movies for selected genres
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
              ...newMovies.slice(0, 10),
            ];
          } catch (error) {
            toast.error(`Failed to load movies for this mood`, {
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

  // Set up infinite scrolling for genres
  useEffect(() => {
    const observers = {};
    selectedGenres.forEach((genreId) => {
      if (loaderRefs.current[genreId]) {
        observers[genreId] = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              !loadingMovies[genreId] &&
              moviesByGenre[genreId]?.length < 50
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
    const newPages = { ...pageByGenre };
    value.forEach((genreId) => {
      if (!newPages[genreId]) {
        newPages[genreId] = 1;
      }
    });
    setPageByGenre(newPages);
  };

  const toggleMoodboard = () => {
    setIsMoodboardMaximized(!isMoodboardMaximized);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="main-content">
      {/* Floating Moodboard */}
      <div
        className={`moodboard ${
          isMoodboardMaximized ? "maximized" : "minimized"
        }`}
      >
        {isMoodboardMaximized ? (
          <Card className="moodboard-card">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={3} className="moodboard-title">
                What's Your Mood Today?
              </Title>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Pick a mood to find movies that match!"
                value={selectedGenres}
                onChange={handleGenreChange}
                loading={loadingGenres}
                allowClear
                showSearch
                optionFilterProp="children"
                className="moodboard-select"
              >
                {genres.map((genre) => (
                  <Option key={genre.id} value={genre.id}>
                    {genre.name}
                  </Option>
                ))}
              </Select>
            </Space>
          </Card>
        ) : (
          <FloatButton
            icon={<FullscreenOutlined />}
            onClick={toggleMoodboard}
            tooltip="Open Moodboard"
            className="moodboard-toggle"
          />
        )}
        {isMoodboardMaximized && (
          <Button
            type="text"
            icon={<FullscreenExitOutlined />}
            onClick={toggleMoodboard}
            className="moodboard-close"
            aria-label="Minimize moodboard"
          />
        )}
      </div>

      <Row gutter={[16, 24]}>
        {/* Trending Movies Section */}
        <Col span={24}>
          <Title level={3} className="main-content-section-title">
            Trending Movies
          </Title>
          {loadingTrending ? (
            <Spin size="large" className="main-content-spinner" />
          ) : trendingMovies.length > 0 ? (
            <>
              <Slider {...sliderSettings} className="main-content-slider">
                {trendingMovies.map((movie) => (
                  <div key={movie.id} className="main-content-slide">
                    <MovieCard movie={movie} isCompact={false} />
                  </div>
                ))}
              </Slider>
              <Button
                type="link"
                onClick={() => navigate("/movies/trending")}
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

        {/* Mood-Based Genre Sections */}
        {selectedGenres.length === 0 && !loadingGenres ? (
          <Col span={24}>
            <Text className="main-content-empty">
              Choose a mood in the Moodboard to see movies that match!
            </Text>
          </Col>
        ) : (
          selectedGenres.map((genreId) => {
            const genre = genres.find((g) => g.id === genreId);
            return (
              <Col span={24} key={genreId}>
                <Title level={3} className="main-content-section-title">
                  {genre?.name || "Unknown Mood"} Movies
                </Title>
                {loadingMovies[genreId] && !moviesByGenre[genreId]?.length ? (
                  <Spin size="large" className="main-content-spinner" />
                ) : moviesByGenre[genreId]?.length > 0 ? (
                  <>
                    <Slider {...sliderSettings} className="main-content-slider">
                      {moviesByGenre[genreId].map((movie) => (
                        <div key={movie.id} className="main-content-slide">
                          <MovieCard movie={movie} isCompact={false} />
                        </div>
                      ))}
                    </Slider>
                    <Button
                      type="link"
                      onClick={() => navigate(`/movies/genre/${genreId}`)}
                      className="main-content-view-all"
                      aria-label={`View all ${genre?.name || "mood"} movies`}
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
                    No movies found for {genre?.name || "this mood"}
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
