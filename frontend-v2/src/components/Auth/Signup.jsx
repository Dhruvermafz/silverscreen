// src/components/Auth/Signup.js
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

import { useRegisterMutation } from "../../actions/authApi";
import MovieSlider from "../MovieSlider";

const { Title, Text } = Typography;

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values) => {
    try {
      await register({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      }).unwrap();

      message.success({
        content: "Welcome to DimeCine! 🎬 Your account has been created.",
        duration: 3,
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      message.error(
        err?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div
      className="signup-page"
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "#141414",
      }}
    >
      {/* Dynamic MovieSlider Background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <MovieSlider category="viral-flicks" limit={16} />
      </div>

      {/* Dark Overlay for Text Readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.4) 50%, rgba(20,20,20,0.95) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Row style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>
        {/* Left: Signup Form */}
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
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              background: "rgba(31, 31, 31, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            bodyStyle={{ padding: "48px 40px" }}
          >
            <div className="text-center mb-5">
              <Title level={2} style={{ color: "#fff", marginBottom: 8 }}>
                Join DimeCine
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: "1.1rem", color: "#ccc" }}
              >
                Create an account and start exploring the world of cinema
              </Text>
            </div>

            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter a username" },
                  { min: 3, message: "Username must be at least 3 characters" },
                  { max: 20, message: "Username cannot exceed 20 characters" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "Only letters, numbers, and underscores allowed",
                  },
                ]}
              >
                <Input
                  placeholder="Choose a username"
                  prefix={<i className="ri-user-line text-muted" />}
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
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
                  { required: true, message: "Please create a password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  {
                    pattern: /[a-z]/,
                    message: "Must include a lowercase letter",
                  },
                  {
                    pattern: /[A-Z]/,
                    message: "Must include an uppercase letter",
                  },
                  { pattern: /[0-9]/, message: "Must include a number" },
                  {
                    pattern: /[!@#$%^&*]/,
                    message: "Must include a special character (!@#$%^&*)",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Create a strong password"
                  prefix={<i className="ri-lock-line text-muted" />}
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm password"
                  prefix={<i className="ri-lock-line text-muted" />}
                  style={{ borderRadius: 12, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("You must accept the terms")
                          ),
                  },
                ]}
              >
                <Checkbox style={{ color: "#ccc" }}>
                  I agree to the{" "}
                  <Link to="/terms-and-conditions" style={{ color: "#e50914" }}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" style={{ color: "#e50914" }}>
                    Privacy Policy
                  </Link>
                </Checkbox>
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
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </Form.Item>

              <div className="text-center mt-4">
                <Text style={{ color: "#ccc", fontSize: "1rem" }}>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#e50914",
                      fontWeight: "bold",
                      fontSize: "1.05rem",
                    }}
                  >
                    Log in
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
            className="text-center text-white px-5"
            style={{ maxWidth: 700, zIndex: 2 }}
          >
            <Title
              level={1}
              style={{
                color: "#fff",
                fontSize: "4rem",
                fontWeight: "bold",
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                marginBottom: 24,
              }}
            >
              Join the Conversation
            </Title>
            <Text
              style={{
                fontSize: "1.6rem",
                color: "#eee",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                lineHeight: 1.6,
              }}
            >
              Share reviews, create personal lists, join passionate communities,
              and connect with fellow movie lovers from around the world.
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Signup;
