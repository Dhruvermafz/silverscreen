import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Rate,
  message,
  Typography,
  Modal,
  List,
  Spin,
  Select,
  Table,
} from "antd";
import {
  StarOutlined,
  CommentOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  useGetRecommendedMovieQuery,
  useSubmitReviewMutation,
  useGetReviewsQuery,
  useAddMovieRequestMutation,
  useGetUserRequestsQuery,
} from "../api/movieApi";

const { Title, Text } = Typography;
const { Option } = Select;

const MovieRecommendation = () => {
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [requestForm] = Form.useForm();

  // Fetch recommended movie
  const { data: movie, isLoading: isMovieLoading } =
    useGetRecommendedMovieQuery();
  // Fetch reviews for the movie
  const { data: reviews = [], isLoading: isReviewsLoading } =
    useGetReviewsQuery(movie?.id, { skip: !movie?.id });
  // Fetch user's movie addition requests
  const { data: userRequests = [], isLoading: isRequestsLoading } =
    useGetUserRequestsQuery();
  // Submit review mutation
  const [submitReview, { isLoading: isSubmittingReview }] =
    useSubmitReviewMutation();
  // Submit movie addition request mutation
  const [addMovieRequest, { isLoading: isSubmittingRequest }] =
    useAddMovieRequestMutation();

  // Handle review submission
  const handleSubmitReview = async (values) => {
    try {
      await submitReview({
        movieId: movie.id,
        rating: values.rating,
        comment: values.comment,
      }).unwrap();
      message.success("Review submitted successfully!");
      setIsReviewModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.error || "Failed to submit review");
    }
  };

  // Handle movie addition request submission
  const handleSubmitRequest = async (values) => {
    try {
      const response = await addMovieRequest({
        title: values.title,
        description: values.description,
        genres: values.genres,
        reason: values.reason,
      }).unwrap();
      message.success(
        `Movie addition request for "${response.request.title}" submitted to admin! Status: ${response.request.status}`
      );
      setIsRequestModalVisible(false);
      requestForm.resetFields();
    } catch (error) {
      message.error(error?.data?.error || "Failed to submit movie request");
    }
  };

  // Find the first review
  const firstReview = reviews.length > 0 ? reviews[0] : null;

  // Table columns for user requests
  const requestColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Submitted On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Title level={2}>
        Movie Recommendation <StarOutlined />
      </Title>

      {isMovieLoading ? (
        <Spin tip="Loading movie..." />
      ) : movie ? (
        <Card
          cover={<img alt={movie.title} src={movie.posterUrl} />}
          actions={[
            <Button
              key="review"
              type="primary"
              icon={<CommentOutlined />}
              onClick={() => setIsReviewModalVisible(true)}
            >
              Write Review
            </Button>,
            <Button
              key="request"
              icon={<FileAddOutlined />}
              onClick={() => setIsRequestModalVisible(true)}
            >
              Request Movie Addition
            </Button>,
          ]}
        >
          <Card.Meta
            title={movie.title}
            description={
              <>
                <Text>{movie.description}</Text>
                <br />
                <Text strong>Genres: </Text>
                <Text>{movie.genres.join(", ")}</Text>
              </>
            }
          />
          <div style={{ marginTop: "20px" }}>
            <Title level={4}>Reviews</Title>
            {isReviewsLoading ? (
              <Spin tip="Loading reviews..." />
            ) : reviews.length === 0 ? (
              <Text italic>Be the first to review this movie!</Text>
            ) : (
              <List
                dataSource={reviews}
                renderItem={(review, index) => (
                  <List.Item
                    style={{
                      background: index === 0 ? "#f0f5ff" : "transparent",
                      padding: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <>
                          <Rate disabled value={review.rating} />
                          {index === 0 && (
                            <Text type="success" style={{ marginLeft: "10px" }}>
                              First Review!
                            </Text>
                          )}
                        </>
                      }
                      description={
                        <>
                          <Text>{review.comment}</Text>
                          <br />
                          <Text type="secondary">
                            By User {review.userId} on{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Card>
      ) : (
        <Text>No movie available. Try requesting a movie addition!</Text>
      )}

      {/* Review Modal */}
      <Modal
        title="Write a Review"
        open={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmitReview} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please provide a rating!" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: "Please write a comment!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmittingReview}
              block
            >
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Movie Addition Request Modal */}
      <Modal
        title={
          <>
            Request Movie Addition <FileAddOutlined />
          </>
        }
        open={isRequestModalVisible}
        onCancel={() => setIsRequestModalVisible(false)}
        footer={null}
      >
        <Form
          form={requestForm}
          onFinish={handleSubmitRequest}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Movie Title"
            rules={[
              { required: true, message: "Please enter the movie title!" },
            ]}
          >
            <Input placeholder="Enter movie title" />
          </Form.Item>
          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea rows={4} placeholder="Enter movie description" />
          </Form.Item>
          <Form.Item
            name="genres"
            label="Genres (Optional)"
            rules={[{ type: "array" }]}
          >
            <Select mode="multiple" placeholder="Select genres">
              <Option value="Action">Action</Option>
              <Option value="Comedy">Comedy</Option>
              <Option value="Drama">Drama</Option>
              <Option value="Sci-Fi">Sci-Fi</Option>
              <Option value="Thriller">Thriller</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Why suggest this movie? (Optional)">
            <Input.TextArea
              rows={2}
              placeholder="Explain why this movie should be added"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmittingRequest}
              block
            >
              Submit Request to Admin
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* User's Movie Addition Requests */}
      <div style={{ marginTop: "20px" }}>
        <Title level={4}>Your Movie Addition Requests</Title>
        {isRequestsLoading ? (
          <Spin tip="Loading requests..." />
        ) : userRequests.length === 0 ? (
          <Text italic>No requests submitted yet.</Text>
        ) : (
          <Table
            columns={requestColumns}
            dataSource={userRequests}
            rowKey="id"
            pagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default MovieRecommendation;
