import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Modal,
  Typography,
  Row,
  Col,
  Select,
  Pagination,
  Space,
  Dropdown,
  Menu,
  Tooltip,
  Avatar,
  List,
  Tag,
} from "antd";
import {
  PlusOutlined,
  ShareAltOutlined,
  FlagOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import PostCard from "../PostCard";
import BoxOfficeWidget from "../BoxOfficeWdget";
import {
  useGetNewsroomByIdQuery,
  useGetAllNewsPostsQuery,
  usePostNewsToNewsroomMutation,
  useCommentOnNewsPostMutation,
  useAddNewsroomModeratorMutation,
} from "../../actions/newsroomApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserOutlined, EllipsisOutlined } from "@ant-design/icons";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const NewsroomDetailPage = () => {
  const { newsroomId } = useParams();
  const navigate = useNavigate();
  const {
    data: newsroom,
    isLoading: newsroomLoading,
    error: newsroomError,
  } = useGetNewsroomByIdQuery(newsroomId);
  const { data: posts = [], refetch: refetchPosts } =
    useGetAllNewsPostsQuery(newsroomId);
  const [postNewsToNewsroom] = usePostNewsToNewsroomMutation();
  const [commentOnNewsPost] = useCommentOnNewsPostMutation();
  const [addNewsroomModerator] = useAddNewsroomModeratorMutation();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false);
  const [postForm] = Form.useForm();
  const [moderatorForm] = Form.useForm();
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;
  const loaderRef = useRef(null);

  const [sortedPosts, setSortedPosts] = useState([]);

  useEffect(() => {
    if (newsroomError) {
      toast.error("Failed to load newsroom", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, [newsroomError]);

  useEffect(() => {
    let result = [...posts];
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "mostLiked") {
      result.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }
    setSortedPosts(result);
    setHasMore(result.length > page * pageSize);
  }, [posts, sortBy, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isPostModalOpen &&
          !isModeratorModalOpen
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isPostModalOpen, isModeratorModalOpen]);

  const handlePost = async (values) => {
    try {
      await postNewsToNewsroom({ newsroomId, postData: values }).unwrap();
      setIsPostModalOpen(false);
      postForm.resetFields();
      refetchPosts();
      toast.success("Post created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to create post", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnNewsPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
      toast.success("Comment added", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add comment", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddModerator = async (values) => {
    try {
      await addNewsroomModerator({
        newsroomId,
        userId: values.userId,
      }).unwrap();
      setIsModeratorModalOpen(false);
      moderatorForm.resetFields();
      toast.success("Moderator added", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add moderator", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRemoveModerator = (userId) => {
    // Mock remove moderator (replace with API)
    toast.success("Moderator removed", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleLike = (postId) => {
    // Mock like (replace with API)
    toast.success("Post liked", { position: "top-right", autoClose: 2000 });
  };

  const handleFlag = (postId) => {
    // Mock flag (replace with API)
    toast.info("Post reported", { position: "top-right", autoClose: 2000 });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/newsroom/${newsroomId}`
    );
    toast.success("Newsroom URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReport = () => {
    // Mock report (replace with API)
    toast.info(`Reported newsroom: ${newsroom.title}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const actionMenu = (
    <Menu>
      <Menu.Item key="share" onClick={handleShare}>
        <ShareAltOutlined /> Share
      </Menu.Item>
      <Menu.Item key="report" onClick={handleReport}>
        <FlagOutlined /> Report
      </Menu.Item>
    </Menu>
  );

  const paginatedPosts = sortedPosts.slice(0, page * pageSize);

  if (newsroomLoading || !newsroom) {
    return (
      <div className="loading-container">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <div className="newsroom-detail-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={18}>
          {/* Newsroom Header */}
          <div className="newsroom-header">
            {newsroom.coverImage && (
              <img
                src={newsroom.coverImage}
                alt={`${newsroom.title} cover`}
                className="newsroom-cover"
              />
            )}
            <Title level={2}>{newsroom.title}</Title>
            <Paragraph ellipsis={{ rows: 2 }}>
              {newsroom.description || "No description available"}
            </Paragraph>
            <Space wrap>
              <Text>
                <Tag color={newsroom.isPrivate ? "red" : "green"}>
                  {newsroom.isPrivate ? "Private" : "Public"}
                </Tag>
              </Text>
              <Text>
                <UserOutlined /> {newsroom.followers?.length || 0} Members
              </Text>
              <Dropdown overlay={actionMenu} trigger={["click"]}>
                <Button icon={<EllipsisOutlined />} aria-label="More actions" />
              </Dropdown>
            </Space>
          </div>

          {/* Controls */}
          <Space style={{ margin: "16px 0", flexWrap: "wrap" }}>
            {newsroom.userRole === "creator" && (
              <Tooltip title="Add a moderator">
                <Button
                  icon={<UserAddOutlined />}
                  onClick={() => setIsModeratorModalOpen(true)}
                  aria-label="Add moderator"
                >
                  Add Moderator
                </Button>
              </Tooltip>
            )}
            {["creator", "editor"].includes(newsroom.userRole) && (
              <Tooltip title="Create a new post">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsPostModalOpen(true)}
                  aria-label="Create post"
                >
                  Create Post
                </Button>
              </Tooltip>
            )}
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 150 }}
              aria-label="Sort posts"
            >
              <Option value="newest">Newest</Option>
              <Option value="mostLiked">Most Liked</Option>
            </Select>
          </Space>

          {/* Moderators */}
          {newsroom.moderators?.length > 0 && (
            <div className="moderators-section">
              <Title level={4}>Moderators</Title>
              <List
                dataSource={newsroom.moderators}
                renderItem={(mod) => (
                  <List.Item
                    actions={
                      newsroom.userRole === "creator"
                        ? [
                            <Button
                              icon={<UserDeleteOutlined />}
                              onClick={() => handleRemoveModerator(mod.id)}
                              aria-label={`Remove ${mod.username} as moderator`}
                            >
                              Remove
                            </Button>,
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{mod.username[0]}</Avatar>}
                      title={<Text>{mod.username}</Text>}
                    />
                  </List.Item>
                )}
              />
            </div>
          )}

          {/* Posts */}
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onComment={handleComment}
                onLike={() => handleLike(post.id)}
                onFlag={() => handleFlag(post.id)}
                canComment={newsroom.commentsEnabled}
              />
            ))
          ) : (
            <Text>No posts available</Text>
          )}
          <div ref={loaderRef} style={{ height: 20 }} />
          {sortedPosts.length > pageSize && (
            <Pagination
              current={page}
              total={sortedPosts.length}
              pageSize={pageSize}
              onChange={(newPage) => setPage(newPage)}
              style={{ textAlign: "center", marginTop: 16 }}
            />
          )}
        </Col>
        <Col xs={0} md={6}>
          <BoxOfficeWidget />
        </Col>
      </Row>

      {/* Post Creation Modal */}
      <Modal
        title="Create News Post"
        open={isPostModalOpen}
        onCancel={() => setIsPostModalOpen(false)}
        onOk={() => postForm.submit()}
      >
        <Form form={postForm} onFinish={handlePost} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Post Title" aria-label="Post title" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <Input.TextArea
              placeholder="Content"
              rows={6}
              aria-label="Post content"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Moderator Addition Modal */}
      <Modal
        title="Add Moderator"
        open={isModeratorModalOpen}
        onCancel={() => setIsModeratorModalOpen(false)}
        onOk={() => moderatorForm.submit()}
      >
        <Form
          form={moderatorForm}
          onFinish={handleAddModerator}
          layout="vertical"
        >
          <Form.Item
            name="userId"
            label="Select User"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select placeholder="Select a user" aria-label="Select user">
              {/* Mock users; replace with API-driven user list */}
              <Option value="user1">User One</Option>
              <Option value="user2">User Two</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsroomDetailPage;
