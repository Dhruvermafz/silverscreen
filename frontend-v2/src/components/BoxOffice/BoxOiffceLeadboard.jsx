// src/components/BoxOfficeLeaderboard.js
import React from "react";
import { Typography, Table } from "antd";
import { Select } from "antd";

const { Title } = Typography;
const { Option } = Select;

// Mock leaderboard data
const mockLeaderboardData = [
  {
    key: "1",
    title: "Inside Out 2",
    gross: "$1,697,713,307",
    releaseDate: "2024-06-14",
    rank: 1,
  },
  {
    key: "2",
    title: "Deadpool & Wolverine",
    gross: "$1,337,360,336",
    releaseDate: "2024-07-26",
    rank: 2,
  },
  {
    key: "3",
    title: "Dune: Part Two",
    gross: "$711,844,358",
    releaseDate: "2024-03-01",
    rank: 3,
  },
];

const columns = [
  { title: "Rank", dataIndex: "rank", key: "rank" },
  { title: "Title", dataIndex: "title", key: "title" },
  { title: "Gross", dataIndex: "gross", key: "gross" },
  { title: "Release Date", dataIndex: "releaseDate", key: "releaseDate" },
];

const BoxOfficeLeaderboard = () => {
  const handlePeriodChange = (value) => {
    // Mock filter logic; replace with API call
    console.log(`Filtering leaderboard for: ${value}`);
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
        Box Office Leaderboard
      </Title>
      <Select
        defaultValue="yearly"
        onChange={handlePeriodChange}
        style={{ marginBottom: "var(--spacing-md)", width: "200px" }}
        className="form-group"
      >
        <Option value="weekly">Weekly</Option>
        <Option value="monthly">Monthly</Option>
        <Option value="yearly">Yearly</Option>
      </Select>
      <Table
        dataSource={mockLeaderboardData}
        columns={columns}
        pagination={false}
        rowClassName="ant-table-row"
        style={{ background: "var(--background-secondary)" }}
      />
    </div>
  );
};

export default BoxOfficeLeaderboard;
