import React from "react";
import { FiRefreshCw, FiStar } from "react-icons/fi";
import { Card, Table, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const LatestReviews = ({ reviews }) => {
  return (
    <Container>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h3" className="mb-0">
            <FiStar className="me-2" /> Latest Reviews
          </Card.Title>
          <div className="d-flex gap-3">
            <Button variant="link" as={Link} to="#" className="p-0">
              <FiRefreshCw size={20} />
            </Button>
            <Button
              variant="link"
              as={Link}
              to="/reviews"
              className="text-decoration-none"
            >
              View All
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>ITEM</th>
                <th>AUTHOR</th>
                <th>RATING</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reviews) && reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="text-muted">{review.id}</td>
                    <td>
                      <Link
                        to={`/details/${review.itemId}`}
                        className="text-decoration-none"
                      >
                        {review.item}
                      </Link>
                    </td>
                    <td>{review.author}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FiStar className="me-1" /> {review.rating}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No reviews available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LatestReviews;
