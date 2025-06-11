const Movie = require("../models/Movie");

const calculateLeaderboard = async (period = "yearly") => {
  let dateFilter = {};
  const now = new Date();
  if (period === "weekly") {
    dateFilter = {
      releaseDate: {
        $gte: new Date(now.setDate(now.getDate() - 7))
          .toISOString()
          .split("T")[0],
      },
    };
  } else if (period === "monthly") {
    dateFilter = {
      releaseDate: {
        $gte: new Date(now.setMonth(now.getMonth() - 1))
          .toISOString()
          .split("T")[0],
      },
    };
  } else if (period === "yearly") {
    dateFilter = {
      releaseDate: {
        $gte: new Date(now.setFullYear(now.getFullYear() - 1))
          .toISOString()
          .split("T")[0],
      },
    };
  }

  return Movie.find(dateFilter)
    .sort({ grossRevenue: -1 })
    .limit(10)
    .select("title grossRevenue releaseDate");
};

const calculateChartData = async () => {
  const movies = await Movie.find()
    .sort({ grossRevenue: -1 })
    .limit(5)
    .select("title grossRevenue");
  return {
    labels: movies.map((m) => m.title),
    datasets: [
      {
        label: "Gross Revenue (USD)",
        data: movies.map((m) => m.grossRevenue),
      },
    ],
  };
};

module.exports = { calculateLeaderboard, calculateChartData };
