import React, { useState } from "react";
import { Input, Button, Checkbox, Form, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { loginUser } from "../../actions/auth/authActions";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const response = await loginUser({ username: email, password });

    if (response.success) {
      message.success("Logged in successfully!");
      // You can redirect or perform other actions after login
    } else {
      message.error(response.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2 className="login-title">Welcome Back to SilverScreeninSight</h2>
        <i className="fas fa-times login-close"></i>
      </div>

      <Form onSubmitCapture={handleLogin} className="login-form">
        <Form.Item label="Email Address">
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item label="Password">
          <Input.Password
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Checkbox required>I am human</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-btn"
            loading={loading}
          >
            Log In
          </Button>
        </Form.Item>

        <p className="login-footer">
          Don't have an account?{" "}
          <a href="/signup" className="login-signup-link">
            Sign up here
          </a>
        </p>
      </Form>
    </div>
  );
};

export default Login;
