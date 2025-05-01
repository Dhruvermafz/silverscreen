import React, { useState, useEffect } from "react";
import { Modal, Select, Input, message } from "antd";
import { useSuggestMovieMutation } from "../../actions/movieApi";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
const { TextArea } = Input;

const SuggestMovieModal = ({ visible, onClose, receiverId }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [reason, setReason] = useState("");
  const [suggestMovie, { isLoading }] = useSuggestMovieMutation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { movies } = await getMoviesFromAPI(); // fetch popular movies
        setMovies(movies);
      } catch (err) {
        message.error("Failed to fetch movies");
      }
    };
    if (visible) fetchMovies();
  }, [visible]);

  const handleSubmit = async () => {
    if (!selectedMovie || !reason.trim()) {
      return message.warning("Please select a movie and write a reason.");
    }
    try {
      await suggestMovie({
        receiverId,
        title: selectedMovie,
        message: reason,
      });
      message.success("Movie suggested!");
      setSelectedMovie("");
      setReason("");
      onClose();
    } catch (err) {
      message.error("Failed to suggest movie");
    }
  };

  return (
    <Modal
      title="Suggest a Movie"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      okText="Suggest"
    >
      <Select
        placeholder="Select a movie"
        style={{ width: "100%", marginBottom: 16 }}
        value={selectedMovie}
        onChange={setSelectedMovie}
        showSearch
        optionFilterProp="children"
      >
        {movies.map((movie) => (
          <Select.Option key={movie.id} value={movie.title}>
            {movie.title}
          </Select.Option>
        ))}
      </Select>
      <TextArea
        rows={4}
        placeholder="Why are you suggesting this movie?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
};

export default SuggestMovieModal;
