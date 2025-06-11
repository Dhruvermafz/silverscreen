// src/components/BoxOfficeQuiz.js
import React, { useState } from "react";
import { Modal, Form, Radio, Button, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const BoxOfficeQuiz = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock quiz question
  const question = {
    id: 1,
    text: "Which movie grossed the most worldwide in 2024?",
    options: [
      "Dune: Part Two",
      "Inside Out 2",
      "Deadpool & Wolverine",
      "Despicable Me 4",
    ],
    correctAnswer: "Inside Out 2",
  };

  // Mock API to submit quiz answer
  const submitQuizAnswer = async (values) => {
    try {
      // Replace with your API endpoint
      const response = await axios.post("/api/quiz/submit", values);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to submit quiz answer"
      );
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const isCorrect = values.answer === question.correctAnswer;
      await submitQuizAnswer({ ...values, isCorrect });
      message.success(
        isCorrect
          ? "Correct! You earned 10 points!"
          : "Incorrect. Try again next week!"
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
            <QuestionCircleOutlined />
            <span>Box Office Quiz</span>
          </div>
        }
        open={isVisible}
        onCancel={onClose}
        footer={null}
        className="ant-modal"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="answer"
            label={question.text}
            rules={[{ required: true, message: "Please select an answer" }]}
          >
            <Radio.Group className="form-group">
              {question.options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  style={{ color: "var(--text-primary)" }}
                >
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              block
              className="button"
            >
              Submit Answer
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BoxOfficeQuiz;
