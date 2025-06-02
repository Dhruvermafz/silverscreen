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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./groups.css";

const { Text, Paragraph } = Typography;

const GroupCard = ({ group, onJoin, onLeave, userRole, onView, className }) => {
  const handleButtonClick = (e, callback, action) => {
    e.stopPropagation();
    callback(group._id);
  };

  const handleEditGroup = (e) => {
    e.stopPropagation();
    toast.info(`Editing group: ${group.name}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      window.location.origin + `/group/${group._id}`
    );
    toast.info(`Shared group: ${group.name}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReport = (e) => {
    e.stopPropagation();
    toast.info(`Reported group: ${group.name}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const actionMenu = (
    <Menu className="group-card-dropdown-menu">
      <Menu.Item key="share" onClick={handleShare}>
        <ShareAltOutlined /> Share
      </Menu.Item>
      <Menu.Item key="report" onClick={handleReport}>
        <FlagOutlined /> Report
      </Menu.Item>
    </Menu>
  );

  return (
    <Link
      to={`/group/${group._id}`}
      className="group-card-link"
      aria-label={`View ${group.name} group`}
    >
      <Card
        className={`group-card ${className || ""}`}
        cover={
          <img
            alt={`${group.name} cover`}
            src={group.coverImage || "https://placehold.co/600x400"}
            className="group-card-cover"
          />
        }
        title={
          <Space className="group-card-title">
            <Avatar
              src={group.avatar}
              icon={<UserOutlined />}
              size={40}
              className="group-card-avatar"
              alt={`${group.name} avatar`}
            />
            <Text strong className="group-card-name">
              {group.name}
            </Text>
          </Space>
        }
        extra={
          <Tag
            className="group-card-tag"
            color={group.isPrivate ? "red" : "green"}
          >
            {group.isPrivate ? "Private" : "Public"}
          </Tag>
        }
        hoverable
      >
        <Paragraph ellipsis={{ rows: 2 }} className="group-card-description">
          {group.description || "No description available"}
        </Paragraph>
        <Space direction="vertical" className="group-card-stats">
          <Text>
            <UserOutlined /> {group.members?.length || 0} Members
          </Text>
          <Text>Posts: {group.postCount || 0}</Text>
          <Text>Created: {new Date(group.createdAt).toLocaleDateString()}</Text>
          {group.recentActivity && (
            <Text type="secondary" ellipsis className="group-card-activity">
              Latest: {group.recentActivity.title || "No recent activity"}
            </Text>
          )}
        </Space>
        <div
          className="group-card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <Space>
            {userRole === "none" && (
              <Tooltip title="Join this group">
                <Button
                  type="primary"
                  onClick={(e) => handleButtonClick(e, onJoin, "Joined")}
                  className="group-card-button"
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
                  className="group-card-button"
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
                  className="group-card-button"
                  aria-label={`Edit ${group.name}`}
                >
                  Edit Group
                </Button>
                <Tag color="gold" className="group-card-role-tag">
                  Creator
                </Tag>
              </Space>
            )}
            {userRole === "moderator" && (
              <Space>
                <Button
                  onClick={handleEditGroup}
                  className="group-card-button"
                  aria-label={`Manage ${group.name}`}
                >
                  Manage
                </Button>
                <Tag color="blue" className="group-card-role-tag">
                  Moderator
                </Tag>
              </Space>
            )}
            <Dropdown
              overlay={actionMenu}
              trigger={["click"]}
              overlayClassName="group-card-dropdown"
            >
              <Button
                className="group-card-button"
                aria-label="More actions for group"
              >
                More
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;
