import React, { useState, useEffect, useRef } from "react";
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
  Space,
  message,
  Upload,
  Typography,
  Skeleton,
} from "antd";
import {
  UploadOutlined,
  SearchOutlined,
  PlusOutlined,
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
import "./groups.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const GroupsPage = () => {
  const navigate = useNavigate();
  const { data: groups = [], isLoading, refetch } = useGetAllGroupsQuery();
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
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    { value: "all", label: "All" },
    { value: "movies", label: "Movies" },
    { value: "tv-shows", label: "TV Shows" },
    { value: "anime", label: "Anime" },
    { value: "documentaries", label: "Documentaries" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
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
      message.success("Group created successfully!");
    } catch (error) {
      message.error("Failed to create group.");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId).unwrap();
      refetch();
      message.success("Joined group successfully!");
    } catch (error) {
      message.error("Failed to join group.");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId).unwrap();
      refetch();
      message.success("Left group successfully!");
    } catch (error) {
      message.error("Failed to leave group.");
    }
  };

  const filteredGroups = (searchQuery ? searchedGroups : groups).filter(
    (group) => category === "all" || group.category === category
  );

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList([{ ...file, url: URL.createObjectURL(file) }]);
      return false;
    },
    fileList,
    maxCount: 1,
    listType: "picture-card",
    accept: "image/*",
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  return (
    <section className="groups-page" aria-label="Groups page">
      <div className="groups-container">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={18}>
            {/* Header */}
            <div className="groups-header">
              <Title level={3} className="groups-title">
                Communities
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
                className="groups-create-button"
                aria-label="Create a new community"
              >
                Create Community
              </Button>
            </div>

            {/* Filters */}
            <div className="groups-filters">
              <Space wrap>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search communities..."
                  className="groups-search"
                  prefix={<SearchOutlined />}
                  aria-label="Search communities"
                  allowClear
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
            </div>

            {/* Groups Grid */}
            <div className="groups-grid">
              {isLoading && filteredGroups.length === 0 ? (
                <Row gutter={[16, 16]}>
                  {[...Array(6)].map((_, i) => (
                    <Col xs={24} sm={12} md={8} key={i}>
                      <Skeleton active avatar paragraph={{ rows: 2 }} />
                    </Col>
                  ))}
                </Row>
              ) : filteredGroups.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {filteredGroups.map((group) => (
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
                  ))}
                </Row>
              ) : (
                <Text className="groups-empty-text">
                  No communities found. Try adjusting your search or category.
                </Text>
              )}
              <div ref={loaderRef} className="groups-loader" />
            </div>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={6}>
            <div className="groups-sidebar">
              <BoxOfficeWidget className="groups-sidebar-widget" />
              <div className="groups-sidebar-info">
                <Title level={5}>About Communities</Title>
                <Text>
                  Join communities to discuss movies, TV shows, anime, and more.
                  Create your own to connect with fans!
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* Create Group Modal */}
        <Modal
          title="Create New Community"
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
          aria-label="Create new community modal"
        >
          <Form form={form} onFinish={handleCreateGroup} layout="vertical">
            <Form.Item
              name="name"
              label="Community Name"
              rules={[
                { required: true, message: "Please enter a community name" },
                { max: 50, message: "Name must be 50 characters or less" },
              ]}
            >
              <Input placeholder="e.g., Movie Fans" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
                {
                  max: 200,
                  message: "Description must be 200 characters or less",
                },
              ]}
            >
              <TextArea placeholder="Describe your community" rows={3} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category">
                {categories.slice(1).map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="coverImage" label="Cover Image">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload Banner</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="isPublic"
              valuePropName="checked"
              initialValue={true}
            >
              <Checkbox>Public Community</Checkbox>
            </Form.Item>
            <Form.Item
              name="rules"
              label="Rules"
              extra="Enter one rule per line"
            >
              <TextArea
                placeholder="e.g., Be respectful\nNo spoilers"
                rows={3}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </section>
  );
};

export default GroupsPage;
