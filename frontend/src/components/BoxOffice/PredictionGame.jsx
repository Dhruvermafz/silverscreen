// src/components/PredictionGame.js
import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import axios from "axios";

const PredictionGame = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock API to submit prediction
  const submitPrediction = async (values) => {
    try {
      // Replace with your API endpoint
      const response = await axios.post("/api/predictions/submit", values);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to submit prediction"
      );
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await submitPrediction(values);
      message.success(
        `Prediction for "${values.movieTitle}" submitted! Check your score later.`
      );
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-container">
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrophyOutlined />
            <span>Submit Box Office Prediction</span>
          </div>
        }
        open={isVisible}
        onCancel={onClose}
        footer={null}
        className="ant-modal"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="movieTitle"
            label="Movie Title"
            rules={[
              { required: true, message: "Please enter the movie title" },
            ]}
          >
            <Input
              placeholder="e.g., Upcoming Blockbuster"
              className="form-group"
            />
          </Form.Item>
          <Form.Item
            name="predictedGross"
            label="Predicted Gross (USD)"
            rules={[
              { required: true, message: "Please enter your predicted gross" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid amount (e.g., 100000000)",
              },
            ]}
          >
            <Input placeholder="e.g., 100000000" className="form-group" />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Why this prediction?"
            rules={[
              { required: true, message: "Please explain your prediction" },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g., Strong marketing, star cast, or market trends"
              className="form-group"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              block
              className="button"
            >
              Submit Prediction
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PredictionGame;
