import React from "react";
import { Progress } from "antd";

const ProgressBar = ({ current, total }) => {
  const percent = ((current / total) * 100).toFixed(0);
  return (
    <div className="progress-bar">
      <Progress percent={percent} showInfo={false} />
      <span>
        Step {current} of {total}
      </span>
    </div>
  );
};

export default ProgressBar;
