import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../actions/authApi";
const { Title, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // RTK Query mutation hook for register
  const [register, { isLoading, error }] = useRegisterMutation();

  const onFinish = async (values) => {
    setLoading(true);

    const { email, username, password } = values;

    try {
      const response = await register({ email, username, password }).unwrap(); // unwrap() is used to handle the result
      console.log("Registration Response:", response);

      if (response) {
        notification.success({
          message: "Registration Successful",
          description: "You have successfully registered!",
        });

        // Redirect after slight delay for user to read notification
        setTimeout(() => {
          navigate("/"); // Navigate to the homepage after successful registration
        }, 1000);
      }
    } catch (err) {
      notification.error({
        message: "Registration Failed",
        description: err?.message || "Unexpected error occurred!",
      });
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        JOIN SilverScreen
      </Title>

      <Form
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        scrollToFirstError
      >
        {/* Email Field */}
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email address!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        {/* Username Field */}
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            size="large"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
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
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "You must accept the Terms of Use and Privacy Policy!"
                      )
                    ),
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
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Please verify that you are human!")
                    ),
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
            loading={isLoading || loading}
          >
            SIGN UP
          </Button>
        </Form.Item>
      </Form>

      <Text style={{ display: "block", textAlign: "center" }}>
        Already have an account?{" "}
        <a href="/login" style={{ fontWeight: "bold" }}>
          Log in here
        </a>
      </Text>
    </div>
  );
};

export default Signup;
