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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
} from "../../actions/listApi";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./list.css"; // Custom styles
import placehold from "../../assets/img/placeholder-image-300x225.png";
const { Meta } = Card;
const { Text } = Typography;
const { Search } = Input;

const ListComponent = () => {
  const { data: lists = [], refetch } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const [deleteList] = useDeleteListMutation();

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "967df4e131f467edcdd674b650bf257c";

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [isMoviesModalVisible, setIsMoviesModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editListName, setEditListName] = useState("");
  const [movieDetails, setMovieDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentListPage, setCurrentListPage] = useState(1);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const pageSize = 8; // Lists per page
  const moviesPageSize = 5; // Movies per page

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

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.warning("List name cannot be empty", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      await createList({ name: newListName }).unwrap();
      setNewListName("");
      setIsCreateModalVisible(false);
      refetch();
      toast.success("List created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to create list", {
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
      toast.error("Failed to delete list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleEditList = async () => {
    if (!editListName.trim()) {
      toast.warning("List name cannot be empty", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      // Mock edit list (replace with actual API)
      await axios.put(`/api/lists/${selectedList._id}`, { name: editListName });
      setIsEditModalVisible(false);
      refetch();
      toast.success("List renamed successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to rename list", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddMovie = async (movieId) => {
    try {
      // Mock add movie (replace with actual API)
      await axios.post(`/api/lists/${selectedList._id}/movies`, { movieId });
      refetch();
      setSearchQuery("");
      setSearchResults([]);
      toast.success("Movie added to list", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add movie", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      // Mock remove movie (replace with actual API)
      await axios.delete(`/api/lists/${selectedList._id}/movies/${movieId}`);
      refetch();
      toast.success("Movie removed from list", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to remove movie", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleShareList = () => {
    // Mock share (replace with actual share logic)
    const shareUrl = `${window.location.origin}/lists/${selectedList._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("List URL copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleCardClick = async (list) => {
    setSelectedList(list);
    setIsMoviesModalVisible(true);
    setEditListName(list.name);

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
          setIsEditModalVisible(true);
        }}
      >
        <EditOutlined /> Rename
      </Menu.Item>
      <Menu.Item key="share" onClick={handleShareList}>
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
          aria-label="Create new list"
        >
          Create New List
        </Button>
      </Space>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={paginatedLists}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
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
                title={item.name}
                description={
                  <Text ellipsis>{`${item.movies.length} movies`}</Text>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      {lists.length > pageSize && (
        <Pagination
          current={currentListPage}
          pageSize={pageSize}
          total={lists.length}
          onChange={(page) => setCurrentListPage(page)}
          style={{ textAlign: "center", marginTop: 16 }}
        />
      )}

      {/* Create List Modal */}
      <Modal
        title="Create New List"
        open={isCreateModalVisible}
        onOk={handleCreateList}
        onCancel={() => setIsCreateModalVisible(false)}
        okText="Create"
      >
        <Input
          placeholder="Enter list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          aria-label="List name"
        />
      </Modal>

      {/* Edit List Modal */}
      <Modal
        title="Rename List"
        open={isEditModalVisible}
        onOk={handleEditList}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Save"
      >
        <Input
          placeholder="Enter new list name"
          value={editListName}
          onChange={(e) => setEditListName(e.target.value)}
          aria-label="New list name"
        />
      </Modal>

      {/* Movies List Modal */}
      <Modal
        title={selectedList?.name || "Movies"}
        open={isMoviesModalVisible}
        onCancel={() => {
          setIsMoviesModalVisible(false);
          setSearchQuery("");
          setSearchResults([]);
        }}
        footer={null}
        width={600}
      >
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
          />
        </AutoComplete>
        {paginatedMovies.length > 0 ? (
          <>
            <List
              dataSource={paginatedMovies}
              renderItem={(movie) => {
                const data = movieDetails[movie._id];
                return (
                  <List.Item
                    key={movie._id}
                    actions={[
                      <Tooltip title="Remove movie">
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveMovie(movie._id)}
                          aria-label={`Remove ${data?.title || "movie"}`}
                        />
                      </Tooltip>,
                    ]}
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
