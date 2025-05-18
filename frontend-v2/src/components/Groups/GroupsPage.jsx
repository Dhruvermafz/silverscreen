import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Dropdown,
  Carousel,
  Badge,
} from "react-bootstrap";
import { FaUpload, FaStar, FaShareAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import GroupCard from "./GroupCard";
import SearchBar from "../SearchBar";
import BoxOfficeWidget from "../BoxOfficeWdget";
import {
  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useSearchGroupsQuery,
} from "../../actions/groupApi";

const GroupsPage = () => {
  const navigate = useNavigate();
  const { data: groups = [], refetch } = useGetAllGroupsQuery();
  const [createGroup] = useCreateGroupMutation();
  const [joinGroup] = useJoinGroupMutation();
  const [leaveGroup] = useLeaveGroupMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchedGroups = [] } = useSearchGroupsQuery(searchQuery, {
    skip: !searchQuery,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("new");
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "movies",
    rules: "",
    isPublic: true,
    coverImage: null,
  });

  const categories = [
    { value: "all", label: "All" },
    { value: "movies", label: "Movies" },
    { value: "tv-shows", label: "TV Shows" },
    { value: "anime", label: "Anime" },
    { value: "documentaries", label: "Documentaries" },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateGroup = async (values) => {
    try {
      const groupData = {
        ...values,
        isPrivate: !values.isPublic,
        rules: values.rules
          ? values.rules.split("\n").filter((r) => r.trim())
          : [],
        coverImage: fileList.length > 0 ? fileList[0].url : null, // Mock URL handling
        category: values.category || "movies",
      };
      await createGroup(groupData).unwrap();
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        category: "movies",
        rules: "",
        isPublic: true,
        coverImage: null,
      });
      setFileList([]);
      refetch();
      toast.success("Group created successfully");
    } catch (error) {
      toast.error("Failed to create group");
      console.error("Failed to create group:", error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId).unwrap();
      refetch();
      toast.success("Joined group successfully");
    } catch (error) {
      toast.error("Failed to join group");
      console.error("Failed to join group:", error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await leaveGroup(groupId).unwrap();
      refetch();
      toast.success("Left group successfully");
    } catch (error) {
      toast.error("Failed to leave group");
      console.error("Failed to leave group:", error);
    }
  };

  const handleShareGroup = (groupId) => {
    toast.info("Group link copied!");
    console.log("Sharing group:", groupId);
  };

  const handleReportGroup = (groupId) => {
    toast.info("Group reported");
    console.log("Reporting group:", groupId);
  };

  const filteredGroups = (searchQuery ? searchedGroups : groups).filter(
    (group) => category === "all" || group.category === category
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortBy === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "popular") return b.members.length - a.members.length;
    if (sortBy === "active") return b.postCount - a.postCount;
    return 0;
  });

  const featuredGroups = sortedGroups.slice(0, 3);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileList([
        { uid: file.name, name: file.name, url: URL.createObjectURL(file) },
      ]);
    }
  };

  return (
    <Container fluid className="groups-page py-4">
      <Row>
        <Col xs={12} md={8}>
          {/* Header */}
          <h2>Discover Groups</h2>
          <div className="d-flex flex-wrap gap-3 mb-4">
            <SearchBar onSearch={handleSearch} placeholder="Search groups..." />
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary">
                {categories.find((cat) => cat.value === category)?.label ||
                  "All"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {categories.map((cat) => (
                  <Dropdown.Item
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary">
                {sortBy === "new"
                  ? "Newest"
                  : sortBy === "popular"
                  ? "Popular"
                  : "Most Active"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy("new")}>
                  Newest
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("popular")}>
                  Popular
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("active")}>
                  Most Active
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Create Group
            </Button>
          </div>

          {/* Featured Groups Carousel */}
          {featuredGroups.length > 0 && (
            <Card className="mb-4">
              <Card.Header>Featured Groups</Card.Header>
              <Carousel interval={5000}>
                {featuredGroups.map((group) => (
                  <Carousel.Item key={group.id}>
                    <Card>
                      <Card.Img
                        variant="top"
                        src={
                          group.coverImage ||
                          "https://via.placeholder.com/300x150"
                        }
                        style={{ height: "150px", objectFit: "cover" }}
                        alt={group.name}
                      />
                      <Card.Body>
                        <Card.Title>{group.name}</Card.Title>
                        <Card.Text>
                          {group.description?.substring(0, 100) ||
                            "No description available"}
                          {group.description?.length > 100 && "..."}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{group.members.length} members</span>
                          <Badge bg={group.isPrivate ? "secondary" : "success"}>
                            {group.isPrivate ? "Private" : "Public"}
                          </Badge>
                        </div>
                      </Card.Body>
                      <Card.Footer className="d-flex gap-2">
                        <Button
                          variant={
                            group.userRole === "none"
                              ? "outline-primary"
                              : "secondary"
                          }
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={group.userRole !== "none"}
                        >
                          {group.userRole === "none" ? "Join" : "Joined"}
                        </Button>
                        <Button
                          variant="outline-info"
                          onClick={() => navigate(`/groups/${group.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleShareGroup(group.id)}
                        >
                          <FaShareAlt />
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
          )}

          {/* All Groups */}
          <Row>
            {sortedGroups.map((group) => (
              <Col xs={12} sm={6} key={group.id} className="mb-4">
                <GroupCard
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  userRole={group.userRole}
                  onReport={handleReportGroup}
                  onShare={handleShareGroup}
                  onView={() => navigate(`/groups/${group.id}`)}
                />
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={12} md={4}>
          {/* Sidebar */}
          <Card className="mb-4">
            <Card.Header>Suggested Groups</Card.Header>
            <Card.Body>
              {sortedGroups.slice(0, 5).map((group) => (
                <div
                  key={group.id}
                  className="d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    <Card.Title as="h6" className="mb-1">
                      {group.name}
                    </Card.Title>
                    <Card.Text>
                      {group.description?.substring(0, 50) || "No description"}
                      {group.description?.length > 50 && "..."}
                    </Card.Text>
                  </div>
                  <Button
                    variant={
                      group.userRole === "none"
                        ? "outline-primary"
                        : "secondary"
                    }
                    size="sm"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={group.userRole !== "none"}
                  >
                    {group.userRole === "none" ? "Join" : "Joined"}
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>Trending Categories</Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                {categories.slice(1).map((cat) => (
                  <Badge
                    key={cat.value}
                    bg="primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
          <BoxOfficeWidget className="mt-4" />
        </Col>
      </Row>

      {/* Create Group Modal */}
      <Modal
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
          setFileList([]);
          setFormData({
            name: "",
            description: "",
            category: "movies",
            rules: "",
            isPublic: true,
            coverImage: null,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateGroup(formData);
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Group Name"
                isInvalid={!formData.name}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a group name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                placeholder="Description"
                isInvalid={!formData.description}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a description
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rules</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.rules}
                onChange={(e) =>
                  setFormData({ ...formData, rules: e.target.value })
                }
                placeholder="Enter group rules (one per line)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {fileList.length > 0 && (
                <img
                  src={fileList[0].url}
                  alt="Preview"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Public Group"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setFileList([]);
              setFormData({
                name: "",
                description: "",
                category: "movies",
                rules: "",
                isPublic: true,
                coverImage: null,
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleCreateGroup(formData)}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GroupsPage;
