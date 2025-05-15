import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
  Divider,
  Row,
  Col,
  Space,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  StarOutlined,
  ShareAltOutlined,
  FlagOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
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
  const { data: group, isLoading: groupLoading } =
    useGetGroupByIdQuery(groupId);
  const { data: posts = [], refetch: refetchPosts } =
    useGetGroupPostsQuery(groupId);
  const [postToGroup] = usePostToGroupMutation();
  const [commentOnGroupPost] = useCommentOnGroupPostMutation();
  const [promoteToModerator] = usePromoteToModeratorMutation();
  const [banUserFromGroup] = useBanUserFromGroupMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [eventForm] = Form.useForm();
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
      console.error("Failed to post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnGroupPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
      message.success("Comment added");
    } catch (error) {
      message.error("Failed to comment");
      console.error("Failed to comment:", error);
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
      console.error(`Failed to ${action} user:`, error);
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

  const flagContent = async (contentId, type) => {
    message.info(`Flagged ${type}: ${contentId}`);
    console.log(`Flagging ${type}:`, contentId);
  };

  const handleShare = (postId) => {
    message.info("Share link copied!");
    console.log("Sharing post:", postId);
  };

  const handleCreateEvent = async (values) => {
    try {
      // Mock event creation (replace with actual API)
      console.log("Creating event:", values);
      setIsEventModalOpen(false);
      eventForm.resetFields();
      message.success("Event created successfully");
    } catch (error) {
      message.error("Failed to create event");
      console.error("Failed to create event:", error);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "hot") return b.comments.length - a.comments.length;
    if (sortBy === "top") return b.likes - a.likes;
    return 0;
  });

  const pinnedPosts = sortedPosts.filter((post) => post.isPinned);
  const regularPosts = sortedPosts.filter((post) => !post.isPinned);

  if (groupLoading || !group) return null;

  const isAdmin =
    group.userRole === "creator" || group.userRole === "moderator";

  const dropdownMenu = (post) => (
    <Menu>
      <Menu.Item key="flag" onClick={() => flagContent(post.id, "post")}>
        <FlagOutlined /> Flag Post
      </Menu.Item>
      <Menu.Item key="share" onClick={() => handleShare(post.id)}>
        <ShareAltOutlined /> Share Post
      </Menu.Item>
      {isAdmin && (
        <Menu.Item key="pin" onClick={() => console.log("Pin post:", post.id)}>
          <StarOutlined /> {post.isPinned ? "Unpin" : "Pin"} Post
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="group-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          {/* Group Header */}
          <Card
            cover={
              <img
                alt="Group cover"
                src={group.coverImage || "https://via.placeholder.com/1200x300"}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
          >
            <Title level={2}>{group.name}</Title>
            <Paragraph>{group.description}</Paragraph>
            <Space>
              <Text strong>Privacy: </Text>
              <Text>{group.isPrivate ? "Private" : "Public"}</Text>
              <Text strong>Members: </Text>
              <Text>{group.members.length}</Text>
            </Space>
            <div style={{ marginTop: 16 }}>
              {isMember ? (
                <Button onClick={handleLeaveGroup}>Leave Group</Button>
              ) : (
                <Button type="primary" onClick={handleJoinGroup}>
                  Join Group
                </Button>
              )}
              {isAdmin && (
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => console.log("Invite members")}
                >
                  Invite Members
                </Button>
              )}
            </div>
          </Card>

          {/* Tabs for Content */}
          <Tabs defaultActiveKey="posts">
            <TabPane tab="Posts" key="posts">
              <Space style={{ marginBottom: 16 }}>
                <Select
                  defaultValue="new"
                  style={{ width: 120 }}
                  onChange={setSortBy}
                >
                  <Option value="new">New</Option>
                  <Option value="hot">Hot</Option>
                  <Option value="top">Top</Option>
                </Select>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                  luckycharms Create Post
                </Button>
              </Space>

              {/* Pinned Posts */}
              {pinnedPosts.length > 0 && (
                <>
                  <Title level={4}>Pinned Posts</Title>
                  {pinnedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={{ ...post, isPinned: true }}
                      onComment={handleComment}
                      onLike={() => console.log("Like post:", post.id)}
                      extra={
                        <Dropdown
                          overlay={dropdownMenu(post)}
                          trigger={["click"]}
                        >
                          <Button>More</Button>
                        </Dropdown>
                      }
                    />
                  ))}
                  <Divider />
                </>
              )}

              {/* Regular Posts */}
              {regularPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onComment={handleComment}
                  onLike={() => console.log("Like post:", post.id)}
                  extra={
                    <Dropdown overlay={dropdownMenu(post)} trigger={["click"]}>
                      <Button>More</Button>
                    </Dropdown>
                  }
                />
              ))}
            </TabPane>
            <TabPane tab="Events" key="events">
              <Button
                type="primary"
                onClick={() => setIsEventModalOpen(true)}
                style={{ marginBottom: 16 }}
              >
                Create Event
              </Button>
              <List
                dataSource={group.events || []}
                renderItem={(event) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CalendarOutlined />}
                      title={event.title}
                      description={`${event.date} - ${event.description}`}
                    />
                  </List.Item>
                )}
              />
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
                              onClick={() =>
                                handleModerate(member.id, "promote")
                              }
                            >
                              Promote
                            </Button>,
                            <Button
                              key="ban"
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
        <Col xs={24} md={8}>
          {/* Sidebar */}
          <Card title="About" style={{ marginBottom: 16 }}>
            <Paragraph>{group.description}</Paragraph>
            <p>
              <Text strong>Created: </Text>
              {new Date(group.createdAt).toLocaleDateString()}
            </p>
            <p>
              <Text strong>Privacy: </Text>
              {group.isPrivate ? "Private" : "Public"}
            </p>
          </Card>
          {group.rules && group.rules.length > 0 && (
            <Card title="Group Rules" style={{ marginBottom: 16 }}>
              <List
                dataSource={group.rules}
                renderItem={(rule, index) => (
                  <List.Item>
                    {index + 1}. {rule}
                  </List.Item>
                )}
              />
            </Card>
          )}
          <Card title="Quick Links">
            <Menu mode="vertical">
              <Menu.Item key="info">Group Info</Menu.Item>
              <Menu.Item key="rules">Rules</Menu.Item>
              <Menu.Item key="members">Members</Menu.Item>
              <Menu.Item key="events">Events</Menu.Item>
              <Menu.Item key="related">Related Groups</Menu.Item>
            </Menu>
          </Card>
          <BoxOfficeWidget style={{ marginTop: 16 }} />
        </Col>
      </Row>

      {/* Post Creation Modal */}
      <Modal
        title="Create Post"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handlePost}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Post Title" />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <Input.TextArea placeholder="Content" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Event Creation Modal */}
      <Modal
        title="Create Event"
        open={isEventModalOpen}
        onCancel={() => setIsEventModalOpen(false)}
        onOk={() => eventForm.submit()}
      >
        <Form form={eventForm} onFinish={handleCreateEvent}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Please enter event title" }]}
          >
            <Input placeholder="Event Title" />
          </Form.Item>
          <Form.Item
            name="date"
            rules={[{ required: true, message: "Please enter event date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              { required: true, message: "Please enter event description" },
            ]}
          >
            <Input.TextArea placeholder="Event Description" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupDetailPage;
