import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer } = Layout;
const { Text } = Typography;

const quickLinks = [
  { label: "Films", path: "/films" },
  { label: "Groups", path: "/groups" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const socialMedia = [
  {
    label: "GitHub",
    icon: <GithubOutlined />,
    url: "https://github.com/silverscreen-project",
  },
  {
    label: "Twitter",
    icon: <TwitterOutlined />,
    url: "https://twitter.com/silverscreen",
  },
  {
    label: "Instagram",
    icon: <InstagramOutlined />,
    url: "https://instagram.com/silverscreen",
  },
  {
    label: "Email",
    icon: <MailOutlined />,
    url: `mailto:${
      process.env.REACT_APP_SUPPORT_EMAIL || "support@cinenotes.com"
    }`,
  },
];

const AppFooter = () => {
  return (
    <Footer className="footer">
      <div className="container">
        <Row gutter={[24, 24]} justify="center">
          {/* Cinenotes Section */}
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-title">Cinenotes</Text>
            <Text className="footer-description">
              Discover and discuss films with our community. Join us to explore
              cinematic stories, share insights, and connect with fellow film
              enthusiasts.
            </Text>
          </Col>

          {/* Quick Links Section */}
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-subtitle">Quick Links</Text>
            <Space direction="vertical" size="small">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="footer-link"
                  aria-label={`Navigate to ${link.label} page`}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Social Media Section */}
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-subtitle">Follow Us</Text>
            <Space size="large">
              {socialMedia.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </Space>
          </Col>
        </Row>

        {/* Footer Bottom Section */}
        <Text className="footer-bottom">
          © {new Date().getFullYear()} Cinenotes. All rights reserved.
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter;
