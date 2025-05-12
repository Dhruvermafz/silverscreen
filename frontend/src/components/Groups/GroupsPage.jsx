import React, { useState } from "react";
import { Button, Modal, Form, Input, Checkbox } from "antd";
import GroupCard from "./GroupCard";
import SearchBar from "../SearchBar";
import BoxOfficeWidget from "../BoxOfficeWdget";
import {
  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useSearchGroupsQuery,
} from "../../actions/groupApi";

const GroupsPage = () => {
  const { data: groups = [], refetch } = useGetAllGroupsQuery();
  console.log(groups);
  const [createGroup] = useCreateGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchedGroups = [] } = useSearchGroupsQuery(searchQuery, {
    skip: !searchQuery,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateGroup = async (values) => {
    try {
      // Map isPrivate to match schema (default false means public)
      const groupData = {
        ...values,
        isPrivate: !values.isPublic, // Convert checkbox (true=public) to schema (false=public)
        rules: values.rules
          ? values.rules.split("\n").filter((r) => r.trim())
          : [],
      };
      await createGroup(groupData).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to join group:", error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to leave group:", error);
    }
  };

  const displayGroups = searchQuery ? searchedGroups : groups;

  return (
    <div style={{ padding: 24 }}>
      <BoxOfficeWidget />
      <SearchBar onSearch={handleSearch} placeholder="Search groups..." />
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create Group
      </Button>
      {displayGroups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onJoin={handleJoinGroup}
          onLeave={handleLeaveGroup}
          userRole={group.userRole} // Assume API returns based on members array
        />
      ))}
      <Modal
        title="Create Group"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateGroup}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter a group name" }]}
          >
            <Input placeholder="Group Name" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item name="rules" label="Rules">
            <Input.TextArea placeholder="Enter group rules (one per line)" />
          </Form.Item>
          <Form.Item
            name="isPublic"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Public Group</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupsPage;
