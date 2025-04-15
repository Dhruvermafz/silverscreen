const axios = require("axios");
const Movie = require("../models/movies");

exports.searchMovies = async (req, res) => {
  const { query } = req.query;
  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    }
  );
  res.json(response.data.results);
};

exports.saveMovie = async (req, res) => {
  const { tmdbId, title, posterPath, overview, releaseDate } = req.body;

  let movie = await Movie.findOne({ tmdbId });
  if (!movie) {
    movie = await Movie.create({
      tmdbId,
      title,
      posterPath,
      overview,
      releaseDate,
    });
  }

  res.json(movie);
};
