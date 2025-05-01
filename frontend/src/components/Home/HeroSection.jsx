import React from "react";
import { Button, Typography, Row, Col } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi"; // Make sure this is correct

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();

  const isLoggedIn = !isLoading && !isError && user && user.email;

  return (
    <div className="hero-section">
      <img
        src="https://i0.wp.com/cdn.bgr.com/2014/10/interstellar.jpeg"
        alt="Interstellar"
        className="hero-section-image"
      />
      <div className="hero-section-overlay">
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col>
            <Title level={1} style={{ color: "#fff", textAlign: "center" }}>
              Track films you’ve watched.
            </Title>
            <Paragraph style={{ color: "#fff", textAlign: "center" }}>
              Save those you want to see. Tell your friends what’s good.
            </Paragraph>

            {!isLoggedIn ? (
              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  size="large"
                  href="/login" // You can update this to your actual login route
                  style={{
                    fontWeight: 600,
                    borderRadius: "30px",
                    padding: "10px 30px",
                  }}
                >
                  Sign Up / Login
                </Button>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#fff" }}>
                <Title level={4} style={{ color: "#fff" }}>
                  Welcome back, {user.username.split("@")[0]}!
                </Title>

                <div style={{ marginTop: "20px" }}>
                  <Title level={5} style={{ color: "#fff" }}>
                    Your List
                  </Title>
                  {user.favoriteMovies.length === 0 ? (
                    <p>No movies in your list yet.</p>
                  ) : (
                    <ul>
                      {user.favoriteMovies.map((movie) => (
                        <li key={movie._id}>{movie.title}</li>
                      ))}
                    </ul>
                  )}

                  <Title level={5} style={{ color: "#fff", marginTop: "20px" }}>
                    Just Added
                  </Title>
                  {/* You can fill this with actual recent additions from your backend */}
                  <p>New feature coming soon...</p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;
