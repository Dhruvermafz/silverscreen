import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  return (
    <Input
      prefix={<SearchOutlined />}
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: 16 }}
    />
  );
};

export default SearchBar;
