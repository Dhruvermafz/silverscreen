import React, { useState } from "react";
import { Button, Collapse, Select, Typography } from "antd";
import { FaBook, FaLock, FaDownload, FaLanguage } from "react-icons/fa";

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const LegalInfo = ({ type = "terms" }) => {
  // State for language selection
  const [language, setLanguage] = useState("en");

  // Legal content for Terms and Privacy
  const content = {
    terms: {
      title: "Terms and Conditions",
      icon: <FaBook size={24} />,
      lastUpdated: "June 20, 2025",
      sections: [
        {
          key: "1",
          header: "Introduction",
          content: (
            <>
              <Paragraph>
                These Terms and Conditions ("Terms") govern your access to and
                use of <strong>DimeCine</strong>, a digital platform operated by{" "}
                <strong>ItsABlog Private Limited</strong>, a company
                incorporated under the laws of India, with its registered office
                at [Insert Registered Address], Mumbai, Maharashtra, India
                ("Company"). DimeCine enables users to engage in cinema-related
                activities, including but not limited to reviewing films,
                tracking box office performance, creating curated lists,
                participating in discussion groups, publishing blogs, and
                accessing editorial content.
              </Paragraph>
              <Paragraph>
                By accessing or using DimeCine, including its website, mobile
                applications, and associated services (collectively, the
                "Platform"), you agree to be bound by these Terms. If you do not
                agree to these Terms, you must refrain from using the Platform.
                These Terms apply to all users, including visitors, registered
                users, and contributors, across all Platform features, such as
                authentication pages, user profiles, film information pages,
                review sections, lists, tags, box office data, blogs, groups,
                newsrooms, moderation tools, notifications, and search
                functionalities.
              </Paragraph>
              <Paragraph>
                <strong>Eligibility</strong>: To use the Platform, you must be
                at least 13 years of age. Users under 18 years of age must
                obtain parental or legal guardian consent. By using the
                Platform, you represent and warrant that you meet these
                eligibility requirements.
              </Paragraph>
              <Paragraph>
                The Company reserves the right to modify these Terms at its sole
                discretion. Any modifications will be communicated via email,
                in-app notifications, or by posting on the Platform. Your
                continued use of the Platform following such modifications
                constitutes acceptance of the revised Terms.
              </Paragraph>
            </>
          ),
        },
        {
          key: "2",
          header: "User Roles and Obligations",
          content: (
            <>
              <Paragraph>
                The Platform designates distinct user roles, each with specific
                privileges and obligations:
              </Paragraph>
              <Paragraph>
                <strong>Viewer</strong>: Viewers may rate films, submit reviews,
                create watchlists, maintain favorites and diaries, participate
                in discussion groups, and comment on reviews or blogs. All
                content submitted by Viewers must be relevant to cinema and
                shall not include political, off-topic, or offensive material.
              </Paragraph>
              <Paragraph>
                <strong>Filmmaker</strong>: Filmmakers may upload short films or
                publish blogs in a designated mode. Filmmakers represent and
                warrant that they own or have obtained all necessary rights to
                the content uploaded and that such content complies with
                Platform guidelines. The upload of pirated, unauthorized, or
                infringing material is strictly prohibited.
              </Paragraph>
              <Paragraph>
                <strong>Reviewer</strong>: Users who submit four or more film
                reviews per month may qualify as Reviewers, subject to
                verification. Failure to maintain this activity level for 30
                consecutive days may result in reversion to Viewer status, with
                a seven-day prior notice. Reviewers may appeal such decisions
                through the Platform’s complaint resolution system, accessible
                via the designated reporting interface, for instance, in cases
                of limited film releases.
              </Paragraph>
              <Paragraph>
                <strong>Moderator</strong>: Moderators, whether for specific
                groups or the Platform generally, are responsible for enforcing
                rules, reviewing reported content, and managing user conduct.
                Moderators must act impartially and adhere to the Company’s
                moderation policies.
              </Paragraph>
              <Paragraph>
                <strong>General Obligations</strong>: All users shall refrain
                from posting or transmitting content that is unlawful,
                defamatory, obscene, threatening, or otherwise objectionable.
                The use of automated systems, such as bots, to interact with the
                Platform is prohibited without prior written consent from the
                Company. Misuse of reporting mechanisms or submission of false
                reports may result in penalties, including suspension or
                termination of access to the Platform.
              </Paragraph>
            </>
          ),
        },
        {
          key: "3",
          header: "Platform Features and Usage",
          content: (
            <>
              <Paragraph>
                The Platform offers a range of features, each subject to the
                following conditions:
              </Paragraph>
              <Paragraph>
                <strong>Authentication</strong>: Users must provide accurate and
                complete information during account registration and maintain
                the confidentiality of their login credentials. Unauthorized
                account access must be reported promptly to the Company. Users
                are responsible for all activities conducted under their
                accounts and must ensure secure logout on shared devices.
              </Paragraph>
              <Paragraph>
                <strong>User Profiles</strong>: User profiles may display
                publicly accessible information, such as biographies, reviews,
                and curated lists, unless configured as private. Users shall not
                impersonate others or provide misleading information in their
                profiles.
              </Paragraph>
              <Paragraph>
                <strong>Film Information</strong>: The Platform provides access
                to film details, including trailers, cast and crew information,
                streaming availability, and box office statistics. Such
                information is sourced from third-party providers and is
                provided for informational purposes only. The Company does not
                guarantee the accuracy or completeness of such data.
              </Paragraph>
              <Paragraph>
                <strong>Reviews</strong>: Reviews submitted by users must be
                original, relevant to the film, and comply with content
                guidelines. Users must appropriately designate spoilers. The
                Company reserves the right to remove reviews that violate these
                Terms.
              </Paragraph>
              <Paragraph>
                <strong>Lists</strong>: Users may create and share curated film
                lists. Lists must not contain prohibited content. The Company
                may feature select lists at its discretion, subject to editorial
                review.
              </Paragraph>
              <Paragraph>
                <strong>Box Office Data</strong>: Box office statistics and
                return-on-investment analyses are provided for informational
                purposes. Users may not reproduce, distribute, or sell such data
                without the Company’s express written consent.
              </Paragraph>
              <Paragraph>
                <strong>Blogs</strong>: Blogs must focus on cinema-related
                topics and adhere to content guidelines. Users retain ownership
                of their blogs but grant the Company a license to use such
                content as described in Section 4.
              </Paragraph>
              <Paragraph>
                <strong>Discussion Groups</strong>: Groups may be public or
                private, with members required to comply with group-specific
                rules. Group moderators may remove members or content for
                non-compliance. All group content remains subject to
                Platform-wide moderation.
              </Paragraph>
              <Paragraph>
                <strong>Newsrooms</strong>: Newsrooms feature editorially
                curated content. Only authorized editors may publish newsroom
                posts. Comments on newsroom content are subject to moderation.
              </Paragraph>
              <Paragraph>
                <strong>Moderation and Notifications</strong>: Users may report
                content or conduct that violates these Terms through the
                designated reporting interface. The Company will review reports
                and may issue warnings, remove content, or suspend users as
                deemed appropriate. Users will receive notifications regarding
                significant account activities, such as follows, comments, or
                moderation actions.
              </Paragraph>
              <Paragraph>
                <strong>Search and Tags</strong>: Search functionalities and
                user-generated tags must not be used to harass, defame, or spam.
                Misuse may result in restricted access to these features.
              </Paragraph>
            </>
          ),
        },
        {
          key: "4",
          header: "Content Ownership and Licensing",
          content: (
            <>
              <Paragraph>
                <strong>User Content</strong>: Users retain ownership of all
                content they create or upload, including reviews, blogs, lists,
                comments, and media such as short films. By submitting content
                to the Platform, you grant ItsABlog Private Limited a
                non-exclusive, royalty-free, worldwide, perpetual license to
                use, display, reproduce, distribute, and promote such content on
                the Platform and in related marketing materials.
              </Paragraph>
              <Paragraph>
                <strong>Platform Content</strong>: All intellectual property
                rights in the Platform’s design, logos, trademarks, and
                proprietary data, including but not limited to box office
                statistics, are owned by or licensed to ItsABlog Private
                Limited. Users may not copy, modify, distribute, or otherwise
                exploit Platform content without prior written consent.
              </Paragraph>
              <Paragraph>
                <strong>Content Removal</strong>: The Company reserves the right
                to remove any content that violates these Terms or is otherwise
                deemed inappropriate, including content that is unlawful,
                offensive, or infringing. Users may appeal content removal
                decisions through the Platform’s complaint resolution system.
              </Paragraph>
            </>
          ),
        },
        {
          key: "5",
          header: "Intellectual Property",
          content: (
            <>
              <Paragraph>
                Users shall respect the intellectual property rights of others
                and refrain from uploading, sharing, or distributing content
                that infringes upon any third party’s copyright, trademark, or
                other proprietary rights.
              </Paragraph>
              <Paragraph>
                In the event you believe your intellectual property rights have
                been infringed on the Platform, you may submit a claim through
                the designated reporting interface, providing evidence of
                ownership and details of the alleged infringement. The Company
                will promptly review such claims and take appropriate action,
                which may include removal of the infringing content and/or
                suspension of the responsible user’s account.
              </Paragraph>
            </>
          ),
        },
        {
          key: "6",
          header: "Account Termination",
          content: (
            <>
              <Paragraph>
                <strong>Voluntary Termination</strong>: Users may deactivate
                their accounts through the Platform’s settings interface.
                Deactivated accounts may retain certain data for a period of 30
                days to facilitate account recovery, after which data may be
                permanently deleted, subject to applicable laws.
              </Paragraph>
              <Paragraph>
                <strong>Involuntary Termination</strong>: The Company may
                suspend or terminate user accounts for repeated or severe
                violations of these Terms, including but not limited to posting
                prohibited content or engaging in abusive conduct. Affected
                users may appeal such decisions through the Platform’s complaint
                resolution system.
              </Paragraph>
            </>
          ),
        },
        {
          key: "7",
          header: "Governing Law and Dispute Resolution",
          content: (
            <>
              <Paragraph>
                <strong>Governing Law</strong>: These Terms shall be governed by
                and construed in accordance with the laws of the Republic of
                India, without regard to its conflict of law principles.
              </Paragraph>
              <Paragraph>
                <strong>Dispute Resolution</strong>: Any disputes arising out of
                or in connection with these Terms shall be resolved through
                arbitration in Mumbai, Maharashtra, India, in accordance with
                the Arbitration and Conciliation Act, 1996. The arbitration
                shall be conducted by a single arbitrator appointed by mutual
                agreement or, failing such agreement, by the Bombay High Court.
                The language of arbitration shall be English, and the
                arbitrator’s decision shall be final and binding.
                Notwithstanding the foregoing, either party may seek injunctive
                relief in the courts of Maharashtra for matters requiring urgent
                resolution.
              </Paragraph>
            </>
          ),
        },
        {
          key: "8",
          header: "Limitation of Liability",
          content: (
            <>
              <Paragraph>
                The Platform is provided on an “as-is” and “as-available” basis.
                To the fullest extent permitted by law, ItsABlog Private Limited
                disclaims all warranties, express or implied, regarding the
                Platform’s operation, availability, or accuracy of content,
                including third-party data such as box office statistics.
              </Paragraph>
              <Paragraph>
                The Company shall not be liable for any indirect, incidental,
                consequential, or punitive damages arising from or related to
                your use of the Platform, including but not limited to losses
                due to service interruptions, technical failures, or user
                actions such as sharing personal information in public forums.
                The Company’s aggregate liability, if any, shall not exceed INR
                10,000 or the amount paid by you for access to the Platform,
                whichever is lower.
              </Paragraph>
            </>
          ),
        },
        {
          key: "9",
          header: "Contact Information",
          content: (
            <Paragraph>
              For inquiries, complaints, or appeals regarding these Terms,
              please contact:
              <br />
              <strong>Email</strong>: support@DimeCine.in
              <br />
              <strong>Address</strong>: ItsABlog Private Limited, [Insert
              Registered Address], Mumbai, Maharashtra, India
              <br />
              Users may also utilize the Platform’s designated reporting
              interface for submitting appeals or complaints.
            </Paragraph>
          ),
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      icon: <FaLock size={24} />,
      lastUpdated: "June 20, 2025",
      sections: [
        {
          key: "1",
          header: "Introduction",
          content: (
            <>
              <Paragraph>
                This Privacy Policy governs the collection, use, storage, and
                disclosure of personal data by <strong>DimeCine</strong>, a
                platform operated by <strong>ItsABlog Private Limited</strong>,
                a company incorporated under the laws of India, with its
                registered office at [Insert Registered Address], Mumbai,
                Maharashtra, India ("Company"). The Company is committed to
                protecting your privacy and ensuring compliance with applicable
                data protection laws, including the General Data Protection
                Regulation (GDPR), the California Consumer Privacy Act (CCPA),
                and the Digital Personal Data Protection Act, 2023 (DPDP Act) of
                India.
              </Paragraph>
              <Paragraph>
                This Privacy Policy applies to all users of the Platform,
                including visitors, registered users, and contributors, and
                covers all features, such as authentication pages, user
                profiles, film information pages, review sections, lists, tags,
                box office data, blogs, groups, newsrooms, moderation tools,
                notifications, and search functionalities.
              </Paragraph>
            </>
          ),
        },
        {
          key: "2",
          header: "Information We Collect",
          content: (
            <>
              <Paragraph>
                <strong>Personal Information</strong>: When you create an
                account or update your profile, we collect information such as
                your username, email address, password, and optional details
                including biography, profile picture, and social media links. We
                also collect your selected role (e.g., Viewer, Filmmaker,
                Reviewer) and preferences, such as favorite genres or languages.
                If you use social login options, we may collect associated
                identifiers, such as OAuth tokens.
              </Paragraph>
              <Paragraph>
                <strong>User-Generated Content</strong>: We collect content you
                create or upload, including reviews, blogs, curated lists,
                comments, group posts, newsroom contributions, and tags
                associated with films or other content.
              </Paragraph>
              <Paragraph>
                <strong>Usage Information</strong>: We collect data about your
                interactions with the Platform, including films viewed, searches
                performed, groups joined, profiles followed, box office data
                accessed, and notifications viewed.
              </Paragraph>
              <Paragraph>
                <strong>Device and Technical Information</strong>: We collect
                information about the devices you use to access the Platform,
                including IP addresses, browser types, operating systems, and
                unique device identifiers. We also use cookies and similar
                technologies to facilitate authentication, analytics, and
                personalization.
              </Paragraph>
              <Paragraph>
                <strong>Moderation and Reporting Information</strong>: We
                collect data related to reports or complaints you submit through
                the Platform’s reporting interface, as well as actions taken by
                moderators in response to such reports.
              </Paragraph>
            </>
          ),
        },
        {
          key: "3",
          header: "Use of Information",
          content: (
            <>
              <Paragraph>
                <strong>Service Provision</strong>: We use your information to
                deliver and enhance Platform features, such as personalizing
                film recommendations, managing user roles, facilitating group
                interactions, enabling newsroom content, and sending
                notifications about account activities.
              </Paragraph>
              <Paragraph>
                <strong>Analytics and Improvement</strong>: We analyze usage
                patterns to improve the Platform’s functionality and user
                experience. Anonymized data, such as aggregated box office
                trends, may be used to enhance features or shared with partners
                for analytical purposes.
              </Paragraph>
              <Paragraph>
                <strong>Moderation and Compliance</strong>: We use information
                to enforce our Terms and Conditions, review reported content,
                and comply with legal obligations under applicable data
                protection laws.
              </Paragraph>
            </>
          ),
        },
        {
          key: "4",
          header: "Disclosure of Information",
          content: (
            <>
              <Paragraph>
                <strong>Service Providers</strong>: We may share your
                information with third-party service providers, such as cloud
                hosting services or analytics providers, to support Platform
                operations. Such providers are bound by contractual obligations
                to protect your data and use it solely for the purposes
                specified by the Company.
              </Paragraph>
              <Paragraph>
                <strong>Public Content</strong>: Content you submit, such as
                reviews, blogs, lists, group posts, and profile information, may
                be publicly visible unless configured as private through
                applicable settings. You are responsible for the information you
                choose to share publicly.
              </Paragraph>
              <Paragraph>
                <strong>Legal Obligations</strong>: We may disclose your
                information to comply with legal requirements, such as
                responding to court orders, subpoenas, or regulatory inquiries,
                or to protect the rights, property, or safety of the Company,
                its users, or the public.
              </Paragraph>
              <Paragraph>
                <strong>No Sale of Personal Data</strong>: The Company does not
                sell your personal data to third parties.
              </Paragraph>
            </>
          ),
        },
        {
          key: "5",
          header: "Data Security",
          content: (
            <>
              <Paragraph>
                We implement industry-standard security measures, including
                encryption, secure protocols, and access controls, to protect
                your personal data. Passwords are stored in hashed form, and we
                conduct regular security audits to maintain compliance with data
                protection standards.
              </Paragraph>
              <Paragraph>
                Notwithstanding these measures, no system is entirely secure.
                The Company shall not be liable for unauthorized access to your
                data resulting from circumstances beyond our reasonable control,
                such as breaches of your device or account credentials.
              </Paragraph>
            </>
          ),
        },
        {
          key: "6",
          header: "Your Rights",
          content: (
            <>
              <Paragraph>
                <strong>Access and Control</strong>: You may access, update, or
                delete your personal information through the Platform’s settings
                interface. Account deletion requests are processed promptly,
                with data retained for 30 days to facilitate recovery, subject
                to applicable laws.
              </Paragraph>
              <Paragraph>
                <strong>Data Protection Rights</strong>: Depending on your
                jurisdiction, you may have the following rights under GDPR,
                CCPA, DPDP Act, or other applicable laws: - Right to access a
                copy of your personal data. - Right to rectify inaccurate or
                incomplete data. - Right to request deletion of your data. -
                Right to data portability in a structured, commonly used format.
                - Right to object to or restrict certain data processing
                activities. - Right to opt out of personalized recommendations
                or analytics, including through cookie management. To exercise
                these rights, contact us at support@DimeCine.in or through the
                Platform’s reporting interface. We will respond within 30 days
                or as required by law.
              </Paragraph>
              <Paragraph>
                <strong>California Residents</strong>: Under the CCPA, you have
                the right to request information about the categories of
                personal data collected, the purposes of collection, and any
                third parties with whom data is shared. You may also request
                deletion of your data and opt out of data sales, which is not
                applicable as the Company does not sell personal data.
              </Paragraph>
              <Paragraph>
                <strong>Indian Residents</strong>: Under the DPDP Act, you may
                withdraw consent for data processing, request correction or
                erasure of your data, and file grievances regarding data
                handling. Contact us at support@DimeCine.in for such requests.
              </Paragraph>
            </>
          ),
        },
        {
          key: "7",
          header: "Data Retention",
          content: (
            <Paragraph>
              Personal data is retained for as long as your account remains
              active or as necessary to fulfill the purposes outlined in this
              Privacy Policy, including legal obligations. Inactive accounts may
              be deleted after 12 months of inactivity, with public content
              (e.g., reviews) potentially retained in anonymized form unless you
              request deletion. Technical and usage data is anonymized after six
              months, unless required for legal or operational purposes.
            </Paragraph>
          ),
        },
        {
          key: "8",
          header: "Cookies and Tracking Technologies",
          content: (
            <Paragraph>
              The Platform uses cookies and similar technologies to enable
              authentication, analyze usage, and personalize content. You may
              manage cookie preferences through your browser settings or the
              Platform’s settings interface. Third-party services, such as
              analytics providers, may also use cookies, subject to their
              respective privacy policies.
            </Paragraph>
          ),
        },
        {
          key: "9",
          header: "Contact Information",
          content: (
            <Paragraph>
              For questions, concerns, or requests regarding this Privacy Policy
              or your personal data, please contact:
              <br />
              <strong>Email</strong>: support@DimeCine.in
              <br />
              <strong>Address</strong>: ItsABlog Private Limited, [Insert
              Registered Address], Mumbai, Maharashtra, India
              <br />
              You may also submit data-related complaints through the Platform’s
              designated reporting interface.
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

  // Mock function for PDF download (replace with jsPDF in production)
  const handleDownloadPDF = () => {
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

  // Handle language change (fetch translations in production)
  const handleLanguageChange = (value) => {
    setLanguage(value);
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
          marginBottom: "10px",
        }}
      >
        {content[type].icon}
        <Title level={2}>{content[type].title}</Title>
      </div>
      <Paragraph style={{ color: "#888" }}>
        Last Updated: {content[type].lastUpdated}
      </Paragraph>

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

export default LegalInfo;
