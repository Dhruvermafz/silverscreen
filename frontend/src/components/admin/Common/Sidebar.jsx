import React, { useState, useEffect, useRef } from "react";
import { Menu, Button, Avatar, Typography, Space, Spin, Tooltip } from "antd";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  StarOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  FlagOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../../actions/authApi";
import { useGetProfileQuery } from "../../../actions/userApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./sidebar.css"; // Import custom CSS for floating menu styles

const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Control menu visibility
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Initial position
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const dragRef = useRef(null); // Reference to draggable container
  const menuRef = useRef(null); // Reference to menu for click outside detection
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
      setIsOpen(false); // Close menu on logout
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

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle menu item click
  const handleMenuClick = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu when a menu item is clicked
  };

  // Handle dragging
  const handleMouseDown = (e) => {
    if (!isOpen) {
      // Only allow dragging when menu is closed
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = position.x + e.movementX;
      const newY = position.y + e.movementY;

      // Boundary checks to keep within viewport
      const maxX = window.innerWidth - 60; // Adjust based on button size
      const maxY = window.innerHeight - 60;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position]);

  // Touch support for mobile devices
  const handleTouchStart = (e) => {
    if (!isOpen) {
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - 30; // Center touch on button
      const newY = touch.clientY - 30;

      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={dragRef}
      className="floating-menu-container"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toggle Button */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={toggleMenu}
        className="menu-toggle-button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      />

      {/* Floating Menu */}
      {isOpen && (
        <div ref={menuRef} className="floating-menu">
          <div className="menu-header">
            <Space align="center">
              <img
                src="/filmreel.svg"
                alt="SilverScreen Logo"
                style={{ width: 24, height: 24, marginRight: 8 }}
                aria-hidden="true"
              />
              <Text className="logo-text">SilverScreen Admin</Text>
            </Space>
          </div>
          <div className="menu-user">
            {profileLoading ? (
              <Spin size="small" aria-label="Loading profile" />
            ) : (
              <Space align="center" size="middle">
                <Avatar
                  src={user?.avatarUrl || undefined}
                  alt={
                    user?.username
                      ? `${user.username}'s avatar`
                      : "Admin avatar"
                  }
                  icon={!user?.avatarUrl && <UserOutlined />}
                  className="avatar-img"
                />
                <div className="menu-user-info">
                  <Text strong className="avatar-text">
                    {user?.username || "Admin"}
                  </Text>
                  <Text className="avatar-text">Admin</Text>
                </div>
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
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              onClick: () => handleMenuClick(item.path),
              "aria-current": location.pathname === item.key ? "page" : null,
            }))}
            className="menu-list"
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
