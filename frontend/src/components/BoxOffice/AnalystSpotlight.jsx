// src/components/AnalystSpotlight.js
import React from "react";
import { Typography, Card } from "antd";

const { Title } = Typography;

// Mock analyst data
const mockAnalysts = [
  {
    id: 1,
    name: "Jane Analyst",
    bio: "Expert in box office forecasting with a CPA background.",
    profileImage: "https://via.placeholder.com/80",
    predictionAccuracy: "92%",
  },
  {
    id: 2,
    name: "John Analyst",
    bio: "Specializes in indie film markets and global trends.",
    profileImage: "https://via.placeholder.com/80",
    predictionAccuracy: "89%",
  },
];

const AnalystSpotlight = () => {
  return (
    <div style={{ margin: "var(--spacing-lg) 0" }}>
      <Title
        level={3}
        style={{
          color: "var(--text-primary)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        Analyst Spotlight
      </Title>
      <div className="movie-list">
        {mockAnalysts.map((analyst) => (
          <Card key={analyst.id} className="card profile">
            <img
              src={analyst.profileImage}
              alt={analyst.name}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div className="movie-card-info">
              <h3 style={{ color: "var(--text-primary)" }}>{analyst.name}</h3>
              <p style={{ color: "var(--text-secondary)" }}>{analyst.bio}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Prediction Accuracy:{" "}
                <span style={{ color: "var(--primary-color)" }}>
                  {analyst.predictionAccuracy}
                </span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalystSpotlight;
