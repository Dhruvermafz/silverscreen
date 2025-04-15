import React from "react";
import { Button, Typography, Tooltip } from "antd";
import {
  HeartFilled,
  EyeFilled,
  MessageFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";
import "./movies.css";
const { Title, Paragraph, Link } = Typography;

const MovieSidebar = () => {
  return (
    <div className="sidebar-container">
      <img
        alt="Paddington in Peru movie poster"
        className="w-full rounded-lg shadow-lg"
        height="450"
        src="https://storage.googleapis.com/a1aa/image/W1sNrRpcuUp1VcsmZeQYN01loDotuhVKP27LSz1ugk8.jpg"
        width="300"
      />

      <div className="flex items-center space-x-4 mt-4 text-white text-sm">
        <Tooltip title="Likes">
          <div className="flex items-center space-x-1">
            <HeartFilled className="text-green-500" />
            <span>170K</span>
          </div>
        </Tooltip>
        <Tooltip title="Views">
          <div className="flex items-center space-x-1">
            <EyeFilled className="text-blue-500" />
            <span>39K</span>
          </div>
        </Tooltip>
        <Tooltip title="Comments">
          <div className="flex items-center space-x-1">
            <MessageFilled className="text-yellow-500" />
            <span>52K</span>
          </div>
        </Tooltip>
      </div>

      <div className="mt-6 text-white">
        <Title level={4} style={{ color: "white" }}>
          Where to Watch
        </Title>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          className="mt-2"
          href="https://youtu.be/NTvudSGfHRI?si=P433FQN7fIiYhvIU"
          target="_blank"
        >
          Trailer
        </Button>
        <Paragraph className="mt-2 mb-0 text-gray-300">
          Not streaming.
        </Paragraph>
        <Link className="text-blue-500" href="#">
          All services...
        </Link>
      </div>
    </div>
  );
};

export default MovieSidebar;
