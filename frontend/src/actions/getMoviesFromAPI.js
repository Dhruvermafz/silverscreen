import axios from "axios";

// TMDB API base URL and your API key
const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_KEY = "967df4e131f467edcdd674b650bf257c";

// Indian languages for filtering (Hindi, Tamil, Telugu, Malayalam, Kannada, etc.)
const INDIAN_LANGUAGES = ["hi", "ta", "te", "ml", "kn", "bn", "mr", "gu"];

// Fetch movies from TMDB API with query, filter, and pagination, prioritizing Indian content
export const getMoviesFromAPI = async (query, filter = {}, page = 1) => {
  try {
    const { genre, rating } = filter;

    let params = {
      api_key: API_KEY,
      language: "en-US",
      page,
      include_adult: false,
    };

    // Helper function to fetch movies
    const fetchMovies = async (url, extraParams = {}) => {
      const response = await axios.get(url, {
        params: { ...params, ...extraParams },
      });
      return response.data;
    };

    let indianMovies = [];
    let otherMovies = [];
    let totalResults = 0;

    if (query) {
      // Search endpoint: Fetch Indian movies first, then others
      const url = `${TMDB_API_URL}/search/movie`;
      params.query = query;

      // Fetch Indian movies (filter by Indian languages)
      const indianPromises = INDIAN_LANGUAGES.map((lang) =>
        fetchMovies(url, { with_original_language: lang })
      );
      const indianResults = await Promise.all(indianPromises);
      indianMovies = indianResults
        .flatMap((result) => result.results)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          genre: movie.genre_ids.join(", "),
          isIndian: true, // Flag to identify Indian movies
        }));
      totalResults = indianResults.reduce(
        (sum, result) => sum + result.total_results,
        0
      );

      // Fetch other movies (no language filter)
      const otherResult = await fetchMovies(url);
      otherMovies = otherResult.results
        .filter(
          (movie) => !indianMovies.some((indian) => indian.id === movie.id)
        ) // Deduplicate
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          genre: movie.genre_ids.join(", "),
          isIndian: false,
        }));
      totalResults += otherResult.total_results;
    } else {
      // Discover endpoint: Fetch Indian movies first, then others
      const url = `${TMDB_API_URL}/discover/movie`;
      params.sort_by = "popularity.desc";
      if (genre) params.with_genres = genre;
      if (rating) params["vote_average.gte"] = rating;

      // Fetch Indian movies
      const indianPromises = INDIAN_LANGUAGES.map((lang) =>
        fetchMovies(url, { with_original_language: lang })
      );
      const indianResults = await Promise.all(indianPromises);
      indianMovies = indianResults
        .flatMap((result) => result.results)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          genre: movie.genre_ids.join(", "),
          isIndian: true,
        }));
      totalResults = indianResults.reduce(
        (sum, result) => sum + result.total_results,
        0
      );

      // Fetch other movies
      const otherResult = await fetchMovies(url);
      otherMovies = otherResult.results
        .filter(
          (movie) => !indianMovies.some((indian) => indian.id === movie.id)
        )
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          genre: movie.genre_ids.join(", "),
          isIndian: false,
        }));
      totalResults += otherResult.total_results;
    }

    // Combine Indian and other movies, prioritizing Indian content
    const movies = [...indianMovies, ...otherMovies];

    // Apply pagination on the combined list
    const startIndex = (page - 1) * 20; // TMDB returns 20 results per page
    const paginatedMovies = movies.slice(startIndex, startIndex + 20);

    return {
      movies: paginatedMovies,
      totalResults,
    };
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return { movies: [], totalResults: 0 };
  }
};

// Fetch genres from TMDB API (unchanged)
export const getGenresFromAPI = async () => {
  try {
    const response = await axios.get(
      `${TMDB_API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    return response.data.genres; // returns array: [{id, name}, ...]
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};
