import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../actions/userApi";
import { toast } from "react-toastify";
import {
  FiHome,
  FiGrid,
  FiDollarSign,
  FiMoreHorizontal,
  FiSearch,
  FiX,
  FiUser,
  FiLogOut,
  FiBookmark,
  FiSettings,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import PropTypes from "prop-types";
import logo from "../../img/logo.png";
const navItems = [
  { label: "Home", path: "/" },
  {
    label: "Catalog",
    dropdown: [{ label: "Films", path: "/films" }],
  },
  { label: "Lists", path: "/lists" },
  { label: "Members", path: "/members" },
  { label: "Groups", path: "/groups" },
  { label: "Newsroom", path: "/newsroom" },
];

const Header = ({
  logoSrc = logo,
  logoAlt = "Cinenotes Logo",
  enableThemeToggle = true,
}) => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Check if current route is an auth page
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    if (isError && !isAuthPage) {
      toast.error("Failed to fetch user profile!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [isError, isAuthPage]);

  useEffect(() => {
    if (!isAuthPage) {
      document.body.className = isDarkMode ? "dark-theme" : "light-theme";
    }
  }, [isDarkMode, isAuthPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"`, {
        position: "top-right",
        autoClose: 2000,
      });
      setSearchQuery("");
      setIsSearchOpen(false);
      // Implement search logic (e.g., navigate to /search?q=${query})
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  if (isAuthPage) {
    return (
      <header className="header header--auth">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="header__content">
                <Link to="/" className="header__logo">
                  <img src={logoSrc} alt={logoAlt} />
                </Link>
                <div className="header__auth">
                  {location.pathname === "/login" ? (
                    <Link to="/signup" className="header__sign-in">
                      Sign Up
                    </Link>
                  ) : (
                    <Link to="/login" className="header__sign-in">
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">
              <Link to="/" className="header__logo">
                <img style={{ height: "50px" }} src={logoSrc} alt={logoAlt} />
              </Link>

              <ul
                className={`header__nav ${
                  drawerVisible ? "header__nav--active" : ""
                }`}
              >
                {navItems.map((item, index) => (
                  <li key={index} className="header__nav-item">
                    {item.path ? (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `header__nav-link ${
                            isActive ? "header__nav-link--active" : ""
                          }`
                        }
                        end
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <>
                        <button
                          className="header__nav-link"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          {item.label} <FiChevronDown />
                        </button>
                        <ul className="dropdown-menu header__dropdown-menu">
                          {item.dropdown.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link to={subItem.path}>{subItem.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="header__auth">
                <form
                  onSubmit={handleSearch}
                  className={`header__search ${
                    isSearchOpen ? "header__search--active" : ""
                  }`}
                >
                  <input
                    className="header__search-input"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="header__search-button" type="submit">
                    <FiSearch />
                  </button>
                  <button
                    className="header__search-close"
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <FiX />
                  </button>
                </form>

                <button
                  className="header__search-btn"
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <FiSearch />
                </button>

                {isLoading ? (
                  <span>Loading...</span>
                ) : user ? (
                  <div className="header__profile">
                    <button
                      className="header__sign-in header__sign-in--user"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <FiUser />
                      <span>{user.nickname || "User"}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end header__dropdown-menu header__dropdown-menu--user">
                      <li>
                        <Link to={`/u/${user?._id}`}>
                          <FiUser /> Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/favorites">
                          <FiBookmark /> Favorites
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings">
                          <FiSettings /> Settings
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout}>
                          <FiLogOut /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="header__auth-links">
                    <Link to="/login" className="header__sign-in">
                      Login
                    </Link>
                    <Link to="/signup" className="header__sign-in">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              <button
                className="header__btn"
                type="button"
                onClick={toggleDrawer}
                aria-label="Toggle navigation"
              >
                <FiMenu />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
  enableThemeToggle: PropTypes.bool,
};

export default Header;
