import React, { useEffect, useState } from "react";
import { Select, Rate, Space } from "antd";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";
const { Option } = Select;

const MovieFilter = ({ onChange }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenresFromAPI().then(setGenres);
  }, []);

  const handleGenreChange = (value) => {
    onChange({ genre: value });
  };

  const handleRatingChange = (value) => {
    onChange({ rating: value });
  };

  return (
    <Space>
      <Select
        placeholder="Select Genre"
        onChange={handleGenreChange}
        style={{ width: 200 }}
      >
        {genres.map((g) => (
          <Option key={g.id} value={g.id}>
            {g.name}
          </Option>
        ))}
      </Select>

      <Rate onChange={handleRatingChange} allowClear />
    </Space>
  );
};

export default MovieFilter;
