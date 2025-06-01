import React from "react";
import { FiFilm, FiMessageCircle, FiStar } from "react-icons/fi";
import { Container, Row, Col, Card } from "react-bootstrap";

const ProfileStats = ({ userData, reviews }) => {
  const stats = [
    {
      label: "Films watched",
      value: userData?.favoriteMovies?.length || 0,
      icon: <FiFilm />,
    },
    { label: "Your comments", value: "N/A", icon: <FiMessageCircle /> }, // Update if comments data is available
    { label: "Your reviews", value: reviews?.length || 0, icon: <FiStar /> },
  ];

  return (
    <Container>
      <Row>
        {stats.map((stat, index) => (
          <Col xs={12} md={6} xl={3} key={index} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <div className="mb-2" style={{ fontSize: "1.5rem" }}>
                  {stat.icon}
                </div>
                <Card.Title as="h5" className="mb-1">
                  {stat.value}
                </Card.Title>
                <Card.Text className="text-muted">{stat.label}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProfileStats;
