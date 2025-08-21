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
  Tabs,
  Carousel,
} from "antd";
import axios from "axios";
import MovieReview from "../Films/MovieReview";
import MovieCard from "./MovieCard";
import ActorProfile from "./ActorProfile";
import DirectorProfile from "./DirectorProfile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./movie-page.css";
import { useAddMovieToListMutation } from "../../actions/listApi";
import { useGetListsQuery } from "../../actions/listApi";
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [actor, setActor] = useState(null);
  const [director, setDirector] = useState(null);
  const [wikiData, setWikiData] = useState({
    biography: "",
    works: [],
    news: [],
  });
  const [trailer, setTrailer] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isActorLoading, setIsActorLoading] = useState(true);
  const [isDirectorLoading, setIsDirectorLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [addMovieToList] = useAddMovieToListMutation();
  const { data: lists = [] } = useGetListsQuery();

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";
  const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

  // Fetch movie details
  const fetchMovieDetails = useCallback(async () => {
    setIsMovieLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,release_dates,images,videos`
      );
      console.log("Movie Details Response:", response.data);
      setMovie(response.data);
      const trailer = response.data.videos.results.find(
        (v) => v.type === "Trailer"
      );
      setTrailer(
        trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
      );
    } catch (error) {
      console.error("Error fetching movie details:", error);
      toast.error("Failed to load movie details", {
        position: "top-right",
        autoClose: 2000,
      });
      setMovie(null);
    } finally {
      setIsMovieLoading(false);
    }
  }, [id]);

  // Fetch recommended movies
  const fetchRecommendedMovies = useCallback(async () => {
    setIsRecsLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/movie/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      console.log("Recommended Movies Response:", response.data);
      setRecommendedMovies(response.data.results.slice(0, 6));
    } catch (error) {
      console.error("Error fetching recommended movies:", error);
      toast.error("Failed to load recommendations", {
        position: "top-right",
        autoClose: 2000,
      });
      setRecommendedMovies([]);
    } finally {
      setIsRecsLoading(false);
    }
  }, [id]);

  // Fetch trending movies
  const fetchTrendingMovies = useCallback(async () => {
    setIsTrendingLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
      );
      console.log("Trending Movies Response:", response.data);
      setTrendingMovies(response.data.results.slice(0, 6));
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      toast.error("Failed to load trending movies", {
        position: "top-right",
        autoClose: 2000,
      });
      setTrendingMovies([]);
    } finally {
      setIsTrendingLoading(false);
    }
  }, []);

  // Fetch actor details
  const fetchActorDetails = useCallback(async (actorId) => {
    setIsActorLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/person/${actorId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=movie_credits`
      );
      console.log("Actor Details Response:", response.data);
      setActor(response.data);
    } catch (error) {
      console.error("Error fetching actor details:", error);
      toast.error("Failed to load actor details", {
        position: "top-right",
        autoClose: 2000,
      });
      setActor(null);
    } finally {
      setIsActorLoading(false);
    }
  }, []);

  // Fetch director details
  const fetchDirectorDetails = useCallback(async (directorId) => {
    setIsDirectorLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/person/${directorId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=movie_credits`
      );
      console.log("Director Details Response:", response.data);
      setDirector(response.data);
    } catch (error) {
      console.error("Error fetching director details:", error);
      toast.error("Failed to load director details", {
        position: "top-right",
        autoClose: 2000,
      });
      setDirector(null);
    } finally {
      setIsDirectorLoading(false);
    }
  }, []);

  // Fetch Wikipedia data
  const fetchWikiData = useCallback(async (name, type) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const searchQuery = `${name} ${
        type === "actor" ? "actor" : "film director"
      }`;
      const searchResponse = await axios.get(WIKI_API_URL, {
        params: {
          action: "query",
          list: "search",
          srsearch: searchQuery,
          format: "json",
          origin: "*",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const page = searchResponse.data.query.search[0];
      if (!page) {
        setWikiData({
          biography: "No Wikipedia page found",
          works: [],
          news: [],
        });
        return;
      }

      const pageResponse = await axios.get(WIKI_API_URL, {
        params: {
          action: "query",
          prop: "extracts",
          exintro: true,
          explaintext: true,
          pageids: page.pageid,
          format: "json",
          origin: "*",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const extract = pageResponse.data.query.pages[page.pageid].extract;

      setWikiData({
        biography: extract || "No biography available",
        works: [],
        news: [],
      });
    } catch (error) {
      console.error("Error fetching Wikipedia data:", error);
      setWikiData({
        biography:
          error.name === "AbortError"
            ? "Wikipedia request timed out"
            : "Failed to load Wikipedia data",
        works: [],
        news: [],
      });
    }
  }, []);

  // Fetch actor and director details
  useEffect(() => {
    if (movie?.credits) {
      const leadActor = movie.credits.cast[0];
      const director = movie.credits.crew.find((c) => c.job === "Director");

      if (leadActor?.id) {
        fetchActorDetails(leadActor.id);
      } else {
        setIsActorLoading(false);
        setActor(null);
      }

      if (director?.id) {
        fetchDirectorDetails(director.id);
      } else {
        setIsDirectorLoading(false);
        setDirector(null);
      }
    }
  }, [movie, fetchActorDetails, fetchDirectorDetails]);

  // Fetch Wikipedia data
  useEffect(() => {
    if (actor?.name) {
      fetchWikiData(actor.name, "actor");
    }
  }, [actor, fetchWikiData]);

  useEffect(() => {
    if (director?.name) {
      fetchWikiData(director.name, "director");
    }
  }, [director, fetchWikiData]);

  // Fetch movie-related data
  useEffect(() => {
    fetchMovieDetails();
    fetchRecommendedMovies();
    fetchTrendingMovies();
  }, [fetchMovieDetails, fetchRecommendedMovies, fetchTrendingMovies]);

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

  // Get certification
  const getCertification = () => {
    if (!movie?.release_dates?.results) return "N/A";
    const usRelease = movie.release_dates.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    return usRelease?.release_dates?.[0]?.certification || "N/A";
  };

  if (isMovieLoading) {
    return (
      <div className="mn-main-content">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="mn-main-content">
        <Text type="danger">Movie not found.</Text>
      </div>
    );
  }

  return (
    <div className="mn-main-content">
      <div className="row">
        <div className="col-xxl-12">
          <section className="mn-single-product">
            <div className="row">
              <div className="mn-pro-rightside mn-common-rightside col-lg-12 col-md-12 m-b-15">
                <div className="single-pro-block">
                  <div className="single-pro-inner">
                    <div className="row">
                      <div className="single-pro-img single-pro-img-no-sidebar">
                        <div className="single-product-scroll">
                          <div className="single-product-cover">
                            <div className="single-slide zoom-image-hover">
                              <img
                                className="img-responsive"
                                src={`https://image.tmdb.org/t/p/w500${
                                  movie.poster_path || "/placeholder.jpg"
                                }`}
                                alt={movie.title}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="single-pro-desc single-pro-desc-no-sidebar m-t-991">
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
                                {movie.genres?.map((g) => g.name).join(", ") ||
                                  "N/A"}
                              </li>
                              <li>
                                <strong>Runtime:</strong>{" "}
                                {movie.runtime || "N/A"} min
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
                <div className="mn-single-pro-tab">
                  <div className="mn-single-pro-tab-wrapper">
                    <Tabs defaultActiveKey="details">
                      <TabPane tab="Detail" key="details">
                        <div className="mn-single-pro-tab-desc">
                          <p>{movie.overview || "No overview available"}</p>
                          <ul>
                            <li>
                              Genres:{" "}
                              {movie.genres?.map((g) => g.name).join(", ") ||
                                "N/A"}
                            </li>
                            <li>Runtime: {movie.runtime || "N/A"} min</li>
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
                            </li>
                          </ul>
                        </div>
                      </TabPane>
                      <TabPane tab="Cast & Crew" key="cast-crew">
                        <div className="mn-single-pro-tab-desc">
                          <h5>Cast</h5>
                          <div className="mn-face-card-grid">
                            {isActorLoading ? (
                              <Skeleton active avatar paragraph={{ rows: 2 }} />
                            ) : actor ? (
                              <ActorProfile actor={actor} wikiData={wikiData} />
                            ) : (
                              <Text>No actor details available.</Text>
                            )}
                          </div>
                          <h5 style={{ marginTop: 24 }}>Director</h5>
                          <div className="mn-face-card-grid">
                            {isDirectorLoading ? (
                              <Skeleton active avatar paragraph={{ rows: 2 }} />
                            ) : director ? (
                              <DirectorProfile
                                director={director}
                                wikiData={wikiData}
                              />
                            ) : (
                              <Text>No director details available.</Text>
                            )}
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tab="Reviews" key="review">
                        <div className="row">
                          <div className="mn-t-review-wrapper mt-0">
                            <MovieReview movieId={id} />
                          </div>
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
                <section className="mn-related-product m-t-30">
                  <div className="mn-title">
                    <h2>
                      Recommended <span>Movies</span>
                    </h2>
                  </div>
                  <Carousel dots={true} slidesToShow={3} slidesToScroll={1}>
                    {isRecsLoading ? (
                      <Skeleton active paragraph={{ rows: 2 }} />
                    ) : recommendedMovies.length > 0 ? (
                      recommendedMovies.map((rec) => (
                        <div key={rec.id}>
                          <MovieCard
                            movie={rec}
                            onAddToList={() => handleAddToList(rec.id)}
                            onToggleLike={() => handleToggleLike(rec.id)}
                            isLiked={isLiked}
                            navigate={navigate}
                          />
                        </div>
                      ))
                    ) : (
                      <Text>No recommended movies available at this time.</Text>
                    )}
                  </Carousel>
                </section>
                <section className="mn-related-product m-t-30">
                  <div className="mn-title">
                    <h2>
                      Trending <span>Now</span>
                    </h2>
                  </div>
                  <Carousel dots={true} slidesToShow={3} slidesToScroll={1}>
                    {isTrendingLoading ? (
                      <Skeleton active paragraph={{ rows: 2 }} />
                    ) : trendingMovies.length > 0 ? (
                      trendingMovies.map((trend) => (
                        <div key={trend.id}>
                          <MovieCard
                            movie={trend}
                            onAddToList={() => handleAddToList(trend.id)}
                            onToggleLike={() => handleToggleLike(trend.id)}
                            isLiked={isLiked}
                            navigate={navigate}
                            isTrending
                          />
                        </div>
                      ))
                    ) : (
                      <Text>No trending movies available at this time.</Text>
                    )}
                  </Carousel>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
