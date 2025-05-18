import React from "react";
import { FiLogOut } from "react-icons/fi";
import userAvatar from "../../img/gallery/project-1.jpg"; // Adjust path as needed

const ProfileHeader = ({ activeTab, setActiveTab, handleLogout, userData }) => {
  const tabs = [
    { id: "tab-1", label: "Profile" },
    { id: "tab-2", label: "Subs" },
    { id: "tab-3", label: "Favorites" },
    { id: "tab-4", label: "Settings" },
  ];

  return (
    <div className="profile">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="profile__content">
              <div className="profile__user">
                <div className="profile__avatar">
                  <img src={userData?.avatar || userAvatar} alt="User avatar" />
                </div>
                <div className="profile__meta">
                  <h3>{userData?.username || "Unknown User"}</h3>
                  <span>HOTFLIX ID: {userData?._id || "N/A"}</span>
                </div>
              </div>

              <ul
                className="nav nav-tabs content__tabs content__tabs--profile"
                role="tablist"
              >
                {tabs.map((tab) => (
                  <li className="nav-item" role="presentation" key={tab.id}>
                    <button
                      className={activeTab === tab.id ? "active" : ""}
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
