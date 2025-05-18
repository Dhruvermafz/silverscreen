import React from "react";
import { Card, Nav } from "react-bootstrap";
import { FiUser, FiLock, FiBell, FiTrash2 } from "react-icons/fi";

const SidebarNav = ({ activeTab, setActiveTab }) => {
  return (
    <Card>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser className="me-2" /> Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          >
            <FiLock className="me-2" /> Security
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          >
            <FiBell className="me-2" /> Notifications
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "delete"}
            onClick={() => setActiveTab("delete")}
          >
            <FiTrash2 className="me-2" /> Delete Account
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Card>
  );
};

export default SidebarNav;
