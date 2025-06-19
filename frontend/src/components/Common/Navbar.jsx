import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Typography,
  Avatar,
  Drawer,
  Input,
  Switch,
  Dropdown,
  Menu,
  Skeleton,
} from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  MenuOutlined,
  SearchOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../actions/userApi";
import { toast } from "react-toastify";
import "./navbar.css";
import { useLogoutMutation } from "../../actions/authApi";

const { Title } = Typography;
const { Search } = Input;

const Navbar = () => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery();
  const [logout] = useLogoutMutation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(
        error?.data?.error || "Failed to fetch profile. Please log in again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
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

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      toast.success(`Searching for "${value}"`, { autoClose: 2000 });
      setDrawerVisible(false);
    } else {
      toast.warn("Please enter a search term.", { autoClose: 2000 });
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("token");
      toast.success("Logged out successfully!", { autoClose: 1000 });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.error || "Logout failed.", { autoClose: 3000 });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    toast.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, {
      autoClose: 1000,
    });
  };

  const displayName = user?.username?.includes("@")
    ? user?.email?.split("@")[0] || user?._id || "User"
    : user?.username || "User";

  const userMenu = (
    <Menu className="custom-user-menu">
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <Link to={`/u/${user?._id || "unknown"}`} aria-label="View profile">
          Profile
        </Link>
      </Menu.Item>
      {user?.isFilmmaker && (
        <Menu.Item key="portfolio" icon={<ProfileOutlined />}>
          <Link to="/portfolio" aria-label="View filmmaker portfolio">
            Portfolio
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings" aria-label="Settings">
          Settings
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const navLinks = (
    <Space
      size="large"
      direction={drawerVisible ? "vertical" : "horizontal"}
      className="navbar-links"
      role="navigation"
      aria-label="Main navigation links"
    >
      <Link to="/lists" className="navbar-link" aria-label="Lists">
        Lists
      </Link>
      <Link to="/films" className="navbar-link" aria-label="Films">
        Films
      </Link>
      <Link to="/groups" className="navbar-link" aria-label="Groups">
        Groups
      </Link>
      <Link to="/members" className="navbar-link" aria-label="Members">
        Members
      </Link>
      <Link to="/box-office" className="navbar-link" aria-label="Box Office">
        Box Office
      </Link>
    </Space>
  );

  return (
    <nav className="navbar" role="navigation" aria-label="Primary navigation">
      {/* Left: Logo & Menu */}
      <Space size="middle" className="navbar-left">
        <Button
          className="navbar-mobile-menu"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="Open menu"
        />
        <Title level={4} className="navbar-logo">
          <Link to="/" aria-label="Cinenotes Homepage">
            Cinenotes
          </Link>
        </Title>
      </Space>

      {/* Center: Links & Search */}
      <Space size="large" className="navbar-center">
        {navLinks}
        <Search
          placeholder="Search films, groups, blogs..."
          onSearch={handleSearch}
          className="navbar-search"
          aria-label="Search"
          enterButton={<SearchOutlined />}
          loading={isLoading}
        />
      </Space>

      {/* Right: Actions */}
      <Space size="middle" className="navbar-actions">
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          aria-label={`Toggle ${isDarkMode ? "light" : "dark"} theme`}
        />
        {isLoading ? (
          <Skeleton.Avatar active size="small" />
        ) : isError ? (
          <Button href="/login" icon={<LoginOutlined />} aria-label="Log in">
            Log In
          </Button>
        ) : user ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button
              className="navbar-user"
              icon={
                user.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    alt={`${displayName}'s avatar`}
                  />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )
              }
              aria-label={`User menu for ${displayName}`}
            >
              {displayName}
            </Button>
          </Dropdown>
        ) : (
          <>
            <Button href="/login" icon={<LoginOutlined />} aria-label="Log in">
              Log In
            </Button>
            <Button href="/signup" className="button" aria-label="Sign up">
              Sign Up
            </Button>
          </>
        )}
      </Space>

      {/* Mobile Drawer */}
      <Drawer
        title="Cinenotes"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="navbar-drawer"
        aria-label="Mobile menu"
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Search
            placeholder="Search films, groups, blogs..."
            onSearch={handleSearch}
            aria-label="Search"
            enterButton={<SearchOutlined />}
          />
          {navLinks}
          {isLoading ? (
            <Skeleton.Button active block />
          ) : isError ? (
            <>
              <Button
                href="/login"
                icon={<LoginOutlined />}
                block
                aria-label="Log in"
              >
                Log In
              </Button>
              <Button
                href="/signup"
                className="button"
                block
                aria-label="Sign up"
              >
                Sign Up
              </Button>
            </>
          ) : user ? (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                icon={<ProfileOutlined />}
                block
                onClick={() => {
                  navigate(`/u/${user._id || "unknown"}`);
                  setDrawerVisible(false);
                }}
                aria-label="Profile"
              >
                Profile
              </Button>
              {user.isFilmmaker && (
                <Button
                  icon={<ProfileOutlined />}
                  block
                  onClick={() => {
                    navigate("/portfolio");
                    setDrawerVisible(false);
                  }}
                  aria-label="Portfolio"
                >
                  Portfolio
                </Button>
              )}
              <Button
                icon={<SettingOutlined />}
                block
                onClick={() => {
                  navigate("/settings");
                  setDrawerVisible(false);
                }}
                aria-label="Settings"
              >
                Settings
              </Button>
              <Button
                icon={<LogoutOutlined />}
                block
                onClick={() => {
                  handleLogout();
                  setDrawerVisible(false);
                }}
                aria-label="Logout"
              >
                Logout
              </Button>
            </Space>
          ) : (
            <>
              <Button
                href="/login"
                icon={<LoginOutlined />}
                block
                aria-label="Log in"
              >
                Log In
              </Button>
              <Button
                href="/signup"
                className="button"
                block
                aria-label="Sign up"
              >
                Sign Up
              </Button>
            </>
          )}
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            aria-label={`Toggle ${isDarkMode ? "light" : "dark"} theme`}
          />
        </Space>
      </Drawer>
    </nav>
  );
};

export default Navbar;
