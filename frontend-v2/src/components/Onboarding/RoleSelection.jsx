// src/components/Onboarding/RoleSelection.js
import React, { useState } from "react";

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
    <div className="role-selection text-center">
      <h3 className="mb-4">How do you want to engage?</h3>
      <div className="d-flex flex-column align-items-center gap-3">
        {roles.map((r) => (
          <div key={r.value} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="role"
              id={r.value}
              value={r.value}
              checked={role === r.value}
              onChange={(e) => setRole(e.target.value)}
              aria-label={r.label}
            />
            <label
              className="form-check-label"
              htmlFor={r.value}
              title={r.description}
            >
              {r.label} <small className="text-muted">({r.description})</small>
            </label>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary mt-4"
        onClick={() => onNext(role)}
        aria-label="Proceed to next step"
      >
        Next
      </button>
    </div>
  );
};

export default RoleSelection;
