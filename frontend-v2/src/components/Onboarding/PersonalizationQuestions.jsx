// src/components/Onboarding/PersonalizationQuestions.js
import React, { useState } from "react";
import { message } from "antd";

const PersonalizationQuestions = ({ onNext }) => {
  const [prefs, setPrefs] = useState({
    genres: [],
    cinemas: [],
    watchingHabits: "",
    contentPreferences: [],
    languages: [],
  });

  const genres = [
    "Action",
    "Drama",
    "Thriller",
    "Comedy",
    "Sci-Fi",
    "Romance",
    "Documentary",
    "Arthouse",
    "Horror",
  ];
  const cinemas = [
    "Bollywood",
    "Hollywood",
    "Tollywood",
    "Kollywood",
    "South Korean",
    "Anime",
  ];
  const contentPrefs = [
    "New Releases",
    "Box Office Updates",
    "Blogs",
    "Group Discussions",
    "Quizzes",
  ];
  const languages = ["English", "Hindi", "Tamil", "Telugu"];

  const handleChange = (key, value) => setPrefs({ ...prefs, [key]: value });

  const handleSubmit = () => {
    // Optional validation: require at least one genre or cinema
    if (prefs.genres.length === 0 && prefs.cinemas.length === 0) {
      message.warning(
        "Please select at least one genre or cinema, or skip to continue.",
        2
      );
      return;
    }
    onNext(prefs);
  };

  const handleSkip = () => {
    onNext({}); // Pass empty preferences if skipped
  };

  return (
    <div className="personalization-questions text-center">
      <h3 className="mb-4">Tell us your cinematic vibe!</h3>
      <div className="mb-4">
        <label className="form-label d-block">Favorite Genres</label>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {genres.map((genre) => (
            <div key={genre} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={genre}
                id={`genre-${genre}`}
                onChange={(e) => {
                  const newGenres = e.target.checked
                    ? [...prefs.genres, genre]
                    : prefs.genres.filter((g) => g !== genre);
                  handleChange("genres", newGenres);
                }}
                aria-label={genre}
              />
              <label className="form-check-label" htmlFor={`genre-${genre}`}>
                {genre}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label d-block">Preferred Cinemas</label>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {cinemas.map((cinema) => (
            <div key={cinema} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={cinema}
                id={`cinema-${cinema}`}
                onChange={(e) => {
                  const newCinemas = e.target.checked
                    ? [...prefs.cinemas, cinema]
                    : prefs.cinemas.filter((c) => c !== cinema);
                  handleChange("cinemas", newCinemas);
                }}
                aria-label={cinema}
              />
              <label className="form-check-label" htmlFor={`cinema-${cinema}`}>
                {cinema}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label d-block">Watching Habits</label>
        <select
          className="form-select"
          onChange={(e) => handleChange("watchingHabits", e.target.value)}
          aria-label="Watching habits"
        >
          <option value="">Select...</option>
          <option value="theater">Theater</option>
          <option value="streaming">Streaming</option>
          <option value="home_media">Home Media</option>
          <option value="festivals">Festivals</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="form-label d-block">Content Preferences</label>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {contentPrefs.map((pref) => (
            <div key={pref} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={pref}
                id={`pref-${pref}`}
                onChange={(e) => {
                  const newPrefs = e.target.checked
                    ? [...prefs.contentPreferences, pref]
                    : prefs.contentPreferences.filter((p) => p !== pref);
                  handleChange("contentPreferences", newPrefs);
                }}
                aria-label={pref}
              />
              <label className="form-check-label" htmlFor={`pref-${pref}`}>
                {pref}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label d-block">Languages</label>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {languages.map((lang) => (
            <div key={lang} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={lang}
                id={`lang-${lang}`}
                onChange={(e) => {
                  const newLangs = e.target.checked
                    ? [...prefs.languages, lang]
                    : prefs.languages.filter((l) => l !== lang);
                  handleChange("languages", newLangs);
                }}
                aria-label={lang}
              />
              <label className="form-check-label" htmlFor={`lang-${lang}`}>
                {lang}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn btn-outline-secondary"
          onClick={handleSkip}
          aria-label="Skip personalization"
        >
          Skip
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          aria-label="Proceed to next step"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalizationQuestions;
