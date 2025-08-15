// src/components/BoxOfficeCharts.js
import React from "react";
import { Typography } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

// Mock chart data
const chartData = {
  labels: ["Dune: Part Two", "Inside Out 2", "Deadpool & Wolverine"],
  datasets: [
    {
      label: "Gross Earnings (USD)",
      data: [711844358, 1697713307, 1337360336],
      backgroundColor: "var(--primary-color)",
      borderColor: "var(--primary-hover)",
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: "var(--text-primary)" } },
    title: {
      display: true,
      text: "2024 Box Office Performance",
      color: "var(--text-primary)",
    },
  },
  scales: {
    x: { ticks: { color: "var(--text-primary)" } },
    y: {
      ticks: {
        color: "var(--text-primary)",
        callback: (value) => `$${value.toLocaleString()}`,
      },
    },
  },
};

const BoxOfficeCharts = () => {
  return (
    <div style={{ margin: "var(--spacing-lg) 0" }}>
      <Title
        level={3}
        style={{
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        Box Office Trends
      </Title>
      <div
        style={{
          background: "var(--background-secondary)",
          padding: "var(--spacing-md)",
          borderRadius: "var(--border-radius)",
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BoxOfficeCharts;
