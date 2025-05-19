import React from "react";
import { Card, Button, Tag, Typography, Space, Tooltip, Dropdown } from "antd";
import { EyeOutlined, UserOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text, Paragraph } = Typography;

const NewsroomCard = ({
  newsroom,
  onFollow,
  onUnfollow,
  isFollowing,
  actionMenu,
}) => {
  const navigate = useNavigate();

  const handleFollow = () => {
    try {
      onFollow(newsroom.id);
      toast.success(`Followed ${newsroom.title}`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to follow newsroom", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleUnfollow = () => {
    try {
      onUnfollow(newsroom.id);
      toast.success(`Unfollowed ${newsroom.title}`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to unfollow newsroom", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <Card
      cover={
        <img
          src={newsroom.coverImage || "https://via.placeholder.com/300x150"}
          alt={`${newsroom.title} cover`}
          className="newsroom-card-cover"
        />
      }
      actions={[
        !isFollowing ? (
          <Tooltip title={`Follow ${newsroom.title}`}>
            <Button
              type="primary"
              onClick={handleFollow}
              aria-label={`Follow ${newsroom.title}`}
            >
              Follow
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title={`Unfollow ${newsroom.title}`}>
            <Button
              onClick={handleUnfollow}
              aria-label={`Unfollow ${newsroom.title}`}
            >
              Unfollow
            </Button>
          </Tooltip>
        ),
        actionMenu && (
          <Dropdown overlay={actionMenu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} aria-label="More actions" />
          </Dropdown>
        ),
      ]}
      hoverable
      className={`newsroom-card ${newsroom.isFeatured ? "featured" : ""}`}
    >
      <Title
        level={4}
        className="newsroom-card-title"
        onClick={() => navigate(`/newsroom/${newsroom.id}`)}
      >
        {newsroom.title}
        {newsroom.isFeatured && (
          <Tag color="gold" style={{ marginLeft: 8 }}>
            Featured
          </Tag>
        )}
      </Title>
      <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
        {newsroom.description || "No description available"}
      </Paragraph>
      <Space direction="vertical" size="small">
        <Text>
          <UserOutlined />{" "}
          {newsroom.followers?.length || newsroom.followerCount || 0} Members
        </Text>
        <Text>
          <Tag color={newsroom.isPrivate ? "red" : "green"}>
            {newsroom.isPrivate ? "Private" : "Public"}
          </Tag>
        </Text>
        {newsroom.recentPost && (
          <Text type="secondary">
            Latest: {newsroom.recentPost.title || "No recent posts"}
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default NewsroomCard;
