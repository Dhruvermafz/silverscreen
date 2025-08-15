// src/components/Common/ProgressBar.js
import React from "react";

const ProgressBar = ({ current, total }) => {
  const progress = ((current / total) * 100).toFixed(0);

  return (
    <div
      className="progress mb-4"
      role="progressbar"
      aria-label="Onboarding progress"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="progress-bar bg-primary"
        style={{ width: `${progress}%` }}
      >
        Step {current} of {total}
      </div>
    </div>
  );
};

export default ProgressBar;
