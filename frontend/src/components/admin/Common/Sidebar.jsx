import React from "react";
import { Layout, Menu, Button, Avatar, Typography, Space } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../../actions/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isLoading } = useGetProfileQuery();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/admin",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/admin",
    },
    {
      key: "/admin/catalog",
      label: "Catalog",
      icon: <VideoCameraOutlined />,
      path: "/admin/catalog",
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
      key: "/admin/settings",
      label: "Settings",
      icon: <SettingOutlined />,
      path: "/admin/settings",
    },
  ];

  return (
    <Sider
      collapsible
      breakpoint="lg"
      collapsedWidth={80}
      width={250}
      className="sidebar"
    >
      <div className="sidebar-header">
        <Text className="sidebar-logo">Cinenotes Admin</Text>
      </div>
      <div className="sidebar-user">
        <Space align="center" size="middle">
          <Avatar
            src={user?.avatarUrl || "https://via.placeholder.com/40"}
            icon={!user?.avatarUrl && <UserOutlined />}
            className="sidebar-user-avatar"
          />
          <div className="sidebar-user-info">
            <Text className="sidebar-user-name">
              {isLoading ? "Loading..." : user?.username || "Admin"}
            </Text>
            <Text className="sidebar-user-role">Admin</Text>
          </div>
        </Space>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="sidebar-user-logout"
          aria-label="Logout"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => navigate(item.path),
        }))}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar;
