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
} from "../../actions/groupApi";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { data: group, isLoading: groupLoading } =
    useGetGroupByIdQuery(groupId);
  const { data: posts = [], refetch: refetchPosts } =
    useGetGroupPostsQuery(groupId);
  const [postToGroup] = usePostToGroupMutation();
  const [commentOnGroupPost] = useCommentOnGroupPostMutation();
  const [promoteToModerator] = usePromoteToModeratorMutation();
  const [banUserFromGroup] = useBanUserFromGroupMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [sortBy, setSortBy] = useState("new");
  const [isMember, setIsMember] = useState(false); // Mock membership status

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
      }
      if (action === "ban") {
        await banUserFromGroup({ groupId, userId }).unwrap();
        message.success("User banned from group");
      }
    } catch (error) {
      message.error(`Failed to ${action} user`);
    }
  };

  const handleJoinGroup = () => {
    setIsMember(true);
    message.success("Joined group successfully");
  };

  const handleLeaveGroup = () => {
    setIsMember(false);
    message.success("Left group successfully");
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "hot") return b.comments.length - a.comments.length;
    return 0;
  });

  const pinnedPosts = sortedPosts.filter((post) => post.isPinned);
  const regularPosts = sortedPosts.filter((post) => !post.isPinned);

  if (groupLoading || !group) return null;

  const isAdmin =
    group.userRole === "creator" || group.userRole === "moderator";

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={18}>
          {/* Group Header */}
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            cover={
              <img
                alt="Group cover"
                src={group.coverImage || "https://via.placeholder.com/1200x200"}
                style={{
                  height: 150,
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
            }
          >
            <Title level={3} style={{ margin: 0, fontWeight: 500 }}>
              {group.name}
            </Title>
            <Paragraph style={{ margin: "8px 0" }}>
              {group.description}
            </Paragraph>
            <Space style={{ marginBottom: 16 }}>
              <Text>{group.members.length} Members</Text>
              <Text>{group.isPrivate ? "Private" : "Public"}</Text>
            </Space>
            <Space>
              {isMember ? (
                <Button
                  onClick={handleLeaveGroup}
                  icon={<UserDeleteOutlined />}
                >
                  Leave Group
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleJoinGroup}
                  icon={<UserAddOutlined />}
                >
                  Join Group
                </Button>
              )}
              {isAdmin && (
                <Button onClick={() => navigate(`/groups/${groupId}/invite`)}>
                  Invite Members
                </Button>
              )}
            </Space>
          </Card>

          {/* Tabs for Content */}
          <Tabs defaultActiveKey="posts" style={{ marginTop: "24px" }}>
            <TabPane tab="Posts" key="posts">
              <Space
                style={{
                  marginBottom: "16px",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Select
                  value={sortBy}
                  style={{ width: 120 }}
                  onChange={setSortBy}
                  bordered={false}
                >
                  <Option value="new">New</Option>
                  <Option value="hot">Hot</Option>
                </Select>
                {isMember && (
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Post
                  </Button>
                )}
              </Space>

              {/* Pinned Posts */}
              {pinnedPosts.length > 0 && (
                <>
                  <Title level={4} style={{ fontWeight: 500 }}>
                    Pinned Posts
                  </Title>
                  {pinnedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={{ ...post, isPinned: true }}
                      onComment={handleComment}
                      style={{ marginBottom: "16px", borderRadius: "8px" }}
                    />
                  ))}
                </>
              )}

              {/* Regular Posts */}
              {regularPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onComment={handleComment}
                  style={{ marginBottom: "16px", borderRadius: "8px" }}
                />
              ))}
            </TabPane>
            <TabPane tab="Members" key="members">
              <List
                dataSource={group.members}
                renderItem={(member) => (
                  <List.Item
                    actions={
                      isAdmin
                        ? [
                            <Button
                              key="promote"
                              size="small"
                              onClick={() =>
                                handleModerate(member.id, "promote")
                              }
                            >
                              Promote
                            </Button>,
                            <Button
                              key="ban"
                              size="small"
                              danger
                              onClick={() => handleModerate(member.id, "ban")}
                            >
                              Ban
                            </Button>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={member.avatar} />}
                      title={member.name}
                      description={member.role}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={6}>
          <Card
            title="About"
            style={{
              marginBottom: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Paragraph>{group.description}</Paragraph>
            <Text strong>Created: </Text>
            <Text>{new Date(group.createdAt).toLocaleDateString()}</Text>
            <br />
            <Text strong>Privacy: </Text>
            <Text>{group.isPrivate ? "Private" : "Public"}</Text>
          </Card>
          {group.rules && group.rules.length > 0 && (
            <Card
              title="Rules"
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <List
                dataSource={group.rules}
                renderItem={(rule, index) => (
                  <List.Item style={{ padding: "8px 0" }}>
                    {index + 1}. {rule}
                  </List.Item>
                )}
              />
            </Card>
          )}
          <BoxOfficeWidget />
        </Col>
      </Row>

      {/* Post Creation Modal */}
      <Modal
        title="Create Post"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Post"
        cancelText="Cancel"
        width={400}
      >
        <Form form={form} onFinish={handlePost} layout="vertical">
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <Input.TextArea placeholder="What's on your mind?" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupDetailPage;
