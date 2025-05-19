import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";

const RecommendedFilms = ({ genres, currentMovieId, currentMovieGenres }) => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      setLoading(true);
      try {
        // Convert currentMovieGenres to an array of IDs
        const genreIds = currentMovieGenres
          ? currentMovieGenres.split(", ")
          : [];
        const filterParams = { genres: genreIds.join(",") }; // Filter by genres
        const data = await getMoviesFromAPI("", filterParams, 1, 4); // Fetch 4 movies
        // Filter out the current movie
        const filteredMovies = (data.movies || []).filter(
          (movie) => movie.id !== currentMovieId
        );
        setRecommendedMovies(filteredMovies.slice(0, 4)); // Limit to 4 movies
      } catch (error) {
        toast.error("Failed to load recommended movies", {
          position: "top-right",
          autoClose: 2000,
        });
        setRecommendedMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedMovies();
  }, [currentMovieId, currentMovieGenres]);

  if (loading) {
    return <p>Loading recommended movies...</p>;
  }

  if (recommendedMovies.length === 0) {
    return <p>No recommended movies available.</p>;
  }

  return (
    <div className="recommended-films">
      {recommendedMovies.map((movie) => (
        <div className="item item--small" key={movie.id}>
          <div className="item__cover">
            <img src={movie.posterUrl} alt={movie.title} />
            <a href={`details.html?id=${movie.id}`} className="item__play">
              <i className="ti ti-player-play-filled"></i>
            </a>
            <span
              className={`item__rate item__rate--${
                movie.rating >= 7 ? "green" : "yellow"
              }`}
            >
              {movie.rating ? movie.rating.toFixed(1) : "N/A"}
            </span>
          </div>
          <div className="item__content">
            <h3 className="item__title">
              <a href={`details.html?id=${movie.id}`}>{movie.title}</a>
            </h3>
            <span className="item__category">
              {movie.genre?.split(", ").map((genreId, index) => {
                const genreName =
                  genres.find((g) => g.id === parseInt(genreId))?.name ||
                  genreId;
                return (
                  <a key={index} href={`#genre-${genreId}`}>
                    {genreName}
                    {index < movie.genre.split(", ").length - 1 ? ", " : ""}
                  </a>
                );
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedFilms;
