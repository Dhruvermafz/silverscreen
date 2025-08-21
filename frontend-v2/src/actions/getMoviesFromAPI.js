import axios from "axios";

// --- TMDB API Config ---
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

// --- Indian Languages ---
const INDIAN_LANGUAGES = ["hi", "ta", "te", "ml", "kn", "bn", "mr", "gu"];

// --- Custom Categories ---
const CUSTOM_CATEGORIES = {
  "oldies-but-goldies": {
    label: "Oldies but Goldies 😎",
    filters: {
      yearRange: [1900, 2000],
      voteAverageRange: [7, 10],
      sort: "vote_average.desc",
    },
  },
  "binge-worthy-hits": {
    label: "Binge-Worthy Hits 🔥",
    filters: {
      yearRange: [2015, new Date().getFullYear()],
      voteAverageRange: [6, 10],
      sort: "popularity.desc",
    },
  },
  "underrated-gems": {
    label: "Underrated Gems 💎",
    filters: {
      voteAverageRange: [6, 8],
      voteCount: [50, 500],
      sort: "vote_average.desc",
    },
  },
  "viral-flicks": {
    label: "Viral Flicks 🚀",
    filters: {
      yearRange: [new Date().getFullYear() - 2, new Date().getFullYear()],
      sort: "popularity.desc",
    },
  },
  "desi-vibes": {
    label: "Desi Vibes 🇮🇳",
    filters: {
      language: INDIAN_LANGUAGES.join(","),
      region: "IN",
      sort: "popularity.desc",
    },
  },
};

// --- Genre Cache ---
let genreCache = null;
let genreCacheTimestamp = 0;
const GENRE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

// --- Helper: Fetch & Cache Genres ---
async function getGenresCached() {
  const now = Date.now();
  if (genreCache && now - genreCacheTimestamp < GENRE_CACHE_TTL) {
    return genreCache;
  }
  const response = await axios.get(`${TMDB_API_URL}/genre/movie/list`, {
    params: { api_key: TMDB_API_KEY, language: "en-US" },
  });
  genreCache = response.data.genres.reduce((acc, g) => {
    acc[g.id] = g;
    return acc;
  }, {});
  genreCacheTimestamp = now;
  return genreCache;
}

// --- Helper: Map TMDB Movie Object ---
function mapMovie(movie, genreMap, category = null) {
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
    genres: movie.genre_ids?.map(
      (id) => genreMap[id] || { id, name: "Unknown" }
    ),
    rating: movie.vote_average,
    vote_count: movie.vote_count,
    runtime: movie.runtime || null,
    original_language: movie.original_language,
    isNew: movie.release_date
      ? new Date(movie.release_date).getFullYear() === new Date().getFullYear()
      : false,
    isLiked: false,
    showReviewModal: false,
    boxOffice: null,
    categoryLabel: category ? CUSTOM_CATEGORIES[category]?.label : null,
  };
}

// --- Enhanced: getMoviesFromAPI ---
export const getMoviesFromAPI = async (query, filter = {}, page = 1) => {
  try {
    const {
      sort,
      genres,
      yearRange,
      language,
      runtimeRange,
      voteAverageRange,
      category,
    } = filter;
    const genreMap = await getGenresCached();

    const params = {
      api_key: TMDB_API_KEY,
      language: "en-US",
      page,
      include_adult: false,
    };

    // Category-specific filters
    if (category && CUSTOM_CATEGORIES[category]) {
      const catFilters = CUSTOM_CATEGORIES[category].filters;
      Object.assign(params, {
        sort_by: catFilters.sort || sort,
        with_genres: genres?.length ? genres.join(",") : catFilters.genres,
        "primary_release_date.gte": catFilters.yearRange
          ? `${catFilters.yearRange[0]}-01-01`
          : yearRange?.[0]
          ? `${yearRange[0]}-01-01`
          : undefined,
        "primary_release_date.lte": catFilters.yearRange
          ? `${catFilters.yearRange[1]}-12-31`
          : yearRange?.[1]
          ? `${yearRange[1]}-12-31`
          : undefined,
        with_original_language: catFilters.language || language,
        "with_runtime.gte": catFilters.runtimeRange?.[0] || runtimeRange?.[0],
        "with_runtime.lte": catFilters.runtimeRange?.[1] || runtimeRange?.[1],
        "vote_average.gte":
          catFilters.voteAverageRange?.[0] || voteAverageRange?.[0],
        "vote_average.lte":
          catFilters.voteAverageRange?.[1] || voteAverageRange?.[1],
        "vote_count.gte": catFilters.voteCount?.[0],
        "vote_count.lte": catFilters.voteCount?.[1],
        region: catFilters.region || undefined,
      });
    } else {
      if (sort) params.sort_by = sort;
      if (genres?.length) params.with_genres = genres.join(",");
      if (yearRange?.length === 2) {
        params["primary_release_date.gte"] = `${yearRange[0]}-01-01`;
        params["primary_release_date.lte"] = `${yearRange[1]}-12-31`;
      }
      if (language) params.with_original_language = language;
      if (runtimeRange?.length === 2) {
        params["with_runtime.gte"] = runtimeRange[0];
        params["with_runtime.lte"] = runtimeRange[1];
      }
      if (voteAverageRange?.length === 2) {
        params["vote_average.gte"] = voteAverageRange[0];
        params["vote_average.lte"] = voteAverageRange[1];
      }
    }

    let url = query
      ? `${TMDB_API_URL}/search/movie`
      : `${TMDB_API_URL}/discover/movie`;

    if (query) params.query = query;

    let movies = [];
    let totalResults = 0;

    if (!query && !category) {
      // Fetch Indian movies first
      const indianParams = {
        ...params,
        with_original_language: INDIAN_LANGUAGES.join(","),
        region: "IN",
      };
      const indianResponse = await axios.get(url, { params: indianParams });
      const indianMovies = (indianResponse.data.results || []).map((m) =>
        mapMovie(m, genreMap, category)
      );
      totalResults += indianResponse.data.total_results || 0;

      // International fallback
      let otherMovies = [];
      if (indianMovies.length < 20) {
        const otherParams = {
          ...params,
          without_original_language: INDIAN_LANGUAGES.join(","),
        };
        const otherResponse = await axios.get(url, { params: otherParams });
        otherMovies = (otherResponse.data.results || []).map((m) =>
          mapMovie(m, genreMap, category)
        );
        totalResults += otherResponse.data.total_results || 0;
      }

      const seen = new Set();
      movies = [...indianMovies, ...otherMovies].filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
    } else {
      const response = await axios.get(url, { params });
      movies = (response.data.results || []).map((m) =>
        mapMovie(m, genreMap, category)
      );
      totalResults = response.data.total_results || 0;
    }

    return { movies, totalResults, currentPage: page };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { movies: [], totalResults: 0, currentPage: page };
  }
};

// --- Genres ---
export const getGenresFromAPI = async () => {
  try {
    const genreMap = await getGenresCached();
    return Object.values(genreMap);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// --- Languages ---
export const getLanguagesFromAPI = async () => {
  try {
    const response = await axios.get(
      `${TMDB_API_URL}/configuration/languages`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
};

// --- Custom Categories ---
export const getCustomCategories = () => {
  return Object.entries(CUSTOM_CATEGORIES).map(([key, value]) => ({
    key,
    label: value.label,
  }));
};

// --- New: Extra Endpoints (but no component changes needed) ---
export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const getMovieCredits = async (id) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${id}/credits`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return null;
  }
};

export const getWatchProviders = async (id) => {
  try {
    const response = await axios.get(
      `${TMDB_API_URL}/movie/${id}/watch/providers`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    return response.data.results || {};
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return {};
  }
};

export const getSimilarMovies = async (id) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${id}/similar`, {
      params: { api_key: TMDB_API_KEY, language: "en-US" },
    });
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
};

export const getTrendingMovies = async (timeWindow = "week") => {
  try {
    const response = await axios.get(
      `${TMDB_API_URL}/trending/movie/${timeWindow}`,
      {
        params: { api_key: TMDB_API_KEY },
      }
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Example: NewsAPI Integration
const fetchNews = async (name) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: name,
        apiKey: "YOUR_NEWSAPI_KEY",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 5,
      },
    });
    return response.data.articles.map((article) => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
