const axios = require("axios");

const TMDB_API_URL = process.env.TMDB_API_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const syncMovie = async (tmdbId) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${tmdbId}`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });
    const movie = response.data;
    return {
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genres.map((g) => g.name),
    };
  } catch (err) {
    throw new Error(`Failed to sync movie ${tmdbId}: ${err.message}`);
  }
};

const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query, language: "en-US" },
    });
    return response.data.results.map((movie) => ({
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview,
      releaseDate: movie.release_date,
    }));
  } catch (err) {
    throw new Error(`Failed to search movies: ${err.message}`);
  }
};

const getPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
      params: { api_key: TMDB_API_KEY, language: "en-US", page },
    });
    return response.data.results.map((movie) => ({
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genre_ids, // Map to genre names in controller
    }));
  } catch (err) {
    throw new Error(`Failed to fetch popular movies: ${err.message}`);
  }
};

module.exports = { syncMovie, searchMovies, getPopularMovies };
