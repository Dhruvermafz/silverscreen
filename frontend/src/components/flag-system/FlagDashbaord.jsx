import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Typography,
  message,
  Tag,
} from "antd";
import {
  useGetAllFlagsQuery, // Updated to fetch all flags
  useReviewFlagMutation,
} from "../../actions/flagApi";
import { useGetProfileQuery } from "../../actions/userApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetUserFlagsQuery } from "../../actions/flagApi";
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const FlagDashboard = () => {
  const { userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("pending");
  const [adminResponse, setAdminResponse] = useState("");

  // Fetch user profile to check admin status
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery(
    userId,
    {
      skip: !userId,
    }
  );

  // Define isAdmin based on profile role
  const isAdmin = () => profile?.role === "admin";

  // Fetch all flags
  const {
    data: flags = [],
    isLoading,
    refetch,
  } = useGetUserFlagsQuery(undefined, {
    skip: !isAdmin() || profileLoading, // Skip if not admin or profile is loading
  });

  const [reviewFlag] = useReviewFlagMutation();

  // Redirect non-admins
  if (!profileLoading && !isAdmin()) {
    message.error("Access denied: Admins only");
    navigate("/");
    return null;
  }

  const handleReview = (flag) => {
    setSelectedFlag(flag);
    setReviewStatus(flag.status);
    setAdminResponse(flag.adminResponse || "");
    setIsModalOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      await reviewFlag({
        flagId: selectedFlag._id,
        status: reviewStatus,
        adminResponse,
      }).unwrap();
      message.success("Flag reviewed successfully");
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error("Failed to review flag");
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => <UserName userId={userId} />,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type === "reviewer_role_appeal" ? "Reviewer Appeal" : "Other Complaint",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "approved"
              ? "green"
              : status === "rejected"
              ? "red"
              : "blue"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, flag) => (
        <Button
          type="primary"
          className="flag-review-button"
          onClick={() => handleReview(flag)}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="flag-dashboard">
      <Title level={3}>Flag Review Dashboard</Title>
      <Table
        columns={columns}
        dataSource={flags}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        className="flag-table"
      />
      <Modal
        title="Review Flag"
        open={isModalOpen}
        onOk={handleSubmitReview}
        onCancel={() => setIsModalOpen(false)}
        okText="Submit"
        cancelText="Cancel"
        className="flag-review-modal"
      >
        {selectedFlag && (
          <div>
            <p>
              <strong>User:</strong> <UserName userId={selectedFlag.userId} />
            </p>
            <p>
              <strong>Type:</strong>{" "}
              {selectedFlag.type === "reviewer_role_appeal"
                ? "Reviewer Appeal"
                : "Other Complaint"}
            </p>
            <p>
              <strong>Reason:</strong> {selectedFlag.reason}
            </p>
            <p>
              <strong>Description:</strong> {selectedFlag.description}
            </p>
            {selectedFlag.evidence && (
              <p>
                <strong>Evidence:</strong>{" "}
                <a
                  href={selectedFlag.evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </p>
            )}
            <p>
              <strong>Status:</strong>
              <Select
                value={reviewStatus}
                onChange={setReviewStatus}
                style={{ width: "100%", margin: "10px 0" }}
              >
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </p>
            <p>
              <strong>Admin Response:</strong>
              <TextArea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                rows={4}
                placeholder="Enter your response"
              />
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Helper component to fetch and display user name
const UserName = ({ userId }) => {
  const { data: user } = useGetProfileQuery(userId, { skip: !userId });
  return user ? user.username : "Loading...";
};

export default FlagDashboard;
