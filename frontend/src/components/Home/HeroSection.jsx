import React, { useState, useEffect } from "react";
import { Button, Typography, Row, Col, Carousel } from "antd";
import { UserAddOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

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
      src: "https://_via.placeholder.com/1200x600?text=The+Matrix",
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

  const handleAction = () => {
    if (isLoggedIn) {
      toast.info("Add a movie to your list", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.success("Redirecting to login", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-section-overlay">
        <Row justify="center" align="middle" className="hero-content">
          <Col xs={22} sm={20} md={16}>
            <Title level={2} className="hero-title">
              {isLoggedIn
                ? `Welcome, ${user.username.split("@")[0]}!`
                : "Discover Your Next Favorite Film"}
            </Title>
            <Text className="hero-description">
              {isLoggedIn
                ? "Explore, track, and share your movie journey."
                : "Join our community to track films, join groups, and share reviews."}
            </Text>
            <div className="hero-cta">
              <Button
                type="primary"
                icon={isLoggedIn ? <PlusOutlined /> : <UserAddOutlined />}
                size="large"
                href={isLoggedIn ? "/add-movie" : "/login"}
                onClick={handleAction}
                className="hero-button"
                aria-label={isLoggedIn ? "Add a movie" : "Join now"}
              >
                {isLoggedIn ? "Add Movie" : "Join Now"}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;
