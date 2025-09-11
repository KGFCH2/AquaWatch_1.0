import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { EmergencyModal } from "./components/EmergencyModal";
import { DataMethodologyModal } from "./components/DataMethodologyModal";
import { HomePage } from "./pages/HomePage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { AlertsPage } from "./pages/AlertsPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState<"response" | "contacts">(
    "response"
  );
  const [selectedState, setSelectedState] = useState<string>("");
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleEmergencyResponse = () => {
      setEmergencyType("response");
      setShowEmergencyModal(true);
    };

    const handleEmergencyContacts = (event: CustomEvent) => {
      setEmergencyType("contacts");
      setSelectedState(event.detail.state);
      setShowEmergencyModal(true);
    };

    const handleShowDataMethodology = () => {
      setShowMethodologyModal(true);
    };

    window.addEventListener("showEmergencyResponse", handleEmergencyResponse);
    window.addEventListener(
      "showEmergencyContacts",
      handleEmergencyContacts as EventListener
    );
    window.addEventListener("showDataMethodology", handleShowDataMethodology);

    return () => {
      window.removeEventListener(
        "showEmergencyResponse",
        handleEmergencyResponse
      );
      window.removeEventListener(
        "showEmergencyContacts",
        handleEmergencyContacts as EventListener
      );
      window.removeEventListener(
        "showDataMethodology",
        handleShowDataMethodology
      );
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header
          onMobileMenuToggle={handleMobileMenuToggle}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          role="main"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        {showEmergencyModal && (
          <EmergencyModal
            type={emergencyType}
            state={selectedState}
            onClose={() => setShowEmergencyModal(false)}
          />
        )}

        {showMethodologyModal && (
          <DataMethodologyModal
            onClose={() => setShowMethodologyModal(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
