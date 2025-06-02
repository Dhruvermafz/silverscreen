import React from "react";

const VideoPlayer = ({ src }) => {
  return (
    <video
      className="video-player"
      src={src}
      autoPlay
      loop
      muted
      style={{ width: "100%", maxHeight: 200 }}
    />
  );
};

export default VideoPlayer;
