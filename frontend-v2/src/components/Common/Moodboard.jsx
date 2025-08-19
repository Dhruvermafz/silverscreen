// src/components/Moodboard.jsx
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { getGenresFromAPI } from "../../actions/getMoviesFromAPI";

const Moodboard = ({ onCategoryChange, selectedCategories, authUser }) => {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const fetchedGenres = await getGenresFromAPI();
        setGenres(fetchedGenres || []);
        if (authUser?.favoriteCategories) {
          const userGenreIds = fetchedGenres
            .filter((g) => authUser.favoriteCategories.includes(g.name))
            .map((g) => g.id);
          onCategoryChange(userGenreIds);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        message.error("Failed to load genres", 2);
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, [authUser, onCategoryChange]);

  const handleGenreChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    onCategoryChange(value);
  };

  const toggleMoodboard = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="mn-moodboard-floating">
      {isMaximized ? (
        <section className="mn-moodboard-maximized">
          <div className="mn-title">
            <h2>
              What's Your <span>Mood Today?</span>
            </h2>
          </div>
          {loadingGenres ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <select
              multiple
              className="form-select"
              value={selectedCategories}
              onChange={handleGenreChange}
              aria-label="Select genres"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={String(genre.id)}>
                  {genre.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="mn-btn-2"
            onClick={toggleMoodboard}
            aria-label="Minimize moodboard"
          >
            <span>Minimize</span>
          </button>
        </section>
      ) : (
        <button
          className="mn-moodboard-minimized"
          onClick={toggleMoodboard}
          aria-label="Open moodboard"
        >
          <i className="ri-mood-line"></i>
        </button>
      )}
    </div>
  );
};

export default Moodboard;
