import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message,
  Divider,
} from "antd";
import { GoogleOutlined, FacebookFilled } from "@ant-design/icons";

import { useLoginMutation } from "../../actions/authApi";
import MovieSlider from "../MovieSlider";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      message.success("Welcome back to DimeCine! 🎬");
      navigate("/");
    } catch (err) {
      message.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "#f8f9fa", // light gray background
      }}
    >
      {/* Animated MovieSlider Background - subtle & lightened */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <MovieSlider category="viral-flicks" limit={12} />
      </div>

      {/* Light gradient overlay for better text contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(248,249,250,0.92) 0%, rgba(248,249,250,0.75) 50%, rgba(248,249,250,0.92) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Row style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>
        {/* Left: Login Form */}
        <Col
          xs={24}
          lg={10}
          xl={8}
          className="d-flex align-items-center justify-content-center p-4"
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              background: "#ffffff",
              border: "1px solid #e9ecef",
            }}
            bodyStyle={{ padding: "48px 40px" }}
          >
            <div className="text-center mb-5">
              <Title level={2} style={{ color: "#212529", marginBottom: 8 }}>
                Welcome Back
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: "1.1rem", color: "#6c757d" }}
              >
                Log in to continue your cinematic journey
              </Text>
            </div>

            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Email address"
                  prefix={<i className="ri-mail-line text-muted" />}
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  prefix={<i className="ri-lock-line text-muted" />}
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item>
                <Space className="w-100 justify-content-between">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password" style={{ color: "#e50914" }}>
                    Forgot password?
                  </Link>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  size="large"
                  style={{
                    borderRadius: 12,
                    height: 52,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </Form.Item>

              <div className="text-center mt-4">
                <Text style={{ color: "#495057", fontSize: "1rem" }}>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    style={{
                      color: "#e50914",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                    }}
                  >
                    Sign up
                  </Link>
                </Text>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Right: Hero Text over MovieSlider */}
        <Col
          xs={0}
          lg={14}
          xl={16}
          className="d-flex align-items-center justify-content-center"
        >
          <div
            className="text-center px-5"
            style={{ maxWidth: 720, zIndex: 2 }}
          >
            <Title
              level={1}
              style={{
                color: "#212529",
                fontSize: "3.8rem",
                fontWeight: "bold",
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              Discover Your Next Favorite Movie
            </Title>
            <Text
              style={{
                fontSize: "1.5rem",
                color: "#495057",
                lineHeight: 1.6,
                maxWidth: 680,
              }}
            >
              Join the community of passionate cinephiles sharing reviews,
              lists, and recommendations.
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
