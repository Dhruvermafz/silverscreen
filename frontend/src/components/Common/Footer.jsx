import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./footer.css"; // Import regular CSS file

const { Footer } = Layout;
const { Text } = Typography;

// Configuration for links and social media
const quickLinks = [
  { label: "Films", path: "/films" },
  { label: "Lists", path: "/lists" },
  { label: "Members", path: "/members" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Groups", path: "/groups" }, // Added to integrate with GroupsPage
];

const socialMedia = [
  {
    label: "GitHub",
    icon: <GithubOutlined />,
    url: "https://github.com/silverscreen-project", // Replace with actual URL
  },
  {
    label: "Twitter",
    icon: <TwitterOutlined />,
    url: "https://twitter.com/silverscreen", // Replace with actual URL
  },
  {
    label: "Instagram",
    icon: <InstagramOutlined />,
    url: "https://instagram.com/silverscreen", // Replace with actual URL
  },
  {
    label: "Email",
    icon: <MailOutlined />,
    url: `mailto:${
      process.env.REACT_APP_SUPPORT_EMAIL || "support@silverscreen.com"
    }`,
  },
];

const AppFooter = () => {
  return (
    <Footer className="footer">
      <Row gutter={[16, 16]} justify="space-between" className="container">
        {/* SilverScreen Section */}
        <Col xs={24} sm={12} md={8}>
          <Text className="title">Cinenotes</Text>
          <p className="description">
            Discover, discuss, and review films with a passionate community.
          </p>
        </Col>

        {/* Quick Links Section */}
        <Col xs={24} sm={12} md={8}>
          <Text className="subtitle">Quick Links</Text>
          <ul className="link-list">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Col>

        {/* Social Media Section */}
        <Col xs={24} sm={12} md={8}>
          <Text className="subtitle">Follow Us</Text>
          <Space size="middle" className="social-icons">
            {socialMedia.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={`Follow us on ${social.label}`}
              >
                {social.icon}
              </a>
            ))}
          </Space>
        </Col>
      </Row>

      {/* Footer Bottom Section */}
      <div className="bottom">
        © {new Date().getFullYear()} Cinenotes. All rights reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
