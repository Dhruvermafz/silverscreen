import React from "react";
import {
  Card,
  Button,
  Tag,
  Avatar,
  Space,
  Typography,
  Dropdown,
  Menu,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  ShareAltOutlined,
  FlagOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS

const { Text, Paragraph } = Typography;

const GroupCard = ({ group, onJoin, onLeave, userRole }) => {
  const handleButtonClick = (e, callback, action) => {
    e.stopPropagation(); // Stop event from bubbling to Link
    callback(group._id); // Use _id for action
    toast.success(`${action} group successfully`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleEditGroup = (e) => {
    e.stopPropagation();
    // Mock edit action (replace with actual logic)
    toast.info(`Editing group: ${group.name}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Mock share action (replace with actual logic)
    toast.info(`Shared group: ${group.name}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReport = (e) => {
    e.stopPropagation();
    // Mock report action (replace with actual logic)
    toast.info(`Reported group: ${group.name}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const actionMenu = (
    <Menu>
      <Menu.Item key="share" onClick={handleShare}>
        <ShareAltOutlined /> Share
      </Menu.Item>
      <Menu.Item key="report" onClick={handleReport}>
        <FlagOutlined /> Report
      </Menu.Item>
    </Menu>
  );

  return (
    <Link to={`/group/${group._id}`} style={{ textDecoration: "none" }}>
      <Card
        className="group-card"
        cover={
          <img
            alt={`${group.name} cover`}
            src={group.coverImage || "https://via.placeholder.com/300x100"}
            style={{ height: 100, objectFit: "cover" }}
          />
        }
        title={
          <Space>
            <Avatar
              src={group.avatar || "https://via.placeholder.com/40"}
              icon={<UserOutlined />}
              size={40}
            />
            <Text strong>{group.name}</Text>
          </Space>
        }
        extra={
          <Tag color={group.isPrivate ? "red" : "green"}>
            {group.isPrivate ? "Private" : "Public"}
          </Tag>
        }
        hoverable
      >
        <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
          {group.description || "No description available"}
        </Paragraph>
        <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
          <Text>
            <UserOutlined /> {group.members.length} Members
          </Text>
          <Text>Posts: {group.postCount || 0}</Text>
          <Text>Created: {new Date(group.createdAt).toLocaleDateString()}</Text>
          {group.recentActivity && (
            <Text type="secondary" ellipsis>
              Latest: {group.recentActivity.title || "No recent activity"}
            </Text>
          )}
        </Space>
        <div onClick={(e) => e.stopPropagation()}>
          <Space>
            {userRole === "none" && (
              <Tooltip title="Join this group">
                <Button
                  type="primary"
                  onClick={(e) => handleButtonClick(e, onJoin, "Joined")}
                  aria-label={`Join ${group.name}`}
                >
                  Join Group
                </Button>
              </Tooltip>
            )}
            {userRole === "member" && (
              <Tooltip title="Leave this group">
                <Button
                  onClick={(e) => handleButtonClick(e, onLeave, "Left")}
                  aria-label={`Leave ${group.name}`}
                >
                  Leave Group
                </Button>
              </Tooltip>
            )}
            {userRole === "creator" && (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={handleEditGroup}
                  aria-label={`Edit ${group.name}`}
                >
                  Edit Group
                </Button>
                <Tag color="gold">Creator</Tag>
              </Space>
            )}
            {userRole === "moderator" && (
              <Space>
                <Button
                  onClick={handleEditGroup}
                  aria-label={`Manage ${group.name}`}
                >
                  Manage
                </Button>
                <Tag color="blue">Moderator</Tag>
              </Space>
            )}
            <Dropdown overlay={actionMenu} trigger={["click"]}>
              <Button aria-label="More actions">More</Button>
            </Dropdown>
          </Space>
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;
