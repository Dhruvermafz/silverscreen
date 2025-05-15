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
  Tag,
  Carousel,
  message,
  Upload,
  Typography,
  List,
} from "antd";
import {
  UploadOutlined,
  StarOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
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
  const [sortBy, setSortBy] = useState("new");
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
        coverImage: fileList.length > 0 ? fileList[0].url : null, // Mock URL handling
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
      console.error("Failed to create group:", error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId).unwrap();
      refetch();
      message.success("Joined group successfully");
    } catch (error) {
      message.error("Failed to join group");
      console.error("Failed to join group:", error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId).unwrap();
      refetch();
      message.success("Left group successfully");
    } catch (error) {
      message.error("Failed to leave group");
      console.error("Failed to leave group:", error);
    }
  };

  const handleShareGroup = (groupId) => {
    message.info("Group link copied!");
    console.log("Sharing group:", groupId);
  };

  const handleReportGroup = (groupId) => {
    message.info("Group reported");
    console.log("Reporting group:", groupId);
  };

  const filteredGroups = (searchQuery ? searchedGroups : groups).filter(
    (group) => category === "all" || group.category === category
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "popular") return b.members.length - a.members.length;
    if (sortBy === "active") return b.postCount - a.postCount; // Assume postCount from API
    return 0;
  });

  const featuredGroups = sortedGroups.slice(0, 3); // Mock featured groups

  const uploadProps = {
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      // Mock file upload (replace with actual upload logic)
      setFileList([...fileList, { ...file, url: URL.createObjectURL(file) }]);
      return false; // Prevent default upload behavior
    },
    fileList,
  };

  return (
    <div className="groups-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          {/* Header */}
          <Title level={2}>Discover Groups</Title>
          <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
            <SearchBar onSearch={handleSearch} placeholder="Search groups..." />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={setCategory}
            >
              {categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
            <Select
              defaultValue="new"
              style={{ width: 120 }}
              onChange={setSortBy}
            >
              <Option value="new">Newest</Option>
              <Option value="popular">Popular</Option>
              <Option value="active">Most Active</Option>
            </Select>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Create Group
            </Button>
          </Space>

          {/* Featured Groups Carousel */}
          {featuredGroups.length > 0 && (
            <Card title="Featured Groups" style={{ marginBottom: 16 }}>
              <Carousel autoplay>
                {featuredGroups.map((group) => (
                  <div key={group.id}>
                    <Card
                      cover={
                        <img
                          alt={group.name}
                          src={
                            group.coverImage ||
                            "https://via.placeholder.com/300x150"
                          }
                          style={{ height: 150, objectFit: "cover" }}
                        />
                      }
                      actions={[
                        <Button
                          key="join"
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={group.userRole !== "none"}
                        >
                          {group.userRole === "none" ? "Join" : "Joined"}
                        </Button>,
                        <Button
                          key="view"
                          onClick={() => navigate(`/groups/${group.id}`)}
                        >
                          View
                        </Button>,
                        <Button
                          key="share"
                          icon={<ShareAltOutlined />}
                          onClick={() => handleShareGroup(group.id)}
                        />,
                      ]}
                    >
                      <Card.Meta
                        title={group.name}
                        description={
                          <Text ellipsis>
                            {group.description || "No description available"}
                          </Text>
                        }
                      />
                      <Space style={{ marginTop: 8 }}>
                        <Text>{group.members.length} members</Text>
                        <Tag>{group.isPrivate ? "Private" : "Public"}</Tag>
                      </Space>
                    </Card>
                  </div>
                ))}
              </Carousel>
            </Card>
          )}

          {/* All Groups */}
          <Row gutter={[16, 16]}>
            {sortedGroups.map((group) => (
              <Col xs={24} sm={12} key={group.id}>
                <GroupCard
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  userRole={group.userRole}
                  onReport={handleReportGroup}
                  onShare={handleShareGroup}
                  onView={() => navigate(`/groups/${group.id}`)}
                />
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={24} md={8}>
          {/* Sidebar */}
          <Card title="Suggested Groups" style={{ marginBottom: 16 }}>
            <List
              dataSource={sortedGroups.slice(0, 5)}
              renderItem={(group) => (
                <List.Item
                  actions={[
                    <Button
                      key="join"
                      size="small"
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={group.userRole !== "none"}
                    >
                      {group.userRole === "none" ? "Join" : "Joined"}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={group.name}
                    description={
                      <Text ellipsis>
                        {group.description || "No description"}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card title="Trending Categories">
            <Space wrap>
              {categories.slice(1).map((cat) => (
                <Tag
                  key={cat.value}
                  style={{ cursor: "pointer" }}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </Tag>
              ))}
            </Space>
          </Card>
          <BoxOfficeWidget style={{ marginTop: 16 }} />
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
      >
        <Form form={form} onFinish={handleCreateGroup}>
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
            <Input.TextArea placeholder="Description" rows={4} />
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
          <Form.Item name="rules" label="Rules">
            <Input.TextArea
              placeholder="Enter group rules (one per line)"
              rows={4}
            />
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
