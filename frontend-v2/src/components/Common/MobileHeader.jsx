import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd"; // Use antd only for message
import { useLogoutMutation } from "../../actions/authApi";
import logo from "../../assets/img/logo/logo.png";
import { useGetProfileQuery } from "../../actions/userApi";

const socialMedia = [
  {
    label: "GitHub",
    icon: <img src="/assets/imgs/theme/icons/icon-github.svg" alt="GitHub" />,
    url: "https://github.com/Dhruvermafz/silverscreen",
  },
  {
    label: "Twitter",
    icon: (
      <img
        src="/assets/imgs/theme/icons/icon-twitter-white.svg"
        alt="Twitter"
      />
    ),
    url: "https://twitter.com/DimeCine",
  },
  {
    label: "Instagram",
    icon: (
      <img
        src="/assets/imgs/theme/icons/icon-instagram-white.svg"
        alt="Instagram"
      />
    ),
    url: "https://instagram.com/DimeCine",
  },
  {
    label: "Email",
    icon: <img src="/assets/imgs/theme/icons/icon-email-2.svg" alt="Email" />,
    url: `mailto:${
      process.env.REACT_APP_SUPPORT_EMAIL || "support@DimeCine.com"
    }`,
  },
];

const MobileHeader = () => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery();
  const [logout] = useLogoutMutation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      message.error(
        error?.data?.error || "Failed to fetch profile. Please log in again.",
        3
      );
    }
  }, [isError, error]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      message.success(`Searching for "${searchValue}"`, 2);
      setSearchValue("");
      setDrawerVisible(false);
    } else {
      message.warning("Please enter a search term.", 2);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("token");
      message.success("Logged out successfully!", 1);
      navigate("/dashboard");
      setDrawerVisible(false);
    } catch (err) {
      message.error(err?.data?.error || "Logout failed.", 3);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    message.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, 1);
  };

  const displayName = user?.username?.includes("@")
    ? user?.email?.split("@")[0] || user?._id || "User"
    : user?.username || "User";

  return (
    <div className="mobile-header-active mobile-header-wrapper-style">
      <div className="mobile-header-wrapper-inner">
        <div className="mobile-header-top d-flex align-items-center justify-content-between">
          <div className="mobile-header-logo">
            <Link to="/">
              <img src={logo} alt="DimeCine logo" />
            </Link>
          </div>
          <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mobileMenu"
              aria-controls="mobileMenu"
              aria-expanded={drawerVisible}
              aria-label="Toggle navigation"
              onClick={() => setDrawerVisible(!drawerVisible)}
            >
              <span className="icon-top"></span>
              <span className="icon-bottom"></span>
            </button>
          </div>
        </div>
        <div
          className={`collapse navbar-collapse ${drawerVisible ? "show" : ""}`}
          id="mobileMenu"
        >
          <div className="mobile-header-content-area">
            <div className="mobile-search search-style-3 mobile-header-border mb-3">
              <form onSubmit={handleSearch} className="d-flex">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="form-control me-2"
                  aria-label="Search movies"
                />
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
            <div className="mobile-menu-wrap mobile-header-border">
              <nav>
                <ul className="mobile-menu font-heading nav flex-column">
                  <li className="nav-item">
                    <Link to="/lists" className="nav-link" aria-label="Lists">
                      Lists
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/films" className="nav-link" aria-label="Films">
                      Films
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/groups" className="nav-link" aria-label="Groups">
                      Groups
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/members"
                      className="nav-link"
                      aria-label="Members"
                    >
                      Members
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/box-office"
                      className="nav-link"
                      aria-label="Box Office"
                    >
                      Box Office
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={toggleTheme}
                      className="nav-link w-100 text-start"
                      aria-label={
                        isDarkMode
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      <i
                        className={
                          isDarkMode ? "bi bi-sun me-2" : "bi bi-moon me-2"
                        }
                      ></i>
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                  </li>
                  {isLoading ? (
                    <li className="nav-item">
                      <span className="nav-link">Loading...</span>
                    </li>
                  ) : user ? (
                    <>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to={`/u/${user?._id || "unknown"}`}
                        >
                          <i className="bi bi-person-circle me-2"></i> Profile (
                          {displayName})
                        </Link>
                      </li>
                      {user?.isFilmmaker && (
                        <li className="nav-item">
                          <Link className="nav-link" to="/portfolio">
                            <i className="bi bi-film me-2"></i> Portfolio
                          </Link>
                        </li>
                      )}
                      <li className="nav-item">
                        <Link className="nav-link" to="/settings">
                          <i className="bi bi-gear me-2"></i> Settings
                        </Link>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link w-100 text-start"
                          onClick={handleLogout}
                          aria-label="Logout"
                        >
                          <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="nav-item">
                      <Link
                        to="/login"
                        className="nav-link"
                        aria-label="Sign in"
                      >
                        <i className="bi bi-person me-2"></i> Log In / Sign Up
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
            <div className="mobile-header-info-wrap mt-3">
              <div className="single-mobile-header-info">
                <Link to="/contact" className="d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2"></i> Contact Us
                </Link>
              </div>
              <div className="single-mobile-header-info">
                <a href="tel:+1234567890" className="d-flex align-items-center">
                  <i className="bi bi-headset me-2"></i> (+01) - 2345 - 6789
                </a>
              </div>
            </div>
            <div className="mobile-social-icon mb-50">
              <h6 className="mb-15">Follow Us</h6>
              {socialMedia.map((item, index) => (
                <a key={index} href={item.url} aria-label={item.label}>
                  {item.icon}
                </a>
              ))}
            </div>
            <div className="site-copyright">
              Copyright {new Date().getFullYear()} © DimeCine. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
