import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Nav,
  Tabs,
  Button,
  Image,
  Tab,
} from "react-bootstrap"; // React-Bootstrap components
import ProfileStats from "./ProfileStats";
import MoviesForYou from "./MoviesForYou";
import LatestReviews from "./LatestReviews";
import FavoritesList from "./FavoritesList";
import ProfileSettings from "./ProfileSettings";
import {
  useGetProfileQuery,
  useFollowUserMutation,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useGetUserReviewsQuery,
  useGetUserRequestsQuery,
} from "../../actions/userApi";
import { FiLogOut } from "react-icons/fi";
import userAvatar from "../../img/gallery/project-1.jpg"; // Default avatar

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab-1");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const {
    data: authUser,
    isLoading: authLoading,
    error: authError,
  } = useGetProfileQuery();

  const [followUser] = useFollowUserMutation();
  const [updateProfile] = useUpdateProfileMutation();

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

  // Debug userData
  useEffect(() => {
    console.log("userData:", userData);
    console.log("authUser:", authUser);
    console.log("id:", id);
  }, [userData, authUser, id]);

  // Calculate totalPages
  useEffect(() => {
    if (userData) {
      const pages =
        Math.ceil((userData.favoriteMovies?.length || 0) / itemsPerPage) || 1;
      setTotalPages(pages);
    }
  }, [userData, itemsPerPage]);

  // Set profile ownership and following status
  useEffect(() => {
    if (!authLoading && authUser && userData) {
      setIsOwnProfile(id === "me" || id === authUser._id);
      setIsFollowing(userData.followers?.includes(authUser._id) || false);
    }
  }, [id, authUser, authLoading, userData]);

  const handleFollow = async () => {
    try {
      await followUser(userData?._id).unwrap();
      setIsFollowing(!isFollowing);
      alert(isFollowing ? "Unfollowed user" : "Followed user");
    } catch (err) {
      alert("Failed to follow/unfollow user");
    }
  };

  const handleEditProfile = async (values) => {
    try {
      const profileData = {
        ...values,
        avatar: fileList.length > 0 ? fileList[0].url : userData?.avatar,
      };
      await updateProfile(profileData).unwrap();
      setFileList([]);
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
      console.error("Failed to update profile:", error);
    }
  };

  const handleLogout = () => {
    alert("Logging out");
    navigate("/login");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tabs = [
    { id: "tab-1", label: "Profile" },
    { id: "tab-2", label: "Subscriptions" },
    { id: "tab-3", label: "Favorites" },
    { id: "tab-4", label: "Settings" },
  ];

  // Calculate paginated favorite movies
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFavoriteMovies = (userData?.favoriteMovies || []).slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="content">
      <Container>
        <Row>
          <Col xs={12}>
            <div className="profile__content d-flex flex-column align-items-center">
              {authLoading || userLoading ? (
                <div className="profile__user d-flex align-items-center">
                  <Image
                    src={userAvatar}
                    alt="Loading avatar"
                    roundedCircle
                    width={100}
                    height={100}
                    className="me-3"
                  />
                  <div className="profile__meta">
                    <h3>Loading...</h3>
                    <span>HOTFLIX ID: Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="profile__user d-flex align-items-center">
                  <Image
                    src={userData?.avatar || userAvatar}
                    alt={userData?.username || "User avatar"}
                    roundedCircle
                    width={100}
                    height={100}
                    className="me-3"
                  />
                  <div className="profile__meta">
                    <h3>{userData?.username || "Unknown User"}</h3>
                    <span>HOTFLIX ID: {userData?._id || "N/A"}</span>
                  </div>
                </div>
              )}

              <Nav
                variant="tabs"
                activeKey={activeTab}
                onSelect={(selectedKey) => setActiveTab(selectedKey)}
                className="my-3"
              >
                {tabs.map((tab) => (
                  <Nav.Item key={tab.id}>
                    <Nav.Link eventKey={tab.id}>{tab.label}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Button
                variant="outline-danger"
                onClick={handleLogout}
                disabled={authLoading}
                className="mt-2"
              >
                <FiLogOut className="me-1" />
                Logout
              </Button>
            </div>
          </Col>
        </Row>

        {authLoading || userLoading || reviewsLoading || requestsLoading ? (
          <div className="text-center py-5">
            <div>Loading...</div>
          </div>
        ) : authError || userError || reviewsError || requestsError ? (
          <div className="text-center py-5">
            <span className="text-danger">
              Error:{" "}
              {authError?.message || userError?.message || "An error occurred"}
            </span>
          </div>
        ) : (
          <Row>
            <Col xs={12}>
              <Tabs activeKey={activeTab} id="profile-tabs" className="mb-3">
                <Tab eventKey="tab-1" title="">
                  <ProfileStats userData={userData} reviews={reviews} />
                  <Row>
                    <Col xs={12} xl={6}>
                      <MoviesForYou
                        suggestedMovies={userData?.suggestedMovies || []}
                      />
                    </Col>
                    <Col xs={12} xl={6}>
                      <LatestReviews reviews={reviews || []} />
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="tab-2" title="">
                  <p>Subscriptions content goes here.</p>
                </Tab>
                <Tab eventKey="tab-3" title="">
                  <FavoritesList
                    favoriteMovies={paginatedFavoriteMovies}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Tab>
                <Tab eventKey="tab-4" title="">
                  <ProfileSettings
                    userData={userData}
                    handleEditProfile={handleEditProfile}
                    fileList={fileList}
                    setFileList={setFileList}
                    isOwnProfile={isOwnProfile}
                  />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Profile;
