import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  Upload,
  Rate,
  message,
  Tabs,
  Typography,
  Spin,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const SettingsWrapper = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    favoriteMovies: [],
    rating: 0,
  });
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [rating, setRating] = useState(0);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setBio(response.data.bio || "");
        setAvatar(response.data.avatar || "");
        setFavoriteMovies(response.data.favoriteMovies || []);
        setRating(response.data.rating || 0);
        setEmail(response.data.email || "");
      } catch (err) {
        message.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = { bio, avatar, favoriteMovies, rating };
      const response = await axios.put("/api/user/profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData(response.data);
      message.success("Profile updated successfully");
    } catch (err) {
      message.error("Failed to update profile");
    }
  };

  const handleUploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    axios
      .post("/api/user/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setAvatar(response.data.avatar);
        setUserData((prev) => ({ ...prev, avatar: response.data.avatar }));
        message.success("Avatar updated successfully");
      })
      .catch((err) => message.error("Failed to upload avatar"));
    return false;
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return message.error("Passwords do not match");
    }
    try {
      await axios.post(
        "/api/user/change-password",
        { oldPassword: password, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success("Password changed successfully");
      form.resetFields();
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      message.error("Failed to change password");
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      await axios.post("/api/user/forgot-password", { email: values.email });
      message.success("Password reset link sent");
    } catch (err) {
      message.error("Failed to send reset link");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/user/delete-account", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      message.success("Account deleted successfully");
      window.location.href = "/login";
    } catch (err) {
      message.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className="settings-wrapper"
      style={{ width: "600px", margin: "auto", padding: "30px" }}
    >
      <Title level={2} style={{ textAlign: "center" }}>
        Account Settings
      </Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <div className="profile-header" style={{ textAlign: "center" }}>
            <Avatar
              size={100}
              src={avatar || "https://via.placeholder.com/100"}
              icon={<UserOutlined />}
            />
            <Title level={3}>{userData.username}</Title>
            <Text>{userData.email}</Text>
            <div style={{ marginTop: 10 }}>
              <Rate disabled value={rating} />
            </div>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpdateProfile}
            style={{ marginTop: 20 }}
          >
            <Form.Item label="Bio">
              <Input.TextArea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter your bio"
              />
            </Form.Item>

            <Form.Item label="Avatar">
              <Upload
                name="avatar"
                listType="picture"
                showUploadList={false}
                beforeUpload={handleUploadAvatar}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Favorite Movies">
              <Input
                value={favoriteMovies.join(", ")}
                onChange={(e) =>
                  setFavoriteMovies(
                    e.target.value.split(",").map((m) => m.trim())
                  )
                }
                placeholder="Enter favorite movies separated by commas"
              />
            </Form.Item>

            <Form.Item label="Rating">
              <Rate value={rating} onChange={setRating} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Password" key="2">
          <Form layout="vertical" form={form} onFinish={handlePasswordChange}>
            <Form.Item
              label="Current Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter your new password" },
              ]}
            >
              <Input.Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your new password" },
              ]}
            >
              <Input.Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Forgot Password" key="3">
          <Form
            layout="vertical"
            form={form}
            onFinish={(values) => handleForgotPassword(values)}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Delete Account" key="4">
          <Button danger type="primary" block onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingsWrapper;
