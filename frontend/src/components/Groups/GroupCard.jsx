import React from "react";
import { Card, Button, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const GroupCard = ({ group, onJoin, onLeave, userRole }) => {
  // Prevent Link navigation when clicking buttons
  const handleButtonClick = (e, callback) => {
    e.stopPropagation(); // Stop event from bubbling to Link
    callback(group._id); // Use _id instead of id
  };

  return (
    <Link to={`/group/${group._id}`} style={{ textDecoration: "none" }}>
      <Card
        title={group.name}
        extra={
          <Tag color={group.isPrivate ? "red" : "green"}>
            {group.isPrivate ? "Private" : "Public"}
          </Tag>
        }
        style={{ marginBottom: 16 }}
        hoverable // Add hover effect for better UX
      >
        <p>{group.description || "No description available"}</p>
        <p>
          <UserOutlined /> {group.members.length} Members
        </p>
        <div onClick={(e) => e.stopPropagation()}>
          {" "}
          {/* Prevent Link navigation for buttons */}
          {userRole === "none" && (
            <Button
              type="primary"
              onClick={(e) => handleButtonClick(e, onJoin)}
            >
              Join Group
            </Button>
          )}
          {userRole === "member" && (
            <Button onClick={(e) => handleButtonClick(e, onLeave)}>
              Leave Group
            </Button>
          )}
          {userRole === "creator" && <Button disabled>Creator</Button>}
          {userRole === "moderator" && <Tag color="blue">Moderator</Tag>}
        </div>
      </Card>
    </Link>
  );
};

export default GroupCard;
