// src/components/BoxOfficeNewsroom.js
import React from "react";
import { Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

// Mock news data
const mockNews = [
  {
    id: 1,
    title: "2025 Box Office Forecast",
    excerpt:
      "Analysts predict a strong year for sequels and reboots, with sci-fi leading the charge.",
    source: "Variety",
    date: "2025-06-10",
  },
  {
    id: 2,
    title: "Indie Films Gain Traction",
    excerpt:
      "Small-budget films are carving a niche in global box office charts.",
    source: "The Hollywood Reporter",
    date: "2025-06-05",
  },
];

const BoxOfficeNewsroom = () => {
  return (
    <div style={{ margin: "var(--spacing-lg) 0" }}>
      <Title
        level={3}
        style={{
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        Box Office Newsroom
      </Title>
      <div className="movie-list">
        {mockNews.map((article) => (
          <Card key={article.id} className="card">
            <div className="movie-card-info">
              <h3 style={{ color: "var(--text-primary)" }}>{article.title}</h3>
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ color: "var(--text-secondary)" }}
              >
                {article.excerpt}
              </Paragraph>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                {article.source} • {article.date}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BoxOfficeNewsroom;
