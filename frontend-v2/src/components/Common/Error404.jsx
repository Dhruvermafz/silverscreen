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
        background: "#f8f9fa", // light neutral background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        color: "#212529",
      }}
    >
      <div style={{ maxWidth: 640 }}>
        {/* Fun 404 Title */}
        <Title
          level={1}
          style={{
            fontSize: "7.5rem",
            fontWeight: "bold",
            margin: 0,
            color: "#e50914",
            letterSpacing: "0.05em",
          }}
        >
          404
        </Title>

        <Title level={2} style={{ color: "#212529", marginBottom: 16 }}>
          Lights, Camera... Lost Scene?
        </Title>

        <Paragraph
          style={{
            fontSize: "1.2rem",
            color: "#495057",
            marginBottom: 32,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Oops! The page you're looking for has vanished like a plot twist in a
          mystery thriller. It might have been deleted, moved, or never existed
          in this reel.
        </Paragraph>

        {/* Light-themed illustration */}
        <div
          style={{
            margin: "48px 0",
            height: 260,
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23ffffff'/%3E%3Ctext x='400' y='200' font-size='90' text-anchor='middle' fill='%23e50914' opacity='0.15'%3E%F0%9F%8E%AC%3C/text%3E%3Ctext x='400' y='280' font-size='48' text-anchor='middle' fill='%236c757d'%3ELost Reel%3C/text%3E%3C/svg%3E") center/cover no-repeat`,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            border: "1px solid #e9ecef",
          }}
        />

        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", marginTop: 40 }}
        >
          <Space size="middle" wrap justify="center">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              style={{ borderRadius: 10, height: 48 }}
            >
              Back to Home
            </Button>

            <Button
              size="large"
              icon={<SearchOutlined />}
              onClick={() => navigate("/explore")}
              style={{ borderRadius: 10, height: 48 }}
            >
              Explore Movies
            </Button>

            <Button
              size="large"
              icon={<RollbackOutlined />}
              onClick={() => navigate(-1)}
              style={{ borderRadius: 10, height: 48 }}
            >
              Go Back
            </Button>
          </Space>

          <Paragraph style={{ color: "#6c757d", marginTop: 32 }}>
            Still lost? Try searching for a movie, or check out our{" "}
            <Link to="/explore" style={{ color: "#e50914", fontWeight: 500 }}>
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
