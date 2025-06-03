import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Dropdown,
  Menu,
  Tooltip,
  AutoComplete,
  Pagination,
  Checkbox,
  Badge,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  CopyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  useGetListsQuery,
  useGetListsByUserIdQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useAddMovieToListMutation,
  useUpdateListMutation,
  useRemoveMovieFromListMutation,
} from "../../actions/listApi";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./list.css"; // Custom styles
import placehold from "../../assets/img/placeholder-image-300x225.png";

const { Meta } = Card;
const { Text } = Typography;
const { Search } = Input;

const ListComponent = ({ userId }) => {
  // Call both hooks unconditionally
  const {
    data: publicLists = [],
    refetch: refetchPublic,
    isLoading: publicListsLoading,
    error: publicListsError,
  } = useGetListsQuery();
  const {
    data: userLists = [],
    refetch: refetchUser,
    isLoading: userListsLoading,
    error: userListsError,
  } = useGetListsByUserIdQuery(userId || null, { skip: !userId }); // Skip if no userId

  // Select the appropriate lists based on userId
  const lists = userId ? userLists : publicLists;
  const refetch = userId ? refetchUser : refetchPublic;
  const listsLoading = userId ? userListsLoading : publicListsLoading;
  const listsError = userId ? userListsError : publicListsError;

  const [createList, { isLoading: createLoading }] = useCreateListMutation();
  const [deleteList, { isLoading: deleteLoading }] = useDeleteListMutation();
  const [addMovieToList, { isLoading: addMovieLoading }] =
    useAddMovieToListMutation();
  const [updateList, { isLoading: updateLoading }] = useUpdateListMutation();
  const [removeMovieFromList, { isLoading: removeMovieLoading }] =
    useRemoveMovieFromListMutation();

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "967df4e131f467edcdd674b650bf257c";

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [isMoviesModalVisible, setIsMoviesModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editListName, setEditListName] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentListPage, setCurrentListPage] = useState(1);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const pageSize = 8; // Lists per page
  const moviesPageSize = 5; // Movies per page

  useEffect(() => {
    if (listsError) {
      toast.error(listsError?.data?.message || "Failed to load lists", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  }, [listsError]);

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      return {
        title: response.data.title,
        posterUrl: `https://image.tmdb.org/t/p/w200${response.data.poster_path}`,
        tmdbUrl: `https://www.themoviedb.org/movie/${movieId}`,
      };
    } catch (error) {
      console.error("Error fetching movie details", error);
      return null;
    }
  };

  const searchMovies = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      setSearchResults(
        response.data.results.map((movie) => ({
          value: movie.id.toString(),
          label: movie.title,
          movie,
        }))
      );
    } catch (error) {
      console.error("Error searching movies", error);
      toast.error("Failed to search movies", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const validateListName = (name) => {
    if (!name.trim()) {
      return "List name cannot be empty";
    }
    if (!/^[a-zA-Z0-9\s_-]{3,50}$/.test(name)) {
      return "List name must be 3-50 characters and contain only letters, numbers, spaces, underscores, or hyphens";
    }
    return null;
  };

  const handleCreateList = async () => {
    const validationError = validateListName(newListName);
    if (validationError) {
      toast.warning(validationError, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      await createList({ name: newListName, isPrivate }).unwrap();
      setNewListName("");
      setIsPrivate(false);
      setIsCreateModalVisible(false);
      refetch();
      toast.success("List created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id).unwrap();
      refetch();
      toast.success("List deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleEditList = async () => {
    const validationError = validateListName(editListName);
    if (validationError) {
      toast.warning(validationError, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      await updateList({
        listId: selectedList._id,
        name: editListName,
        isPrivate: editIsPrivate,
      }).unwrap();
      setIsEditModalVisible(false);
      refetch();
      toast.success("List updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddMovie = async (movieId) => {
    try {
      const selectedMovie = searchResults.find(
        (result) => result.value === movieId
      )?.movie;
      if (!selectedMovie) {
        toast.error("Invalid movie selected", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
      await addMovieToList({
        listId: selectedList._id,
        movie: {
          id: selectedMovie.id,
          title: selectedMovie.title,
          poster_path: selectedMovie.poster_path,
        },
      }).unwrap();
      refetch();
      setSearchQuery("");
      setSearchResults([]);
      toast.success("Movie added to list", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add movie", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeMovieFromList({
        listId: selectedList._id,
        movieId,
      }).unwrap();
      refetch();
      toast.success("Movie removed from list", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove movie", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleShareList = () => {
    if (selectedList.isPrivate) {
      toast.warning("This is a private list and can only be viewed by you.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const shareUrl = `${window.location.origin}/lists/${selectedList._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("List URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleCardClick = async (list) => {
    setSelectedList(list);
    setEditListName(list.name);
    setEditIsPrivate(list.isPrivate);
    setIsMoviesModalVisible(true);

    const details = {};
    for (const movie of list.movies) {
      const data = await fetchMovieDetails(movie.movieId);
      if (data) details[movie._id] = data;
    }
    setMovieDetails(details);
  };

  const actionMenu = (list) => (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => {
          setSelectedList(list);
          setEditListName(list.name);
          setEditIsPrivate(list.isPrivate);
          setIsEditModalVisible(true);
        }}
        disabled={list.userId !== localStorage.getItem("userId")} // Disable if not the owner
      >
        <EditOutlined /> Rename
      </Menu.Item>
      <Menu.Item
        key="share"
        onClick={() => {
          setSelectedList(list);
          handleShareList();
        }}
      >
        <ShareAltOutlined /> Share
      </Menu.Item>
      <Menu.Item
        key="duplicate"
        onClick={() =>
          toast.info("Duplicating list (mock)", {
            position: "top-right",
            autoClose: 2000,
          })
        }
      >
        <CopyOutlined /> Duplicate
      </Menu.Item>
    </Menu>
  );

  const paginatedLists = lists.slice(
    (currentListPage - 1) * pageSize,
    currentListPage * pageSize
  );
  const paginatedMovies = selectedList
    ? selectedList.movies.slice(
        (currentMoviePage - 1) * moviesPageSize,
        currentMoviePage * moviesPageSize
      )
    : [];

  return (
    <div className="list-component">
      <Space style={{ marginBottom: 16 }}>
        {!userId && ( // Only show create button if not viewing another user's lists
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            aria-label="Create new list"
            loading={createLoading}
          >
            Create New List
          </Button>
        )}
      </Space>

      {listsLoading ? (
        <Text>Loading lists...</Text>
      ) : (
        <>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={paginatedLists}
            renderItem={(item) => (
              <List.Item>
                <Badge.Ribbon
                  text={item.isPrivate ? "Private" : "Public"}
                  color={item.isPrivate ? "red" : "green"}
                  style={{ display: item.isPrivate ? "block" : "" }}
                >
                  <Card
                    hoverable={true}
                    onClick={() => handleCardClick(item)}
                    cover={
                      <img
                        alt={`${item.name} cover`}
                        src={item.coverImage || placehold}
                        style={{ height: 150, objectFit: "cover" }}
                      />
                    }
                    actions={[
                      <Tooltip title="Delete list">
                        <DeleteOutlined
                          key="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(item._id);
                          }}
                          aria-label={`Delete ${item.name}`}
                          disabled={
                            deleteLoading ||
                            item.userId !== localStorage.getItem("userId")
                          } // Disable if not the owner
                        />
                      </Tooltip>,
                      <Dropdown overlay={actionMenu(item)} trigger={["click"]}>
                        <Button
                          icon={<ShareAltOutlined />}
                          onClick={(e) => e.stopPropagation()}
                          aria-label="More actions"
                        />
                      </Dropdown>,
                    ]}
                  >
                    <Meta
                      title={
                        <Space>
                          {item.name}
                          {item.isPrivate && (
                            <LockOutlined style={{ fontSize: 14 }} />
                          )}
                        </Space>
                      }
                      description={
                        <Text
                          ellipsis={true}
                        >{`${item.movies.length} movies`}</Text>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            )}
          />

          {lists.length > 0 && (
            <Pagination
              current={currentListPage}
              pageSize={pageSize}
              total={lists.length}
              onChange={(page) => setCurrentListPage(page)}
              style={{ textAlign: "center", marginTop: 16 }}
            />
          )}
        </>
      )}

      {/* Create List Modal */}
      <Modal
        title="Create New List"
        open={isCreateModalVisible}
        onOk={handleCreateList}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setNewListName("");
          setIsPrivate(false);
        }}
        okText="Create"
        confirmLoading={createLoading}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Enter list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            aria-label="List name"
          />
          <Checkbox
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          >
            Make this list private
          </Checkbox>
        </Space>
      </Modal>

      {/* Edit List Modal */}
      <Modal
        title="Edit List"
        open={isEditModalVisible}
        onOk={handleEditList}
        onCancel={() => {
          setIsEditModalVisible(false);
        }}
        okText="Save"
        confirmLoading={updateLoading}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Enter new list name"
            value={editListName}
            onChange={(e) => setEditListName(e.target.value)}
            aria-label="List name"
          />
          <Checkbox
            checked={editIsPrivate}
            onChange={(e) => setEditIsPrivate(e.target.checked)}
          >
            Make this list private
          </Checkbox>
        </Space>
      </Modal>

      {/* Movies List Modal */}
      <Modal
        title={selectedList?.name || ""}
        open={isMoviesModalVisible}
        onCancel={() => {
          setIsMoviesModalVisible(false);
          setSearchQuery("");
          setSearchResults([]);
          setCurrentMoviePage(1);
        }}
        footer={null}
        width={600}
      >
        {selectedList?.userId === localStorage.getItem("userId") && (
          <AutoComplete
            options={searchResults}
            style={{ width: "100%", marginBottom: 16 }}
            onSearch={searchMovies}
            onSelect={(value) => handleAddMovie(value)}
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          >
            <Search
              placeholder="Search movies to add"
              aria-label="Search movies"
              disabled={addMovieLoading}
            />
          </AutoComplete>
        )}
        {paginatedMovies.length > 0 ? (
          <>
            <List
              dataSource={paginatedMovies}
              renderItem={(movie) => {
                const data = movieDetails[movie._id];
                return (
                  <List.Item
                    actions={
                      selectedList?.userId === localStorage.getItem("userId")
                        ? [
                            <Tooltip title="Remove">
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveMovie(movie.movieId)}
                                aria-label={`Remove ${data?.title || "movie"}`}
                                disabled={removeMovieLoading}
                              />
                            </Tooltip>,
                          ]
                        : []
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {data ? (
                        <>
                          <img
                            src={data.posterUrl}
                            alt={data.title}
                            style={{ width: "50px", borderRadius: "4px" }}
                          />
                          <a
                            href={data.tmdbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data.title}
                          </a>
                        </>
                      ) : (
                        <Text>{movie.title}</Text>
                      )}
                    </div>
                  </List.Item>
                );
              }}
            />
            {selectedList?.movies.length > moviesPageSize && (
              <Pagination
                current={currentMoviePage}
                pageSize={moviesPageSize}
                total={selectedList.movies.length}
                onChange={(page) => setCurrentMoviePage(page)}
                style={{ textAlign: "center", marginTop: 16 }}
              />
            )}
          </>
        ) : (
          <Text
            style={{ textAlign: "center", color: "#999", display: "block" }}
          >
            Add movies to this list
          </Text>
        )}
      </Modal>
    </div>
  );
};

export default ListComponent;
