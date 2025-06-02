import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Card,
  List,
  message,
  Spin,
  Tabs,
  Button,
  Row,
  Col,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  Dropdown,
  Menu,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  MessageOutlined,
  FlagOutlined,
  ShareAltOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProfileQuery,
  useFollowUserMutation,
  useGetUserByIdQuery,
  useGetUserReviewsQuery,
  useGetUserRequestsQuery,
  useUpdateProfileMutation,
} from "../../actions/userApi";
import SuggestMovieModal from "../Movie/SuggestAMovie";
import "./profile.css";

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ProfileWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: authUser,
    isLoading: authLoading,
    error: authError,
  } = useGetProfileQuery();
  const [followUser] = useFollowUserMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isSuggestModalOpen, setSuggestModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false); // Mock follow status

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserByIdQuery(id === "me" ? authUser?._id : id, {
    skip: !authUser?._id || !id,
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetUserReviewsQuery(authUser?._id, {
    skip: !isOwnProfile || !authUser?._id,
  });

  const {
    data: movieRequests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useGetUserRequestsQuery(authUser?._id, {
    skip: !isOwnProfile || !authUser?._id,
  });

  useEffect(() => {
    if (!authLoading && authUser) {
      setIsOwnProfile(id === "me" || id === authUser._id);
    }
  }, [id, authUser, authLoading]);

  const handleFollow = async () => {
    try {
      await followUser(userData._id).unwrap();
      setIsFollowing(!isFollowing);
      message.success(isFollowing ? "Unfollowed user" : "Followed user");
    } catch (err) {
      message.error("Failed to follow/unfollow user");
    }
  };

  const handleEditProfile = async (values) => {
    try {
      const profileData = {
        ...values,
        avatar: fileList.length > 0 ? fileList[0].url : userData?.avatar,
        favoriteMovies: values.favoriteMovies
          ? values.favoriteMovies.split("\n").filter((m) => m.trim())
          : [],
        favoriteGenres: values.favoriteGenres
          ? values.favoriteGenres.split("\n").filter((g) => g.trim())
          : [],
      };
      await updateProfile(profileData).unwrap();
      setIsEditModalOpen(false);
      form.resetFields();
      setFileList([]);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Failed to update profile");
      console.error("Failed to update profile:", error);
    }
  };

  const handleMessage = () => {
    message.info("Opening chat with user");
    console.log("Messaging user:", userData._id);
  };

  const handleReport = () => {
    message.info("Profile reported");
    console.log("Reporting user:", userData._id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.info("Profile link copied!");
    console.log("Sharing profile:", userData._id);
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList(fileList.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList([{ ...file, url: URL.createObjectURL(file) }]);
      return false;
    },
    fileList,
  };

  const dropdownMenu = (
    <Menu className="profile-dropdown-menu">
      <Menu.Item key="message" onClick={handleMessage}>
        <MessageOutlined /> Message
      </Menu.Item>
      <Menu.Item key="report" onClick={handleReport}>
        <FlagOutlined /> Report
      </Menu.Item>
      <Menu.Item key="share" onClick={handleShare}>
        <ShareAltOutlined /> Share
      </Menu.Item>
    </Menu>
  );

  if (authLoading || userLoading || reviewsLoading || requestsLoading) {
    return (
      <div className="profile-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (authError || userError || reviewsError || requestsError) {
    return (
      <div className="profile-error">
        <Text type="danger">
          Error:{" "}
          {authError?.message || userError?.message || "An error occurred"}
        </Text>
      </div>
    );
  }

  const isProfileIncomplete =
    !userData?.bio ||
    !userData?.avatar ||
    userData?.favoriteMovies?.length === 0;

  return (
    <section className="profile-page" aria-label="User profile">
      <Row gutter={[24, 24]} className="profile-container">
        <Col xs={24} md={16}>
          {/* Profile Header */}
          <Card
            cover={
              <img
                alt="Profile cover"
                src={
                  userData?.coverImage || "https://via.placeholder.com/800x200"
                }
                className="profile-cover-image"
              />
            }
            className="profile-header-card"
          >
            <div className="profile-header-content">
              <Avatar
                size={120}
                src={userData?.avatar}
                icon={<UserOutlined />}
                className="profile-avatar"
                alt={`Avatar of ${userData?.username}`}
              />
              <Title level={3} className="profile-username">
                {userData?.username}
                {userData?.role && (
                  <Tag
                    className="profile-role-tag"
                    color={
                      userData.role === "creator"
                        ? "gold"
                        : userData.role === "moderator"
                        ? "blue"
                        : "green"
                    }
                  >
                    {userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1)}
                  </Tag>
                )}
              </Title>
              <Paragraph className="profile-bio">
                {userData?.bio || "No bio provided."}
              </Paragraph>
              <Space className="profile-stats">
                <Text>
                  <strong>{userData?.followers?.length || 0}</strong> Followers
                </Text>
                <Text>
                  <strong>{userData?.following?.length || 0}</strong> Following
                </Text>
                <Text>
                  <strong>{userData?.postCount || 0}</strong> Posts
                </Text>
              </Space>
              <Space className="profile-actions">
                {isOwnProfile ? (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditModalOpen(true)}
                    className="profile-action-button"
                    aria-label="Edit profile"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type={isFollowing ? "default" : "primary"}
                      onClick={handleFollow}
                      className="profile-action-button"
                      aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    <Dropdown
                      overlay={dropdownMenu}
                      trigger={["click"]}
                      overlayClassName="profile-dropdown"
                    >
                      <Button
                        className="profile-action-button"
                        aria-label="More actions"
                      >
                        More
                      </Button>
                    </Dropdown>
                  </>
                )}
              </Space>
            </div>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultActiveKey="1" className="profile-tabs">
            <TabPane tab="Lists" key="1">
              {userData?.favoriteMovies?.length > 0 ? (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                  dataSource={userData.favoriteMovies}
                  renderItem={(movie) => (
                    <List.Item>
                      <Card className="profile-list-card">
                        <Text>{movie}</Text>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Text className="profile-empty-text">
                  No favorite movies listed.
                </Text>
              )}
            </TabPane>
            <TabPane tab="Reviews" key="2">
              {isOwnProfile && reviews?.length > 0 ? (
                <List
                  dataSource={reviews}
                  renderItem={(review) => (
                    <List.Item className="profile-review-item">
                      <List.Item.Meta
                        title={<Text strong>{review.movieTitle}</Text>}
                        description={
                          <>
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              className="profile-review-comment"
                            >
                              {review.comment}
                            </Paragraph>
                            <Text type="secondary">
                              Posted on{" "}
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Text className="profile-empty-text">
                  No reviews posted yet.
                </Text>
              )}
            </TabPane>
            <TabPane tab="Groups" key="3">
              {userData?.groups?.length > 0 ? (
                <List
                  dataSource={userData.groups}
                  renderItem={(group) => (
                    <List.Item className="profile-group-item">
                      <List.Item.Meta
                        title={
                          <Text
                            strong
                            onClick={() => navigate(`/groups/${group.id}`)}
                            className="profile-group-link"
                            role="link"
                            aria-label={`View ${group.name} group`}
                          >
                            {group.name}
                          </Text>
                        }
                        description={<Text>{group.description}</Text>}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Text className="profile-empty-text">
                  Not a member of any groups.
                </Text>
              )}
            </TabPane>
            <TabPane tab="Activity" key="4">
              {userData?.activity?.length > 0 ? (
                <List
                  dataSource={userData.activity}
                  renderItem={(activity) => (
                    <List.Item className="profile-activity-item">
                      <Text>
                        {activity.type === "post"
                          ? `Posted: ${activity.content}`
                          : activity.type === "comment"
                          ? `Commented: ${activity.content}`
                          : `Liked a post`}
                        <br />
                        <Text type="secondary">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </Text>
                      </Text>
                    </List.Item>
                  )}
                />
              ) : (
                <Text className="profile-empty-text">No recent activity.</Text>
              )}
            </TabPane>
            <TabPane tab="Suggest a Movie" key="5">
              {!isOwnProfile ? (
                <div className="profile-suggest-movie">
                  <Text>Want to recommend something?</Text>
                  <Button
                    type="primary"
                    onClick={() => setSuggestModalOpen(true)}
                    className="profile-suggest-button"
                    aria-label="Suggest a movie"
                  >
                    Suggest a Movie
                  </Button>
                  <SuggestMovieModal
                    visible={isSuggestModalOpen}
                    onClose={() => setSuggestModalOpen(false)}
                    receiverId={userData?._id}
                  />
                </div>
              ) : (
                <Text className="profile-empty-text">
                  You can’t suggest a movie to yourself 😄
                </Text>
              )}
            </TabPane>
            {isOwnProfile && (
              <TabPane tab="Movie Requests" key="6">
                {movieRequests?.length > 0 ? (
                  <List
                    dataSource={movieRequests}
                    renderItem={(request) => (
                      <List.Item className="profile-request-item">
                        <List.Item.Meta
                          title={
                            <Text strong>
                              {request.title} (
                              <span
                                className={`status-${request.status.toLowerCase()}`}
                              >
                                {request.status}
                              </span>
                              )
                            </Text>
                          }
                          description={
                            <>
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                className="profile-request-description"
                              >
                                {request.description}
                              </Paragraph>
                              <Text type="secondary">
                                Submitted on{" "}
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </Text>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text className="profile-empty-text">
                    No movie requests yet.
                  </Text>
                )}
              </TabPane>
            )}
          </Tabs>
        </Col>
        <Col xs={24} md={8}>
          {/* Sidebar */}
          <Card
            title="Profile Stats"
            className="profile-sidebar-card"
            aria-label="Profile statistics"
          >
            <Space direction="vertical" className="profile-stats-list">
              <Text>
                Joined: {new Date(userData?.joinedAt).toLocaleDateString()}
              </Text>
              <Text>
                Favorite Genres:{" "}
                {userData?.favoriteGenres?.join(", ") || "None"}
              </Text>
              <Text>
                Mutual Followers: {userData?.mutualFollowers?.length || 0}
              </Text>
            </Space>
          </Card>
          <Card
            title="Suggested Users"
            className="profile-sidebar-card"
            aria-label="Suggested users"
          >
            <List
              dataSource={userData?.suggestedUsers || []}
              renderItem={(user) => (
                <List.Item
                  className="profile-suggested-user"
                  actions={[
                    <Button
                      key="follow"
                      size="small"
                      onClick={() => handleFollow(user._id)}
                      className="profile-follow-button"
                      aria-label={`Follow ${user.username}`}
                    >
                      Follow
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={user.avatar}
                        alt={`Avatar of ${user.username}`}
                      />
                    }
                    title={<Text>{user.username}</Text>}
                    description={
                      <Text ellipsis className="profile-user-bio">
                        {user.bio}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setFileList([]);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        className="profile-edit-modal"
        aria-label="Edit profile modal"
      >
        <Form
          form={form}
          onFinish={handleEditProfile}
          initialValues={{
            bio: userData?.bio,
            favoriteMovies: userData?.favoriteMovies?.join("\n"),
            favoriteGenres: userData?.favoriteGenres?.join("\n"),
          }}
          layout="vertical"
        >
          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: false, message: "Please enter a bio" }]}
          >
            <TextArea
              placeholder="Tell us about yourself"
              rows={4}
              className="profile-form-input"
            />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Upload
              {...uploadProps}
              accept="image/*"
              listType="picture"
              maxCount={1}
              className="profile-upload"
            >
              <Button
                icon={<UploadOutlined />}
                className="profile-upload-button"
              >
                Upload Avatar
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="favoriteMovies"
            label="Favorite Movies"
            rules={[
              { required: false, message: "Please enter favorite movies" },
            ]}
          >
            <TextArea
              placeholder="Enter one movie per line"
              rows={4}
              className="profile-form-input"
            />
          </Form.Item>
          <Form.Item
            name="favoriteGenres"
            label="Favorite Genres"
            rules={[
              { required: false, message: "Please enter favorite genres" },
            ]}
          >
            <TextArea
              placeholder="Enter one genre per line"
              rows={4}
              className="profile-form-input"
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default ProfileWrapper;
