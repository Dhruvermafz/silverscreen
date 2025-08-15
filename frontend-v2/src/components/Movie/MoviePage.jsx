import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Row,
  Col,
  Button,
  Space,
  Skeleton,
  Rate,
  Tooltip,
  Dropdown,
  Menu,
  Form,
  Input,
} from "antd";
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
      <div className="mn-single-product">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="mn-single-product">
        <Text type="danger">Movie not found.</Text>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-xxl-12">
        <section className="mn-single-product">
          <div className="row">
            {/* Main Content */}
            <div className="mn-pro-rightside mn-common-rightside col-lg-9 col-md-12 m-b-15">
              <div className="single-pro-block">
                <div className="single-pro-inner">
                  <div className="row">
                    <div className="single-pro-img">
                      <div className="single-product-scroll">
                        <div className="single-product-cover">
                          <div className="single-slide zoom-image-hover">
                            <img
                              className="img-responsive"
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title}
                            />
                          </div>
                          {trailer && (
                            <div className="single-slide zoom-image-hover">
                              <iframe
                                src={trailer}
                                title={`${movie.title} trailer`}
                                className="tmdb-trailer-iframe"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="single-pro-desc m-t-991">
                      <div className="single-pro-content">
                        <h5 className="mn-single-title">
                          {movie.title} ({movie.release_date?.split("-")[0]})
                        </h5>
                        <div className="mn-single-rating-wrap">
                          <div className="mn-single-rating mn-pro-rating">
                            <Rate
                              disabled
                              value={movie.vote_average / 2}
                              allowHalf
                            />
                          </div>
                          <span className="mn-read-review">
                            |&nbsp;&nbsp;
                            <a href="#mn-spt-nav-review">
                              {movie.vote_count} Ratings
                            </a>
                          </span>
                        </div>
                        <div className="mn-single-price-stoke">
                          <div className="mn-single-stoke">
                            <span className="mn-single-sku">
                              {getCertification()}
                            </span>
                            <span className="mn-single-ps-title">
                              {movie.status}
                            </span>
                          </div>
                        </div>
                        <div className="mn-single-desc">{movie.overview}</div>
                        <div className="mn-single-list">
                          <ul>
                            <li>
                              <strong>Genres:</strong>{" "}
                              {movie.genres?.map((g) => g.name).join(", ")}
                            </li>
                            <li>
                              <strong>Runtime:</strong> {movie.runtime} min
                            </li>
                            <li>
                              <strong>Director:</strong>{" "}
                              {movie.credits?.crew?.find(
                                (c) => c.job === "Director"
                              )?.name || "N/A"}
                            </li>
                            <li>
                              <strong>Cast:</strong>{" "}
                              {movie.credits?.cast
                                ?.slice(0, 4)
                                .map((c) => c.name)
                                .join(", ") || "N/A"}
                            </li>
                          </ul>
                        </div>
                        <div className="mn-single-qty">
                          <div className="mn-btns">
                            <div className="mn-single-wishlist">
                              <Tooltip title={isLiked ? "Unlike" : "Like"}>
                                <a
                                  href="javascript:void(0)"
                                  className="mn-btn-group wishlist mn-wishlist"
                                  title={isLiked ? "Unlike" : "Like"}
                                  onClick={handleToggleLike}
                                  aria-label={
                                    isLiked ? "Unlike movie" : "Like movie"
                                  }
                                >
                                  <i
                                    className={
                                      isLiked
                                        ? "ri-heart-fill"
                                        : "ri-heart-line"
                                    }
                                  ></i>
                                </a>
                              </Tooltip>
                            </div>
                            <div className="mn-single-mn-compare">
                              <Tooltip title="Share">
                                <a
                                  href="javascript:void(0)"
                                  className="mn-btn-group mn-compare"
                                  title="Share"
                                  onClick={handleShare}
                                  aria-label="Share movie"
                                >
                                  <i className="ri-share-line"></i>
                                </a>
                              </Tooltip>
                            </div>
                            <div className="mn-single-add-to-list">
                              <Tooltip title="Add to List">
                                <Dropdown
                                  overlay={addToListMenu}
                                  trigger={["click"]}
                                >
                                  <a
                                    href="javascript:void(0)"
                                    className="mn-btn-group"
                                    title="Add to List"
                                    aria-label="Add to list"
                                  >
                                    <i className="ri-play-list-add-line"></i>
                                  </a>
                                </Dropdown>
                              </Tooltip>
                            </div>
                            <Button
                              type="primary"
                              href={
                                trailer ||
                                `https://www.themoviedb.org/movie/${movie.id}`
                              }
                              target="_blank"
                              className="btn btn-primary mn-btn-2 mn-add-cart"
                              aria-label="Watch trailer"
                            >
                              <span>Watch Trailer</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion Section */}
              <div className="mn-accordion style-1 mn-single-pro-tab-content">
                <div className="mn-accordion-item">
                  <h4 className="mn-accordion-header">Overview</h4>
                  <div className="mn-accordion-body show">
                    <div className="mn-single-pro-tab-desc">
                      <p>{movie.overview}</p>
                      <ul>
                        <li>
                          Director:{" "}
                          {movie.credits?.crew?.find(
                            (c) => c.job === "Director"
                          )?.name || "N/A"}
                        </li>
                        <li>
                          Cast:{" "}
                          {movie.credits?.cast
                            ?.slice(0, 4)
                            .map((c) => c.name)
                            .join(", ") || "N/A"}
                        </li>
                        <li>
                          Genres: {movie.genres?.map((g) => g.name).join(", ")}
                        </li>
                        <li>Runtime: {movie.runtime} min</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {trailer && (
                  <div className="mn-accordion-item">
                    <h4 className="mn-accordion-header">Videos</h4>
                    <div className="mn-accordion-body">
                      <div className="mn-single-pro-tab-desc">
                        <iframe
                          src={trailer}
                          title={`${movie.title} trailer`}
                          className="tmdb-trailer-iframe"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="mn-accordion-item">
                  <h4 className="mn-accordion-header">Reviews</h4>
                  <div className="mn-accordion-body pb-0">
                    <div id="mn-spt-nav-review" className="a-tab-pane">
                      <div className="row">
                        <div className="mn-t-review-wrapper">
                          <MovieReview movieId={id} />
                        </div>
                        <div className="mn-ratting-content">
                          <h3>Add a Review</h3>
                          <div className="mn-ratting-form">
                            <Form
                              onFinish={(values) => {
                                // Placeholder for review submission
                                toast.success("Review submitted", {
                                  position: "top-right",
                                  autoClose: 2000,
                                });
                              }}
                            >
                              <div className="mn-ratting-star">
                                <span>Your rating:</span>
                                <Form.Item name="rating" initialValue={0}>
                                  <Rate />
                                </Form.Item>
                              </div>
                              <div className="mn-ratting-input">
                                <Form.Item
                                  name="name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter your name",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Name" />
                                </Form.Item>
                              </div>
                              <div className="mn-ratting-input">
                                <Form.Item
                                  name="email"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter your email",
                                    },
                                    {
                                      type: "email",
                                      message: "Please enter a valid email",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Email*" />
                                </Form.Item>
                              </div>
                              <div className="mn-ratting-input form-submit">
                                <Form.Item
                                  name="comment"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter your comment",
                                    },
                                  ]}
                                >
                                  <Input.TextArea
                                    placeholder="Enter Your Comment"
                                    rows={4}
                                  />
                                </Form.Item>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className="mn-btn-2"
                                >
                                  <span>Submit</span>
                                </Button>
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Movies */}
              <section className="mn-related-product m-t-30">
                <div className="mn-title">
                  <h2>
                    Recommended <span>Movies</span>
                  </h2>
                </div>
                <div className="mn-related owl-carousel">
                  {isRecsLoading ? (
                    <Skeleton active paragraph={{ rows: 2 }} />
                  ) : recommendedMovies.length > 0 ? (
                    recommendedMovies.map((rec) => (
                      <div className="mn-product-card" key={rec.id}>
                        <div className="mn-product-img">
                          <div className="mn-img">
                            <a
                              href={`/movies/${rec.id}`}
                              className="image"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/movies/${rec.id}`);
                              }}
                            >
                              <img
                                className="main-img"
                                src={`https://image.tmdb.org/t/p/w185${rec.poster_path}`}
                                alt={rec.title}
                              />
                            </a>
                            <div className="mn-options">
                              <ul>
                                <li>
                                  <a
                                    href="javascript:void(0)"
                                    data-tooltip
                                    title="Add to List"
                                    onClick={() => handleAddToList(rec.id)}
                                    aria-label="Add to list"
                                  >
                                    <i className="ri-play-list-add-line"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="mn-product-detail">
                          <div className="cat">
                            <a href={`/genres/${rec.genre_ids?.[0]}`}>
                              {movie.genres?.find(
                                (g) => g.id === rec.genre_ids?.[0]
                              )?.name || "Movie"}
                            </a>
                          </div>
                          <h5>
                            <a href={`/movies/${rec.id}`}>{rec.title}</a>
                          </h5>
                          <div className="mn-price">
                            <div className="mn-price-new">
                              {rec.vote_average.toFixed(1)}/10
                            </div>
                          </div>
                          <div className="mn-pro-option">
                            <a
                              href="javascript:void(0)"
                              className="mn-wishlist"
                              data-tooltip
                              title="Like"
                              onClick={() => handleToggleLike(rec.id)}
                              aria-label="Like movie"
                            >
                              <i
                                className={
                                  isLiked ? "ri-heart-fill" : "ri-heart-line"
                                }
                              ></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Text>No recommendations available.</Text>
                  )}
                </div>
              </section>

              {/* Trending Movies */}
              <section className="mn-related-product m-t-30">
                <div className="mn-title">
                  <h2>
                    Trending <span>Now</span>
                  </h2>
                </div>
                <div className="mn-related owl-carousel">
                  {isTrendingLoading ? (
                    <Skeleton active paragraph={{ rows: 2 }} />
                  ) : trendingMovies.length > 0 ? (
                    trendingMovies.map((trend) => (
                      <div className="mn-product-card" key={trend.id}>
                        <div className="mn-product-img">
                          <div className="lbl">
                            <span className="trending">trending</span>
                          </div>
                          <div className="mn-img">
                            <a
                              href={`/movies/${trend.id}`}
                              className="image"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/movies/${trend.id}`);
                              }}
                            >
                              <img
                                className="main-img"
                                src={trend.posterUrl.replace("/w500", "/w185")}
                                alt={trend.title}
                              />
                            </a>
                            <div className="mn-options">
                              <ul>
                                <li>
                                  <a
                                    href="javascript:void(0)"
                                    data-tooltip
                                    title="Add to List"
                                    onClick={() => handleAddToList(trend.id)}
                                    aria-label="Add to list"
                                  >
                                    <i className="ri-play-list-add-line"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="mn-product-detail">
                          <div className="cat">
                            <a href={`/genres/${trend.genre}`}>
                              {movie.genres?.find((g) => g.id === trend.genre)
                                ?.name || "Movie"}
                            </a>
                          </div>
                          <h5>
                            <a href={`/movies/${trend.id}`}>{trend.title}</a>
                          </h5>
                          <div className="mn-price">
                            <div className="mn-price-new">
                              {trend.rating.toFixed(1)}/10
                            </div>
                          </div>
                          <div className="mn-pro-option">
                            <a
                              href="javascript:void(0)"
                              className="mn-wishlist"
                              data-tooltip
                              title="Like"
                              onClick={() => handleToggleLike(trend.id)}
                              aria-label="Like movie"
                            >
                              <i
                                className={
                                  isLiked ? "ri-heart-fill" : "ri-heart-line"
                                }
                              ></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Text>No trending movies available.</Text>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="mn-shop-sidebar col-lg-3 col-md-12 m-t-991">
              <div id="shop_sidebar">
                <div className="mn-sidebar-wrap">
                  <div className="mn-sidebar-block">
                    <div className="mn-sb-title">
                      <h3 className="mn-sidebar-title">Movie Facts</h3>
                    </div>
                    <div className="mn-sb-block-content">
                      <ul>
                        <li>
                          <div className="mn-sidebar-block-item">
                            <span>Status:</span> {movie.status || "N/A"}
                          </div>
                        </li>
                        <li>
                          <div className="mn-sidebar-block-item">
                            <span>Original Language:</span>{" "}
                            {movie.original_language?.toUpperCase() || "N/A"}
                          </div>
                        </li>
                        <li>
                          <div className="mn-sidebar-block-item">
                            <span>Budget:</span>{" "}
                            {movie.budget
                              ? `$${movie.budget.toLocaleString()}`
                              : "-"}
                          </div>
                        </li>
                        <li>
                          <div className="mn-sidebar-block-item">
                            <span>Revenue:</span>{" "}
                            {movie.revenue
                              ? `$${movie.revenue.toLocaleString()}`
                              : "-"}
                          </div>
                        </li>
                        <li>
                          <div className="mn-sidebar-block-item">
                            <span>Production:</span>{" "}
                            {movie.production_companies
                              ?.map((c) => c.name)
                              .join(", ") || "N/A"}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mn-sidebar-block">
                    <div className="mn-sb-title">
                      <h3 className="mn-sidebar-title">Genres</h3>
                    </div>
                    <div className="mn-sb-block-content">
                      <ul>
                        {movie.genres?.map((genre) => (
                          <li key={genre.id}>
                            <div className="mn-sidebar-block-item">
                              <a href={`/genres/${genre.id}`}>{genre.name}</a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoviePage;
