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
    <nav className="bg-gray-900 p-4 flex justify-between items-center flex-wrap">
      <div className="text-white text-3xl font-bold">SilverScreeninSight</div>

      <div className="flex space-x-4 mt-2 md:mt-0">
        <a className="text-gray-300 hover:text-white" href="#">
          Films
        </a>
        <a className="text-gray-300 hover:text-white" href="#">
          Lists
        </a>
        <a className="text-gray-300 hover:text-white" href="#">
          Members
        </a>
      </div>

      <div className="flex items-center space-x-3 mt-2 md:mt-0">
        <Input
          placeholder="Search films..."
          prefix={<SearchOutlined />}
          className="w-48"
        />

        {!loading && !user && (
          <>
            <a href="/login">
              <Button
                icon={<LoginOutlined />}
                type="default"
                className="text-white border-white hover:border-gray-300"
              >
                Log In
              </Button>
            </a>
            <a href="/signup">
              <Button type="primary" danger>
                Sign Up
              </Button>
            </a>
          </>
        )}

        {!loading && user && (
          <Dropdown overlay={menu} placement="bottomRight">
            <Button
              icon={<UserOutlined />}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {user.username}
            </Button>
          </Dropdown>
        )}

        <a href="/review">
          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Review
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
