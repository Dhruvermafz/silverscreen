import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateBugReportMutation } from "../../actions/bugApi";
import "./findabug.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const FindABug = () => {
  const [form] = Form.useForm();
  const [createBugReport, { isLoading }] = useCreateBugReportMutation();

  const onFinish = async (values) => {
    try {
      const response = await createBugReport({
        description: values.description,
        pageUrl: values.pageUrl,
        screenshot: values.screenshot?.file,
      }).unwrap();
      message.success(response.message);
      form.resetFields();
    } catch (error) {
      message.error(error.data?.message || "Failed to submit bug report");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <section className="find-a-bug" aria-label="Report a bug">
      <Card className="find-a-bug-card">
        <Title level={3} className="find-a-bug-title">
          Report a Bug
        </Title>
        <Text className="find-a-bug-description">
          Found an issue on our website? Let us know by providing details below.
        </Text>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="find-a-bug-form"
        >
          <Form.Item
            name="description"
            label="Bug Description"
            rules={[
              {
                required: true,
                message: "Please describe the bug (min 10 characters)",
                min: 10,
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Describe the issue you encountered..."
              maxLength={1000}
            />
          </Form.Item>
          <Form.Item
            name="pageUrl"
            label="Page URL"
            rules={[
              { required: true, message: "Please provide the page URL" },
              {
                pattern: /^https?:\/\/.*/,
                message:
                  "Please enter a valid URL (e.g., https://dimecine.com)",
              },
            ]}
          >
            <Input placeholder="e.g., https://dimecine.com/{random}" />
          </Form.Item>
          <Form.Item
            name="screenshot"
            label="Screenshot (Optional)"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                validator: (_, value) =>
                  value && value.length > 0
                    ? value[0].size <= 5 * 1024 * 1024
                      ? Promise.resolve()
                      : Promise.reject("File size must be less than 5MB")
                    : Promise.resolve(),
              },
            ]}
          >
            <Upload
              accept="image/jpeg,image/png"
              beforeUpload={() => false} // Prevent auto-upload
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Screenshot</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="find-a-bug-submit"
            >
              Submit Bug Report
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
};

export default FindABug;
