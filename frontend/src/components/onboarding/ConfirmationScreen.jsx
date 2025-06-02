import React, { useState } from "react";
import { Button, Checkbox, Typography, message } from "antd";
import {
  useUpdatePreferencesMutation,
  useUpdateRoleMutation,
} from "../../actions/userApi";

const { Title, Paragraph } = Typography;

const ConfirmationScreen = ({ userId, role, preferences, onComplete }) => {
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async () => {
    try {
      await updatePreferences({ userId, preferences }).unwrap();
      await updateRole({ userId, role }).unwrap();
      message.success("Welcome to CineNotes!");
      onComplete();
    } catch (error) {
      message.error("Failed to save preferences");
    }
  };

  return (
    <div className="confirmation-screen">
      <Title level={3}>You’re Almost There!</Title>
      <Paragraph>
        Welcome! You’re a {role} who loves{" "}
        {preferences.genres?.join(", ") || "cinema"}.
      </Paragraph>
      <Paragraph>
        Our community is a sanctuary for cinema lovers. Keep it about films—no
        politics.
      </Paragraph>
      <Checkbox onChange={(e) => setAgreed(e.target.checked)}>
        I agree to the Community Guidelines
      </Checkbox>
      <Button
        type="primary"
        className="confirmation-button"
        disabled={!agreed}
        onClick={handleSubmit}
      >
        Join the Community
      </Button>
    </div>
  );
};

export default ConfirmationScreen;
