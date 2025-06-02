import React, { useState } from "react";
import {
  List,
  Card,
  Typography,
  Rate,
  Spin,
  message,
  Image,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Avatar,
  Dropdown,
  Menu,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  MessageOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { useGetAllMembersQuery } from "../../actions/userApi";
import "./members.css";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const MembersWrapper = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading, isError } = useGetAllMembersQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("joined");
  const [roleFilter, setRoleFilter] = useState("all");
  const [followedUsers, setFollowedUsers] = useState(new Set()); // Mock followed users

  const roles = [
    { value: "all", label: "All" },
    { value: "creator", label: "Creator" },
    { value: "moderator", label: "Moderator" },
    { value: "member", label: "Member" },
  ];

  if (isLoading) {
    return (
      <div className="members-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    message.error("Failed to load members.");
    return <div className="members-error">Failed to load members.</div>;
  }

  const handleFollow = (userId) => {
    const newFollowed = new Set(followedUsers);
    if (newFollowed.has(userId)) {
      newFollowed.delete(userId);
      message.success("Unfollowed user");
    } else {
      newFollowed.add(userId);
      message.success("Followed user");
    }
    setFollowedUsers(newFollowed);
  };

  const handleMessage = (userId) => {
    message.info("Opening chat with user");
    console.log("Messaging user:", userId);
  };

  const handleReport = (userId) => {
    message.info("User reported");
    console.log("Reporting user:", userId);
  };

  const filteredMembers = members
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => roleFilter === "all" || user.role === roleFilter);

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === "joined") return new Date(b.joinedAt) - new Date(a.joinedAt);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "activity") return (b.postCount || 0) - (a.postCount || 0);
    return 0;
  });

  const topContributors = sortedMembers
    .filter((user) => (user.postCount || 0) > 5)
    .slice(0, 5);

  const dropdownMenu = (user) => (
    <Menu className="members-dropdown-menu">
      <Menu.Item key="message" onClick={() => handleMessage(user._id)}>
        <MessageOutlined /> Message
      </Menu.Item>
      <Menu.Item key="report" onClick={() => handleReport(user._id)}>
        <FlagOutlined /> Report
      </Menu.Item>
    </Menu>
  );

  return (
    <section className="members-page" aria-label="Community members">
      <Row gutter={[24, 24]} className="members-container">
        <Col xs={24} md={16}>
          <Title level={2} className="members-title">
            Community Members
          </Title>
          <Space className="members-filters" wrap>
            <Search
              placeholder="Search members by username"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="members-search"
              aria-label="Search members by username"
              enterButton={<Button>Search</Button>}
            />
            <Select
              defaultValue="all"
              onChange={setRoleFilter}
              className="members-select"
              aria-label="Filter by role"
            >
              {roles.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
            <Select
              defaultValue="joined"
              onChange={setSortBy}
              className="members-select"
              aria-label="Sort members"
            >
              <Option value="joined">Recently Joined</Option>
              <Option value="rating">Highest Rated</Option>
              <Option value="activity">Most Active</Option>
            </Select>
          </Space>
          <Row gutter={[24, 24]} className="members-grid">
            {sortedMembers.length > 0 ? (
              sortedMembers.map((user) => (
                <Col key={user._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    className="member-card"
                    actions={[
                      <Button
                        key="follow"
                        icon={
                          followedUsers.has(user._id) ? (
                            <UserDeleteOutlined />
                          ) : (
                            <UserAddOutlined />
                          )
                        }
                        onClick={() => handleFollow(user._id)}
                        className="member-action-button"
                        aria-label={
                          followedUsers.has(user._id)
                            ? `Unfollow ${user.username}`
                            : `Follow ${user.username}`
                        }
                      >
                        {followedUsers.has(user._id) ? "Unfollow" : "Follow"}
                      </Button>,
                      <Button
                        key="view"
                        onClick={() => navigate(`/u/${user._id}`)}
                        className="member-action-button"
                        aria-label={`View ${user.username}'s profile`}
                      >
                        View Profile
                      </Button>,
                      <Dropdown
                        key="more"
                        overlay={dropdownMenu(user)}
                        trigger={["click"]}
                        overlayClassName="members-dropdown"
                      >
                        <Button
                          className="member-action-button"
                          aria-label="More actions"
                        >
                          More
                        </Button>
                      </Dropdown>,
                    ]}
                  >
                    <div className="member-card-content">
                      <Avatar
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username}`
                        }
                        alt={`Avatar of ${user.username}`}
                        size={64}
                        className="member-avatar"
                      />
                      <Title level={5} className="member-username">
                        <Link
                          to={`/u/${user._id}`}
                          className="member-username-link"
                        >
                          {user.username}
                        </Link>
                        {user.role && (
                          <Tag
                            className="member-role-tag"
                            color={
                              user.role === "creator"
                                ? "gold"
                                : user.role === "moderator"
                                ? "blue"
                                : "green"
                            }
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Tag>
                        )}
                      </Title>
                      <Paragraph ellipsis={{ rows: 2 }} className="member-bio">
                        {user.bio || "No bio provided."}
                      </Paragraph>
                      <Space direction="vertical" className="member-stats">
                        <Rate
                          disabled
                          allowHalf
                          value={user.rating || 0}
                          className="member-rating"
                        />
                        <Text type="secondary">
                          Favorite Movies: {user.favoriteMovies?.length || 0}
                        </Text>
                        <Text type="secondary">
                          Joined: {new Date(user.joinedAt).toLocaleDateString()}
                        </Text>
                        <Text type="secondary">
                          Posts: {user.postCount || 0}
                        </Text>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={24}>
                <Text className="members-empty-text">
                  No members found matching your criteria.
                </Text>
              </Col>
            )}
          </Row>
        </Col>
        <Col xs={24} md={8}>
          <Card
            title="Community Stats"
            className="members-sidebar-card"
            aria-label="Community statistics"
          >
            <Space direction="vertical" className="members-stats-list">
              <Text>Total Members: {members.length}</Text>
              <Text>
                Active Users: {members.filter((u) => u.postCount > 0).length}
              </Text>
              <Text>Top Contributors: {topContributors.length}</Text>
            </Space>
          </Card>
          <Card
            title="Top Contributors"
            className="members-sidebar-card"
            aria-label="Top contributors"
          >
            <List
              dataSource={topContributors}
              renderItem={(user) => (
                <List.Item
                  className="members-contributor-item"
                  actions={[
                    <Button
                      key="follow"
                      size="small"
                      onClick={() => handleFollow(user._id)}
                      className="members-follow-button"
                      aria-label={
                        followedUsers.has(user._id)
                          ? `Unfollow ${user.username}`
                          : `Follow ${user.username}`
                      }
                    >
                      {followedUsers.has(user._id) ? "Unfollow" : "Follow"}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username}`
                        }
                        alt={`Avatar of ${user.username}`}
                      />
                    }
                    title={
                      <Link
                        to={`/u/${user._id}`}
                        className="members-contributor-link"
                      >
                        {user.username}
                      </Link>
                    }
                    description={
                      <Text ellipsis className="members-contributor-bio">
                        {user.bio || "No bio provided"} (Posts: {user.postCount}
                        )
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default MembersWrapper;
