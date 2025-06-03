import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Modal,
  Typography,
  Card,
  Tabs,
  Select,
  Row,
  Col,
  Space,
  message,
  Skeleton,
  List,
  Avatar,
} from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PostCard from "../PostCard";
import BoxOfficeWidget from "../BoxOfficeWdget"; // Fixed typo in import
import {
  useGetGroupByIdQuery,
  useGetGroupPostsQuery,
  usePostToGroupMutation,
  useCommentOnGroupPostMutation,
  usePromoteToModeratorMutation,
  useBanUserFromGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "../../actions/groupApi";
import "./groups.css";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const {
    data: group,
    isLoading: groupLoading,
    isError: groupError,
    error: groupErrorDetails,
  } = useGetGroupByIdQuery(groupId);
  const {
    data: posts = [],
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useGetGroupPostsQuery(groupId);
  const [postToGroup] = usePostToGroupMutation();
  const [commentOnGroupPost] = useCommentOnGroupPostMutation();
  const [promoteToModerator] = usePromoteToModeratorMutation();
  const [banUserFromGroup] = useBanUserFromGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [sortBy, setSortBy] = useState("new");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !postsLoading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [postsLoading, hasMore]);

  // Log for debugging
  useEffect(() => {
    if (groupError) {
      console.error("Group Error:", groupErrorDetails);
    }
    console.log("Group Data:", group);
  }, [group, groupError, groupErrorDetails]);

  const handlePost = async (values) => {
    try {
      await postToGroup({ groupId, postData: values }).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetchPosts();
      message.success("Post created!");
    } catch (error) {
      message.error("Failed to create post.");
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnGroupPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
      message.success("Comment added!");
    } catch (error) {
      message.error("Failed to comment.");
    }
  };

  const handleModerate = async (userId, action) => {
    try {
      if (action === "promote") {
        await promoteToModerator({ groupId, userId }).unwrap();
        message.success("User promoted to moderator!");
      } else if (action === "ban") {
        await banUserFromGroup({ groupId, userId }).unwrap();
        message.success("User banned from group!");
      }
    } catch (error) {
      message.error(`Failed to ${action} user.`);
    }
  };

  const handleJoinGroup = async () => {
    try {
      await joinGroup(groupId).unwrap();
      message.success("Joined community!");
    } catch (error) {
      message.error("Failed to join community.");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId).unwrap();
      message.success("Left community!");
    } catch (error) {
      message.error("Failed to leave community.");
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "hot")
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    if (sortBy === "top") return (b.upvotes || 0) - (a.upvotes || 0);
    return 0;
  });

  const pinnedPosts = sortedPosts.filter((post) => post.isPinned);
  const regularPosts = sortedPosts.filter((post) => !post.isPinned);

  if (groupLoading) {
    return (
      <div className="group-detail-page">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (groupError || !group) {
    message.error(
      groupErrorDetails?.data?.message || "Failed to load community details."
    );
    return (
      <div className="group-detail-page">
        <Text type="danger">Community not found.</Text>
      </div>
    );
  }

  // Define membership status after group is confirmed
  const isMember = group.userRole && group.userRole !== "none";
  const isAdmin =
    group.userRole === "creator" || group.userRole === "moderator";

  return (
    <section className="group-detail-page" aria-label={`r/${group.name}`}>
      <div className="group-detail-container">
        {/* Banner */}
        <div className="group-detail-banner">
          <img
            alt={`${group.name} banner`}
            src={group.coverImage || "https://placehold.co/1200x200"}
            className="group-detail-cover-image"
          />
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={18}>
            {/* Header */}
            <div className="group-detail-header">
              <Space align="center" className="group-detail-title-space">
                <Avatar
                  src={group.avatar}
                  size={48}
                  className="group-detail-avatar"
                  alt={`${group.name} avatar`}
                />
                <Title level={3} className="group-detail-title">
                  gr/{group.name}
                </Title>
                <Text type="secondary">
                  {group.isPrivate ? "Private" : "Public"}
                </Text>
              </Space>
              <Space className="group-detail-actions">
                {isMember ? (
                  <Button
                    size="small"
                    onClick={handleLeaveGroup}
                    icon={<UserDeleteOutlined />}
                    aria-label="Leave community"
                  >
                    Leave
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleJoinGroup}
                    icon={<UserAddOutlined />}
                    aria-label="Join community"
                  >
                    Join
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    size="small"
                    onClick={() => navigate(`/groups/${groupId}/invite`)}
                    aria-label="Invite members"
                  >
                    Invite
                  </Button>
                )}
              </Space>
            </div>

            {/* Tabs */}
            <Tabs
              defaultActiveKey="posts"
              className="group-detail-tabs"
              tabBarExtraContent={
                <Space>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    size="small"
                    aria-label="Sort posts"
                    style={{ width: 100 }}
                  >
                    <Option value="new">New</Option>
                    <Option value="hot">Hot</Option>
                    <Option value="top">Top</Option>
                  </Select>
                  {isMember && (
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => setIsModalOpen(true)}
                      aria-label="Create post"
                    >
                      Post
                    </Button>
                  )}
                </Space>
              }
            >
              <TabPane tab="Posts" key="posts">
                {postsLoading && posts.length === 0 ? (
                  <Skeleton active paragraph={{ rows: 3 }} />
                ) : (
                  <>
                    {pinnedPosts.length > 0 && (
                      <div className="group-detail-pinned">
                        <Text strong>Pinned by Moderators</Text>
                        {pinnedPosts.map((post) => (
                          <PostCard
                            key={post._id}
                            post={{ ...post, isPinned: true }}
                            onComment={handleComment}
                            className="group-detail-post-card"
                          />
                        ))}
                      </div>
                    )}
                    {regularPosts.length > 0 ? (
                      regularPosts.map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          onComment={handleComment}
                          className="group-detail-post-card"
                        />
                      ))
                    ) : (
                      <Text className="group-detail-empty-text">
                        No posts yet. Be the first to share!
                      </Text>
                    )}
                    <div ref={loaderRef} className="group-detail-loader" />
                  </>
                )}
              </TabPane>
              <TabPane tab="Members" key="members">
                <List
                  dataSource={group.members || []}
                  renderItem={(member) => (
                    <List.Item
                      className="group-detail-member-item"
                      actions={
                        isAdmin && member.role !== "creator"
                          ? [
                              <Button
                                key="promote"
                                type="text"
                                size="small"
                                onClick={() =>
                                  handleModerate(member._id, "promote")
                                }
                                aria-label={`Promote ${member.name}`}
                              >
                                Promote
                              </Button>,
                              <Button
                                key="ban"
                                type="text"
                                size="small"
                                danger
                                onClick={() =>
                                  handleModerate(member._id, "ban")
                                }
                                aria-label={`Ban ${member.name}`}
                              >
                                Ban
                              </Button>,
                            ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={member.avatar}
                            alt={`${member.name} avatar`}
                          />
                        }
                        title={<Text>{member.name}</Text>}
                        description={
                          <Text type="secondary">{member.role}</Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={6}>
            <div className="group-detail-sidebar">
              <Card className="group-detail-sidebar-card">
                <Title level={5}>About r/{group.name}</Title>
                <Paragraph
                  ellipsis={{ rows: 3 }}
                  className="group-detail-about-description"
                >
                  {group.description || "No description available"}
                </Paragraph>
                <Space direction="vertical" size={4}>
                  <Text>
                    <strong>Members:</strong> {group.members?.length || 0}
                  </Text>
                  <Text>
                    <strong>Created:</strong>{" "}
                    {new Date(group.createdAt).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Privacy:</strong>{" "}
                    {group.isPrivate ? "Private" : "Public"}
                  </Text>
                </Space>
              </Card>
              {group.rules?.length > 0 && (
                <Card className="group-detail-sidebar-card">
                  <Title level={5}>Rules</Title>
                  <List
                    dataSource={group.rules}
                    renderItem={(rule, index) => (
                      <List.Item className="group-detail-rule-item">
                        <Text>
                          {index + 1}. {rule}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              )}
              <BoxOfficeWidget className="group-detail-sidebar-widget" />
            </div>
          </Col>
        </Row>

        {/* Post Creation Modal */}
        <Modal
          title="Submit a Post"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText="Submit"
          cancelText="Cancel"
          className="group-detail-post-modal"
          aria-label="Create post modal"
        >
          <Form form={form} onFinish={handlePost} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Post title" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <TextArea placeholder="What's on your mind?" rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </section>
  );
};

export default GroupDetailPage;
