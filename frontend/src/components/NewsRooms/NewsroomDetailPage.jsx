import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Modal } from "antd";
import PostCard from "../PostCard";
import BoxOfficeWidget from "../BoxOfficeWdget";

import {
  useGetNewsroomByIdQuery,
  useGetAllNewsPostsQuery,
  usePostNewsToNewsroomMutation,
  useCommentOnNewsPostMutation,
  useAddNewsroomModeratorMutation,
} from "../../actions/newsroomApi";

const NewsroomDetailPage = () => {
  const { newsroomId } = useParams();
  const { data: newsroom, isLoading: newsroomLoading } =
    useGetNewsroomByIdQuery(newsroomId);
  const { data: posts = [], refetch: refetchPosts } =
    useGetAllNewsPostsQuery(newsroomId);
  const [postNewsToNewsroom] = usePostNewsToNewsroomMutation();
  const [commentOnNewsPost] = useCommentOnNewsPostMutation();
  const [addNewsroomModerator] = useAddNewsroomModeratorMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handlePost = async (values) => {
    try {
      await postNewsToNewsroom({ newsroomId, postData: values }).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetchPosts();
    } catch (error) {
      console.error("Failed to post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnNewsPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
    } catch (error) {
      console.error("Failed to comment:", error);
    }
  };

  const handleAddModerator = async (userId) => {
    try {
      await addNewsroomModerator({ newsroomId, userId }).unwrap();
    } catch (error) {
      console.error("Failed to add moderator:", error);
    }
  };

  if (newsroomLoading || !newsroom) return null;

  return (
    <div style={{ padding: 24 }}>
      <BoxOfficeWidget />
      <h1>{newsroom.title}</h1>
      <p>{newsroom.description}</p>
      {newsroom.userRole === "creator" && (
        <Button onClick={() => handleAddModerator("userId")}>
          Add Moderator
        </Button>
      )}
      {["creator", "editor"].includes(newsroom.userRole) && (
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create Post
        </Button>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onComment={handleComment}
          onLike={() => {}}
          //   onFlag={flagContent}
          canComment={newsroom.commentsEnabled}
        />
      ))}
      <Modal
        title="Create News Post"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handlePost}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Post Title" />
          </Form.Item>
          <Form.Item name="content" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Content" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsroomDetailPage;
