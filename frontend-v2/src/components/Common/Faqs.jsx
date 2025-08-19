import React, { useState } from "react";

const Faqs = () => {
  // State to manage which accordion items are open (store indices or keys)
  const [openItems, setOpenItems] = useState({
    left: [1], // First item open in left column by default
    right: [6], // First item open in right column by default
  });

  // Toggle accordion item for a specific column (left or right)
  const toggleItem = (column, key) => {
    setOpenItems((prev) => ({
      ...prev,
      [column]: prev[column].includes(key)
        ? prev[column].filter((item) => item !== key)
        : [...prev[column], key],
    }));
  };

  return (
    <section className="mn-faq p-b-15">
      <div className="mn-title">
        <h2>
          Frequently Asked <span>Questions</span>
        </h2>
        <p>Find answers to common questions about using DimeCine.</p>
      </div>
      <div className="row">
        {/* Left Column */}
        <div className="col-lg-6">
          <div className="mn-accordion style-1">
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("left", 1)}
                style={{ cursor: "pointer" }}
              >
                What is DimeCine?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.left.includes(1) ? "show" : ""
                }`}
              >
                DimeCine is a platform for movie lovers to discover, review, and
                share films. You can create personalized movie lists, rate
                movies, write reviews, and connect with a community of
                cinephiles to explore trending, now-playing, and top-rated
                films.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("left", 2)}
                style={{ cursor: "pointer" }}
              >
                How do I create a movie list?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.left.includes(2) ? "show" : ""
                }`}
              >
                After signing up for a DimeCine account, navigate to your
                profile and select "Create List." Add movies by searching or
                browsing our database, then save and share your list with the
                community. You can make lists public or private.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("left", 3)}
                style={{ cursor: "pointer" }}
              >
                Can I write reviews for movies?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.left.includes(3) ? "show" : ""
                }`}
              >
                Yes! Once logged in, visit a movie’s page and click “Write a
                Review.” Share your thoughts, rate the movie, and engage with
                other users’ reviews. All reviews must follow our community
                guidelines to ensure respectful and meaningful discussions.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("left", 4)}
                style={{ cursor: "pointer" }}
              >
                Is DimeCine free to use?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.left.includes(4) ? "show" : ""
                }`}
              >
                DimeCine offers a free tier with access to core features like
                browsing movies, creating lists, and writing reviews. Some
                advanced features may require a premium subscription, which you
                can explore in your account settings.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("left", 5)}
                style={{ cursor: "pointer" }}
              >
                How do I discover new movies?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.left.includes(5) ? "show" : ""
                }`}
              >
                Use our homepage carousels to explore trending, now-playing, and
                top-rated movies. You can also filter by genre, year, or mood
                using the “Moodboard” feature. Follow other users to see their
                lists and recommendations for personalized suggestions.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-6 m-t-991">
          <div className="mn-accordion style-1">
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("right", 6)}
                style={{ cursor: "pointer" }}
              >
                How do I join the DimeCine community?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.right.includes(6) ? "show" : ""
                }`}
              >
                Sign up for a free DimeCine account to join our community. Once
                registered, you can follow other users, comment on reviews, and
                share your movie lists. Engage respectfully to connect with
                fellow movie lovers!
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("right", 7)}
                style={{ cursor: "pointer" }}
              >
                What are the community guidelines?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.right.includes(7) ? "show" : ""
                }`}
              >
                Our community thrives on respect and passion for movies. Avoid
                posting offensive, harassing, or spammy content. Reviews and
                comments should be constructive and relevant. Violations may
                lead to content removal or account suspension.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("right", 8)}
                style={{ cursor: "pointer" }}
              >
                Can I edit or delete my reviews?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.right.includes(8) ? "show" : ""
                }`}
              >
                Yes, you can edit or delete your reviews from your profile’s “My
                Reviews” section. Edited reviews will reflect the updated
                content, and deleted reviews will be removed from the platform.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("right", 9)}
                style={{ cursor: "pointer" }}
              >
                How is movie data sourced?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.right.includes(9) ? "show" : ""
                }`}
              >
                DimeCine uses third-party APIs (e.g., TMDB) to provide movie
                data, including titles, posters, and descriptions. We strive to
                ensure accuracy but are not responsible for errors in
                third-party content.
              </div>
            </div>
            <div className="mn-accordion-item">
              <h4
                className="mn-accordion-header"
                onClick={() => toggleItem("right", 10)}
                style={{ cursor: "pointer" }}
              >
                How do I contact support?
              </h4>
              <div
                className={`mn-accordion-body ${
                  openItems.right.includes(10) ? "show" : ""
                }`}
              >
                For help, email us at support@dimecine.com or visit our Contact
                page. Our team is here to assist with account issues, technical
                problems, or questions about using DimeCine.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
