import React, { useEffect, useState } from "react";
import { Button, Typography, List, Avatar, Space, Spin } from "antd";
import { PlayCircleOutlined, FireOutlined } from "@ant-design/icons";
import { getMoviesFromAPI } from "../../actions/getMoviesFromAPI";
import { toast } from "react-toastify";
import "./movies.css";

const { Title, Text } = Typography;

const MovieSidebar = ({ searchQuery, selectedFilter }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      try {
        const response = await getMoviesFromAPI(
          "",
          { sort: "popularity.desc", ...selectedFilter },
          1
        );
        setTrendingMovies(response.movies.slice(0, 5)); // Top 5 trending
      } catch (error) {
        toast.error("Failed to load trending movies", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingMovies();
  }, [selectedFilter]);

  return (
    <div className="sidebar-container">
      <Title level={4} className="sidebar-title">
        Trending Movies
      </Title>
      {loading ? (
        <Spin size="large" />
      ) : trendingMovies.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={trendingMovies}
          renderItem={(movie) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<PlayCircleOutlined />}
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  aria-label={`Watch trailer for ${movie.title}`}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={movie.posterUrl}
                    shape="square"
                    size={48}
                    alt={`${movie.title} poster`}
                  />
                }
                title={<a href={`/movies/${movie.id}`}>{movie.title}</a>}
                description={
                  <Text ellipsis>
                    {movie.releaseDate?.substring(0, 4) || "N/A"}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Text className="sidebar-empty">No trending movies found</Text>
      )}

      <div className="sidebar-section">
        <Title level={4} className="sidebar-title">
          Community
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={[
            { id: 1, user: "User1", comment: "Loved this movie!" },
            { id: 2, user: "User2", comment: "Great plot twist!" },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{item.user}</Text>}
                description={<Text ellipsis>{item.comment}</Text>}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default MovieSidebar;
