import React from "react";
import { Layout, Row, Col, Typography, Space, Input, Button } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./footer.css";

const { Footer } = Layout;
const { Text, Title } = Typography;

const quickLinks = [
  { label: "Films", path: "/films" },
  { label: "Groups", path: "/groups" },
  { label: "Box Office", path: "/box-office" },
  { label: "Blogs", path: "/blogs" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const socialMedia = [
  {
    label: "GitHub",
    icon: <GithubOutlined />,
    url: "https://github.com/Cinenotes-project",
  },
  {
    label: "Twitter",
    icon: <TwitterOutlined />,
    url: "https://twitter.com/Cinenotes",
  },
  {
    label: "Instagram",
    icon: <InstagramOutlined />,
    url: "https://instagram.com/Cinenotes",
  },
  {
    label: "Email",
    icon: <MailOutlined />,
    url: `mailto:${
      process.env.REACT_APP_SUPPORT_EMAIL || "support@Cinenotes.com"
    }`,
  },
];

const AppFooter = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    // Simulate newsletter signup (replace with API call)
    console.log("Newsletter subscription:", email);
    alert("Subscribed to Cinenotes newsletter!");
    e.target.reset();
  };

  return (
    <Footer className="footer">
      <div className="footer-container">
        <Row gutter={[24, 24]} justify="center">
          {/* Cinenotes Branding */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} className="footer-title">
              Cinenotes
            </Title>
            <Text className="footer-description">
              Cinenotes is your home for cinema. Rate films, join vibrant
              groups, track box office trends, and write blogs about movies. No
              politics, just pure cinematic passion.
            </Text>
            <form
              onSubmit={handleNewsletterSubmit}
              className="footer-newsletter"
            >
              <Space.Compact>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  aria-label="Newsletter email"
                  className="footer-newsletter-input"
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </Button>
              </Space.Compact>
            </form>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-subtitle">Explore</Text>
            <nav aria-label="Footer navigation">
              <Space direction="vertical" size="small">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="footer-link"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </Space>
            </nav>
          </Col>

          {/* Social Media */}
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-subtitle">Connect</Text>
            <Space size="large" className="footer-social">
              {socialMedia.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label={`Follow Cinenotes on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </Space>
          </Col>
        </Row>

        {/* Bottom Section */}
        <Text className="footer-bottom">
          © {new Date().getFullYear()} Cinenotes. All rights reserved. |{" "}
          <Link to="/terms" aria-label="Terms of Use">
            Terms
          </Link>{" "}
          |{" "}
          <Link to="/privacy" aria-label="Privacy Policy">
            Privacy
          </Link>
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter;
