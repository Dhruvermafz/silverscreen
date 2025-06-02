import React from "react";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSubmitFlagMutation } from "../../actions/flagApi";

const { Option } = Select;
const { TextArea } = Input;

const FlagSubmission = ({ userId, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitFlag] = useSubmitFlagMutation();

  const handleSubmit = async (values) => {
    try {
      await submitFlag({ ...values, userId }).unwrap();
      message.success("Flag submitted successfully");
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error("Failed to submit flag");
    }
  };

  return (
    <div className="flag-submission">
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="type"
          label="Flag Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <Select>
            <Option value="reviewer_role_appeal">Reviewer Role Appeal</Option>
            <Option value="other_complaint">Other Complaint</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Please select a reason" }]}
        >
          <Select>
            <Option value="no_films_released">
              No films released this month
            </Option>
            <Option value="technical_issue">Technical issue</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="evidence" label="Evidence (Optional)">
          <Upload maxCount={1} accept="image/*,.pdf">
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" className="flag-submit-button">
          Submit Flag
        </Button>
      </Form>
    </div>
  );
};

export default FlagSubmission;
