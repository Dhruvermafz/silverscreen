import React from "react";
import { Form, Button } from "react-bootstrap";

const SecurityTab = ({
  passwordForm,
  setPasswordForm,
  handlePasswordChange,
  twoFactorEnabled,
  handleToggle2FA,
  sessions,
  handleTerminateSession,
}) => {
  return (
    <>
      <form onSubmit={handlePasswordChange}>
        <Form.Group className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your current password"
            value={passwordForm.password}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, password: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your new password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your new password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Change Password
        </Button>
      </form>
      <hr />
      <div className="mb-3">
        <h5>Two-Factor Authentication</h5>
        <Form.Check
          type="switch"
          label="Enable 2FA"
          checked={twoFactorEnabled}
          onChange={(e) => handleToggle2FA(e.target.checked)}
        />
      </div>
      <hr />
      <h5>Active Sessions</h5>
      <ul className="list-group">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{session.device}</strong>
              <div>Last active: {session.lastActive}</div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleTerminateSession(session.id)}
            >
              Terminate
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SecurityTab;
