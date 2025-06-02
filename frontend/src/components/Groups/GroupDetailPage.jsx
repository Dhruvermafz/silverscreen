import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Modal,
  List,
  Typography,
  Avatar,
  Card,
  Tabs,
  Select,
  Row,
  Col,
  Space,
  message,
} from "antd";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import PostCard from "../PostCard";
import BoxOfficeWidget from "../BoxOfficeWdget";
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
import "./groups.css"; // Corrected CSS import

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
  const { data: posts = [], refetch: refetchPosts } =
    useGetGroupPostsQuery(groupId);
  const [postToGroup] = usePostToGroupMutation();
  const [commentOnGroupPost] = useCommentOnGroupPostMutation();
  const [promoteToModerator] = usePromoteToModeratorMutation();
  const [banUserFromGroup] = useBanUserFromGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [sortBy, setSortBy] = useState("new");

  // Derive membership status safely
  const isMember = group && group.userRole && group.userRole !== "none";
  const isAdmin =
    group && (group.userRole === "creator" || group.userRole === "moderator");

  const handlePost = async (values) => {
    try {
      await postToGroup({ groupId, postData: values }).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetchPosts();
      message.success("Post created successfully");
    } catch (error) {
      message.error("Failed to create post");
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnGroupPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
      message.success("Comment added");
    } catch (error) {
      message.error("Failed to comment");
    }
  };

  const handleModerate = async (userId, action) => {
    try {
      if (action === "promote") {
        await promoteToModerator({ groupId, userId }).unwrap();
        message.success("User promoted to moderator");
      } else if (action === "ban") {
        await banUserFromGroup({ groupId, userId }).unwrap();
        message.success("User banned from group");
      }
    } catch (error) {
      message.error(`Failed to ${action} user`);
    }
  };

  const handleJoinGroup = async () => {
    try {
      await joinGroup(groupId).unwrap();
      message.success("Joined group successfully");
    } catch (error) {
      message.error("Failed to join group");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId).unwrap();
      message.success("Left group successfully");
    } catch (error) {
      message.error("Failed to leave group");
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "hot")
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    return 0;
  });

  const pinnedPosts = sortedPosts.filter((post) => post.isPinned);
  const regularPosts = sortedPosts.filter((post) => !post.isPinned);

  if (groupLoading) {
    return (
      <div className="group-detail-loading">
        <Typography.Text>Loading group details...</Typography.Text>
      </div>
    );
  }

  if (groupError) {
    message.error(
      groupErrorDetails?.data?.message || "Failed to load group details"
    );
    return (
      <div className="group-detail-error">
        <Typography.Text type="danger">
          Failed to load group details.
        </Typography.Text>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-detail-error">
        <Typography.Text type="danger">Group not found.</Typography.Text>
      </div>
    );
  }

  return (
    <section
      className="group-detail-page"
      aria-label={`Details for ${group.name} group`}
    >
      <div className="group-detail-container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={18}>
            {/* Group Header */}
            <Card
              className="group-detail-header-card"
              cover={
                <img
                  alt={`${group.name} cover`}
                  src={
                    group.coverImage || "https://via.placeholder.com/1200x200"
                  }
                  className="group-detail-cover-image"
                />
              }
            >
              <Title level={3} className="group-detail-title">
                {group.name}
              </Title>
              <Paragraph className="group-detail-description">
                {group.description || "No description available"}
              </Paragraph>
              <Space className="group-detail-stats">
                <Text>{group.members?.length || 0} Members</Text>
                <Text>{group.isPrivate ? "Private" : "Public"}</Text>
              </Space>
              <Space className="group-detail-actions">
                {isMember ? (
                  <Button
                    onClick={handleLeaveGroup}
                    icon={<UserDeleteOutlined />}
                    className="group-detail-button"
                    aria-label="Leave group"
                  >
                    Leave Group
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleJoinGroup}
                    icon={<UserAddOutlined />}
                    className="group-detail-button"
                    aria-label="Join group"
                  >
                    Join Group
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    onClick={() => navigate(`/groups/${groupId}/invite`)}
                    className="group-detail-button"
                    aria-label="Invite members"
                  >
                    Invite Members
                  </Button>
                )}
              </Space>
            </Card>

            {/* Tabs for Content */}
            <Tabs defaultActiveKey="posts" className="group-detail-tabs">
              <TabPane tab="Posts" key="posts">
                <Space className="group-detail-post-controls">
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="group-detail-sort-select"
                    aria-label="Sort posts"
                  >
                    <Option value="new">New</Option>
                    <Option value="hot">Hot</Option>
                  </Select>
                  {isMember && (
                    <Button
                      type="primary"
                      onClick={() => setIsModalOpen(true)}
                      className="group-detail-create-post-button"
                      aria-label="Create a new post"
                    >
                      Create Post
                    </Button>
                  )}
                </Space>

                {/* Pinned Posts */}
                {pinnedPosts.length > 0 && (
                  <>
                    <Title level={4} className="group-detail-section-title">
                      Pinned Posts
                    </Title>
                    {pinnedPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={{ ...post, isPinned: true }}
                        onComment={handleComment}
                        className="group-detail-post-card"
                      />
                    ))}
                  </>
                )}

                {/* Regular Posts */}
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
                    No posts available.
                  </Text>
                )}
              </TabPane>
              <TabPane tab="Members" key="members">
                <List
                  dataSource={group.members}
                  renderItem={(member) => (
                    <List.Item
                      className="group-detail-member-item"
                      actions={
                        isAdmin
                          ? [
                              <Button
                                key="promote"
                                size="small"
                                onClick={() =>
                                  handleModerate(member._id, "promote")
                                }
                                className="group-detail-moderate-button"
                                aria-label={`Promote ${member.name} to moderator`}
                              >
                                Promote
                              </Button>,
                              <Button
                                key="ban"
                                size="small"
                                danger
                                onClick={() =>
                                  handleModerate(member._id, "ban")
                                }
                                className="group-detail-moderate-button"
                                aria-label={`Ban ${member.name} from group`}
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
                            alt={`Avatar of ${member.name}`}
                          />
                        }
                        title={
                          <Text className="group-detail-member-name">
                            {member.name}
                          </Text>
                        }
                        description={
                          <Text className="group-detail-member-role">
                            {member.role}
                          </Text>
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
            <Card title="About" className="group-detail-sidebar-card">
              <Paragraph className="group-detail-about-description">
                {group.description || "No description available"}
              </Paragraph>
              <Space direction="vertical" className="group-detail-about-stats">
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
            {group.rules && group.rules.length > 0 && (
              <Card title="Rules" className="group-detail-sidebar-card">
                <List
                  dataSource={group.rules}
                  renderItem={(rule, index) => (
                    <List.Item className="group-detail-rule-item">
                      {index + 1}. {rule}
                    </List.Item>
                  )}
                />
              </Card>
            )}
            <BoxOfficeWidget className="group-detail-sidebar-widget" />
          </Col>
        </Row>

        {/* Post Creation Modal */}
        <Modal
          title="Create Post"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText="Post"
          cancelText="Cancel"
          className="group-detail-post-modal"
          aria-label="Create new post modal"
        >
          <Form form={form} onFinish={handlePost} layout="vertical">
            <Form.Item
              name="content"
              label="Post Content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <TextArea
                placeholder="What's on your mind?"
                rows={4}
                className="group-detail-form-input"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </section>
  );
};

export default GroupDetailPage;
