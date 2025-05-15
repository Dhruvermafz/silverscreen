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
    message.info("Profile link copied!");
    console.log("Sharing profile:", userData._id);
  };

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

  const dropdownMenu = (
    <Menu>
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
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (authError || userError || reviewsError || requestsError) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
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
    <div className="profile-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          {/* Profile Header */}
          <Card
            cover={
              <img
                alt="Cover"
                src={
                  userData?.coverImage || "https://via.placeholder.com/800x200"
                }
                style={{ height: 200, objectFit: "cover" }}
              />
            }
            style={{ borderRadius: 8 }}
          >
            <div style={{ textAlign: "center", marginTop: -60 }}>
              <Avatar
                size={120}
                src={userData?.avatar || "https://via.placeholder.com/100"}
                icon={<UserOutlined />}
                style={{ border: "2px solid #fff" }}
              />
              <Title level={3} style={{ marginTop: 10 }}>
                {userData?.username}
                {userData?.role && (
                  <Tag
                    style={{ marginLeft: 8 }}
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
              <Paragraph
                style={{ color: "#666", maxWidth: 600, margin: "auto" }}
              >
                {userData?.bio || "No bio provided."}
              </Paragraph>
              <Space style={{ margin: "10px 0" }}>
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
              <Space>
                {isOwnProfile ? (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type={isFollowing ? "default" : "primary"}
                      onClick={handleFollow}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    <Dropdown overlay={dropdownMenu} trigger={["click"]}>
                      <Button>More</Button>
                    </Dropdown>
                  </>
                )}
              </Space>
            </div>
          </Card>

          {/* Profile Content Tabs */}
          <Tabs defaultActiveKey="1" style={{ marginTop: 16 }}>
            <TabPane tab="Lists" key="1">
              {userData?.favoriteMovies?.length > 0 ? (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                  dataSource={userData.favoriteMovies}
                  renderItem={(movie) => (
                    <List.Item>
                      <Card>
                        <Text>{movie}</Text>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Text>No favorite movies listed.</Text>
              )}
            </TabPane>
            <TabPane tab="Reviews" key="2">
              {isOwnProfile && reviews?.length > 0 ? (
                <List
                  dataSource={reviews}
                  renderItem={(review) => (
                    <List.Item>
                      <List.Item.Meta
                        title={<Text strong>{review.movieTitle}</Text>}
                        description={
                          <>
                            <Paragraph ellipsis={{ rows: 2 }}>
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
                <Text>No reviews posted yet.</Text>
              )}
            </TabPane>
            <TabPane tab="Groups" key="3">
              {userData?.groups?.length > 0 ? (
                <List
                  dataSource={userData.groups}
                  renderItem={(group) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Text
                            strong
                            onClick={() => navigate(`/groups/${group.id}`)}
                            style={{ cursor: "pointer" }}
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
                <Text>Not a member of any groups.</Text>
              )}
            </TabPane>
            <TabPane tab="Activity" key="4">
              {userData?.activity?.length > 0 ? (
                <List
                  dataSource={userData.activity}
                  renderItem={(activity) => (
                    <List.Item>
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
                <Text>No recent activity.</Text>
              )}
            </TabPane>
            <TabPane tab="Suggest a Movie" key="5">
              {!isOwnProfile ? (
                <div style={{ padding: "10px 0" }}>
                  <Text>Want to recommend something?</Text>
                  <Button
                    type="primary"
                    onClick={() => setSuggestModalOpen(true)}
                    style={{ marginLeft: 8 }}
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
                <Text>You can’t suggest a movie to yourself 😄</Text>
              )}
            </TabPane>
            {isOwnProfile && (
              <TabPane tab="Movie Requests" key="6">
                {movieRequests?.length > 0 ? (
                  <List
                    dataSource={movieRequests}
                    renderItem={(request) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Text strong>
                              {request.title} ({request.status})
                            </Text>
                          }
                          description={
                            <>
                              <Paragraph ellipsis={{ rows: 2 }}>
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
                  <Text>No movie requests yet.</Text>
                )}
              </TabPane>
            )}
          </Tabs>
        </Col>
        <Col xs={24} md={8}>
          {/* Sidebar */}
          <Card title="Profile Stats" style={{ marginBottom: 16 }}>
            <Space direction="vertical">
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
          <Card title="Suggested Users">
            <List
              dataSource={userData?.suggestedUsers || []}
              renderItem={(user) => (
                <List.Item
                  actions={[
                    <Button
                      key="follow"
                      size="small"
                      onClick={() => handleFollow(user._id)}
                    >
                      Follow
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={user.avatar} />}
                    title={<Text>{user.username}</Text>}
                    description={<Text ellipsis>{user.bio}</Text>}
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
      >
        <Form
          form={form}
          onFinish={handleEditProfile}
          initialValues={{
            bio: userData?.bio,
            favoriteMovies: userData?.favoriteMovies?.join("\n"),
            favoriteGenres: userData?.favoriteGenres?.join("\n"),
          }}
        >
          <Form.Item name="bio" label="Bio">
            <TextArea placeholder="Tell us about yourself" rows={4} />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Upload {...uploadProps} accept="image/*">
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="favoriteMovies" label="Favorite Movies">
            <TextArea placeholder="Enter one movie per line" rows={4} />
          </Form.Item>
          <Form.Item name="favoriteGenres" label="Favorite Genres">
            <TextArea placeholder="Enter one genre per line" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileWrapper;
