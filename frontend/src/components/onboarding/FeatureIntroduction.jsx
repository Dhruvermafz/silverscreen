import React from "react";
import { Button, Card, Carousel, Typography } from "antd";

const { Title, Paragraph } = Typography;

const FeatureIntroduction = ({ onNext }) => {
  const features = [
    {
      title: "Box Office Portal",
      description:
        "Track real-time box office collections and compare films like ‘Jawan’ vs. ‘Animal’.",
      image: "/assets/box-office.jpg",
    },
    {
      title: "Smart Lists & Tags",
      description:
        "Create lists like ‘Best 90s Bollywood’ or tag films with moods like ‘heartwarming.’",
      image: "/assets/lists.jpg",
    },
    {
      title: "Groups & Newsroom",
      description: "Join groups like ‘Tamil Cinema Fans’ or read curated news.",
      image: "/assets/groups.jpg",
    },
  ];

  return (
    <div className="feature-introduction">
      <Title level={3}>Discover CineNotes</Title>
      <Carousel autoplay className="feature-carousel">
        {features.map((f, i) => (
          <Card
            key={i}
            cover={<img alt={f.title} src={f.image} />}
            className="feature-card"
          >
            <Title level={4}>{f.title}</Title>
            <Paragraph>{f.description}</Paragraph>
          </Card>
        ))}
      </Carousel>
      <Button type="primary" className="feature-button" onClick={onNext}>
        Explore Now
      </Button>
    </div>
  );
};

export default FeatureIntroduction;
