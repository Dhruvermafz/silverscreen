import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const ProfileSettings = ({
  userData,
  handleEditProfile,
  fileList,
  setFileList,
}) => {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    name: userData?.name || "",
    oldpass: "",
    newpass: "",
    confirmpass: "",
    select: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileList([{ uid: file.name, url: URL.createObjectURL(file) }]);
    }
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    handleEditProfile(formData);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (formData.newpass === formData.confirmpass) {
      handleEditProfile({
        oldpass: formData.oldpass,
        newpass: formData.newpass,
      });
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12} lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title as="h4" className="mb-4">
                Profile Details
              </Card.Title>
              <Form onSubmit={handleSubmitProfile}>
                <Row>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="User 123"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="email@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="avatar">
                      <Form.Label>Avatar (40x40)</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button variant="primary" type="submit" size="sm">
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title as="h4" className="mb-4">
                Change Password
              </Card.Title>
              <Form onSubmit={handleSubmitPassword}>
                <Row>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="oldpass">
                      <Form.Label>Old Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="oldpass"
                        value={formData.oldpass}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="newpass">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newpass"
                        value={formData.newpass}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="confirmpass">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmpass"
                        value={formData.confirmpass}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} xl={6}>
                    <Form.Group className="mb-3" controlId="select">
                      <Form.Label>Select</Form.Label>
                      <Form.Select
                        name="select"
                        value={formData.select}
                        onChange={handleChange}
                      >
                        <option value="0">Option</option>
                        <option value="1">Option 2</option>
                        <option value="2">Option 3</option>
                        <option value="3">Option 4</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button variant="primary" type="submit" size="sm">
                      Change
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileSettings;
