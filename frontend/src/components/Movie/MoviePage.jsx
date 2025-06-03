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

  // TMDB API key
  const API_KEY = "967df4e131f467edcdd674b650bf257c";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Fetch movie details
  const fetchMovieDetails = useCallback(async () => {
    setIsMovieLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
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

  if (isMovieLoading) {
    return (
      <div className="movie-page">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="movie-page">
        <Text type="danger">Movie not found.</Text>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <Row gutter={[16, 16]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Trailer or Poster */}
          <div className="movie-page-banner">
            {trailer ? (
              <iframe
                src={trailer}
                title={`${movie.title} trailer`}
                className="movie-page-trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-page-poster"
              />
            )}
          </div>

          {/* Movie Details */}
          <div className="movie-page-details">
            <Title level={2} className="movie-page-title">
              {movie.title}
            </Title>
            <Space size="middle" wrap className="movie-page-meta">
              <Text>
                <strong>Release:</strong> {movie.release_date}
              </Text>
              <Text>
                <strong>Genres:</strong>{" "}
                {movie.genres?.map((genre) => genre.name).join(", ")}
              </Text>
              <Text>
                <strong>Rating:</strong>{" "}
                <Rate disabled value={movie.vote_average / 2} allowHalf /> (
                {movie.vote_average}/10)
              </Text>
            </Space>
            <Paragraph className="movie-page-overview">
              {movie.overview}
            </Paragraph>

            {/* Actions */}
            <Space size="middle" className="movie-page-actions">
              <Tooltip title={isLiked ? "Unlike" : "Like"}>
                <Button
                  shape="circle"
                  icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                  type={isLiked ? "primary" : "default"}
                  onClick={handleToggleLike}
                  aria-label={isLiked ? "Unlike movie" : "Like movie"}
                />
              </Tooltip>
              <Tooltip title="Share">
                <Button
                  shape="circle"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                  aria-label="Share movie"
                />
              </Tooltip>
              <Tooltip title="Add to List">
                <Dropdown overlay={addToListMenu} trigger={["click"]}>
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    aria-label="Add to list"
                  />
                </Dropdown>
              </Tooltip>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
                aria-label="Watch trailer"
              >
                Watch Trailer
              </Button>
            </Space>
          </div>

          <Divider />

          {/* Reviews Section */}
          <Title level={3}>Reviews</Title>
          <MovieReview movieId={id} />
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <div className="movie-page-sidebar">
            {/* Recommended Movies */}
            <Title level={4} className="sidebar-title">
              Recommended
            </Title>
            {isRecsLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : recommendedMovies.length > 0 ? (
              <Space direction="vertical" size="small" className="sidebar-list">
                {recommendedMovies.map((rec) => (
                  <MovieCard
                    key={rec.id}
                    movie={{
                      id: rec.id,
                      title: rec.title,
                      posterUrl: `https://image.tmdb.org/t/p/w200${rec.poster_path}`,
                      releaseDate: rec.release_date,
                      genre: rec.genre_ids?.join(", "),
                      rating: rec.vote_average,
                    }}
                    isCompact
                    onAddToList={handleAddToList}
                    onClick={() => navigate(`/movies/${rec.id}`)}
                  />
                ))}
              </Space>
            ) : (
              <Text>No recommendations available.</Text>
            )}

            <Divider />

            {/* Trending Movies */}
            <Title level={4} className="sidebar-title">
              <FireOutlined /> Trending Now
            </Title>
            {isTrendingLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : trendingMovies.length > 0 ? (
              <Space direction="vertical" size="small" className="sidebar-list">
                {trendingMovies.map((trend) => (
                  <MovieCard
                    key={trend.id}
                    movie={{
                      ...trend,
                      posterUrl: trend.posterUrl.replace("/w500", "/w200"),
                    }}
                    isCompact
                    onAddToList={handleAddToList}
                    onClick={() => navigate(`/movies/${trend.id}`)}
                  />
                ))}
              </Space>
            ) : (
              <Text>No trending movies available.</Text>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MoviePage;
