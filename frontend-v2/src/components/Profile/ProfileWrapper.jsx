// src/components/Profile/ProfileWrapper.js
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useGetProfileQuery,
  useFollowUserMutation,
  useGetUserByIdQuery,
  useGetUserReviewsQuery,
  useGetUserRequestsQuery,
  useUpdateProfileMutation,
} from "../../actions/userApi";
import { useGetListsByUserIdQuery } from "../../actions/listApi";
import Pagination from "../Common/Pagination";
import "./profile.css"; // Custom styles

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
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    favoriteMovies: "",
    favoriteGenres: "",
  });
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("lists");
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserByIdQuery(id === "me" ? authUser?._id : id, {
    skip: !authUser?._id || !id,
  });

  const {
    data: lists = [],
    isLoading: listsLoading,
    error: listsError,
  } = useGetListsByUserIdQuery(id === "me" ? authUser?._id : id, {
    skip: !userData?._id,
  });

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetUserReviewsQuery(id === "me" ? authUser?._id : id, {
    skip: !userData?._id,
  });

  const {
    data: movieRequests = [],
    isLoading: requestsLoading,
    error: requestsError,
  } = useGetUserRequestsQuery(authUser?._id, {
    skip: !isOwnProfile || !authUser?._id,
  });

  useEffect(() => {
    if (!authLoading && authUser) {
      setIsOwnProfile(id === "me" || id === authUser._id);
      setIsFollowing(userData?.followers?.includes(authUser._id) || false);
      setFormData({
        bio: userData?.bio || "",
        favoriteMovies: userData?.favoriteMovies?.join("\n") || "",
        favoriteGenres: userData?.favoriteGenres?.join("\n") || "",
      });
    }
  }, [id, authUser, authLoading, userData]);

  const handleFollow = async () => {
    try {
      await followUser(userData._id).unwrap();
      setIsFollowing(!isFollowing);
      message.success(isFollowing ? "Unfollowed user" : "Followed user", 2);
    } catch (err) {
      message.error("Failed to follow/unfollow user", 2);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        ...formData,
        avatar: fileList.length > 0 ? fileList[0].url : userData?.avatar,
        favoriteMovies: formData.favoriteMovies
          ? formData.favoriteMovies.split("\n").filter((m) => m.trim())
          : [],
        favoriteGenres: formData.favoriteGenres
          ? formData.favoriteGenres.split("\n").filter((g) => g.trim())
          : [],
      };
      await updateProfile(profileData).unwrap();
      setIsEditModalOpen(false);
      setFileList([]);
      message.success("Profile updated successfully", 2);
    } catch (error) {
      message.error("Failed to update profile", 2);
    }
  };

  const handleMessage = () => {
    message.info("Opening chat with user", 2);
    navigate(`/messages/${userData._id}`);
  };

  const handleReport = () => {
    message.info("Profile reported", 2);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.info("Profile link copied!", 2);
  };

  const handleSuggestMovie = async (movieData) => {
    // Mock suggestion submission
    message.success(`Suggested ${movieData.title} to ${userData.username}`, 2);
    setIsSuggestModalOpen(false);
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList([{ ...file, url: URL.createObjectURL(file) }]);
      return false;
    },
    fileList,
  };

  const paginatedLists = lists.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const paginatedRequests = movieRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (
    authLoading ||
    userLoading ||
    listsLoading ||
    reviewsLoading ||
    requestsLoading
  ) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (authError || userError || listsError || reviewsError || requestsError) {
    return (
      <div className="alert alert-danger text-center my-5" role="alert">
        Error: {authError?.message || userError?.message || "An error occurred"}
      </div>
    );
  }

  const isProfileIncomplete =
    !userData?.bio ||
    !userData?.avatar ||
    userData?.favoriteMovies?.length === 0;

  return (
    <section className="profile-page container my-5" aria-label="User profile">
      <div className="row g-4">
        <div className="col-lg-8">
          {/* Profile Header */}
          <div className="card">
            <img
              src={
                userData?.coverImage || "https://via.placeholder.com/800x200"
              }
              className="card-img-top"
              alt={`Cover image for ${userData?.username}`}
            />
            <div className="card-body text-center">
              <img
                src={userData?.avatar || "https://via.placeholder.com/120"}
                className="rounded-circle mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                alt={`Avatar of ${userData?.username}`}
              />
              <h3 className="card-title">
                {userData?.username}
                {userData?.role && (
                  <span
                    className={`badge ms-2 ${
                      userData.role === "creator"
                        ? "bg-warning"
                        : userData.role === "moderator"
                        ? "bg-primary"
                        : "bg-success"
                    }`}
                  >
                    {userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1)}
                  </span>
                )}
              </h3>
              <p className="card-text">{userData?.bio || "No bio provided."}</p>
              <div className="d-flex justify-content-center gap-3 mb-3">
                <span>
                  <strong>{userData?.followers?.length || 0}</strong> Followers
                </span>
                <span>
                  <strong>{userData?.following?.length || 0}</strong> Following
                </span>
                <span>
                  <strong>{userData?.postCount || 0}</strong> Posts
                </span>
              </div>
              <div className="d-flex justify-content-center gap-2">
                {isOwnProfile ? (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setIsEditModalOpen(true)}
                    aria-label="Edit profile"
                  >
                    <i className="bi bi-pencil me-1"></i> Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      className={`btn ${
                        isFollowing ? "btn-outline-secondary" : "btn-primary"
                      }`}
                      onClick={handleFollow}
                      aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label="More actions"
                      >
                        More
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleMessage}
                          >
                            <i className="bi bi-chat me-2"></i> Message
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleReport}
                          >
                            <i className="bi bi-flag me-2"></i> Report
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleShare}
                          >
                            <i className="bi bi-share me-2"></i> Share
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content Tabs */}
          <ul className="nav nav-tabs mt-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "lists" ? "active" : ""}`}
                onClick={() => setActiveTab("lists")}
                role="tab"
                aria-selected={activeTab === "lists"}
                aria-controls="lists-tab"
              >
                Lists
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
                role="tab"
                aria-selected={activeTab === "reviews"}
                aria-controls="reviews-tab"
              >
                Reviews
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "groups" ? "active" : ""}`}
                onClick={() => setActiveTab("groups")}
                role="tab"
                aria-selected={activeTab === "groups"}
                aria-controls="groups-tab"
              >
                Groups
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "activity" ? "active" : ""
                }`}
                onClick={() => setActiveTab("activity")}
                role="tab"
                aria-selected={activeTab === "activity"}
                aria-controls="activity-tab"
              >
                Activity
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "suggest" ? "active" : ""
                }`}
                onClick={() => setActiveTab("suggest")}
                role="tab"
                aria-selected={activeTab === "suggest"}
                aria-controls="suggest-tab"
              >
                Suggest a Movie
              </button>
            </li>
            {isOwnProfile && (
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "requests" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("requests")}
                  role="tab"
                  aria-selected={activeTab === "requests"}
                  aria-controls="requests-tab"
                >
                  Movie Requests
                </button>
              </li>
            )}
          </ul>
          <div className="tab-content mt-3">
            {/* Lists Tab */}
            <div
              className={`tab-pane fade ${
                activeTab === "lists" ? "show active" : ""
              }`}
              id="lists-tab"
              role="tabpanel"
            >
              {paginatedLists.length > 0 ? (
                <div className="row g-3">
                  {paginatedLists.map((list) => (
                    <div key={list._id} className="col-md-4">
                      <div className="card h-100">
                        <img
                          src={
                            list.movies[0]?.poster_path
                              ? `https://image.tmdb.org/t/p/w200${list.movies[0].poster_path}`
                              : "https://via.placeholder.com/200"
                          }
                          className="card-img-top"
                          alt={list.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            <Link to={`/lists/${list._id}`}>{list.name}</Link>
                          </h5>
                          <p className="card-text">
                            {list.movies.length} movie
                            {list.movies.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No lists created yet.</p>
              )}
              <Pagination
                totalItems={lists.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
            {/* Reviews Tab */}
            <div
              className={`tab-pane fade ${
                activeTab === "reviews" ? "show active" : ""
              }`}
              id="reviews-tab"
              role="tabpanel"
            >
              {paginatedReviews.length > 0 ? (
                <div className="list-group">
                  {paginatedReviews.map((review) => (
                    <div key={review._id} className="list-group-item">
                      <h6>
                        <Link to={`/movies/${review.movieId}`}>
                          {review.movieTitle}
                        </Link>
                      </h6>
                      <p className="mb-1">{review.comment}</p>
                      <small className="text-muted">
                        Posted on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No reviews posted yet.</p>
              )}
              <Pagination
                totalItems={reviews.length}
                itemsPerPage={pageSize}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
            {/* Groups Tab */}
            <div
              className={`tab-pane fade ${
                activeTab === "groups" ? "show active" : ""
              }`}
              id="groups-tab"
              role="tabpanel"
            >
              {userData?.groups?.length > 0 ? (
                <div className="list-group">
                  {userData.groups.map((group) => (
                    <div key={group.id} className="list-group-item">
                      <h6>
                        <Link
                          to={`/groups/${group.id}`}
                          aria-label={`View ${group.name} group`}
                        >
                          {group.name}
                        </Link>
                      </h6>
                      <p className="mb-1">{group.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Not a member of any groups.</p>
              )}
            </div>
            {/* Activity Tab */}
            <div
              className={`tab-pane fade ${
                activeTab === "activity" ? "show active" : ""
              }`}
              id="activity-tab"
              role="tabpanel"
            >
              {userData?.activity?.length > 0 ? (
                <div className="list-group">
                  {userData.activity.map((activity, index) => (
                    <div key={index} className="list-group-item">
                      <p className="mb-1">
                        {activity.type === "post"
                          ? `Posted: ${activity.content}`
                          : activity.type === "comment"
                          ? `Commented: ${activity.content}`
                          : `Liked a post`}
                      </p>
                      <small className="text-muted">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No recent activity.</p>
              )}
            </div>
            {/* Suggest a Movie Tab */}
            <div
              className={`tab-pane fade ${
                activeTab === "suggest" ? "show active" : ""
              }`}
              id="suggest-tab"
              role="tabpanel"
            >
              {!isOwnProfile ? (
                <div className="text-center">
                  <p>Want to recommend something?</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsSuggestModalOpen(true)}
                    aria-label="Suggest a movie"
                  >
                    Suggest a Movie
                  </button>
                  {/* Mock SuggestMovieModal */}
                  <div
                    className={`modal fade ${
                      isSuggestModalOpen ? "show d-block" : ""
                    }`}
                    tabIndex="-1"
                    aria-labelledby="suggestMovieModalLabel"
                    aria-hidden={!isSuggestModalOpen}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="suggestMovieModalLabel"
                          >
                            Suggest a Movie
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setIsSuggestModalOpen(false)}
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.target;
                              handleSuggestMovie({
                                title: form.title.value,
                                description: form.description.value,
                              });
                            }}
                          >
                            <div className="mb-3">
                              <label
                                htmlFor="suggestTitle"
                                className="form-label"
                              >
                                Movie Title
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="suggestTitle"
                                name="title"
                                required
                                aria-label="Movie title"
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor="suggestDescription"
                                className="form-label"
                              >
                                Why recommend this?
                              </label>
                              <textarea
                                className="form-control"
                                id="suggestDescription"
                                name="description"
                                rows="4"
                                aria-label="Recommendation description"
                              ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                              Suggest
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted">
                  You can’t suggest a movie to yourself 😄
                </p>
              )}
            </div>
            {/* Movie Requests Tab */}
            {isOwnProfile && (
              <div
                className={`tab-pane fade ${
                  activeTab === "requests" ? "show active" : ""
                }`}
                id="requests-tab"
                role="tabpanel"
              >
                {paginatedRequests.length > 0 ? (
                  <div className="list-group">
                    {paginatedRequests.map((request) => (
                      <div key={request._id} className="list-group-item">
                        <h6>
                          {request.title}{" "}
                          <span
                            className={`badge bg-${
                              request.status === "Pending"
                                ? "warning"
                                : request.status === "Approved"
                                ? "success"
                                : "danger"
                            }`}
                          >
                            {request.status}
                          </span>
                        </h6>
                        <p className="mb-1">{request.description}</p>
                        <small className="text-muted">
                          Submitted on{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No movie requests yet.</p>
                )}
                <Pagination
                  totalItems={movieRequests.length}
                  itemsPerPage={pageSize}
                  onPageChange={setCurrentPage}
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          {/* Sidebar */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Profile Stats</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Joined: {new Date(userData?.joinedAt).toLocaleDateString()}
                </li>
                <li className="list-group-item">
                  Favorite Genres:{" "}
                  {userData?.favoriteGenres?.join(", ") || "None"}
                </li>
                <li className="list-group-item">
                  Mutual Followers: {userData?.mutualFollowers?.length || 0}
                </li>
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Suggested Users</h5>
            </div>
            <div className="card-body">
              {userData?.suggestedUsers?.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {userData.suggestedUsers.map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item d-flex align-items-center"
                    >
                      <img
                        src={user.avatar || "https://via.placeholder.com/40"}
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                        alt={`Avatar of ${user.username}`}
                      />
                      <div className="flex-grow-1">
                        <Link to={`/profile/${user._id}`}>{user.username}</Link>
                        <p className="mb-0 text-muted">{user.bio}</p>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleFollow(user._id)}
                        aria-label={`Follow ${user.username}`}
                      >
                        Follow
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No suggested users.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <div
        className={`modal fade ${isEditModalOpen ? "show d-block" : ""}`}
        tabIndex="-1"
        aria-labelledby="editProfileModalLabel"
        aria-hidden={!isEditModalOpen}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editProfileModalLabel">
                Edit Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setFileList([]);
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditProfile}>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    className="form-control"
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows="4"
                    placeholder="Tell us about yourself"
                    aria-label="Bio"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="avatar" className="form-label">
                    Avatar
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="avatar"
                    accept="image/*"
                    onChange={(e) =>
                      uploadProps.beforeUpload(e.target.files[0])
                    }
                    aria-label="Upload avatar"
                  />
                  {fileList.length > 0 && (
                    <div className="mt-2">
                      <img
                        src={fileList[0].url}
                        alt="Avatar preview"
                        style={{ maxWidth: "100px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={uploadProps.onRemove}
                        aria-label="Remove avatar"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="favoriteMovies" className="form-label">
                    Favorite Movies
                  </label>
                  <textarea
                    className="form-control"
                    id="favoriteMovies"
                    value={formData.favoriteMovies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        favoriteMovies: e.target.value,
                      })
                    }
                    rows="4"
                    placeholder="Enter one movie per line"
                    aria-label="Favorite movies"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="favoriteGenres" className="form-label">
                    Favorite Genres
                  </label>
                  <textarea
                    className="form-control"
                    id="favoriteGenres"
                    value={formData.favoriteGenres}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        favoriteGenres: e.target.value,
                      })
                    }
                    rows="4"
                    placeholder="Enter one genre per line"
                    aria-label="Favorite genres"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileWrapper;
