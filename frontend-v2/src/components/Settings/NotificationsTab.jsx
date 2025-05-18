import React from "react";
import { Form, Button } from "react-bootstrap";

const NotificationsTab = ({
  notifications,
  setNotifications,
  handleUpdateNotifications,
}) => {
  return (
    <form onSubmit={handleUpdateNotifications}>
      <Form.Group className="mb-3">
        <Form.Label>Email Notifications</Form.Label>
        <Form.Check
          type="switch"
          label="Enable"
          checked={notifications.email}
          onChange={(e) =>
            setNotifications({ ...notifications, email: e.target.checked })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>In-App Notifications</Form.Label>
        <Form.Check
          type="switch"
          label="Enable"
          checked={notifications.inApp}
          onChange={(e) =>
            setNotifications({ ...notifications, inApp: e.target.checked })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Mentions</Form.Label>
        <Form.Check
          type="switch"
          label="Enable"
          checked={notifications.mentions}
          onChange={(e) =>
            setNotifications({ ...notifications, mentions: e.target.checked })
          }
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100">
        Save Notification Settings
      </Button>
    </form>
  );
};

export default NotificationsTab;
