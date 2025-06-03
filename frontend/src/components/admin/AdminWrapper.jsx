import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Typography,
  Space,
  Spin,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Common/Sidebar";
import {
  useGetDashboardStatsQuery,
  useGetTopItemsQuery,
  useGetLatestItemsQuery,
  useGetLatestUsersQuery,
  useGetLatestReviewsQuery,
} from "../../actions/adminApi";

const { Title } = Typography;

const AdminWrapper = () => {
  const navigate = useNavigate();
  const [tableParams, setTableParams] = useState({
    topItems: { pagination: { current: 1, pageSize: 5 } },
    latestItems: { pagination: { current: 1, pageSize: 5 } },
    latestUsers: { pagination: { current: 1, pageSize: 5 } },
    latestReviews: { pagination: { current: 1, pageSize: 5 } },
  });

  // API Queries
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery();
  const {
    data: topItems,
    isLoading: topItemsLoading,
    error: topItemsError,
    refetch: refetchTopItems,
  } = useGetTopItemsQuery({
    page: tableParams.topItems.pagination.current,
    pageSize: tableParams.topItems.pagination.pageSize,
  });
  const {
    data: latestItems,
    isLoading: latestItemsLoading,
    error: latestItemsError,
    refetch: refetchLatestItems,
  } = useGetLatestItemsQuery({
    page: tableParams.latestItems.pagination.current,
    pageSize: tableParams.latestItems.pagination.pageSize,
  });
  const {
    data: latestUsers,
    isLoading: latestUsersLoading,
    error: latestUsersError,
    refetch: refetchLatestUsers,
  } = useGetLatestUsersQuery({
    page: tableParams.latestUsers.pagination.current,
    pageSize: tableParams.latestUsers.pagination.pageSize,
  });
  const {
    data: latestReviews,
    isLoading: latestReviewsLoading,
    error: latestReviewsError,
    refetch: refetchLatestReviews,
  } = useGetLatestReviewsQuery({
    page: tableParams.latestReviews.pagination.current,
    pageSize: tableParams.latestReviews.pagination.pageSize,
  });

  // Handle Errors
  if (
    statsError ||
    topItemsError ||
    latestItemsError ||
    latestUsersError ||
    latestReviewsError
  ) {
    toast.error("Failed to load dashboard data", {
      position: "top-right",
      autoClose: 2000,
    });
  }

  const handleRefresh = (section) => {
    const refetchMap = {
      stats: refetchStats,
      "top items": refetchTopItems,
      "latest items": refetchLatestItems,
      "latest users": refetchLatestUsers,
      "latest reviews": refetchLatestReviews,
    };
    refetchMap[section]();
    toast.info(`Refreshed ${section}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleTableChange = (section, pagination, filters, sorter) => {
    setTableParams((prev) => ({
      ...prev,
      [section]: {
        pagination,
        filters,
        sorter,
      },
    }));
  };

  const statCards = [
    {
      title: "Subscriptions",
      value: stats?.subscriptions?.value || 0,
      change: stats?.subscriptions?.change || "0",
      changeClass: stats?.subscriptions?.change.startsWith("+")
        ? "green"
        : "red",
      icon: <UserOutlined aria-label="Subscriptions icon" />,
    },
    {
      title: "Films Added",
      value: stats?.itemsAdded?.value || 0,
      change: stats?.itemsAdded?.change || "0",
      changeClass: stats?.itemsAdded?.change.startsWith("+") ? "green" : "red",
      icon: <VideoCameraOutlined aria-label="Films added icon" />,
    },
    {
      title: "Views",
      value: stats?.views?.value?.toLocaleString() || "0",
      change: stats?.views?.change || "0",
      changeClass: stats?.views?.change.startsWith("+") ? "green" : "red",
      icon: <EyeOutlined aria-label="Views icon" />,
    },
    {
      title: "Reviews",
      value: stats?.reviews?.value || 0,
      change: stats?.reviews?.change || "0",
      changeClass: stats?.reviews?.change.startsWith("+") ? "green" : "red",
      icon: <StarOutlined aria-label="Reviews icon" />,
    },
  ];

  const topItemsColumns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: true },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          onClick={() => navigate(`/films/${record.id}`)}
          aria-label={`View ${text}`}
        >
          {text}
        </a>
      ),
      sorter: true,
    },
    { title: "Category", dataIndex: "category", key: "category", sorter: true },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <span>
          <StarOutlined aria-hidden="true" /> {rating}
        </span>
      ),
      sorter: true,
    },
  ];

  const latestItemsColumns = topItemsColumns;

  const latestUsersColumns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: true },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <a
          onClick={() => navigate(`/users/${record.id}`)}
          aria-label={`View ${text}`}
        >
          {text}
        </a>
      ),
      sorter: true,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Username", dataIndex: "username", key: "username", sorter: true },
  ];

  const latestReviewsColumns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: true },
    {
      title: "Film",
      dataIndex: "item",
      key: "item",
      render: (text, record) => (
        <a
          onClick={() => navigate(`/films/${record.id}`)}
          aria-label={`View ${text}`}
        >
          {text}
        </a>
      ),
      sorter: true,
    },
    { title: "Author", dataIndex: "author", key: "author", sorter: true },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <span>
          <StarOutlined aria-hidden="true" /> {rating}
        </span>
      ),
      sorter: true,
    },
  ];

  if (
    statsLoading ||
    topItemsLoading ||
    latestItemsLoading ||
    latestUsersLoading ||
    latestReviewsLoading
  ) {
    return (
      <div className="admin-wrapper-loading">
        <Spin size="large" aria-label="Loading dashboard" />
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="admin-wrapper" style={{ marginLeft: 240 }}>
        <Row gutter={[16, 16]} role="region" aria-label="Admin Dashboard">
          <Col span={24}>
            <div className="admin-wrapper-header">
              <Title level={3} className="admin-wrapper-title">
                Dashboard
              </Title>
              <Space>
                <Tooltip title="Add new film">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/add-film")}
                    aria-label="Add new film"
                    className="button"
                  >
                    Add Film
                  </Button>
                </Tooltip>
                <Tooltip title="Manage flagged content">
                  <Button
                    icon={<FlagOutlined />}
                    onClick={() => navigate("/admin/flags")}
                    aria-label="Manage flags"
                    className="button"
                  >
                    Manage Flags
                  </Button>
                </Tooltip>
              </Space>
            </div>
          </Col>

          {/* Stats Cards */}
          {statCards.map((stat) => (
            <Col xs={24} sm={12} xl={6} key={stat.title}>
              <Card className="card admin-wrapper-stat" hoverable>
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

          {/* Top Films */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <StarOutlined aria-hidden="true" />
                  Top Films
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh("top items")}
                    aria-label="Refresh top films"
                  />
                  <Button
                    href="/films"
                    aria-label="View all films"
                    className="button"
                  >
                    View All
                  </Button>
                </Space>
              }
              className="card admin-wrapper-table"
            >
              <Table
                columns={topItemsColumns}
                dataSource={topItems?.data}
                pagination={{
                  ...tableParams.topItems.pagination,
                  total: topItems?.total,
                  showSizeChanger: true,
                }}
                rowKey="id"
                onChange={(pagination, filters, sorter) =>
                  handleTableChange("topItems", pagination, filters, sorter)
                }
                role="grid"
                aria-label="Top films table"
              />
            </Card>
          </Col>

          {/* Latest Films */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <VideoCameraOutlined aria-hidden="true" />
                  Latest Films
                </Space>
              }
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => handleRefresh("latest items")}
                    aria-label="Refresh latest films"
                  />
                  <Button
                    href="/films"
                    aria-label="View all films"
                    className="button"
                  >
                    View All
                  </Button>
                </Space>
              }
              className="card admin-wrapper-table"
            >
              <Table
                columns={latestItemsColumns}
                dataSource={latestItems?.data}
                pagination={{
                  ...tableParams.latestItems.pagination,
                  total: latestItems?.total,
                  showSizeChanger: true,
                }}
                rowKey="id"
                onChange={(pagination, filters, sorter) =>
                  handleTableChange("latestItems", pagination, filters, sorter)
                }
                role="grid"
                aria-label="Latest films table"
              />
            </Card>
          </Col>

          {/* Latest Users */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <UserOutlined aria-hidden="true" />
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
                  <Button
                    href="/users"
                    aria-label="View all users"
                    className="button"
                  >
                    View All
                  </Button>
                </Space>
              }
              className="card admin-wrapper-table"
            >
              <Table
                columns={latestUsersColumns}
                dataSource={latestUsers?.data}
                pagination={{
                  ...tableParams.latestUsers.pagination,
                  total: latestUsers?.total,
                  showSizeChanger: true,
                }}
                rowKey="id"
                onChange={(pagination, filters, sorter) =>
                  handleTableChange("latestUsers", pagination, filters, sorter)
                }
                role="grid"
                aria-label="Latest users table"
              />
            </Card>
          </Col>

          {/* Latest Reviews */}
          <Col xs={24} xl={12}>
            <Card
              title={
                <Space>
                  <StarOutlined aria-hidden="true" />
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
                  <Button
                    href="/reviews"
                    aria-label="View all reviews"
                    className="button"
                  >
                    View All
                  </Button>
                </Space>
              }
              className="card admin-wrapper-table"
            >
              <Table
                columns={latestReviewsColumns}
                dataSource={latestReviews?.data}
                pagination={{
                  ...tableParams.latestReviews.pagination,
                  total: latestReviews?.total,
                  showSizeChanger: true,
                }}
                rowKey="id"
                onChange={(pagination, filters, sorter) =>
                  handleTableChange(
                    "latestReviews",
                    pagination,
                    filters,
                    sorter
                  )
                }
                role="grid"
                aria-label="Latest reviews table"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminWrapper;
