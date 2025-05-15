import React, { useState, useEffect } from "react";
import { Button, Typography, Row, Col, Carousel, List, Tooltip } from "antd";
import { UserAddOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Paragraph, Text } = Typography;

const HeroSection = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const isLoggedIn = !isLoading && !isError && user && user.email;

  const featuredImages = [
    {
      src: "https://i0.wp.com/cdn.bgr.com/2014/10/interstellar.jpeg",
      alt: "Interstellar",
      title: "Interstellar",
    },
    {
      src: "https://via.placeholder.com/1200x600?text=Dune",
      alt: "Dune",
      title: "Dune",
    },
    {
      src: "https://via.placeholder.com/1200x600?text=The+Matrix",
      alt: "The Matrix",
      title: "The Matrix",
    },
  ];

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user profile", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, [isError]);

  const handleSignup = () => {
    toast.success("Redirecting to signup/login", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleAddMovie = () => {
    // Mock add movie action
    toast.info("Add a movie to your list", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="hero-section">
      <Carousel autoplay effect="fade" className="hero-carousel">
        {featuredImages.map((img, index) => (
          <div key={index}>
            <img src={img.src} alt={img.alt} className="hero-section-image" />
            <div className="hero-carousel-caption">
              <Title level={3} style={{ color: "#fff" }}>
                {img.title}
              </Title>
            </div>
          </div>
        ))}
      </Carousel>
      <div className="hero-section-overlay">
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col xs={22} sm={20} md={16}>
            <Title level={1} style={{ color: "#fff", textAlign: "center" }}>
              Track films you’ve watched.
            </Title>
            <Paragraph
              style={{ color: "#fff", textAlign: "center", fontSize: "1.1rem" }}
            >
              Save those you want to see. Tell your friends what’s good.
            </Paragraph>

            {!isLoggedIn ? (
              <div style={{ textAlign: "center" }}>
                <Tooltip title="Join our movie community">
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    size="large"
                    href="/login"
                    onClick={handleSignup}
                    style={{
                      fontWeight: 600,
                      borderRadius: "30px",
                      padding: "10px 30px",
                    }}
                    aria-label="Sign up or login"
                  >
                    Sign Up / Login
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Title level={4} style={{ color: "#fff" }}>
                  Welcome back, {user.username.split("@")[0]}!
                </Title>
                <div style={{ marginTop: "20px" }}>
                  <Title level={5} style={{ color: "#fff" }}>
                    Your List
                  </Title>
                  {user.favoriteMovies.length === 0 ? (
                    <Text style={{ color: "#ccc" }}>
                      No movies in your list yet.
                    </Text>
                  ) : (
                    <List
                      dataSource={user.favoriteMovies.slice(0, 5)}
                      renderItem={(movie) => (
                        <List.Item>
                          <Text style={{ color: "#fff" }}>{movie.title}</Text>
                        </List.Item>
                      )}
                    />
                  )}
                  <Title level={5} style={{ color: "#fff", marginTop: "20px" }}>
                    Recent Activity
                  </Title>
                  <Text style={{ color: "#ccc" }}>
                    {user.recentActivity?.length > 0
                      ? user.recentActivity[0].description
                      : "No recent activity. Add movies to get started!"}
                  </Text>
                  <div style={{ marginTop: "16px" }}>
                    <Tooltip title="Add a movie to your list">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddMovie}
                        aria-label="Add a movie"
                      >
                        Add Movie
                      </Button>
                    </Tooltip>
                  </div>
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
