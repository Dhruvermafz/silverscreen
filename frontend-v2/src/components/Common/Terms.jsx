import React from "react";
import { Typography, Row, Col, Card } from "antd";

const { Title, Paragraph } = Typography;

const Terms = () => {
  return (
    <section className="mn-terms-conditions p-b-15">
      <div className="mn-title">
        <Title level={2}>
          <span>Terms</span> & Conditions
        </Title>
        <Paragraph style={{ fontSize: "16px", color: "#666" }}>
          Understand the rules and guidelines for using DimeCine’s platform.
        </Paragraph>
      </div>
      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col lg={12} md={24} xs={24}>
          <div className="mn-common-wrapper">
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  Welcome to DimeCine
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  These Terms and Conditions ("Terms") govern your use of
                  DimeCine, a platform for discovering, reviewing, and sharing
                  movies. By accessing or using DimeCine, you agree to be bound
                  by these Terms. If you do not agree, please do not use our
                  services.
                </Paragraph>
              </div>
            </Card>
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  User Accounts
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  To access certain features (e.g., creating movie lists,
                  writing reviews), you must create a DimeCine account. You are
                  responsible for maintaining the confidentiality of your
                  account credentials and for all activities under your account.
                  You agree to provide accurate information and notify us of any
                  unauthorized use.
                </Paragraph>
              </div>
            </Card>
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  User-Generated Content
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  By submitting reviews, ratings, or movie lists, you grant
                  DimeCine a non-exclusive, worldwide, royalty-free license to
                  use, display, and distribute your content on our platform. You
                  are responsible for ensuring your content does not violate
                  intellectual property rights or contain harmful, offensive, or
                  illegal material.
                </Paragraph>
              </div>
            </Card>
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  Community Guidelines
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  DimeCine is a community for movie lovers. You agree to engage
                  respectfully, avoiding harassment, hate speech, or
                  inappropriate content. We reserve the right to remove content
                  or suspend accounts that violate these guidelines.
                </Paragraph>
              </div>
            </Card>
          </div>
        </Col>

        {/* Right Column */}
        <Col lg={12} md={24} xs={24} className="m-t-991">
          <div className="mn-common-wrapper">
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  Intellectual Property
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  All content on DimeCine, including movie data, logos, and
                  designs, is owned by DimeCine or its licensors. You may not
                  reproduce, distribute, or modify our content without prior
                  written permission, except for personal, non-commercial use.
                </Paragraph>
              </div>
            </Card>
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  Acceptable Use
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  You may not use DimeCine to engage in illegal activities,
                  spam, or activities that harm the platform’s functionality or
                  security. This includes unauthorized scraping of movie data,
                  posting malicious links, or attempting to access restricted
                  areas of the platform.
                </Paragraph>
              </div>
            </Card>
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  Third-Party Content
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  DimeCine may display movie data or links from third-party
                  sources (e.g., TMDB). We are not responsible for the accuracy
                  or availability of third-party content. Your interactions with
                  third-party services are subject to their terms.
                </Paragraph>
              </div>
            </Card>
            <Card className="mn-cmn-block" bordered={false}>
              <div className="mn-cmn-block-inner">
                <Title level={5} className="mn-cmn-block-title">
                  Termination and Changes
                </Title>
                <Paragraph style={{ fontSize: "16px" }}>
                  We may suspend or terminate your access to DimeCine for
                  violating these Terms or for any other reason at our
                  discretion. We reserve the right to modify these Terms at any
                  time, with updates posted on this page. Continued use after
                  changes constitutes acceptance of the new Terms.
                </Paragraph>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default Terms;
