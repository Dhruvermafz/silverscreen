import React, { useState, useEffect } from "react";
import {
  Avatar,
  Typography,
  Card,
  List,
  Rate,
  message,
  Spin,
  Tabs,
  Divider,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useGetProfileQuery } from "../../actions/userApi";
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
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userData, setUserData] = useState({
    _id: "",
    username: "",
    bio: "",
    avatar: "",
    favoriteMovies: [],
    rating: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [movieRequests, setMovieRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuggestModalOpen, setSuggestModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token || !authUser?._id) throw new Error("User not authenticated");

        if (id === "me" || id === authUser._id) {
          setIsOwnProfile(true);
          setUserData(authUser);

          const [reviewsRes, requestsRes] = await Promise.all([
            axios.get(`/api/user/${authUser._id}/reviews`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/user/${authUser._id}/requests`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setReviews(reviewsRes.data);
          setMovieRequests(requestsRes.data);
        } else {
          setIsOwnProfile(false);
          const response = await axios.get(`/api/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data);
        }
      } catch (err) {
        message.error(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && authUser) {
      fetchProfile();
    }
  }, [id, authUser, authLoading]);

  if (loading || authLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text type="danger">Authentication Error: {authError.message}</Text>
      </div>
    );
  }

  const isProfileIncomplete =
    !userData.bio ||
    userData.avatar === "" ||
    userData.favoriteMovies.length === 0;

  return (
    <div
      className="profile-wrapper"
      style={{ width: "800px", margin: "auto", padding: "30px" }}
    >
      <Card style={{ borderRadius: 12, padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Avatar
            size={120}
            src={userData.avatar || "https://via.placeholder.com/100"}
            icon={<UserOutlined />}
          />
          <Title level={3} style={{ marginTop: 10 }}>
            {userData.username}
          </Title>
          <Rate disabled value={userData.rating || 0} />
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
                <a href="/edit-profile">
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
                {userData.favoriteGenres?.length > 0 ? (
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
                      receiverId={userData._id}
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
            {userData.bio}
          </Paragraph>
        )}

        {userData.favoriteMovies?.length > 0 && (
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
            {reviews.length > 0 ? (
              <List
                dataSource={reviews}
                renderItem={(review) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <>
                          <Text strong>{review.movieTitle}</Text> -{" "}
                          <Rate disabled value={review.rating} />
                        </>
                      }
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
            {movieRequests.length > 0 ? (
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
