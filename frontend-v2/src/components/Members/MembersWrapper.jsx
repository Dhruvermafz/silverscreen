import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Dropdown,
  Spinner,
  Badge,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineUserAdd,
  AiOutlineUserDelete,
  AiOutlineMessage,
  AiOutlineFlag,
} from "react-icons/ai";
import { useGetAllMembersQuery } from "../../actions/userApi";
import "./members.css";
const MembersWrapper = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading, isError } = useGetAllMembersQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("joined");
  const [roleFilter, setRoleFilter] = useState("all");
  const [followedUsers, setFollowedUsers] = useState(new Set());

  const roles = [
    { value: "all", label: "All" },
    { value: "creator", label: "Creator" },
    { value: "moderator", label: "Moderator" },
    { value: "member", label: "Member" },
  ];

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (isError) {
    alert("Failed to load members.");
    return null;
  }

  const handleFollow = (userId) => {
    const newFollowed = new Set(followedUsers);
    if (newFollowed.has(userId)) {
      newFollowed.delete(userId);
      alert("Unfollowed user");
    } else {
      newFollowed.add(userId);
      alert("Followed user");
    }
    setFollowedUsers(newFollowed);
  };

  const handleMessage = (userId) => {
    alert("Opening chat with user");
    console.log("Messaging user:", userId);
  };

  const handleReport = (userId) => {
    alert("User reported");
    console.log("Reporting user:", userId);
  };

  const filteredMembers = members
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => roleFilter === "all" || user.role === roleFilter);

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === "joined") return new Date(b.joinedAt) - new Date(a.joinedAt);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "activity") return (b.postCount || 0) - (a.postCount || 0);
    return 0;
  });

  const topContributors = sortedMembers
    .filter((user) => (user.postCount || 0) > 5)
    .slice(0, 5);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={8}>
          <h2>Community Members</h2>
          <Row className="mb-3">
            <Col xs={12} sm={4}>
              <Form.Control
                placeholder="Search by username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col xs={6} sm={4}>
              <Form.Select onChange={(e) => setRoleFilter(e.target.value)}>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} sm={4}>
              <Form.Select onChange={(e) => setSortBy(e.target.value)}>
                <option value="joined">Recently Joined</option>
                <option value="rating">Highest Rated</option>
                <option value="activity">Most Active</option>
              </Form.Select>
            </Col>
          </Row>

          <Row>
            {sortedMembers.map((user) => (
              <Col key={user._id} xs={12} sm={6} lg={4} className="mb-4">
                <Card>
                  <Card.Body className="text-center">
                    <Image
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username}`
                      }
                      roundedCircle
                      width={64}
                      height={64}
                      className="mb-2"
                    />
                    <Card.Title>
                      <Link to={`/u/${user._id}`}>{user.username}</Link>
                      {user.role && (
                        <Badge
                          bg={
                            user.role === "creator"
                              ? "warning"
                              : user.role === "moderator"
                              ? "primary"
                              : "success"
                          }
                          className="ms-2"
                        >
                          {user.role}
                        </Badge>
                      )}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {user.bio || "No bio provided."}
                    </Card.Text>
                    <div className="text-muted small">
                      <p>⭐ {user.rating || 0} / 5</p>
                      <p>Movies: {user.favoriteMovies?.length || 0}</p>
                      <p>
                        Joined: {new Date(user.joinedAt).toLocaleDateString()}
                      </p>
                      <p>Posts: {user.postCount || 0}</p>
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant={
                          followedUsers.has(user._id)
                            ? "outline-danger"
                            : "outline-primary"
                        }
                        onClick={() => handleFollow(user._id)}
                      >
                        {followedUsers.has(user._id) ? (
                          <>
                            <AiOutlineUserDelete /> Unfollow
                          </>
                        ) : (
                          <>
                            <AiOutlineUserAdd /> Follow
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => navigate(`/u/${user._id}`)}
                      >
                        View Profile
                      </Button>
                      <Dropdown>
                        <Dropdown.Toggle size="sm" variant="outline-dark">
                          More
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleMessage(user._id)}
                          >
                            <AiOutlineMessage /> Message
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleReport(user._id)}>
                            <AiOutlineFlag /> Report
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Community Stats</Card.Header>
            <Card.Body>
              <p>Total Members: {members.length}</p>
              <p>
                Active Users: {members.filter((u) => u.postCount > 0).length}
              </p>
              <p>Top Contributors: {topContributors.length}</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Top Contributors</Card.Header>
            <Card.Body>
              {topContributors.map((user) => (
                <div
                  key={user._id}
                  className="d-flex justify-content-between align-items-center mb-3"
                >
                  <div className="d-flex align-items-center gap-2">
                    <Image
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username}`
                      }
                      roundedCircle
                      width={40}
                      height={40}
                    />
                    <div>
                      <Link to={`/u/${user._id}`} className="fw-bold">
                        {user.username}
                      </Link>
                      <div className="text-muted small">
                        Posts: {user.postCount}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => handleFollow(user._id)}
                  >
                    {followedUsers.has(user._id) ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MembersWrapper;
