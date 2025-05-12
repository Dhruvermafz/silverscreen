import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import NewsroomCard from "./NewsroomCard";
import SearchBar from "../SearchBar";
import BoxOfficeWidget from "../BoxOfficeWdget";

import {
  useGetAllNewsroomsQuery,
  useCreateNewsroomMutation,
  // Assume follow/unfollow are implemented in backend but not in router
} from "../../actions/newsroomApi";

const NewsroomPage = () => {
  const { data: newsrooms = [], refetch } = useGetAllNewsroomsQuery();
  const [createNewsroom] = useCreateNewsroomMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreateNewsroom = async (values) => {
    try {
      await createNewsroom(values).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error("Failed to create newsroom:", error);
    }
  };

  // Mock follow/unfollow (since not in router, assume future implementation)
  const handleFollow = (newsroomId) => {
    console.log("Following newsroom:", newsroomId);
  };

  const handleUnfollow = (newsroomId) => {
    console.log("Unfollowing newsroom:", newsroomId);
  };

  return (
    <div style={{ padding: 24 }}>
      <BoxOfficeWidget />
      <SearchBar placeholder="Search newsrooms..." />
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create Newsroom
      </Button>
      {newsrooms.map((newsroom) => (
        <NewsroomCard
          key={newsroom.id}
          newsroom={newsroom}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          isFollowing={newsroom.isFollowing} // Assume fetched from API
        />
      ))}
      <Modal
        title="Create Newsroom"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateNewsroom}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Newsroom Title" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsroomPage;
