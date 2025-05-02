import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Card,
  List,
  message,
  Spin,
  Tabs,
  Divider,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  useGetProfileQuery,
  useFollowUserMutation,
  useGetUserByIdQuery,
  useGetUserReviewsQuery,
  useGetUserRequestsQuery,
} from "../../actions/userApi"; // Updated import
import SuggestMovieModal from "../Movie/SuggestAMovie";

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const ProfileWrapper = () => {
  const { id } = useParams();
  const {
    data: authUser,
    isLoading: authLoading,
    error: authError,
  } = useGetProfileQuery();
  const [followUser] = useFollowUserMutation();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // RTK Query hooks for fetching user data, reviews, and requests
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

  const [isSuggestModalOpen, setSuggestModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && authUser) {
      setIsOwnProfile(id === "me" || id === authUser._id);
    }
  }, [id, authUser, authLoading]);

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
    userData?.avatar === "" ||
    userData?.favoriteMovies?.length === 0;

  const handleFollow = async () => {
    try {
      await followUser(userData._id).unwrap();
      message.success("You are now following this user");
    } catch (err) {
      message.error("Failed to follow user");
    }
  };

  return (
    <div
      className="profile-wrapper"
      style={{ width: "800px", margin: "auto", padding: "30px" }}
    >
      <Card style={{ borderRadius: 12, padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Avatar
            size={120}
            src={userData?.avatar || "https://via.placeholder.com/100"}
            icon={<UserOutlined />}
          />
          <Title level={3} style={{ marginTop: 10 }}>
            {userData?.username}
          </Title>
          {!isOwnProfile && (
            <Button type="primary" onClick={handleFollow}>
              Follow
            </Button>
          )}
        </div>

        {isProfileIncomplete ? (
          isOwnProfile ? (
            <Card
              type="inner"
              style={{
                marginTop: 20,
                background: "#f6f6f6",
                borderRadius: 10,
                border: "1px dashed #ccc",
              }}
            >
              <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
                <Text strong>Let your personality shine!</Text>
                <br />
                Complete your profile with a short bio, profile avatar, and some
                of your favorite movies.
              </Paragraph>
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <a href={`/u/${authUser._id}/edit`}>
                  <Typography.Link>Edit Your Profile</Typography.Link>
                </a>
              </div>
            </Card>
          ) : (
            <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
              <TabPane tab="Lists" key="1">
                <Text>This user hasn't created any lists yet.</Text>
              </TabPane>

              <TabPane tab="Reviews" key="2">
                <Text>This user hasn't posted any reviews yet.</Text>
              </TabPane>

              <TabPane tab="Genres They Like" key="3">
                {userData?.favoriteGenres?.length > 0 ? (
                  <List
                    dataSource={userData.favoriteGenres}
                    renderItem={(genre) => <List.Item>{genre}</List.Item>}
                    bordered
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <Text>No genre preferences shared.</Text>
                )}
              </TabPane>

              <TabPane tab="Suggest a Movie" key="4">
                {!isOwnProfile ? (
                  <div style={{ padding: "10px 0" }}>
                    <Text>Want to recommend something?</Text>
                    <br />
                    <Button
                      type="primary"
                      onClick={() => setSuggestModalOpen(true)}
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
            </Tabs>
          )
        ) : (
          <Paragraph style={{ textAlign: "center", color: "#666" }}>
            {userData?.bio}
          </Paragraph>
        )}

        {userData?.favoriteMovies?.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <Text strong>Favorite Movies:</Text>
            <List
              dataSource={userData.favoriteMovies}
              renderItem={(movie) => (
                <List.Item>
                  <Text>{movie}</Text>
                </List.Item>
              )}
              bordered
              style={{ marginTop: 10 }}
            />
          </div>
        )}
      </Card>

      {isOwnProfile && (
        <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
          <TabPane tab="Your Reviews" key="1">
            {reviews?.length > 0 ? (
              <List
                dataSource={reviews}
                renderItem={(review) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{review.movieTitle}</Text>}
                      description={
                        <>
                          <Paragraph>{review.comment}</Paragraph>
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
              <Text>No reviews yet.</Text>
            )}
          </TabPane>

          <TabPane tab="Your Movie Requests" key="2">
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
                          <Paragraph>{request.description}</Paragraph>
                          <Text type="secondary">
                            Submitted on{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
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
        </Tabs>
      )}
    </div>
  );
};

export default ProfileWrapper;
