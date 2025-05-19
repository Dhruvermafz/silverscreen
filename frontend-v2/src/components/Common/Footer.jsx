import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";
import logo from "../../img/logo.png";
const quickLinks = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy", path: "/privacy" },
];

const Footer = ({
  logoSrc = logo,
  logoAlt = "Cinenotes Logo",
  copyrightText = `© ${new Date().getFullYear()} Cinenotes. All rights reserved.`,
  author = {
    name: "Dhruv Verma",
    url: "https://dhruvermafz.in/",
  },
}) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <Container class="container">
        <Row className="row">
          <Col xs={12} md={4} className="col-12">
            <Link to="/" className="footer__content">
              <img
                src={logoSrc}
                alt={logoAlt}
                className="footer__logo"
                style={{ maxWidth: "150px" }}
              />
            </Link>
          </Col>
          <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
            <div className="footer__copyright">
              <p className="mb-0">{copyrightText}</p>
              {author && (
                <p className="mb-0">
                  Created by{" "}
                  <a
                    href={author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    {author.name}
                  </a>
                </p>
              )}
            </div>
          </Col>
          <Col xs={12} md={4} className="text-center text-md-end">
            <Nav className="justify-content-center justify-content-md-end flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  className="footer__nav-link"
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="text-center mt-3">
            <Button
              variant="outline-primary"
              className="footer__back"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <FaArrowUp />
            </Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
  copyrightText: PropTypes.string,
  author: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
};

Footer.defaultProps = {
  logoSrc: logo,
  logoAlt: "Cinenotes Logo",
  copyrightText: `© ${new Date().getFullYear()} Cinenotes. All rights reserved.`,
  author: {
    name: "Dmitry Volkov",
    url: "https://themeforest.net/user/dmitryvolkov/portfolio",
  },
};

export default Footer;
