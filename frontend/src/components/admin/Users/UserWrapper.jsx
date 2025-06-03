import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Typography,
  Spin,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../Common/Sidebar";
import {
  useGetAllUsersQuery,
  useAddUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useUpdateRoleMutation,
  useCompleteOnboardingMutation,
} from "../../../actions/userApi";

const { Title, Text } = Typography;
const { Option } = Select;

const UserWrapper = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isOnboardingModalVisible, setIsOnboardingModalVisible] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: { current: 1, pageSize: 10 },
    sorter: { field: "createdAt", order: "descend" },
  });

  // API Queries and Mutations
  const {
    data: usersRaw,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery({
    page: tableParams.pagination.current,
    pageSize: tableParams.pagination.pageSize,
    search,
    sort: tableParams.sorter.field,
    order: tableParams.sorter.order === "ascend" ? "asc" : "desc",
  });

  const [addUser, { isLoading: addLoading }] = useAddUserMutation();
  const [updateUserStatus, { isLoading: statusLoading }] =
    useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const [updateUserRole, { isLoading: roleLoading }] = useUpdateRoleMutation();
  const [completeOnboarding, { isLoading: onboardingLoading }] =
    useCompleteOnboardingMutation();

  // Normalize user data
  const users = {
    data: Array.isArray(usersRaw)
      ? usersRaw.map((user) => ({
          id: user._id,
          fullName: user.fullName || "-", // Fallback for missing fullName
          email: user.email,
          username: user.username,
          role: user.role || "viewer",
          pricingPlan: user.pricingPlan || "free",
          commentCount: user.commentCount || 0,
          reviewCount: user.reviewerStatus?.reviewsThisMonth || 0,
          status: user.status || "approved", // Default to approved
          isNewUser: user.isNewUser ?? true, // Default to true
          createdAt: user.createdAt || new Date().toISOString(),
          avatarUrl: user.avatar || "/user.svg",
        }))
      : usersRaw?.data || [],
    total: Array.isArray(usersRaw) ? usersRaw.length : usersRaw?.total || 0,
  };

  // Error Handling
  if (error) {
    console.error("GetAllUsers Error:", error); // Log for debugging
    toast.error(
      "Failed to load users: " + (error.data?.error || "Unknown error"),
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  }

  // Table Handlers
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({ pagination, sorter });
  };

  const handleSearch = (value) => {
    setSearch(value);
    setTableParams((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, current: 1 },
    }));
  };

  const handleSortChange = (value) => {
    setSort(value);
    setTableParams((prev) => ({
      ...prev,
      sorter: { field: value, order: "descend" },
    }));
  };

  // Modal Handlers
  const showAddModal = () => setIsAddModalVisible(true);
  const hideAddModal = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const showStatusModal = (user) => {
    setSelectedUser(user);
    setIsStatusModalVisible(true);
  };

  const hideStatusModal = () => {
    setIsStatusModalVisible(false);
    setSelectedUser(null);
  };

  const showDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setSelectedUser(null);
  };

  const showRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalVisible(true);
    form.setFieldsValue({ role: user.role });
  };

  const hideRoleModal = () => {
    setIsRoleModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const showOnboardingModal = (user) => {
    setSelectedUser(user);
    setIsOnboardingModalVisible(true);
  };

  const hideOnboardingModal = () => {
    setIsOnboardingModalVisible(false);
    setSelectedUser(null);
  };

  const handleAddUser = async (values) => {
    try {
      await addUser(values).unwrap();
      toast.success("User added successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      hideAddModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to add user", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const newStatus =
        selectedUser.status === "approved" ? "banned" : "approved";
      await updateUserStatus({
        id: selectedUser.id,
        status: newStatus,
      }).unwrap();
      toast.success(`User ${newStatus}`, {
        position: "top-right",
        autoClose: 2000,
      });
      hideStatusModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to update status", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success("User deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      hideDeleteModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to delete user", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleUpdateRole = async (values) => {
    try {
      await updateUserRole({
        id: selectedUser.id,
        role: values.role,
      }).unwrap();
      toast.success("User role updated", {
        position: "top-right",
        autoClose: 2000,
      });
      hideRoleModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to update role", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleUpdateOnboarding = async () => {
    try {
      await completeOnboarding({
        id: selectedUser.id,
        isNewUser: !selectedUser.isNewUser,
      }).unwrap();
      toast.success("Onboarding status updated", {
        position: "top-right",
        autoClose: 2000,
      });
      hideOnboardingModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || "Failed to update onboarding status", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Table Columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", sorter: true },
    {
      title: "Basic Info",
      key: "info",
      render: (_, record) => (
        <Space>
          <div>
            <Text strong>{record.fullName}</Text>
            <br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    { title: "Username", dataIndex: "username", key: "username", sorter: true },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: true,
      render: (role) =>
        role ? role.charAt(0).toUpperCase() + role.slice(1) : "Viewer",
    },
    {
      title: "Pricing Plan",
      dataIndex: "pricingPlan",
      key: "pricingPlan",
      sorter: true,
      render: (plan) =>
        plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Free",
    },
    {
      title: "Comments",
      dataIndex: "commentCount",
      key: "commentCount",
      sorter: true,
      render: (count) => count,
    },
    {
      title: "Reviews",
      dataIndex: "reviewCount",
      key: "reviewCount",
      sorter: true,
      render: (count) => count,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) => (
        <Text
          className={
            status === "approved" ? "status-approved" : "status-banned"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      ),
    },
    {
      title: "Onboarding",
      dataIndex: "isNewUser",
      key: "isNewUser",
      render: (isNewUser) => (
        <Text
          className={
            isNewUser ? "onboarding-incomplete" : "onboarding-complete"
          }
        >
          {isNewUser ? "Incomplete" : "Complete"}
        </Text>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip
            title={record.status === "approved" ? "Ban User" : "Approve User"}
          >
            <Button
              icon={<LockOutlined />}
              onClick={() => showStatusModal(record)}
              className="button action-button"
              aria-label={
                record.status === "approved" ? "Ban user" : "Approve user"
              }
            />
          </Tooltip>
          <Tooltip title="Edit Role">
            <Button
              icon={<SettingOutlined />}
              onClick={() => showRoleModal(record)}
              className="button action-button"
              aria-label="Edit user role"
            />
          </Tooltip>
          <Tooltip title="Toggle Onboarding">
            <Button
              icon={<UserAddOutlined />}
              onClick={() => showOnboardingModal(record)}
              className="button action-button"
              aria-label="Toggle onboarding status"
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/users/${record.id}/edit`)}
              className="button action-button"
              aria-label="Edit user"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => showDeleteModal(record)}
              className="button action-button"
              aria-label="Delete user"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <div className="admin-wrapper" style={{ marginLeft: 240 }}>
        {isLoading ? (
          <div className="admin-wrapper-loading">
            <Spin size="large" aria-label="Loading users" />
          </div>
        ) : users.data.length === 0 ? (
          <Row gutter={[16, 16]} role="region" aria-label="Users Management">
            <Col span={24}>
              <Card className="card">
                <Title level={3} className="admin-wrapper-title">
                  No users found
                </Title>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row gutter={[16, 16]} role="region" aria-label="Users Management">
            <Col span={24}>
              <Card className="card">
                <div className="admin-wrapper-header">
                  <Space align="center">
                    <Title level={3} className="admin-wrapper-title">
                      Users
                    </Title>
                    <Text type="secondary">{users.total} Total</Text>
                  </Space>
                  <Space wrap>
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      onClick={showAddModal}
                      className="button"
                      aria-label="Add new user"
                    >
                      Add User
                    </Button>
                    <Select
                      defaultValue="createdAt"
                      onChange={handleSortChange}
                      style={{ width: 140 }}
                      aria-label="Sort users"
                    >
                      <Option value="createdAt">Date Created</Option>
                      <Option value="pricingPlan">Pricing Plan</Option>
                      <Option value="status">Status</Option>
                      <Option value="role">Role</Option>
                    </Select>
                    <Input.Search
                      placeholder="Find user..."
                      onSearch={handleSearch}
                      style={{ width: 200 }}
                      allowClear
                      enterButton={<SearchOutlined />}
                      aria-label="Search users"
                    />
                  </Space>
                </div>
              </Card>
            </Col>
            <Col span={24}>
              <Card className="card admin-wrapper-table">
                <Table
                  columns={columns}
                  dataSource={users.data}
                  pagination={{
                    ...tableParams.pagination,
                    total: users.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} users`,
                  }}
                  onChange={handleTableChange}
                  rowKey="id"
                  scroll={{ x: 1400 }}
                  role="grid"
                  aria-label="Users table"
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Add User Modal */}
        <Modal
          title="Add New User"
          open={isAddModalVisible}
          onCancel={hideAddModal}
          footer={null}
          className="modal"
          aria-label="Add user modal"
        >
          <Form form={form} layout="vertical" onFinish={handleAddUser}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="pricingPlan"
              label="Pricing Plan"
              rules={[
                { required: true, message: "Please select pricing plan" },
              ]}
            >
              <Select placeholder="Select plan">
                <Option value="free">Free</Option>
                <Option value="premium">Premium</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={addLoading}
                className="button"
              >
                Add User
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Status Modal */}
        <Modal
          title={
            selectedUser?.status === "approved" ? "Ban User" : "Approve User"
          }
          open={isStatusModalVisible}
          onOk={handleUpdateStatus}
          onCancel={hideStatusModal}
          confirmLoading={statusLoading}
          className="modal"
          aria-label="Change user status modal"
        >
          <p>
            Are you sure you want to{" "}
            {selectedUser?.status === "approved" ? "ban" : "approve"}{" "}
            {selectedUser?.fullName}?
          </p>
        </Modal>

        {/* Role Modal */}
        <Modal
          title="Update User Role"
          open={isRoleModalVisible}
          onCancel={hideRoleModal}
          footer={null}
          className="modal"
          aria-label="Update user role modal"
        >
          <Form form={form} layout="vertical" onFinish={handleUpdateRole}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select role">
                <Option value="viewer">Viewer</Option>
                <Option value="filmmaker">Filmmaker</Option>
                <Option value="reviewer">Reviewer</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={roleLoading}
                className="button"
              >
                Update Role
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Onboarding Modal */}
        <Modal
          title="Toggle Onboarding Status"
          open={isOnboardingModalVisible}
          onOk={handleUpdateOnboarding}
          onCancel={hideOnboardingModal}
          confirmLoading={onboardingLoading}
          className="modal"
          aria-label="Toggle onboarding status modal"
        >
          <p>
            Set onboarding status for {selectedUser?.fullName} to{" "}
            {selectedUser?.isNewUser ? "Complete" : "Incomplete"}?
          </p>
        </Modal>

        {/* Delete Modal */}
        <Modal
          title="Delete User"
          open={isDeleteModalVisible}
          onOk={handleDeleteUser}
          onCancel={hideDeleteModal}
          confirmLoading={deleteLoading}
          className="modal"
          aria-label="Delete user modal"
        >
          <p>Are you sure you want to delete {selectedUser?.fullName}?</p>
        </Modal>
      </div>
    </>
  );
};

export default UserWrapper;
