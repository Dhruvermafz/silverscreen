import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaHeart, FaComment, FaFlag } from "react-icons/fa";

const PostCard = ({
  post,
  onComment,
  onLike,
  onFlag,
  canComment = true,
  extra,
}) => {
  return (
    <Card className="post-card mb-4">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <Card.Title as="h5" className="mb-0">
          {post.title}
        </Card.Title>
        <div className="d-flex align-items-center gap-2">
          <img
            src={post.author?.avatar || "https://via.placeholder.com/40"}
            alt={post.author?.name || "Author"}
            className="rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          {extra}
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text>{post.content}</Card.Text>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={() => onLike(post.id)}
            className="d-flex align-items-center gap-1"
          >
            <FaHeart /> {post.likes || 0} Likes
          </Button>
          {canComment && (
            <Button
              variant="outline-secondary"
              onClick={() => onComment(post.id)}
              className="d-flex align-items-center gap-1"
            >
              <FaComment /> {post.comments?.length || 0} Comments
            </Button>
          )}
          <Button
            variant="outline-danger"
            onClick={() => onFlag(post.id, "post")}
            className="d-flex align-items-center gap-1"
          >
            <FaFlag /> Flag
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
