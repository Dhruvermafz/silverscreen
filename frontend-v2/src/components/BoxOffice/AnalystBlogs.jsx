// src/components/AnalystBlogs.js
import React from "react";
import { Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

// Mock blog data
const mockBlogs = [
  {
    id: 1,
    title: "2024’s Box Office Surprises",
    excerpt:
      "From indie hits to unexpected blockbusters, we analyze what drove this year’s box office trends.",
    author: "Jane Analyst",
    date: "2025-06-01",
  },
  {
    id: 2,
    title: "The Rise of Cinematic Sequels",
    excerpt:
      "Why sequels like Deadpool & Wolverine dominated the charts and what it means for studios.",
    author: "John Analyst",
    date: "2025-05-15",
  },
];

const AnalystBlogs = () => {
  return (
    <div style={{ margin: "var(--spacing-lg) 0" }}>
      <Title
        level={3}
        style={{
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        Analyst Insights
      </Title>
      <div className="movie-list">
        {mockBlogs.map((blog) => (
          <Card key={blog.id} className="card">
            <div className="movie-card-info">
              <h3 style={{ color: "var(--text-primary)" }}>{blog.title}</h3>
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ color: "var(--text-secondary)" }}
              >
                {blog.excerpt}
              </Paragraph>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                By {blog.author} on {blog.date}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalystBlogs;
