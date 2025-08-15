import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";

const quickLinks = [
  { label: "Films", path: "/films" },
  { label: "Groups", path: "/groups" },
  { label: "Box Office", path: "/box-office" },
  { label: "Reviews", path: "/reviews" }, // Added Reviews to align with Header
  { label: "About", path: "/about" },
];

const socialMedia = [
  {
    label: "GitHub",
    icon: <i className="ri-github-fill"></i>,
    url: "https://github.com/Dhruvermafz/silverscreen",
  },
  {
    label: "Twitter",
    icon: <i className="ri-twitter-fill"></i>,
    url: "https://twitter.com/DimeCine",
  },
  {
    label: "Instagram",
    icon: <i className="ri-instagram-line"></i>,
    url: "https://instagram.com/DimeCine",
  },
  {
    label: "Email",
    icon: <i className="ri-mail-line"></i>,
    url: `mailto:${
      process.env.REACT_APP_SUPPORT_EMAIL || "support@DimeCine.com"
    }`,
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  // Fetch genres for the footer
  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres.slice(0, 6) || []); // Limit to 6 genres
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres", 2);
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Handle theme toggle
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error("Please enter a valid email address!", 2);
      return;
    }
    try {
      // Placeholder for newsletter subscription API call
      message.success("Thank you for subscribing to DimeCine!", 2);
      setEmail("");
    } catch (err) {
      message.error("Failed to subscribe. Please try again.", 2);
    }
  };

  const handleSearchToggle = () => {
    navigate("/search");
    message.info("Redirected to search page", 2);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    message.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, 1);
  };

  return (
    <>
      {/* Footer Navigation for Mobile */}
      <div className="mn-footer-nav">
        <ul>
          <li>
            <a
              href="javascript:void(0)"
              className="mn-main-search mn-search-toggle"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <i class="ri-search-fill"></i>
            </a>
          </li>
          <li>
            <Link to="/login" className="mn-main-user" aria-label="Login">
              <i class="ri-account-circle-fill"></i>
            </Link>
          </li>
          <li>
            <Link to="/" className="mn-toggle-menu" aria-label="Home">
              <i class="ri-home-6-fill"></i>
            </Link>
          </li>
          <li>
            <Link to="/films" className="mn-main-user" aria-label="Films">
              <i class="ri-clapperboard-fill"></i>
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer Content */}
      <footer className="m-t-15 mn-footer">
        <div className="footer-container">
          <div className="footer-top p-tb-30">
            <div className="row m-minus-991">
              <div className="col-sm-12 col-lg-3 mn-footer-cat">
                <div className="mn-footer-widget mn-footer-company">
                  <Link to="/">
                    <img
                      src="/assets/imgs/theme/logo.svg"
                      className="mn-footer-logo"
                      alt="DimeCine logo"
                    />
                    <img
                      src="/assets/imgs/theme/logo-dark.svg"
                      className="mn-footer-dark-logo"
                      alt="DimeCine dark logo"
                    />
                  </Link>
                  <p className="mn-footer-detail">
                    DimeCine is your ultimate destination for movie reviews and
                    community engagement. Discover films, share reviews, and
                    connect with cinephiles.
                  </p>
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="d-flex mt-3"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control me-2"
                      aria-label="Newsletter email"
                    />
                    <button type="submit" className="mn-btn-1">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-sm-12 col-lg-2 mn-footer-info">
                <div className="mn-footer-widget">
                  <h4 className="mn-footer-heading">Quick Links</h4>
                  <div className="mn-footer-links mn-footer-dropdown">
                    <ul className="align-items-center">
                      {quickLinks.map((link, index) => (
                        <li key={index} className="mn-footer-link">
                          <Link to={link.path}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-lg-2 mn-footer-account">
                <div className="mn-footer-widget">
                  <h4 className="mn-footer-heading">Explore Genres</h4>
                  <div className="mn-footer-links mn-footer-dropdown">
                    {loadingGenres ? (
                      <div className="text-center">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : genres.length === 0 ? (
                      <p className="text-muted">No genres available.</p>
                    ) : (
                      <ul className="align-items-center">
                        {genres.map((genre) => (
                          <li key={genre.id} className="mn-footer-link">
                            <Link to={`/genres/${genre.id}`}>{genre.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-lg-2 mn-footer-service">
                <div className="mn-footer-widget">
                  <h4 className="mn-footer-heading">Account</h4>
                  <div className="mn-footer-links mn-footer-dropdown">
                    <ul className="align-items-center">
                      <li className="mn-footer-link">
                        <Link to="/login">Sign In</Link>
                      </li>
                      <li className="mn-footer-link">
                        <Link to="/register">Register</Link>
                      </li>
                      <li className="mn-footer-link">
                        <Link to="/faq">Help & Support</Link>
                      </li>
                      <li className="mn-footer-link">
                        <Link to="/terms">Terms of Use</Link>
                      </li>
                      <li className="mn-footer-link">
                        <Link to="/privacy">Privacy Policy</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-lg-3 mn-footer-cont-social">
                <div className="mn-footer-contact">
                  <div className="mn-footer-widget">
                    <h4 className="mn-footer-heading">Contact</h4>
                    <div className="mn-footer-links mn-footer-dropdown">
                      <ul className="align-items-center">
                        <li className="mn-footer-link mn-foo-location">
                          <span className="mt-15px">
                            <i className="ri-map-pin-line"></i>
                          </span>
                          <p>
                            1234 Elm Street, Springfield Avenue, Brooklyn, NY
                            11201, USA
                          </p>
                        </li>
                        <li className="mn-footer-link mn-foo-call">
                          <span>
                            <i className="ri-whatsapp-line"></i>
                          </span>
                          <a href="tel:+12025550123">+1 (202) 555-0123</a>
                        </li>
                        <li className="mn-footer-link mn-foo-mail">
                          <span>
                            <i className="ri-mail-line"></i>
                          </span>
                          <a
                            href={`mailto:${
                              process.env.REACT_APP_SUPPORT_EMAIL ||
                              "support@DimeCine.com"
                            }`}
                          >
                            {process.env.REACT_APP_SUPPORT_EMAIL ||
                              "support@DimeCine.com"}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mn-footer-social">
                  <div className="mn-footer-widget">
                    <div className="mn-footer-links mn-footer-dropdown">
                      <ul className="align-items-center">
                        {socialMedia.map((item, index) => (
                          <li key={index} className="mn-footer-link">
                            <a href={item.url} aria-label={item.label}>
                              {item.icon}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="row">
              <div className="mn-bottom-info">
                <div className="footer-copy">
                  <div className="footer-bottom-copy">
                    <div className="mn-copy">
                      Copyright © {new Date().getFullYear()}{" "}
                      <Link to="/" className="site-name">
                        DimeCine
                      </Link>{" "}
                      all rights reserved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
