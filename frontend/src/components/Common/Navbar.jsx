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
import { useGetProfileQuery } from "../../actions/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./navbar.css";

const { Title } = Typography;
const { Search } = Input;

const Navbar = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user profile!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [isError]);

  useEffect(() => {
    // Apply theme to body on mount and update
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);

  const handleSearch = (value) => {
    if (value) {
      toast.info(`Searching for "${value}"`, {
        position: "top-right",
        autoClose: 2000,
      });
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
    toast.info(`Switched to ${!isDarkMode ? "Dark" : "Light"} mode`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const userMenu = (
    <Menu className="navbar-user-menu">
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <a href={`/u/${user?._id}`} aria-label="View my profile">
          Profile
        </a>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <a href="/settings" aria-label="Account settings">
          Settings
        </a>
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
    >
      <a href="/films" className="navbar-link" aria-label="Films page">
        Films
      </a>
      <a href="/groups" className="navbar-link" aria-label="Groups page">
        Groups
      </a>
      <a href="/about" className="navbar-link" aria-label="About page">
        About
      </a>
      <a href="/contact" className="navbar-link" aria-label="Contact page">
        Contact
      </a>
    </Space>
  );

  return (
    <nav
      className={`navbar ${isDarkMode ? "dark" : "light"}`}
      aria-label="Main navigation"
    >
      {/* Left: Logo & Menu Icon */}
      <Space size="middle" className="navbar-left">
        <Button
          className="navbar-mobile-menu"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="Open navigation menu"
        />
        <Title level={4} className="navbar-logo">
          <a href="/" aria-label="Cinenotes Homepage">
            Cinenotes
          </a>
        </Title>
      </Space>

      {/* Center: Search & Nav Links */}
      <Space size="large" className="navbar-center">
        {navLinks}
        <Search
          placeholder="Search movies, groups, users..."
          onSearch={handleSearch}
          className="navbar-search"
          aria-label="Search movies, groups, or users"
          enterButton={<SearchOutlined />}
        />
      </Space>

      {/* Right: Actions */}
      <Space size="middle" className="navbar-actions">
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          aria-label={`Toggle ${isDarkMode ? "light" : "dark"} theme`}
        />
        {!isLoading && !user && (
          <>
            <Button
              href="/login"
              icon={<LoginOutlined />}
              className="navbar-button"
              aria-label="Log in"
            >
              Log In
            </Button>
            <Button
              href="/signup"
              type="primary"
              className="navbar-button"
              aria-label="Sign up"
            >
              Sign Up
            </Button>
          </>
        )}
        {!isLoading && user && (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button
              icon={
                user.avatarUrl ? (
                  <Avatar
                    src={user.avatarUrl}
                    alt={`Avatar of ${user.username}`}
                  />
                ) : (
                  <UserOutlined />
                )
              }
              className="navbar-button navbar-user"
              aria-label={`User menu for ${user.username}`}
            >
              {user.username}
            </Button>
          </Dropdown>
        )}
      </Space>

      {/* Mobile Drawer */}
      <Drawer
        title="Cinenotes"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="navbar-drawer"
        aria-label="Mobile navigation menu"
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Search
            placeholder="Search movies, groups, users..."
            onSearch={handleSearch}
            className="navbar-search"
            aria-label="Search movies, groups, or users"
            enterButton={<SearchOutlined />}
          />
          {navLinks}
          {!isLoading && !user && (
            <>
              <Button
                href="/login"
                icon={<LoginOutlined />}
                className="navbar-button"
                block
                aria-label="Log in"
              >
                Log In
              </Button>
              <Button
                href="/signup"
                type="primary"
                className="navbar-button"
                block
                aria-label="Sign up"
              >
                Sign Up
              </Button>
            </>
          )}
          {!isLoading && user && (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                href={`/u/${user?._id}`}
                icon={<ProfileOutlined />}
                className="navbar-button"
                block
                aria-label="View profile"
              >
                Profile
              </Button>
              <Button
                href="/settings"
                icon={<SettingOutlined />}
                className="navbar-button"
                block
                aria-label="Account settings"
              >
                Settings
              </Button>
              <Button
                icon={<LogoutOutlined />}
                className="navbar-button"
                block
                onClick={handleLogout}
                aria-label="Log out"
              >
                Logout
              </Button>
            </Space>
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
