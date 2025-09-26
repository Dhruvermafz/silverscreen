// src/components/MovieSlider.js
import React, { useEffect, useState } from "react";
import { getMoviesFromAPI } from "../actions/getMoviesFromAPI";
import "./movieslider.css";

const MovieSlider = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const { movies } = await getMoviesFromAPI("", {
          category: "viral-flicks",
        });
        setMovies(movies.slice(0, 10));
      } catch (error) {
        console.error("Error fetching movies for slider:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="movie-slider-background">
      <div className="movie-slider-left">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="movie-slider-track slide-down">
            {[...movies, ...movies].map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="movie-poster">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={(e) =>
                    (e.target.src = "/assets/imgs/placeholder.png")
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="movie-slider-right">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="movie-slider-track slide-up">
            {[...movies, ...movies].map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="movie-poster">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={(e) =>
                    (e.target.src = "/assets/imgs/placeholder.png")
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSlider;
