import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  message,
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Modal,
  Input,
  Select,
  Space,
  Tag,
  Empty,
  Spin,
  Drawer,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import debounce from "lodash.debounce";

import {
  useGetListsQuery,
  useGetListsByUserIdQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useAddMovieToListMutation,
  useUpdateListMutation,
  useRemoveMovieFromListMutation,
} from "../../actions/listApi";
import { useGetProfileQuery } from "../../actions/userApi";

import axios from "axios";

const { Search } = Input;

const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";
const POSTER_BASE = "https://image.tmdb.org/t/p/w200";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w500";

const ListWrapper = () => {
  const { data: authUser } = useGetProfileQuery();
  const userId = authUser?._id;

  const { data: publicLists = [], isLoading: publicLoading } =
    useGetListsQuery();
  const {
    data: userLists = [],
    isLoading: userLoading,
    refetch: refetchUser,
  } = useGetListsByUserIdQuery(userId, { skip: !userId });

  const lists = userId ? userLists : publicLists;
  const isLoading = userId ? userLoading : publicLoading;

  const [createList] = useCreateListMutation();
  const [deleteList] = useDeleteListMutation();
  const [addMovieToList] = useAddMovieToListMutation();
  const [updateList] = useUpdateListMutation();
  const [removeMovieFromList] = useRemoveMovieFromListMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [movieSearch, setMovieSearch] = useState("");

  const [newListName, setNewListName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrivate, setEditPrivate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Debounced TMDB search
  const searchTMDB = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            query
          )}`
        );
        setSearchResults(res.data.results.slice(0, 8));
      } catch (err) {
        message.error("Failed to search movies");
        setSearchResults([]);
      }
    }, 500),
    []
  );

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      message.warning("List name is required");
      return;
    }
    try {
      await createList({ name: newListName.trim(), isPrivate }).unwrap();
      message.success("List created!");
      setCreateModalOpen(false);
      setNewListName("");
      setIsPrivate(false);
      refetchUser?.();
    } catch {
      message.error("Failed to create list");
    }
  };

  const handleUpdateList = async () => {
    if (!editName.trim()) return;
    try {
      await updateList({
        listId: selectedList._id,
        name: editName.trim(),
        isPrivate: editPrivate,
      }).unwrap();
      message.success("List updated");
      setEditModalOpen(false);
      refetchUser?.();
    } catch {
      message.error("Failed to update");
    }
  };

  const handleDeleteList = async (id) => {
    Modal.confirm({
      title: "Delete this list?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteList(id).unwrap();
          message.success("List deleted");
          refetchUser?.();
        } catch {
          message.error("Failed to delete");
        }
      },
    });
  };

  const handleAddMovie = async (movie) => {
    try {
      await addMovieToList({
        listId: selectedList._id,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        },
      }).unwrap();
      message.success(`${movie.title} added!`);
      setMovieSearch("");
      setSearchResults([]);
      refetchUser?.();
    } catch {
      message.error("Failed to add movie");
    }
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeMovieFromList({ listId: selectedList._id, movieId }).unwrap();
      message.success("Movie removed");
      refetchUser?.();
    } catch {
      message.error("Failed to remove");
    }
  };

  const openViewModal = (list) => {
    setSelectedList(list);
    setViewModalOpen(true);
    setMovieSearch("");
    setSearchResults([]);
  };

  const openEditModal = (list) => {
    setSelectedList(list);
    setEditName(list.name);
    setEditPrivate(list.isPrivate);
    setEditModalOpen(true);
  };

  const paginatedLists = lists.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getListCoverImages = (movies) => {
    if (movies.length === 0) return ["/assets/imgs/placeholder.png"];
    return movies
      .slice(0, 4)
      .map((m) =>
        m.poster_path
          ? `${POSTER_BASE}${m.poster_path}`
          : "/assets/imgs/placeholder.png"
      );
  };

  return (
    <div className="lists-page container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="mb-1">My Lists</h1>
          <p className="text-muted mb-0">
            {lists.length} list{lists.length !== 1 ? "s" : ""} • Organize your
            favorite movies
          </p>
        </div>

        {authUser && (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New List
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card loading style={{ borderRadius: 12 }} />
            </Col>
          ))}
        </Row>
      ) : lists.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            authUser
              ? "You haven't created any lists yet"
              : "Log in to create and manage your own lists"
          }
        >
          {authUser && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Your First List
            </Button>
          )}
        </Empty>
      ) : (
        <>
          {/* Lists Grid */}
          <Row gutter={[24, 32]}>
            {paginatedLists.map((list) => {
              const coverImages = getListCoverImages(list.movies);
              const isOwner = authUser && list.userId === userId;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={list._id}>
                  <Card
                    hoverable
                    style={{ borderRadius: 16, overflow: "hidden" }}
                    bodyStyle={{ padding: 0 }}
                    cover={
                      <div
                        className="position-relative"
                        style={{ height: 280, cursor: "pointer" }}
                        onClick={() => openViewModal(list)}
                      >
                        <div className="d-flex flex-wrap h-100">
                          {coverImages.map((src, i) => (
                            <div
                              key={i}
                              className="flex-fill"
                              style={{
                                backgroundImage: `url(${src})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                minHeight: i < 2 ? 140 : 140,
                              }}
                            />
                          ))}
                          {coverImages.length < 4 &&
                            Array.from({ length: 4 - coverImages.length }).map(
                              (_, i) => (
                                <div
                                  key={`empty-${i}`}
                                  className="flex-fill d-flex align-items-center justify-content-center bg-dark"
                                  style={{ minHeight: 140 }}
                                >
                                  <span className="text-white opacity-50">
                                    No poster
                                  </span>
                                </div>
                              )
                            )}
                        </div>

                        {/* Overlay */}
                        <div
                          className="position-absolute bottom-0 start-0 end-0 p-4 text-white"
                          style={{
                            background:
                              "linear-gradient(transparent, rgba(0,0,0,0.8))",
                          }}
                        >
                          <h4 className="mb-1">{list.name}</h4>
                          <Space size="small">
                            <Tag color={list.isPrivate ? "red" : "green"}>
                              {list.isPrivate ? "Private" : "Public"}
                            </Tag>
                            <span>{list.movies.length} movies</span>
                          </Space>
                        </div>

                        {/* Owner Actions */}
                        {isOwner && (
                          <div className="position-absolute top-0 end-0 p-3">
                            <Space>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                                style={{ color: "white" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(list);
                                }}
                              />
                              <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                                style={{ color: "white" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteList(list._id);
                                }}
                              />
                            </Space>
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => openViewModal(list)}
                      >
                        View Movies
                      </Button>,
                      <Button
                        type="text"
                        icon={<ShareAltOutlined />}
                        onClick={() => {
                          if (list.isPrivate) {
                            message.warning(
                              "Private lists cannot be shared publicly"
                            );
                          } else {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/lists/${list._id}`
                            );
                            message.success("Link copied!");
                          }
                        }}
                      >
                        Share
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      description={
                        <small className="text-muted">
                          Created{" "}
                          {new Date(list.createdAt).toLocaleDateString()}
                        </small>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Pagination */}
          {/* Add your Pagination component here */}
        </>
      )}

      {/* Create List Modal */}
      <Modal
        title="Create New List"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          setNewListName("");
          setIsPrivate(false);
        }}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Input
            placeholder="Enter list name (e.g., 'Mind-Bending Sci-Fi')"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            size="large"
          />
          <Select
            value={isPrivate}
            onChange={setIsPrivate}
            placeholder="Visibility"
            size="large"
            style={{ width: "100%" }}
          >
            <Select.Option value={false}>
              Public (visible to everyone)
            </Select.Option>
            <Select.Option value={true}>Private (only you)</Select.Option>
          </Select>
          <Button type="primary" size="large" block onClick={handleCreateList}>
            Create List
          </Button>
        </Space>
      </Modal>

      {/* Edit List Modal */}
      <Modal
        title="Edit List"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            size="large"
          />
          <Select
            value={editPrivate}
            onChange={setEditPrivate}
            size="large"
            style={{ width: "100%" }}
          >
            <Select.Option value={false}>Public</Select.Option>
            <Select.Option value={true}>Private</Select.Option>
          </Select>
          <Button type="primary" size="large" block onClick={handleUpdateList}>
            Save Changes
          </Button>
        </Space>
      </Modal>

      {/* View List Movies Modal */}
      <Drawer
        title={`${selectedList?.name} (${selectedList?.movies.length} movies)`}
        placement="right"
        width={600}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      >
        {authUser && selectedList?.userId === userId && (
          <div className="mb-4">
            <Search
              placeholder="Search movies to add..."
              allowClear
              onSearch={searchTMDB}
              onChange={(e) => searchTMDB(e.target.value)}
              enterButton
              size="large"
            />
            {searchResults.length > 0 && (
              <div className="mt-3">
                <h6>Click to add:</h6>
                <Row gutter={[12, 12]}>
                  {searchResults.map((movie) => (
                    <Col span={12} key={movie.id}>
                      <Card
                        size="small"
                        hoverable
                        onClick={() => handleAddMovie(movie)}
                        cover={
                          <img
                            alt={movie.title}
                            src={
                              movie.poster_path
                                ? `${POSTER_BASE}${movie.poster_path}`
                                : "/assets/imgs/placeholder.png"
                            }
                            style={{ height: 180, objectFit: "cover" }}
                          />
                        }
                      >
                        <Card.Meta
                          title={movie.title}
                          description={`(${
                            movie.release_date?.split("-")[0] || "N/A"
                          })`}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}

        <Row gutter={[16, 24]}>
          {selectedList?.movies.map((item) => (
            <Col span={12} key={item._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.title}
                    src={
                      item.poster_path
                        ? `${POSTER_BASE}${item.poster_path}`
                        : "/assets/imgs/placeholder.png"
                    }
                    style={{ height: 300, objectFit: "cover" }}
                  />
                }
                actions={
                  authUser && selectedList?.userId === userId
                    ? [
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveMovie(item.movieId)}
                        >
                          Remove
                        </Button>,
                      ]
                    : undefined
                }
              >
                <Card.Meta title={item.title} />
              </Card>
            </Col>
          ))}
        </Row>

        {selectedList?.movies.length === 0 && (
          <Empty description="No movies in this list yet" />
        )}
      </Drawer>
    </div>
  );
};

export default ListWrapper;
