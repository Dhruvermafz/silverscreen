import React, { useEffect, useState } from "react";
import { Select, Rate, Space, Button, Slider } from "antd";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";
import { toast } from "react-toastify";

const { Option } = Select;

const MovieFilter = ({ onChange }) => {
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: null,
    rating: 0,
    sort: null,
    year: [1900, 2025],
  });

  useEffect(() => {
    getGenresFromAPI()
      .then(setGenres)
      .catch(() => {
        toast.error("Failed to fetch genres", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  }, []);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      genre: null,
      rating: 0,
      sort: null,
      year: [1900, 2025],
    };
    setFilters(resetFilters);
    onChange(resetFilters);
    toast.success("Filters reset", { position: "top-right", autoClose: 2000 });
  };

  return (
    <Space wrap className="movie-filter">
      <Select
        placeholder="Select Genre"
        onChange={(value) => handleChange("genre", value)}
        style={{ width: 200 }}
        value={filters.genre}
        allowClear
        aria-label="Select genre"
      >
        {genres.map((g) => (
          <Option key={g.id} value={g.id}>
            {g.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Sort By"
        onChange={(value) => handleChange("sort", value)}
        style={{ width: 200 }}
        value={filters.sort}
        allowClear
        aria-label="Sort movies"
      >
        <Option value="popularity.desc">Popularity</Option>
        <Option value="release_date.desc">Newest</Option>
        <Option value="vote_average.desc">Top Rated</Option>
      </Select>
      <div>
        <p>Rating</p>
        <Rate
          onChange={(value) => handleChange("rating", value)}
          value={filters.rating}
          allowClear
        />
      </div>
      <div>
        <p>Year Range</p>
        <Slider
          range
          min={1900}
          max={2025}
          value={filters.year}
          onChange={(value) => handleChange("year", value)}
          style={{ width: 200 }}
          aria-label="Select year range"
        />
      </div>
      <Button onClick={handleReset} aria-label="Reset filters">
        Reset
      </Button>
    </Space>
  );
};

export default MovieFilter;
