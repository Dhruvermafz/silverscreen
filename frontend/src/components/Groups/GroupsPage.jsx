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
import "./groups.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
      setFileList([{ ...file, url: URL.createObjectURL(file) }]);
      return false;
    },
    fileList,
    maxCount: 1,
    listType: "picture",
  };

  return (
    <section className="groups-page" aria-label="Groups page">
      <div className="groups-container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={18}>
            {/* Header */}
            <div className="groups-header">
              <Title level={3} className="groups-title">
                Discover Groups
              </Title>
              <Button
                type="primary"
                onClick={() => setIsModalOpen(true)}
                className="groups-create-button"
                aria-label="Create a new group"
              >
                Create Group
              </Button>
            </div>

            {/* Filters */}
            <Space className="groups-filters" wrap>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search groups..."
                className="groups-search"
                prefix={<SearchOutlined />}
                aria-label="Search groups"
              />
              <Select
                value={category}
                onChange={setCategory}
                className="groups-select"
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Space>

            {/* Groups Grid */}
            <Row gutter={[16, 16]} className="groups-grid">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <Col xs={24} sm={12} md={8} key={group._id}>
                    <GroupCard
                      group={group}
                      onJoin={handleJoinGroup}
                      onLeave={handleLeaveGroup}
                      userRole={group.userRole}
                      onView={() => navigate(`/group/${group._id}`)}
                      className="group-card-wrapper"
                    />
                  </Col>
                ))
              ) : (
                <Col xs={24}>
                  <Text className="groups-empty-text">
                    No groups found matching your criteria.
                  </Text>
                </Col>
              )}
            </Row>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={6}>
            <BoxOfficeWidget className="groups-sidebar-widget" />
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
          className="groups-create-modal"
          aria-label="Create new group modal"
        >
          <Form form={form} onFinish={handleCreateGroup} layout="vertical">
            <Form.Item
              name="name"
              label="Group Name"
              rules={[{ required: true, message: "Please enter a group name" }]}
            >
              <Input placeholder="Group Name" className="groups-form-input" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <TextArea
                placeholder="Description"
                rows={3}
                className="groups-form-input"
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                className="groups-form-select"
              >
                {categories.slice(1).map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="coverImage" label="Cover Image">
              <Upload
                {...uploadProps}
                accept="image/*"
                className="groups-upload"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="groups-upload-button"
                >
                  Upload Image
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="isPublic"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox className="groups-checkbox">Public Group</Checkbox>
            </Form.Item>
            <Form.Item name="rules" label="Rules">
              <TextArea
                placeholder="Enter one rule per line"
                rows={3}
                className="groups-form-input"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </section>
  );
};

export default GroupsPage;
