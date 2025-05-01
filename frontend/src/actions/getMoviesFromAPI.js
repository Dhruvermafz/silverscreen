import axios from "axios";

// TMDB API base URL and your API key (replace with your actual key)
const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_KEY = "967df4e131f467edcdd674b650bf257c";

// Fetch movies from TMDB API with query, filter, and pagination
export const getMoviesFromAPI = async (query, filter = {}, page = 1) => {
  try {
    const { genre, rating } = filter;

    let url = "";
    let params = {
      api_key: API_KEY,
      language: "en-US",
      page,
      include_adult: false,
    };

    if (query) {
      // Use the correct endpoint for search
      url = `${TMDB_API_URL}/search/movie`;
      params.query = query;
    } else {
      // Use discover for filtering
      url = `${TMDB_API_URL}/discover/movie`;
      params.sort_by = "popularity.desc";
      if (genre) params.with_genres = genre;
      if (rating) params["vote_average.gte"] = rating;
    }

    const response = await axios.get(url, { params });

    const { results, total_results } = response.data;

    const movies = results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      genre: movie.genre_ids.join(", "),
    }));

    return {
      movies,
      totalResults: total_results,
    };
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return { movies: [], totalResults: 0 };
  }
};

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
