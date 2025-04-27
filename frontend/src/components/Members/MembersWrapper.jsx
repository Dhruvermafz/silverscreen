import React from "react";
import { List, Card, Avatar, Rate, Spin, message } from "antd";
import { useGetAllMembersQuery } from "../../actions/userApi";

const MembersWrapper = () => {
  const { data: members = [], isLoading, isError } = useGetAllMembersQuery();

  if (isLoading)
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;

  if (isError) {
    message.error("Failed to load members.");
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={members}
        renderItem={(user) => (
          <List.Item>
            <Card
              hoverable
              style={{ width: 300 }}
              cover={
                <Avatar
                  src={
                    user.avatar ||
                    "https://api.dicebear.com/7.x/miniavs/svg?seed=" +
                      user.username
                  }
                  size={100}
                  style={{ margin: "20px auto" }}
                />
              }
            >
              <Card.Meta
                title={user.username}
                description={
                  <div>
                    <p style={{ margin: "10px 0" }}>
                      {user.bio || "No bio provided."}
                    </p>
                    <Rate disabled allowHalf value={user.rating} />
                    <p style={{ marginTop: "10px" }}>
                      Favorite Movies: {user.favoriteMovies?.length || 0}
                    </p>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MembersWrapper;
