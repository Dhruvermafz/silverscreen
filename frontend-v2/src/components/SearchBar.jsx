import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  return (
    <Form.Group className="search-bar mb-4">
      <InputGroup>
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="search"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search"
        />
      </InputGroup>
    </Form.Group>
  );
};

export default SearchBar;
