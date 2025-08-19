// src/components/Onboarding/OnboardingFlow.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = (id) => {
    setUserId(id);
    setIsAuthenticated(true);
    setStep(2); // Move to WelcomeScreen after successful login/signup
  };

  const handleComplete = () => {
    navigate("/dashboard"); // Redirect to dashboard after onboarding
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 2 && isAuthenticated) {
        // Reset auth state to allow choosing Login/Signup again
        setIsAuthenticated(false);
        setUserId(null);
        setStep(1);
      } else if (step > 2) {
        setStep(step - 1);
      }
    }
  };

  const steps = [
    // Step 1: Choice between Login and Signup
    <div className="auth-choice text-center">
      <h3>Do you already have an account?</h3>
      <p className="mb-4">
        Sign in to continue or create a new account to join DimeCine.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn btn-primary"
          onClick={() => setStep(1.1)}
          aria-label="Go to Login"
        >
          Login
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => setStep(1.2)}
          aria-label="Go to Signup"
        >
          Sign Up
        </button>
      </div>
    </div>,
    // Step 1.1: Login
    <Login onNext={handleAuthSuccess} />,
    // Step 1.2: Signup
    <Signup onNext={handleAuthSuccess} />,
    // Step 2: WelcomeScreen
    <WelcomeScreen onNext={() => setStep(3)} />,
    // Step 3: RoleSelection
    <RoleSelection
      onNext={(selectedRole) => {
        setRole(selectedRole);
        setStep(4);
      }}
    />,
    // Step 4: PersonalizationQuestions
    <PersonalizationQuestions
      onNext={(prefs) => {
        setPreferences(prefs);
        setStep(5);
      }}
    />,
    // Step 5: FeatureIntroduction
    <FeatureIntroduction onNext={() => setStep(6)} />,
    // Step 6: ConfirmationScreen
    <ConfirmationScreen
      role={role}
      preferences={preferences}
      userId={userId}
      onComplete={handleComplete}
    />,
  ];

  // Map sub-steps to integer progress for ProgressBar
  const getProgressStep = () => {
    if (step <= 1.2) return 1; // Auth choice, Login, and Signup are all Step 1
    return Math.ceil(step) - 1; // Other steps map to 2, 3, 4, 5, 6
  };

  return (
    <div className="onboarding-container container my-5">
      <ProgressBar current={getProgressStep()} total={6} />
      {steps[step <= 1 ? 0 : step > 1.2 ? Math.ceil(step) - 1 : step - 0.9]}
      <div className="d-flex justify-content-between mt-3">
        {step > 1 && (
          <button
            className="btn btn-outline-secondary"
            onClick={handleBack}
            aria-label="Go back"
          >
            Back
          </button>
        )}
        {step === 1 && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
            aria-label="Skip onboarding"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
