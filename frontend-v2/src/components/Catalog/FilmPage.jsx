import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";

const FilmPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch genres
        if (genres.length === 0) {
          const fetchedGenres = await getGenresFromAPI();
          setGenres(fetchedGenres);
        }

        // Fetch movie by ID
        const data = await getMoviesFromAPI(id); // Assumes API supports fetching by ID
        if (data.movies && data.movies.length > 0) {
          setMovie(data.movies[0]);
        } else {
          throw new Error("Movie not found");
        }
      } catch (error) {
        toast.error("Failed to load movie details", {
          position: "top-right",
          autoClose: 2000,
        });
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, genres.length]);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="section">
        <div className="container">
          <p>No movie found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="item item--details">
              <div className="item__cover">
                <img src={movie.posterUrl} alt={movie.title} />
                <span
                  className={`item__rate item__rate--${
                    movie.rating >= 7 ? "green" : "yellow"
                  }`}
                >
                  {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                </span>
              </div>
              <div className="item__content">
                <h1 className="item__title">{movie.title}</h1>
                <span className="item__category">
                  {movie.genre?.split(", ").map((genreId, index) => {
                    const genreName =
                      genres.find((g) => g.id === parseInt(genreId))?.name ||
                      genreId;
                    return (
                      <span key={index}>
                        {genreName}
                        {index < movie.genre.split(", ").length - 1 ? ", " : ""}
                      </span>
                    );
                  })}
                </span>
                <p>{movie.description || "No description available."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmPage;
