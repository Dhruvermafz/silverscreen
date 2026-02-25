import axios from "axios";

// ────────────────────────────────────────────────
// TMDB API Configuration
// ────────────────────────────────────────────────
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c"; // ← move to .env in production!
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

// Indian languages (ISO 639-1 codes)
const INDIAN_LANGUAGES = [
  "hi",
  "ta",
  "te",
  "ml",
  "kn",
  "bn",
  "mr",
  "gu",
  "pa",
  "as",
];

// ────────────────────────────────────────────────
// Custom Categories Definition
// ────────────────────────────────────────────────
const CUSTOM_CATEGORIES = {
  "oldies-but-goldies": {
    label: "Oldies but Goldies 😎",
    filters: {
      primary_release_date_gte: "1900-01-01",
      primary_release_date_lte: "2000-12-31",
      "vote_average.gte": 7,
      sort_by: "vote_average.desc",
    },
  },
  "binge-worthy-hits": {
    label: "Binge-Worthy Hits 🔥",
    filters: {
      primary_release_date_gte: "2015-01-01",
      "vote_average.gte": 6,
      sort_by: "popularity.desc",
    },
  },
  "underrated-gems": {
    label: "Underrated Gems 💎",
    filters: {
      "vote_average.gte": 6,
      "vote_average.lte": 8,
      "vote_count.gte": 50,
      "vote_count.lte": 500,
      sort_by: "vote_average.desc",
    },
  },
  "viral-flicks": {
    label: "Viral Flicks 🚀",
    filters: {
      primary_release_date_gte: `${new Date().getFullYear() - 2}-01-01`,
      primary_release_date_lte: `${new Date().getFullYear()}-12-31`,
      sort_by: "popularity.desc",
    },
  },
  "desi-vibes": {
    label: "Desi Vibes 🇮🇳",
    filters: {
      with_original_language: INDIAN_LANGUAGES.join(","),
      region: "IN",
      sort_by: "popularity.desc",
    },
  },
};

// ────────────────────────────────────────────────
// Genre Cache (24-hour TTL)
// ────────────────────────────────────────────────
let genreCache = null;
let genreCacheTimestamp = 0;
const GENRE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getGenresCached() {
  const now = Date.now();
  if (genreCache && now - genreCacheTimestamp < GENRE_CACHE_TTL) {
    return genreCache;
  }

  try {
    const { data } = await axios.get(`${TMDB_API_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });

    genreCache = data.genres.reduce((acc, g) => {
      acc[g.id] = g;
      return acc;
    }, {});
    genreCacheTimestamp = now;
    return genreCache;
  } catch (err) {
    console.error("Failed to fetch genres:", err);
    return {};
  }
}

// ────────────────────────────────────────────────
// Movie → App Movie shape mapper
// ────────────────────────────────────────────────
function mapMovie(movie, genreMap = {}, categoryKey = null) {
  return {
    id: movie.id,
    title: movie.title || movie.name || "Unknown Title",
    posterUrl: movie.poster_path
      ? `${POSTER_BASE_URL}${movie.poster_path}`
      : "/assets/imgs/placeholder.png",
    backdrop_path: movie.backdrop_path,
    overview: movie.overview || "No overview available.",
    release_date: movie.release_date || movie.first_air_date || null,
    genres: (movie.genre_ids || []).map(
      (id) => genreMap[id] || { id, name: "Unknown" },
    ),
    rating: movie.vote_average || 0,
    vote_count: movie.vote_count || 0,
    runtime: movie.runtime || null,
    original_language: movie.original_language,
    isNew:
      movie.release_date &&
      new Date(movie.release_date).getFullYear() === new Date().getFullYear(),
    isLiked: false,
    showReviewModal: false,
    categoryLabel: categoryKey ? CUSTOM_CATEGORIES[categoryKey]?.label : null,
  };
}

// ────────────────────────────────────────────────
// Main movie fetch function
// ────────────────────────────────────────────────
export const getMoviesFromAPI = async (query = "", filter = {}, page = 1) => {
  try {
    const genreMap = await getGenresCached();

    const params = {
      api_key: TMDB_API_KEY,
      language: "en-US",
      page,
      include_adult: false,
      include_video: false,
    };

    // ── Apply category-specific filters if category is provided ──
    let categoryKey = filter.category;
    if (categoryKey && CUSTOM_CATEGORIES[categoryKey]) {
      Object.assign(params, CUSTOM_CATEGORIES[categoryKey].filters);
    }

    // ── Override / merge with explicit filter props ──
    if (filter.sort) params.sort_by = filter.sort;
    if (filter.genres?.length) params.with_genres = filter.genres.join(",");
    if (filter.yearRange?.[0])
      params["primary_release_date.gte"] = `${filter.yearRange[0]}-01-01`;
    if (filter.yearRange?.[1])
      params["primary_release_date.lte"] = `${filter.yearRange[1]}-12-31`;
    if (filter.language) params.with_original_language = filter.language;
    if (filter.runtimeRange?.[0])
      params["with_runtime.gte"] = filter.runtimeRange[0];
    if (filter.runtimeRange?.[1])
      params["with_runtime.lte"] = filter.runtimeRange[1];
    if (filter.voteAverageRange?.[0])
      params["vote_average.gte"] = filter.voteAverageRange[0];
    if (filter.voteAverageRange?.[1])
      params["vote_average.lte"] = filter.voteAverageRange[1];
    if (filter.voteCount?.[0]) params["vote_count.gte"] = filter.voteCount[0];
    if (filter.voteCount?.[1]) params["vote_count.lte"] = filter.voteCount[1];
    if (filter.region) params.region = filter.region;

    const baseUrl = query.trim()
      ? `${TMDB_API_URL}/search/movie`
      : `${TMDB_API_URL}/discover/movie`;

    if (query.trim()) {
      params.query = query.trim();
    }

    // ── Special logic: prioritize Indian content when no query/category ──
    let movies = [];
    let totalResults = 0;

    if (!query.trim() && !categoryKey) {
      // Step 1: Indian language + region priority
      const indianParams = {
        ...params,
        with_original_language: INDIAN_LANGUAGES.join(","),
        region: "IN",
      };

      const indianRes = await axios.get(baseUrl, { params: indianParams });
      const indianMovies = (indianRes.data.results || []).map((m) =>
        mapMovie(m, genreMap, categoryKey),
      );
      totalResults += indianRes.data.total_results || 0;

      movies = [...indianMovies];

      // Step 2: Fill up to ~20 if needed with international
      if (indianMovies.length < 20) {
        const otherParams = {
          ...params,
          // We can't use without_original_language → rely on region absence
        };
        const otherRes = await axios.get(baseUrl, { params: otherParams });
        const otherMovies = (otherRes.data.results || []).map((m) =>
          mapMovie(m, genreMap, categoryKey),
        );
        totalResults += otherRes.data.total_results || 0;

        // Deduplicate & append
        const seen = new Set(movies.map((m) => m.id));
        const uniqueOthers = otherMovies.filter((m) => !seen.has(m.id));
        movies = [...movies, ...uniqueOthers.slice(0, 20 - movies.length)];
      }
    } else {
      // Normal search / category / filtered discover
      const response = await axios.get(baseUrl, { params });
      movies = (response.data.results || []).map((m) =>
        mapMovie(m, genreMap, categoryKey),
      );
      totalResults = response.data.total_results || 0;
    }

    return {
      movies,
      totalResults,
      currentPage: page,
      totalPages: Math.ceil(totalResults / 20) || 1,
    };
  } catch (error) {
    console.error(
      "getMoviesFromAPI error:",
      error?.response?.data || error.message,
    );
    return { movies: [], totalResults: 0, currentPage: page, totalPages: 1 };
  }
};

// ────────────────────────────────────────────────
// Exported helpers (unchanged or slightly improved)
// ────────────────────────────────────────────────

export const getGenresFromAPI = async () => {
  try {
    const genreMap = await getGenresCached();
    return Object.values(genreMap);
  } catch {
    return [];
  }
};

export const getCustomCategories = () => {
  return Object.entries(CUSTOM_CATEGORIES).map(([key, { label }]) => ({
    key,
    label,
  }));
};

// Optional: keep these if used elsewhere
export const getMovieDetails = async (id) => {
  try {
    const { data } = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        append_to_response: "videos,credits",
      },
    });
    return data;
  } catch (err) {
    console.error("getMovieDetails failed:", err);
    return null;
  }
};

export const getTrendingMovies = async (timeWindow = "week") => {
  try {
    const { data } = await axios.get(
      `${TMDB_API_URL}/trending/movie/${timeWindow}`,
      { params: { api_key: TMDB_API_KEY } },
    );
    return data.results || [];
  } catch {
    return [];
  }
};

// NewsAPI example – better to move key to env
// export const fetchNewsAboutMovie = async (title) => { ... }

export default {
  getMoviesFromAPI,
  getGenresFromAPI,
  getCustomCategories,
  getMovieDetails,
  getTrendingMovies,
};
