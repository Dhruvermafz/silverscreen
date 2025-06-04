import React from "react";
import { Typography, Card } from "antd";
import "./about.css";
const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <Card bordered={false} style={{ textAlign: "center", padding: "30px" }}>
        <Title level={2}>Welcome to Cinenotes 🎬</Title>
        <Paragraph style={{ marginTop: "20px", fontSize: "16px" }}>
          Cinenotes is your ultimate destination for sharing, reviewing, and
          discovering movies and cinematic gems. Whether you're a casual viewer
          or a hardcore cinephile, Cinenotes provides a platform to rate,
          discuss, and explore films with a passionate community.
        </Paragraph>
        <Paragraph style={{ fontSize: "16px" }}>
          Create personalized movie lists, connect with fellow film lovers, and
          keep track of your movie-watching journey. Every star you give, every
          review you write — it becomes part of the Cinenotes universe!
        </Paragraph>
        <Paragraph strong style={{ fontSize: "16px" }}>
          Because every movie deserves its audience, and every viewer has a
          story to tell.
        </Paragraph>
      </Card>
    </div>
  );
};

export default About;
