import React, { useState } from "react";
import { Button, Collapse, Select, Typography } from "antd";
import { FaBook, FaLock, FaDownload, FaLanguage } from "react-icons/fa";

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const TermsAndPrivacy = ({ type = "terms" }) => {
  // State for language selection
  const [language, setLanguage] = useState("en");

  // Content based on type (terms or privacy)
  const content = {
    terms: {
      title: "Terms and Conditions",
      icon: <FaBook size={24} />,
      sections: [
        {
          key: "1",
          header: "Introduction",
          content: (
            <>
              <Paragraph>
                Welcome to [App Name], a sanctuary for cinema lovers to review
                films, track box office data, join groups, and write blogs. By
                using our app, you agree to these Terms and Conditions, which
                govern your access and interaction with our services.
              </Paragraph>
              <Paragraph>
                These terms apply to all users, including Viewers, Filmmakers,
                and Reviewers. We reserve the right to update these terms with
                notice via email or in-app notification.
              </Paragraph>
            </>
          ),
        },
        {
          key: "2",
          header: "User Roles & Responsibilities",
          content: (
            <>
              <Paragraph>
                <strong>Viewer:</strong> Rate, review, create lists, and join
                groups. Keep content cinema-focused—no political or off-topic
                posts.
              </Paragraph>
              <Paragraph>
                <strong>Filmmaker:</strong> Upload short films or blogs in
                Filmmaker Mode. You must own rights to uploaded content.
              </Paragraph>
              <Paragraph>
                <strong>Reviewer:</strong> Earned by posting 4+ film reviews
                monthly. Inactivity may lead to downgrade after a 7-day warning.
                Use <code>/flags/add</code> in the CineNotes Complaint Flag
                System to appeal (e.g., no releases in a month).
              </Paragraph>
            </>
          ),
        },
        {
          key: "3",
          header: "CineNotes Complaint Flag System",
          content: (
            <Paragraph>
              Submit flags at <code>/flags/add</code> to appeal Reviewer status
              or report issues. False submissions may lead to penalties.
              Decisions are final but can be re-appealed after 30 days.
            </Paragraph>
          ),
        },
        {
          key: "4",
          header: "Content Ownership",
          content: (
            <Paragraph>
              You retain ownership of reviews, blogs, and uploaded content. By
              posting, you grant [App Name] a non-exclusive, royalty-free
              license to display content within the app. We may remove
              inappropriate material.
            </Paragraph>
          ),
        },
        {
          key: "5",
          header: "Governing Law",
          content: (
            <Paragraph>
              These terms are governed by the laws of India. Disputes will be
              resolved via arbitration or local courts in Maharashtra.
            </Paragraph>
          ),
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      icon: <FaLock size={24} />,
      sections: [
        {
          key: "1",
          header: "Introduction",
          content: (
            <>
              <Paragraph>
                At [App Name], we value your privacy and are committed to
                protecting your personal data. This Privacy Policy explains how
                we collect, use, and safeguard your information while you enjoy
                our cinema-focused platform.
              </Paragraph>
              <Paragraph>
                We comply with GDPR, CCPA, and India’s DPDP Act.
              </Paragraph>
            </>
          ),
        },
        {
          key: "2",
          header: "Data We Collect",
          content: (
            <>
              <Paragraph>
                <strong>Personal Information:</strong> Name, email, and optional
                profile details (e.g., bio, picture) during sign-up. Role
                (Viewer, Filmmaker, Reviewer) and preferences (genres,
                languages).
              </Paragraph>
              <Paragraph>
                <strong>Usage Data:</strong> Reviews, blogs, lists, group
                interactions, and box office portal views.
              </Paragraph>
              <Paragraph>
                <strong>Device Data:</strong> IP address, browser type, and
                device info for analytics.
              </Paragraph>
            </>
          ),
        },
        {
          key: "3",
          header: "How We Use Data",
          content: (
            <Paragraph>
              To personalize your experience (e.g., recommend Bollywood films),
              manage Reviewer status via the CineNotes Complaint Flag System,
              and improve app features. We may share anonymized data with
              partners (e.g., box office analytics).
            </Paragraph>
          ),
        },
        {
          key: "4",
          header: "Data Sharing & Security",
          content: (
            <>
              <Paragraph>
                We don’t sell your data. It may be shared with service providers
                (e.g., AWS for hosting) under strict agreements.
              </Paragraph>
              <Paragraph>
                We use encryption and secure protocols to protect your data.
                However, no system is 100% secure.
              </Paragraph>
            </>
          ),
        },
        {
          key: "5",
          header: "Your Rights",
          content: (
            <Paragraph>
              You can access, update, or delete your data via settings. Contact
              support@[appname].com for GDPR/CCPA requests. We respond within 30
              days.
            </Paragraph>
          ),
        },
      ],
    },
  };

  // Validate type prop
  if (!content[type]) {
    console.warn(`Invalid type prop: ${type}. Expected 'terms' or 'privacy'.`);
    return (
      <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
        <Title level={2}>Error</Title>
        <Paragraph>
          Invalid page type. Please select either Terms and Conditions or
          Privacy Policy.
        </Paragraph>
      </div>
    );
  }

  // Mock function for PDF download
  const handleDownloadPDF = () => {
    // Replace with actual PDF generation (e.g., jsPDF)
    alert(
      `Downloading ${
        type === "terms" ? "Terms and Conditions" : "Privacy Policy"
      } as PDF`
    );
  };

  // Language options
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
  ];

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
    // In a real app, fetch translated content from a backend or JSON
    alert(`Language switched to ${value}`);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {content[type].icon}
        <Title level={2}>{content[type].title}</Title>
      </div>

      {/* Language Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <FaLanguage size={20} />
        <Select
          defaultValue={language}
          style={{ width: 120 }}
          onChange={handleLanguageChange}
        >
          {languageOptions.map((lang) => (
            <Option key={lang.value} value={lang.value}>
              {lang.label}
            </Option>
          ))}
        </Select>
      </div>

      {/* Collapsible Sections */}
      <Collapse accordion>
        {content[type].sections.map((section) => (
          <Panel header={section.header} key={section.key}>
            {section.content}
          </Panel>
        ))}
      </Collapse>

      {/* Download PDF Button */}
      <Button
        type="primary"
        icon={<FaDownload />}
        style={{ marginTop: "20px" }}
        onClick={handleDownloadPDF}
      >
        Download as PDF
      </Button>
    </div>
  );
};

export default TermsAndPrivacy;
