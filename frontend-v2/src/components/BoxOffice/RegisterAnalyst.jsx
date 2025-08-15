// src/components/RegisterAnalyst.js
import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

const RegisterAnalyst = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock API to submit analyst registration
  const submitAnalystRegistration = async (values) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post("/api/analyst/register", values);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to submit registration"
      );
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await submitAnalystRegistration(values);
      message.success(
        "Registration submitted! Our analysts will contact you for an interview."
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
            <UserAddOutlined />
            <span>Register as Box Office Analyst</span>
          </div>
        }
        open={isVisible}
        onCancel={onClose}
        footer={null}
        className="ant-modal"
      >
        <Text
          style={{
            color: "var(--text-primary)",
            display: "block",
            marginBottom: "var(--spacing-sm)",
          }}
        >
          To become a Box Office Analyst, you should have strong{" "}
          <strong>accounting or business knowledge</strong>. Our team of
          analysts will interview you to assess your qualifications, including
          your understanding of financial metrics, market trends, and cinema
          industry
          insights.[](https://www.roberthalf.com/us/en/insights/hiring-help/10-effective-interview-questions-for-accounting-and-finance-professionals)[](https://www.coursera.org/articles/financial-analyst)
        </Text>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="e.g., John Doe" className="form-group" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="e.g., john.doe@example.com"
              className="form-group"
            />
          </Form.Item>
          <Form.Item
            name="qualifications"
            label="Qualifications"
            rules={[
              {
                required: true,
                message: "Please describe your qualifications",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe your accounting/business education or experience"
              className="form-group"
            />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Relevant Experience"
            rules={[
              { required: true, message: "Please describe your experience" },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g., Financial analysis, box office reporting, or cinema industry roles"
              className="form-group"
            />
          </Form.Item>
          <Form.Item
            name="preferredInterviewTime"
            label="Preferred Interview Time"
          >
            <Select placeholder="Select a time slot" className="form-group">
              <Option value="morning">Morning (9 AM - 12 PM)</Option>
              <Option value="afternoon">Afternoon (1 PM - 4 PM)</Option>
              <Option value="evening">Evening (5 PM - 7 PM)</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              block
              className="button"
            >
              Submit Registration
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RegisterAnalyst;
