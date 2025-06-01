import React from "react";
import { FiPlay, FiBookmark } from "react-icons/fi";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom"; // For client-side routing
import coverImage from "../../img/covers/cover.jpg"; // Adjust path as needed
import Pagination from "../Common/Pagination"; // Adjust path as needed

const FavoritesList = ({
  favoriteMovies,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Container>
      <Row>
        {Array.isArray(favoriteMovies) && favoriteMovies.length > 0 ? (
          favoriteMovies.map((item) => (
            <Col xs={6} sm={4} lg={3} xl={2} key={item.id} className="mb-4">
              <Card className="h-100">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={item.poster || coverImage}
                    alt={item.title}
                  />
                  <Link
                    to={`/details/${item.id}`}
                    className="position-absolute top-50 start-50 translate-middle"
                  >
                    <Button variant="light" className="rounded-circle p-2">
                      <FiPlay size={24} />
                    </Button>
                  </Link>
                  <span
                    className="position-absolute top-0 end-0 bg-success text-white p-1 rounded m-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {item.rating || "N/A"}
                  </span>
                  <Button
                    variant="link"
                    className="position-absolute bottom-0 end-0 p-2"
                    style={{ color: "#fff" }}
                  >
                    <FiBookmark size={20} />
                  </Button>
                </div>
                <Card.Body>
                  <Card.Title as="h3" className="mb-2">
                    <Link
                      to={`/details/${item.id}`}
                      className="text-decoration-none"
                    >
                      {item.title}
                    </Link>
                  </Card.Title>
                  <div className="text-muted">
                    {(item.categories || []).map((category, index) => (
                      <Link
                        to={`/category/${category.toLowerCase()}`}
                        key={index}
                        className="text-muted me-2 text-decoration-none"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <p className="text-center">No favorite movies available</p>
          </Col>
        )}
      </Row>
      <Row>
        <Col xs={12} className="d-flex justify-content-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default FavoritesList;
