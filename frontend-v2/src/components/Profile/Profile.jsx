import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Link } from "react-router-dom";
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
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="profile__content">
                {authLoading || userLoading ? (
                  <div className="profile__user">
                    <div className="profile__avatar">
                      <img src={userAvatar} alt="Loading avatar" />
                    </div>
                    <div className="profile__meta">
                      <h3>Loading...</h3>
                      <span>HOTFLIX ID: Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="profile__user">
                    <div className="profile__avatar">
                      <img
                        src={userData?.avatar || userAvatar}
                        alt={userData?.username || "User avatar"}
                      />
                    </div>
                    <div className="profile__meta">
                      <h3>{userData?.username || "Unknown User"}</h3>
                      <span>HOTFLIX ID: {userData?._id || "N/A"}</span>
                    </div>
                  </div>
                )}
                <ul
                  className="nav nav-tabs content__tabs content__tabs--profile"
                  role="tablist"
                >
                  {tabs.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.id}>
                      <button
                        className={`nav-link ${
                          activeTab === tab.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                        role="tab"
                        aria-controls={tab.id}
                        aria-selected={activeTab === tab.id}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  className="profile__logout"
                  type="button"
                  onClick={handleLogout}
                  disabled={authLoading} // Use authLoading here
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {authLoading || userLoading || reviewsLoading || requestsLoading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div>Loading...</div>
        </div>
      ) : authError || userError || reviewsError || requestsError ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <span style={{ color: "red" }}>
            Error:{" "}
            {authError?.message || userError?.message || "An error occurred"}
          </span>
        </div>
      ) : (
        <div className="container">
          <div className="tab-content">
            {activeTab === "tab-1" && (
              <div
                className="tab-pane fade show active"
                id="tab-1"
                role="tabpanel"
                aria-labelledby="1-tab"
                tabIndex="0"
              >
                <ProfileStats userData={userData} reviews={reviews} />
                <div className="row">
                  <div className="col-12 col-xl-6">
                    <MoviesForYou
                      suggestedMovies={userData?.suggestedMovies || []}
                    />
                  </div>
                  <div className="col-12 col-xl-6">
                    <LatestReviews reviews={reviews || []} />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "tab-2" && (
              <div
                className="tab-pane fade show active"
                id="tab-2"
                role="tabpanel"
                aria-labelledby="2-tab"
                tabIndex="0"
              >
                <p>Subscriptions content goes here.</p>
              </div>
            )}
            {activeTab === "tab-3" && (
              <FavoritesList
                favoriteMovies={paginatedFavoriteMovies}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
            {activeTab === "tab-4" && (
              <ProfileSettings
                userData={userData}
                handleEditProfile={handleEditProfile}
                fileList={fileList}
                setFileList={setFileList}
                isOwnProfile={isOwnProfile}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
