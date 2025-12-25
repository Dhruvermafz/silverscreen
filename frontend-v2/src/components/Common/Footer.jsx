import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import logo_dark from "../../assets/img/logo/logo_dark.png";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";
import logo from "../../assets/img/logo/logo.png";

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
            <Link to="/explore" className="mn-main-user" aria-label="Films">
              <i class="ri-clapperboard-fill"></i>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Footer;
