import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Select,
  Upload,
  Row,
  Col,
  Pagination,
  Space,
  Dropdown,
  Menu,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import NewsroomCard from "./NewsroomCard";
import SearchBar from "../SearchBar";
import BoxOfficeWidget from "../BoxOfficeWdget";
import {
  useGetAllNewsroomsQuery,
  useCreateNewsroomMutation,
} from "../../actions/newsroomApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { Option } = Select;

const NewsroomPage = () => {
  const { data: newsrooms = [], refetch } = useGetAllNewsroomsQuery();
  const [createNewsroom] = useCreateNewsroomMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filteredNewsrooms, setFilteredNewsrooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 6;
  const loaderRef = useRef(null);

  useEffect(() => {
    // Filter and sort newsrooms
    let result = [...newsrooms];
    if (searchQuery) {
      result = result.filter(
        (nr) =>
          nr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nr.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "mostFollowed") {
      result.sort(
        (a, b) => (b.followers?.length || 0) - (a.followers?.length || 0)
      );
    }
    setFilteredNewsrooms(result);
    setHasMore(result.length > page * pageSize);
  }, [newsrooms, searchQuery, sortBy, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isModalOpen) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isModalOpen]);

  const handleCreateNewsroom = async (values) => {
    try {
      const newsroomData = {
        ...values,
        coverImage: values.coverImage?.[0]?.response?.url || "", // Assume API returns URL
      };
      await createNewsroom(newsroomData).unwrap();
      setIsModalOpen(false);
      form.resetFields();
      refetch();
      toast.success("Newsroom created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to create newsroom", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleFollow = (newsroomId) => {
    // Mock follow (replace with API)
    toast.success("Followed newsroom", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleUnfollow = (newsroomId) => {
    // Mock unfollow (replace with API)
    toast.success("Unfollowed newsroom", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handleShare = (newsroom) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/newsroom/${newsroom.id}`
    );
    toast.success("Newsroom URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleReport = (newsroom) => {
    // Mock report (replace with API)
    toast.info(`Reported newsroom: ${newsroom.title}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const actionMenu = (newsroom) => (
    <Menu>
      <Menu.Item key="share" onClick={() => handleShare(newsroom)}>
        <ShareAltOutlined /> Share
      </Menu.Item>
      <Menu.Item key="report" onClick={() => handleReport(newsroom)}>
        <FlagOutlined /> Report
      </Menu.Item>
    </Menu>
  );

  const paginatedNewsrooms = filteredNewsrooms.slice(0, page * pageSize);

  return (
    <div className="newsroom-page">
      <BoxOfficeWidget />
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <SearchBar
            placeholder="Search newsrooms..."
            onSearch={handleSearch}
            style={{ width: "100%" }}
            aria-label="Search newsrooms"
          />
        </Col>
        <Col xs={24} md={12}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: 150 }}
              aria-label="Sort newsrooms"
            >
              <Option value="newest">Newest</Option>
              <Option value="mostFollowed">Most Followed</Option>
            </Select>
            <Tooltip title="Create a new newsroom">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
                aria-label="Create newsroom"
              >
                Create Newsroom
              </Button>
            </Tooltip>
          </Space>
        </Col>
      </Row>

      {/* Featured Newsrooms */}
      {newsrooms.length > 0 && (
        <div className="featured-section">
          <Title level={3}>Featured Newsrooms</Title>
          <Row gutter={[16, 16]}>
            {newsrooms
              .filter((nr) => nr.isFeatured) // Assume API provides isFeatured
              .slice(0, 3)
              .map((newsroom) => (
                <Col xs={24} sm={12} md={8} key={newsroom.id}>
                  <NewsroomCard
                    newsroom={newsroom}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    isFollowing={newsroom.isFollowing}
                    actionMenu={actionMenu(newsroom)}
                  />
                </Col>
              ))}
          </Row>
        </div>
      )}

      {/* All Newsrooms */}
      <Title level={3} style={{ marginTop: 24 }}>
        All Newsrooms
      </Title>
      <Row gutter={[16, 16]}>
        {paginatedNewsrooms.length > 0 ? (
          paginatedNewsrooms.map((newsroom) => (
            <Col xs={24} sm={12} md={8} key={newsroom.id}>
              <NewsroomCard
                newsroom={newsroom}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                isFollowing={newsroom.isFollowing}
                actionMenu={actionMenu(newsroom)}
              />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Text>No newsrooms found</Text>
          </Col>
        )}
      </Row>
      <div ref={loaderRef} style={{ height: 20 }} />
      {filteredNewsrooms.length > pageSize && (
        <Pagination
          current={page}
          total={filteredNewsrooms.length}
          pageSize={pageSize}
          onChange={(newPage) => setPage(newPage)}
          style={{ textAlign: "center", marginTop: 16 }}
        />
      )}

      <Modal
        title="Create Newsroom"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateNewsroom} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Newsroom Title" aria-label="Newsroom title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Description"
              rows={4}
              aria-label="Newsroom description"
            />
          </Form.Item>
          <Form.Item name="isPrivate" label="Privacy" initialValue={false}>
            <Select aria-label="Newsroom privacy">
              <Option value={false}>Public</Option>
              <Option value={true}>Private</Option>
            </Select>
          </Form.Item>
          <Form.Item name="coverImage" label="Cover Image">
            <Upload
              action="/api/upload" // Replace with actual upload endpoint
              listType="picture"
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsroomPage;
