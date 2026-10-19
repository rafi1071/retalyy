import React, { useState, useRef, useEffect } from 'react';
import { NavigationTab } from '../types';
import { RetalyyLogo } from './RetalyyLogo';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

type DropdownKey = 'platform' | 'solutions' | 'partnership' | null;

interface PlatformFeatureModalData {
  title: string;
  subtitle: string;
  iconType: 'finance' | 'contracts' | 'operations' | 'integrations';
  description: string;
  keyCapabilities: string[];
  supportedSystems: string[];
  metricTarget: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [activeFeatureModal, setActiveFeatureModal] = useState<PlatformFeatureModalData | null>(null);
  
  const navRef = useRef<HTMLElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setActiveFeatureModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = (key: DropdownKey) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const toggleDropdown = (key: 'platform' | 'solutions') => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  const openPlatformFeature = (feature: 'finance' | 'contracts' | 'operations' | 'integrations') => {
    setOpenDropdown(null);
    if (feature === 'finance') {
      setActiveFeatureModal({
        title: 'Finance Operations',
        subtitle: 'AP, reconciliation, ledger, close & reporting',
        iconType: 'finance',
        description: 'Autonomous financial operations preparing the first pass of coded transactions, continuous bank reconciliation, and audit-ready financial statements with source-document traceability.',
        keyCapabilities: [
          'AP bill capture and two-way invoice matching',
          'Autonomous bank feed classification & exception queue',
          'Month-end close checklist & draft balance sheet',
          'Continuous double-entry ledger with source document citation',
          'Cash flow statements & budget variance commentary'
        ],
        supportedSystems: ['QuickBooks Online', 'Xero', 'Plaid Direct Feeds', 'Stripe', 'Brex / Ramp'],
        metricTarget: 'Reduces month-end close cycle by 68% with 94%+ automated categorization acceptance'
      });
    } else if (feature === 'contracts') {
      setActiveFeatureModal({
        title: 'Contracts & Compliance',
        subtitle: 'Leases, abstraction & compliance',
        iconType: 'contracts',
        description: 'Continuous extraction and compliance management for commercial leases, subcontractor agreements, W-9 tracking, and statutory 1099-NEC reporting.',
        keyCapabilities: [
          'Subcontractor agreement tracking & W-9 verification',
          'Commercial lease abstraction & critical date alerts',
          'Year-end 1099-NEC & 1099-MISC automated filing',
          'Lien waiver validation and certificate of insurance (COI) tracking',
          'Enterprise AES-256 encrypted ledger preservation'
        ],
        supportedSystems: ['DocuSign', 'PandaDoc', 'IRS FIRE System', 'State SOS Feeds'],
        metricTarget: 'Zero missed lease deadlines and 100% January 31st 1099 filing compliance'
      });
    } else if (feature === 'operations') {
      setActiveFeatureModal({
        title: 'Operational Cost Tracking',
        subtitle: 'Utilities, assets, labor & maintenance',
        iconType: 'operations',
        description: 'Real-time job costing, utility allocation, equipment asset depreciation schedules, and labor margin alerts to prevent project cost overruns.',
        keyCapabilities: [
          'Real-time job & project cost ledger (bid vs. actual)',
          'Equipment & utility expense allocation across job sites',
          'Labor burden rate calculations and overtime warnings',
          '13-week rolling operational cash forecasts',
          'Lender and surety bonding packs on demand'
        ],
        supportedSystems: ['ServiceTitan', 'Procore', 'Fleetio', 'Gusto', 'ADP'],
        metricTarget: 'Identifies cost overruns an average of 19 days before job completion'
      });
    } else if (feature === 'integrations') {
      setActiveFeatureModal({
        title: 'Core Ledger & Ecosystem Connectors',
        subtitle: 'Complete replacement for QuickBooks & Xero with 1-click migration',
        iconType: 'integrations',
        description: 'Retalyy replaces QuickBooks and Xero with an autonomous double-entry accounting engine, offering seamless 1-click migration of historical ledgers, direct bank feeds, merchant payout reconciliation, and payroll sync.',
        keyCapabilities: [
          '1-Click full ledger migration from QuickBooks Online & Xero',
          'Direct bank & card feeds via Plaid Exchange & OAuth 2.0',
          'Payroll connectors (Gusto, ADP, Paychex) for wage burden',
          'POS & merchant payout reconciliation (Square, Toast, Stripe)',
          'Immutable audit log tracking every imported source receipt'
        ],
        supportedSystems: ['QuickBooks (Replacement)', 'Xero (Replacement)', 'Plaid', 'Stripe', 'Square', 'Gusto', 'ADP'],
        metricTarget: 'Under 2-hour full chart-of-accounts and transaction history migration'
      });
    }
  };

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9F0E2]">
        {/* Top Announcement Banner: Partnership & Pilot */}
        <div className="bg-[#0C2B1C] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#46D279] animate-ping" />
          <span className="text-white/90">
            Accounting Firms & CPAs: Claim a free risk-free partnership pilot. Setup & migration 100% handled.
          </span>
          <button 
            onClick={() => handleNav('firms')} 
            className="text-[#46D279] font-bold underline hover:text-[#8EDDA6] ml-1 cursor-pointer"
          >
            Why Partner With Us →
          </button>
        </div>

        <div className="wrap flex items-center justify-between h-[72px]">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNav('home')} 
            className="flex items-center text-left cursor-pointer focus-visible:outline-none shrink-0"
            aria-label="Retalyy home"
          >
            <RetalyyLogo size="md" variant="dark" />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 font-medium text-[14.5px] text-[#52705F]">
            
            {/* 1. PLATFORM DROPDOWN (Image 1 & Image 2) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('platform')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button"
                onClick={() => toggleDropdown('platform')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openDropdown === 'platform' || activeTab === 'home' 
                    ? 'text-[#0C2B1C] font-semibold bg-[#F2FAF5]' 
                    : 'hover:text-[#0C2B1C] hover:bg-neutral-50'
                }`}
                aria-expanded={openDropdown === 'platform'}
              >
                <span>Platform</span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === 'platform' ? 'rotate-180 text-[#0C2B1C]' : 'text-neutral-400'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Exact Platform Dropdown from Image 1 */}
              {openDropdown === 'platform' && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-[370px] bg-white rounded-2xl border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.14)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter('platform')}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Finance */}
                  <button
                    type="button"
                    onClick={() => openPlatformFeature('finance')}
                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] group-hover:bg-[#E0ECFF] transition-colors shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="22" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-1.5">
                        Finance
                      </div>
                      <div className="text-[12.5px] text-neutral-500 leading-snug mt-0.5">
                        AP, reconciliation, ledger, close & reporting
                      </div>
                    </div>
                  </button>

                  {/* Contracts */}
                  <button
                    type="button"
                    onClick={() => openPlatformFeature('contracts')}
                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] group-hover:bg-[#E0ECFF] transition-colors shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-1.5">
                        Contracts
                      </div>
                      <div className="text-[12.5px] text-neutral-500 leading-snug mt-0.5">
                        Leases, abstraction & compliance
                      </div>
                    </div>
                  </button>

                  {/* Operations */}
                  <button
                    type="button"
                    onClick={() => openPlatformFeature('operations')}
                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] group-hover:bg-[#E0ECFF] transition-colors shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-1.5">
                        Operations
                      </div>
                      <div className="text-[12.5px] text-neutral-500 leading-snug mt-0.5">
                        Utilities, assets, labor & maintenance
                      </div>
                    </div>
                  </button>

                  {/* Integrations */}
                  <button
                    type="button"
                    onClick={() => openPlatformFeature('integrations')}
                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] group-hover:bg-[#E0ECFF] transition-colors shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22v-5" />
                        <path d="M9 8V2" />
                        <path d="M15 2v6" />
                        <path d="M18 8v5a6 6 0 0 1-12 0V8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-1.5">
                        QBO & Xero Replacement
                      </div>
                      <div className="text-[12.5px] text-neutral-500 leading-snug mt-0.5">
                        1-click migration & ecosystem connectors
                      </div>
                    </div>
                  </button>

                  {/* Bottom quick action */}
                  <div className="mt-1 pt-2 border-t border-neutral-100 px-3 py-1.5 flex items-center justify-between text-[11.5px] text-[#52705F]">
                    <span className="font-mono">Retalyy Engine v2.6</span>
                    <button 
                      onClick={() => handleNav('home')} 
                      className="text-[#0F7A41] font-semibold hover:underline"
                    >
                      View Architecture →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SOLUTIONS DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button"
                onClick={() => toggleDropdown('solutions')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openDropdown === 'solutions' || activeTab === 'solutions'
                    ? 'text-[#0C2B1C] font-semibold bg-[#F2FAF5]' 
                    : 'hover:text-[#0C2B1C] hover:bg-neutral-50'
                }`}
                aria-expanded={openDropdown === 'solutions'}
              >
                <span>Solutions</span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === 'solutions' ? 'rotate-180 text-[#0C2B1C]' : 'text-neutral-400'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === 'solutions' && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-[420px] bg-white rounded-2xl border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.14)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[500px] overflow-y-auto"
                  onMouseEnter={() => handleMouseEnter('solutions')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold border-b border-neutral-100 mb-1 flex items-center justify-between">
                    <span>Section 5 Exact Functionalities</span>
                    <span className="text-[#0F7A41]">Unified Ledger</span>
                  </div>

                  {/* 1. Vertical Workspace */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] flex items-center justify-center shrink-0 text-[#0F7A41] group-hover:bg-[#D9F0E2] transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Vertical Workspace
                        <span className="text-[10px] font-mono bg-[#EDF9F1] text-[#0F7A41] px-1.5 py-0.5 rounded font-bold">Launch</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Chart of accounts, progress billing, jobs tied to financials
                      </div>
                    </div>
                  </button>

                  {/* 2. Cost Tracking */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 group-hover:bg-amber-100 transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Cost Tracking & Alerts
                        <span className="text-[10px] font-mono bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">Launch</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Job & project cost, budget vs actual, margin alerts
                      </div>
                    </div>
                  </button>

                  {/* 3. Accounting Operations */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] group-hover:bg-[#E0ECFF] transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Accounting Operations
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">Launch</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Reconciliation, draft balance sheet, P&L, month-end close
                      </div>
                    </div>
                  </button>

                  {/* 4. Budget & Forecasting */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 text-purple-600 group-hover:bg-purple-100 transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Budget & 13-Wk Forecast
                        <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">Phase 2</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        13-week rolling cash forecast, what-if scenarios, anomaly alerts
                      </div>
                    </div>
                  </button>

                  {/* 5. Tax Planning */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 group-hover:bg-emerald-100 transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Tax Planning & Set-Aside
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Phase 2</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Running tax set-aside, statutory scenario engine with IRC citations
                      </div>
                    </div>
                  </button>

                  {/* 6. Control Layer (CPA Sign-Off) */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 text-teal-700 group-hover:bg-teal-100 transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Control Layer & Review Queue
                        <span className="text-[10px] font-mono bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-bold">Launch</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Quality review queue and exception triage for clean closes
                      </div>
                    </div>
                  </button>

                  {/* 7. Management & CFO Reporting */}
                  <button
                    type="button"
                    onClick={() => handleNav('solutions')}
                    className="w-full flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-700 group-hover:bg-indigo-100 transition-colors shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold text-neutral-900 group-hover:text-[#0C2B1C] flex items-center gap-2">
                        Management & CFO Layer
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Phase 2/3</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Monthly management pack, lender & bonding packs, named controller
                      </div>
                    </div>
                  </button>

                  {/* Bottom quick action */}
                  <div className="mt-1 pt-2 border-t border-neutral-100 px-3 py-1.5 flex items-center justify-between text-[11.5px] text-[#52705F]">
                    <span className="font-mono">9 Modules · Section 5</span>
                    <button 
                      onClick={() => handleNav('solutions')} 
                      className="text-[#0F7A41] font-semibold hover:underline cursor-pointer"
                    >
                      View All 9 Functionalities →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. MISSION LINK */}
            <button 
              onClick={() => handleNav('mission')} 
              className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                activeTab === 'mission' 
                  ? 'text-[#0C2B1C] font-bold bg-[#F2FAF5] border-b-2 border-[#27B665]' 
                  : 'hover:text-[#0C2B1C] hover:bg-neutral-50'
              }`}
            >
              Mission
            </button>

            {/* 5. PARTNERSHIP & WHY PARTNER WITH US */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('partnership')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                type="button"
                onClick={() => handleNav('firms')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openDropdown === 'partnership' || activeTab === 'firms' 
                    ? 'text-[#0C2B1C] font-semibold bg-[#F2FAF5]' 
                    : 'hover:text-[#0C2B1C] hover:bg-neutral-50'
                }`}
                aria-expanded={openDropdown === 'partnership'}
              >
                <span>Partnership</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#EDF9F1] text-[#0F7A41] px-1.5 py-0.5 rounded border border-[#D9F0E2]">
                  Why Partner With Us
                </span>
                <svg 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === 'partnership' ? 'rotate-180 text-[#0C2B1C]' : 'text-neutral-400'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Partnership Dropdown */}
              {openDropdown === 'partnership' && (
                <div 
                  className="absolute top-full left-0 mt-1.5 w-[380px] bg-white rounded-2xl border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.14)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter('partnership')}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Why Partner With Us */}
                  <button
                    type="button"
                    onClick={() => handleNav('firms')}
                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] flex items-center justify-center shrink-0 text-[#0F7A41] shadow-xs">
                      <Sparkles className="w-5 h-5 text-[#27B665]" />
                    </div>
                    <div>
                      <div className="text-[14.5px] font-bold text-neutral-900 group-hover:text-[#0C2B1C]">
                        Why Partner With Us
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Sell capacity & lower risk. Keep your CPA firm brand and client relationships.
                      </div>
                    </div>
                  </button>

                  {/* Accounting Firm Partner OS */}
                  <button
                    type="button"
                    onClick={() => handleNav('workspace')}
                    className="w-full flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#F7FCF9] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] shadow-xs">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[14.5px] font-bold text-neutral-900 group-hover:text-[#0C2B1C]">
                        Accounting Firm Partner OS
                      </div>
                      <div className="text-[12px] text-neutral-500 leading-snug mt-0.5">
                        Multi-client firm dashboard, 95% automated close & keyboard review queue.
                      </div>
                    </div>
                  </button>

                  {/* Risk-Free Firm Pilot */}
                  <div className="pt-2 border-t border-neutral-100 mt-1">
                    <button
                      type="button"
                      onClick={() => handleNav('firms')}
                      className="w-full p-2.5 rounded-xl bg-[#F8FAF9] hover:bg-[#EDF9F1] text-xs font-bold text-[#0F7A41] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Claim Risk-Free Partnership Pilot</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. OPERATIONS ENGINE */}
            <button 
              onClick={() => handleNav('calculator')} 
              className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                activeTab === 'calculator' 
                  ? 'text-[#0C2B1C] font-bold bg-[#F2FAF5]' 
                  : 'hover:text-[#0C2B1C] hover:bg-neutral-50'
              }`}
            >
              Operations Engine
            </button>

          </div>

          {/* Right Action: Single Unified Portal CTA */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleNav('portal')} 
              className={`ret-btn sm flex items-center gap-2 cursor-pointer transition-all shadow-xs group hover:shadow-md ${
                activeTab === 'portal' ? 'ring-2 ring-[#0F7A41] bg-[#0C2B1C] text-white' : ''
              }`}
              title="Access Retalyy Portal (Accounting Firm OS & Business Finance)"
            >
              <span className="w-2 h-2 rounded-full bg-[#27B665] animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider">Portal</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Mobile hamburger button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#52705F] hover:text-[#0C2B1C] rounded-lg hover:bg-neutral-100"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#D9F0E2] bg-white px-5 py-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-xl">
            
            {/* Platform Sub-links */}
            <div className="border-b border-neutral-100 pb-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Platform
              </div>
              <div className="grid grid-cols-1 gap-1">
                <button 
                  onClick={() => { setMobileMenuOpen(false); openPlatformFeature('finance'); }} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] text-xs font-bold">$</div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Finance</div>
                    <div className="text-xs text-neutral-500">AP, reconciliation, ledger & close</div>
                  </div>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); openPlatformFeature('contracts'); }} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] text-xs font-bold">📄</div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Contracts</div>
                    <div className="text-xs text-neutral-500">Leases, abstraction & compliance</div>
                  </div>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); openPlatformFeature('operations'); }} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] text-xs font-bold">🛡️</div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Operations</div>
                    <div className="text-xs text-neutral-500">Utilities, assets & labor</div>
                  </div>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); openPlatformFeature('integrations'); }} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] text-xs font-bold">🔌</div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Integrations</div>
                    <div className="text-xs text-neutral-500">POS, PMS, banks & ERP</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Direct primary destinations */}
            <div className="space-y-1.5 border-b border-neutral-100 pb-3">
              <button 
                onClick={() => handleNav('portal')} 
                className="block w-full text-left py-2.5 px-3 rounded-xl font-bold text-white bg-[#0C2B1C] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#27B665] animate-pulse" />
                  <span>Retalyy Portal (Firm & Business)</span>
                </div>
                <span className="text-[10px] font-mono bg-[#27B665] text-[#0C2B1C] px-2 py-0.5 rounded font-extrabold">
                  Access Portal ↗
                </span>
              </button>

              <button onClick={() => handleNav('solutions')} className="block w-full text-left py-2 px-2 rounded-lg font-semibold text-[#0C2B1C] hover:bg-neutral-50 flex items-center justify-between">
                <span>Solutions (Section 5 Functionalities)</span>
                <span className="text-[10px] font-mono bg-[#EDF9F1] text-[#0F7A41] px-1.5 py-0.5 rounded font-bold">9 Modules</span>
              </button>
              <button onClick={() => handleNav('mission')} className="block w-full text-left py-2 px-2 rounded-lg font-semibold text-[#0C2B1C] hover:bg-neutral-50">
                Mission (Startup Brief)
              </button>
              <button onClick={() => handleNav('calculator')} className="block w-full text-left py-2 px-2 rounded-lg font-semibold text-[#0C2B1C] hover:bg-neutral-50">
                Tax Engine & 5-Year S-Corp Savings
              </button>
              <button onClick={() => handleNav('firms')} className="block w-full text-left py-2 px-2 rounded-lg font-semibold text-[#0C2B1C] hover:bg-neutral-50 flex items-center justify-between">
                <span>Partnership · Why Partner With Us</span>
                <span className="text-[10px] font-mono bg-[#EDF9F1] text-[#0F7A41] px-1.5 py-0.5 rounded font-bold">Partner Pilot</span>
              </button>
              <button onClick={() => handleNav('findings')} className="block w-full text-left py-2 px-2 rounded-lg font-semibold text-[#0C2B1C] hover:bg-neutral-50">
                Category Rules & Packs
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} 
                className="w-full text-center py-2 text-sm text-[#0F7A41] font-semibold hover:underline"
              >
                Schedule CPA Consultation
              </button>
            </div>

          </div>
        )}
      </nav>

      {/* Feature Deep Dive Modal for Platform Items (Finance, Contracts, Operations, Integrations) */}
      {activeFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 relative">
            
            {/* Close button */}
            <button 
              onClick={() => setActiveFeatureModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header with Icon */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] flex items-center justify-center shrink-0 text-[#2563EB] shadow-md border border-[#E0ECFF]">
                {activeFeatureModal.iconType === 'finance' && (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                )}
                {activeFeatureModal.iconType === 'contracts' && (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                )}
                {activeFeatureModal.iconType === 'operations' && (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
                {activeFeatureModal.iconType === 'integrations' && (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22v-5" />
                    <path d="M9 8V2" />
                    <path d="M15 2v6" />
                    <path d="M18 8v5a6 6 0 0 1-12 0V8z" />
                  </svg>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#0F7A41] font-bold bg-[#EDF9F1] px-2 py-0.5 rounded">
                    Retalyy Module
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0C2B1C] mt-1">
                  {activeFeatureModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 font-mono">
                  {activeFeatureModal.subtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-700 leading-relaxed mb-5">
              {activeFeatureModal.description}
            </p>

            {/* Key Capabilities */}
            <div className="mb-5">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2.5">
                Core Capabilities & Controls
              </div>
              <ul className="space-y-2">
                {activeFeatureModal.keyCapabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800">
                    <span className="w-4 h-4 rounded-full bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supported Systems */}
            <div className="mb-5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                Supported Native Connectors
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeFeatureModal.supportedSystems.map((sys, idx) => (
                  <span key={idx} className="text-xs font-medium bg-white text-neutral-800 px-2.5 py-1 rounded-md border border-neutral-200/80 shadow-xs">
                    {sys}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Metric Badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EDF9F1] text-[#0F7A41] text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping shrink-0" />
              <span>{activeFeatureModal.metricTarget}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setActiveFeatureModal(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveFeatureModal(null);
                  if (activeFeatureModal.iconType === 'finance') {
                    handleNav('calculator');
                  } else if (activeFeatureModal.iconType === 'contracts') {
                    handleNav('findings');
                  } else {
                    handleNav('home');
                  }
                }}
                className="ret-btn sm"
              >
                Open in App →
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
