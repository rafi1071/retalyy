import React, { useState, useEffect, lazy, Suspense } from 'react';
import { NavigationTab, ClientProfile, CalculatorInputs } from './types';
import { StartupSystemProvider } from './context/StartupSystemContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgress } from './components/ui/Motion';
import { updatePageSeo } from './utils/seoConfig';

// Code-split and lazy-load heavy sub-applications & views (Core Web Vitals Requirement 15)
const RetalyyCrmWorkspace = lazy(() => import('./crm/App').then(m => ({ default: m.RetalyyCrmWorkspace })));
const BusinessCrmWorkspace = lazy(() => import('./components/businessCrm/BusinessCrmWorkspace').then(m => ({ default: m.BusinessCrmWorkspace })));
const SolutionsView = lazy(() => import('./components/SolutionsView').then(m => ({ default: m.SolutionsView })));
const FirmsView = lazy(() => import('./components/FirmsView').then(m => ({ default: m.FirmsView })));
const TradesView = lazy(() => import('./components/TradesView').then(m => ({ default: m.TradesView })));
const CalculatorView = lazy(() => import('./components/CalculatorView').then(m => ({ default: m.CalculatorView })));
const VaultView = lazy(() => import('./components/VaultView').then(m => ({ default: m.VaultView })));
const MissionView = lazy(() => import('./components/MissionView').then(m => ({ default: m.MissionView })));
const FindingsView = lazy(() => import('./components/FindingsView').then(m => ({ default: m.FindingsView })));
const EducationView = lazy(() => import('./components/EducationView').then(m => ({ default: m.EducationView })));
const ContactView = lazy(() => import('./components/ContactView').then(m => ({ default: m.ContactView })));
const LegalView = lazy(() => import('./components/LegalView').then(m => ({ default: m.LegalView })));
const PortalView = lazy(() => import('./components/PortalView').then(m => ({ default: m.PortalView })));
const NotFoundView = lazy(() => import('./components/NotFoundView').then(m => ({ default: m.NotFoundView })));
const BookingModal = lazy(() => import('./components/BookingModal').then(m => ({ default: m.BookingModal })));

const TAB_TO_PATH: Record<NavigationTab, string> = {
  home: '/',
  solutions: '/solutions',
  firms: '/firms',
  trades: '/trades',
  calculator: '/calculator',
  mission: '/mission',
  findings: '/findings',
  education: '/education',
  contact: '/contact',
  legal: '/legal',
  portal: '/portal',
  workspace: '/workspace',
  business_crm: '/business_crm',
  vault: '/vault',
  '404': '/404'
};

const PATH_TO_TAB: Record<string, NavigationTab> = {
  '/': 'home',
  '/home': 'home',
  '/solutions': 'solutions',
  '/firms': 'firms',
  '/trades': 'trades',
  '/calculator': 'calculator',
  '/mission': 'mission',
  '/findings': 'findings',
  '/education': 'education',
  '/contact': 'contact',
  '/legal': 'legal',
  '/portal': 'portal',
  '/workspace': 'workspace',
  '/business_crm': 'business_crm',
  '/vault': 'vault',
  '/404': '404'
};

function resolveCurrentTab(): NavigationTab {
  if (typeof window === 'undefined') return 'home';

  // 1. Check clean pathname (strip trailing slash)
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (PATH_TO_TAB[path]) {
    return PATH_TO_TAB[path];
  }

  // 2. Check hash fallback for legacy links
  const hash = window.location.hash.replace(/^#/, '');
  if (hash && (PATH_TO_TAB[`/${hash}`] || PATH_TO_TAB[hash])) {
    return (PATH_TO_TAB[`/${hash}`] || PATH_TO_TAB[hash]);
  }

  // 3. Fallback to 404 if path is unknown
  return '404';
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => resolveCurrentTab());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRole, setBookingRole] = useState<'firm' | 'self_employed'>('self_employed');

  // Shared Client Profile state across views
  const [clientProfile, setClientProfile] = useState<ClientProfile>(() => {
    if (typeof localStorage === 'undefined') {
      return getInitialProfile();
    }
    const saved = localStorage.getItem('retalyy_client_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return getInitialProfile();
  });

  function getInitialProfile(): ClientProfile {
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
  }

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('retalyy_client_profile', JSON.stringify(clientProfile));
    }
  }, [clientProfile]);

  // Handle URL popstate & hash routing changes
  useEffect(() => {
    const handleLocationChange = () => {
      const tab = resolveCurrentTab();
      setActiveTab(tab);
      updatePageSeo(tab);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial SEO update
    updatePageSeo(activeTab);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    const targetPath = TAB_TO_PATH[tab] || '/';
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updatePageSeo(tab);
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

  const viewFallback = (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#27B665] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <StartupSystemProvider>
      <div className="min-h-screen flex flex-col bg-[#fafbfc] text-[#0C2B1C] selection:bg-[#27B665]/20 selection:text-[#0C2B1C] font-sans">
        
        {/* Startup Loading Screen */}
        {isLoading && (
          <LoadingScreen 
            onFinish={() => setIsLoading(false)} 
            duration={950} 
          />
        )}

        {activeTab !== 'workspace' && activeTab !== 'business_crm' && <ScrollProgress />}

        {/* Universal Top Bar */}
        {activeTab !== 'workspace' && activeTab !== 'business_crm' && (
          <Header
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('self_employed')}
          />
        )}

        {/* Main Content Area with Suspense boundary */}
        <main className="flex-1">
          <Suspense fallback={viewFallback}>
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

            {activeTab === 'firms' && (
              <FirmsView
                setActiveTab={handleTabChange}
                onOpenBooking={() => handleOpenBooking('firm')}
              />
            )}

            {activeTab === 'trades' && (
              <TradesView
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

            {activeTab === '404' && (
              <NotFoundView
                setActiveTab={handleTabChange}
              />
            )}
          </Suspense>
        </main>

        {/* Footer */}
        {activeTab !== 'workspace' && activeTab !== 'business_crm' && (
          <Footer
            setActiveTab={handleTabChange}
            onOpenBooking={() => handleOpenBooking('firm')}
            onTriggerLoading={() => setIsLoading(true)}
          />
        )}

        {/* Consultation Modal */}
        <Suspense fallback={null}>
          {isBookingOpen && (
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              defaultRole={bookingRole}
            />
          )}
        </Suspense>

      </div>
    </StartupSystemProvider>
  );
}
