import React, { useContext } from "react";
import { Button, Typography, Row, Col } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const { user, isLoggedIn, login, logout } = useContext(AuthContext); // Using the AuthContext

  return (
    <div className="hero-section">
      <img
        src="https://i0.wp.com/cdn.bgr.com/2014/10/interstellar.jpeg"
        alt="Interstellar movie scene with space background"
        className="hero-section-image"
      />
      <div className="hero-section-overlay">
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col>
            <Title
              level={1}
              className="hero-title"
              style={{ color: "#fff", textAlign: "center" }}
            >
              Track films you’ve watched.
            </Title>
            <Paragraph
              className="hero-description"
              style={{ color: "#fff", textAlign: "center" }}
            >
              Save those you want to see. Tell your friends what’s good.
            </Paragraph>

            {!isLoggedIn ? (
              <div className="hero-action">
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  size="large"
                  className="hero-signup-button"
                  onClick={() =>
                    login({ name: "John Doe", email: "john@example.com" })
                  } // Example login
                  style={{
                    fontWeight: 600,
                    borderRadius: "30px",
                    padding: "10px 30px",
                  }}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="logged-in-content">
                <Title level={4} style={{ color: "#fff", textAlign: "center" }}>
                  Welcome back, {user.name}!
                </Title>
                <Button
                  type="danger"
                  size="large"
                  onClick={logout} // Log out functionality
                  style={{
                    fontWeight: 600,
                    borderRadius: "30px",
                    padding: "10px 30px",
                  }}
                >
                  Log Out
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;
