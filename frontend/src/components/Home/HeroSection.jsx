import React from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <img
        src="https://i0.wp.com/cdn.bgr.com/2014/10/interstellar.jpeg"
        alt="Interstellar movie scene with space background"
        className="hero-section-image"
      />
      <div className="hero-section-overlay">
        <h1 className="hero-title">Track films you’ve watched.</h1>
        <p className="hero-description">
          Save those you want to see. Tell your friends what’s good.
        </p>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          className="hero-signup-button"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
