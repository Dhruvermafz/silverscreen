import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Spin, Alert } from "antd";
import "./actor-profile.css";

const { Title, Paragraph, Text } = Typography;

const ActorProfile = ({ personId }) => {
  const [actor, setActor] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const TMDB_API_KEY = "967df4e131f467edcdd674b650bf257c";
  const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

  // Fetch actor details from TMDB
  const fetchActorDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${TMDB_API_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=movie_credits`
      );
      setActor(response.data);
    } catch (error) {
      setError("Failed to load actor details");
      console.error("Error fetching actor details:", error);
    }
  };

  // Fetch Wikipedia data
  const fetchWikiData = async (name) => {
    try {
      // Search for Wikipedia page
      const searchResponse = await axios.get(WIKI_API_URL, {
        params: {
          action: "query",
          list: "search",
          srsearch: `${name} actor`,
          format: "json",
          origin: "*",
        },
      });
      const page = searchResponse.data.query.search[0];
      if (!page) {
        setWikiData({
          biography: "No Wikipedia page found",
          works: [],
          news: [],
        });
        return;
      }

      // Fetch page content
      const pageResponse = await axios.get(WIKI_API_URL, {
        params: {
          action: "query",
          prop: "extracts",
          exintro: true,
          explaintext: true,
          pageids: page.pageid,
          format: "json",
          origin: "*",
        },
      });
      const extract = pageResponse.data.query.pages[page.pageid].extract;

      // Placeholder for works and news (Wikipedia doesn't provide structured works/news)
      setWikiData({
        biography: extract || "No biography available",
        works: [], // TMDB credits used instead
        news: [], // Placeholder for future news API
      });
    } catch (error) {
      setWikiData({
        biography: "Failed to load Wikipedia data",
        works: [],
        news: [],
      });
      console.error("Error fetching Wikipedia data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActorDetails();
  }, [personId]);

  useEffect(() => {
    if (actor?.name) {
      fetchWikiData(actor.name);
    }
  }, [actor]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error || !actor) {
    return <Alert message={error || "Actor not found"} type="error" />;
  }

  return (
    <div className="mn-face-card">
      <img
        src={
          actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : "https://via.placeholder.com/100x100?text=No+Image"
        }
        alt={actor.name}
        className="mn-face-image"
      />
      <div className="mn-face-info">
        <Text strong>{actor.name}</Text>
        <Text>{actor.character || "Actor"}</Text>
        <div className="mn-profile-details">
          <Title level={5}>Biography</Title>
          <Paragraph>
            {wikiData?.biography || "No biography available"}
          </Paragraph>
          <Title level={5}>Notable Works</Title>
          <ul>
            {actor.movie_credits?.cast?.slice(0, 5).map((credit) => (
              <li key={credit.id}>
                {credit.title} ({credit.release_date?.split("-")[0] || "N/A"})
              </li>
            )) || <li>No notable works available</li>}
          </ul>
          <Title level={5}>News</Title>
          <Paragraph>No recent news available</Paragraph> {/* Placeholder */}
        </div>
      </div>
    </div>
  );
};

export default ActorProfile;
