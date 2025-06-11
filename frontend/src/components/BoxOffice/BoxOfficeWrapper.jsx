// src/components/BoxOfficeWrapper.js
import React, { useState } from "react";
import { Button, Typography, Tabs } from "antd";
import RegisterAnalyst from "./RegisterAnalyst";
import BoxOfficePortal from "./BosOfficePortal";
import AnalystBlogs from "./AnalystBlogs";
import AddMovieRequest from "../Movie/MovieRequest";
import BoxOfficeLeaderboard from "./BoxOiffceLeadboard";
import PredictionGame from "./PredictionGame";
import BoxOfficeNewsroom from "./BoxOfficeNewsroom";
import BoxOfficeCharts from "./BoxOfficeCharts";
import AnalystSpotlight from "./AnalystSpotlight";
import BoxOfficeQuiz from "./BoxOfficeQuiz";

const { Title } = Typography;
const { TabPane } = Tabs;

const BoxOfficeWrapper = () => {
  const [isAnalystModalVisible, setIsAnalystModalVisible] = useState(false);
  const [isMovieRequestVisible, setIsMovieRequestVisible] = useState(false);
  const [isPredictionModalVisible, setIsPredictionModalVisible] =
    useState(false);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);

  return (
    <div className="container">
      <div className="hero">
        <Title level={1} style={{ color: "var(--text-primary)" }}>
          Box Office Central
        </Title>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Dive into movie performance data, predict box office hits, become an
          analyst, or test your knowledge with quizzes.
        </p>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-sm)",
          justifyContent: "center",
          margin: "var(--spacing-md) 0",
        }}
      >
        <Button
          className="button"
          onClick={() => setIsAnalystModalVisible(true)}
        >
          Register as Box Office Analyst
        </Button>
        <Button
          className="button button--secondary"
          onClick={() => setIsMovieRequestVisible(true)}
        >
          Suggest a Movie
        </Button>
        <Button
          className="button button--secondary"
          onClick={() => setIsPredictionModalVisible(true)}
        >
          Submit Prediction
        </Button>
        <Button
          className="button button--secondary"
          onClick={() => setIsQuizModalVisible(true)}
        >
          Take Quiz
        </Button>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Portal" key="1">
          <BoxOfficePortal />
        </TabPane>
        <TabPane tab="Leaderboard" key="2">
          <BoxOfficeLeaderboard />
        </TabPane>
        <TabPane tab="Charts" key="3">
          <BoxOfficeCharts />
        </TabPane>
        <TabPane tab="Newsroom" key="4">
          <BoxOfficeNewsroom />
        </TabPane>
        <TabPane tab="Blogs" key="5">
          <AnalystBlogs />
        </TabPane>
        <TabPane tab="Spotlight" key="6">
          <AnalystSpotlight />
        </TabPane>
      </Tabs>

      {/* Modals */}
      <RegisterAnalyst
        isVisible={isAnalystModalVisible}
        onClose={() => setIsAnalystModalVisible(false)}
      />
      <AddMovieRequest
        isVisible={isMovieRequestVisible}
        onClose={() => setIsMovieRequestVisible(false)}
      />
      <PredictionGame
        isVisible={isPredictionModalVisible}
        onClose={() => setIsPredictionModalVisible(false)}
      />
      <BoxOfficeQuiz
        isVisible={isQuizModalVisible}
        onClose={() => setIsQuizModalVisible(false)}
      />
    </div>
  );
};

export default BoxOfficeWrapper;
