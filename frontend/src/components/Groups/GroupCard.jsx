import React from "react";
import {
  Card,
  Button,
  Tag,
  Avatar,
  Space,
  Typography,
  Menu,
  Dropdown,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  ShareAltOutlined,
  FlagOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./groups.css";

const { Text, Paragraph } = Typography;

const GroupCard = ({ group, onJoin, onLeave, userRole, onView, className }) => {
  const handleButtonClick = (e, callback, action) => {
    e.stopPropagation();
    callback(group._id);
  };

  const handleEditGroup = (e) => {
    e.stopPropagation();
    toast.info(`Editing community: ${group.name}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/group/${group._id}`
    );
    toast.success(`Link copied for ${group.name}!`);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    toast.info(`Reported community: ${group.name}`);
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
    <Card
      className={`group-card ${className || ""}`}
      cover={
        <div className="group-card-banner">
          <img
            alt={`${group.name} banner`}
            src={group.coverImage || "https://placehold.co/600x200"}
            className="group-card-cover"
          />
        </div>
      }
      hoverable
      onClick={onView}
      tabIndex={0}
      role="button"
      aria-label={`View ${group.name} community`}
    >
      <div className="group-card-header">
        <Space align="center">
          <Avatar
            src={group.avatar}
            icon={<UserOutlined />}
            size={32}
            className="group-card-avatar"
            alt={`${group.name} avatar`}
          />
          <Text strong className="group-card-name">
            r/{group.name}
          </Text>
          <Tag
            className="group-card-tag"
            color={group.isPrivate ? "red" : "green"}
          >
            {group.isPrivate ? "Private" : "Public"}
          </Tag>
        </Space>
      </div>
      <Paragraph ellipsis={{ rows: 2 }} className="group-card-description">
        {group.description || "No description available"}
      </Paragraph>
      <Space direction="vertical" size={4} className="group-card-stats">
        <Text>
          <UserOutlined /> {group.members?.length || 0} Members
        </Text>
        <Text>{group.postCount || 0} Posts</Text>
        <Text type="secondary">
          Created {new Date(group.createdAt).toLocaleDateString()}
        </Text>
        {group.recentActivity && (
          <Text type="secondary" ellipsis className="group-card-activity">
            Latest: {group.recentActivity.title || "No recent activity"}
          </Text>
        )}
      </Space>
      <div className="group-card-actions" onClick={(e) => e.stopPropagation()}>
        <Space size="small">
          {userRole === "none" && (
            <Tooltip title="Join this community">
              <Button
                type="primary"
                size="small"
                onClick={(e) => handleButtonClick(e, onJoin, "Joined")}
                aria-label={`Join ${group.name}`}
              >
                Join
              </Button>
            </Tooltip>
          )}
          {userRole === "member" && (
            <Tooltip title="Leave this community">
              <Button
                size="small"
                onClick={(e) => handleButtonClick(e, onLeave, "Left")}
                aria-label={`Leave ${group.name}`}
              >
                Leave
              </Button>
            </Tooltip>
          )}
          {userRole === "creator" && (
            <Space size="small">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={handleEditGroup}
                aria-label={`Edit ${group.name}`}
              >
                Edit
              </Button>
              <Tag color="gold">Creator</Tag>
            </Space>
          )}
          {userRole === "moderator" && (
            <Space size="small">
              <Button
                size="small"
                onClick={handleEditGroup}
                aria-label={`Manage ${group.name}`}
              >
                Manage
              </Button>
              <Tag color="blue">Moderator</Tag>
            </Space>
          )}
          <Dropdown overlay={actionMenu} trigger={["click"]}>
            <Button
              size="small"
              icon={<EllipsisOutlined />}
              aria-label="More actions"
            />
          </Dropdown>
        </Space>
      </div>
    </Card>
  );
};

export default GroupCard;
