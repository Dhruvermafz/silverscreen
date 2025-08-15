// src/components/Onboarding/ConfirmationScreen.js
import React, { useState } from "react";
import { message } from "antd";
import {
  useUpdatePreferencesMutation,
  useUpdateRoleMutation,
} from "../../actions/userApi";
import { Link } from "react-router-dom";

const ConfirmationScreen = ({ userId, role, preferences, onComplete }) => {
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async () => {
    try {
      await updatePreferences({ userId, preferences }).unwrap();
      await updateRole({ userId, role }).unwrap();
      message.success("Welcome to DimeCine!", 2);
      onComplete();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save preferences", 2);
    }
  };

  return (
    <div className="confirmation-screen text-center">
      <h3 className="mb-4">You’re Almost There!</h3>
      <p className="mb-2">
        Welcome! You’re a <strong>{role}</strong> who loves{" "}
        {preferences.genres?.join(", ") || "cinema"}.
      </p>
      <p className="mb-4">
        Our community is a sanctuary for cinema lovers. Keep it about films—no
        politics.
        <br />
        <Link to="/community-guidelines">Read our Community Guidelines</Link>.
      </p>
      <div className="form-check mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          id="agreeGuidelines"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          aria-label="Agree to Community Guidelines"
        />
        <label className="form-check-label" htmlFor="agreeGuidelines">
          I agree to the Community Guidelines
        </label>
      </div>
      <button
        className="btn btn-primary"
        disabled={!agreed}
        onClick={handleSubmit}
        aria-label="Join the community"
      >
        Join the Community
      </button>
    </div>
  );
};

export default ConfirmationScreen;
