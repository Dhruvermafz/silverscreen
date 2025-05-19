import React from "react";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import userAvatar from "../../img/gallery/project-1.jpg"; // Default avatar

const ProfileHeader = ({
  activeTab,
  setActiveTab,
  handleLogout,
  userData,
  isLoading,
}) => {
  const tabs = [
    { id: "tab-1", label: "Profile" },
    { id: "tab-2", label: "Subscriptions" },
    { id: "tab-3", label: "Favorites" },
    { id: "tab-4", label: "Settings" },
  ];

  return (
    <div className="profile">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="profile__content">
              {isLoading ? (
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
                disabled={isLoading}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
