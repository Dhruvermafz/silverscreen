import React from "react";
import { Button, Typography, Space, Result } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  RollbackOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="error-404-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <div style={{ maxWidth: 600 }}>
        {/* Fun 404 Title */}
        <Title
          level={1}
          style={{
            fontSize: "8rem",
            fontWeight: "bold",
            margin: 0,
            color: "#e50914",
            textShadow: "0 0 20px rgba(229, 9, 20, 0.5)",
            letterSpacing: "0.1em",
          }}
        >
          404
        </Title>

        <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
          Lights, Camera... Lost Scene?
        </Title>

        <Paragraph
          style={{ fontSize: "1.2rem", color: "#ccc", marginBottom: 32 }}
        >
          Oops! The page you're looking for has vanished like a plot twist in a
          mystery thriller. It might have been deleted, moved, or never existed
          in this reel.
        </Paragraph>

        {/* Illustration or SVG can go here if you have one */}
        <div
          style={{
            margin: "40px 0",
            height: 240,
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23222'%3E%3C/rect%3E%3Ctext x='400' y='200' font-size='80' text-anchor='middle' fill='%23333'%3E🎬%3C/text%3E%3Ctext x='400' y='280' font-size='40' text-anchor='middle' fill='%23555'%3ELost Reel%3C/text%3E%3C/svg%3E") center/cover no-repeat`,
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        />

        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", marginTop: 40 }}
        >
          <Space size="middle" wrap>
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
            <Button
              size="large"
              icon={<SearchOutlined />}
              onClick={() => navigate("/explore")}
            >
              Explore Movies
            </Button>
            <Button
              size="large"
              icon={<RollbackOutlined />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Space>

          <Paragraph style={{ color: "#888", marginTop: 32 }}>
            Still lost? Try searching for a movie, or check out our{" "}
            <Link to="/explore" style={{ color: "#e50914" }}>
              latest releases
            </Link>
            .
          </Paragraph>
        </Space>
      </div>
    </div>
  );
};

export default Error404;
