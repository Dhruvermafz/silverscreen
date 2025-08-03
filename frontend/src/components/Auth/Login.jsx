import React, { useState } from "react";
import { Input, Button, Checkbox, Form, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLoginMutation } from "../../actions/authApi";

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await login({
        email: values.email, // Changed from username to email
        password: values.password,
      }).unwrap();

      const token = response.token;
      localStorage.setItem("token", token);

      message.success("Logged in successfully!");
      // Redirect to dashboard or perform other actions
      window.location.href = "/"; // Redirect to home (MembersWrapper)
    } catch (err) {
      message.error(err?.data?.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: "40px 20px",
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={3} style={{ textAlign: "center" }}>
        Welcome Back to DimeCine
      </Title>

      <Form onFinish={handleLogin}>
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined />}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined />}
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
            block
            loading={isLoading || loading}
          >
            Log In
          </Button>
        </Form.Item>

        <Text style={{ textAlign: "center", display: "block" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ fontWeight: "bold" }}>
            Sign up here
          </a>
        </Text>
      </Form>
    </div>
  );
};

export default Login;
