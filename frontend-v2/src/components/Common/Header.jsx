import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  message,
  Dropdown,
  Menu,
  Button,
  Drawer,
  Input,
  List,
  Spin,
} from "antd";
import Avatar from "react-avatar"; // Import react-avatar
import { useLogoutMutation } from "../../actions/authApi";
import { useGetProfileQuery } from "../../actions/userApi";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";
import logo from "../../assets/img/logo/logo.png";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FaFilm } from "react-icons/fa";

const Header = () => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );
  const [genres, setGenres] = useState([]);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Fetch genres for Categories dropdown
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres.slice(0, 6) || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres", 2);
      }
    };
    fetchGenres();
  }, []);

  // Handle profile fetch errors
  useEffect(() => {
    if (isError) {
      message.error(
        error?.data?.error || "Failed to fetch profile. Please log in again.",
        3
      );
    }
  }, [isError, error]);

  // Handle theme toggle
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchValue.trim()) {
        try {
          const response = await getMoviesFromAPI(searchValue, {}, 1);
          setSearchResults(response.movies.slice(0, 3) || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
          message.error("Failed to fetch search results", 2);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [searchValue]);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setRecentSearches((prev) => {
        const updated = [
          searchValue,
          ...prev.filter((s) => s !== searchValue),
        ].slice(0, 4);
        return updated;
      });
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      message.success(`Searching for "${searchValue}"`, 2);
      setSearchValue("");
      setIsSearchDrawerOpen(false);
      setMobileMenuVisible(false);
    } else {
      message.warning("Please enter a search term.", 2);
    }
  };

  const handleRemoveRecentSearch = (term) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("token");
      message.success("Logged out successfully!", 2);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      message.error(
        err?.data?.message || "Logout failed. Please try again.",
        3
      );
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    message.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, 1);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible((prev) => !prev);
  };

  const toggleSearchDrawer = () => {
    setIsSearchDrawerOpen((prev) => !prev);
    if (!isSearchDrawerOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const displayName = user?.username?.includes("@")
    ? user?.email?.split("@")[0] || user?._id || "User"
    : user?.username || "User";

  // User Dropdown Menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to={`/u/${user?._id || "unknown"}`}>
          <UserOutlined style={{ marginRight: 8 }} />
          Profile
        </Link>
      </Menu.Item>
      {user?.isFilmmaker && (
        <Menu.Item key="portfolio">
          <Link to="/portfolio">
            <FaFilm style={{ marginRight: 8 }} />
            Portfolio
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="settings">
        <Link to="/settings">
          <SettingOutlined style={{ marginRight: 8 }} />
          Settings
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} disabled={isLoading}>
        <LogoutOutlined style={{ marginRight: 8 }} />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Menu.Item>
    </Menu>
  );

  // Guest Dropdown Menu
  const guestMenu = (
    <Menu>
      <Menu.Item key="login">
        <Link to="/login">
          <LoginOutlined style={{ marginRight: 8 }} />
          Login
        </Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link to="/register">
          <UserAddOutlined style={{ marginRight: 8 }} />
          Register
        </Link>
      </Menu.Item>
    </Menu>
  );

  // Categories Dropdown Menu
  const categoriesMenu = (
    <Menu>
      {genres.map((genre) => (
        <Menu.Item key={genre.id}>
          <Link to={`/explore?genre=${encodeURIComponent(genre.name)}`}>
            {genre.name}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <header>
      <div className="mn-header">
        <div className="mn-header-items">
          {/* Left Header */}
          <div className="left-header">
            <Link to="/" className="logo">
              <img src={logo} alt="DimeCine logo" />
            </Link>
          </div>

          {/* Center Search Input */}
          <div className="center-header d-none d-lg-flex align-items-center">
            <form onSubmit={handleSearch} style={{ width: "300px" }}>
              <Input
                placeholder="Search movies..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={toggleSearchDrawer}
                ref={searchInputRef}
              />
            </form>
          </div>

          {/* Right Header */}
          <div className="right-header">
            {/* Desktop Main Menu */}
            <div
              id="mn-main-menu-desk"
              className="d-none d-lg-block sticky-nav"
            >
              <div className="nav-desk">
                <div className="row">
                  <div className="col-md-12 align-self-center">
                    <div className="mn-main-menu">
                      <ul
                        style={{
                          display: "flex",
                          listStyle: "none",
                          padding: 0,
                        }}
                      >
                        <li className="non-drop">
                          <Link to="/box-office">Box Office</Link>
                        </li>
                        <li className="non-drop">
                          <Link to="/explore">Explore Films</Link>
                        </li>
                        <li className="non-drop">
                          <Link to="/categories"> Categories</Link>
                        </li>
                        <li>
                          {isLoading ? (
                            <Spin size="small" />
                          ) : user ? (
                            <Dropdown overlay={userMenu} trigger={["click"]}>
                              <a
                                onClick={(e) => e.preventDefault()}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar
                                  name={displayName}
                                  src={user?.avatar}
                                  size={32}
                                  round
                                  style={{ marginRight: 8 }}
                                />
                                <span className="d-none d-md-inline">
                                  {displayName}
                                </span>
                              </a>
                            </Dropdown>
                          ) : (
                            <Dropdown overlay={guestMenu} trigger={["click"]}>
                              <a
                                onClick={(e) => e.preventDefault()}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar
                                  name="Guest"
                                  size={32}
                                  round
                                  color="#6c757d"
                                  style={{ marginRight: 8 }}
                                />
                                <span className="d-none d-md-inline">
                                  Sign In
                                </span>
                              </a>
                            </Dropdown>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Drawer */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Search</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={toggleSearchDrawer}
            />
          </div>
        }
        placement="right"
        open={isSearchDrawerOpen}
        onClose={toggleSearchDrawer}
        width={350}
        className="mn-side-search"
      >
        <div style={{ padding: "0 8px" }}>
          {/* Search Input */}
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search movies..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              ref={searchInputRef}
            />
          </form>

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={searchResults}
              renderItem={(movie) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    >
                      View
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={64}
                        src={
                          movie.poster_path || "/assets/imgs/placeholder.png"
                        }
                      />
                    }
                    title={
                      <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                    }
                    description={
                      <>
                        <Link
                          to={`/explore?genre=${encodeURIComponent(
                            movie.genres?.[0]?.name || ""
                          )}`}
                        >
                          {movie.genres?.[0]?.name || "N/A"}
                        </Link>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}{" "}
                          - {movie.vote_count || 0} votes
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <p style={{ color: "#888", textAlign: "center" }}>
              No results found.
            </p>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4>Recently Searched</h4>
              <List
                size="small"
                dataSource={recentSearches}
                renderItem={(term) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        danger
                        onClick={() => handleRemoveRecentSearch(term)}
                      >
                        ×
                      </Button>,
                    ]}
                  >
                    <Link
                      to={`/search?q=${encodeURIComponent(term)}`}
                      onClick={() => setSearchValue(term)}
                    >
                      {term}
                    </Link>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
