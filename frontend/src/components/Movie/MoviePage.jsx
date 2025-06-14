import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Divider,
  Row,
  Col,
  Button,
  Space,
  Skeleton,
  Rate,
  Tooltip,
  Dropdown,
  Menu,
  Tag,
  Tabs,
  Avatar,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  PlusOutlined,
  FireOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import MovieReview from "./MovieReview";
import MovieCard from "./MovieCard";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import {
  useAddMovieToListMutation,
  useGetListsQuery,
} from "../../actions/listApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./movie-page.css";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [addMovieToList] = useAddMovieToListMutation();
  const { data: lists = [] } = useGetListsQuery();

  const API_KEY = "967df4e131f467edcdd674b650bf257c";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Fetch movie details
  const fetchMovieDetails = useCallback(async () => {
    setIsMovieLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,release_dates`
      );
      setMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      toast.error("Failed to load movie details", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsMovieLoading(false);
    }
  }, [id]);

  // Fetch trailer
  const fetchTrailer = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
      );
      const trailer = response.data.results.find((v) => v.type === "Trailer");
      setTrailer(
        trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
      );
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  }, [id]);

  // Fetch recommended movies
  const fetchRecommendedMovies = useCallback(async () => {
    setIsRecsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
      );
      setRecommendedMovies(response.data.results.slice(0, 6));
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
      toast.error("Failed to load recommendations", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsRecsLoading(false);
    }
  }, [id]);

  // Fetch trending movies
  const fetchTrendingMovies = useCallback(async () => {
    setIsTrendingLoading(true);
    try {
      const response = await getMoviesFromAPI(
        "",
        { sort: "popularity.desc" },
        1
      );
      setTrendingMovies(response.movies.slice(0, 6));
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      toast.error("Failed to load trending movies", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsTrendingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovieDetails();
    fetchTrailer();
    fetchRecommendedMovies();
    fetchTrendingMovies();
  }, [
    fetchMovieDetails,
    fetchTrailer,
    fetchRecommendedMovies,
    fetchTrendingMovies,
  ]);

  // Handle like toggle
  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Liked movie", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle share
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/movies/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Movie URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handle add to list
  const handleAddToList = async (listId) => {
    try {
      await addMovieToList({
        listId,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        },
      }).unwrap();
      toast.success(`${movie.title} added to list`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add movie to list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Add to list dropdown menu
  const addToListMenu = (
    <Menu>
      {lists.length === 0 ? (
        <Menu.Item disabled>No lists available</Menu.Item>
      ) : (
        lists.map((list) => (
          <Menu.Item key={list._id} onClick={() => handleAddToList(list._id)}>
            {list.name}
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  // Get certification (e.g., PG-13)
  const getCertification = () => {
    if (!movie?.release_dates?.results) return "N/A";
    const usRelease = movie.release_dates.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    return usRelease?.release_dates?.[0]?.certification || "N/A";
  };

  if (isMovieLoading) {
    return (
      <div className="movie-page tmdb">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="movie-page tmdb">
        <Text type="danger">Movie not found.</Text>
      </div>
    );
  }

  return (
    <div className="movie-page tmdb">
      {/* Backdrop Section */}
      <div
        className="tmdb-backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
        }}
      >
        <div className="tmdb-backdrop-overlay">
          <Row gutter={[24, 24]} className="tmdb-header">
            <Col xs={24} sm={8} md={6}>
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="tmdb-poster"
              />
            </Col>
            <Col xs={24} sm={16} md={18}>
              <Title level={2} className="tmdb-title">
                {movie.title}
                <Text className="tmdb-year">
                  ({movie.release_date?.split("-")[0]})
                </Text>
              </Title>
              <Paragraph className="tmdb-tagline">{movie.tagline}</Paragraph>
              <Space size="middle" wrap className="tmdb-meta">
                <Text className="tmdb-certification">{getCertification()}</Text>
                <Text>{movie.release_date}</Text>
                {movie.genres?.map((genre) => (
                  <Tag key={genre.id} className="tmdb-genre">
                    {genre.name}
                  </Tag>
                ))}
                <Text>{movie.runtime} min</Text>
              </Space>
              <Space size="small" className="tmdb-rating">
                <Rate disabled value={movie.vote_average / 2} allowHalf />
                <Text className="tmdb-rating-text">
                  {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
                </Text>
              </Space>
              <Space size="middle" className="tmdb-actions">
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <Button
                    shape="circle"
                    icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                    className="tmdb-action-btn"
                    onClick={handleToggleLike}
                    aria-label={isLiked ? "Unlike movie" : "Like movie"}
                  />
                </Tooltip>
                <Tooltip title="Share">
                  <Button
                    shape="circle"
                    icon={<ShareAltOutlined />}
                    className="tmdb-action-btn"
                    onClick={handleShare}
                    aria-label="Share movie"
                  />
                </Tooltip>
                <Tooltip title="Add to List">
                  <Dropdown overlay={addToListMenu} trigger={["click"]}>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      className="tmdb-action-btn"
                      aria-label="Add to list"
                    />
                  </Dropdown>
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  href={
                    trailer || `https://www.themoviedb.org/movie/${movie.id}`
                  }
                  target="_blank"
                  className="tmdb-action-btn-primary"
                  aria-label="Watch trailer"
                >
                  Play Trailer
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main Content */}
      <div className="tmdb-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Tabs defaultActiveKey="overview" className="tmdb-tabs">
              <TabPane tab="Overview" key="overview">
                <Title level={4}>Overview</Title>
                <Paragraph className="tmdb-overview">
                  {movie.overview}
                </Paragraph>
                <div className="tmdb-details">
                  <Text strong>Director: </Text>
                  <Text>
                    {movie.credits?.crew?.find((c) => c.job === "Director")
                      ?.name || "N/A"}
                  </Text>
                  <br />
                  <Text strong>Cast: </Text>
                  <Text>
                    {movie.credits?.cast
                      ?.slice(0, 4)
                      .map((c) => c.name)
                      .join(", ") || "N/A"}
                  </Text>
                </div>
              </TabPane>
              {trailer && (
                <TabPane tab="Videos" key="videos">
                  <div className="tmdb-trailer">
                    <iframe
                      src={trailer}
                      title={`${movie.title} trailer`}
                      className="tmdb-trailer-iframe"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </TabPane>
              )}
              <TabPane tab="Reviews" key="reviews">
                <MovieReview movieId={id} />
              </TabPane>
            </Tabs>
          </Col>
          <Col xs={24} lg={8}>
            <div className="tmdb-sidebar">
              <Title level={4}>Facts</Title>
              <div className="tmdb-facts">
                <Text strong>Status: </Text>
                <Text>{movie.status || "N/A"}</Text>
                <br />
                <Text strong>Original Language: </Text>
                <Text>{movie.original_language?.toUpperCase() || "N/A"}</Text>
                <br />
                <Text strong>Budget: </Text>
                <Text>
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : "-"}
                </Text>
                <br />
                <Text strong>Revenue: </Text>
                <Text>
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "-"}
                </Text>
                <br />
                <Text strong>Production: </Text>
                <Text>
                  {movie.production_companies?.map((c) => c.name).join(", ") ||
                    "N/A"}
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* Recommended Movies */}
        <div className="tmdb-section">
          <Title level={4}>Recommended Movies</Title>
          {isRecsLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : recommendedMovies.length > 0 ? (
            <Row gutter={[16, 16]} className="tmdb-movie-list">
              {recommendedMovies.map((rec) => (
                <Col xs={12} sm={8} md={4} key={rec.id}>
                  <MovieCard
                    movie={{
                      id: rec.id,
                      title: rec.title,
                      posterUrl: `https://image.tmdb.org/t/p/w185${rec.poster_path}`,
                      releaseDate: rec.release_date,
                      genre: rec.genre_ids?.join(", "),
                      rating: rec.vote_average,
                    }}
                    isCompact
                    onAddToList={handleAddToList}
                    onClick={() => navigate(`/movies/${rec.id}`)}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Text>No recommendations available.</Text>
          )}
        </div>

        {/* Trending Movies */}
        <div className="tmdb-section">
          <Title level={4}>Trending Now</Title>
          {isTrendingLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : trendingMovies.length > 0 ? (
            <Row gutter={[16, 16]} className="tmdb-movie-list">
              {trendingMovies.map((trend) => (
                <Col xs={12} sm={8} md={4} key={trend.id}>
                  <MovieCard
                    movie={{
                      ...trend,
                      posterUrl: trend.posterUrl.replace("/w500", "/w185"),
                    }}
                    isCompact
                    onAddToList={handleAddToList}
                    onClick={() => navigate(`/movies/${trend.id}`)}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Text>No trending movies available.</Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
