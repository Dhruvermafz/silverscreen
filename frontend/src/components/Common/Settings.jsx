import React, { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  Upload,
  Rate,
  Tabs,
  Typography,
  Spin,
  Row,
  Col,
  Space,
  Switch,
  List,
  Modal,
  Card,
  Divider,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import "./settings.css";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { TextArea } = Input;

const SettingsWrapper = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    favoriteFilms: [],
    favoriteDirectors: [],
    socialLinks: {},
    isProfilePublic: true,
    profileRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    reviews: true,
  });
  const [sessions, setSessions] = useState([]);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      form.setFieldsValue({
        bio: response.data.bio || "",
        favoriteFilms: response.data.favoriteFilms?.join("\n") || "",
        favoriteDirectors: response.data.favoriteDirectors?.join("\n") || "",
        socialLinks: response.data.socialLinks || {},
        isProfilePublic: response.data.isProfilePublic !== false,
        profileRating: response.data.profileRating || 0,
      });
      setSessions([
        { id: 1, device: "Chrome on Windows", lastActive: "2025-05-15" },
        { id: 2, device: "Safari on iPhone", lastActive: "2025-05-14" },
      ]);
    } catch (err) {
      toast.error("Failed to fetch user data", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const handleUpdateProfile = async (values) => {
    try {
      const updatedUser = {
        bio: values.bio,
        avatar: fileList.length > 0 ? fileList[0].url : userData.avatar,
        favoriteFilms: values.favoriteFilms
          ? values.favoriteFilms
              .split("\n")
              .map((m) => m.trim())
              .filter(Boolean)
          : [],
        favoriteDirectors: values.favoriteDirectors
          ? values.favoriteDirectors
              .split("\n")
              .map((g) => g.trim())
              .filter(Boolean)
          : [],
        socialLinks: values.socialLinks,
        isProfilePublic: values.isProfilePublic,
        profileRating: values.profileRating || userData.profileRating,
      };
      const response = await axios.put("/api/user/profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData(response.data);
      setFileList([]);
      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to update profile", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Upload avatar
  const handleUploadAvatar = ({ file }) => {
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
        setFileList([
          { uid: file.uid, url: response.data.avatar, name: file.name },
        ]);
        setUserData((prev) => ({ ...prev, avatar: response.data.avatar }));
        toast.success("Profile picture uploaded successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error("Failed to upload profile picture", {
          position: "top-right",
          autoClose: 2000,
        });
      });
    return false;
  };

  // Change password
  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    try {
      await axios.post(
        "/api/user/change-password",
        { oldPassword: values.password, newPassword: values.newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Password changed successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      passwordForm.resetFields();
    } catch (err) {
      toast.error("Failed to change password", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Forgot password
  const handleForgotPassword = async (values) => {
    try {
      await axios.post("/api/user/forgot-password", { email: values.email });
      toast.success("Password reset link sent to your email", {
        position: "top-right",
        autoClose: 2000,
      });
      forgotPasswordForm.resetFields();
    } catch (err) {
      toast.error("Failed to send reset link", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/user/delete-account", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Account deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      toast.error("Failed to delete account", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Toggle 2FA
  const handleToggle2FA = async (checked) => {
    try {
      setTwoFactorEnabled(checked);
      toast.success(
        `Two-factor authentication ${checked ? "enabled" : "disabled"}`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } catch (err) {
      toast.error("Failed to update 2FA settings", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Update notifications
  const handleUpdateNotifications = async () => {
    try {
      toast.success("Notification settings updated", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to update notification settings", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Terminate session
  const handleTerminateSession = async (sessionId) => {
    try {
      setSessions(sessions.filter((s) => s.id !== sessionId));
      toast.success("Session terminated", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to terminate session", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="settings-wrapper">
      <Row gutter={[16, 16]}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <Card className="settings-sidebar">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                block
                icon={<UserOutlined />}
                type="text"
                className="settings-nav-btn settings-nav-btn-active"
              >
                Profile
              </Button>
              <Button
                block
                icon={<LockOutlined />}
                type="text"
                className="settings-nav-btn"
              >
                Security
              </Button>
              <Button
                block
                icon={<BellOutlined />}
                type="text"
                className="settings-nav-btn"
              >
                Notifications
              </Button>
              <Button
                block
                icon={<DeleteOutlined />}
                type="text"
                className="settings-nav-btn"
              >
                Delete Account
              </Button>
            </Space>
          </Card>
        </Col>
        {/* Main Content */}
        <Col xs={24} md={18}>
          <Title level={2} className="settings-title">
            Settings
          </Title>
          <Tabs defaultActiveKey="1" className="settings-tabs">
            <TabPane tab="Profile" key="1">
              <Card className="settings-profile-card">
                <Avatar
                  size={80}
                  src={userData.avatar || "https://via.placeholder.com/80"}
                  icon={<UserOutlined />}
                  className="settings-avatar"
                />
                <Title level={4} className="settings-username">
                  {userData.username}
                </Title>
                <Text className="settings-email">{userData.email}</Text>
                <Rate
                  disabled
                  value={userData.profileRating}
                  className="settings-rating"
                />
              </Card>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleUpdateProfile}
                className="settings-form"
              >
                <Form.Item
                  label="About Me"
                  name="bio"
                  rules={[
                    {
                      max: 500,
                      message: "About Me cannot exceed 500 characters",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Tell us about your love for films"
                  />
                </Form.Item>
                <Form.Item label="Profile Picture" name="avatar">
                  <Upload
                    name="avatar"
                    listType="picture"
                    fileList={fileList}
                    beforeUpload={handleUploadAvatar}
                    accept="image/*"
                    onRemove={() => setFileList([])}
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload Profile Picture
                    </Button>
                  </Upload>
                </Form.Item>
                <Form.Item label="Favorite Films" name="favoriteFilms">
                  <TextArea
                    rows={4}
                    placeholder="Enter one film per line (e.g., The Godfather)"
                  />
                </Form.Item>
                <Form.Item label="Favorite Directors" name="favoriteDirectors">
                  <TextArea
                    rows={4}
                    placeholder="Enter one director per line (e.g., Martin Scorsese)"
                  />
                </Form.Item>
                <Form.Item
                  label="Letterboxd"
                  name={["socialLinks", "letterboxd"]}
                >
                  <Input placeholder="Letterboxd profile URL" />
                </Form.Item>
                <Form.Item label="Twitter" name={["socialLinks", "twitter"]}>
                  <Input placeholder="Twitter profile URL" />
                </Form.Item>
                <Form.Item
                  label="Profile Visibility"
                  name="isProfilePublic"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Public"
                    unCheckedChildren="Private"
                  />
                </Form.Item>
                <Form.Item label="Profile Rating" name="profileRating">
                  <Rate />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Security" key="2">
              <Form
                layout="vertical"
                form={passwordForm}
                onFinish={handlePasswordChange}
                className="settings-form"
              >
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
                  <Input.Password placeholder="Enter your current password" />
                </Form.Item>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password",
                    },
                    {
                      min: 8,
                      message: "Password must be at least 8 characters",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter your new password" />
                </Form.Item>
                <Form.Item
                  label="Confirm New Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password",
                    },
                  ]}
                >
                  <Input.Password placeholder="Confirm your new password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
              <Divider>Two-Factor Authentication</Divider>
              <Space style={{ marginBottom: 16 }}>
                <Text>Enable 2FA</Text>
                <Switch checked={twoFactorEnabled} onChange={handleToggle2FA} />
              </Space>
              <Divider>Active Sessions</Divider>
              <List
                dataSource={sessions}
                renderItem={(session) => (
                  <List.Item
                    actions={[
                      <Button
                        danger
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        Terminate
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={session.device}
                      description={`Last active: ${session.lastActive}`}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="Notifications" key="3">
              <Form
                layout="vertical"
                onFinish={handleUpdateNotifications}
                className="settings-form"
              >
                <Form.Item
                  label="Email Notifications"
                  name="emailNotifications"
                >
                  <Switch
                    checked={notifications.email}
                    onChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, email: checked }))
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="In-App Notifications"
                  name="inAppNotifications"
                >
                  <Switch
                    checked={notifications.inApp}
                    onChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, inApp: checked }))
                    }
                  />
                </Form.Item>
                <Form.Item label="Review Mentions" name="reviews">
                  <Switch
                    checked={notifications.reviews}
                    onChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        reviews: checked,
                      }))
                    }
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Save Notification Settings
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Forgot Password" key="4">
              <Form
                layout="vertical"
                form={forgotPasswordForm}
                onFinish={handleForgotPassword}
                className="settings-form"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Send Reset Link
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="Delete Account" key="5">
              <Text type="danger" className="settings-warning">
                This action is irreversible. All your reviews, lists, and
                profile data will be permanently deleted.
              </Text>
              <Button
                danger
                type="primary"
                block
                onClick={() => setIsDeleteModalOpen(true)}
                className="settings-delete-btn"
              >
                Delete My Account
              </Button>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      <Modal
        title="Confirm Account Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
      >
        <Text type="danger">
          Are you sure you want to delete your account? All your data will be
          lost.
        </Text>
      </Modal>
    </div>
  );
};

export default SettingsWrapper;
