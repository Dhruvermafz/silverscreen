import React from "react";
import { Form, Button } from "react-bootstrap";

const ForgotPasswordTab = ({
  forgotPasswordForm,
  setForgotPasswordForm,
  handleForgotPassword,
}) => {
  return (
    <form onSubmit={handleForgotPassword}>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={forgotPasswordForm.email}
          onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100">
        Send Reset Link
      </Button>
    </form>
  );
};

export default ForgotPasswordTab;
