import React, { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { CrisisOverview } from './components/CrisisOverview';
import { StateGrid } from './components/StateGrid';
import { Solutions } from './components/Solutions';
import { AlertsPanel } from './components/AlertsPanel';
import { Footer } from './components/Footer';
import { EmergencyModal } from './components/EmergencyModal';
import { DataMethodologyModal } from './components/DataMethodologyModal';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState<'response' | 'contacts'>('response');
  const [selectedState, setSelectedState] = useState<string>('');
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
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
      setEmergencyType('response');
      setShowEmergencyModal(true);
    };

    const handleEmergencyContacts = (event: CustomEvent) => {
      setEmergencyType('contacts');
      setSelectedState(event.detail.state);
      setShowEmergencyModal(true);
    };

    const handleNavigateToSolutions = (event: CustomEvent) => {
      setActiveTab('solutions');
      setSelectedState(event.detail.state);
    };

    const handleNavigateToTab = (event: CustomEvent) => {
      setActiveTab(event.detail.tab);
      setMobileMenuOpen(false);
      // Scroll to top when changing tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShowDataMethodology = () => {
      setShowMethodologyModal(true);
    };

    window.addEventListener('showEmergencyResponse', handleEmergencyResponse);
    window.addEventListener('showEmergencyContacts', handleEmergencyContacts as EventListener);
    window.addEventListener('navigateToSolutions', handleNavigateToSolutions as EventListener);
    window.addEventListener('navigateToTab', handleNavigateToTab as EventListener);
    window.addEventListener('showDataMethodology', handleShowDataMethodology);

    return () => {
      window.removeEventListener('showEmergencyResponse', handleEmergencyResponse);
      window.removeEventListener('showEmergencyContacts', handleEmergencyContacts as EventListener);
      window.removeEventListener('navigateToSolutions', handleNavigateToSolutions as EventListener);
      window.removeEventListener('navigateToTab', handleNavigateToTab as EventListener);
      window.removeEventListener('showDataMethodology', handleShowDataMethodology);
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        onMobileMenuToggle={handleMobileMenuToggle}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        mobileMenuOpen={mobileMenuOpen}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {activeTab === 'dashboard' && (
          <>
            <CrisisOverview />
            <StateGrid />
          </>
        )}
        
        {activeTab === 'solutions' && <Solutions />}
        
        {activeTab === 'alerts' && <AlertsPanel />}
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
  );
}

export default App;