import React from "react";
import { FiRefreshCw, FiStar } from "react-icons/fi";
import { Card, Table, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const MoviesForYou = ({ suggestedMovies }) => {
  return (
    <Container>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title as="h3" className="mb-0">
            <FiStar className="me-2" /> Movies for You
          </Card.Title>
          <div className="d-flex gap-3">
            <Button variant="link" as={Link} to="#" className="p-0">
              <FiRefreshCw size={20} />
            </Button>
            <Button
              variant="link"
              as={Link}
              to="/catalog"
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
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>RATING</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(suggestedMovies) && suggestedMovies.length > 0 ? (
                suggestedMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="text-muted">{movie.id}</td>
                    <td>
                      <Link
                        to={`/details/${movie.id}`}
                        className="text-decoration-none"
                      >
                        {movie.title}
                      </Link>
                    </td>
                    <td>{movie.category || "N/A"}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FiStar className="me-1" /> {movie.rating || "N/A"}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No suggested movies available
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

export default MoviesForYou;
