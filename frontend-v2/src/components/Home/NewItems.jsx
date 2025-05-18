import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { toast } from "react-toastify";
import ExpectedPremiere from "./ExpectedPremiere";
import RecentlyUploaded from "./RecentlyUploaded";
import {
  getGenresFromAPI,
  getMoviesFromAPI,
} from "../../actions/getMoviesFromAPI";
import "@splidejs/splide/dist/css/splide.min.css";

const NewItems = () => {
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
        const paginatedGenres = fetchedGenres.slice(0, page * 3);
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
            moviesData[genre.id] = data.movies || [];
          })
        );
        setMoviesByGenre(moviesData);
      } catch (error) {
        toast.error("Failed to load content", {
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
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMoreGenres, loading]);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1, // Show one slide at a time for a wide banner
    slidesToScroll: 1,
    arrows: true,
    gap: "0px", // Remove gap between slides
    padding: "0px", // Remove padding to make carousel full-width
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <>
      <section className="home home--banner">
        <div className="container-fluid p-0">
          {" "}
          {/* Full-width container */}
          <div className="row g-0">
            <div className="col-12">
              <h1 className="home__title">
                <b>NEW ITEMS</b> OF THIS SEASON
              </h1>
            </div>

            <div className="col-12">
              <Splide
                options={sliderSettings}
                className="home__carousel splide splide--banner"
              >
                {trendingMovies.length > 0 ? (
                  trendingMovies.map((movie) => (
                    <SplideSlide key={movie.id}>
                      <div className="item item--banner">
                        <div className="item__cover">
                          <img
                            src={movie.posterUrl || "img/covers/default.jpg"}
                            alt={movie.title}
                            className="item__cover-img"
                          />
                          <a
                            href={`details.html?id=${movie.id}`}
                            className="item__play"
                          >
                            <i className="ti ti-player-play-filled"></i>
                          </a>
                          <span
                            className={`item__rate item__rate--${
                              movie.rating >= 7 ? "green" : "yellow"
                            }`}
                          >
                            {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                          </span>
                          <button className="item__favorite" type="button">
                            <i className="ti ti-bookmark"></i>
                          </button>
                        </div>
                        <div className="item__content">
                          <h3 className="item__title">
                            <a href={`details.html?id=${movie.id}`}>
                              {movie.title}
                            </a>
                          </h3>
                          <span className="item__category">
                            {movie.genre?.split(", ").map((genreId, index) => {
                              const genreName =
                                genres.find((g) => g.id === parseInt(genreId))
                                  ?.name || genreId;
                              return (
                                <a key={index} href={`#genre-${genreId}`}>
                                  {genreName}
                                </a>
                              );
                            })}
                          </span>
                        </div>
                      </div>
                    </SplideSlide>
                  ))
                ) : (
                  <SplideSlide>
                    <p>No trending movies available.</p>
                  </SplideSlide>
                )}
              </Splide>
            </div>
          </div>
        </div>
      </section>

      <section className="genres-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title">Browse by Genre</h2>
              <Tabs
                defaultActiveKey={genres[0]?.id}
                id="genre-tabs"
                className="mb-3"
              >
                {genres.map((genre) => (
                  <Tab eventKey={genre.id} title={genre.name} key={genre.id}>
                    <div className="row">
                      {moviesByGenre[genre.id]?.length > 0 ? (
                        moviesByGenre[genre.id].map((movie) => (
                          <div
                            className="col-6 col-sm-4 col-lg-3 col-xl-2"
                            key={movie.id}
                          >
                            <div className="item item--grid">
                              <div className="item__cover">
                                <img
                                  src={
                                    movie.posterUrl || "img/covers/default.jpg"
                                  }
                                  alt={movie.title}
                                />
                                <a
                                  href={`details.html?id=${movie.id}`}
                                  className="item__play"
                                >
                                  <i className="ti ti-player-play-filled"></i>
                                </a>
                                <span
                                  className={`item__rate item__rate--${
                                    movie.rating >= 7 ? "green" : "yellow"
                                  }`}
                                >
                                  {movie.rating
                                    ? movie.rating.toFixed(1)
                                    : "N/A"}
                                </span>
                                <button
                                  className="item__favorite"
                                  type="button"
                                >
                                  <i className="ti ti-bookmark"></i>
                                </button>
                              </div>
                              <div className="item__content">
                                <h3 className="item__title">
                                  <a href={`details.html?id=${movie.id}`}>
                                    {movie.title}
                                  </a>
                                </h3>
                                <span className="item__category">
                                  {movie.genre
                                    ?.split(", ")
                                    .map((genreId, index) => {
                                      const genreName =
                                        genres.find(
                                          (g) => g.id === parseInt(genreId)
                                        )?.name || genreId;
                                      return (
                                        <a
                                          key={index}
                                          href={`#genre-${genreId}`}
                                        >
                                          {genreName}
                                        </a>
                                      );
                                    })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No movies available for this genre.</p>
                      )}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {hasMoreGenres && (
        <div ref={loaderRef} className="loading-indicator text-center my-4">
          {loading ? <p>Loading more genres...</p> : <p>Scroll to load more</p>}
        </div>
      )}

      <ExpectedPremiere />
      <RecentlyUploaded />
    </>
  );
};

export default NewItems;
