// src/components/Onboarding/WelcomeScreen.js
import React from "react";

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="welcome-screen text-center">
      <h2 className="mb-4">Welcome to DimeCine</h2>
      <p className="mb-4">
        Join a community where cinema is king. Track box office hits, write
        blogs, join cinephile groups, and share your love for films—without the
        noise of politics.
      </p>

      <button
        className="btn btn-primary mt-4"
        onClick={onNext}
        aria-label="Get started"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;
