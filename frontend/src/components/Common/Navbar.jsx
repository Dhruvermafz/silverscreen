import React, { useEffect } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Input,
  Space,
  Typography,
  notification,
} from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useGetProfileQuery } from "../../actions/userApi";
const { Title } = Typography;

const Navbar = () => {
  // Use the Redux hook to get user profile data
  const { data: user, isLoading, isError } = useGetProfileQuery();

  // Show error message if profile fetching fails
  useEffect(() => {
    if (isError) {
      notification.error({
        message: "Error",
        description: "Failed to fetch user profile!",
      });
    }
  }, [isError]);

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        <a href="/profile">My Profile</a>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <a href="/logout">Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
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
      {/* Logo */}
      <Title level={4} style={{ margin: 0 }}>
        SilverScreenInsight
      </Title>

      {/* Menu */}
      <Space size="large">
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

      {/* Actions */}
      <Space size="middle">
        <Input
          placeholder="Search films..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
        />

        {!isLoading && !user && (
          <Space>
            <a href="/login">
              <Button icon={<LoginOutlined />} type="default">
                Log In
              </Button>
            </a>
            <a href="/signup">
              <Button type="primary" danger>
                Sign Up
              </Button>
            </a>
          </Space>
        )}

        {!isLoading && user && (
          <Dropdown overlay={menu} placement="bottomRight">
            <Button icon={<UserOutlined />}>{user.username}</Button>
          </Dropdown>
        )}

        {!isLoading && user && (
          <a href="/review">
            <Button type="primary">Review</Button>
          </a>
        )}
      </Space>
    </div>
  );
};

export default Navbar;
