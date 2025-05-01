import React, { useState } from "react";
import { Typography, Modal, Button, Form, Input, Select, message } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { useSubmitMovieRequestMutation } from "../../actions/movieApi";

const { Title } = Typography;
const { Option } = Select;

const AddMovieRequest = ({ isVisible, onClose }) => {
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [addMovieRequest, { isLoading: isSubmittingRequest }] =
    useSubmitMovieRequestMutation();

  const handleSubmitRequest = async (values) => {
    try {
      const response = await addMovieRequest(values).unwrap();
      message.success(`Request for "${response.request.title}" submitted!`);
      setIsRequestModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.error || "Failed to request movie");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Modal
        title="Suggest a Movie Not in DB"
        open={isVisible}
        onCancel={onClose}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmitRequest} layout="vertical">
          <Form.Item
            name="title"
            label="Movie Title"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Interstellar" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Short summary" />
          </Form.Item>
          <Form.Item name="genres" label="Genres">
            <Select mode="multiple" placeholder="Select genres">
              <Option value="Action">Action</Option>
              <Option value="Drama">Drama</Option>
              <Option value="Sci-Fi">Sci-Fi</Option>
              <Option value="Romance">Romance</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Why recommend this?">
            <Input.TextArea
              rows={2}
              placeholder="Why do you want this movie added?"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmittingRequest}
              block
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
