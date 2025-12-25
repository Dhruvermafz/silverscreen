// src/components/MovieSlider.js
import React, { useEffect, useState } from "react";
import { getMoviesFromAPI } from "../actions/getMoviesFromAPI";
import "./movieslider.css";

const MovieSlider = ({ category = "viral-flicks", limit = 12 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const { movies } = await getMoviesFromAPI("", { category }, 1);
        // Duplicate for seamless loop
        const displayedMovies = movies.slice(0, limit);
        setMovies([...displayedMovies, ...displayedMovies]); // Double for infinite scroll
      } catch (error) {
        console.error("Error fetching movies for slider:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="movie-slider-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (movies.length === 0) {
    return null; // Silent fallback
  }

  return (
    <div className="movie-slider-container">
      {/* Left Column - Scrolling Down */}
      <div className="movie-slider-column left-column">
        <div className="movie-slider-track scroll-down">
          {movies.map((movie, index) => (
            <div
              key={`left-${movie.id}-${index}`}
              className="movie-poster-item"
            >
              <img
                src={movie.posterUrl || "/assets/imgs/placeholder.png"}
                alt={movie.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/assets/imgs/placeholder.png";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Scrolling Up */}
      <div className="movie-slider-column right-column">
        <div className="movie-slider-track scroll-up">
          {movies.map((movie, index) => (
            <div
              key={`right-${movie.id}-${index}`}
              className="movie-poster-item"
            >
              <img
                src={movie.posterUrl || "/assets/imgs/placeholder.png"}
                alt={movie.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/assets/imgs/placeholder.png";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optional Dark Overlay for Text Readability */}
      <div className="movie-slider-overlay" />
    </div>
  );
};

export default MovieSlider;
