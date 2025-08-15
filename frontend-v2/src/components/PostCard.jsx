import React from "react";
import { Card, Button, Avatar, Space } from "antd";
import { CommentOutlined, LikeOutlined, FlagOutlined } from "@ant-design/icons";

const PostCard = ({ post, onComment, onLike, onFlag, canComment = true }) => {
  return (
    <Card
      title={post.title}
      extra={<Avatar src={post.author.avatar} />}
      style={{ marginBottom: 16 }}
    >
      <p>{post.content}</p>
      <Space>
        <Button icon={<LikeOutlined />} onClick={() => onLike(post.id)}>
          {post.likes} Likes
        </Button>
        {canComment && (
          <Button icon={<CommentOutlined />} onClick={() => onComment(post.id)}>
            {post.comments} Comments
          </Button>
        )}
        <Button icon={<FlagOutlined />} onClick={() => onFlag(post.id, "post")}>
          Flag
        </Button>
      </Space>
    </Card>
  );
};

export default PostCard;
