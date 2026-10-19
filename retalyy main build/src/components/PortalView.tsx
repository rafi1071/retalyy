import React, { useState } from 'react';
import { ClientProfile, NavigationTab } from '../types';
import { formatCurrency } from '../utils/taxCalculator';
import { 
  SCorpShieldIcon, 
  Solo401kVaultIcon, 
  AccountablePlanIcon, 
  AugustaRuleIcon, 
  SafeHarborBeaconIcon, 
  PtetCompassIcon 
} from './CustomIcons';
import { RetalyyIconMark } from './RetalyyLogo';
import { PortalGateway } from './PortalGateway';

interface PortalViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  clientProfile: ClientProfile;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
}

export const PortalView: React.FC<PortalViewProps> = ({ 
  setActiveTab, 
  clientProfile, 
  setClientProfile 
}) => {
  const [viewMode, setViewMode] = useState<'gateway' | 'dashboard'>('gateway');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'strategies' | 'vault' | 'messenger' | 'integrations'>('overview');
  
  // Real-time chat state with lead CPA
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'Marcus Vance · Operations Lead',
      text: 'Hi Jordan, your operational chart of accounts and Q3 cash runway model are verified. Your Q3 buffer allocation of $28,750 has been reconciled in your ledger.',
      time: '10:14 AM',
      isCpa: true
    },
    {
      id: 'm2',
      sender: 'Jordan Miller',
      text: 'Thanks Marcus! What about the camera hardware and studio monitor purchase from last week? Does that go under the accountable plan?',
      time: '10:28 AM',
      isCpa: false
    },
    {
      id: 'm3',
      sender: 'Marcus Vance · Operations Lead',
      text: 'Exactly. Upload the invoice to your Vault tab under expense vouchers. Our system reconciles the entry and maps it directly to your job costing ledger.',
      time: '10:35 AM',
      isCpa: true
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = {
      id: `m-${Date.now()}`,
      sender: clientProfile.fullName || 'Jordan Miller',
      text: inputMsg,
      time: 'Just now',
      isCpa: false
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMsg('');

    // Simulated operations desk response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: `m-cpa-${Date.now()}`,
          sender: 'Marcus Vance · Operations Lead',
          text: 'Got your message. I am reviewing the figures against your operating ledger and will update your financial report.',
          time: 'Just now',
          isCpa: true
        }
      ]);
    }, 1200);
  };

  const strategiesList = [
    {
      id: 'strat-1',
      title: 'S-Corporation Form 2553 Conversion',
      code: 'IRC §1362(a)',
      impact: '+$14,200 / yr',
      status: 'Live & Active',
      cpa: 'Reviewed by Marcus Vance',
      desc: 'Wage set at $95,000 W-2. Remaining profits drawn as quarterly non-FICA K-1 distributions.',
      icon: <SCorpShieldIcon size={26} />
    },
    {
      id: 'strat-2',
      title: 'Solo 401(k) + 25% Employer Profit Share',
      code: 'IRC §401(k) / §415(c)',
      impact: '+$8,400 / yr',
      status: 'Funded',
      cpa: 'Reviewed by Sarah Chen',
      desc: '$23,500 elective deferral funded. Employer profit share allocation scheduled for Dec 15.',
      icon: <Solo401kVaultIcon size={26} />
    },
    {
      id: 'strat-3',
      title: 'Corporate Accountable Plan & Home Studio',
      code: 'IRC §62(a)(2)(A)',
      impact: '+$3,100 / yr',
      status: 'Active Monthly',
      cpa: 'Board Resolution on file',
      desc: 'Reimbursing $620/mo for dedicated home office, fiber internet, and technology equipment.',
      icon: <AccountablePlanIcon size={26} />
    },
    {
      id: 'strat-4',
      title: '14-Day Augusta Rule Rental (§280A)',
      code: 'IRC §280A(g)',
      impact: '+$2,400 / yr',
      status: 'Scheduled',
      cpa: 'Pending Board Minutes',
      desc: 'Quarterly strategic offsites scheduled at primary residence. Fair market value appraisal logged.',
      icon: <AugustaRuleIcon size={26} />
    },
    {
      id: 'strat-5',
      title: 'California Pass-Through Entity Tax (PTET)',
      code: 'CA AB 150',
      impact: '+$4,600 / yr',
      status: 'Ready to Elect',
      cpa: 'State Tax Advisory',
      desc: 'Bypasses the federal $10,000 SALT cap by paying California elective tax at the entity level.',
      icon: <PtetCompassIcon size={26} />
    }
  ];

  const vaultDocs = [
    { name: '2025_Form_1120S_Corporate_Tax_Return.pdf', type: 'IRS Filing', size: '2.4 MB', date: 'Oct 02, 2026' },
    { name: 'IRS_Form_2553_Acceptance_Letter_CP261.pdf', type: 'Entity Seal', size: '420 KB', date: 'Sep 15, 2026' },
    { name: 'Data_Processing_Authorization_Record_v2.4.pdf', type: 'Legal Authorization', size: '180 KB', date: 'Aug 20, 2026' },
    { name: 'Corporate_Accountable_Plan_Board_Resolution.pdf', type: 'Governance', size: '310 KB', date: 'Jul 11, 2026' },
    { name: 'Reasonable_Compensation_BLS_Study_2026.pdf', type: 'Audit Trail Defense', size: '1.8 MB', date: 'Jun 04, 2026' }
  ];

  if (viewMode === 'gateway') {
    return (
      <PortalGateway
        setActiveTab={setActiveTab}
        clientProfile={clientProfile}
        setClientProfile={setClientProfile}
        onViewClientDashboard={() => setViewMode('dashboard')}
      />
    );
  }

  return (
    <div className="wrap py-10 space-y-8 animate-fade-in">
      
      {/* Top Portal Banner */}
      <div className="bg-[#0C2B1C] text-white rounded-[32px] p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="blob b1 -top-36 -right-20 opacity-40" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setViewMode('gateway')}
              className="text-xs font-mono font-bold text-[#8EDDA6] hover:text-white flex items-center gap-1.5 cursor-pointer mb-1 transition-colors"
            >
              ← Portal Gateway / Switch Account
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full">
                <RetalyyIconMark size={18} variant="transparent" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8EDDA6]">Retalyy Portal</span>
              </div>
              <span className="font-mono text-xs font-bold uppercase bg-[#27B665] text-white px-3 py-1 rounded-full">
                S-Corporation Active
              </span>
              <span className="text-xs text-white/70 font-mono">
                EIN: {clientProfile.ein || '84-2918491'} · CA Nexus
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              {clientProfile.businessName || 'Miller Cloud Systems LLC'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Real-time tax strategy dashboard. Strategy supervised by <strong className="text-[#8EDDA6]">{clientProfile.assignedCpa}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSubTab('messenger')}
              className="ret-btn sm"
            >
              Message Marcus Vance (CPA)
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className="ret-btn sm secondary"
            >
              Run Tax Model
            </button>
          </div>
        </div>

        {/* 4 Core Financial KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="text-white/60 font-mono text-[11px]">YTD TAX DRAG ELIMINATED</div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#8EDDA6] mt-1 tabular-nums">
              $18,900
            </div>
            <div className="text-[11px] text-white/70 mt-1">+14.2% capital saved</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="text-white/60 font-mono text-[11px]">W-2 REASONABLE WAGE</div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1 tabular-nums">
              $95,000
            </div>
            <div className="text-[11px] text-white/70 mt-1">BLS benchmark defensible</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="text-white/60 font-mono text-[11px]">K-1 TAX-FREE DISTRIBUTIONS</div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#8EDDA6] mt-1 tabular-nums">
              $115,000
            </div>
            <div className="text-[11px] text-white/70 mt-1">100% exempt from 15.3% SE</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="text-white/60 font-mono text-[11px]">SAFE HARBOR ESCROW (Q4)</div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1 tabular-nums">
              $11,420
            </div>
            <div className="text-[11px] text-white/70 mt-1">Due Jan 15, 2027 · Form 1040-ES</div>
          </div>
        </div>

      </div>

      {/* Portal Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#EDF9F1] rounded-full border border-[#D9F0E2]">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            activeSubTab === 'overview' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setActiveSubTab('strategies')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            activeSubTab === 'strategies' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'
          }`}
        >
          Active Strategies (5)
        </button>
        <button
          onClick={() => setActiveSubTab('vault')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            activeSubTab === 'vault' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'
          }`}
        >
          Tax Returns & Vault
        </button>
        <button
          onClick={() => setActiveSubTab('messenger')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            activeSubTab === 'messenger' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'
          }`}
        >
          Advisor Messenger
        </button>
        <button
          onClick={() => setActiveSubTab('integrations')}
          className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
            activeSubTab === 'integrations' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'
          }`}
        >
          Bank & Payroll Sync
        </button>
      </div>

      {/* SUB-VIEW 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Active Strategy Highlights */}
            <div className="lg:col-span-7 bg-white rounded-[32px] border border-[#D9F0E2] p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-[#EEF6F1] pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#0C2B1C]">Active Execution Pipeline</h3>
                  <p className="text-xs text-[#52705F]">Current strategies running under corporate umbrella</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('strategies')}
                  className="text-xs font-bold text-[#0F7A41] hover:underline"
                >
                  View All (5) →
                </button>
              </div>

              <div className="space-y-3.5">
                {strategiesList.slice(0, 3).map((st) => (
                  <div key={st.id} className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 bg-white rounded-xl border border-[#D9F0E2]">
                        {st.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0C2B1C]">{st.title}</div>
                        <div className="text-[11px] text-[#52705F] font-mono">{st.code} · {st.status}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-extrabold text-base text-[#0F7A41]">{st.impact}</div>
                      <div className="text-[10px] text-[#52705F]">{st.cpa}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#D9F0E2] flex items-center justify-between">
                <span className="text-xs text-[#52705F]">Next compliance milestone:</span>
                <span className="font-mono text-xs font-bold text-[#0C2B1C]">Form 1040-ES Q4 Payment (Jan 15, 2027)</span>
              </div>
            </div>

            {/* Right: Quick Action Cards */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-[#EDF9F1] rounded-[32px] border border-[#D9F0E2] p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#27B665] text-white font-bold flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <div className="font-display font-bold text-base text-[#0C2B1C]">Annual Financial Plan Verified</div>
                    <div className="text-xs text-[#52705F]">Operating Ledgers & Statements in sync</div>
                  </div>
                </div>
                <p className="text-xs text-[#52705F] leading-relaxed">
                  Your 2026 corporate financial binder has been reconciled and reviewed. All operating cash reserves and monthly closes are audit-ready.
                </p>
                <button
                  onClick={() => setActiveSubTab('vault')}
                  className="ret-btn sm w-full text-center"
                >
                  Download Financial Operations Binder (PDF)
                </button>
              </div>

              <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-7 space-y-3">
                <h4 className="font-display font-bold text-base text-[#0C2B1C]">Quick Operations Question?</h4>
                <p className="text-xs text-[#52705F]">
                  Marcus Vance and the Retalyy partner desk respond in under 2 hours during market hours.
                </p>
                <button
                  onClick={() => setActiveSubTab('messenger')}
                  className="ret-btn sm secondary w-full text-center"
                >
                  Open Operations Chat
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW 2: STRATEGIES PIPELINE */}
      {activeSubTab === 'strategies' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategiesList.map((st) => (
              <div key={st.id} className="bg-white rounded-[28px] border border-[#D9F0E2] p-7 space-y-4 shadow-sm hover:border-[#27B665] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#EDF9F1] rounded-2xl border border-[#D9F0E2]">
                      {st.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-[#0C2B1C]">{st.title}</h4>
                      <div className="text-xs font-mono font-bold text-[#0F7A41]">{st.code}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#EDF9F1] text-[#0F7A41] font-mono font-bold text-xs rounded-full shrink-0">
                    {st.status}
                  </span>
                </div>

                <p className="text-xs text-[#52705F] leading-relaxed">
                  {st.desc}
                </p>

                <div className="pt-3 border-t border-[#EEF6F1] flex items-center justify-between text-xs">
                  <span className="text-[#52705F] font-mono">{st.cpa}</span>
                  <span className="font-display font-extrabold text-[#0F7A41] text-base">{st.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: VAULT & DOCUMENTS */}
      {activeSubTab === 'vault' && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF6F1] pb-5">
            <div>
              <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">Encrypted Financial Document Vault</h3>
              <p className="text-xs text-[#52705F]">Zero-knowledge AES-256 cloud storage & immutable audit logs.</p>
            </div>
            <button
              onClick={() => {
                alert('Uploading new tax return or voucher to secure vault. File encrypted with AES-256-GCM.');
              }}
              className="ret-btn sm"
            >
              Upload New Return or Invoice
            </button>
          </div>

          <div className="divide-y divide-[#EEF6F1]">
            {vaultDocs.map((doc, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#EDF9F1]/30 p-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0C2B1C]">{doc.name}</div>
                    <div className="text-[11px] text-[#52705F] font-mono">{doc.type} · {doc.size} · Uploaded {doc.date}</div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading ${doc.name} (Decrypted on client)`)}
                  className="ret-btn sm secondary self-start sm:self-auto"
                >
                  Download File
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: ADVISOR MESSENGER */}
      {activeSubTab === 'messenger' && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EEF6F1] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#27B665] text-white font-bold flex items-center justify-center font-display">
                MV
              </div>
              <div>
                <div className="font-display font-bold text-base text-[#0C2B1C]">Marcus Vance, CPA, MST</div>
                <div className="text-xs text-[#0F7A41] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#27B665]" />
                  Active · Partner Tax Desk (CA Board #89214)
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#52705F]">End-to-End Encrypted</span>
          </div>

          {/* Messages Feed */}
          <div className="space-y-4 max-h-[360px] overflow-y-auto p-4 rounded-2xl bg-[#EDF9F1]/40 border border-[#D9F0E2]">
            {chatMessages.map((m) => (
              <div 
                key={m.id}
                className={`flex flex-col ${m.isCpa ? 'items-start' : 'items-end'}`}
              >
                <div className="text-[10px] text-[#52705F] font-mono mb-1">{m.sender} · {m.time}</div>
                <div className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed shadow-sm ${
                  m.isCpa 
                    ? 'bg-white text-[#0C2B1C] border border-[#D9F0E2]' 
                    : 'bg-[#0C2B1C] text-white'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Marcus about deductions, K-1 draws, or S-Corp payroll..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 text-xs px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
            />
            <button
              type="submit"
              className="ret-btn sm"
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      {/* SUB-VIEW 5: BANK & PAYROLL INTEGRATIONS */}
      {activeSubTab === 'integrations' && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 space-y-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">Financial Data & Payroll Feeds</h3>
            <p className="text-xs text-[#52705F] mt-1">Automatic real-time sync for autonomous tax calculations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-[24px] bg-[#EDF9F1] border border-[#D9F0E2] space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Mercury Bank</span>
                <span className="px-2 py-0.5 bg-[#27B665] text-white font-mono text-[10px] rounded-full">Connected</span>
              </div>
              <p className="text-xs text-[#52705F]">Checking & Treasury accounts syncing daily for K-1 dividend distribution tracking.</p>
              <div className="text-[11px] font-mono text-[#0F7A41]">Last sync: 12 mins ago</div>
            </div>

            <div className="p-6 rounded-[24px] bg-[#EDF9F1] border border-[#D9F0E2] space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Gusto Payroll</span>
                <span className="px-2 py-0.5 bg-[#27B665] text-white font-mono text-[10px] rounded-full">Connected</span>
              </div>
              <p className="text-xs text-[#52705F]">W-2 wage allocation running on schedule ($95,000/yr benchmark).</p>
              <div className="text-[11px] font-mono text-[#0F7A41]">Auto-filing 941/DE9C</div>
            </div>

            <div className="p-6 rounded-[24px] bg-white border border-[#D9F0E2] space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Stripe Invoicing</span>
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 font-mono text-[10px] rounded-full">Available</span>
              </div>
              <p className="text-xs text-[#52705F]">Connect customer billing to trigger proactive tax escrow on large client deposits.</p>
              <button 
                onClick={() => alert('Opening Stripe Connect OAuth flow')}
                className="ret-btn sm secondary w-full text-center"
              >
                Connect Stripe
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
