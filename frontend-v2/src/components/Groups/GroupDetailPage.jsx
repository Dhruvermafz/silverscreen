import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Tabs,
  Typography,
  Space,
  Tag,
  Avatar,
  List,
  Empty,
  Skeleton,
  message,
  Modal,
  Form,
  Input,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  PushpinOutlined,
  LockOutlined,
  GlobalOutlined,
  TeamOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import PostCard from "../PostCard";
import BoxOfficeWidget from "../BoxOfficeWdget";

import {
  useGetGroupByIdQuery,
  useGetGroupPostsQuery,
  usePostToGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "../../actions/groupApi";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const {
    data: group,
    isLoading: groupLoading,
    isError: groupError,
  } = useGetGroupByIdQuery(groupId);

  const {
    data: posts = [],
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useGetGroupPostsQuery(groupId);

  const [postToGroup] = usePostToGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const isMember = group?.userRole && group.userRole !== "none";
  const isAdmin =
    group?.userRole === "creator" || group?.userRole === "moderator";

  const handleJoin = async () => {
    try {
      await joinGroup(groupId).unwrap();
      message.success("Joined community!");
    } catch {
      message.error("Failed to join");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup(groupId).unwrap();
      message.success("Left community");
      navigate("/groups");
    } catch {
      message.error("Failed to leave");
    }
  };

  const handleCreatePost = async (values) => {
    try {
      await postToGroup({ groupId, postData: values }).unwrap();
      message.success("Post created!");
      form.resetFields();
      setCreateModalOpen(false);
      refetchPosts();
    } catch {
      message.error("Failed to create post");
    }
  };

  const pinnedPosts = posts.filter((p) => p.isPinned);
  const regularPosts = posts.filter((p) => !p.isPinned);

  if (groupLoading) {
    return (
      <div className="container py-5">
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="container py-5 text-center">
        <Empty description="Community not found or doesn't exist" />
      </div>
    );
  }

  return (
    <div className="group-detail-page">
      {/* Banner */}
      <div
        className="group-banner position-relative text-white"
        style={{
          height: "320px",
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${
            group.coverImage || "https://placehold.co/1600x400"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container h-100 d-flex align-items-end pb-5">
          <div>
            <Title level={1} style={{ color: "#fff", margin: 0 }}>
              gr/{group.name}
            </Title>
            <Space size="middle" className="mt-3">
              {group.isPrivate ? (
                <Tag icon={<LockOutlined />} color="red">
                  Private
                </Tag>
              ) : (
                <Tag icon={<GlobalOutlined />} color="green">
                  Public
                </Tag>
              )}
              <Space>
                <TeamOutlined />
                <Text strong style={{ color: "#fff" }}>
                  {group.members?.length || 0} members
                </Text>
              </Space>
              <Space>
                <CalendarOutlined />
                <Text style={{ color: "#fff" }}>
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </Text>
              </Space>
            </Space>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={18}>
            {/* Header Actions */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Paragraph
                className="mb-0 text-muted"
                style={{ maxWidth: "70%" }}
              >
                {group.description || "No description yet."}
              </Paragraph>

              <Space>
                {isMember ? (
                  <Button danger onClick={handleLeave}>
                    Leave Community
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={handleJoin}
                  >
                    Join Community
                  </Button>
                )}
                {isMember && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Create Post
                  </Button>
                )}
              </Space>
            </div>

            {/* Tabs */}
            <Tabs defaultActiveKey="posts" size="large">
              <TabPane tab="Posts" key="posts">
                {/* Pinned Posts */}
                {pinnedPosts.length > 0 && (
                  <Card
                    title={
                      <Space>
                        <PushpinOutlined />
                        <Text strong>Pinned Posts</Text>
                      </Space>
                    }
                    className="mb-4"
                    style={{ borderRadius: 16 }}
                  >
                    {pinnedPosts.map((post) => (
                      <PostCard key={post._id} post={post} groupId={groupId} />
                    ))}
                  </Card>
                )}

                {/* Regular Posts */}
                {postsLoading && posts.length === 0 ? (
                  <Skeleton active paragraph={{ rows: 4 }} />
                ) : regularPosts.length === 0 ? (
                  <Empty
                    description={
                      isMember
                        ? "No posts yet. Be the first to share something!"
                        : "Join the community to see posts"
                    }
                  />
                ) : (
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    {regularPosts.map((post) => (
                      <PostCard key={post._id} post={post} groupId={groupId} />
                    ))}
                  </Space>
                )}
              </TabPane>

              <TabPane
                tab={`Members (${group.members?.length || 0})`}
                key="members"
              >
                <List
                  grid={{ gutter: 16, xs: 2, sm: 3, md: 4 }}
                  dataSource={group.members || []}
                  renderItem={(member) => (
                    <List.Item>
                      <Card
                        hoverable
                        style={{ textAlign: "center", borderRadius: 12 }}
                        onClick={() => navigate(`/u/${member._id}`)}
                      >
                        <Avatar
                          src={member.avatar}
                          size={64}
                          className="mb-3"
                        />
                        <Text strong className="d-block">
                          {member.username}
                        </Text>
                        {member.role && member.role !== "member" && (
                          <Tag color="gold" className="mt-2">
                            {member.role}
                          </Tag>
                        )}
                      </Card>
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={6}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Group Info */}
              <Card title="About Community" style={{ borderRadius: 16 }}>
                <Space direction="vertical" size="middle">
                  <div>
                    <Text strong>Members</Text>
                    <Text type="secondary" className="d-block">
                      {group.members?.length || 0}
                    </Text>
                  </div>
                  <div>
                    <Text strong>Created</Text>
                    <Text type="secondary" className="d-block">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                  <div>
                    <Text strong>Category</Text>
                    <Tag color="blue" className="d-block mt-1">
                      {group.category || "General"}
                    </Tag>
                  </div>
                </Space>
              </Card>

              {/* Rules */}
              {group.rules?.length > 0 && (
                <Card title="Community Rules" style={{ borderRadius: 16 }}>
                  <List
                    dataSource={group.rules}
                    renderItem={(rule, i) => (
                      <List.Item>
                        <Text>
                          <strong>{i + 1}.</strong> {rule}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              )}

              {/* Box Office */}
              <BoxOfficeWidget />
            </Space>
          </Col>
        </Row>
      </div>

      {/* Floating Action Button (Mobile) */}
      {isMember && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          className="position-fixed"
          style={{
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
          onClick={() => setCreateModalOpen(true)}
        />
      )}

      {/* Create Post Modal */}
      <Modal
        title={<Title level={4}>Create a Post in gr/{group.name}</Title>}
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleCreatePost} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="What's this post about?" size="large" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Content is required" }]}
          >
            <TextArea
              rows={5}
              placeholder="Share your thoughts..."
              size="large"
            />
          </Form.Item>

          <Button type="primary" size="large" block htmlType="submit">
            Submit Post
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupDetailPage;
