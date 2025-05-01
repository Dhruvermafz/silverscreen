import React from "react";
import {
  List,
  Card,
  Typography,
  Rate,
  Spin,
  message,
  Image,
  Row,
  Col,
} from "antd";
import { useGetAllMembersQuery } from "../../actions/userApi";

const { Title, Paragraph, Text } = Typography;

const MembersWrapper = () => {
  const { data: members = [], isLoading, isError } = useGetAllMembersQuery();

  if (isLoading)
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;

  if (isError) {
    message.error("Failed to load members.");
    return null;
  }

  return (
    <div
      style={{
        padding: "30px 50px",
        background: "#f7f9fb",
        minHeight: "100vh",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Community Members
      </Title>

      <Row gutter={[24, 24]}>
        {members.map((user) => (
          <Col key={user._id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Card
              hoverable
              style={{ borderRadius: 12, overflow: "hidden" }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <Image
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username}`
                  }
                  alt={user.username}
                  width={80}
                  height={80}
                  preview={false}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </div>

              <Title level={4} style={{ textAlign: "center", marginBottom: 8 }}>
                {user.username}
              </Title>

              <Paragraph
                style={{ fontSize: 13, textAlign: "center", color: "#666" }}
              >
                {user.bio || "No bio provided."}
              </Paragraph>

              <div style={{ textAlign: "center", margin: "12px 0" }}>
                <Rate disabled allowHalf value={user.rating || 0} />
              </div>

              <Text
                type="secondary"
                style={{ display: "block", textAlign: "center" }}
              >
                Favorite Movies: {user.favoriteMovies?.length || 0}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MembersWrapper;
