import axios from "axios";

// TMDB API base URL and your API key (replace with your actual key)
const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_KEY = "967df4e131f467edcdd674b650bf257c";

// Fetch movies from TMDB API with query, filter, and pagination
export const getMoviesFromAPI = async (query, filter, page = 1) => {
  try {
    const genre = filter?.genre || ""; // Get genre from filter if available
    const searchQuery = query || ""; // Default to empty if no query

    // Construct the TMDB API URL for searching movies
    const url = `${TMDB_API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&query=${searchQuery}`;

    // Add genre filter if applicable
    const genreFilter = genre ? `&with_genres=${genre}` : "";

    const response = await axios.get(url + genreFilter);

    const { results, total_results } = response.data;

    // Map the movie results to match your structure
    const movies = results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
      genre: movie.genre_ids.join(", "), // Genres are returned as an array
    }));

    return {
      movies: movies.slice((page - 1) * 10, page * 10), // Paginate results
      totalResults: total_results,
    };
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return {
      movies: [],
      totalResults: 0,
    };
  }
};
