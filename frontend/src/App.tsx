import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WaterDataProvider } from "./contexts/WaterDataContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { Authentication } from "./components/Authentication";
import { UserDatabase } from "./components/UserDatabase";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { EmergencyModal } from "./components/EmergencyModal";
import { DataMethodologyModal } from "./components/DataMethodologyModal";
import { SolutionsPage } from "./pages/SolutionsPage";
import { AlertsPage } from "./pages/AlertsPage";
import { LandingPage } from "./pages/LandingPage";

const AppContent: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState<"response" | "contacts">(
    "response"
  );
  const [selectedState, setSelectedState] = useState<string>("");
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAuthSuccess = () => {
    setAuthComplete(true);
  };

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsAppLoading(false);
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

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  // Show landing page if user is not logged in and hasn't started auth
  if (!currentUser && !authComplete) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication onSuccess={handleAuthSuccess} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  // Redirect admin users to admin dashboard
  if (currentUser && isAdmin) {
    return (
      <Router>
        <WaterDataProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
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
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserDatabase />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </WaterDataProvider>
      </Router>
    );
  }

  return (
    <Router>
      <WaterDataProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
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
              <Route path="/" element={<UserDashboard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
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
      </WaterDataProvider>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
