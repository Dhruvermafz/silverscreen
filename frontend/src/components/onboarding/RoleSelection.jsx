import React, { useState } from "react";
import { Button, Radio, Typography, Tooltip } from "antd";

const { Title, Paragraph } = Typography;

const RoleSelection = ({ onNext }) => {
  const [role, setRole] = useState("viewer");

  const roles = [
    {
      value: "viewer",
      label: "Viewer",
      description:
        "Love watching films? Discover movies, rate them, create lists, and join groups.",
    },
    {
      value: "filmmaker",
      label: "Filmmaker",
      description:
        "Are you a director or creator? Showcase your work and connect with fans.",
    },
    {
      value: "reviewer",
      label: "Reviewer",
      description:
        "Write 4+ reviews/month to earn a badge. Use /flags/add if no films release.",
    },
  ];

  return (
    <div className="role-selection">
      <Title level={3}>How do you want to engage?</Title>
      <Radio.Group
        onChange={(e) => setRole(e.target.value)}
        value={role}
        className="role-radio-group"
      >
        {roles.map((r) => (
          <Tooltip key={r.value} title={r.description}>
            <Radio value={r.value}>{r.label}</Radio>
          </Tooltip>
        ))}
      </Radio.Group>
      <Button
        type="primary"
        className="role-button"
        onClick={() => onNext(role)}
      >
        Next
      </Button>
    </div>
  );
};

export default RoleSelection;
