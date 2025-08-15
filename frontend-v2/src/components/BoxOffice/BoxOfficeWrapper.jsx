import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Tabs, message } from "antd";
import { Link } from "react-router-dom";
import RegisterAnalyst from "./RegisterAnalyst";
import AddMovieRequest from "../Movie/MovieRequest";
import PredictionGame from "./PredictionGame";
import BoxOfficeQuiz from "./BoxOfficeQuiz";
import BoxOfficeLeaderboard from "./BoxOiffceLeadboard";
import BoxOfficeNewsroom from "./BoxOfficeNewsroom";
import AnalystBlogs from "./AnalystBlogs";
import AnalystSpotlight from "./AnalystSpotlight";
import Pagination from "../Common/Pagination";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";

const { Title } = Typography;
const { TabPane } = Tabs;

const BoxOfficeWrapper = () => {
  const [isAnalystModalVisible, setIsAnalystModalVisible] = useState(false);
  const [isMovieRequestVisible, setIsMovieRequestVisible] = useState(false);
  const [isPredictionModalVisible, setIsPredictionModalVisible] =
    useState(false);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topGrossingMovies, setTopGrossingMovies] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingTopGrossing, setLoadingTopGrossing] = useState(false);
  const [trendingPage, setTrendingPage] = useState(1);
  const [topGrossingPage, setTopGrossingPage] = useState(1);
  const [totalTrendingItems, setTotalTrendingItems] = useState(0);
  const [totalTopGrossingItems, setTotalTopGrossingItems] = useState(0);
  const pageSize = 8;

  // Fetch trending movies for Portal tab
  const fetchTrendingMovies = useCallback(async () => {
    setLoadingTrending(true);
    try {
      const trendingData = await getMoviesFromAPI(
        "",
        { sort: "popularity.desc" },
        trendingPage
      );
      setTrendingMovies(
        Array.isArray(trendingData?.movies) ? trendingData.movies : []
      );
      setTotalTrendingItems(trendingData?.totalResults || 0);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      message.error("Failed to load trending movies", 2);
      setTrendingMovies([]);
    } finally {
      setLoadingTrending(false);
    }
  }, [trendingPage]);

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  // Fetch top-grossing movies for Charts tab
  const fetchTopGrossingMovies = useCallback(async () => {
    setLoadingTopGrossing(true);
    try {
      const topGrossingData = await getMoviesFromAPI(
        "",
        { sort: "revenue.desc" },
        topGrossingPage
      );
      setTopGrossingMovies(
        Array.isArray(topGrossingData?.movies) ? topGrossingData.movies : []
      );
      setTotalTopGrossingItems(topGrossingData?.totalResults || 0);
    } catch (error) {
      console.error("Error fetching top-grossing movies:", error);
      message.error("Failed to load top-grossing movies", 2);
      setTopGrossingMovies([]);
    } finally {
      setLoadingTopGrossing(false);
    }
  }, [topGrossingPage]);

  useEffect(() => {
    fetchTopGrossingMovies();
  }, [fetchTopGrossingMovies]);

  const renderMovieCard = (movie, index) => {
    if (!movie?.id || !movie?.title) return null;
    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={movie.id}>
        <div className="mn-product-card">
          <div className="mn-product-img">
            <div className="lbl">
              <span
                className={
                  index % 3 === 0
                    ? "trending"
                    : index % 2 === 0
                    ? "new"
                    : "sale"
                }
              >
                {index % 3 === 0
                  ? "Trending"
                  : index % 2 === 0
                  ? "New"
                  : "Popular"}
              </span>
            </div>
            <div className="mn-img">
              <Link to={`/movies/${movie.id}`} className="image">
                <img
                  className="main-img"
                  src={movie.posterUrl || "/assets/imgs/placeholder.png"}
                  alt={movie.title}
                />
                <img
                  className="hover-img"
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                      : movie.posterUrl || "/assets/imgs/placeholder.png"
                  }
                  alt={movie.title}
                />
              </Link>
              <div className="mn-options">
                <ul>
                  <li>
                    <a
                      href="javascript:void(0)"
                      data-tooltip="Quick View"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                      aria-label={`View details for ${movie.title}`}
                    >
                      <i className="ri-eye-line"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      data-tooltip="Compare"
                      className="mn-compare"
                      onClick={() => message.info("Added to compare", 2)}
                      aria-label={`Compare ${movie.title}`}
                    >
                      <i className="ri-repeat-line"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      data-tooltip="Add To Watchlist"
                      className="mn-add-cart"
                      onClick={() => message.info("Added to watchlist", 2)}
                      aria-label={`Add ${movie.title} to watchlist`}
                    >
                      <i className="ri-heart-line"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mn-product-detail">
            <div className="cat">
              <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              <ul>
                <li>{movie.release_date?.split("-")[0] || "N/A"}</li>
              </ul>
            </div>
            <h5>
              <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
            </h5>
            <div className="mn-price">
              <div className="mn-price-new">
                {movie.rating?.toFixed(1) || "N/A"}/10
              </div>
            </div>
            <div className="mn-pro-option">
              <div className="mn-pro-color">
                <ul className="mn-opt-swatch">
                  <li>
                    <a
                      href="#"
                      className="mn-opt-clr-img"
                      data-tooltip="Rating"
                    >
                      <span style={{ backgroundColor: "#f3f3f3" }}></span>
                    </a>
                  </li>
                </ul>
              </div>
              <a
                href="javascript:void(0)"
                className="mn-wishlist"
                data-tooltip="Wishlist"
                onClick={() => message.info("Added to watchlist", 2)}
                aria-label={`Add ${movie.title} to watchlist`}
              >
                <i className="ri-heart-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="hero text-center">
        <Title level={1} style={{ color: "var(--text-primary)" }}>
          Box Office Central
        </Title>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Dive into movie performance data, predict box office hits, become an
          analyst, or test your knowledge with quizzes.
        </p>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-sm)",
          justifyContent: "center",
          margin: "var(--spacing-md) 0",
        }}
      >
        <Button
          className="button"
          onClick={() => setIsAnalystModalVisible(true)}
        >
          Register as Box Office Analyst
        </Button>
        <Button
          className="button button--secondary"
          onClick={() => setIsMovieRequestVisible(true)}
        >
          Suggest a Movie
        </Button>
        <Button
          className="button button--secondary"
          onClick={() => setIsPredictionModalVisible(true)}
        >
          Submit Prediction
        </Button>
        <Button
          className="button button--secondary"
          onClick={() => setIsQuizModalVisible(true)}
        >
          Take Quiz
        </Button>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Portal" key="1">
          <section className="mn-new-product p-tb-15">
            <div className="mn-title">
              <h2>
                Trending <span>Movies</span>
              </h2>
            </div>
            {loadingTrending ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : !Array.isArray(trendingMovies) ||
              trendingMovies.length === 0 ? (
              <p className="text-center text-muted">
                No trending movies available.
              </p>
            ) : (
              <div className="row">{trendingMovies.map(renderMovieCard)}</div>
            )}
            <Pagination
              totalItems={totalTrendingItems}
              itemsPerPage={pageSize}
              onPageChange={(page) => setTrendingPage(page)}
              currentPage={trendingPage}
            />
          </section>
        </TabPane>
        <TabPane tab="Leaderboard" key="2">
          <BoxOfficeLeaderboard />
        </TabPane>
        <TabPane tab="Charts" key="3">
          <section className="mn-new-product p-tb-15">
            <div className="mn-title">
              <h2>
                Top Grossing <span>Movies</span>
              </h2>
            </div>
            {loadingTopGrossing ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : !Array.isArray(topGrossingMovies) ||
              topGrossingMovies.length === 0 ? (
              <p className="text-center text-muted">
                No top-grossing movies available.
              </p>
            ) : (
              <div className="row">
                {topGrossingMovies.map(renderMovieCard)}
              </div>
            )}
            <Pagination
              totalItems={totalTopGrossingItems}
              itemsPerPage={pageSize}
              onPageChange={(page) => setTopGrossingPage(page)}
              currentPage={topGrossingPage}
            />
          </section>
        </TabPane>
        <TabPane tab="Newsroom" key="4">
          <BoxOfficeNewsroom />
        </TabPane>
        <TabPane tab="Blogs" key="5">
          <AnalystBlogs />
        </TabPane>
        <TabPane tab="Spotlight" key="6">
          <AnalystSpotlight />
        </TabPane>
      </Tabs>

      {/* Modals */}
      <RegisterAnalyst
        isVisible={isAnalystModalVisible}
        onClose={() => setIsAnalystModalVisible(false)}
      />
      <AddMovieRequest
        isVisible={isMovieRequestVisible}
        onClose={() => setIsMovieRequestVisible(false)}
      />
      <PredictionGame
        isVisible={isPredictionModalVisible}
        onClose={() => setIsPredictionModalVisible(false)}
      />
      <BoxOfficeQuiz
        isVisible={isQuizModalVisible}
        onClose={() => setIsQuizModalVisible(false)}
      />
    </div>
  );
};

export default BoxOfficeWrapper;
