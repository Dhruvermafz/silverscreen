import axios from "axios";

// TMDB API configuration
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";

// OMDB API configuration
const OMDB_API_URL = "http://www.omdbapi.com/";
const OMDB_API_KEY = "6814b023"; // Provided OMDB API key

// TVmaze API configuration
const TVMAZE_API_URL = "http://api.tvmaze.com";

// Indian languages for filtering
const INDIAN_LANGUAGES = ["hi", "ta", "te", "ml", "kn", "bn", "mr", "gu"];

// Fetch cinema content with query, filter, and pagination
export const getMoviesFromAPI = async (query, filter = {}, page = 1) => {
  try {
    const { genre, rating } = filter;

    let params = {
      api_key: TMDB_API_KEY,
      language: "en-US",
      page,
      include_adult: false,
    };

    // Helper function to fetch TMDB data
    const fetchTMDB = async (url, extraParams = {}) => {
      const response = await axios.get(url, {
        params: { ...params, ...extraParams },
      });
      return response.data;
    };

    // Helper function to fetch OMDB details
    const fetchOMDB = async (imdbId) => {
      try {
        const response = await axios.get(OMDB_API_URL, {
          params: {
            apikey: OMDB_API_KEY,
            i: imdbId,
          },
        });
        return response.data.Response === "True" ? response.data : null;
      } catch (error) {
        console.error("Error fetching OMDB data:", error);
        return null;
      }
    };

    // Helper function to fetch TVmaze details
    const fetchTVmaze = async (title) => {
      try {
        const response = await axios.get(`${TVMAZE_API_URL}/search/shows`, {
          params: { q: title },
        });
        return response.data.length > 0 ? response.data[0].show : null;
      } catch (error) {
        console.error("Error fetching TVmaze data:", error);
        return null;
      }
    };

    let indianMovies = [];
    let otherMovies = [];
    let totalResults = 0;

    // Use multi-search for movies, TV shows, and people
    const url = query
      ? `${TMDB_API_URL}/search/multi`
      : `${TMDB_API_URL}/discover/movie`;
    if (!query && url.includes("discover")) {
      params.sort_by = "popularity.desc";
      if (genre) params.with_genres = genre;
      if (rating) params["vote_average.gte"] = rating;
    } else if (query) {
      params.query = query;
    }

    // Fetch Indian content
    const indianPromises = INDIAN_LANGUAGES.map((lang) =>
      fetchTMDB(url, { with_original_language: lang })
    );
    const indianResults = await Promise.all(indianPromises);
    indianMovies = await Promise.all(
      indianResults
        .flatMap((result) => result.results || [])
        .map(async (item) => {
          let enrichedData = { ...item };
          if (item.media_type === "movie" || item.media_type === "tv") {
            const omdbData = item.imdb_id
              ? await fetchOMDB(item.imdb_id)
              : null;
            const tvmazeData =
              item.media_type === "tv"
                ? await fetchTVmaze(item.name || item.title)
                : null;
            enrichedData = {
              ...enrichedData,
              plot: omdbData?.Plot || tvmazeData?.summary || item.overview,
              imdbRating: omdbData?.imdbRating || null,
              network: tvmazeData?.network?.name || null,
            };
          }
          return {
            id: item.id,
            type: item.media_type || "movie",
            title: item.title || item.name || item.original_name,
            posterUrl: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : item.profile_path
              ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
              : null,
            releaseDate: item.release_date || item.first_air_date || null,
            rating: item.vote_average || null,
            genre: item.genre_ids
              ? item.genre_ids.join(", ")
              : item.known_for_department || null,
            isIndian: true,
            plot: enrichedData.plot || null,
            imdbRating: enrichedData.imdbRating || null,
            network: enrichedData.network || null,
          };
        })
    );
    totalResults = indianResults.reduce(
      (sum, result) => sum + (result.total_results || 0),
      0
    );

    // Fetch other content
    const otherResult = await fetchTMDB(url);
    otherMovies = await Promise.all(
      (otherResult.results || [])
        .filter(
          (item) =>
            !indianMovies.some(
              (indian) =>
                indian.id === item.id && indian.type === item.media_type
            )
        )
        .map(async (item) => {
          let enrichedData = { ...item };
          if (item.media_type === "movie" || item.media_type === "tv") {
            const omdbData = item.imdb_id
              ? await fetchOMDB(item.imdb_id)
              : null;
            const tvmazeData =
              item.media_type === "tv"
                ? await fetchTVmaze(item.name || item.title)
                : null;
            enrichedData = {
              ...enrichedData,
              plot: omdbData?.Plot || tvmazeData?.summary || item.overview,
              imdbRating: omdbData?.imdbRating || null,
              network: tvmazeData?.network?.name || null,
            };
          }
          return {
            id: item.id,
            type: item.media_type || "movie",
            title: item.title || item.name || item.original_name,
            posterUrl: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : item.profile_path
              ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
              : null,
            releaseDate: item.release_date || item.first_air_date || null,
            rating: item.vote_average || null,
            genre: item.genre_ids
              ? item.genre_ids.join(", ")
              : item.known_for_department || null,
            isIndian: false,
            plot: enrichedData.plot || null,
            imdbRating: enrichedData.imdbRating || null,
            network: enrichedData.network || null,
          };
        })
    );
    totalResults += otherResult.total_results || 0;

    // Combine Indian and other content
    const movies = [...indianMovies, ...otherMovies];

    // Apply pagination
    const startIndex = (page - 1) * 20;
    const paginatedMovies = movies.slice(startIndex, startIndex + 20);

    return {
      movies: paginatedMovies,
      totalResults,
    };
  } catch (error) {
    console.error("Error fetching cinema content:", error);
    return { movies: [], totalResults: 0 };
  }
};

// Fetch genres from TMDB API
export const getGenresFromAPI = async () => {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      axios.get(
        `${TMDB_API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
      ),
      axios.get(
        `${TMDB_API_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`
      ),
    ]);
    const genres = [...movieGenres.data.genres, ...tvGenres.data.genres].reduce(
      (acc, genre) => {
        if (!acc.some((g) => g.id === genre.id)) acc.push(genre);
        return acc;
      },
      []
    );
    return genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};
