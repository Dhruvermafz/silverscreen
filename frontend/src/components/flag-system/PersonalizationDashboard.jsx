import React from "react";
import { Button, Checkbox, Select, Typography, message } from "antd";
import {
  useGetProfileQuery,
  useUpdatePreferencesMutation,
} from "../../api/userApi";
import "../../styles/Personalization.css";

const { Title } = Typography;
const { Option } = Select;

const PersonalizationDashboard = ({ userId }) => {
  const { data: profile } = useGetProfileQuery(userId);
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [prefs, setPrefs] = useState(profile?.preferences || {});

  const genres = ["Action", "Drama", "Thriller", "Comedy", "Sci-Fi"];
  const cinemas = ["Bollywood", "Hollywood", "Tollywood", "Anime"];
  const contentPrefs = ["New Releases", "Box Office Updates", "Blogs"];
  const languages = ["English", "Hindi", "Tamil"];

  const handleChange = (key, value) => setPrefs({ ...prefs, [key]: value });

  const handleSave = async () => {
    try {
      await updatePreferences({ userId, preferences: prefs }).unwrap();
      message.success("Preferences updated");
    } catch (error) {
      message.error("Failed to update preferences");
    }
  };

  return (
    <div className="personalization-dashboard">
      <Title level={3}>Personalize Your Experience</Title>
      <div className="question">
        <label>Favorite Genres</label>
        <Checkbox.Group
          options={genres}
          value={prefs.genres}
          onChange={(val) => handleChange("genres", val)}
        />
      </div>
      <div className="question">
        <label>Preferred Cinemas</label>
        <Checkbox.Group
          options={cinemas}
          value={prefs.cinemas}
          onChange={(val) => handleChange("cinemas", val)}
        />
      </div>
      <div className="question">
        <label>Watching Habits</label>
        <Select
          value={prefs.watchingHabits}
          onChange={(val) => handleChange("watchingHabits", val)}
          style={{ width: "100%" }}
        >
          <Option value="theater">Theater</Option>
          <Option value="streaming">Streaming</Option>
        </Select>
      </div>
      <div className="question">
        <label>Content Preferences</label>
        <Checkbox.Group
          options={contentPrefs}
          value={prefs.contentPreferences}
          onChange={(val) => handleChange("contentPreferences", val)}
        />
      </div>
      <div className="question">
        <label>Languages</label>
        <Checkbox.Group
          options={languages}
          value={prefs.languages}
          onChange={(val) => handleChange("languages", val)}
        />
      </div>
      <Button
        type="primary"
        className="personalization-save-button"
        onClick={handleSave}
      >
        Save Preferences
      </Button>
    </div>
  );
};

export default PersonalizationDashboard;
