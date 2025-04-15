import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Button, Input } from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getProfile } from "../../actions/users/userActions";
import "./navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getProfile();
      if (res.success) {
        setUser(res.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

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
    <nav className="navbar">
      <div className="navbar__title">SilverScreeninSight</div>

      <div className="navbar__menu">
        <a className="navbar__menu-item" href="#">
          Films
        </a>
        <a className="navbar__menu-item" href="#">
          Lists
        </a>
        <a className="navbar__menu-item" href="#">
          Members
        </a>
      </div>

      <div className="navbar__actions">
        <Input
          placeholder="Search films..."
          prefix={<SearchOutlined />}
          className="navbar__search"
        />

        {!loading && !user && (
          <div className="navbar__auth-buttons">
            <a href="/login">
              <Button
                icon={<LoginOutlined />}
                type="default"
                className="navbar__button--login"
              >
                Log In
              </Button>
            </a>
            <a href="/signup">
              <Button type="primary" danger className="navbar__button--signup">
                Sign Up
              </Button>
            </a>
          </div>
        )}

        {!loading && user && (
          <Dropdown overlay={menu} placement="bottomRight">
            <Button
              icon={<UserOutlined />}
              className="navbar__button--login bg-blue-600 hover:bg-blue-700"
            >
              {user.username}
            </Button>
          </Dropdown>
        )}

        <a href="/review">
          <Button type="primary" className="navbar__button--review">
            Review
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
