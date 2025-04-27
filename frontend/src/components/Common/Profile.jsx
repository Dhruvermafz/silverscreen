import React, { useState, useEffect } from "react";
import { Input, Button, Upload, Form, Rate, Avatar, message, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios"; // Axios to handle API requests

const { TabPane } = Tabs;

const ProfileWrapper = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    favoriteMovies: [],
    rating: 0,
  });

  // State for form fields
  const [bio, setBio] = useState(userData.bio);
  const [avatar, setAvatar] = useState(userData.avatar);
  const [favoriteMovies, setFavoriteMovies] = useState(userData.favoriteMovies);
  const [rating, setRating] = useState(userData.rating);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    // Fetch the user profile (replace with actual API endpoint)
    axios
      .get("/api/user/profile")
      .then((response) => {
        setUserData(response.data);
        setBio(response.data.bio);
        setAvatar(response.data.avatar);
        setFavoriteMovies(response.data.favoriteMovies);
        setRating(response.data.rating);
      })
      .catch((err) => message.error("Failed to fetch user data"));
  }, []);

  const handleUpdateProfile = () => {
    const updatedUser = {
      bio,
      avatar,
      favoriteMovies,
      rating,
    };
    axios
      .put("/api/user/profile", updatedUser)
      .then((response) => {
        setUserData(response.data);
        message.success("Profile updated successfully");
      })
      .catch((err) => message.error("Failed to update profile"));
  };

  const handleUploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    axios
      .post("/api/user/upload-avatar", formData)
      .then((response) => {
        setAvatar(response.data.avatar);
        message.success("Avatar updated successfully");
      })
      .catch((err) => message.error("Failed to upload avatar"));
    return false;
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      return message.error("Passwords do not match");
    }

    axios
      .post("/api/user/change-password", { oldPassword: password, newPassword })
      .then(() => {
        message.success("Password changed successfully");
      })
      .catch((err) => message.error("Failed to change password"));
  };

  const handleForgotPassword = (email) => {
    axios
      .post("/api/user/forgot-password", { email })
      .then(() => message.success("Password reset link sent"))
      .catch((err) => message.error("Failed to send reset link"));
  };

  const handleDeleteAccount = () => {
    axios
      .delete("/api/user/delete-account")
      .then(() => message.success("Account deleted successfully"))
      .catch((err) => message.error("Failed to delete account"));
  };

  return (
    <div className="profile-wrapper" style={{ width: "600px", margin: "auto" }}>
      <Tabs defaultActiveKey="1">
        {/* Profile Tab */}
        <TabPane tab="Profile" key="1">
          <div className="profile-header" style={{ textAlign: "center" }}>
            <Avatar
              size={100}
              src={avatar || "https://via.placeholder.com/100"}
            />
            <h2>{userData.username}</h2>
            <p>{userData.email}</p>
            <Rate disabled value={rating} />
          </div>

          <Form layout="vertical" onFinish={handleUpdateProfile}>
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
                onChange={(e) => setFavoriteMovies(e.target.value.split(", "))}
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

        {/* Password Tab */}
        <TabPane tab="Password" key="2">
          <Form layout="vertical" onFinish={handlePasswordChange}>
            <Form.Item label="Current Password" required>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </Form.Item>

            <Form.Item label="New Password" required>
              <Input.Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
              />
            </Form.Item>

            <Form.Item label="Confirm New Password" required>
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

        {/* Forgot Password Tab */}
        <TabPane tab="Forgot Password" key="3">
          <Form
            layout="vertical"
            onFinish={(values) => handleForgotPassword(values.email)}
          >
            <Form.Item label="Email" required>
              <Input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Delete Account Tab */}
        <TabPane tab="Delete Account" key="4">
          <Button danger type="primary" block onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfileWrapper;
