import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Skeleton, Breadcrumb, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCustomCategories,
  getMoviesFromAPI,
} from "../../actions/getMoviesFromAPI";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories and their movie counts
  const fetchCategoriesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const customCategories = getCustomCategories();

      const categoriesWithData = await Promise.all(
        customCategories.map(async (category) => {
          const { movies, totalResults } = await getMoviesFromAPI("", {
            category: category.key,
          });
          const representativeMovie = movies[0] || {};
          return {
            ...category,
            movieCount: totalResults,
            posterUrl:
              representativeMovie.posterUrl || "/assets/imgs/placeholder.png",
          };
        })
      );
      setCategories(categoriesWithData);
    } catch (error) {
      console.error("Error fetching categories data:", error);
      toast.error("Failed to load categories", {
        position: "top-right",
        autoClose: 2000,
      });
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  // Handle category click to navigate to movie list
  const handleCategoryClick = (categoryKey) => {
    navigate(`/movies?category=${categoryKey}`);
  };

  return (
    <div className="mn-main-content">
      {/* Breadcrumb */}
      <div className="mn-breadcrumb m-b-30">
        <div className="row">
          <div className="col-12">
            <div className="row gi_breadcrumb_inner">
              <div className="col-md-6 col-sm-12">
                <h2 className="mn-breadcrumb-title">Movie Categories</h2>
              </div>
              <div className="col-md-6 col-sm-12">
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <a href="/">Home</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Movie Categories</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xxl-12">
          <section className="mn-shop">
            <div className="row">
              {/* Sidebar (Optional: Can include genre filters) */}
              <div className="mn-shop-sidebar mn-filter-sidebar col-lg-3 col-md-12">
                <div id="shop_sidebar">
                  <div className="mn-sidebar-wrap">
                    <div className="mn-sidebar-block">
                      <div className="mn-sb-title">
                        <h3 className="mn-sidebar-title">Filters</h3>
                        <a href="javascript:void(0)" className="filter-close">
                          <i className="ri-close-large-line"></i>
                        </a>
                      </div>
                      <div className="mn-sb-block-content p-t-15">
                        <p>Genre filters can be added here (optional).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mn-shop-rightside col-md-12 m-t-991">
                {/* Shop Top */}
                <div className="mn-pro-list-top d-flex">
                  <div className="col-md-6 mn-grid-list">
                    <div className="mn-gl-btn">
                      <Button className="grid-btn filter-toggle-icon">
                        <i className="ri-filter-2-line"></i>
                      </Button>
                      <Button className="grid-btn btn-grid-50 active">
                        <i className="ri-gallery-view-2"></i>
                      </Button>
                    </div>
                  </div>
                  <div className="col-md-6 mn-sort-select">
                    <div className="mn-select-inner">
                      <select name="mn-select" id="mn-select">
                        <option selected disabled>
                          Sort by
                        </option>
                        <option value="name-asc">Name, A to Z</option>
                        <option value="name-desc">Name, Z to A</option>
                        <option value="count-desc">
                          Movie Count, High to Low
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category Cards */}
                <div className="shop-pro-content">
                  <div className="shop-pro-inner">
                    <Row gutter={[24, 24]}>
                      {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                          <Col
                            key={index}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="m-b-24 mn-product-box pro-gl-content"
                          >
                            <Skeleton active avatar paragraph={{ rows: 2 }} />
                          </Col>
                        ))
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <Col
                            key={category.key}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="m-b-24 mn-product-box pro-gl-content"
                          >
                            <Card
                              className="mn-product-card"
                              hoverable
                              cover={
                                <div className="mn-product-img">
                                  <div className="mn-img">
                                    <a
                                      href="javascript:void(0)"
                                      className="image"
                                      onClick={() =>
                                        handleCategoryClick(category.key)
                                      }
                                    >
                                      <img
                                        className="main-img"
                                        src={category.posterUrl}
                                        alt={category.label}
                                      />
                                    </a>
                                  </div>
                                </div>
                              }
                            >
                              <div className="mn-product-detail">
                                <h5>
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() =>
                                      handleCategoryClick(category.key)
                                    }
                                  >
                                    {category.label}
                                  </a>
                                </h5>
                                <p className="mn-info">
                                  {category.movieCount} movies
                                </p>
                              </div>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <Col span={24}>
                          <p>No categories available.</p>
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
