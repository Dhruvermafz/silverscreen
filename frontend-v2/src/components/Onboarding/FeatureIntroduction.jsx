// src/components/Onboarding/FeatureIntroduction.js
import React from "react";

const FeatureIntroduction = ({ onNext }) => {
  const features = [
    {
      title: "Box Office Portal",
      description:
        "Track real-time box office collections and compare films like ‘Jawan’ vs. ‘Animal’.",
      image: "/assets/box-office.jpg",
    },
    {
      title: "Smart Lists",
      description:
        "Create lists like ‘Best 90s Bollywood’ or tag films with moods like ‘heartwarming.’",
      image: "/assets/lists.jpg",
    },
    {
      title: "Groups & Community",
      description:
        "Join groups like ‘Tamil Cinema Fans’ or discuss films with other cinephiles.",
      image: "/assets/groups.jpg",
    },
    {
      title: "Movie Discovery",
      description:
        "Discover new releases, filter by genres, and read reviews from the community.",
      image: "/assets/movies.jpg",
    },
  ];

  return (
    <div className="feature-introduction text-center">
      <h3 className="mb-4">Discover DimeCine</h3>
      <div
        id="featureCarousel"
        className="carousel slide"
        data-bs-ride="false" // Disable auto-play
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          {features.map((f, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img
                src={f.image}
                className="d-block w-100"
                alt={f.title}
                onError={(e) => (e.target.src = "/assets/fallback.jpg")} // Fallback image
              />
              <div className="carousel-caption d-none d-md-block">
                <h4>{f.title}</h4>
                <p>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#featureCarousel"
          data-bs-slide="prev"
          aria-label="Previous feature"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#featureCarousel"
          data-bs-slide="next"
          aria-label="Next feature"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>
      <button
        className="btn btn-primary mt-4"
        onClick={onNext}
        aria-label="Explore now"
      >
        Explore Now
      </button>
    </div>
  );
};

export default FeatureIntroduction;
