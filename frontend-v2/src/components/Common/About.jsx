import React from "react";
import { Typography, Row, Col } from "antd";
import about from "../../assets/img/common/about.jpeg";
import about2 from "../../assets/img/common/about-2.avif";
import about3 from "../../assets/img/common/about-3.webp";
import about4 from "../../assets/img/common/about-4.jpeg";
const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <section className="mn-about p-b-15">
      <Row gutter={[16, 16]}>
        {/* Left Column: Images */}
        <Col lg={12} md={24} xs={24}>
          <div className="mn-about-img">
            <img
              src={about}
              className="v-img"
              alt="DimeCine community"
              onError={(e) => (e.target.src = "/assets/imgs/placeholder.png")}
            />
            <img
              src={about2}
              className="h-img"
              alt="Movie discovery"
              onError={(e) => (e.target.src = "/assets/imgs/placeholder.png")}
            />
            <img
              src={about3}
              className="h-img"
              alt="Movie reviews"
              onError={(e) => (e.target.src = "/assets/imgs/placeholder.png")}
            />
            <img
              src={about4}
              className="h-img"
              alt="Personalized lists"
              onError={(e) => (e.target.src = "/assets/imgs/placeholder.png")}
            />
          </div>
        </Col>

        {/* Right Column: Text Content */}
        <Col lg={12} md={24} xs={24}>
          <div className="mn-about-detail">
            <div className="section-title m-t-991">
              <Title level={2}>
                Who We <span>Are?</span>
              </Title>
              <Paragraph style={{ fontSize: "16px" }}>
                DimeCine is your go-to platform for discovering, reviewing, and
                sharing your love for movies. We’re passionate about connecting
                film enthusiasts with the cinematic experiences that matter most
                to them.
              </Paragraph>
            </div>
            <Paragraph style={{ fontSize: "16px" }}>
              At DimeCine, we believe every movie tells a story, and every
              viewer has a unique perspective to share. Whether you’re a fan of
              blockbuster hits, indie gems, or timeless classics, our platform
              empowers you to rate films, write reviews, and create personalized
              watchlists that reflect your cinematic journey.
            </Paragraph>
            <Paragraph style={{ fontSize: "16px" }}>
              Our community thrives on connection. Join thousands of movie
              lovers to discuss your favorite films, discover hidden
              masterpieces, and curate lists that inspire others. From casual
              viewers to dedicated cinephiles, DimeCine is where your passion
              for movies finds a home.
            </Paragraph>
            <Paragraph strong style={{ fontSize: "16px" }}>
              Because every movie deserves its audience, and every viewer has a
              story to tell.
            </Paragraph>

            {/* Additional Features Section */}
            <div className="mn-features" style={{ marginTop: "20px" }}>
              <Title level={4}>Why Choose DimeCine?</Title>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Discover Movies:</strong> Explore trending,
                  now-playing, and top-rated films with personalized
                  recommendations.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Create Lists:</strong> Build and share custom movie
                  lists for every mood, genre, or occasion.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Write Reviews:</strong> Share your thoughts and
                  insights to influence the DimeCine community.
                </li>
                <li>
                  <strong>Join the Community:</strong> Connect with fellow film
                  fans to discuss, debate, and celebrate cinema.
                </li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default About;
