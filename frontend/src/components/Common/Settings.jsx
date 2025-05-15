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
  Row,
  Col,
  Space,
  Switch,
  List,
  Modal,
  Menu,
  Divider,
  Card,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { TextArea } = Input;

const SettingsWrapper = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    favoriteMovies: [],
    favoriteGenres: [],
    socialLinks: {},
    isPublic: true,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false); // Mock 2FA state
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    mentions: true,
  });
  const [sessions, setSessions] = useState([]); // Mock active sessions

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        form.setFieldsValue({
          bio: response.data.bio || "",
          favoriteMovies: response.data.favoriteMovies?.join("\n") || "",
          favoriteGenres: response.data.favoriteGenres?.join("\n") || "",
          socialLinks: response.data.socialLinks || {},
          isPublic: response.data.isPublic !== false,
        });
        // Mock sessions fetch
        setSessions([
          { id: 1, device: "Chrome on Windows", lastActive: "2025-05-15" },
          { id: 2, device: "Safari on iPhone", lastActive: "2025-05-14" },
        ]);
      } catch (err) {
        message.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  const handleUpdateProfile = async (values) => {
    try {
      const updatedUser = {
        bio: values.bio,
        avatar: fileList.length > 0 ? fileList[0].url : userData.avatar,
        favoriteMovies: values.favoriteMovies
          ? values.favoriteMovies
              .split("\n")
              .map((m) => m.trim())
              .filter(Boolean)
          : [],
        favoriteGenres: values.favoriteGenres
          ? values.favoriteGenres
              .split("\n")
              .map((g) => g.trim())
              .filter(Boolean)
          : [],
        socialLinks: values.socialLinks,
        isPublic: values.isPublic,
        rating: values.rating || userData.rating,
      };
      const response = await axios.put("/api/user/profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData(response.data);
      setFileList([]);
      message.success("Profile updated successfully");
    } catch (err) {
      message.error("Failed to update profile");
    }
  };

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
        message.success("Avatar uploaded successfully");
      })
      .catch((err) => message.error("Failed to upload avatar"));
    return false;
  };

  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error("Passwords do not match");
    }
    try {
      await axios.post(
        "/api/user/change-password",
        { oldPassword: values.password, newPassword: values.newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success("Password changed successfully");
      passwordForm.resetFields();
    } catch (err) {
      message.error("Failed to change password");
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      await axios.post("/api/user/forgot-password", { email: values.email });
      message.success("Password reset link sent");
      forgotPasswordForm.resetFields();
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
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      message.error("Failed to delete account");
    }
  };

  const handleToggle2FA = async (checked) => {
    try {
      // Mock 2FA toggle (replace with actual API)
      setTwoFactorEnabled(checked);
      message.success(
        `Two-factor authentication ${checked ? "enabled" : "disabled"}`
      );
    } catch (err) {
      message.error("Failed to update 2FA settings");
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      // Mock notification update (replace with actual API)
      message.success("Notification settings updated");
    } catch (err) {
      message.error("Failed to update notification settings");
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      // Mock session termination (replace with actual API)
      setSessions(sessions.filter((s) => s.id !== sessionId));
      message.success("Session terminated");
    } catch (err) {
      message.error("Failed to terminate session");
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
    <div className="settings-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          {/* Sidebar */}
          <Card>
            <Menu mode="vertical" defaultSelectedKeys={["profile"]}>
              <Menu.Item key="profile" icon={<UserOutlined />}>
                Profile
              </Menu.Item>
              <Menu.Item key="security" icon={<LockOutlined />}>
                Security
              </Menu.Item>
              <Menu.Item key="notifications" icon={<BellOutlined />}>
                Notifications
              </Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />}>
                Delete Account
              </Menu.Item>
            </Menu>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Account Settings
          </Title>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Profile" key="1">
              <Card style={{ textAlign: "center", marginBottom: 16 }}>
                <Avatar
                  size={100}
                  src={userData.avatar || "https://via.placeholder.com/100"}
                  icon={<UserOutlined />}
                />
                <Title level={3}>{userData.username}</Title>
                <Text>{userData.email}</Text>
                <div style={{ marginTop: 10 }}>
                  <Rate disabled value={userData.rating} />
                </div>
              </Card>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleUpdateProfile}
              >
                <Form.Item
                  label="Bio"
                  name="bio"
                  rules={[
                    { max: 500, message: "Bio cannot exceed 500 characters" },
                  ]}
                >
                  <TextArea rows={4} placeholder="Enter your bio" />
                </Form.Item>
                <Form.Item label="Avatar" name="avatar">
                  <Upload
                    name="avatar"
                    listType="picture"
                    fileList={fileList}
                    beforeUpload={handleUploadAvatar}
                    accept="image/*"
                    onRemove={() => setFileList([])}
                  >
                    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label="Favorite Movies" name="favoriteMovies">
                  <TextArea rows={4} placeholder="Enter one movie per line" />
                </Form.Item>
                <Form.Item label="Favorite Genres" name="favoriteGenres">
                  <TextArea rows={4} placeholder="Enter one genre per line" />
                </Form.Item>
                <Form.Item
                  label="Social Links"
                  name={["socialLinks", "twitter"]}
                >
                  <Input placeholder="Twitter URL" />
                </Form.Item>
                <Form.Item
                  label="Instagram"
                  name={["socialLinks", "instagram"]}
                >
                  <Input placeholder="Instagram URL" />
                </Form.Item>
                <Form.Item
                  label="Profile Visibility"
                  name="isPublic"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Public"
                    unCheckedChildren="Private"
                  />
                </Form.Item>
                <Form.Item label="Rating" name="rating">
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
              <Form layout="vertical" onFinish={handleUpdateNotifications}>
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
                <Form.Item label="Mentions" name="mentions">
                  <Switch
                    checked={notifications.mentions}
                    onChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        mentions: checked,
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
              <Text type="danger">
                This action is irreversible. All your data will be permanently
                deleted.
              </Text>
              <Button
                danger
                type="primary"
                block
                onClick={() => setIsDeleteModalOpen(true)}
                style={{ marginTop: 16 }}
              >
                Delete My Account
              </Button>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* Delete Account Confirmation Modal */}
      <Modal
        title="Confirm Account Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okType="danger"
      >
        <Text type="danger">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Text>
      </Modal>
    </div>
  );
};

export default SettingsWrapper;
