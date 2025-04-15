import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import {
  Button,
  Input,
  DatePicker,
  Checkbox,
  Rate,
  Typography,
  Space,
  Row,
  Col,
  Card,
} from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

const WriteReview = () => {
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);

  const recommended = [
    {
      title: "Inception (2010)",
      img: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_UF894,1000_QL80_.jpg",
    },
    {
      title: "The Martian (2015)",
      img: "https://m.media-amazon.com/images/I/71nSnpkK0mL._AC_UF894,1000_QL80_.jpg",
    },
    {
      title: "Gravity (2013)",
      img: "https://m.media-amazon.com/images/I/81k1b6y3Y4L._AC_UF894,1000_QL80_.jpg",
    },
    {
      title: "Arrival (2016)",
      img: "https://m.media-amazon.com/images/I/71UFBewy-KL._AC_UF894,1000_QL80_.jpg",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#1f2937",
        padding: 24,
        borderRadius: 16,
        maxWidth: 900,
        margin: "0 auto",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #374151",
          paddingBottom: 16,
        }}
      >
        <Button
          type="link"
          href="/index.html"
          style={{ color: "#9ca3af" }}
          icon={<ArrowLeftOutlined />}
        >
          Back
        </Button>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          I Watched...
        </Title>
        <CloseOutlined
          style={{ color: "#9ca3af", cursor: "pointer", fontSize: 18 }}
        />
      </div>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <img
            src="https://m.media-amazon.com/images/I/61DUasB6X5L._AC_UF894,1000_QL80_.jpg"
            alt="Interstellar"
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        </Col>
        <Col xs={24} md={16}>
          <Title level={4} style={{ color: "white" }}>
            Interstellar <Text type="secondary">(2014)</Text>
          </Title>

          <Space direction="vertical" style={{ marginTop: 16, width: "100%" }}>
            <Space>
              <Checkbox /> <Text style={{ color: "white" }}>Watched on</Text>
              <DatePicker
                style={{
                  backgroundColor: "#374151",
                  border: "none",
                  color: "white",
                }}
              />
            </Space>
            <Checkbox>
              <Text style={{ color: "white" }}>
                I’ve watched this film before
              </Text>
            </Checkbox>
            <TextArea
              placeholder="Add a review..."
              rows={4}
              style={{ backgroundColor: "#374151", color: "white" }}
            />

            <Row gutter={16}>
              <Col span={12}>
                <Text type="secondary">Tags</Text>
                <Input
                  placeholder="e.g. sci-fi, Nolan, space"
                  style={{
                    backgroundColor: "#374151",
                    color: "white",
                    marginTop: 4,
                  }}
                />
              </Col>
              <Col span={6}>
                <Text type="secondary">Rating</Text>
                <Rate
                  value={rating}
                  onChange={setRating}
                  style={{ marginTop: 4 }}
                />
              </Col>
              <Col span={6}>
                <Text type="secondary">Like</Text>
                <div style={{ marginTop: 4 }}>
                  {liked ? (
                    <HeartFilled
                      style={{ color: "red", fontSize: 20, cursor: "pointer" }}
                      onClick={() => setLiked(false)}
                    />
                  ) : (
                    <HeartOutlined
                      style={{
                        color: "#9ca3af",
                        fontSize: 20,
                        cursor: "pointer",
                      }}
                      onClick={() => setLiked(true)}
                    />
                  )}
                </div>
              </Col>
            </Row>
            <Button
              type="primary"
              block
              style={{ backgroundColor: "#16a34a" }}
              href="/index.html"
            >
              SAVE
            </Button>
          </Space>
        </Col>
      </Row>

      <div style={{ marginTop: 48 }}>
        <Title level={4} style={{ color: "white" }}>
          Recommended for you
        </Title>
        <Row gutter={[16, 16]}>
          {recommended.map((rec, i) => (
            <Col xs={12} md={6} key={i}>
              <Card
                hoverable
                cover={
                  <img
                    alt={rec.title}
                    src={rec.img}
                    style={{ height: 160, objectFit: "cover" }}
                  />
                }
                style={{
                  backgroundColor: "#374151",
                  border: "none",
                  color: "white",
                }}
              >
                <p style={{ color: "white", textAlign: "center" }}>
                  {rec.title}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default WriteReview;
