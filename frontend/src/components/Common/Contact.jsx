import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useCreateContactMutation } from "../../actions/contactApi";
const { Title, Paragraph } = Typography;

const Contact = () => {
  const [form] = Form.useForm();
  const [createContact, { isLoading }] = useCreateContactMutation();

  const onFinish = async (values) => {
    try {
      await createContact(values).unwrap();
      message.success("Your message has been sent successfully!");
      form.resetFields();
    } catch (error) {
      message.error(
        "Failed to send message: " + (error?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <Card bordered={false} style={{ padding: "30px" }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Contact Us ✉️
        </Title>
        <Paragraph style={{ textAlign: "center", marginBottom: "30px" }}>
          We'd love to hear from you! Send us your questions, feedback, or
          suggestions.
        </Paragraph>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Your Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Your Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Your Message"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <Input.TextArea rows={6} placeholder="Write your message here..." />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Contact;
