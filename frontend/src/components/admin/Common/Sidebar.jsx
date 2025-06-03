import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Typography,
  Space,
  Spin,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  StarOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../../actions/authApi";
import { useGetProfileQuery } from "../../../actions/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfileQuery();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

  // Handle profile error
  if (profileError) {
    toast.error("Failed to load profile", {
      position: "top-right",
      autoClose: 2000,
    });
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed", { position: "top-right", autoClose: 2000 });
    }
  };

  const menuItems = [
    {
      key: "/admin",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/admin",
    },
    {
      key: "/admin/films",
      label: "Films",
      icon: <VideoCameraOutlined />,
      path: "/admin/films",
    },
    {
      key: "/admin/users",
      label: "Users",
      icon: <UserOutlined />,
      path: "/admin/users",
    },
    {
      key: "/admin/reviews",
      label: "Reviews",
      icon: <StarOutlined />,
      path: "/admin/reviews",
    },
    {
      key: "/admin/box-office",
      label: "Box Office",
      icon: <BarChartOutlined />,
      path: "/admin/box-office",
    },
    {
      key: "/admin/groups",
      label: "Groups",
      icon: <TeamOutlined />,
      path: "/admin/groups",
    },
    {
      key: "/admin/flags",
      label: "Flags",
      icon: <FlagOutlined />,
      path: "/admin/flags",
    },
    {
      key: "/admin/settings",
      label: "Settings",
      icon: <SettingOutlined />,
      path: "/admin/settings",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      collapsedWidth={60}
      width={240}
      className="sider"
      role="navigation"
      aria-label="Admin sidebar"
    >
      <div className="sidebar-header">
        <Space align="center">
          <img
            src="/filmreel.svg"
            alt="SilverScreen Logo"
            style={{ width: 24, height: 24, marginRight: 8 }}
            aria-hidden="true"
          />
          {!collapsed && <Text className="logo-text">SilverScreen Admin</Text>}
        </Space>
      </div>
      <div className="sidebar-user">
        {profileLoading ? (
          <Spin size="small" aria-label="Loading profile" />
        ) : (
          <Space align="center" size="middle">
            <Avatar
              src={user?.avatarUrl || undefined}
              alt={
                user?.username ? `${user.username}'s avatar` : "Admin avatar"
              }
              icon={!user?.avatarUrl && <UserOutlined />}
              className="avatar-img"
            />
            {!collapsed && (
              <div className="sidebar-user-info">
                <Text strong className="avatar-text">
                  {user?.username || "Admin"}
                </Text>
                <Text className="avatar-text">Admin</Text>
              </div>
            )}
          </Space>
        )}
        <Tooltip title="Logout">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={logoutLoading}
            className="logout-button"
            aria-label="Logout"
            disabled={logoutLoading}
          />
        </Tooltip>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => navigate(item.path),
          "aria-current": location.pathname === item.key ? "page" : null,
        }))}
        className="menu-list"
      />
    </Sider>
  );
};

export default Sidebar;
