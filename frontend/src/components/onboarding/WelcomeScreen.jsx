import React from "react";
import { Button, Typography } from "antd";
import VideoPlayer from "../Common/VideoPlayer";

const { Title, Paragraph } = Typography;

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="welcome-screen">
      <Title level={2}>Welcome to CineNotes</Title>
      <Paragraph>
        Join a community where cinema is king. Track box office hits, write
        blogs, join cinephile groups, and share your love for films—without the
        noise of politics.
      </Paragraph>
      <VideoPlayer src="/assets/welcome-video.mp4" />
      <Button type="primary" className="welcome-button" onClick={onNext}>
        Get Started
      </Button>
    </div>
  );
};

export default WelcomeScreen;
