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
    document.body.className = isDarkMode ? "light-theme" : "dark-theme";
    toast.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const userMenu = (
    <Menu className="navbar-user-menu">
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <a href={`/u/${user?._id}`} aria-label="My Profile">
          Profile
        </a>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <a href="/settings" aria-label="Settings">
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
      size="middle"
      direction={drawerVisible ? "vertical" : "horizontal"}
      className="navbar-links"
    >
      <a href="/films" className="navbar-link" aria-label="Films">
        Films
      </a>
      <a href="/groups" className="navbar-link" aria-label="Groups">
        Groups
      </a>
      <a href="/about" className="navbar-link" aria-label="About">
        About
      </a>
    </Space>
  );

  return (
    <div className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      {/* Left: Logo & Menu Icon */}
      <Space size="middle" className="navbar-left">
        <Button
          className="navbar-mobile-menu"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="Open menu"
        />
        <Title level={4} className="navbar-logo">
          <a href="/" aria-label="Cinenotes Homepage">
            Cinenotes
          </a>
        </Title>
      </Space>

      {/* Center: Search & Nav Links */}
      <Space size="middle" className="navbar-center">
        <Search
          placeholder="Search..."
          onSearch={handleSearch}
          className="navbar-search"
          aria-label="Search movies, groups, users"
        />
        {navLinks}
      </Space>

      {/* Right: Actions */}
      <Space size="middle" className="navbar-actions">
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          aria-label="Toggle theme"
        />
        {!isLoading && !user && (
          <>
            <Button
              href="/login"
              icon={<LoginOutlined />}
              className="navbar-button"
              aria-label="Log In"
            >
              Log In
            </Button>
            <Button
              href="/signup"
              type="primary"
              className="navbar-button"
              aria-label="Sign Up"
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
                  <Avatar src={user.avatarUrl} />
                ) : (
                  <UserOutlined />
                )
              }
              className="navbar-button navbar-user"
              aria-label={`User: ${user.username}`}
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
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Search
            placeholder="Search..."
            onSearch={handleSearch}
            className="navbar-search"
            aria-label="Search movies, groups, users"
          />
          {navLinks}
          {!isLoading && !user && (
            <>
              <Button
                href="/login"
                icon={<LoginOutlined />}
                className="navbar-button"
                block
                aria-label="Log In"
              >
                Log In
              </Button>
              <Button
                href="/signup"
                type="primary"
                className="navbar-button"
                block
                aria-label="Sign Up"
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
                aria-label="Profile"
              >
                Profile
              </Button>
              <Button
                href="/settings"
                icon={<SettingOutlined />}
                className="navbar-button"
                block
                aria-label="Settings"
              >
                Settings
              </Button>
              <Button
                icon={<LogoutOutlined />}
                className="navbar-button"
                block
                onClick={handleLogout}
                aria-label="Logout"
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
            aria-label="Toggle theme"
          />
        </Space>
      </Drawer>
    </div>
  );
};

export default Navbar;
