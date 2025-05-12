import React from "react";
import { Card, Button, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const NewsroomCard = ({ newsroom, onFollow, onUnfollow, isFollowing }) => {
  return (
    <Card
      title={newsroom.title}
      extra={<Tag color="blue">Newsroom</Tag>}
      style={{ marginBottom: 16 }}
    >
      <p>{newsroom.description}</p>
      <p>
        <EyeOutlined /> {newsroom.followerCount} Followers
      </p>
      {!isFollowing ? (
        <Button type="primary" onClick={() => onFollow(newsroom.id)}>
          Follow
        </Button>
      ) : (
        <Button onClick={() => onUnfollow(newsroom.id)}>Unfollow</Button>
      )}
    </Card>
  );
};

export default NewsroomCard;
