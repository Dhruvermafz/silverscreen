import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Modal, List, Typography } from "antd";
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

const { Title, Text } = Typography;

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
  const [form] = Form.useForm();

  const handlePost = async (values) => {
    try {
      await postToGroup({ groupId, postData: values }).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetchPosts();
    } catch (error) {
      console.error("Failed to post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnGroupPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
    } catch (error) {
      console.error("Failed to comment:", error);
    }
  };

  const handleModerate = async (userId, action) => {
    try {
      if (action === "promote")
        await promoteToModerator({ groupId, userId }).unwrap();
      if (action === "ban")
        await banUserFromGroup({ groupId, userId }).unwrap();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  // Mock flagContent (replace with actual moderation API if available)
  const flagContent = async (contentId, type) => {
    console.log(`Flagging ${type}:`, contentId);
  };

  if (groupLoading || !group) return null;

  return (
    <div style={{ padding: 24 }}>
      <BoxOfficeWidget />
      <Title level={2}>{group.name}</Title>
      <Text>{group.description}</Text>
      <p>
        <Text strong>Privacy: </Text>
        {group.isPrivate ? "Private" : "Public"}
      </p>
      <p>
        <Text strong>Members: </Text>
        {group.members.length}
      </p>
      {group.rules && group.rules.length > 0 && (
        <div>
          <Title level={4}>Group Rules</Title>
          <List
            dataSource={group.rules}
            renderItem={(rule, index) => (
              <List.Item>
                {index + 1}. {rule}
              </List.Item>
            )}
          />
        </div>
      )}
      {group.userRole === "creator" && (
        <Button
          onClick={() => handleModerate("userId", "promote")}
          style={{ marginRight: 8 }}
        >
          Promote to Moderator
        </Button>
      )}
      {group.userRole === "creator" && (
        <Button onClick={() => handleModerate("userId", "ban")} danger>
          Ban User
        </Button>
      )}
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ margin: "16px 0" }}
      >
        Create Post
      </Button>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onComment={handleComment}
          onLike={() => {}}
          //   onFlag={flagContent}
        />
      ))}
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
            <Input.TextArea placeholder="Content" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupDetailPage;
