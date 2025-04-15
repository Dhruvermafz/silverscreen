import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
} from "@ant-design/icons";
import "./footer.css"; // Link to your custom footer CSS

const { Footer } = Layout;
const { Link, Text } = Typography;

const AppFooter = () => {
  return (
    <Footer className="bg-gray-900 text-white py-8 mt-12">
      <Row gutter={[16, 16]} justify="space-between" className="px-4 md:px-12">
        <Col xs={24} md={8}>
          <Text className="text-lg font-semibold text-white">
            SilverScreeninSight
          </Text>
          <p className="text-gray-400 mt-2">
            Discover, discuss, and review films with a passionate community.
          </p>
        </Col>

        <Col xs={12} md={8}>
          <Text className="text-white font-medium">Quick Links</Text>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Films
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Lists
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Members
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </Col>

        <Col xs={12} md={8}>
          <Text className="text-white font-medium">Follow Us</Text>
          <Space size="middle" className="mt-2 text-xl text-gray-400">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <GithubOutlined className="hover:text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <TwitterOutlined className="hover:text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <InstagramOutlined className="hover:text-white" />
            </a>
            <a href="mailto:support@silverscreeninsight.com">
              <MailOutlined className="hover:text-white" />
            </a>
          </Space>
        </Col>
      </Row>

      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} SilverScreeninSight. All rights reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
