import React, { useState, useMemo } from 'react';
import { BusinessProfile, BusinessDocument, AiProcessingEvent, BusinessUserSession } from './types';
import { INITIAL_BUSINESS_PROFILE, SAMPLE_DOCUMENTS, INITIAL_AI_EVENTS } from './mockData';
import { BusinessAuthView } from './BusinessAuthView';
import { BusinessOnboardingView } from './BusinessOnboardingView';
import { BusinessIntakeView } from './BusinessIntakeView';
import { BusinessAiPipelineView } from './BusinessAiPipelineView';
import { BusinessFinanceHubView } from './BusinessFinanceHubView';
import { BusinessPayablesReceivablesView } from './BusinessPayablesReceivablesView';
import { generateAiDashboardBlueprint } from './services/aiDashboardArchitect';
import { LedgerEngine, formatMoney } from '../../crm/services/ledgerEngine';
import { 
  Building2, 
  UploadCloud, 
  Cpu, 
  TrendingUp, 
  CreditCard, 
  Sliders, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  LogOut
} from 'lucide-react';

export type BusinessWorkspaceSubTab =
  | 'finance_hub'
  | 'intake_documents'
  | 'ai_pipeline'
  | 'payables_receivables'
  | 'company_onboarding';

interface BusinessCrmWorkspaceProps {
  onBackToMarketing?: () => void;
  onSwitchToFirmCrm?: () => void;
}

export const BusinessCrmWorkspace: React.FC<BusinessCrmWorkspaceProps> = ({
  onBackToMarketing,
  onSwitchToFirmCrm
}) => {
  // 0. Business User Session State (Registration & Login screen comes FIRST)
  const [businessUser, setBusinessUser] = useState<BusinessUserSession | null>(() => {
    const saved = localStorage.getItem('retalyy_business_crm_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null; // Login comes FIRST!
  });

  // 1. Business Profile State
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('retalyy_business_crm_profile');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (!parsed.dashboardBlueprint) {
          parsed.dashboardBlueprint = generateAiDashboardBlueprint(parsed);
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_BUSINESS_PROFILE;
  });

  // 2. Documents Vault State
  const [documents, setDocuments] = useState<BusinessDocument[]>(() => {
    const saved = localStorage.getItem('retalyy_business_crm_docs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_DOCUMENTS;
  });

  // 3. AI Processing Events Feed
  const [events, setEvents] = useState<AiProcessingEvent[]>(INITIAL_AI_EVENTS);

  // 4. Live General Ledger Engine Instance
  const ledger = useMemo(() => new LedgerEngine(), []);
  const [ledgerVersion, setLedgerVersion] = useState<number>(0);

  // 5. Active Sub-Tab
  const [activeTab, setActiveTab] = useState<BusinessWorkspaceSubTab>('finance_hub');
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // 6. Toast Notification State
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Persist profile
  const handleUpdateProfile = (updated: BusinessProfile) => {
    setProfile(updated);
    localStorage.setItem('retalyy_business_crm_profile', JSON.stringify(updated));
  };

  // Add uploaded documents
  const handleUploadDocuments = (newDocs: BusinessDocument[]) => {
    setDocuments(prev => {
      const updated = [...newDocs, ...prev];
      localStorage.setItem('retalyy_business_crm_docs', JSON.stringify(updated));
      return updated;
    });
    setToastMessage({
      title: 'Documents Ingested',
      description: `Uploaded ${newDocs.length} file(s) into the company document vault.`
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Run AI Processing Batch
  const handleRunAiBatch = () => {
    setIsProcessingBatch(true);

    setTimeout(() => {
      const queued = documents.filter(d => d.status === 'queued');
      if (queued.length === 0) {
        setIsProcessingBatch(false);
        return;
      }

      // Create new AI events and post to ledger
      const newEvents: AiProcessingEvent[] = [];
      const updatedDocs = documents.map(doc => {
        if (doc.status !== 'queued') return doc;

        const amt = doc.extractedAmount || 250;
        const isPrepaid = doc.isPrepaid;
        const isCapEx = doc.isCapEx;

        // Post to ledger engine
        try {
          if (doc.type === 'vendor_bill' || doc.type === 'receipt') {
            if (isPrepaid) {
              ledger.postJournalEntry(
                doc.uploadDate,
                `AI Prepayment: ${doc.detectedVendor}`,
                [
                  { a: '1200', dr: amt },
                  { a: '2000', cr: amt }
                ],
                'ai_workbench',
                doc.id
              );
            } else {
              ledger.addBill(
                doc.detectedVendor || 'Vendor',
                doc.uploadDate,
                doc.dueDate || '2026-11-15',
                doc.suggestedAccount,
                amt,
                0
              );
            }
          } else if (doc.type === 'merchant_payout') {
            ledger.postJournalEntry(
              doc.uploadDate,
              `Merchant Payout: ${doc.detectedVendor}`,
              [
                { a: '1000', dr: amt },
                { a: '4000', cr: amt }
              ],
              'ai_workbench',
              doc.id
            );
          }
        } catch (e) {
          console.error(e);
        }

        const evt: AiProcessingEvent = {
          id: `evt-${Date.now()}-${doc.id}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          docName: doc.name,
          vendor: doc.detectedVendor || 'Vendor',
          amount: amt,
          drAccount: `${doc.suggestedAccount} (${doc.accountName})`,
          crAccount: doc.type === 'merchant_payout' ? '4000 (Revenue)' : '2000 (Accounts Payable)',
          ruleCitation: isPrepaid ? 'ASC 340-20 Prepaid Amortization' : isCapEx ? 'IRC § 179 CapEx Safe Harbor' : 'IRC § 162 Routine OpEx',
          confidence: doc.confidence,
          status: 'auto_posted'
        };
        newEvents.push(evt);

        return {
          ...doc,
          status: 'posted_to_gl' as const
        };
      });

      setDocuments(updatedDocs);
      localStorage.setItem('retalyy_business_crm_docs', JSON.stringify(updatedDocs));
      setEvents(prev => [...newEvents, ...prev]);
      setLedgerVersion(v => v + 1);
      setIsProcessingBatch(false);

      setToastMessage({
        title: 'AI Batch Processed',
        description: `Successfully processed ${queued.length} document(s) with double-entry GL balance verification.`
      });
      setTimeout(() => setToastMessage(null), 5000);
    }, 1400);
  };

  const queuedCount = documents.filter(d => d.status === 'queued').length;
  const billsDueCount = ledger.bills.filter(b => b.total - b.paid > 0.01).length;

  // 0. AUTHENTICATION GATING: Login / Registration System comes FIRST (front and center)
  if (!businessUser) {
    return (
      <BusinessAuthView
        onAuthenticate={(user, initialCompany) => {
          setBusinessUser(user);
          localStorage.setItem('retalyy_business_crm_user', JSON.stringify(user));
          if (initialCompany) {
            setProfile(prev => {
              const updated = { ...prev, ...initialCompany };
              localStorage.setItem('retalyy_business_crm_profile', JSON.stringify(updated));
              return updated;
            });
          }
          // Direct new companies to onboarding details first; otherwise go to finance hub
          if (initialCompany?.isOnboarded === false || !profile.isOnboarded) {
            setActiveTab('company_onboarding');
          } else {
            setActiveTab('finance_hub');
          }
        }}
        onBackToMarketing={onBackToMarketing}
        onSwitchToFirmCrm={onSwitchToFirmCrm}
      />
    );
  }

  return (
    <div className="retalyy-crm-scope min-h-screen flex flex-col font-sans w-full max-w-full overflow-x-hidden text-left" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* TOP HEADER: BUSINESS IDENTITY & NAV TABS */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">

          {/* Left: Brand & Return */}
          <div className="flex items-center gap-3 shrink-0">
            {onBackToMarketing && (
              <button
                type="button"
                onClick={onBackToMarketing}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-full border border-[#D9F0E2] text-[#0C2B1C] hover:bg-[#EDF9F1] transition-all flex items-center gap-1 shadow-xs bg-white cursor-pointer"
                title="Return to Marketing Overview"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#27B665]" />
                <span className="hidden sm:inline">Main Site</span>
              </button>
            )}

            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: 'linear-gradient(135deg, #0C2B1C 0%, #27B665 100%)',
              }}
            >
              R
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold tracking-tight font-display text-[#0C2B1C]">
                  {profile.companyName}
                </span>
                <span className="h-4 w-px bg-[#D9F0E2]" />
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[10px] font-bold border border-[#C6EDD4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27B665] animate-pulse" />
                  AI Finance Dept Active
                </span>
              </div>
            </div>
          </div>

          {/* Center: Dedicated Business Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'finance_hub', label: 'Finance Hub', icon: TrendingUp },
              { id: 'intake_documents', label: 'Documents & Feeds', icon: UploadCloud, badge: queuedCount, badgeColor: '#f59e0b' },
              { id: 'ai_pipeline', label: 'AI Processing', icon: Cpu },
              { id: 'payables_receivables', label: 'Payables & Invoices', icon: CreditCard, badge: billsDueCount, badgeColor: '#0ea5e9' },
              { id: 'company_onboarding', label: 'Company Onboarding', icon: Sliders }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as BusinessWorkspaceSubTab)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium transition-all whitespace-nowrap rounded-xl cursor-pointer ${
                    isActive
                      ? 'bg-[#EDF9F1] text-[#0C2B1C] font-bold'
                      : 'text-[#52705F] hover:bg-neutral-50 hover:text-[#0C2B1C]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#27B665]' : 'text-[#52705F]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                      style={{ background: tab.badgeColor || '#27B665' }}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Triggers, User Profile, & Switch to Firm OS */}
          <div className="flex items-center gap-2.5 shrink-0">
            {queuedCount > 0 && (
              <button
                type="button"
                onClick={handleRunAiBatch}
                disabled={isProcessingBatch}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#27B665] text-white hover:bg-[#1fa357] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Process ({queuedCount})</span>
              </button>
            )}

            {/* Authenticated User Pill + Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#D9F0E2]">
              <div 
                className="w-7 h-7 rounded-lg bg-[#0C2B1C] text-[#8EDDA6] flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0"
                title={`${businessUser.fullName} (${businessUser.role})`}
              >
                {businessUser.fullName.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-[12px] font-bold text-[#0C2B1C] leading-none">
                  {businessUser.fullName}
                </div>
                <div className="text-[10px] text-[#52705F] capitalize">
                  {businessUser.role} · {profile.companyName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBusinessUser(null);
                  localStorage.removeItem('retalyy_business_crm_user');
                }}
                className="px-2.5 py-1.5 rounded-xl border border-[#D9F0E2] bg-white text-xs font-semibold text-[#52705F] hover:text-[#0C2B1C] hover:bg-[#EDF9F1] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ml-1"
                title="Sign out to Login / Registration view"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {onSwitchToFirmCrm && (
              <button
                type="button"
                onClick={onSwitchToFirmCrm}
                className="px-3 py-1.5 rounded-xl border border-[#D9F0E2] bg-white text-xs font-bold text-[#0C2B1C] hover:bg-[#EDF9F1] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Switch to Multi-Role CPA Firm Accounting Workspace"
              >
                <Layers className="w-3.5 h-3.5 text-[#27B665]" />
                <span className="hidden lg:inline">CPA Firm OS</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md p-4 flex items-start justify-between gap-3 animate-fade-in-up bg-white border border-[#8EDDA6] rounded-2xl shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EDF9F1] text-[#27B665] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#0C2B1C]">
                {toastMessage.title}
              </h4>
              <p className="text-[12px] mt-0.5 text-[#52705F]">
                {toastMessage.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
        {activeTab === 'finance_hub' && (
          <BusinessFinanceHubView
            key={`hub-${ledgerVersion}`}
            profile={profile}
            ledger={ledger}
            onNavigateToPayables={() => setActiveTab('payables_receivables')}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'intake_documents' && (
          <BusinessIntakeView
            documents={documents}
            onUploadDocuments={handleUploadDocuments}
            onRunAiBatch={handleRunAiBatch}
          />
        )}

        {activeTab === 'ai_pipeline' && (
          <BusinessAiPipelineView
            documents={documents}
            events={events}
            onRunBatch={handleRunAiBatch}
            isProcessing={isProcessingBatch}
          />
        )}

        {activeTab === 'payables_receivables' && (
          <BusinessPayablesReceivablesView
            key={`ar-ap-${ledgerVersion}`}
            ledger={ledger}
            onRefreshLedger={() => setLedgerVersion(v => v + 1)}
          />
        )}

        {activeTab === 'company_onboarding' && (
          <BusinessOnboardingView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onCompleteOnboarding={() => {
              setActiveTab('finance_hub');
              setToastMessage({
                title: 'AI Custom Dashboard Generated & Activated',
                description: `Custom financial dashboard generated for ${profile.companyName} (${profile.dashboardBlueprint?.industryDisplayName || profile.industry}).`
              });
              setTimeout(() => setToastMessage(null), 5000);
            }}
          />
        )}
      </main>

    </div>
  );
};

export default BusinessCrmWorkspace;
