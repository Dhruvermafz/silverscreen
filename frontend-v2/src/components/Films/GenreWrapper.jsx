import React, { useState, useEffect } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import Pagination from "../Common/Pagination";
import {
  getGenresFromAPI,
  getMoviesFromAPI,
} from "../../actions/getMoviesFromAPI";
import "./genre.css";

const GenrePage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [genresLoading, setGenresLoading] = useState(false);
  const [filmsLoading, setFilmsLoading] = useState(false);
  const [genresError, setGenresError] = useState(null);
  const [filmsError, setFilmsError] = useState(null);
  const pageSize = 6;

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);
      try {
        const genresData = await getGenresFromAPI();
        setGenres(genresData);
        setGenresLoading(false);
      } catch (error) {
        setGenresError(error.message || "Failed to load genres");
        setGenresLoading(false);
        message.error("Failed to load genres", 2);
      }
    };
    fetchGenres();
  }, []);

  // Fetch films when genre or page changes
  useEffect(() => {
    if (!selectedGenre) return;

    const fetchFilms = async () => {
      setFilmsLoading(true);
      try {
        const { movies, totalResults } = await getMoviesFromAPI(
          "",
          {
            genres: [selectedGenre.id],
          },
          currentPage
        );
        setFilms(movies);
        setTotalResults(totalResults);
        setFilmsLoading(false);
      } catch (error) {
        setFilmsError(error.message || "Failed to load films");
        setFilmsLoading(false);
        message.error("Failed to load films", 2);
      }
    };
    fetchFilms();
  }, [selectedGenre, currentPage]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1); // Reset pagination
    message.info(`Viewing films for ${genre.name}`, 2);
  };

  const handleQuickView = (film) => {
    setSelectedFilm(film);
    setIsQuickViewOpen(true);
  };

  const paginatedFilms = films.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (genresLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (genresError) {
    return (
      <div className="alert alert-danger text-center my-5" role="alert">
        Error: {genresError}
      </div>
    );
  }

  return (
    <>
      {/* Navigation */}
      <div className="mn-footer-nav">
        <ul>
          <li>
            <a
              href="javascript:void(0)"
              className="mn-main-search mn-search-toggle"
              onClick={() =>
                message.info("Search functionality to be implemented", 2)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="512"
                height="512"
                viewBox="0 0 612.01 612.01"
                style={{ enableBackground: "new 0 0 512 512" }}
              >
                <path
                  d="M606.209 578.714 448.198 423.228C489.576 378.272 515 318.817 515 253.393 514.98 113.439 399.704 0 257.493 0S.006 113.439.006 253.393s115.276 253.393 257.487 253.393c61.445 0 117.801-21.253 162.068-56.586l158.624 156.099c7.729 7.614 20.277 7.614 28.006 0a19.291 19.291 0 0 0 .018-27.585zM257.493 467.8c-120.326 0-217.869-95.993-217.869-214.407S137.167 38.986 257.493 38.986c120.327 0 217.869 95.993 217.869 214.407S377.82 467.8 257.493 467.8z"
                  fill="#000000"
                  opacity="1"
                />
              </svg>
            </a>
          </li>
          <li>
            <Link to="/profile/me" className="mn-main-user">
              <svg
                className="svg-icon"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247L512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186L512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115L935.867 985.115z" />
              </svg>
            </Link>
          </li>
          <li>
            <Link to="/" className="mn-toggle-menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="512"
                height="512"
                viewBox="0 0 24 24"
                style={{ enableBackground: "new 0 0 512 512" }}
              >
                <path
                  d="M19 22.42H5c-2.07 0-3.75-1.68-3.75-3.75v-8.44c0-1.22.6-2.37 1.6-3.07l7-4.9c1.29-.9 3.02-.9 4.3 0l7 4.9c1 .7 1.6 1.85 1.6 3.07v8.44c0 2.07-1.68 3.75-3.75 3.75zM12 3.08c-.45 0-.9.14-1.29.41l-7 4.9c-.6.42-.96 1.11-.96 1.84v8.44c0 1.24 1.01 2.25 2.25 2.25h14c1.24 0 2.25-1.01 2.25-2.25v-8.44c0-.73-.36-1.42-.96-1.84l-7-4.9c-.39-.27-.84-.41-1.29-.41z"
                  fill="#000000"
                  opacity="1"
                />
                <path
                  d="M16 22.42H8c-.41 0-.75-.34-.75-.75v-5c0-2.62 2.13-4.75 4.75-4.75s4.75 2.13 4.75 4.75v5c0 .41-.34.75-.75.75zm-7.25-1.5h6.5v-4.25c0-1.79-1.46-3.25-3.25-3.25s-3.25 1.46-3.25 3.25z"
                  fill="#000000"
                  opacity="1"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </div>

      {/* Genre Page Content */}
      <section className="mn-genre-page container my-5" aria-label="Genre page">
        <div className="mn-title">
          <h2>
            Explore <span>Genres</span>
          </h2>
          <p>Select a genre to discover films that match your taste.</p>
        </div>

        {/* Genre Cards */}
        {!selectedGenre && (
          <div className="row">
            {genres.map((genre) => (
              <div key={genre.id} className="col-md-4 mb-3">
                <div
                  className="mn-profile-card mn-genre-card"
                  onClick={() => handleGenreClick(genre)}
                  role="button"
                  aria-label={`View films in ${genre.name}`}
                >
                  <div className="mn-profile-img">
                    <img
                      src={
                        genre.image ||
                        `https://via.placeholder.com/200?text=${genre.name}`
                      }
                      alt={genre.name}
                    />
                  </div>
                  <div className="mn-profile-detail">
                    <h5 className="mn-profile-title">{genre.name}</h5>
                    <p className="mn-profile-text">
                      Explore {genre.name} films
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Films List */}
        {selectedGenre && (
          <>
            <div className="mn-title">
              <h3>{selectedGenre.name} Films</h3>
              <button
                className="mn-btn-1 mn-btn-secondary"
                onClick={() => setSelectedGenre(null)}
                aria-label="Back to genres"
              >
                <i className="ri-arrow-left-line me-1"></i> Back to Genres
              </button>
            </div>
            {filmsLoading && (
              <div className="text-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {filmsError && (
              <div className="alert alert-danger text-center my-5" role="alert">
                Error: {filmsError}
              </div>
            )}
            {!filmsLoading && !filmsError && (
              <>
                {paginatedFilms.length > 0 ? (
                  <div className="row">
                    {paginatedFilms.map((film) => (
                      <div key={film.id} className="col-md-4 mb-3">
                        <div className="mn-profile-card">
                          <div className="mn-profile-img">
                            <img
                              src={
                                film.posterUrl ||
                                "https://via.placeholder.com/200"
                              }
                              alt={film.title}
                            />
                            <div className="mn-options">
                              <a
                                href="javascript:void(0)"
                                data-bs-toggle="modal"
                                data-bs-target="#quickview_modal"
                                onClick={() => handleQuickView(film)}
                                aria-label={`Quick view for ${film.title}`}
                              >
                                <i className="ri-eye-line"></i>
                              </a>
                            </div>
                          </div>
                          <div className="mn-profile-detail">
                            <h5 className="mn-profile-title">
                              <Link to={`/movies/${film.id}`}>
                                {film.title}
                              </Link>
                            </h5>
                            <p className="mn-profile-text">
                              {film.release_date?.substring(0, 4) || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mn-text-muted">No films found in this genre.</p>
                )}
                <Pagination
                  totalItems={totalResults}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  currentPage={currentPage}
                />
              </>
            )}
          </>
        )}

        {/* Quick View Modal */}
        <div
          className={`modal fade quickview-modal ${
            isQuickViewOpen ? "show d-block" : ""
          }`}
          id="quickview_modal"
          tabIndex="-1"
          role="dialog"
          aria-hidden={!isQuickViewOpen}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <button
                type="button"
                className="qty-close"
                data-bs-dismiss="modal"
                onClick={() => setIsQuickViewOpen(false)}
                aria-label="Close"
                title="Close"
              ></button>
              <div className="modal-body">
                {selectedFilm && (
                  <div className="row mb-minus-24">
                    <div className="col-md-5 col-sm-12 col-xs-12 mb-24">
                      <div className="single-pro-img single-pro-img-no-sidebar">
                        <div className="single-slide-quickview owl-carousel">
                          <img
                            className="img-responsive"
                            src={
                              selectedFilm.posterUrl ||
                              "https://via.placeholder.com/200"
                            }
                            alt={selectedFilm.title}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12 mb-24">
                      <div className="quickview-pro-content">
                        <h5 className="mn-quick-title">
                          <Link to={`/movies/${selectedFilm.id}`}>
                            {selectedFilm.title}
                          </Link>
                        </h5>
                        <div className="mn-pro-rating">
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`ri-star-fill ${
                                index < Math.round(selectedFilm.rating / 2)
                                  ? ""
                                  : "grey"
                              }`}
                            ></i>
                          ))}
                        </div>
                        <div className="mn-quickview-desc">
                          {selectedFilm.overview || "No description available."}
                        </div>
                        <div className="mn-quickview-price">
                          <span className="new-price">
                            Release:{" "}
                            {selectedFilm.release_date?.substring(0, 4) ||
                              "Unknown"}
                          </span>
                        </div>
                        <div className="mn-pro-variations">
                          <ul>
                            {selectedFilm.genres?.map((genre, index) => (
                              <li
                                key={index}
                                className={index === 0 ? "active" : ""}
                              >
                                <a
                                  href="javascript:void(0)"
                                  className="mn-opt-sz"
                                >
                                  {genre.name}
                                </a>
                              </li>
                            )) || (
                              <li>
                                <a
                                  href="javascript:void(0)"
                                  className="mn-opt-sz"
                                >
                                  N/A
                                </a>
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="mn-quickview-qty">
                          <div className="mn-quickview-cart">
                            <Link
                              to={`/movies/${selectedFilm.id}`}
                              className="mn-btn-1"
                            >
                              <span>
                                <i className="ri-film-line"></i> View Details
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GenrePage;
