import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  message,
  Avatar,
  Tabs,
  List,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Upload,
  Input,
  Empty,
  Spin,
  Badge,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  MessageOutlined,
  ShareAltOutlined,
  FlagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

import {
  useGetProfileQuery,
  useFollowUserMutation,
  useGetUserByIdQuery,
  useGetUserReviewsQuery,
  useUpdateProfileMutation,
} from "../../actions/userApi";
import { useGetListsByUserIdQuery } from "../../actions/listApi";

import Pagination from "../Common/Pagination";
import MovieCard from "../Films/MovieCard";

const { TabPane } = Tabs;
const { TextArea } = Input;

const ProfileWrapper = () => {
  const { id } = useParams();
  const userId = id === "me" ? undefined : id;

  const { data: authUser } = useGetProfileQuery();
  const { data: profileUser, isLoading: loadingUser } = useGetUserByIdQuery(
    userId || authUser?._id,
    { skip: !authUser && !userId }
  );
  const { data: lists = [], isLoading: loadingLists } =
    useGetListsByUserIdQuery(profileUser?._id, { skip: !profileUser?._id });
  const { data: reviews = [], isLoading: loadingReviews } =
    useGetUserReviewsQuery(profileUser?._id, { skip: !profileUser?._id });

  const [followUser] = useFollowUserMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [formData, setFormData] = useState({
    bio: "",
    favoriteMovies: "",
    favoriteGenres: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (authUser && profileUser) {
      const own = id === "me" || authUser._id === profileUser._id;
      setIsOwnProfile(own);
      setIsFollowing(profileUser.followers?.includes(authUser._id));
      setFormData({
        bio: profileUser.bio || "",
        favoriteMovies: profileUser.favoriteMovies?.join("\n") || "",
        favoriteGenres: profileUser.favoriteGenres?.join("\n") || "",
      });
    }
  }, [authUser, profileUser, id]);

  const handleFollow = async () => {
    try {
      await followUser(profileUser._id).unwrap();
      setIsFollowing(!isFollowing);
      message.success(isFollowing ? "Unfollowed" : "Now following!");
    } catch {
      message.error("Failed to update follow status");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const data = new FormData();
      data.append("bio", formData.bio);
      data.append(
        "favoriteMovies",
        JSON.stringify(formData.favoriteMovies.split("\n").filter(Boolean))
      );
      data.append(
        "favoriteGenres",
        JSON.stringify(formData.favoriteGenres.split("\n").filter(Boolean))
      );
      if (avatarFile) data.append("avatar", avatarFile);

      await updateProfile(data).unwrap();
      message.success("Profile updated successfully!");
      setEditModalOpen(false);
      setAvatarFile(null);
    } catch {
      message.error("Failed to update profile");
    }
  };

  const paginatedData = (data) =>
    data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loadingUser || loadingLists || loadingReviews) {
    return (
      <div className="text-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!profileUser) {
    return <Empty description="User not found" className="py-8" />;
  }

  return (
    <div className="profile-page container py-5">
      {/* Cover + Avatar Header */}
      <div className="profile-header rounded-3 overflow-hidden shadow-lg mb-5 position-relative">
        <div
          className="cover-image"
          style={{
            height: "300px",
            backgroundImage: `url(${
              profileUser.coverImage ||
              "https://via.placeholder.com/1200x300?text=Cover+Image"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="position-absolute bottom-0 start-0 end-0 bg-gradient"
          style={{ height: "150px" }}
        />

        <div
          className="container position-relative"
          style={{ marginTop: "-80px" }}
        >
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4 pb-4">
            <Avatar
              size={160}
              src={profileUser.avatar}
              icon={<UserOutlined />}
              className="border border-4 border-dark shadow"
            />
            <div className="text-center text-md-start text-white flex-grow-1">
              <h1 className="mb-1">
                {profileUser.username}
                {profileUser.role && (
                  <Badge
                    count={profileUser.role.toUpperCase()}
                    style={{ backgroundColor: "#e50914", marginLeft: 12 }}
                  />
                )}
              </h1>
              <p className="mb-2 opacity-90">
                {profileUser.bio || "No bio yet."}
              </p>
              <Space size="middle">
                <span>
                  <strong>{profileUser.followers?.length || 0}</strong>{" "}
                  Followers
                </span>
                <span>
                  <strong>{profileUser.following?.length || 0}</strong>{" "}
                  Following
                </span>
                <span>
                  <strong>{lists.length}</strong> Lists
                </span>
              </Space>
            </div>

            <Space size="middle">
              {isOwnProfile ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="large"
                  onClick={() => setEditModalOpen(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type={isFollowing ? "default" : "primary"}
                    size="large"
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Button icon={<MessageOutlined />} size="large">
                    Message
                  </Button>
                  <Button
                    icon={<ShareAltOutlined />}
                    size="large"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      message.success("Link copied!");
                    }}
                  >
                    Share
                  </Button>
                  <Button
                    icon={<FlagOutlined />}
                    danger
                    type="text"
                    size="large"
                  >
                    Report
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs
        defaultActiveKey="lists"
        size="large"
        onChange={() => setCurrentPage(1)}
      >
        <TabPane tab="Lists" key="lists">
          {lists.length === 0 ? (
            <Empty description="No lists created yet" />
          ) : (
            <>
              <div className="row g-4">
                {paginatedData(lists).map((list) => (
                  <div key={list._id} className="col-md-6 col-lg-4">
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={list.name}
                          src={
                            list.movies[0]?.poster_path
                              ? `https://image.tmdb.org/t/p/w500${list.movies[0].poster_path}`
                              : "/assets/imgs/placeholder.png"
                          }
                          style={{ height: "300px", objectFit: "cover" }}
                        />
                      }
                    >
                      <Card.Meta
                        title={
                          <Link to={`/lists/${list._id}`}>{list.name}</Link>
                        }
                        description={`${list.movies.length} movie${
                          list.movies.length !== 1 ? "s" : ""
                        }`}
                      />
                    </Card>
                  </div>
                ))}
              </div>
              <Pagination
                totalItems={lists.length}
                itemsPerPage={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                className="mt-4 text-center"
              />
            </>
          )}
        </TabPane>

        <TabPane tab="Reviews" key="reviews">
          {reviews.length === 0 ? (
            <Empty description="No reviews yet" />
          ) : (
            <>
              <List
                itemLayout="vertical"
                dataSource={paginatedData(reviews)}
                renderItem={(review) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Link to={`/movies/${review.movieId}`}>
                          {review.movieTitle}
                        </Link>
                      }
                      description={
                        <span>
                          <Tag color="volcano">{review.rating}/10</Tag> •{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      }
                    />
                    <p>{review.comment}</p>
                  </List.Item>
                )}
              />
              <Pagination
                totalItems={reviews.length}
                itemsPerPage={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                className="mt-4 text-center"
              />
            </>
          )}
        </TabPane>

        <TabPane tab="Activity" key="activity">
          <Empty description="Activity feed coming soon" />
        </TabPane>

        {!isOwnProfile && (
          <TabPane tab="Suggest Movie" key="suggest">
            <div className="text-center py-5">
              <p className="mb-4">
                Know a movie {profileUser.username} would love?
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => setSuggestModalOpen(true)}
              >
                Suggest a Movie
              </Button>
            </div>
          </TabPane>
        )}
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setAvatarFile(null);
        }}
        footer={null}
        width={600}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <label className="fw-bold mb-2 d-block">Avatar</label>
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                maxCount={1}
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                beforeUpload={(file) => {
                  setAvatarFile(file);
                  return false;
                }}
                onRemove={() => setAvatarFile(null)}
              >
                {avatarFile || profileUser.avatar ? null : (
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
            {(avatarFile || profileUser.avatar) && (
              <Avatar
                size={100}
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : profileUser.avatar
                }
                className="mt-3"
              />
            )}
          </div>

          <div>
            <label className="fw-bold mb-2 d-block">Bio</label>
            <TextArea
              rows={4}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell the community about yourself..."
            />
          </div>

          <div>
            <label className="fw-bold mb-2 d-block">
              Favorite Movies (one per line)
            </label>
            <TextArea
              rows={5}
              value={formData.favoriteMovies}
              onChange={(e) =>
                setFormData({ ...formData, favoriteMovies: e.target.value })
              }
            />
          </div>

          <div>
            <label className="fw-bold mb-2 d-block">
              Favorite Genres (one per line)
            </label>
            <TextArea
              rows={4}
              value={formData.favoriteGenres}
              onChange={(e) =>
                setFormData({ ...formData, favoriteGenres: e.target.value })
              }
            />
          </div>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleUpdateProfile}
          >
            Save Changes
          </Button>
        </Space>
      </Modal>

      {/* Suggest Movie Modal */}
      <Modal
        title={`Suggest a movie to ${profileUser.username}`}
        open={suggestModalOpen}
        onCancel={() => setSuggestModalOpen(false)}
        footer={null}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const title = e.target.title.value;
            const reason = e.target.reason.value;
            if (title) {
              message.success(`"${title}" suggested!`);
              setSuggestModalOpen(false);
              e.target.reset();
            }
          }}
        >
          <div className="mb-3">
            <label className="form-label fw-bold">Movie Title</label>
            <Input name="title" required placeholder="e.g. Inception" />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Why this movie?</label>
            <TextArea
              name="reason"
              rows={4}
              placeholder="They'd love the mind-bending plot..."
            />
          </div>
          <Button type="primary" htmlType="submit" block>
            Send Suggestion
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfileWrapper;
