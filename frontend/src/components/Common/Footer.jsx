import React from "react";
import { Layout, Row, Col, Typography, Space, Input, Button } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
    url: "https://github.com/Dhruvermafz/silverscreen",
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
      process.env.REACT_APP_SUPPORT_EMAIL || "support@cinenotes.com"
    }`,
  },
];

const AppFooter = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    // Simulate newsletter signup (replace with API call)
    console.log("Newsletter subscription:", email);
    toast.success("Subscribed to Cinenotes newsletter!", {
      position: "top-right",
      autoClose: 2000,
    });
    e.target.reset();
  };

  return (
    <Footer className="footer">
      <div className="footer-container">
        <Row gutter={[16, 16]} justify="center">
          {/* Branding Section */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} className="footer-title">
              Cinenotes
            </Title>
            <Text className="footer-description">
              Join the Cinenotes community to rate films, discuss in groups,
              track box office, and share your movie blogs. Pure cinema, no
              distractions.
            </Text>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={6} md={4}>
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

          {/* Legal Links */}
          <Col xs={12} sm={6} md={4}>
            <Text className="footer-subtitle">Legal</Text>
            <nav aria-label="Legal navigation">
              <Space direction="vertical" size="small">
                <Link
                  to="/terms"
                  className="footer-link"
                  aria-label="Terms of Use"
                >
                  Terms
                </Link>
                <Link
                  to="/privacy"
                  className="footer-link"
                  aria-label="Privacy Policy"
                >
                  Privacy
                </Link>
              </Space>
            </nav>
          </Col>

          {/* Social Media */}
          <Col xs={24} sm={12} md={8}>
            <Text className="footer-subtitle">Connect</Text>
            <Space size="middle" className="footer-social">
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
          © {new Date().getFullYear()} Cinenotes. All rights reserved.
        </Text>
      </div>
    </Footer>
  );
};

export default AppFooter;
