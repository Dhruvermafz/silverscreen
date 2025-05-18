import React from "react";
import {
  Card,
  Button,
  Badge,
  Dropdown,
  OverlayTrigger,
  Tooltip as BSTooltip,
} from "react-bootstrap";
import { FaUser, FaShareAlt, FaFlag, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GroupCard = ({ group, onJoin, onLeave, userRole }) => {
  const handleButtonClick = (e, callback, action) => {
    e.stopPropagation();
    callback(group._id);
    toast.success(`${action} group successfully`, {
      position: "top-right",
      autoClose: 2000,
    });
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
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleShare}>
        <FaShareAlt className="me-2" /> Share
      </Dropdown.Item>
      <Dropdown.Item onClick={handleReport}>
        <FaFlag className="me-2" /> Report
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  return (
    <Link to={`/group/${group._id}`} style={{ textDecoration: "none" }}>
      <Card className="group-card h-100">
        <Card.Img
          variant="top"
          src={group.coverImage || "https://via.placeholder.com/300x100"}
          style={{ height: "100px", objectFit: "cover" }}
          alt={`${group.name} cover`}
        />
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <img
              src={group.avatar || "https://via.placeholder.com/40"}
              alt={`${group.name} avatar`}
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <Card.Title as="h5" className="mb-0">
              {group.name}
            </Card.Title>
            <Badge
              bg={group.isPrivate ? "danger" : "success"}
              className="ms-auto"
            >
              {group.isPrivate ? "Private" : "Public"}
            </Badge>
          </div>
          <Card.Text className="group-card-description">
            {group.description || "No description available"}
          </Card.Text>
          <div className="mb-3">
            <p className="mb-1">
              <FaUser className="me-1" /> {group.members.length} Members
            </p>
            <p className="mb-1">Posts: {group.postCount || 0}</p>
            <p className="mb-1">
              Created: {new Date(group.createdAt).toLocaleDateString()}
            </p>
            {group.recentActivity && (
              <p className="mb-1 text-muted group-card-recent">
                Latest: {group.recentActivity.title || "No recent activity"}
              </p>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="d-flex flex-wrap gap-2">
              {userRole === "none" && (
                <OverlayTrigger
                  placement="top"
                  overlay={<BSTooltip>Join this group</BSTooltip>}
                >
                  <Button
                    variant="primary"
                    onClick={(e) => handleButtonClick(e, onJoin, "Joined")}
                    aria-label={`Join ${group.name}`}
                  >
                    Join Group
                  </Button>
                </OverlayTrigger>
              )}
              {userRole === "member" && (
                <OverlayTrigger
                  placement="top"
                  overlay={<BSTooltip>Leave this group</BSTooltip>}
                >
                  <Button
                    variant="outline-secondary"
                    onClick={(e) => handleButtonClick(e, onLeave, "Left")}
                    aria-label={`Leave ${group.name}`}
                  >
                    Leave Group
                  </Button>
                </OverlayTrigger>
              )}
              {userRole === "creator" && (
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={<BSTooltip>Edit this group</BSTooltip>}
                  >
                    <Button
                      variant="outline-primary"
                      onClick={handleEditGroup}
                      aria-label={`Edit ${group.name}`}
                    >
                      <FaEdit className="me-1" /> Edit Group
                    </Button>
                  </OverlayTrigger>
                  <Badge bg="warning" text="dark">
                    Creator
                  </Badge>
                </>
              )}
              {userRole === "moderator" && (
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={<BSTooltip>Manage this group</BSTooltip>}
                  >
                    <Button
                      variant="outline-primary"
                      onClick={handleEditGroup}
                      aria-label={`Manage ${group.name}`}
                    >
                      Manage
                    </Button>
                  </OverlayTrigger>
                  <Badge bg="primary">Moderator</Badge>
                </>
              )}
              <Dropdown drop="up">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id={`dropdown-${group._id}`}
                  aria-label="More actions"
                >
                  More
                </Dropdown.Toggle>
                {actionMenu}
              </Dropdown>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default GroupCard;
