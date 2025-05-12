import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import Slider from "react-slick";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import MovieCard from "../Movie/MovieCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./main.css"; // Custom styles for sliders and cards

const MainContent = () => {
  const [genres, setGenres] = useState([
    { id: "28", name: "Action" },
    { id: "35", name: "Comedy" },
    { id: "18", name: "Drama" },
    // Add more genres as needed
  ]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoviesForGenres = async () => {
      setLoading(true);
      const moviesData = {};

      // Fetch movies for each genre
      await Promise.all(
        genres.map(async (genre) => {
          const data = await getMoviesFromAPI("", { genre: genre.id }, 1);
          moviesData[genre.id] = data.movies || [];
        })
      );

      setMoviesByGenre(moviesData);
      setLoading(false);
    };

    fetchMoviesForGenres();
  }, [genres]);

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5, // Show 5 cards at a time
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="main-content">
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        genres.map((genre) => (
          <div key={genre.id} className="genre-section">
            <h2 className="genre-title">{genre.name}</h2>
            {moviesByGenre[genre.id] && moviesByGenre[genre.id].length > 0 ? (
              <Slider {...sliderSettings}>
                {moviesByGenre[genre.id].map((movie) => (
                  <div key={movie.id} className="movie-slide">
                    <MovieCard movie={movie} isCompact />
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="no-movies">No movies found for {genre.name}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MainContent;
