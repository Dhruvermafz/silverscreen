import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Link, Text } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#111827", // Dark gray background
        color: "#fff",
        padding: "40px 0",
        marginTop: "80px",
      }}
    >
      <Row
        gutter={[16, 16]}
        justify="space-between"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* SilverScreeninSight Section */}
        <Col xs={24} md={8}>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            SilverScreeninSight
          </Text>
          <p style={{ color: "#d1d5db", marginTop: "10px" }}>
            Discover, discuss, and review films with a passionate community.
          </p>
        </Col>

        {/* Quick Links Section */}
        <Col xs={12} md={8}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Quick Links
          </Text>
          <ul style={{ marginTop: "10px", listStyle: "none", padding: "0" }}>
            <li>
              <Link
                href="/films"
                style={{ color: "#d1d5db", fontSize: "14px" }}
              >
                Films
              </Link>
            </li>
            <li>
              <Link
                href="/lists"
                style={{ color: "#d1d5db", fontSize: "14px" }}
              >
                Lists
              </Link>
            </li>
            <li>
              <Link
                href="/members"
                style={{ color: "#d1d5db", fontSize: "14px" }}
              >
                Members
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                style={{ color: "#d1d5db", fontSize: "14px" }}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                style={{ color: "#d1d5db", fontSize: "14px" }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </Col>

        {/* Social Media Section */}
        <Col xs={12} md={8}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#fff",
            }}
          >
            Follow Us
          </Text>
          <Space size="middle" style={{ marginTop: "10px", fontSize: "20px" }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubOutlined style={{ color: "#d1d5db" }} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined style={{ color: "#d1d5db" }} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramOutlined style={{ color: "#d1d5db" }} />
            </a>
            <a href="mailto:support@silverscreeninsight.com">
              <MailOutlined style={{ color: "#d1d5db" }} />
            </a>
          </Space>
        </Col>
      </Row>

      {/* Footer Bottom Section */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} SilverScreeninSight. All rights reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
