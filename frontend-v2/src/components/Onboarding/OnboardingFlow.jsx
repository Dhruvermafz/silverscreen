// src/components/Onboarding/OnboardingFlow.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Auth/Login";
import WelcomeScreen from "./WelcomeScreen";
import RoleSelection from "./RoleSelection";
import PersonalizationQuestions from "./PersonalizationQuestions";
import FeatureIntroduction from "./FeatureIntroduction";
import ConfirmationScreen from "./ConfirmationScreen";
import ProgressBar from "./ProgressBar";
const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [role, setRole] = useState("viewer");
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate("/dashboard"); // Redirect to dashboard after onboarding
  };

  const steps = [
    <Login
      onNext={(id) => {
        setUserId(id);
        setStep(2);
      }}
    />,
    <WelcomeScreen onNext={() => setStep(3)} />,
    <RoleSelection
      onNext={(selectedRole) => {
        setRole(selectedRole);
        setStep(4);
      }}
    />,
    <PersonalizationQuestions
      onNext={(prefs) => {
        setPreferences(prefs);
        setStep(5);
      }}
    />,
    <FeatureIntroduction onNext={() => setStep(6)} />,
    <ConfirmationScreen
      role={role}
      preferences={preferences}
      userId={userId}
      onComplete={handleComplete}
    />,
  ];

  return (
    <div className="onboarding-container container my-5">
      <ProgressBar current={step} total={6} />
      {steps[step - 1]}
      {step > 1 && (
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => setStep(step - 1)}
          aria-label="Go back"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default OnboardingFlow;
