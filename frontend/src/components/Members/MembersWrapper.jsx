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
      <Spin
        size="large"
        style={{ display: "block", margin: "auto", marginTop: "20vh" }}
      />
    );
  }

  if (isError) {
    message.error("Failed to load members.");
    return null;
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
    if (sortBy === "activity") return (b.postCount || 0) - (a.postCount || 0); // Assume postCount from API
    return 0;
  });

  const topContributors = sortedMembers
    .filter((user) => (user.postCount || 0) > 5) // Mock criteria
    .slice(0, 5);

  const dropdownMenu = (user) => (
    <Menu>
      <Menu.Item key="message" onClick={() => handleMessage(user._id)}>
        <MessageOutlined /> Message
      </Menu.Item>
      <Menu.Item key="report" onClick={() => handleReport(user._id)}>
        <FlagOutlined /> Report
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="members-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Community Members
          </Title>
          <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
            <Search
              placeholder="Search members by username"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setRoleFilter}
            >
              {roles.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
            <Select
              defaultValue="joined"
              style={{ width: 120 }}
              onChange={setSortBy}
            >
              <Option value="joined">Recently Joined</Option>
              <Option value="rating">Highest Rated</Option>
              <Option value="activity">Most Active</Option>
            </Select>
          </Space>
          <Row gutter={[24, 24]}>
            {sortedMembers.map((user) => (
              <Col key={user._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  bodyStyle={{ padding: 16 }}
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
                    >
                      {followedUsers.has(user._id) ? "Unfollow" : "Follow"}
                    </Button>,
                    <Button
                      key="view"
                      onClick={() => navigate(`/u/${user._id}`)}
                    >
                      View Profile
                    </Button>,
                    <Dropdown
                      key="more"
                      overlay={dropdownMenu(user)}
                      trigger={["click"]}
                    >
                      <Button>More</Button>
                    </Dropdown>,
                  ]}
                >
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <Avatar
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username}`
                      }
                      alt={user.username}
                      size={64}
                    />
                  </div>
                  <Title
                    level={5}
                    style={{ textAlign: "center", marginBottom: 8 }}
                  >
                    <Link to={`/u/${user._id}`} style={{ color: "#1890ff" }}>
                      {user.username}
                    </Link>
                    {user.role && (
                      <Tag
                        style={{ marginLeft: 8 }}
                        color={
                          user.role === "creator"
                            ? "gold"
                            : user.role === "moderator"
                            ? "blue"
                            : "green"
                        }
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Tag>
                    )}
                  </Title>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ fontSize: 12, textAlign: "center", color: "#666" }}
                  >
                    {user.bio || "No bio provided."}
                  </Paragraph>
                  <Space
                    direction="vertical"
                    style={{ width: "100%", textAlign: "center", marginTop: 8 }}
                  >
                    <Rate disabled allowHalf value={user.rating || 0} />
                    <Text type="secondary">
                      Favorite Movies: {user.favoriteMovies?.length || 0}
                    </Text>
                    <Text type="secondary">
                      Joined: {new Date(user.joinedAt).toLocaleDateString()}
                    </Text>
                    <Text type="secondary">Posts: {user.postCount || 0}</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Community Stats" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
              <Text>Total Members: {members.length}</Text>
              <Text>
                Active Users: {members.filter((u) => u.postCount > 0).length}
              </Text>
              <Text>Top Contributors: {topContributors.length}</Text>
            </Space>
          </Card>
          <Card title="Top Contributors">
            <List
              dataSource={topContributors}
              renderItem={(user) => (
                <List.Item
                  actions={[
                    <Button
                      key="follow"
                      size="small"
                      onClick={() => handleFollow(user._id)}
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
                      />
                    }
                    title={<Link to={`/u/${user._id}`}>{user.username}</Link>}
                    description={
                      <Text ellipsis>
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
    </div>
  );
};

export default MembersWrapper;
