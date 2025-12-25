import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Space,
  Tag,
  Avatar,
  Typography,
  message,
  Upload,
  Empty,
  Spin,
  Card,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  TeamOutlined,
  LockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

import BoxOfficeWidget from "../BoxOfficeWdget";
import {
  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "../../actions/groupApi";

const { Title, Text } = Typography;
const { TextArea } = Input;

const categories = [
  { value: "movies", label: "Movies" },
  { value: "tv-shows", label: "TV Shows" },
  { value: "anime", label: "Anime" },
  { value: "documentaries", label: "Documentaries" },
  { value: "bollywood", label: "Bollywood" },
  { value: "horror", label: "Horror" },
];

const GroupsPage = () => {
  const navigate = useNavigate();
  const { data: groups = [], isLoading } = useGetAllGroupsQuery();
  const [createGroup] = useCreateGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateGroup = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("isPrivate", !values.isPublic);
      if (values.rules) {
        values.rules
          .split("\n")
          .filter((r) => r.trim())
          .forEach((rule, i) => {
            formData.append(`rules[${i}]`, rule.trim());
          });
      }
      if (fileList[0]?.originFileObj) {
        formData.append("coverImage", fileList[0].originFileObj);
      }

      await createGroup(formData).unwrap();
      message.success("Community created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
    } catch (err) {
      message.error("Failed to create community");
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await joinGroup(groupId).unwrap();
      message.success("Joined community!");
    } catch {
      message.error("Failed to join");
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await leaveGroup(groupId).unwrap();
      message.success("Left community");
    } catch {
      message.error("Failed to leave");
    }
  };

  return (
    <div className="groups-page container py-5">
      <Row gutter={[32, 32]}>
        {/* Main Content */}
        <Col xs={24} lg={18}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <Title level={1} className="mb-2">
                Communities
              </Title>
              <Text type="secondary" style={{ fontSize: "1.1rem" }}>
                Join discussions about your favorite movies, shows, and genres
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Community
            </Button>
          </div>

          {/* Filters */}
          <Space size="middle" className="mb-4 w-100" wrap>
            <Input.Search
              placeholder="Search communities..."
              allowClear
              onSearch={setSearchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: 400 }}
              size="large"
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
              size="large"
            >
              <Select.Option value="all">All Categories</Select.Option>
              {categories.map((cat) => (
                <Select.Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Select.Option>
              ))}
            </Select>
          </Space>

          {/* Groups Grid */}
          {isLoading ? (
            <Row gutter={[24, 24]}>
              {[...Array(6)].map((_, i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <Card loading style={{ borderRadius: 16 }} />
                </Col>
              ))}
            </Row>
          ) : filteredGroups.length === 0 ? (
            <Empty
              description={
                searchQuery || selectedCategory !== "all"
                  ? "No communities match your search"
                  : "No communities yet — create the first one!"
              }
            />
          ) : (
            <Row gutter={[24, 32]}>
              {filteredGroups.map((group) => (
                <Col xs={24} sm={12} lg={12} xl={8} key={group._id}>
                  <Card
                    hoverable
                    style={{ borderRadius: 16, overflow: "hidden" }}
                    cover={
                      <div
                        className="position-relative"
                        style={{
                          height: 200,
                          backgroundImage: `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7)), url(${
                            group.coverImage ||
                            "/assets/imgs/placeholder-cover.jpg"
                          })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/group/${group._id}`)}
                      >
                        <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white">
                          <Title level={4} className="mb-1 text-white">
                            {group.name}
                          </Title>
                          <Space size="small">
                            {group.isPrivate ? (
                              <Tag icon={<LockOutlined />} color="red">
                                Private
                              </Tag>
                            ) : (
                              <Tag icon={<GlobalOutlined />} color="green">
                                Public
                              </Tag>
                            )}
                            <Tag icon={<TeamOutlined />}>
                              {group.members?.length || 0} members
                            </Tag>
                          </Space>
                        </div>
                      </div>
                    }
                    bodyStyle={{ padding: "20px" }}
                    onClick={() => navigate(`/group/${group._id}`)}
                  >
                    <Text type="secondary" className="d-block mb-3">
                      {group.description || "No description yet"}
                    </Text>

                    <Space className="w-100 justify-content-between">
                      <Space size="small">
                        <Avatar.Group maxCount={4}>
                          {group.members?.slice(0, 6).map((member, i) => (
                            <Avatar key={i} size="small" src={member.avatar} />
                          ))}
                        </Avatar.Group>
                        {group.members?.length > 6 && (
                          <Text type="secondary" strong>
                            +{group.members.length - 6} more
                          </Text>
                        )}
                      </Space>

                      <Button
                        type="primary"
                        size="middle"
                        onClick={(e) => {
                          e.stopPropagation();
                          group.isMember
                            ? handleLeave(group._id)
                            : handleJoin(group._id);
                        }}
                      >
                        {group.isMember ? "Leave" : "Join"}
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Create Group Modal */}
      <Modal
        title={<Title level={4}>Create New Community</Title>}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            name="name"
            label="Community Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="e.g., Classic Horror Fans" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <TextArea
              rows={3}
              placeholder="What is this community about?"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a category" size="large">
              {categories.map((cat) => (
                <Select.Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="coverImage" label="Cover Image (Optional)">
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) =>
                  setFileList(newFileList)
                }
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item
            name="isPublic"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Public (anyone can join)</Checkbox>
          </Form.Item>

          <Form.Item name="rules" label="Rules (Optional, one per line)">
            <TextArea
              rows={4}
              placeholder="1. Be kind and respectful&#10;2. No spoilers without warning&#10;3. Stay on topic"
            />
          </Form.Item>

          <Button type="primary" size="large" block htmlType="submit">
            Create Community
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupsPage;
