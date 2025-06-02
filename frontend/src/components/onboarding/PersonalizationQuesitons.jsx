import React, { useState } from "react";
import { Button, Checkbox, Select, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

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

  return (
    <div className="personalization-questions">
      <Title level={3}>Tell us your cinematic vibe!</Title>
      <div className="question">
        <label>Favorite Genres</label>
        <Checkbox.Group
          options={genres}
          onChange={(val) => handleChange("genres", val)}
        />
      </div>
      <div className="question">
        <label>Preferred Cinemas</label>
        <Checkbox.Group
          options={cinemas}
          onChange={(val) => handleChange("cinemas", val)}
        />
      </div>
      <div className="question">
        <label>Watching Habits</label>
        <Select
          onChange={(val) => handleChange("watchingHabits", val)}
          style={{ width: "100%" }}
        >
          <Option value="theater">Theater</Option>
          <Option value="streaming">Streaming</Option>
          <Option value="home_media">Home Media</Option>
          <Option value="festivals">Festivals</Option>
        </Select>
      </div>
      <div className="question">
        <label>Content Preferences</label>
        <Checkbox.Group
          options={contentPrefs}
          onChange={(val) => handleChange("contentPreferences", val)}
        />
      </div>
      <div className="question">
        <label>Languages</label>
        <Checkbox.Group
          options={languages}
          onChange={(val) => handleChange("languages", val)}
        />
      </div>
      <Button
        type="primary"
        className="personalization-button"
        onClick={() => onNext(prefs)}
      >
        Next
      </Button>
    </div>
  );
};

export default PersonalizationQuestions;
