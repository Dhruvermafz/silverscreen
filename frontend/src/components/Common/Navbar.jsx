import React, { useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Input,
  Space,
  Typography,
  notification,
  Avatar,
  Drawer,
} from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SearchOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi";
import SettingsWrapper from "./Settings";

const { Title } = Typography;

const Navbar = () => {
  const { data: user, isLoading, isError } = useGetProfileQuery();
  console.log(user);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (isError) {
      notification.error({
        message: "Error",
        description: "Failed to fetch user profile!",
      });
    }
  }, [isError]);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <a href={`/u/${user?._id}`}>My Profile</a>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <a href="/settings">Settings</a>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <a href="/logout">Logout</a>
      </Menu.Item>
    </Menu>
  );

  const navLinks = (
    <Space size="large" direction="vertical" style={{ marginTop: 20 }}>
      <a href="/films" style={{ fontWeight: 500 }}>
        Films
      </a>
      <a href="/lists" style={{ fontWeight: 500 }}>
        Lists
      </a>
      <a href="/members" style={{ fontWeight: 500 }}>
        Members
      </a>
      {!isLoading && !user && (
        <>
          <a href="/login">
            <Button icon={<LoginOutlined />}>Log In</Button>
          </a>
          <a href="/signup">
            <Button type="primary" danger>
              Sign Up
            </Button>
          </a>
        </>
      )}
      {!isLoading && user && (
        <>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button icon={<UserOutlined />}>{user.username}</Button>
          </Dropdown>
        </>
      )}
    </Space>
  );

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        padding: "10px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left Side: Logo & Menu Icon */}
      <Space size="middle">
        <Button
          className="mobile-menu"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{ display: "none" }}
        />
        <Title level={4} style={{ margin: 0 }}>
          <a href="/" style={{ color: "black" }}>
            SilverScreen
          </a>
        </Title>
      </Space>

      {/* Center Nav Links (Desktop) */}
      <Space size="large" className="nav-links" style={{ display: "flex" }}>
        <a href="/films" style={{ color: "#555", fontWeight: 500 }}>
          Films
        </a>
        <a href="/lists" style={{ color: "#555", fontWeight: 500 }}>
          Lists
        </a>
        <a href="/members" style={{ color: "#555", fontWeight: 500 }}>
          Members
        </a>
      </Space>

      {/* Right Side: Actions */}
      <Space size="middle">
        {!isLoading && !user && (
          <Space>
            <a href="/login">
              <Button icon={<LoginOutlined />}>Log In</Button>
            </a>
            <a href="/signup">
              <Button type="primary" danger>
                Sign Up
              </Button>
            </a>
          </Space>
        )}

        {!isLoading && user && (
          <>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button
                icon={
                  user.avatarUrl ? (
                    <Avatar src={user.avatarUrl} />
                  ) : (
                    <UserOutlined />
                  )
                }
              >
                {user.username}
              </Button>
            </Dropdown>
          </>
        )}
      </Space>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {navLinks}
      </Drawer>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .nav-links {
              display: none !important;
            }
            .mobile-menu {
              display: inline-block !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;
