import React, { useEffect, useState, useCallback } from "react";
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
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import axios from "axios";
import MovieCard from "../Films/MovieCard"; // Use your updated MovieCard
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

  // Fetch movie details + credits + videos
  const fetchMovieData = useCallback(async () => {
    setLoading(true);
    try {
      const [detailsRes, recRes, similarRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,release_dates`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}`
        ),
      ]);

      const movieData = detailsRes.data;
      setMovie(movieData);
      setCredits(movieData.credits);
      setVideos(movieData.videos.results || []);

      // Find official trailer
      const trailer = movieData.videos.results.find(
        (v) =>
          v.site === "YouTube" &&
          (v.type === "Trailer" || v.name.toLowerCase().includes("trailer"))
      );
      setTrailerKey(trailer?.key || null);

      setRecommendations(recRes.data.results.slice(0, 20));
      setSimilar(similarRes.data.results.slice(0, 20));
    } catch (err) {
      message.error("Failed to load movie details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const director = credits?.crew?.find((c) => c.job === "Director");
  const topCast = credits?.cast?.slice(0, 10) || [];
  const leadActor = topCast[0];

  const getCertification = () => {
    const usRelease = movie?.release_dates?.results?.find(
      (r) => r.iso_3166_1 === "US"
    );
    return usRelease?.release_dates?.[0]?.certification || "NR";
  };

  const handleToggleLike = (movieId) => () => {
    setLikedMovies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
        message.info("Removed from favorites");
      } else {
        newSet.add(movieId);
        message.success("Added to favorites");
      }
      return newSet;
    });
  };

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
      message.success("Added to list!");
    } catch {
      message.error("Failed to add to list");
    }
  };

  const handleReviewClick = (movieId) => () => {
    setReviewModals((prev) => ({ ...prev, [movieId]: true }));
  };

  const handleModalClose = (movieId) => () => {
    setReviewModals((prev) => ({ ...prev, [movieId]: false }));
  };

  const renderMovieCard = (m) => (
    <SwiperSlide key={m.id}>
      <div className="px-2">
        <MovieCard
          movie={{
            ...m,
            posterUrl: m.poster_path
              ? `${POSTER_BASE}${m.poster_path}`
              : "/assets/imgs/placeholder.png",
            isLiked: likedMovies.has(m.id),
            showReviewModal: reviewModals[m.id] || false,
          }}
          lists={lists}
          profile={profile}
          isGridView={false}
          handleToggleLike={handleToggleLike}
          handleAddToList={handleAddToList}
          handleReviewClick={handleReviewClick}
          handleModalClose={handleModalClose}
        />
      </div>
    </SwiperSlide>
  );

  if (loading) {
    return (
      <div className="container py-5">
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center py-5 text-white">Movie not found</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="position-relative text-white"
        style={{
          backgroundImage: `linear-gradient(to top, #141414 0%, transparent 50%), url(${IMAGE_BASE}${
            movie.backdrop_path || movie.poster_path
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "85vh",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div className="container pb-5">
          <div className="row align-items-end">
            <div className="col-lg-4 col-md-5 mb-4 mb-md-0">
              <img
                src={`${POSTER_BASE}${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded-3 shadow-lg"
                style={{
                  maxHeight: "600px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-lg-8 col-md-7">
              <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
                {movie.title}
                <span className="text-muted fs-4 ms-2">
                  ({movie.release_date?.split("-")[0]})
                </span>
              </Title>

              <Space size="middle" className="mb-3">
                <Rate disabled allowHalf value={movie.vote_average / 2} />
                <Text strong style={{ fontSize: "1.4rem", color: "#fff" }}>
                  {movie.vote_average?.toFixed(1)}
                </Text>
                <Tag color="red">{getCertification()}</Tag>
                <Text style={{ color: "#fff" }}>{movie.runtime} min</Text>
              </Space>

              {movie.tagline && (
                <Paragraph
                  italic
                  style={{
                    fontSize: "1.3rem",
                    color: "#eee",
                    marginBottom: 16,
                  }}
                >
                  {movie.tagline}
                </Paragraph>
              )}

              <Paragraph
                style={{ fontSize: "1.1rem", maxWidth: 800, color: "#ddd" }}
              >
                {movie.overview}
              </Paragraph>

              <Space size="middle" className="mt-4">
                <Button
                  type="primary"
                  danger
                  size="large"
                  icon={
                    <i
                      className={`ri-heart${
                        likedMovies.has(movie.id) ? "-fill" : "-line"
                      } me-2`}
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
                    onClick={() => handleAddToList(lists[0]._id)} // or open dropdown
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
                <Text strong style={{ color: "#aaa" }}>
                  Genres:{" "}
                </Text>
                <Space>
                  {movie.genres?.map((g) => (
                    <Tag key={g.id} color="volcano">
                      {g.name}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        <Tabs defaultActiveKey="details" size="large">
          <TabPane tab="Details" key="details">
            <div className="row">
              <div className="col-lg-8">
                <Title level={3}>Storyline</Title>
                <Paragraph style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                  {movie.overview || "No overview available."}
                </Paragraph>

                <Title level={4} className="mt-5">
                  Cast & Crew
                </Title>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  {director && (
                    <div>
                      <Text strong>Director:</Text>{" "}
                      <Avatar
                        src={`${PROFILE_BASE}${director.profile_path}`}
                        size={40}
                        className="me-2"
                      />
                      <Text>{director.name}</Text>
                    </div>
                  )}
                  {leadActor && (
                    <div>
                      <Text strong>Lead Actor:</Text>{" "}
                      <Avatar
                        src={`${PROFILE_BASE}${leadActor.profile_path}`}
                        size={40}
                        className="me-2"
                      />
                      <Text>
                        {leadActor.name} as {leadActor.character}
                      </Text>
                    </div>
                  )}
                </Space>
              </div>

              {trailerKey && (
                <div className="col-lg-4" id="trailer">
                  <Title level={3}>Trailer</Title>
                  <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=0&rel=0`}
                      title="Trailer"
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
        {recommendations.length > 0 && (
          <section className="mt-5">
            <Title level={2}>Recommended For You</Title>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000 }}
              loop
              slidesPerView={2}
              spaceBetween={20}
              breakpoints={{
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
              }}
            >
              {recommendations.map(renderMovieCard)}
            </Swiper>
          </section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="mt-5">
            <Title level={2}>Similar Movies</Title>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000 }}
              loop
              slidesPerView={2}
              spaceBetween={20}
              breakpoints={{
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
              }}
            >
              {similar.map(renderMovieCard)}
            </Swiper>
          </section>
        )}
      </div>
    </>
  );
};

export default MoviePage;
