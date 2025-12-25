import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Rate,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Tooltip,
  Pagination,
  Row,
  Col,
  List,
  Badge,
  Empty,
  Spin,
} from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  MessageOutlined,
  FlagOutlined,
  StarFilled,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

import { useGetAllUsersQuery } from "../../actions/userApi";

const { Title, Text } = Typography;
const { Search } = Input;

const MembersWrapper = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading, isError } = useGetAllUsersQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("activity");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [followedUsers, setFollowedUsers] = useState(new Set());

  const handleFollow = (userId) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Filtered & Sorted Members
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "activity":
          return (b.postCount || 0) - (a.postCount || 0);
        case "joined":
          return new Date(b.joinedAt) - new Date(a.joinedAt);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "favorites":
          return (
            (b.favoriteMovies?.length || 0) - (a.favoriteMovies?.length || 0)
          );
        default:
          return 0;
      }
    });
  }, [members, searchQuery, roleFilter, sortBy]);

  // Top Contributors (most posts)
  const topContributors = useMemo(() => {
    return [...members]
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, 6);
  }, [members]);

  // Pagination
  const paginatedMembers = useMemo(() => {
    return filteredAndSortedMembers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredAndSortedMembers, currentPage]);

  const totalMembers = filteredAndSortedMembers.length;

  // Get shared favorite movie match (simple mock)
  const getSharedMovieMatch = (user) => {
    // In real app: compare with current user's favorites
    if (user.favoriteMovies?.length > 0) {
      return user.favoriteMovies[0];
    }
    return "None yet";
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Spin size="large" tip="Loading community members..." />
      </div>
    );
  }

  if (isError || members.length === 0) {
    return (
      <Empty
        description="No members found or failed to load"
        className="py-8"
      />
    );
  }

  return (
    <div className="members-page container py-5">
      <Row gutter={[32, 32]}>
        {/* Sidebar */}
        <Col xs={24} lg={6}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Community Stats */}
            <Card
              title={
                <Title level={4} className="mb-0">
                  Community Stats
                </Title>
              }
              bordered={false}
              style={{ borderRadius: 16 }}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div className="d-flex justify-content-between">
                  <Text type="secondary">Total Members</Text>
                  <Text strong>{members.length}</Text>
                </div>
                <div className="d-flex justify-content-between">
                  <Text type="secondary">Active This Month</Text>
                  <Text strong>
                    {members.filter((u) => u.postCount > 0).length}
                  </Text>
                </div>
                <div className="d-flex justify-content-between">
                  <Text type="secondary">Total Posts</Text>
                  <Text strong>
                    {members.reduce((sum, u) => sum + (u.postCount || 0), 0)}
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Top Contributors */}
            <Card
              title={
                <Title level={4} className="mb-0">
                  <FireOutlined /> Top Contributors
                </Title>
              }
              bordered={false}
              style={{ borderRadius: 16 }}
            >
              <List
                dataSource={topContributors}
                renderItem={(user) => (
                  <List.Item
                    actions={[
                      <Button
                        size="small"
                        type={
                          followedUsers.has(user._id) ? "default" : "primary"
                        }
                        icon={
                          followedUsers.has(user._id) ? (
                            <UserDeleteOutlined />
                          ) : (
                            <UserAddOutlined />
                          )
                        }
                        onClick={() => handleFollow(user._id)}
                      >
                        {followedUsers.has(user._id) ? "Unfollow" : "Follow"}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={user.avatar}
                          size={48}
                          style={{
                            border: "3px solid #fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          }}
                        />
                      }
                      title={
                        <Link
                          to={`/u/${user._id}`}
                          className="text-dark fw-bold"
                        >
                          {user.username}
                        </Link>
                      }
                      description={
                        <Space size="small">
                          <Text type="secondary">{user.postCount} posts</Text>
                          {user.role && (
                            <Tag color="volcano" bordered={false}>
                              {user.role}
                            </Tag>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={18}>
          {/* Header & Filters */}
          <div className="mb-5">
            <Title level={1} className="mb-2">
              Community Members
            </Title>
            <Text type="secondary" style={{ fontSize: "1.1rem" }}>
              Connect with fellow cinephiles • {totalMembers} member
              {totalMembers !== 1 ? "s" : ""} found
            </Text>

            <Space className="mt-4 w-100" size="middle" wrap>
              <Search
                placeholder="Search by username or bio..."
                allowClear
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 300 }}
                size="large"
              />
              <Select
                defaultValue="all"
                onChange={setRoleFilter}
                style={{ width: 180 }}
                size="large"
              >
                <Select.Option value="all">All Roles</Select.Option>
                <Select.Option value="creator">Creators</Select.Option>
                <Select.Option value="moderator">Moderators</Select.Option>
                <Select.Option value="member">Members</Select.Option>
              </Select>
              <Select
                defaultValue="activity"
                onChange={setSortBy}
                style={{ width: 200 }}
                size="large"
              >
                <Select.Option value="activity">
                  <FireOutlined /> Most Active
                </Select.Option>
                <Select.Option value="joined">
                  <ClockCircleOutlined /> Recently Joined
                </Select.Option>
                <Select.Option value="rating">
                  <StarFilled /> Highest Rated
                </Select.Option>
                <Select.Option value="favorites">Most Favorites</Select.Option>
              </Select>
            </Space>
          </div>

          {/* Members Grid */}
          {paginatedMembers.length === 0 ? (
            <Empty description="No members match your filters" />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {paginatedMembers.map((user) => (
                  <Col xs={24} sm={12} lg={12} xl={8} key={user._id}>
                    <Card
                      hoverable
                      className="member-card h-100"
                      style={{ borderRadius: 16 }}
                      onClick={() => navigate(`/u/${user._id}`)}
                    >
                      <div className="d-flex gap-4">
                        <Avatar
                          src={user.avatar}
                          size={80}
                          className="flex-shrink-0"
                          style={{
                            border: "4px solid #fff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        />

                        <div className="flex-grow-1">
                          <Space
                            align="start"
                            className="w-100 justify-content-between"
                          >
                            <div>
                              <Title level={4} className="mb-1">
                                {user.username}
                                {user.role && (
                                  <Tag
                                    color={
                                      user.role === "creator"
                                        ? "gold"
                                        : user.role === "moderator"
                                        ? "blue"
                                        : "green"
                                    }
                                    className="ms-2"
                                  >
                                    {user.role}
                                  </Tag>
                                )}
                              </Title>
                              <Text type="secondary" className="d-block mb-2">
                                {user.bio || "No bio yet"}
                              </Text>

                              <Space size="large" className="mb-3">
                                <Tooltip title="Posts">
                                  <Space>
                                    <FireOutlined />
                                    <Text strong>{user.postCount || 0}</Text>
                                  </Space>
                                </Tooltip>
                                <Tooltip title="Favorite Movies">
                                  <Space>
                                    <StarFilled style={{ color: "#fadb14" }} />
                                    <Text strong>
                                      {user.favoriteMovies?.length || 0}
                                    </Text>
                                  </Space>
                                </Tooltip>
                                <Tooltip title="Rating">
                                  <Rate
                                    disabled
                                    allowHalf
                                    value={user.rating || 0}
                                    style={{ fontSize: 16 }}
                                  />
                                </Tooltip>
                              </Space>

                              <Text type="secondary" className="d-block">
                                Shared favorite:{" "}
                                <strong>{getSharedMovieMatch(user)}</strong>
                              </Text>
                            </div>

                            <Space direction="vertical" size="small">
                              <Button
                                type={
                                  followedUsers.has(user._id)
                                    ? "default"
                                    : "primary"
                                }
                                icon={
                                  followedUsers.has(user._id) ? (
                                    <UserDeleteOutlined />
                                  ) : (
                                    <UserAddOutlined />
                                  )
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFollow(user._id);
                                }}
                              >
                                {followedUsers.has(user._id)
                                  ? "Unfollow"
                                  : "Follow"}
                              </Button>

                              <Button
                                icon={<MessageOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/messages/${user._id}`);
                                }}
                              >
                                Message
                              </Button>
                            </Space>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalMembers > pageSize && (
                <div className="text-center mt-5">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalMembers}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MembersWrapper;
