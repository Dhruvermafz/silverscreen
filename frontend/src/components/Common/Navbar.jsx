import React, { useState, useEffect } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Space,
  Typography,
  Avatar,
  Drawer,
  Tooltip,
  Input,
  Switch,
} from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  MenuOutlined,
  SearchOutlined,
  DashboardOutlined,
  MessageOutlined,
  StarOutlined,
  CalendarOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import "./navbar.css"; // Custom styles for navbar

const { Title } = Typography;
const { Search } = Input;

const Navbar = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Mock theme state

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
      // Mock search (replace with actual search logic)
      toast.info(`Searching for "${value}"`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleLogout = () => {
    // Mock logout (replace with actual logout logic)
    localStorage.removeItem("token");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Mock theme toggle (replace with actual theme logic)
    document.body.className = isDarkMode ? "light-theme" : "dark-theme";
    toast.info(`Switched to ${isDarkMode ? "Light" : "Dark"} mode`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const userMenu = (
    <Menu className="user-menu">
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <a href={`/u/${user?._id}`} aria-label="My Profile">
          My Profile
        </a>
      </Menu.Item>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <a href="/dashboard" aria-label="Dashboard">
          Dashboard
        </a>
      </Menu.Item>
      <Menu.Item key="messages" icon={<MessageOutlined />}>
        <a href="/messages" aria-label="Messages">
          Messages
        </a>
      </Menu.Item>
      <Menu.Item key="watchlist" icon={<StarOutlined />}>
        <a href="/watchlist" aria-label="Watchlist">
          Watchlist
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
      size="large"
      direction={drawerVisible ? "vertical" : "horizontal"}
      className="nav-links"
    >
      <Tooltip title="Browse movies">
        <a href="/films" className="nav-link" aria-label="Films">
          <i className="fas fa-film" /> Films
        </a>
      </Tooltip>
      <Tooltip title="Explore movie lists">
        <a href="/lists" className="nav-link" aria-label="Lists">
          <i className="fas fa-list" /> Lists
        </a>
      </Tooltip>
      <Tooltip title="Connect with members">
        <a href="/members" className="nav-link" aria-label="Members">
          <i className="fas fa-users" /> Members
        </a>
      </Tooltip>
      <Tooltip title="Join discussion groups">
        <a href="/groups" className="nav-link" aria-label="Groups">
          <i className="fas fa-user-group" /> Groups
        </a>
      </Tooltip>
      <Tooltip title="View upcoming events">
        <a href="/events" className="nav-link" aria-label="Events">
          <i className="fas fa-calendar" /> Events
        </a>
      </Tooltip>
      <Tooltip title="Read newsroom posts">
        <a href="/newsrooms" className="nav-link" aria-label="Newsrooms">
          <i className="fas fa-newspaper" /> News
        </a>
      </Tooltip>
      {drawerVisible && (
        <>
          <Search
            placeholder="Search movies, groups, users..."
            onSearch={handleSearch}
            style={{ width: "100%", margin: "8px 0" }}
            aria-label="Search"
          />
          <Space direction="vertical" style={{ width: "100%" }}>
            {!isLoading && !user && (
              <>
                <Tooltip title="Log in to your account">
                  <a href="/login" className="nav-link" aria-label="Log In">
                    <Button
                      icon={<LoginOutlined />}
                      className="nav-button login"
                      block
                    >
                      Log In
                    </Button>
                  </a>
                </Tooltip>
                <Tooltip title="Create a new account">
                  <a href="/signup" className="nav-link" aria-label="Sign Up">
                    <Button type="primary" className="nav-button signup" block>
                      Sign Up
                    </Button>
                  </a>
                </Tooltip>
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
                  className="nav-button user"
                  block
                  aria-label={`User: ${user.username}`}
                >
                  {user.username}
                </Button>
              </Dropdown>
            )}
          </Space>
        </>
      )}
    </Space>
  );

  return (
    <div className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      {/* Left Side: Logo & Menu Icon */}
      <Space size="middle" className="navbar-left">
        <Button
          className="mobile-menu"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          aria-label="Open menu"
        />
        <Title level={4} className="logo">
          <Tooltip title="Go to homepage">
            <a href="/" aria-label="Cinenotes Homepage">
              Cinenotes
            </a>
          </Tooltip>
        </Title>
      </Space>

      {/* Center: Search Bar & Nav Links (Desktop) */}
      <Space size="middle" className="navbar-center">
        <Search
          placeholder="Search movies, groups, users..."
          onSearch={handleSearch}
          style={{ width: 200 }}
          aria-label="Search"
        />
        {navLinks}
      </Space>

      {/* Right Side: Actions */}
      <Space size="middle" className="nav-actions">
        <Tooltip title="Toggle theme">
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            aria-label="Toggle theme"
          />
        </Tooltip>
        {!isLoading && !user && (
          <>
            <Tooltip title="Log in to your account">
              <a href="/login" className="nav-link" aria-label="Log In">
                <Button icon={<LoginOutlined />} className="nav-button login">
                  Log In
                </Button>
              </a>
            </Tooltip>
            <Tooltip title="Create a new account">
              <a href="/signup" className="nav-link" aria-label="Sign Up">
                <Button type="primary" className="nav-button signup">
                  Sign Up
                </Button>
              </a>
            </Tooltip>
          </>
        )}
        {!isLoading && user && (
          <Tooltip title="Manage your account">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button
                icon={
                  user.avatarUrl ? (
                    <Avatar src={user.avatarUrl} />
                  ) : (
                    <UserOutlined />
                  )
                }
                className="nav-button user"
                aria-label={`User: ${user.username}`}
              >
                {user.username}
              </Button>
            </Dropdown>
          </Tooltip>
        )}
      </Space>

      {/* Mobile Drawer */}
      <Drawer
        title="Cinenotes Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="mobile-drawer"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {navLinks}
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            style={{ marginTop: 8 }}
            aria-label="Toggle theme"
          />
        </Space>
      </Drawer>
    </div>
  );
};

export default Navbar;
