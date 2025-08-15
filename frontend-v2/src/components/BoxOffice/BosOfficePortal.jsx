// src/components/BoxOfficePortal.js
import React from "react";
import { Typography, Card, Select } from "antd";

const { Title } = Typography;
const { Option } = Select;

// Mock box office data
const mockBoxOfficeData = [
  {
    id: 1,
    title: "Dune: Part Two",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05deuGJ.jpg",
    gross: "$711,844,358",
    releaseDate: "2024-03-01",
    genre: "Sci-Fi",
  },
  {
    id: 2,
    title: "Inside Out 2",
    posterUrl: "https://image.tmdb.org/t/p/w500/xKb6XHx3O1v8D2L1vVua3iUYq1.jpg",
    gross: "$1,697,713,307",
    releaseDate: "2024-06-14",
    genre: "Animation",
  },
  {
    id: 3,
    title: "Deadpool & Wolverine",
    posterUrl:
      "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    gross: "$1,337,360,336",
    releaseDate: "2024-07-26",
    genre: "Action",
  },
];

const BoxOfficePortal = () => {
  const handleFilterChange = (value) => {
    // Mock filter logic; replace with API call
    console.log(`Filtering portal by: ${value}`);
  };

  return (
    <div style={{ margin: "var(--spacing-lg) 0" }}>
      <Title
        level={3}
        style={{
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        Box Office Performance
      </Title>
      <Select
        defaultValue="all"
        onChange={handleFilterChange}
        style={{ marginBottom: "var(--spacing-md)", width: "200px" }}
        className="form-group"
      >
        <Option value="all">All Genres</Option>
        <Option value="sci-fi">Sci-Fi</Option>
        <Option value="animation">Animation</Option>
        <Option value="action">Action</Option>
      </Select>
      <div className="movie-list">
        {mockBoxOfficeData.map((movie) => (
          <Card key={movie.id} className="movie-card card">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: "100%", height: "240px", objectFit: "cover" }}
            />
            <div className="movie-card-info">
              <h3 style={{ color: "var(--text-primary)" }}>{movie.title}</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Gross: {movie.gross}
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Release: {movie.releaseDate}
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Genre: {movie.genre}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BoxOfficePortal;
