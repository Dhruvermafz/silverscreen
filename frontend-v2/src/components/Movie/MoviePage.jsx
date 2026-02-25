import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  message,
  Rate,
  Tag,
  Button,
  Space,
  Tabs,
  Skeleton,
  Typography,
  Avatar,
  Empty,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import axios from "axios";
import MovieCard from "../Films/MovieCard";
import MovieReview from "../Films/MovieReview";
import { useAddMovieToListMutation } from "../../actions/listApi";
import { useGetListsQuery } from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w200";

const MoviePage = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const [likedMovies, setLikedMovies] = useState(new Set());
  const [reviewModals, setReviewModals] = useState({});

  const { data: lists = [] } = useGetListsQuery();
  const { data: profile } = useGetProfileQuery();
  const [addMovieToList] = useAddMovieToListMutation();

  // Fetch all movie data
  const fetchMovieData = useCallback(async () => {
    setLoading(true);
    try {
      const [detailsRes, recRes, similarRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,release_dates`,
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`,
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}`,
        ),
      ]);

      const movieData = detailsRes.data;
      setMovie(movieData);
      setCredits(movieData.credits);
      setVideos(movieData.videos?.results || []);

      // Find best trailer
      const trailer = movieData.videos?.results?.find(
        (v) =>
          v.site === "YouTube" &&
          (v.type === "Trailer" || v.name.toLowerCase().includes("trailer")),
      );
      setTrailerKey(trailer?.key || null);

      setRecommendations(recRes.data.results?.slice(0, 20) || []);
      setSimilar(similarRes.data.results?.slice(0, 20) || []);
    } catch (err) {
      console.error("Movie fetch error:", err);
      message.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const director = credits?.crew?.find((c) => c.job === "Director");
  const topCast = credits?.cast?.slice(0, 10) || [];

  const getCertification = useMemo(() => {
    const usRelease = movie?.release_dates?.results?.find(
      (r) => r.iso_3166_1 === "US",
    );
    return usRelease?.release_dates?.[0]?.certification || "NR";
  }, [movie]);

  const handleToggleLike = useCallback(
    (movieId) => () => {
      setLikedMovies((prev) => {
        const next = new Set(prev);
        if (next.has(movieId)) {
          next.delete(movieId);
          message.info("Removed from favorites");
        } else {
          next.add(movieId);
          message.success("Added to favorites");
        }
        return next;
      });
    },
    [],
  );

  const handleAddToList = useCallback(
    async (movieData, listId) => {
      try {
        await addMovieToList({
          listId,
          movie: {
            id: movieData.id,
            title: movieData.title,
            poster_path: movieData.poster_path,
          },
        }).unwrap();
        message.success("Added to list!");
      } catch {
        message.error("Failed to add to list");
      }
    },
    [addMovieToList],
  );

  const handleReviewClick = useCallback(
    (movieId) => () => {
      setReviewModals((prev) => ({ ...prev, [movieId]: true }));
    },
    [],
  );

  const handleModalClose = useCallback(
    (movieId) => () => {
      setReviewModals((prev) => ({ ...prev, [movieId]: false }));
    },
    [],
  );

  // Memoized card renderer to avoid re-renders
  const renderMovieCard = useCallback(
    (m) => {
      if (!m?.id) return null;

      return (
        <SwiperSlide key={m.id}>
          <MovieCard
            movie={{
              ...m,
              posterUrl: m.poster_path
                ? `${POSTER_BASE}${m.poster_path}`
                : "/assets/imgs/placeholder.png",
              isLiked: likedMovies.has(m.id),
              showReviewModal: !!reviewModals[m.id],
            }}
            lists={lists}
            profile={profile}
            isGridView={false}
            handleToggleLike={handleToggleLike}
            handleAddToList={(listId) => handleAddToList(m, listId)}
            handleReviewClick={handleReviewClick}
            handleModalClose={handleModalClose}
          />
        </SwiperSlide>
      );
    },
    [
      likedMovies,
      reviewModals,
      lists,
      profile,
      handleToggleLike,
      handleAddToList,
      handleReviewClick,
      handleModalClose,
    ],
  );

  if (loading) {
    return (
      <div className="container py-5">
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <Empty description="Movie not found" />
      </div>
    );
  }

  return (
    <>
      {/* Hero / Backdrop Section */}
      <section
        className="position-relative text-white"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(20,20,20,0.85) 0%, transparent 60%), url(${IMAGE_BASE}${movie.backdrop_path || movie.poster_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div className="container pb-5">
          <div className="row align-items-end g-4">
            <div className="col-lg-4 col-md-5 mb-4 mb-md-0">
              <img
                src={`${POSTER_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded-3 shadow-lg"
                style={{ maxHeight: "560px", objectFit: "cover" }}
              />
            </div>

            <div className="col-lg-8 col-md-7">
              <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
                {movie.title}
                <span className="text-white-50 fs-4 ms-3">
                  ({movie.release_date?.split("-")[0] || "N/A"})
                </span>
              </Title>

              <Space size="middle" className="mb-4 flex-wrap">
                <Rate disabled allowHalf value={movie.vote_average / 2} />
                <Text strong style={{ fontSize: "1.4rem", color: "#fff" }}>
                  {movie.vote_average?.toFixed(1)}
                </Text>
                <Tag color="red">{getCertification}</Tag>
                <Text style={{ color: "#fff" }}>
                  {movie.runtime || "N/A"} min
                </Text>
              </Space>

              {movie.tagline && (
                <Paragraph
                  italic
                  style={{
                    fontSize: "1.25rem",
                    color: "#e9ecef",
                    marginBottom: 16,
                  }}
                >
                  {movie.tagline}
                </Paragraph>
              )}

              <Paragraph
                style={{ fontSize: "1.1rem", color: "#e9ecef", maxWidth: 800 }}
              >
                {movie.overview || "No overview available."}
              </Paragraph>

              <Space size="middle" className="mt-4 flex-wrap">
                <Button
                  type="primary"
                  danger
                  size="large"
                  icon={
                    <i
                      className={`ri-heart${likedMovies.has(movie.id) ? "-fill" : "-line"} me-2`}
                    />
                  }
                  onClick={handleToggleLike(movie.id)}
                >
                  {likedMovies.has(movie.id) ? "Unlike" : "Like"}
                </Button>

                {lists.length > 0 && (
                  <Button
                    size="large"
                    icon={<i className="ri-play-list-add-line me-2" />}
                    onClick={() => handleAddToList(movie, lists[0]._id)}
                  >
                    Add to List
                  </Button>
                )}

                {trailerKey && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<i className="ri-play-fill me-2" />}
                    href={`#trailer`}
                  >
                    Watch Trailer
                  </Button>
                )}
              </Space>

              <div className="mt-4">
                <Text strong style={{ color: "#dee2e6" }}>
                  Genres:{" "}
                </Text>
                <Space wrap>
                  {movie.genres?.map((g) => (
                    <Tag key={g.id} color="volcano">
                      {g.name}
                    </Tag>
                  )) || <Text style={{ color: "#dee2e6" }}>N/A</Text>}
                </Space>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <Tabs defaultActiveKey="details" size="large" centered>
          <TabPane tab="Details" key="details">
            <div className="row g-5">
              <div className="col-lg-8">
                <Title level={3}>Storyline</Title>
                <Paragraph
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                    color: "#343a40",
                  }}
                >
                  {movie.overview || "No detailed storyline available."}
                </Paragraph>

                <Title level={4} className="mt-5">
                  Cast & Crew
                </Title>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {director && (
                    <div className="d-flex align-items-center">
                      <Avatar
                        src={
                          director.profile_path
                            ? `${PROFILE_BASE}${director.profile_path}`
                            : undefined
                        }
                        size={48}
                        className="me-3 shadow-sm"
                      />
                      <div>
                        <Text strong>Director</Text>
                        <br />
                        <Text>{director.name}</Text>
                      </div>
                    </div>
                  )}
                  {topCast.length > 0 && (
                    <div className="mt-3">
                      <Text strong>Top Cast</Text>
                      <div className="mt-2">
                        {topCast.map((cast) => (
                          <div
                            key={cast.id}
                            className="d-flex align-items-center mb-3"
                          >
                            <Avatar
                              src={
                                cast.profile_path
                                  ? `${PROFILE_BASE}${cast.profile_path}`
                                  : undefined
                              }
                              size={48}
                              className="me-3 shadow-sm"
                            />
                            <div>
                              <Text strong>{cast.name}</Text>
                              <br />
                              <Text type="secondary">as {cast.character}</Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Space>
              </div>

              {trailerKey && (
                <div className="col-lg-4" id="trailer">
                  <Title level={3}>Trailer</Title>
                  <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
                      title={`${movie.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane tab="Reviews" key="reviews">
            <MovieReview movieId={id} />
          </TabPane>
        </Tabs>

        {/* Recommendations */}
        {recommendations.length > 0 ? (
          <section className="mt-5">
            <Title level={2}>Recommended For You</Title>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={recommendations.length > 6}
              slidesPerView={2}
              spaceBetween={16}
              breakpoints={{
                576: { slidesPerView: 3, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 24 },
                992: { slidesPerView: 5, spaceBetween: 28 },
                1200: { slidesPerView: 6, spaceBetween: 32 },
              }}
            >
              {recommendations.map(renderMovieCard)}
            </Swiper>
          </section>
        ) : (
          <section className="mt-5">
            <Title level={2}>Recommended For You</Title>
            <Empty description="No recommendations available" />
          </section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 ? (
          <section className="mt-5">
            <Title level={2}>Similar Movies</Title>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={similar.length > 6}
              slidesPerView={2}
              spaceBetween={16}
              breakpoints={{
                576: { slidesPerView: 3, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 24 },
                992: { slidesPerView: 5, spaceBetween: 28 },
                1200: { slidesPerView: 6, spaceBetween: 32 },
              }}
            >
              {similar.map(renderMovieCard)}
            </Swiper>
          </section>
        ) : (
          <section className="mt-5">
            <Title level={2}>Similar Movies</Title>
            <Empty description="No similar movies found" />
          </section>
        )}
      </div>
    </>
  );
};

export default MoviePage;
