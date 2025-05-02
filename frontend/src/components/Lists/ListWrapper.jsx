import React, { useState } from "react";
import { List, Card, Button, Modal, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
} from "../../actions/listApi";
import { useEffect } from "react";
import axios from "axios";

const { Meta } = Card;

const ListComponent = () => {
  const { data: lists = [], refetch } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const [deleteList] = useDeleteListMutation();

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "967df4e131f467edcdd674b650bf257c";

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [selectedList, setSelectedList] = useState(null);
  const [isMoviesModalVisible, setIsMoviesModalVisible] = useState(false);
  const [movieDetails, setMovieDetails] = useState({});

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      message.warning("List name cannot be empty.");
      return;
    }
    try {
      await createList({ name: newListName }).unwrap();
      setNewListName("");
      setIsModalVisible(false);
      refetch();
      message.success("List created successfully!");
    } catch (error) {
      message.error("Failed to create list.");
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id).unwrap();
      refetch();
      message.success("List deleted successfully!");
    } catch (error) {
      message.error("Failed to delete list.");
    }
  };
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

  const handleCardClick = async (list) => {
    setSelectedList(list);
    setIsMoviesModalVisible(true);

    const details = {};
    for (const movie of list.movies) {
      const data = await fetchMovieDetails(movie.movieId);
      if (data) details[movie._id] = data;
    }
    setMovieDetails(details);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        Create New List
      </Button>

      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={lists}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => handleCardClick(item)}
              actions={[
                <DeleteOutlined
                  key="delete"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening modal
                    handleDeleteList(item._id);
                  }}
                />,
              ]}
            >
              <Meta
                title={item.name}
                description={`${item.movies.length} movies`}
              />
            </Card>
          </List.Item>
        )}
      />

      {/* Create List Modal */}
      <Modal
        title="Create New List"
        visible={isModalVisible}
        onOk={handleCreateList}
        onCancel={() => setIsModalVisible(false)}
        okText="Create"
      >
        <Input
          placeholder="Enter list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
      </Modal>

      {/* Movies List Modal */}
      <Modal
        title={selectedList?.name || "Movies"}
        visible={isMoviesModalVisible}
        onCancel={() => setIsMoviesModalVisible(false)}
        footer={null}
      >
        {selectedList?.movies.length > 0 ? (
          <List
            dataSource={selectedList.movies}
            renderItem={(movie) => {
              const data = movieDetails[movie._id];
              return (
                <List.Item key={movie._id}>
                  {data ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
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
                    </div>
                  ) : (
                    <span>{movie.title}</span>
                  )}
                </List.Item>
              );
            }}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>
            Add something here
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ListComponent;
