import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  message,
  Input,
  Drawer,
  List,
  Avatar,
  Button,
  Space,
  Dropdown,
  Badge,
  Spin,
  Card,
  Tag,
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  HeartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { FaFilm } from "react-icons/fa";

import { useLogoutMutation } from "../../actions/authApi";
import { useGetProfileQuery } from "../../actions/userApi";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";

import logo from "../../assets/img/logo/logo.png";

const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const { data: user, isLoading: loadingUser } = useGetProfileQuery();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches") || "[]"),
  );

  // Live search with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchValue.trim()) {
        try {
          const res = await getMoviesFromAPI(searchValue, {}, 1);
          setSearchResults(res.movies?.slice(0, 6) || []);
        } catch {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const addRecentSearch = (term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      8,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const removeRecentSearch = (term) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (value) => {
    const term = value.trim();
    if (!term) return;
    addRecentSearch(term);
    navigate(`/explore?q=${encodeURIComponent(term)}`);
    setSearchValue("");
    setSearchDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      message.success("Logged out successfully");
      navigate("/login");
    } catch {
      message.error("Logout failed");
    }
  };

  const displayName = user?.username || user?.email?.split("@")[0] || "User";

  // User Menu (kept bg-white)
  const userMenu = (
    <div
      className="p-4 bg-white rounded-lg shadow-lg"
      style={{ minWidth: 220 }}
    >
      <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
        <Avatar size={56} src={user?.avatar} name={displayName} />
        <div>
          <div className="fw-bold">{displayName}</div>
          <small className="text-muted">{user?.email}</small>
        </div>
      </div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          block
          type="text"
          icon={<UserOutlined />}
          onClick={() => navigate(`/u/${user?._id}`)}
        >
          My Profile
        </Button>
        {user?.isFilmmaker && (
          <Button
            block
            type="text"
            icon={<FaFilm />}
            onClick={() => navigate("/portfolio")}
          >
            My Portfolio
          </Button>
        )}
        <Button
          block
          type="text"
          icon={<HeartOutlined />}
          onClick={() => navigate("/lists")}
        >
          My Lists
        </Button>
        <Button
          block
          type="text"
          icon={<TeamOutlined />}
          onClick={() => navigate("/groups")}
        >
          My Communities
        </Button>
        <Button
          block
          type="text"
          icon={<SettingOutlined />}
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
        <Button
          block
          danger
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          loading={loggingOut}
        >
          Logout
        </Button>
      </Space>
    </div>
  );

  // Guest Menu
  const guestMenu = (
    <Space direction="vertical" className="p-4" style={{ minWidth: 180 }}>
      <Button block icon={<LoginOutlined />} onClick={() => navigate("/login")}>
        Login
      </Button>
      <Button
        block
        type="primary"
        icon={<UserAddOutlined />}
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </Button>
    </Space>
  );

  return (
    <>
      {/* Main Header – now light */}
      <header
        className="bg-white border-bottom border-light sticky-top shadow-sm"
        style={{ zIndex: 1000 }}
      >
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-3">
            {/* Left: Logo + Mobile Menu */}
            <div className="d-flex align-items-center gap-4">
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: "1.4rem" }} />}
                className="text-dark d-lg-none"
                onClick={() => setMobileMenuOpen(true)}
              />
              <Link to="/">
                <img src={logo} alt="DimeCine" height={40} />
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-grow-1 mx-4">
              <Search
                placeholder="Search movies, actors, communities..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                className="w-100"
                style={{ maxWidth: 600, margin: "0 auto", display: "block" }}
              />
            </div>

            {/* Right: Desktop Actions */}
            <Space
              size="middle"
              className="d-none d-lg-flex align-items-center"
            >
              <Link
                to="/explore"
                className="text-dark text-decoration-none fw-medium hover-text-primary"
              >
                Explore
              </Link>
              <Link
                to="/categories"
                className="text-dark text-decoration-none fw-medium hover-text-primary"
              >
                Categories
              </Link>
              <Link
                to="/groups"
                className="text-dark text-decoration-none fw-medium hover-text-primary"
              >
                Communities
              </Link>

              {loadingUser ? (
                <Spin />
              ) : user ? (
                <Dropdown
                  overlay={userMenu}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Badge dot={user?.notifications?.length > 0}>
                    <Avatar
                      src={user.avatar}
                      name={displayName}
                      size={40}
                      style={{ cursor: "pointer", border: "2px solid #e50914" }}
                    />
                  </Badge>
                </Dropdown>
              ) : (
                <Dropdown overlay={guestMenu} trigger={["click"]}>
                  <Avatar
                    icon={<UserOutlined />}
                    size={40}
                    style={{ background: "#6c757d", cursor: "pointer" }}
                  />
                </Dropdown>
              )}
            </Space>

            {/* Mobile Search Icon */}
            <Button
              type="text"
              icon={<SearchOutlined style={{ fontSize: "1.4rem" }} />}
              className="text-dark d-lg-none"
              onClick={() => setSearchDrawerOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer – texts/icons already adapt well */}
      <Drawer
        placement="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        closeIcon={null}
        width={280}
        headerStyle={{ display: "none" }}
      >
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h4 className="mb-0">Menu</h4>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          {user ? (
            <div className="mb-5 pb-4 border-bottom">
              <Space align="center" size="middle" className="w-100">
                <Avatar src={user.avatar} name={displayName} size={64} />
                <div>
                  <div className="fw-bold">{displayName}</div>
                  <small className="text-muted">{user.email}</small>
                </div>
              </Space>
            </div>
          ) : null}

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/explore" onClick={() => setMobileMenuOpen(false)}>
              Explore Films
            </Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>
              Categories
            </Link>
            <Link to="/groups" onClick={() => setMobileMenuOpen(false)}>
              Communities
            </Link>
            <Link to="/members" onClick={() => setMobileMenuOpen(false)}>
              Members
            </Link>

            {user ? (
              <div className="border-top pt-4">
                <Button
                  block
                  danger
                  onClick={handleLogout}
                  loading={loggingOut}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  block
                  icon={<LoginOutlined />}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  block
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Space>
        </div>
      </Drawer>

      {/* Search Drawer (Mobile) – no dark classes here */}
      <Drawer
        title="Search"
        placement="top"
        height="90vh"
        open={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
      >
        <div className="container py-4">
          <Search
            placeholder="Search movies, people, communities..."
            allowClear
            enterButton="Search"
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            autoFocus
          />

          {searchResults.length > 0 && (
            <div className="mt-5">
              <h5>Results</h5>
              <List
                grid={{ gutter: 16, xs: 2, sm: 3, md: 4 }}
                dataSource={searchResults}
                renderItem={(movie) => (
                  <List.Item
                    onClick={() => {
                      handleSearch(movie.title);
                      setSearchDrawerOpen(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={movie.title}
                          src={
                            movie.posterUrl || "/assets/imgs/placeholder.png"
                          }
                          style={{ height: 300, objectFit: "cover" }}
                        />
                      }
                    >
                      <Card.Meta title={movie.title} />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          )}

          {recentSearches.length > 0 && searchValue === "" && (
            <div className="mt-5">
              <h5>Recent Searches</h5>
              <Space wrap size={[8, 8]}>
                {recentSearches.map((term) => (
                  <Tag
                    key={term}
                    closable
                    onClose={() => removeRecentSearch(term)}
                    onClick={() => handleSearch(term)}
                    style={{ cursor: "pointer" }}
                  >
                    {term}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Header;
