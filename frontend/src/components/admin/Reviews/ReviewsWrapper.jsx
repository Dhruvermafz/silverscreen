import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Pagination,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useToggleReviewStatusMutation,
} from "../../../actions/reviewApi";

const { Option } = Select;

const ReviewWrapper = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  // Fetch reviews with query parameters
  const {
    data: reviews,
    isLoading,
    error,
  } = useGetReviewsQuery({
    movieId: "all", // Modify API to support fetching all reviews for admin
    search: searchText,
    sort: sortBy,
    page: currentPage,
    limit: pageSize,
  });

  const [deleteReview] = useDeleteReviewMutation();
  const [toggleReviewStatus] = useToggleReviewStatusMutation();

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast.error("Failed to load reviews", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, [error]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle pagination change
  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Handle delete action
  const handleDelete = (id) => {
    setSelectedReviewId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteReview(selectedReviewId).unwrap();
      toast.success(`Review ${selectedReviewId} deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error("Failed to delete review", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    setIsModalOpen(false);
    setSelectedReviewId(null);
  };

  // Handle status toggle
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await toggleReviewStatus({
        id,
        status: currentStatus === "visible" ? "banned" : "visible",
      }).unwrap();
      toast.success(
        `Review ${id} ${currentStatus === "visible" ? "banned" : "unbanned"}`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } catch (err) {
      toast.error("Failed to toggle review status", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "User",
      dataIndex: "author",
      key: "author",
      render: (text, record) => <a href={`/u/${record.user._id}`}>{text}</a>,
    },
    {
      title: "Movie",
      dataIndex: "movieTitle",
      key: "movieTitle",
      render: (text, record) => <a href={`/movies/${record.movie}`}>{text}</a>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Tag color="gold">{rating}</Tag>,
    },
    {
      title: "Comment",
      dataIndex: "content",
      key: "content",
      render: (text) => text || "N/A",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "visible" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/movies/${record.movie}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/reviews/edit/${record.id}`)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
          <Button
            type="text"
            onClick={() => handleStatusToggle(record.id, record.status)}
          >
            {record.status === "visible" ? "Ban" : "Unban"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="review-wrapper">
      <div className="main-header">
        <h2>Reviews</h2>
        <div className="main-header-actions">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search reviews..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: 200, marginRight: 16 }}
          />
          <Select
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: 150 }}
          >
            <Option value="createdAt">Date Created</Option>
            <Option value="rating">Rating</Option>
          </Select>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={reviews || []}
        loading={isLoading}
        pagination={false}
        rowKey="id"
        className="review-table"
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={reviews?.total || 0} // Adjust based on API response
        onChange={handlePaginationChange}
        showSizeChanger
        pageSizeOptions={["10", "20", "50"]}
        style={{ marginTop: 16, textAlign: "right" }}
      />
      <Modal
        title="Confirm Delete"
        open={isModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this review?</p>
      </Modal>
    </div>
  );
};

export default ReviewWrapper;
