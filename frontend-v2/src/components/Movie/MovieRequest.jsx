import React, { useState, useEffect } from "react";
import { Typography, Modal, Button, Form, Input, Select, message } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { useSubmitMovieRequestMutation } from "../../actions/movieApi";
import {
  getMoviesFromAPI,
  getGenresFromAPI,
} from "../../actions/getMoviesFromAPI";
const { Option } = Select;

const AddMovieRequest = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(isVisible);
  const [isTitleChecked, setIsTitleChecked] = useState(null); // null: not checked, true: doesn't exist, false: exists
  const [titleCheckLoading, setTitleCheckLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [addMovieRequest, { isLoading: isSubmittingRequest }] =
    useSubmitMovieRequestMutation();

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      const fetchedGenres = await getGenresFromAPI();
      setGenres(fetchedGenres);
    };
    fetchGenres();
  }, []);

  // Handle title input change and check if movie exists in TMDB
  const handleTitleChange = async (e) => {
    const title = e.target.value.trim();
    if (title.length > 2) {
      // Check only if title is meaningful (e.g., >2 chars)
      try {
        setTitleCheckLoading(true);
        const { movies } = await getMoviesFromAPI(title);
        setTitleCheckLoading(false);
        const exists = movies.some(
          (movie) => movie.title.toLowerCase() === title.toLowerCase()
        );
        if (exists) {
          setIsTitleChecked(false);
          message.warning(
            `"${title}" already exists in the TMDB database. You can still submit this request if it's a different version or for another reason.`
          );
        } else {
          setIsTitleChecked(true);
          message.info(`"${title}" is not in our database. Good to go!`);
        }
      } catch (error) {
        setIsTitleChecked(null);
        setTitleCheckLoading(false);
        message.error(
          "Error checking movie title. You can still submit your request."
        );
      }
    } else {
      setIsTitleChecked(null);
    }
  };

  // Handle form submission
  const handleSubmitRequest = async (values) => {
    try {
      const response = await addMovieRequest(values).unwrap();
      message.success(`Request for "${response.request.title}" submitted!`);
      form.resetFields();
      setIsTitleChecked(null);
      onClose(); // Close modal on success
    } catch (error) {
      message.error(error?.data?.error || "Failed to request movie");
    }
  };

  // Sync modal visibility with isVisible prop
  useEffect(() => {
    setIsRequestModalVisible(isVisible);
  }, [isVisible]);

  return (
    <div className="onboarding-container">
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileAddOutlined />
            <span>Suggest a Movie Not in DB</span>
          </div>
        }
        open={isRequestModalVisible}
        onCancel={onClose}
        footer={null}
        className="ant-modal"
      >
        <Form form={form} onFinish={handleSubmitRequest} layout="vertical">
          <Form.Item
            name="title"
            label="Movie Title"
            rules={[
              { required: true, message: "Please enter the movie title" },
            ]}
          >
            <Input
              placeholder="e.g., Interstellar"
              onChange={handleTitleChange}
              suffix={titleCheckLoading ? <span>Checking...</span> : null}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please provide a short summary" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Short summary of the movie" />
          </Form.Item>
          <Form.Item
            name="genres"
            label="Genres"
            rules={[
              { required: true, message: "Please select at least one genre" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select genres"
              className="form-group"
            >
              {genres.map((genre) => (
                <Option key={genre.id} value={genre.name}>
                  {genre.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="reason"
            label="Why recommend this?"
            rules={[
              {
                required: true,
                message: "Please explain why you recommend this movie",
              },
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Why do you want this movie added?"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmittingRequest || titleCheckLoading}
              block
              className="button"
            >
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddMovieRequest;
