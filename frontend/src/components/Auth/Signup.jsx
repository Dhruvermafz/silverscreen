import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "./signup.css";
import { registerUser } from "../../actions/auth/authActions";
const Signup = () => {
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);

    const { email, username, password } = values;

    // Call registerUser function
    const response = await registerUser({ email, username, password });

    setLoading(false);

    if (response.success) {
      notification.success({
        message: "Registration Successful",
        description: "You have successfully registered!",
      });
      // Optionally, redirect or clear the form
    } else {
      notification.error({
        message: "Registration Failed",
        description: response.error || "Something went wrong!",
      });
    }
  };

  return (
    <div
      className="signup-form-container"
      style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}
    >
      <h2 className="text-center mb-4">JOIN SilverScreenInSight</h2>
      <Form onFinish={onFinish} layout="vertical">
        {/* Email Field */}
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email address!",
            },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        {/* Username Field */}
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please enter your username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            size="large"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        {/* Terms and Privacy Checkbox */}
        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: "You must accept the Terms of Use and Privacy Policy!",
            },
          ]}
        >
          <Checkbox>
            I’m at least 16 years old and accept the
            <a href="#"> Terms of Use</a> and
            <a href="#"> Privacy Policy</a>.
          </Checkbox>
        </Form.Item>

        {/* CAPTCHA */}
        <Form.Item
          name="captcha"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: "Please verify that you are human!",
            },
          ]}
        >
          <Checkbox>I am human</Checkbox>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            SIGN UP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
