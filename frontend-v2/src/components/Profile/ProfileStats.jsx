import React from "react";
import { FiFilm, FiMessageCircle, FiStar } from "react-icons/fi";

const ProfileStats = ({ userData, reviews }) => {
  const stats = [
    {
      label: "Films watched",
      value: userData?.favoriteMovies?.length || 0,
      icon: <FiFilm />,
    },
    { label: "Your comments", value: "N/A", icon: <FiMessageCircle /> }, // Update if comments data is available
    { label: "Your reviews", value: reviews?.length || 0, icon: <FiStar /> },
  ];

  return (
    <div className="row">
      {stats.map((stat, index) => (
        <div className="col-12 col-md-6 col-xl-3" key={index}>
          <div className="stats">
            <span>{stat.label}</span>
            <p>{stat.value}</p>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
