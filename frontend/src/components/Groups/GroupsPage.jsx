import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  Row,
  Col,
  Card,
  Space,
  message,
  Upload,
  Typography,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
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

const { Title, Text } = Typography;
const { Option } = Select;

const GroupsPage = () => {
  const navigate = useNavigate();
  const { data: groups = [], refetch } = useGetAllGroupsQuery();
  const [createGroup] = useCreateGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchedGroups = [] } = useSearchGroupsQuery(searchQuery, {
    skip: !searchQuery,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [category, setCategory] = useState("all");
  const [fileList, setFileList] = useState([]);

  const categories = [
    { value: "all", label: "All" },
    { value: "movies", label: "Movies" },
    { value: "tv-shows", label: "TV Shows" },
    { value: "anime", label: "Anime" },
    { value: "documentaries", label: "Documentaries" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateGroup = async (values) => {
    try {
      const groupData = {
        ...values,
        isPrivate: !values.isPublic,
        rules: values.rules
          ? values.rules.split("\n").filter((r) => r.trim())
          : [],
        coverImage: fileList.length > 0 ? fileList[0].url : null,
        category: values.category || "movies",
      };
      await createGroup(groupData).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      refetch();
      message.success("Group created successfully");
    } catch (error) {
      message.error("Failed to create group");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId).unwrap();
      refetch();
      message.success("Joined group successfully");
    } catch (error) {
      message.error("Failed to join group");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId).unwrap();
      refetch();
      message.success("Left group successfully");
    } catch (error) {
      message.error("Failed to leave group");
    }
  };

  const filteredGroups = (searchQuery ? searchedGroups : groups).filter(
    (group) => category === "all" || group.category === category
  );

  const uploadProps = {
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList([...fileList, { ...file, url: URL.createObjectURL(file) }]);
      return false;
    },
    fileList,
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Title level={3} style={{ margin: 0, fontWeight: 500 }}>
              Discover Groups
            </Title>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Create Group
            </Button>
          </div>

          {/* Filters */}
          <Space
            style={{ marginBottom: "24px", width: "100%", flexWrap: "wrap" }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search groups..."
              style={{ flex: 1, minWidth: "200px" }}
              prefix={<SearchOutlined />}
            />
            <Select
              value={category}
              style={{ width: "150px" }}
              onChange={setCategory}
              bordered={false}
            >
              {categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Space>

          {/* Groups Grid */}
          <Row gutter={[16, 16]}>
            {filteredGroups.map((group) => (
              <Col xs={24} sm={12} md={8} key={group.id}>
                <GroupCard
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  userRole={group.userRole}
                  onView={() => navigate(`/groups/${group.id}`)}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={6}>
          <BoxOfficeWidget style={{ marginTop: "16px" }} />
        </Col>
      </Row>

      {/* Create Group Modal */}
      <Modal
        title="Create New Group"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Create"
        cancelText="Cancel"
        width={400}
      >
        <Form form={form} onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter a group name" }]}
          >
            <Input placeholder="Group Name" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea placeholder="Description" rows={3} />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select placeholder="Select category">
              {categories.slice(1).map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="coverImage" label="Cover Image">
            <Upload {...uploadProps} accept="image/*">
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
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
