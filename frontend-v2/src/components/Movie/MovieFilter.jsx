import React, { useState, useEffect, useCallback } from "react";
import { Select, Slider, Space } from "antd";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";
import { toast } from "react-toastify";

const { Option } = Select;

const MovieFilter = ({ onChange }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortOption, setSortOption] = useState("popularity.desc");
  const [yearRange, setYearRange] = useState([1900, 2025]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres);
      } catch (error) {
        toast.error("Failed to load genres", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };
    fetchGenres();
  }, []);

  // Memoized filter update to prevent unnecessary calls
  const updateFilters = useCallback(() => {
    onChange({
      genres: selectedGenres,
      sort: sortOption,
      yearRange,
    });
  }, [selectedGenres, sortOption, yearRange, onChange]);

  // Handle genre change
  const handleGenreChange = (value) => {
    setSelectedGenres(value);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortOption(value);
  };

  // Handle year range change
  const handleYearRangeChange = (value) => {
    setYearRange(value);
  };

  // Trigger onChange only when user interaction is complete
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  return (
    <Space direction="vertical" size="middle" className="movie-filter">
      <Select
        mode="multiple"
        placeholder="Select genres"
        value={selectedGenres}
        onChange={handleGenreChange}
        style={{ width: 200 }}
        showSearch
        optionFilterProp="children"
        aria-label="Select genres"
      >
        {genres.map((genre) => (
          <Option key={genre.id} value={genre.id}>
            {genre.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Sort by"
        value={sortOption}
        onChange={handleSortChange}
        style={{ width: 200 }}
        aria-label="Sort movies"
      >
        <Option value="popularity.desc">Popularity Descending</Option>
        <Option value="popularity.asc">Popularity Ascending</Option>
        <Option value="release_date.desc">Release Date Descending</Option>
        <Option value="release_date.asc">Release Date Ascending</Option>
        <Option value="vote_average.desc">Rating Descending</Option>
        <Option value="vote_average.asc">Rating Ascending</Option>
      </Select>
      <div>
        <label>Year Range</label>
        <Slider
          range
          min={1900}
          max={2025}
          value={yearRange}
          onChange={handleYearRangeChange}
          aria-label="Select year range"
        />
      </div>
    </Space>
  );
};

export default MovieFilter;
