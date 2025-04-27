import React from "react";
import { Select, Rate, Space } from "antd";

const { Option } = Select;

const MovieFilter = ({ onChange }) => {
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
        <Option value="Action">Action</Option>
        <Option value="Comedy">Comedy</Option>
        <Option value="Drama">Drama</Option>
        <Option value="Horror">Horror</Option>
        {/* Add more genres */}
      </Select>

      <Rate onChange={handleRatingChange} />
    </Space>
  );
};

export default MovieFilter;
