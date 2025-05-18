import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Filter from "./Filter";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";

const CatalogFilms = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]); // Added for genre names
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const moviesPerPage = 18;

  // Fetch genres and movies
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch genres
        if (genres.length === 0) {
          const fetchedGenres = await getGenresFromAPI();
          setGenres(fetchedGenres);
        }

        // Fetch movies
        const data = await getMoviesFromAPI("", filterParams, currentPage);
        setMovies(data.movies || []);
        setTotalResults(data.totalResults || 0);
      } catch (error) {
        toast.error("Failed to load movies", {
          position: "top-right",
          autoClose: 2000,
        });
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, filterParams, genres.length]);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setFilterParams(filters);
    setCurrentPage(1);
  };

  // Handle page navigation
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalResults / moviesPerPage)) {
      setCurrentPage(page);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / moviesPerPage);
  const maxVisiblePages = 5;

  // Generate paginator items
  const getPaginatorItems = () => {
    const items = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li
          key={i}
          className={`paginator__item ${
            i === currentPage ? "paginator__item--active" : ""
          }`}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <li key="ellipsis" className="paginator__item">
          <span>...</span>
        </li>
      );
      items.push(
        <li key={totalPages} className="paginator__item">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </a>
        </li>
      );
    }

    return items;
  };

  return (
    <>
      <Filter onFilterChange={handleFilterChange} />
      <div className="section section--catalog">
        <div className="container">
          <div className="row">
            {loading ? (
              <div className="col-12">
                <p>Loading movies...</p>
              </div>
            ) : movies.length > 0 ? (
              movies.map((movie) => (
                <div
                  className="col-6 col-sm-4 col-lg-3 col-xl-2"
                  key={movie.id}
                >
                  <div className="item">
                    <div className="item__cover">
                      <img src={movie.posterUrl} alt={movie.title} />
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
                </div>
              ))
            ) : (
              <div className="col-12">
                <p>No movies available.</p>
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="paginator-mob">
                <span className="paginator-mob__pages">
                  Showing {movies.length} of {totalResults}
                </span>
                <ul className="paginator-mob__nav">
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "disabled" : ""}
                    >
                      <i className="ti ti-chevron-left"></i>
                      <span>Prev</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "disabled" : ""}
                    >
                      <span>Next</span>
                      <i className="ti ti-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </div>

              <ul className="paginator">
                <li
                  className={`paginator__item paginator__item--prev ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  >
                    <i className="ti ti-chevron-left"></i>
                  </a>
                </li>
                {getPaginatorItems()}
                <li
                  className={`paginator__item paginator__item--next ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  >
                    <i className="ti ti-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogFilms;
