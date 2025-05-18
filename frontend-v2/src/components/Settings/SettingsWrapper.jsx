import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import SidebarNav from "./SidebarNav";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import NotificationsTab from "./NotificationsTab";
import ForgotPasswordTab from "./ForgotPasswordTab";
import DeleteAccountTab from "./DeleteAccountTab";

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
  const [profileForm, setProfileForm] = useState({
    bio: "",
    favoriteMovies: "",
    favoriteGenres: "",
    socialLinks: { twitter: "", instagram: "" },
    isPublic: true,
    rating: 0,
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: "" });
  const [fileList, setFileList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    mentions: true,
  });
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setProfileForm({
          bio: response.data.bio || "",
          favoriteMovies: response.data.favoriteMovies?.join("\n") || "",
          favoriteGenres: response.data.favoriteGenres?.join("\n") || "",
          socialLinks: response.data.socialLinks || {
            twitter: "",
            instagram: "",
          },
          isPublic: response.data.isPublic !== false,
          rating: response.data.rating || 0,
        });
        setSessions([
          { id: 1, device: "Chrome on Windows", lastActive: "2025-05-15" },
          { id: 2, device: "Safari on iPhone", lastActive: "2025-05-14" },
        ]);
      } catch (err) {
        alert("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        bio: profileForm.bio,
        avatar: fileList.length > 0 ? fileList[0].url : userData.avatar,
        favoriteMovies: profileForm.favoriteMovies
          ? profileForm.favoriteMovies
              .split("\n")
              .map((m) => m.trim())
              .filter(Boolean)
          : [],
        favoriteGenres: profileForm.favoriteGenres
          ? profileForm.favoriteGenres
              .split("\n")
              .map((g) => g.trim())
              .filter(Boolean)
          : [],
        socialLinks: profileForm.socialLinks,
        isPublic: profileForm.isPublic,
        rating: profileForm.rating,
      };
      const response = await axios.put("/api/user/profile", updatedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData(response.data);
      setFileList([]);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
          { uid: file.name, url: response.data.avatar, name: file.name },
        ]);
        setUserData((prev) => ({ ...prev, avatar: response.data.avatar }));
        alert("Avatar uploaded successfully");
      })
      .catch((err) => alert("Failed to upload avatar"));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("Passwords do not match");
    }
    if (passwordForm.newPassword.length < 8) {
      return alert("Password must be at least 8 characters");
    }
    try {
      await axios.post(
        "/api/user/change-password",
        {
          oldPassword: passwordForm.password,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Password changed successfully");
      setPasswordForm({ password: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert("Failed to change password");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordForm.email)) {
      return alert("Please enter a valid email");
    }
    try {
      await axios.post("/api/user/forgot-password", {
        email: forgotPasswordForm.email,
      });
      alert("Password reset link sent");
      setForgotPasswordForm({ email: "" });
    } catch (err) {
      alert("Failed to send reset link");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/api/user/delete-account", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Account deleted successfully");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  const handleToggle2FA = async (checked) => {
    try {
      setTwoFactorEnabled(checked);
      alert(`Two-factor authentication ${checked ? "enabled" : "disabled"}`);
    } catch (err) {
      alert("Failed to update 2FA settings");
    }
  };

  const handleUpdateNotifications = async (e) => {
    e.preventDefault();
    try {
      alert("Notification settings updated");
    } catch (err) {
      alert("Failed to update notification settings");
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      setSessions(sessions.filter((s) => s.id !== sessionId));
      alert("Session terminated");
    } catch (err) {
      alert("Failed to terminate session");
    }
  };

  const handleRatingChange = (value) => {
    setProfileForm((prev) => ({ ...prev, rating: value }));
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container fluid className="settings-page py-4">
      <Row>
        <Col xs={12} md={3}>
          <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </Col>
        <Col xs={12} md={9}>
          <h2 className="mb-4">Account Settings</h2>
          <Tabs
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
            className="mb-3"
          >
            <Tab eventKey="profile" title="Profile">
              <ProfileTab
                userData={userData}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                fileList={fileList}
                setFileList={setFileList}
                handleUpdateProfile={handleUpdateProfile}
                handleUploadAvatar={handleUploadAvatar}
                handleRatingChange={handleRatingChange}
              />
            </Tab>
            <Tab eventKey="security" title="Security">
              <SecurityTab
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                handlePasswordChange={handlePasswordChange}
                twoFactorEnabled={twoFactorEnabled}
                handleToggle2FA={handleToggle2FA}
                sessions={sessions}
                handleTerminateSession={handleTerminateSession}
              />
            </Tab>
            <Tab eventKey="notifications" title="Notifications">
              <NotificationsTab
                notifications={notifications}
                setNotifications={setNotifications}
                handleUpdateNotifications={handleUpdateNotifications}
              />
            </Tab>
            <Tab eventKey="forgot-password" title="Forgot Password">
              <ForgotPasswordTab
                forgotPasswordForm={forgotPasswordForm}
                setForgotPasswordForm={setForgotPasswordForm}
                handleForgotPassword={handleForgotPassword}
              />
            </Tab>
            <Tab eventKey="delete" title="Delete Account">
              <DeleteAccountTab
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                handleDeleteAccount={handleDeleteAccount}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsWrapper;
