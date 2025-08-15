import axios from "axios";

// TMDB API config
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Indian languages
const INDIAN_LANGUAGES = ["hi", "ta", "te", "ml", "kn", "bn", "mr", "gu"];

// In-memory genre cache
let genreCache = null;
let genreCacheTimestamp = 0;
const GENRE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h cache

// --- Helper: Fetch & Cache Genres ---
async function getGenresCached() {
  const now = Date.now();
  if (genreCache && now - genreCacheTimestamp < GENRE_CACHE_TTL) {
    return genreCache;
  }
  const response = await axios.get(`${TMDB_API_URL}/genre/movie/list`, {
    params: {
      api_key: TMDB_API_KEY,
      language: "en-US",
    },
  });
  genreCache = response.data.genres.reduce((acc, g) => {
    acc[g.id] = g;
    return acc;
  }, {});
  genreCacheTimestamp = now;
  return genreCache;
}

// --- Helper: Map TMDB Movie Object ---
function mapMovie(movie, genreMap) {
  return {
    id: movie.id,
    title: movie.title,
    posterUrl: movie.poster_path
      ? `${POSTER_BASE_URL}${movie.poster_path}`
      : "/assets/imgs/placeholder.png",
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    overview: movie.overview,
    release_date: movie.release_date,
    genres: movie.genre_ids.map(
      (id) => genreMap[id] || { id, name: "Unknown" }
    ),
    rating: movie.vote_average,
    isNew: movie.release_date
      ? new Date(movie.release_date).getFullYear() === new Date().getFullYear()
      : false,
    isLiked: false,
    showReviewModal: false,
    boxOffice: null, // future Indian box office data
  };
}

// --- Original Name: getMoviesFromAPI ---
export const getMoviesFromAPI = async (query, filter = {}, page = 1) => {
  try {
    const { sort, genres, yearRange } = filter;
    const genreMap = await getGenresCached();

    const params = {
      api_key: TMDB_API_KEY,
      language: "en-US",
      page,
      include_adult: false,
    };

    let url = query
      ? `${TMDB_API_URL}/search/movie`
      : `${TMDB_API_URL}/discover/movie`;

    if (sort) params.sort_by = sort;
    if (genres?.length) params.with_genres = genres.join(",");
    if (yearRange?.length === 2) {
      params["primary_release_date.gte"] = `${yearRange[0]}-01-01`;
      params["primary_release_date.lte"] = `${yearRange[1]}-12-31`;
    }
    if (query) params.query = query;

    let movies = [];
    let totalResults = 0;

    if (!query) {
      // Fetch Indian movies first (priority)
      const indianLangFilter = INDIAN_LANGUAGES.join(",");
      const indianResponse = await axios.get(url, {
        params: {
          ...params,
          with_original_language: indianLangFilter,
          region: "IN",
        },
      });
      const indianMovies = (indianResponse.data.results || []).map((m) =>
        mapMovie(m, genreMap)
      );
      totalResults += indianResponse.data.total_results || 0;

      // Only fetch international movies if we still need more
      let otherMovies = [];
      if (indianMovies.length < 20) {
        const otherResponse = await axios.get(url, {
          params: { ...params, without_original_language: indianLangFilter },
        });
        otherMovies = (otherResponse.data.results || []).map((m) =>
          mapMovie(m, genreMap)
        );
        totalResults += otherResponse.data.total_results || 0;
      }

      // Merge with Indian films always at the top
      const seen = new Set();
      movies = [...indianMovies, ...otherMovies].filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
    }

    return { movies, totalResults };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { movies: [], totalResults: 0 };
  }
};

// --- Original Name: getGenresFromAPI ---
export const getGenresFromAPI = async () => {
  try {
    const genreMap = await getGenresCached();
    return Object.values(genreMap);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};
