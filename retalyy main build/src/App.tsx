import React, { useState, useEffect } from 'react';
import { NavigationTab, ClientProfile, CalculatorInputs } from './types';
import { StartupSystemProvider } from './context/StartupSystemContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { HomeView } from './components/HomeView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { RetalyyCrmWorkspace } from './crm/App';
import { BusinessCrmWorkspace } from './components/businessCrm/BusinessCrmWorkspace';
import { PortalView } from './components/PortalView';
import { MissionView } from './components/MissionView';
import { CalculatorView } from './components/CalculatorView';
import { VaultView } from './components/VaultView';
import { FirmsView } from './components/FirmsView';
import { FindingsView } from './components/FindingsView';
import { EducationView } from './components/EducationView';
import { ContactView } from './components/ContactView';
import { SolutionsView } from './components/SolutionsView';
import { LegalView } from './components/LegalView';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRole, setBookingRole] = useState<'firm' | 'self_employed'>('self_employed');

  // Shared Client Profile state across views
  const [clientProfile, setClientProfile] = useState<ClientProfile>(() => {
    const saved = localStorage.getItem('retalyy_client_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      id: 'cli-89214',
      fullName: 'Jordan Miller',
      email: 'jordan@cloudarchitecture.io',
      phone: '(415) 555-0199',
      businessName: 'Miller Cloud Systems LLC',
      dba: 'Miller Strategy Group',
      ein: '84-2918491',
      industryNaics: '541512',
      startDate: '2023-04-15',
      state: 'CA',
      ownerPayHistory: 'Schedule C draws only ($175k net)',
      priorYearReturnUploaded: true,
      priorYearFileName: '2025_Form_1040_Schedule_C.pdf',
      extractedNetProfit: 175000,
      consentSigned: true,
      consentTimestamp: 'Oct 12, 2026, 09:30 AM PST',
      consentSignatureText: 'Jordan Miller',
      engagementLetterSigned: true,
      assignedCpa: 'Marcus Vance, CPA, MST (License #89214-CA)'
    };
  });

  useEffect(() => {
    localStorage.setItem('retalyy_client_profile', JSON.stringify(clientProfile));
  }, [clientProfile]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as NavigationTab;
      if (['home', 'workspace', 'business_crm', 'portal', 'mission', 'calculator', 'vault', 'firms', 'findings', 'contact', 'education', 'legal'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (role: 'firm' | 'self_employed' = 'self_employed') => {
    setBookingRole(role);
    setIsBookingOpen(true);
  };

  const handleSaveToVault = (calcInputs: CalculatorInputs) => {
    setClientProfile(prev => ({
      ...prev,
      fullName: calcInputs.fullName || prev.fullName,
      email: calcInputs.email || prev.email,
      phone: calcInputs.phone || prev.phone,
      state: calcInputs.state,
      extractedNetProfit: calcInputs.netIncome
    }));
  };

  return (
    <StartupSystemProvider>
      <div className="min-h-screen flex flex-col bg-[#fafbfc] text-[#0C2B1C] selection:bg-[#27B665]/20 selection:text-[#0C2B1C] font-sans">
        
        {/* Retalyy Startup Loading Screen with Logo Animation */}
        {isLoading && (
          <LoadingScreen 
            onFinish={() => setIsLoading(false)} 
            duration={950} 
          />
        )}

        {/* Universal Top Bar (Hidden when in full CRM workspaces) */}
        {activeTab !== 'workspace' && activeTab !== 'business_crm' && (
          <Header
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'workspace' && (
            <RetalyyCrmWorkspace
              onBackToMarketing={() => handleTabChange('home')}
              onSwitchToBusinessCrm={() => handleTabChange('business_crm')}
            />
          )}

          {activeTab === 'business_crm' && (
            <BusinessCrmWorkspace
              onBackToMarketing={() => handleTabChange('home')}
              onSwitchToFirmCrm={() => handleTabChange('workspace')}
            />
          )}

          {activeTab === 'home' && (
            <HomeView
              setActiveTab={handleTabChange}
              onOpenBooking={() => handleOpenBooking('self_employed')}
            />
          )}

        {activeTab === 'solutions' && (
          <SolutionsView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {activeTab === 'portal' && (
          <PortalView
            setActiveTab={handleTabChange}
            clientProfile={clientProfile}
            setClientProfile={setClientProfile}
          />
        )}

        {activeTab === 'mission' && (
          <MissionView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
            onSaveToVault={handleSaveToVault}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            setActiveTab={handleTabChange}
            clientProfile={clientProfile}
            setClientProfile={setClientProfile}
          />
        )}

        {activeTab === 'firms' && (
          <FirmsView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('firm')}
          />
        )}

        {activeTab === 'findings' && (
          <FindingsView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {activeTab === 'education' && (
          <EducationView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {activeTab === 'legal' && (
          <LegalView
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}
      </main>

      {/* Editorial Compliant Footer (Hidden in CRM workspaces) */}
      {activeTab !== 'workspace' && activeTab !== 'business_crm' && (
        <Footer
          setActiveTab={handleTabChange}
          onOpenBooking={() => handleOpenBooking('firm')}
          onTriggerLoading={() => setIsLoading(true)}
        />
      )}

      {/* Consultation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultRole={bookingRole}
      />

      </div>
    </StartupSystemProvider>
  );
}
