import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Skeleton, Typography, Space, Tag } from "antd";
import { motion } from "framer-motion"; // Optional: for subtle animations
import {
  getCustomCategories,
  getMoviesFromAPI,
} from "../../actions/getMoviesFromAPI";

const { Title, Text } = Typography;

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const customCats = getCustomCategories();

      const enrichedCategories = await Promise.all(
        customCats.map(async (cat) => {
          try {
            const { movies, totalResults } = await getMoviesFromAPI(
              "",
              {
                category: cat.key,
              },
              1
            );

            const heroMovie = movies[0] || {};
            return {
              ...cat,
              movieCount: totalResults || 0,
              backdrop: heroMovie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
                : heroMovie.poster_path
                ? `https://image.tmdb.org/t/p/original${heroMovie.poster_path}`
                : "/assets/imgs/placeholder-backdrop.jpg",
              poster: heroMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`
                : "/assets/imgs/placeholder.png",
            };
          } catch (err) {
            return {
              ...cat,
              movieCount: 0,
              backdrop: "/assets/imgs/placeholder-backdrop.jpg",
              poster: "/assets/imgs/placeholder.png",
            };
          }
        })
      );

      setCategories(enrichedCategories);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (key) => {
    navigate(`/explore?category=${key}`);
  };

  return (
    <div className="categories-page container py-5">
      {/* Hero Header */}
      <div className="text-center mb-5">
        <Title level={1} className="mb-3">
          Browse by <span style={{ color: "#e50914" }}>Vibe</span>
        </Title>
        <Text type="secondary" style={{ fontSize: "1.2rem" }}>
          Discover curated collections of movies tailored to your mood
        </Text>
      </div>

      {/* Categories Grid */}
      <Row gutter={[24, 32]}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={i}>
                <Skeleton.Node active style={{ width: "100%", height: 320 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 320,
                      background: "#f0f0f0",
                    }}
                  />
                </Skeleton.Node>
                <Skeleton paragraph={{ rows: 2 }} className="mt-3" active />
              </Col>
            ))
          : categories.map((category) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={category.key}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ height: "100%" }}
                >
                  <Card
                    hoverable
                    cover={
                      <div
                        className="category-card-cover"
                        style={{
                          height: 320,
                          backgroundImage: `linear-gradient(to bottom, rgba(20,20,20,0.3) 0%, rgba(20,20,20,0.8) 100%), url(${category.backdrop})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "20px",
                          borderRadius: "12px 12px 0 0",
                        }}
                      >
                        <div>
                          <Title level={3} style={{ color: "#fff", margin: 0 }}>
                            {category.label}
                          </Title>
                          <Space size="small" className="mt-2">
                            <Tag color="red" style={{ border: "none" }}>
                              {category.movieCount}+ Movies
                            </Tag>
                          </Space>
                        </div>
                      </div>
                    }
                    bodyStyle={{ padding: "16px", textAlign: "center" }}
                    style={{
                      height: "100%",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                    onClick={() => handleCategoryClick(category.key)}
                  >
                    <Text type="secondary">
                      Handpicked collection • Click to explore
                    </Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
      </Row>

      {categories.length === 0 && !loading && (
        <div className="text-center py-5">
          <Text type="secondary">No categories available at the moment.</Text>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
