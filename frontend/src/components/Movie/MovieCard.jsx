import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Input,
  Rate,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  FlagOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AddToListModal from "../modals/AddtoListModal";
import RecommendToUserModal from "../modals/RecommendToUserModal";
import ReportMovieModal from "../modals/ReportMovieModal";

const MovieCard = ({ movie }) => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [isListModalVisible, setListModalVisible] = useState(false);
  const [isRecommendModalVisible, setRecommendModalVisible] = useState(false);
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "list":
        setListModalVisible(true);
        break;
      case "recommend":
        setRecommendModalVisible(true);
        break;
      case "report":
        setReportModalVisible(true);
        break;
      default:
        break;
    }
  };

  const dropdownMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="list" icon={<PlusOutlined />}>
        Add to List
      </Menu.Item>
      <Menu.Item key="recommend" icon={<UserAddOutlined />}>
        Recommend to User
      </Menu.Item>
      <Menu.Item key="report" icon={<FlagOutlined />} danger>
        Report Movie
      </Menu.Item>
    </Menu>
  );

  const handleAddReview = () => {
    console.log("Review:", { movieId: movie.id, review, rating });
    setReviewModalVisible(false);
    setReview("");
    setRating(0);
    message.success("Review added!");
  };

  return (
    <>
      <Card
        hoverable
        cover={<img alt={movie.title} src={movie.posterUrl} />}
        actions={[
          <Button onClick={() => setReviewModalVisible(true)} type="link">
            Add Review
          </Button>,
          <Dropdown overlay={dropdownMenu} trigger={["click"]}>
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>,
        ]}
      >
        <Card.Meta
          title={
            <span
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              {movie.title}
            </span>
          }
          description={`Released: ${movie.releaseDate}`}
        />
        <p>Rating: {movie.rating}</p>
      </Card>

      {/* Review Modal */}
      <Modal
        title={`Add a Review for "${movie.title}"`}
        open={isReviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleAddReview}
      >
        <h4>Rate the Movie</h4>
        <Rate value={rating} onChange={(val) => setRating(val)} />
        <h4 style={{ marginTop: 16 }}>Your Review</h4>
        <Input.TextArea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Write your review here"
        />
      </Modal>

      {/* Other Modals */}
      <AddToListModal
        open={isListModalVisible}
        onClose={() => setListModalVisible(false)}
        movieId={movie.id}
      />
      <RecommendToUserModal
        open={isRecommendModalVisible}
        onClose={() => setRecommendModalVisible(false)}
        movieId={movie.id}
      />
      <ReportMovieModal
        open={isReportModalVisible}
        onClose={() => setReportModalVisible(false)}
        movieId={movie.id}
        movieTitle={movie.title}
      />
    </>
  );
};

export default MovieCard;
