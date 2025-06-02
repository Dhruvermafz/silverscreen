import React, { useState } from "react";
import { Button, Progress } from "antd";
import WelcomeScreen from "./WelcomeScreen";
import RoleSelection from "./RoleSelection";
import FeatureIntroduction from "./FeatureIntroduction";
import ConfirmationScreen from "./ConfirmationScreen";
import ProgressBar from "../Common/ProgressBar";
import PersonalizationQuestions from "./PersonalizationQuesitons";
const OnboardingFlow = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({});
  const [role, setRole] = useState("viewer");

  const steps = [
    <WelcomeScreen onNext={() => setStep(2)} />,
    <RoleSelection
      onNext={(selectedRole) => {
        setRole(selectedRole);
        setStep(3);
      }}
    />,
    <PersonalizationQuestions
      onNext={(prefs) => {
        setPreferences(prefs);
        setStep(4);
      }}
    />,
    <FeatureIntroduction onNext={() => setStep(5)} />,
    <ConfirmationScreen
      role={role}
      preferences={preferences}
      userId={userId}
      onComplete={onComplete}
    />,
  ];

  return (
    <div className="onboarding-container">
      <ProgressBar current={step} total={5} />
      {steps[step - 1]}
      {step > 1 && (
        <Button
          className="onboarding-back-button"
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>
      )}
    </div>
  );
};

export default OnboardingFlow;
