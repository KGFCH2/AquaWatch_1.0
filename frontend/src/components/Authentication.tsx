import React, { useState } from "react";
import { RoleSelection } from "./RoleSelection";
import { UserSignup } from "./UserSignup";
import { UserLogin } from "./UserLogin";
import { AdminLogin } from "./AdminLogin";
import { useAuth } from "../contexts/AuthContext";

type AuthStep = "role-selection" | "user-login" | "user-signup" | "admin-login";

interface AuthenticationProps {
  onSuccess: () => void;
}

export const Authentication: React.FC<AuthenticationProps> = ({
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("role-selection");
  const { demoLogin } = useAuth();

  const handleDemoLogin = async () => {
    try {
      await demoLogin();
      onSuccess();
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  const handleRoleSelection = (role: "user" | "admin") => {
    if (role === "user") {
      setCurrentStep("user-login");
    } else {
      setCurrentStep("admin-login");
    }
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep("role-selection");
  };

  const handleGoToSignup = () => {
    setCurrentStep("user-signup");
  };

  const handleBackToLogin = () => {
    setCurrentStep("user-login");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "role-selection":
        return (
          <RoleSelection
            onSelectRole={handleRoleSelection}
            onDemoLogin={handleDemoLogin}
          />
        );

      case "user-login":
        return (
          <UserLogin
            onBack={handleBackToRoleSelection}
            onSignup={handleGoToSignup}
            onSuccess={onSuccess}
          />
        );

      case "user-signup":
        return <UserSignup onBack={handleBackToLogin} onSuccess={onSuccess} />;

      case "admin-login":
        return (
          <AdminLogin
            onBack={handleBackToRoleSelection}
            onSuccess={onSuccess}
          />
        );

      default:
        return (
          <RoleSelection
            onSelectRole={handleRoleSelection}
            onDemoLogin={handleDemoLogin}
          />
        );
    }
  };

  return <>{renderCurrentStep()}</>;
};
