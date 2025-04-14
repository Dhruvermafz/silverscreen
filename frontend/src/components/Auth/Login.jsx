import React, { useState } from "react";
import { Input, Button, Checkbox, Form, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { loginUser } from "../../actions/auth/authActions";
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
    <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-gray-300 text-xl font-semibold">
          Welcome Back to SilverScreeninSight
        </h2>
        <i className="fas fa-times text-gray-400 cursor-pointer"></i>
      </div>

      <Form onSubmitCapture={handleLogin}>
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
            className="w-full"
            loading={loading}
          >
            Log In
          </Button>
        </Form.Item>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up here
          </a>
        </p>
      </Form>
    </div>
  );
};

export default Login;
