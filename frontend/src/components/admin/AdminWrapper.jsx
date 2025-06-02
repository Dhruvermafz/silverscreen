import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Button, Typography, Space, Spin } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Common/Sidebar";

const { Title } = Typography;

const AdminWrapper = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    subscriptions: { value: 1678, change: "+15" },
    itemsAdded: { value: 376, change: "-44" },
    views: { value: 509573, change: "+3.1%" },
    reviews: { value: 642, change: "+8" },
  });
  const [topItems, setTopItems] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock API calls (replace with actual API)
      setTopItems([
        { id: 241, title: "The Lost City", category: "Movie", rating: 9.2 },
        { id: 825, title: "Undercurrents", category: "Movie", rating: 9.1 },
        {
          id: 9271,
          title: "Tales from the Underworld",
          category: "TV Series",
          rating: 9.0,
        },
      ]);
      setLatestItems([
        {
          id: 824,
          title: "I Dream in Another Language",
          category: "TV Series",
          rating: 7.2,
        },
        { id: 602, title: "Benched", category: "Movie", rating: 6.3 },
        { id: 538, title: "Whitney", category: "TV Show", rating: 8.4 },
      ]);
      setLatestUsers([
        {
          id: 23,
          fullName: "Brian Cranston",
          email: "bcxwz@email.com",
          username: "BrianXWZ",
        },
        {
          id: 22,
          fullName: "Jesse Plemons",
          email: "jess@email.com",
          username: "Jesse.P",
        },
        {
          id: 21,
          fullName: "Matt Jones",
          email: "matt@email.com",
          username: "Matty",
        },
      ]);
      setLatestReviews([
        {
          id: 824,
          item: "I Dream in Another Language",
          author: "Eliza Josceline",
          rating: 7.2,
        },
        { id: 602, item: "Benched", author: "Ketut", rating: 6.3 },
        { id: 538, item: "Whitney", author: "Brian Cranston", rating: 8.4 },
      ]);
    } catch (error) {
      toast.error("Failed to load dashboard data", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (section) => {
    toast.info(`Refreshing ${section}...`, {
      position: "top-right",
      autoClose: 2000,
    });
    fetchDashboardData();
  };

  const statCards = [
    {
      title: "Subscriptions",
      value: stats.subscriptions.value,
      change: stats.subscriptions.change,
      changeClass: "green",
      icon: <UserOutlined />,
    },
    {
      title: "Items Added",
      value: stats.itemsAdded.value,
      change: stats.itemsAdded.change,
      changeClass: "red",
      icon: <VideoCameraOutlined />,
    },
    {
      title: "Views",
      value: stats.views.value.toLocaleString(),
      change: stats.views.change,
      changeClass: "green",
      icon: <EyeOutlined />,
    },
    {
      title: "Reviews",
      value: stats.reviews.value,
      change: stats.reviews.change,
      changeClass: "green",
      icon: <StarOutlined />,
    },
  ];

  const topItemsColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <span>
          <StarOutlined /> {rating}
        </span>
      ),
    },
  ];

  const latestItemsColumns = topItemsColumns;
  const latestUsersColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <a>{text}</a>,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Username", dataIndex: "username", key: "username" },
  ];
  const latestReviewsColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text) => <a>{text}</a>,
    },
    { title: "Author", dataIndex: "author", key: "author" },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <span>
          <StarOutlined /> {rating}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="admin-wrapper-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="admin-wrapper">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="admin-wrapper-header">
              <Title level={3} className="admin-wrapper-title">
                Dashboard
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/add-item")}
                aria-label="Add new item"
              >
                Add Item
              </Button>
            </div>
          </Col>

          {/* Stats Cards */}
          {statCards.map((stat) => (
            <Col xs={24} sm={12} xl={6} key={stat.title}>
              <Card className="admin-wrapper-stat">
                <Space direction="vertical" size="small">
                  <p className="admin-wrapper-stat-title">{stat.title}</p>
                  <Space>
                    <p className="admin-wrapper-stat-value">{stat.value}</p>
                    <p
                      className={`admin-wrapper-stat-change ${stat.changeClass}`}
                    >
                      {stat.change}
                    </p>
                  </Space>
                  <div className="admin-wrapper-stat-icon">{stat.icon}</div>
                </Space>
              </Card>
            </Col>
          ))}

          {/* Top Items */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <StarOutlined />
                  Top Items
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh("top items")}
                    aria-label="Refresh top items"
                  />
                  <Button href="/catalog" aria-label="View all items">
                    View All
                  </Button>
                </Space>
              }
              className="admin-wrapper-table"
            >
              <Table
                columns={topItemsColumns}
                dataSource={topItems}
                pagination={{ pageSize: 3 }}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () => navigate(`/movies/${record.id}`),
                })}
              />
            </Card>
          </Col>

          {/* Latest Items */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <VideoCameraOutlined />
                  Latest Items
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh("latest items")}
                    aria-label="Refresh latest items"
                  />
                  <Button href="/catalog" aria-label="View all items">
                    View All
                  </Button>
                </Space>
              }
              className="admin-wrapper-table"
            >
              <Table
                columns={latestItemsColumns}
                dataSource={latestItems}
                pagination={{ pageSize: 3 }}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () => navigate(`/movies/${record.id}`),
                })}
              />
            </Card>
          </Col>

          {/* Latest Users */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  Latest Users
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh("latest users")}
                    aria-label="Refresh latest users"
                  />
                  <Button href="/users" aria-label="View all users">
                    View All
                  </Button>
                </Space>
              }
              className="admin-wrapper-table"
            >
              <Table
                columns={latestUsersColumns}
                dataSource={latestUsers}
                pagination={{ pageSize: 3 }}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () => navigate(`/users/${record.id}`),
                })}
              />
            </Card>
          </Col>

          {/* Latest Reviews */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <StarOutlined />
                  Latest Reviews
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh("latest reviews")}
                    aria-label="Refresh latest reviews"
                  />
                  <Button href="/reviews" aria-label="View all reviews">
                    View All
                  </Button>
                </Space>
              }
              className="admin-wrapper-table"
            >
              <Table
                columns={latestReviewsColumns}
                dataSource={latestReviews}
                pagination={{ pageSize: 3 }}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () => navigate(`/movies/${record.id}`),
                })}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminWrapper;
