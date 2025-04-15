import React from "react";
import { Progress, Tag, Typography } from "antd";
import {
  StarFilled,
  UserOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import MovieSidebar from "./MovieSidebar";
import "./movies.css"; // Add this line to import your styles

const { Title, Paragraph, Link } = Typography;

const cast = [
  "Ben Whishaw",
  "Hugh Bonneville",
  "Emily Mortimer",
  "Samuel Joslin",
  "Madeleine Harris",
  "Antonio Banderas",
  "Olivia Colman",
  "Julie Walters",
  "Jim Broadbent",
  "Carla Tous",
  "Hayley Atwell",
  "Oliver Maltman",
  "Joel Fry",
  "Robbie Gee",
  "Sanjeev Bhaskar",
  "Imelda Staunton",
  "Ben Miller",
  "Jessica Hynes",
  "Ella Darcey",
  "Aloerisa Spencer",
  "Nicholas Burns",
  "Aleshya Reynolds",
  "Amit Shah",
  "Ella Buccolieri",
  "Carlos Carlin",
  "Simon Farnaby",
  "Emma Sidi",
  "Hugh Grant",
];

const MovieContent = () => {
  return (
    <div className="movie-content-container">
      <MovieSidebar />
      <div className="movie-main-content">
        <Title level={2} className="movie-title">
          Paddington in Peru
        </Title>
        <Paragraph className="movie-subtitle">
          2024 Directed by{" "}
          <Link href="#" className="director-link">
            Dougal Wilson
          </Link>
        </Paragraph>
        <Paragraph className="movie-tagline">
          A little bear goes a long way.
        </Paragraph>
        <Paragraph className="movie-description">
          Paddington travels to Peru to visit his beloved Aunt Lucy, who now
          resides at the Home for Retired Bears. With the Brown Family in tow, a
          thrilling adventure ensues when a mystery plunges them into an
          unexpected journey through the Amazon rainforest and up to the
          mountain peaks of Peru.
        </Paragraph>

        <div className="movie-section">
          <Title level={4} className="section-title">
            Cast
          </Title>
          <div className="cast-list">
            {cast.map((actor) => (
              <Tag key={actor} color="blue" className="cast-tag">
                {actor}
              </Tag>
            ))}
          </div>
        </div>

        <div className="movie-section">
          <Title level={4} className="section-title">
            <StarFilled className="icon-star" />
            Ratings
          </Title>
          <div className="ratings-container">
            <Progress
              percent={35}
              strokeColor="#52c41a"
              showInfo={false}
              style={{ width: 150 }}
            />
            <span className="rating-score">3.5</span>
          </div>
          <div className="fan-count">
            <UserOutlined className="icon-user" />
            371 fans
          </div>
        </div>

        <div className="movie-section">
          <Title level={4} className="section-title">
            <ClockCircleOutlined className="icon-clock" />
            Details
          </Title>
          <p className="runtime">106 mins</p>
          <div className="more-links">
            <Link href="#" className="external-link">
              <LinkOutlined /> More at
            </Link>
            <Link href="#" className="external-link">
              IMDb
            </Link>
            <Link href="#" className="external-link">
              TMDb
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieContent;
