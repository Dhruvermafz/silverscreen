import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Dropdown,
  Nav,
  Tab,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  FaUserPlus,
  FaUserMinus,
  FaStar,
  FaShareAlt,
  FaFlag,
  FaCalendar,
  FaSortAmountUp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import PostCard from "../PostCard";
import BoxOfficeWidget from "../BoxOfficeWdget";
import {
  useGetGroupByIdQuery,
  useGetGroupPostsQuery,
  usePostToGroupMutation,
  useCommentOnGroupPostMutation,
  usePromoteToModeratorMutation,
  useBanUserFromGroupMutation,
} from "../../actions/groupApi";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { data: group, isLoading: groupLoading } =
    useGetGroupByIdQuery(groupId);
  const { data: posts = [], refetch: refetchPosts } =
    useGetGroupPostsQuery(groupId);
  const [postToGroup] = usePostToGroupMutation();
  const [commentOnGroupPost] = useCommentOnGroupPostMutation();
  const [promoteToModerator] = usePromoteToModeratorMutation();
  const [banUserFromGroup] = useBanUserFromGroupMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({ title: "", content: "" });
  const [eventFormData, setEventFormData] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [sortBy, setSortBy] = useState("new");
  const [isMember, setIsMember] = useState(false); // Mock membership status

  const handlePost = async () => {
    if (!postFormData.title || !postFormData.content) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await postToGroup({ groupId, postData: postFormData }).unwrap();
      setIsModalOpen(false);
      setPostFormData({ title: "", content: "" });
      refetchPosts();
      toast.success("Post created successfully");
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Failed to post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await commentOnGroupPost({ postId, commentData: { comment } }).unwrap();
      refetchPosts();
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to comment");
      console.error("Failed to comment:", error);
    }
  };

  const handleModerate = async (userId, action) => {
    try {
      if (action === "promote") {
        await promoteToModerator({ groupId, userId }).unwrap();
        toast.success("User promoted to moderator");
      }
      if (action === "ban") {
        await banUserFromGroup({ groupId, userId }).unwrap();
        toast.success("User banned from group");
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const handleJoinGroup = () => {
    setIsMember(true);
    toast.success("Joined group successfully");
  };

  const handleLeaveGroup = () => {
    setIsMember(false);
    toast.success("Left group successfully");
  };

  const flagContent = async (contentId, type) => {
    toast.info(`Flagged ${type}: ${contentId}`);
    console.log(`Flagging ${type}:`, contentId);
  };

  const handleShare = (postId) => {
    toast.info("Share link copied!");
    console.log("Sharing post:", postId);
  };

  const handleCreateEvent = async () => {
    if (
      !eventFormData.title ||
      !eventFormData.date ||
      !eventFormData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      // Mock event creation (replace with actual API)
      console.log("Creating event:", eventFormData);
      setIsEventModalOpen(false);
      setEventFormData({ title: "", date: "", description: "" });
      toast.success("Event created successfully");
    } catch (error) {
      toast.error("Failed to create event");
      console.error("Failed to create event:", error);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "hot") return b.comments.length - a.comments.length;
    if (sortBy === "top") return b.likes - a.likes;
    return 0;
  });

  const pinnedPosts = sortedPosts.filter((post) => post.isPinned);
  const regularPosts = sortedPosts.filter((post) => !post.isPinned);

  if (groupLoading || !group) {
    return (
      <Container className="d-flex justify-content-center py-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  const isAdmin =
    group.userRole === "creator" || group.userRole === "moderator";

  const dropdownMenu = (post) => (
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => flagContent(post.id, "post")}>
        <FaFlag className="me-2" /> Flag Post
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleShare(post.id)}>
        <FaShareAlt className="me-2" /> Share Post
      </Dropdown.Item>
      {isAdmin && (
        <Dropdown.Item onClick={() => console.log("Pin post:", post.id)}>
          <FaStar className="me-2" /> {post.isPinned ? "Unpin" : "Pin"} Post
        </Dropdown.Item>
      )}
    </Dropdown.Menu>
  );

  return (
    <Container fluid className="group-page py-4">
      <Row>
        <Col xs={12} md={8}>
          {/* Group Header */}
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={group.coverImage || "https://via.placeholder.com/1200x300"}
              style={{ height: "200px", objectFit: "cover" }}
              alt="Group cover"
            />
            <Card.Body>
              <Card.Title as="h2">{group.name}</Card.Title>
              <Card.Text>{group.description}</Card.Text>
              <div className="d-flex gap-3 mb-3">
                <span>
                  <strong>Privacy: </strong>
                  {group.isPrivate ? "Private" : "Public"}
                </span>
                <span>
                  <strong>Members: </strong>
                  {group.members.length}
                </span>
              </div>
              <div className="d-flex gap-2">
                {isMember ? (
                  <Button
                    variant="outline-secondary"
                    onClick={handleLeaveGroup}
                  >
                    <FaUserMinus className="me-1" /> Leave Group
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleJoinGroup}>
                    <FaUserPlus className="me-1" /> Join Group
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    variant="outline-primary"
                    onClick={() => console.log("Invite members")}
                  >
                    Invite Members
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Tabs for Content */}
          <Tab.Container defaultActiveKey="posts">
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="posts">Posts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="events">Events</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="members">Members</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="posts">
                <div className="d-flex gap-3 mb-4">
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: "120px" }}
                  >
                    <option value="new">New</option>
                    <option value="hot">Hot</option>
                    <option value="top">Top</option>
                  </Form.Select>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Create Post
                  </Button>
                </div>

                {/* Pinned Posts */}
                {pinnedPosts.length > 0 && (
                  <>
                    <h4>Pinned Posts</h4>
                    {pinnedPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={{ ...post, isPinned: true }}
                        onComment={handleComment}
                        onLike={() => console.log("Like post:", post.id)}
                        extra={
                          <Dropdown drop="down">
                            <Dropdown.Toggle variant="outline-secondary">
                              More
                            </Dropdown.Toggle>
                            {dropdownMenu(post)}
                          </Dropdown>
                        }
                      />
                    ))}
                    <hr />
                  </>
                )}

                {/* Regular Posts */}
                {regularPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onComment={handleComment}
                    onLike={() => console.log("Like post:", post.id)}
                    extra={
                      <Dropdown drop="down">
                        <Dropdown.Toggle variant="outline-secondary">
                          More
                        </Dropdown.Toggle>
                        {dropdownMenu(post)}
                      </Dropdown>
                    }
                  />
                ))}
              </Tab.Pane>
              <Tab.Pane eventKey="events">
                <Button
                  variant="primary"
                  onClick={() => setIsEventModalOpen(true)}
                  className="mb-4"
                >
                  Create Event
                </Button>
                <div className="event-list">
                  {group.events?.map((event, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body className="d-flex align-items-center">
                        <FaCalendar
                          className="me-3"
                          style={{ fontSize: "24px" }}
                        />
                        <div>
                          <Card.Title as="h6">{event.title}</Card.Title>
                          <Card.Text>{`${event.date} - ${event.description}`}</Card.Text>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="members">
                <div className="member-list">
                  {group.members.map((member) => (
                    <Card key={member.id} className="mb-3">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              member.avatar || "https://via.placeholder.com/40"
                            }
                            alt={member.name}
                            className="rounded-circle me-2"
                            style={{ width: "40px", height: "40px" }}
                          />
                          <div>
                            <Card.Title as="h6" className="mb-0">
                              {member.name}
                            </Card.Title>
                            <Card.Text>{member.role}</Card.Text>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                handleModerate(member.id, "promote")
                              }
                            >
                              Promote
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleModerate(member.id, "ban")}
                            >
                              Ban
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        <Col xs={12} md={4}>
          {/* Sidebar */}
          <Card className="mb-4">
            <Card.Header>About</Card.Header>
            <Card.Body>
              <Card.Text>{group.description}</Card.Text>
              <p>
                <strong>Created: </strong>
                {new Date(group.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Privacy: </strong>
                {group.isPrivate ? "Private" : "Public"}
              </p>
            </Card.Body>
          </Card>
          {group.rules && group.rules.length > 0 && (
            <Card className="mb-4">
              <Card.Header>Group Rules</Card.Header>
              <Card.Body>
                <ol>
                  {group.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ol>
              </Card.Body>
            </Card>
          )}
          <Card>
            <Card.Header>Quick Links</Card.Header>
            <Card.Body>
              <Nav className="flex-column">
                <Nav.Link onClick={() => navigate("#info")}>
                  Group Info
                </Nav.Link>
                <Nav.Link onClick={() => navigate("#rules")}>Rules</Nav.Link>
                <Nav.Link onClick={() => navigate("#members")}>
                  Members
                </Nav.Link>
                <Nav.Link onClick={() => navigate("#events")}>Events</Nav.Link>
                <Nav.Link onClick={() => navigate("#related")}>
                  Related Groups
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
          <BoxOfficeWidget className="mt-4" />
        </Col>
      </Row>

      {/* Post Creation Modal */}
      <Modal
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
          setPostFormData({ title: "", content: "" });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={postFormData.title}
                onChange={(e) =>
                  setPostFormData({ ...postFormData, title: e.target.value })
                }
                placeholder="Post Title"
                required
                isInvalid={!postFormData.title}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a title
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={postFormData.content}
                onChange={(e) =>
                  setPostFormData({ ...postFormData, content: e.target.value })
                }
                placeholder="Content"
                required
                isInvalid={!postFormData.content}
              />
              <Form.Control.Feedback type="invalid">
                Please enter content
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setPostFormData({ title: "", content: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePost}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Event Creation Modal */}
      <Modal
        show={isEventModalOpen}
        onHide={() => {
          setIsEventModalOpen(false);
          setEventFormData({ title: "", date: "", description: "" });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                value={eventFormData.title}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, title: e.target.value })
                }
                placeholder="Event Title"
                required
                isInvalid={!eventFormData.title}
              />
              <Form.Control.Feedback type="invalid">
                Please enter an event title
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={eventFormData.date}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, date: e.target.value })
                }
                required
                isInvalid={!eventFormData.date}
              />
              <Form.Control.Feedback type="invalid">
                Please enter an event date
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={eventFormData.description}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Event Description"
                required
                isInvalid={!eventFormData.description}
              />
              <Form.Control.Feedback type="invalid">
                Please enter an event description
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsEventModalOpen(false);
              setEventFormData({ title: "", date: "", description: "" });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GroupDetailPage;
