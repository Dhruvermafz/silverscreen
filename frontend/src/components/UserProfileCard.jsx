import React from "react";
import { Card, Avatar, List, Tabs } from "antd";

const UserProfileCard = ({ user }) => {
  const tabs = [
    {
      key: "watched",
      label: "Watched",
      children: (
        <List
          dataSource={user.watchedMovies}
          renderItem={(movie) => <List.Item>{movie.title}</List.Item>}
        />
      ),
    },
    {
      key: "watchlist",
      label: "Watchlist",
      children: (
        <List
          dataSource={user.watchlist}
          renderItem={(movie) => <List.Item>{movie.title}</List.Item>}
        />
      ),
    },
    {
      key: "reviews",
      label: "Reviews",
      children: (
        <List
          dataSource={user.reviews}
          renderItem={(review) => (
            <List.Item>
              {review.movieTitle}: {review.comment}
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Card
      title={user.username}
      extra={<Avatar src={user.avatar} />}
      style={{ marginBottom: 16 }}
    >
      <p>{user.bio}</p>
      <Tabs items={tabs} />
    </Card>
  );
};

export default UserProfileCard;
