import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../actions/authApi"; // Assuming authApi has useRegisterMutation
import { useGetAllMembersQuery } from "../../actions/userApi"; // Import from userApi

const { Title, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // RTK Query mutation hook for register (from authApi)
  const [register, { isLoading, error }] = useRegisterMutation();

  // Optional: Fetch all members to pre-check email (commented out, see notes)
  /*
  const { data: members, isLoading: membersLoading } = useGetAllMembersQuery();
  const checkEmailExists = (email) => {
    if (members && members.length > 0) {
      return members.some((user) => user.email.toLowerCase() === email.toLowerCase());
    }
    return false;
  };
  */

  const onFinish = async (values) => {
    setLoading(true);

    const { email, username, password } = values;

    try {
      const response = await register({ email, username, password }).unwrap();
      console.log("Registration Response:", response);

      if (response) {
        notification.success({
          message: "Registration Successful",
          description: "You have successfully registered! Please log in.",
        });

        // Redirect to /login after slight delay for user to read notification
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      // Handle specific email exists error
      if (err?.data?.error === "User with this email already exists") {
        notification.error({
          message: "Registration Failed",
          description:
            "This email is already registered. Please use a different email or log in.",
        });
      } else if (err?.data?.error === "Username is already taken") {
        notification.error({
          message: "Registration Failed",
          description:
            "This username is already taken. Please choose a different username.",
        });
      } else {
        notification.error({
          message: "Registration Failed",
          description: err?.data?.error || "Unexpected error occurred!",
        });
      }
    }

    setLoading(false);
  };

  // Custom password validation function
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your password!"));
    }
    if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long!")
      );
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one lowercase letter!")
      );
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one uppercase letter!")
      );
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one number!")
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(
        new Error("Password must include at least one special character!")
      );
    }
    return Promise.resolve();
  };

  // Optional: Custom email pre-check validator (uncomment if using getAllMembers)
  /*
  const validateEmail = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your email address!"));
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.reject(new Error("Please enter a valid email address!"));
    }
    if (checkEmailExists(value)) {
      return Promise.reject(
        new Error("This email is already registered. Please use a different email or log in.")
      );
    }
    return Promise.resolve();
  };
  */

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
        JOIN DimeCine
      </Title>

      <Form
        form={form}
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
            // Uncomment to enable frontend email pre-check
            // { validator: validateEmail },
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
          rules={[{ validator: validatePassword }]}
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
            loading={isLoading || loading /* || membersLoading */}
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
