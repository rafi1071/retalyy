import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { NavigationTab } from '../types';
import { 
  SCorpShieldIcon, 
  Solo401kVaultIcon, 
  AccountablePlanIcon, 
  AugustaRuleIcon, 
  SafeHarborBeaconIcon, 
  QbiDiamondIcon,
  HealthDeductionIcon,
  DocumentCalculatorPencilIcon,
  FinancialDashboardReportIcon,
  ClipboardAnalyticsCalculatorIcon
} from './CustomIcons';
import { 
  SCorpFlowDiagram, 
  ScheduleCInspector, 
  VaultSecuritySeal, 
  CpaCredentialBadge 
} from './CustomIllustrations';
import { RetalyyIconMark } from './RetalyyLogo';
import { 
  CATEGORY_PACKS, 
  TARGET_SIZE_MATRIX, 
  PITCH_RULES, 
  PILOT_OFFER_DETAILS 
} from '../data/briefData';
import { CategoryPackId } from '../types';
import { DynamicDashboardShowcaseSection } from './DynamicDashboardShowcaseSection';
import { ReviewQueueShowcaseSection } from './ReviewQueueShowcaseSection';

interface HomeViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const heroRef = useRef<HTMLElement>(null);
  const mechanismRef = useRef<HTMLElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryPackId>('trades');
  const [activeTargetSize, setActiveTargetSize] = useState<number>(1); // Index 1 is Core SMB ($2M-$30M)

  const [glowPos, setGlowPos] = useState({ x: 300, y: 200 });
  const [activeMechanismStep, setActiveMechanismStep] = useState<1 | 2 | 3>(1);
  const [scrollLaserProgress, setScrollLaserProgress] = useState<number>(0.15);

  const [activeHits, setActiveHits] = useState<number[]>([]);
  const [totalVal, setTotalVal] = useState(0);

  const [calcIncome, setCalcIncome] = useState(150000);

  const tags = [
    'Real-Time Job Costing & WIP Tracking',
    '13-Week Rolling Cash Flow Forecast',
    'Multi-Entity Double-Entry Ledger',
    'Subcontractor & W-9 Invoice Verification',
    'Automated Bank & Card Feed Reconciliation',
    'Executive KPI & Management Packs',
    'Construction & Trades Financial OS',
    'Professional Services Margin Control',
    'Retail & E-Commerce Inventory Ledger',
    'Automated AP/AR Two-Way Matching',
    'Direct Business Finance Engine',
    'Accounting Firm Partner OS'
  ];

  useEffect(() => {
    const hitsTarget = [9400, 15500, 17850, 18260];
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setActiveHits([0]);
        setTotalVal(hitsTarget[0]);
      } else if (step === 2) {
        setActiveHits([0, 1]);
        setTotalVal(hitsTarget[1]);
      } else if (step === 3) {
        setActiveHits([0, 1, 2]);
        setTotalVal(hitsTarget[2]);
      } else if (step === 4) {
        setActiveHits([0, 1, 2, 3]);
        setTotalVal(hitsTarget[3]);
      } else if (step >= 6) {
        setActiveHits([]);
        setTotalVal(0);
        step = 0;
      }
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const refs = [step1Ref.current, step2Ref.current, step3Ref.current];
      if (!refs[0] || !refs[1] || !refs[2]) return;

      const focalY = window.innerHeight * 0.45;
      let closestStep: 1 | 2 | 3 = 1;
      let minDistance = Infinity;

      refs.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height * 0.5;
        const dist = Math.abs(cardCenter - focalY);
        if (dist < minDistance) {
          minDistance = dist;
          closestStep = (idx + 1) as 1 | 2 | 3;
        }
      });

      setActiveMechanismStep(closestStep);

      // Compute laser rail fill percent
      const rect1 = refs[0].getBoundingClientRect();
      const rect3 = refs[2].getBoundingClientRect();
      const span = (rect3.top + rect3.height * 0.5) - (rect1.top + rect1.height * 0.3);
      if (span > 0) {
        const progress = (focalY - (rect1.top + rect1.height * 0.3)) / span;
        const clamped = Math.max(0.12, Math.min(1.0, progress));
        setScrollLaserProgress(clamped);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = (stepNumber: 1 | 2 | 3) => {
    setActiveMechanismStep(stepNumber);
    const targetRef = stepNumber === 1 ? step1Ref : stepNumber === 2 ? step2Ref : step3Ref;
    targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const taxToday = Math.round(calcIncome * 0.262);
  const targetSavings = Math.round((calcIncome * 0.068) / 100) * 100;
  const taxWithPlan = taxToday - targetSavings;
  const barBHeightPercent = Math.max(20, Math.round((taxWithPlan / taxToday) * 100));
  const sliderFillPercent = ((calcIncome - 75000) / (400000 - 75000)) * 100;

  const formatMoney = (val: number) => '$' + Math.round(val).toLocaleString('en-US');

  return (
    <div className="space-y-0 pb-16">
      
      {/* HERO SECTION */}
      <header
        ref={heroRef}
        onPointerMove={handlePointerMove}
        className="relative pt-6 sm:pt-8 pb-16 overflow-hidden"
      >
        <div className="blob b1 -top-40 -right-28" />
        <div className="blob b2 -bottom-44 -left-24" />
        <div className="dots-grid" />

        <div
          className="pointer-events-none absolute w-[420px] h-[420px] rounded-full transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 -z-0 opacity-25"
          style={{
            left: `${glowPos.x}px`,
            top: `${glowPos.y}px`,
            background: 'radial-gradient(circle, rgba(142, 221, 166, 0.35), transparent 70%)'
          }}
        />

        <div className="wrap relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#D9F0E2] shadow-[0_2px_10px_rgba(12,43,28,0.04)] hover:border-[#27B665]/40 transition-all text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0C2B1C] text-[#8EDDA6] text-[11px] font-mono font-bold tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3 h-3 text-[#27B665]" />
                Next-Gen
              </span>
              <span className="font-semibold text-[#0C2B1C]">
                AI-Operated Monthly Close
              </span>
              <span className="hidden sm:inline text-[#52705F]/50">·</span>
              <span className="hidden sm:inline text-[#52705F] font-normal">
                Dynamic Dashboards for Every Business
              </span>
            </div>

            <h1 className="text-[clamp(36px,5vw,72px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-[#0C2B1C]">
              The AI monthly close platform replacing QuickBooks and Xero.
            </h1>

            <p className="text-base sm:text-lg text-[#52705F] max-w-[560px] leading-relaxed font-normal">
              Say goodbye to manual data entry and receipt chaos. Retalyy runs the monthly close end-to-end: vision document extraction, auto-categorization, bank reconciliation, and dynamic financial dashboards for each business. Accountants review roughly 5% of entries instead of touching 100%.
            </p>

            {/* Core pitch principles callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#0F7A41] bg-[#EDF9F1] border border-[#D9F0E2] p-3 rounded-2xl max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
                <span>Review ~5% of entries instead of touching 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
                <span>AI synthesizes a custom dashboard per business</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
                <span>Risk-free firm partnership pilot (flexible terms)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
                <span>Double client capacity with the exact same staff</span>
              </div>
            </div>

            {/* Three Iconic Functional Modules in First Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-xl pt-0.5">
              <div className="p-2.5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs hover:border-[#27B665] transition-all flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F7FCF9] border border-[#D9F0E2] flex items-center justify-center shrink-0 text-[#0C2B1C] shadow-xs">
                  <DocumentCalculatorPencilIcon className="w-6 h-6 text-[#0C2B1C]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0C2B1C]">First-Pass Ingest</div>
                  <div className="text-[10.5px] text-[#52705F] leading-tight">Bank feeds & SMS</div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs hover:border-[#27B665] transition-all flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F7FCF9] border border-[#D9F0E2] flex items-center justify-center shrink-0 text-[#0C2B1C] shadow-xs">
                  <FinancialDashboardReportIcon className="w-6 h-6 text-[#0C2B1C]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0C2B1C]">Continuous Books</div>
                  <div className="text-[10.5px] text-[#52705F] leading-tight">13-wk cash & jobs</div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs hover:border-[#27B665] transition-all flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F7FCF9] border border-[#D9F0E2] flex items-center justify-center shrink-0 shadow-xs">
                  <ClipboardAnalyticsCalculatorIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0C2B1C]">Two Workflows</div>
                  <div className="text-[10.5px] text-[#52705F] leading-tight">Firm OS & Direct Business</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button 
                onClick={() => setActiveTab('business_crm')} 
                className="ret-btn flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Launch Business AI Finance Dept</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button 
                onClick={() => setActiveTab('workspace')} 
                className="ret-btn secondary flex items-center gap-2 cursor-pointer"
              >
                <span>Accounting Firm Partner OS</span>
                <svg className="w-4 h-4 text-[#27B665]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Hero Column: Animated Platform Scan - Brought Upwards */}
          <div className="lg:col-span-5 self-start lg:sticky lg:top-24 mt-2 lg:mt-0">
            <div className="ret-card shadow-xl" aria-label="Animated example of Retalyy platform diagnostic">
              
              <div className="beam" />

              <div className="flex justify-between items-center font-bold mb-3.5">
                <div className="flex items-center gap-3">
                  <RetalyyIconMark size={32} />
                  <div>
                    <div className="font-display font-bold text-base text-[#0C2B1C]">Autonomous Accounting Core</div>
                    <div className="text-xs text-[#52705F] font-normal">Active Ledger: Tri-Valley Trades LLC (Migrated from QBO)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F7A41] bg-[#EDF9F1] px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping" />
                  <span>Dual Workflow Active</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#EEF6F1]">
                
                <div className={`h-16 flex items-center justify-between px-4 border-b border-[#EEF6F1] relative transition-all duration-500 ${activeHits.includes(0) ? 'bg-[#EDF9F1]' : 'bg-white'}`}>
                  <span className={`text-sm text-[#52705F] transition-opacity duration-300 ${activeHits.includes(0) ? 'opacity-0' : 'opacity-100'}`}>Inbound Draw</span>
                  <b className={`font-display text-base transition-opacity duration-300 ${activeHits.includes(0) ? 'opacity-0' : 'opacity-100'}`}>$148,500</b>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-sm text-[#0C2B1C] transition-opacity duration-300 ${activeHits.includes(0) ? 'opacity-100' : 'opacity-0'} flex items-center gap-2`}>
                    <SCorpShieldIcon size={20} />
                    <span>Auto-Coded: Progress Billing · Job #101</span>
                  </div>
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 bg-[#27B665] text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-md transition-all duration-500 ${activeHits.includes(0) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-6'}`}>
                    Matched
                  </div>
                </div>

                <div className={`h-16 flex items-center justify-between px-4 border-b border-[#EEF6F1] relative transition-all duration-500 ${activeHits.includes(1) ? 'bg-[#EDF9F1]' : 'bg-white'}`}>
                  <span className={`text-sm text-[#52705F] transition-opacity duration-300 ${activeHits.includes(1) ? 'opacity-0' : 'opacity-100'}`}>SMS Truck Receipt</span>
                  <b className={`font-display text-base transition-opacity duration-300 ${activeHits.includes(1) ? 'opacity-0' : 'opacity-100'}`}>$2,840</b>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-sm text-[#0C2B1C] transition-opacity duration-300 ${activeHits.includes(1) ? 'opacity-100' : 'opacity-0'} flex items-center gap-2`}>
                    <Solo401kVaultIcon size={20} />
                    <span>OCR Parsed: Subcontractor Parts & W-9</span>
                  </div>
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 bg-[#27B665] text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-md transition-all duration-500 ${activeHits.includes(1) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-6'}`}>
                    Classified
                  </div>
                </div>

                <div className={`h-16 flex items-center justify-between px-4 border-b border-[#EEF6F1] relative transition-all duration-500 ${activeHits.includes(2) ? 'bg-[#EDF9F1]' : 'bg-white'}`}>
                  <span className={`text-sm text-[#52705F] transition-opacity duration-300 ${activeHits.includes(2) ? 'opacity-0' : 'opacity-100'}`}>13-Wk Cash Forecast</span>
                  <b className={`font-display text-base transition-opacity duration-300 ${activeHits.includes(2) ? 'opacity-0' : 'opacity-100'}`}>Lender Pack</b>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-sm text-[#0C2B1C] transition-opacity duration-300 ${activeHits.includes(2) ? 'opacity-100' : 'opacity-0'} flex items-center gap-2`}>
                    <AccountablePlanIcon size={20} />
                    <span>On-Demand Bonding & Bank Reporting Pack</span>
                  </div>
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 bg-[#27B665] text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-md transition-all duration-500 ${activeHits.includes(2) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-6'}`}>
                    Verified
                  </div>
                </div>

                <div className={`h-16 flex items-center justify-between px-4 relative transition-all duration-500 ${activeHits.includes(3) ? 'bg-[#EDF9F1]' : 'bg-white'}`}>
                  <span className={`text-sm text-[#52705F] transition-opacity duration-300 ${activeHits.includes(3) ? 'opacity-0' : 'opacity-100'}`}>Operating Cash Reserve</span>
                  <b className={`font-display text-base transition-opacity duration-300 ${activeHits.includes(3) ? 'opacity-0' : 'opacity-100'}`}>Runway Buffer</b>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-sm text-[#0C2B1C] transition-opacity duration-300 ${activeHits.includes(3) ? 'opacity-100' : 'opacity-0'} flex items-center gap-2`}>
                    <SafeHarborBeaconIcon size={20} />
                    <span>Automated Cash Reserve Holdback ($4,280/mo)</span>
                  </div>
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 bg-[#27B665] text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-md transition-all duration-500 ${activeHits.includes(3) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-6'}`}>
                    Protected
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-end mt-5 px-1.5">
                <div>
                  <span className="text-xs text-[#52705F] block leading-snug">
                    Two Operating Modes<br />(Firm Partner Dashboard or Direct Business)
                  </span>
                  <div className="font-display font-extrabold text-2xl text-[#0C2B1C] mt-0.5">
                    Dual-Channel Flow
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#0F7A41] block">Delivery Architecture</span>
                  <span className="font-bold text-xs text-[#0C2B1C] bg-[#EDF9F1] px-2.5 py-1 rounded border border-[#D9F0E2] inline-block mt-1">
                    Firm OS · Direct Business
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </header>

      {/* INFINITE MARQUEE */}
      <div className="mq" aria-hidden="true">
        <div className="track">
          {tags.concat(tags).map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
      </div>

      {/* SECTION 2 & 3: CATEGORY PACKS & TARGET SIZE MATRIX (OCTOBER 15, 2026 BRIEF) */}
      <section className="py-20 bg-white border-b border-[#D9F0E2]">
        <div className="wrap space-y-16">
          
          {/* Part 1: B2C Universal Core + Category Packs */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="ret-pill mb-2">
                  <i />
                  <span>Section 3 · Multi-Industry Financial Management</span>
                </div>
                <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
                  One universal platform. Tailored for your specific industry.
                </h2>
                <p className="text-base text-[#52705F] mt-2 leading-relaxed">
                  Every business shares automated receipt capture, real-time bank feeds, and continuous reconciliation. Each industry pack adds specialized job costing, progress billing, or operational workflows on top.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('findings')}
                className="ret-btn sm secondary self-start md:self-auto"
              >
                Inspect All Category Rules →
              </button>
            </div>

            {/* Category Pack Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CATEGORY_PACKS.map((pack) => {
                const isSelected = activeCategory === pack.id;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setActiveCategory(pack.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#27B665] bg-[#EDF9F1] shadow-md ring-2 ring-[#27B665]/40 scale-[1.02]'
                        : 'border-[#D9F0E2] bg-white hover:border-[#8EDDA6] hover:bg-[#F9FCFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#0F7A41] bg-white px-2 py-0.5 rounded border border-[#D9F0E2]">
                        {pack.badge}
                      </span>
                    </div>
                    <div className="font-display font-bold text-sm text-[#0C2B1C] mb-1">
                      {pack.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#52705F]">
                      {pack.monthlyPriceAssumption}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Category Detail Card */}
            {(() => {
              const pack = CATEGORY_PACKS.find(p => p.id === activeCategory) || CATEGORY_PACKS[0];
              return (
                <div className="bg-[#FAFDFB] border-2 border-[#27B665]/30 rounded-3xl p-7 sm:p-9 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <RetalyyIconMark size={28} />
                      <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
                        {pack.name} Category Pack
                      </h3>
                      <span className="text-xs font-mono font-bold text-[#0F7A41] bg-[#EDF9F1] px-2.5 py-1 rounded-full border border-[#D9F0E2]">
                        {pack.monthlyPriceAssumption}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-bold text-[#0C2B1C] block text-xs uppercase tracking-wider font-mono text-[#52705F]">Target User</span>
                        <p className="text-[#0C2B1C] font-medium">{pack.who}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="p-4 rounded-2xl bg-white border border-[#D9F0E2]">
                          <span className="font-bold text-xs uppercase tracking-wider font-mono text-[#0F7A41] block mb-1">
                            Category Pack Rules (Added to Core)
                          </span>
                          <p className="text-xs text-[#52705F] leading-relaxed">
                            {pack.packRules}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-[#E9D9D9]">
                          <span className="font-bold text-xs uppercase tracking-wider font-mono text-[#C0392B] block mb-1">
                            Typical Money Pain Solved
                          </span>
                          <p className="text-xs text-[#52705F] leading-relaxed">
                            {pack.typicalMoneyPain}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-white border border-[#D9F0E2] rounded-2xl p-6 space-y-4 shadow-sm text-center">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#52705F]">
                      Deployment Sequence
                    </div>
                    <div className="font-display font-bold text-lg text-[#0C2B1C]">
                      {pack.id === 'trades' ? 'Launch Flagship Vertical' : 'Demand-Tested B2C Pack'}
                    </div>
                    <p className="text-xs text-[#52705F] leading-relaxed">
                      {pack.id === 'trades' 
                        ? 'Firm channel starts with trades and construction to build deep vertical defensibility.' 
                        : 'Universal platform powers automated receipt capture, vendor bill matching, and real-time cash flow monitoring with zero friction.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('portal')}
                      className="ret-btn sm w-full"
                    >
                      Test {pack.name} in Portal →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Part 2: Target Size Matrix ($2M to $30M Sweet Spot) */}
          <div className="pt-8 border-t border-[#EEF6F1] space-y-8">
            <div className="max-w-2xl">
              <div className="ret-pill mb-2">
                <i />
                <span>Section 2 · Best Target Size & Market Fit</span>
              </div>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
                The $2M to $30M sweet spot: too big for DIY, too small for a finance team.
              </h2>
              <p className="text-base text-[#52705F] mt-2 leading-relaxed">
                A UHY survey of 275+ middle-market owners found 45% outsource accounting partly or entirely. Accounting Today's Top 100 survey found Client Accounting Services (CAS) was the top niche, with 84% seeing surging demand.
              </p>
            </div>

            {/* Target Size Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {TARGET_SIZE_MATRIX.map((item, idx) => {
                const isSelected = activeTargetSize === idx;
                const isSweetSpot = item.fit === 'Best fit';
                return (
                  <div
                    key={item.segment}
                    onClick={() => setActiveTargetSize(idx)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                      isSweetSpot 
                        ? 'border-2 border-[#27B665] bg-[#FAFDFB] shadow-lg ring-2 ring-[#27B665]/20'
                        : isSelected
                        ? 'border-[#0C2B1C] bg-[#F7FBF8]'
                        : 'border-[#D9F0E2] bg-white hover:border-[#8EDDA6]'
                    }`}
                  >
                    {isSweetSpot && (
                      <div className="absolute -top-3 left-6 bg-[#27B665] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                        Primary Revenue Target
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        isSweetSpot 
                          ? 'bg-[#EDF9F1] text-[#0F7A41]' 
                          : 'bg-gray-100 text-[#52705F]'
                      }`}>
                        {item.fit}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#0C2B1C]">
                        {item.pricingHypothesis}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-[#0C2B1C] mb-1">
                      {item.segment}
                    </h3>

                    <div className="text-xs font-mono text-[#0F7A41] mb-2 font-medium">
                      {item.size} · {item.revenue}
                    </div>

                    <p className="text-xs text-[#52705F] leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC AI FINANCIAL DASHBOARD SHOWCASE (DIFFERENT DASHBOARDS FOR DIFFERENT BUSINESSES) */}
      <DynamicDashboardShowcaseSection
        onLaunchBusinessCrm={() => setActiveTab('business_crm')}
        onLaunchFirmCrm={() => setActiveTab('workspace')}
      />

      {/* SECTION 1: THE MECHANISM WITH SCROLL-DRIVEN 1->2->3 GLOW ANIMATION */}
      <section id="how" ref={mechanismRef} className="py-24 relative overflow-hidden bg-gradient-to-b from-white via-[#F7FCF9] to-white border-y border-[#E2F2E9]">
        
        {/* Ambient atmospheric backdrop glow */}
        <div 
          className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-[100px] -z-0 opacity-40 transition-all duration-700"
          style={{
            top: activeMechanismStep === 1 ? '10%' : activeMechanismStep === 2 ? '40%' : '70%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(142, 221, 166, 0.4), transparent 70%)'
          }}
        />

        <div className="wrap relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Sticky Left Column: Mechanism Overview & Live Step Controller */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6">
            
            <div className="ret-pill">
              <i />
              <span>Section 1 · How It Works: Two Clear Workflows</span>
            </div>

            <h2 className="text-[clamp(36px,4.5vw,60px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0C2B1C]">
              How Retalyy works: simplified for firms & businesses.
            </h2>

            <p className="text-lg text-[#52705F] leading-relaxed max-w-[500px]">
              Whether you need a high-powered partner dashboard for your accounting firm or a direct, hands-free finance engine for your business, Retalyy simplifies the entire pipeline in three steps.
            </p>

            {/* Interactive Step Navigator Widget */}
            <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-sm space-y-4 max-w-[440px]">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[#52705F] uppercase tracking-wider">Engine Sequence Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDF9F1] border border-[#D9F0E2] text-[#0F7A41]">
                  Step 0{activeMechanismStep} of 03 Active
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#EDF9F1] overflow-hidden border border-[#D9F0E2]/60">
                <div 
                  className="h-full bg-gradient-to-r from-[#27B665] via-[#8EDDA6] to-[#0F7A41] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.round(scrollLaserProgress * 100)}%` }}
                />
              </div>

              {/* 3 Step Selectors with Uploaded Icons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToStep(1)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    activeMechanismStep === 1
                      ? 'border-[#27B665] bg-[#EDF9F1] shadow-sm ring-1 ring-[#27B665]'
                      : 'border-[#E2F2E9] bg-white hover:border-[#8EDDA6] text-[#52705F]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <DocumentCalculatorPencilIcon className="w-4 h-4 text-[#0F7A41] shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-[#0F7A41]">01 INGEST</span>
                  </div>
                  <div className="text-xs font-bold text-[#0C2B1C] truncate mt-0.5">Data Feeds</div>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToStep(2)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    activeMechanismStep === 2
                      ? 'border-[#27B665] bg-[#EDF9F1] shadow-sm ring-1 ring-[#27B665]'
                      : 'border-[#E2F2E9] bg-white hover:border-[#8EDDA6] text-[#52705F]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <FinancialDashboardReportIcon className="w-4 h-4 text-[#0F7A41] shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-[#0F7A41]">02 AUTOMATE</span>
                  </div>
                  <div className="text-xs font-bold text-[#0C2B1C] truncate mt-0.5">Continuous Books</div>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToStep(3)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    activeMechanismStep === 3
                      ? 'border-[#27B665] bg-[#EDF9F1] shadow-sm ring-1 ring-[#27B665]'
                      : 'border-[#E2F2E9] bg-white hover:border-[#8EDDA6] text-[#52705F]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <ClipboardAnalyticsCalculatorIcon className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-[#0F7A41]">03 TWO PATHS</span>
                  </div>
                  <div className="text-xs font-bold text-[#0C2B1C] truncate mt-0.5">Firm or Direct</div>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11.5px] text-[#52705F] font-mono pt-1">
                <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping" />
                <span>Scroll down to see the glow transition 1 → 2 → 3</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setActiveTab('mission')}
                className="text-sm font-bold text-[#0F7A41] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Learn why we started Retalyy</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Step Cards with Connected Glowing Rail */}
          <div className="lg:col-span-7 relative">
            
            {/* Glowing Vertical Connector Spine */}
            <div className="hidden sm:block absolute left-9 top-14 bottom-14 w-[3px] bg-[#E2F2E9] rounded-full z-0 overflow-visible pointer-events-none">
              {/* Laser Fill Line */}
              <div 
                className="w-full bg-gradient-to-b from-[#27B665] via-[#8EDDA6] to-[#0F7A41] rounded-full laser-line-anim shadow-[0_0_12px_#27B665,0_0_24px_rgba(142,221,166,0.8)] transition-all duration-300"
                style={{ height: `${Math.round(scrollLaserProgress * 100)}%` }}
              />
              {/* Laser Head Photon Emitter */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#27B665] border-2 border-white shadow-[0_0_14px_#27B665] -translate-y-1/2 transition-all duration-300 pointer-events-none"
                style={{ top: `${Math.round(scrollLaserProgress * 100)}%` }}
              >
                <div className="w-full h-full rounded-full bg-[#8EDDA6] animate-ping opacity-75" />
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              
              {/* STEP 1 CARD */}
              <div
                ref={step1Ref}
                onClick={() => scrollToStep(1)}
                className={`p-8 sm:p-9 rounded-[30px] transition-all duration-500 cursor-pointer relative ${
                  activeMechanismStep === 1
                    ? 'border-2 border-[#27B665] bg-gradient-to-br from-[#F0FBF4] via-white to-[#E8F8EE] step-active-glow -translate-y-1 scale-[1.015]'
                    : activeMechanismStep > 1
                    ? 'border border-[#C6EDD4] bg-[#FAFDFB] hover:border-[#27B665]/60 hover:bg-[#F0FBF4]'
                    : 'border border-[#D9F0E2] bg-white opacity-90 hover:opacity-100 hover:border-[#8EDDA6]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span 
                      className={`w-12 h-12 rounded-full font-display font-extrabold text-lg flex items-center justify-center shrink-0 transition-all duration-500 ${
                        activeMechanismStep === 1
                          ? 'bg-[#27B665] text-white step-badge-radar shadow-[0_0_24px_rgba(39,182,101,0.9)] ring-4 ring-[#8EDDA6]/50'
                          : activeMechanismStep > 1
                          ? 'bg-[#0C2B1C] text-[#8EDDA6] ring-2 ring-[#27B665] shadow-sm'
                          : 'bg-white border-2 border-[#D9F0E2] text-[#52705F]'
                      }`}
                    >
                      {activeMechanismStep > 1 ? (
                        <svg className="w-6 h-6 text-[#8EDDA6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        '1'
                      )}
                    </span>

                    {/* Uploaded Icon 1: Document + Calculator + Pencil */}
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex items-center justify-center shrink-0 text-[#0C2B1C]">
                      <DocumentCalculatorPencilIcon className="w-8 h-8 text-[#0C2B1C]" />
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-bold text-[#0F7A41] uppercase tracking-wider">Step 01 · 1-Click Migration & Ingestion</div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0C2B1C]">Migrate from QuickBooks & Xero in 1 Click</h3>
                    </div>
                  </div>

                  {/* Status Indicator Tag */}
                  {activeMechanismStep === 1 ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#27B665]/15 border border-[#27B665]/40 text-xs font-mono font-bold text-[#0F7A41] self-start sm:self-auto shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping" />
                      <span>REPLACES QUICKBOOKS & XERO</span>
                    </div>
                  ) : activeMechanismStep > 1 ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C6EDD4] text-[11px] font-mono font-bold text-[#0F7A41] self-start sm:self-auto">
                      <span className="text-[#27B665]">✓</span>
                      <span>MIGRATION COMPLETE</span>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-[#52705F] self-start sm:self-auto">
                      Ready to migrate
                    </div>
                  )}
                </div>

                <p className="text-[#52705F] text-[15.5px] leading-relaxed">
                  Replace legacy QuickBooks or Xero without losing historical records. Retalyy imports full chart of accounts, bank feeds, and journal histories in one click—or starts fresh with automated bank feeds and text receipt photos from job sites.
                </p>

                {/* Live Ingestion Telemetry Cards (Dynamic glow state) */}
                <div className={`mt-5 pt-4 border-t border-[#D9F0E2] grid grid-cols-1 sm:grid-cols-3 gap-2.5 transition-all duration-300 ${
                  activeMechanismStep === 1 ? 'opacity-100' : 'opacity-85'
                }`}>
                  <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D9F0E2] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#0C2B1C]">QBO / Xero Migration</span>
                    <span className="text-[10px] font-mono font-bold text-[#0F7A41] bg-[#EDF9F1] px-1.5 py-0.5 rounded">1-Click Full</span>
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D9F0E2] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#0C2B1C]">SMS Truck Receipts</span>
                    <span className="text-[10px] font-mono font-bold text-[#0F7A41] bg-[#EDF9F1] px-1.5 py-0.5 rounded">OCR 99.8%</span>
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#D9F0E2] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#0C2B1C]">Exception Queue</span>
                    <span className="text-[10px] font-mono font-bold text-[#0F7A41] bg-[#EDF9F1] px-1.5 py-0.5 rounded">&lt;6% Rate</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <div className="text-xs font-bold text-[#0F7A41] bg-white border border-[#D9F0E2] px-3.5 py-1.5 rounded-full shadow-sm">
                    Traceable to Source Document
                  </div>
                  <div className="text-xs font-bold text-[#52705F] bg-white/80 border border-[#D9F0E2] px-3 py-1.5 rounded-full">
                    Done-for-You Setup & Migration
                  </div>
                </div>
              </div>

              {/* STEP 2 CARD */}
              <div
                ref={step2Ref}
                onClick={() => scrollToStep(2)}
                className={`p-8 sm:p-9 rounded-[30px] transition-all duration-500 cursor-pointer relative ${
                  activeMechanismStep === 2
                    ? 'border-2 border-[#27B665] bg-gradient-to-br from-[#F0FBF4] via-white to-[#E8F8EE] step-active-glow -translate-y-1 scale-[1.015]'
                    : activeMechanismStep > 2
                    ? 'border border-[#C6EDD4] bg-[#FAFDFB] hover:border-[#27B665]/60 hover:bg-[#F0FBF4]'
                    : 'border border-[#D9F0E2] bg-white opacity-90 hover:opacity-100 hover:border-[#8EDDA6]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span 
                      className={`w-12 h-12 rounded-full font-display font-extrabold text-lg flex items-center justify-center shrink-0 transition-all duration-500 ${
                        activeMechanismStep === 2
                          ? 'bg-[#27B665] text-white step-badge-radar shadow-[0_0_24px_rgba(39,182,101,0.9)] ring-4 ring-[#8EDDA6]/50'
                          : activeMechanismStep > 2
                          ? 'bg-[#0C2B1C] text-[#8EDDA6] ring-2 ring-[#27B665] shadow-sm'
                          : 'bg-white border-2 border-[#D9F0E2] text-[#52705F]'
                      }`}
                    >
                      {activeMechanismStep > 2 ? (
                        <svg className="w-6 h-6 text-[#8EDDA6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        '2'
                      )}
                    </span>

                    {/* Uploaded Icon 2: Financial Dashboard Screen with Dollar Badge, Bar Chart, and Pie Chart */}
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex items-center justify-center shrink-0 text-[#0C2B1C]">
                      <FinancialDashboardReportIcon className="w-8 h-8 text-[#0C2B1C]" />
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-bold text-[#0F7A41] uppercase tracking-wider">Step 02 · Cost Tracking & Forecast</div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0C2B1C]">Job Costing & 13-Week Cash Forecast</h3>
                    </div>
                  </div>

                  {/* Status Indicator Tag */}
                  {activeMechanismStep === 2 ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#27B665]/15 border border-[#27B665]/40 text-xs font-mono font-bold text-[#0F7A41] self-start sm:self-auto shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping" />
                      <span>AUTONOMOUS FORECASTING</span>
                    </div>
                  ) : activeMechanismStep > 2 ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C6EDD4] text-[11px] font-mono font-bold text-[#0F7A41] self-start sm:self-auto">
                      <span className="text-[#27B665]">✓</span>
                      <span>MODELING LOCKED</span>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-[#52705F] self-start sm:self-auto">
                      Awaiting step 1 feed
                    </div>
                  )}
                </div>

                <p className="text-[#52705F] text-[15.5px] leading-relaxed">
                  As revenue and invoices arrive, Retalyy calculates budget vs. actuals, flags cost overruns before jobs finish, maintains running cash reserves per project, and builds 13-week cash projections for lenders and bonding agents.
                </p>

                {/* Real-Time Alpha Telemetry readout */}
                <div className={`mt-5 pt-4 border-t border-[#D9F0E2] grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300 ${
                  activeMechanismStep === 2 ? 'opacity-100' : 'opacity-85'
                }`}>
                  <div className="p-3.5 rounded-xl bg-white border border-[#D9F0E2] space-y-1">
                    <div className="text-[11px] font-mono text-[#52705F]">13-Week Cash Runway</div>
                    <div className="font-display font-extrabold text-lg text-[#0C2B1C]">$180,600 <span className="text-xs font-normal text-[#0F7A41]">/Lender Pack Ready</span></div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#D9F0E2] space-y-1">
                    <div className="text-[11px] font-mono text-[#52705F]">Job Cost Margin Alerts</div>
                    <div className="font-display font-extrabold text-lg text-[#0F7A41]">24.3% Avg Margin <span className="text-xs font-normal text-[#52705F]">(Healthy)</span></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <div className="text-xs font-bold text-[#0F7A41] bg-white border border-[#D9F0E2] px-3.5 py-1.5 rounded-full shadow-sm">
                    Working Capital & Reserve Protection
                  </div>
                  <div className="text-xs font-bold text-[#52705F] bg-white/80 border border-[#D9F0E2] px-3 py-1.5 rounded-full">
                    Subcontractor 1099 Tracking
                  </div>
                </div>
              </div>

              {/* STEP 3 CARD */}
              <div
                ref={step3Ref}
                onClick={() => scrollToStep(3)}
                className={`p-8 sm:p-9 rounded-[30px] transition-all duration-500 cursor-pointer relative ${
                  activeMechanismStep === 3
                    ? 'border-2 border-[#27B665] bg-gradient-to-br from-[#F0FBF4] via-white to-[#E8F8EE] step-active-glow -translate-y-1 scale-[1.015]'
                    : 'border border-[#D9F0E2] bg-white opacity-90 hover:opacity-100 hover:border-[#8EDDA6]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span 
                      className={`w-12 h-12 rounded-full font-display font-extrabold text-lg flex items-center justify-center shrink-0 transition-all duration-500 ${
                        activeMechanismStep === 3
                          ? 'bg-[#27B665] text-white step-badge-radar shadow-[0_0_24px_rgba(39,182,101,0.9)] ring-4 ring-[#8EDDA6]/50'
                          : 'bg-white border-2 border-[#D9F0E2] text-[#52705F]'
                      }`}
                    >
                      3
                    </span>

                    {/* Uploaded Icon 3: Clipboard with Analytics Charts and Modern Front-Facing Calculator */}
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex items-center justify-center shrink-0">
                      <ClipboardAnalyticsCalculatorIcon className="w-8 h-8" />
                    </div>

                    <div>
                      <div className="text-[11px] font-mono font-bold text-[#0F7A41] uppercase tracking-wider">Step 03 · Two Ways We Work</div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0C2B1C]">Firm Partnership Dashboard or Direct Business Delivery</h3>
                    </div>
                  </div>

                  {/* Status Indicator Tag */}
                  {activeMechanismStep === 3 ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#27B665]/15 border border-[#27B665]/40 text-xs font-mono font-bold text-[#0F7A41] self-start sm:self-auto shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping" />
                      <span>FIRM PARTNER OS · DIRECT BUSINESS FINANCE</span>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-[#52705F] self-start sm:self-auto">
                      Two flexible delivery modes
                    </div>
                  )}
                </div>

                <p className="text-[#52705F] text-[15.5px] leading-relaxed">
                  1. Accounting Firm Partnership: Firms use our purpose-built dashboard to automate client books, review exceptions in minutes, and scale capacity. 2. Direct Business Finance: Companies work with us directly to run autonomous bookkeeping, job costing, and cash forecasting.
                </p>

                {/* CPA Attestation Badge Container */}
                <div className={`mt-5 pt-4 border-t border-[#D9F0E2] grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all duration-300 ${
                  activeMechanismStep === 3 ? 'opacity-100' : 'opacity-85'
                }`}>
                  <div className="p-3.5 rounded-xl bg-white border border-[#D9F0E2] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EDF9F1] border border-[#27B665] flex items-center justify-center text-xs font-bold text-[#0F7A41]">
                      FIRM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0C2B1C]">Accounting Firm Partnership</div>
                      <div className="text-[11px] font-mono text-[#52705F]">Dedicated Multi-Client Dashboard & Fast Triage</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#D9F0E2] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EDF9F1] border border-[#27B665] flex items-center justify-center text-xs font-bold text-[#0F7A41]">
                      DIRECT
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0C2B1C]">Direct Business Operations</div>
                      <div className="text-[11px] font-mono text-[#52705F]">Autonomous Daily Books & Cash Runway</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <div className="text-xs font-bold text-[#0F7A41] bg-white border border-[#D9F0E2] px-3.5 py-1.5 rounded-full shadow-sm">
                    Firms Scale Client Capacity Without Added Headcount
                  </div>
                  <div className="text-xs font-bold text-[#52705F] bg-white/80 border border-[#D9F0E2] px-3 py-1.5 rounded-full">
                    Businesses Gain Real-Time Financial Visibility & Clean Books
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* THE 95/5 CLOSE ENGINE, KEYBOARD REVIEW QUEUE & 5 INVARIANTS */}
      <ReviewQueueShowcaseSection
        onExploreFirmPartner={() => setActiveTab('workspace')}
        onExploreDirectBusiness={() => setActiveTab('business_crm')}
      />

      {/* SECTION 7: PITCH & OUTREACH DISCIPLINE (SELL CAPACITY, NOT AI) */}
      <section className="py-20 bg-white border-b border-[#D9F0E2]">
        <div className="wrap space-y-10">
          <div className="max-w-2xl">
            <div className="ret-pill mb-2">
              <i />
              <span>Section 7 · Commercial Discipline</span>
            </div>
            <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
              Sell capacity and lower risk. Never sell AI hype.
            </h2>
            <p className="text-base text-[#52705F] mt-2 leading-relaxed">
              General AI for accountants does not win. We never say "replace your accountant" or "tax lawyer in a box." We measure hours saved per close and keep the firm's name on every output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PITCH_RULES.map((rule, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C0392B] bg-red-50 border border-red-200 px-2 py-0.5 rounded inline-block">
                    Avoid Saying
                  </span>
                  <div className="font-display font-bold text-sm text-[#52705F] line-through pt-1">
                    "{rule.avoid}"
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-[#EEF6F1]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F7A41] bg-[#EDF9F1] border border-[#D9F0E2] px-2 py-0.5 rounded inline-block">
                    Say Instead
                  </span>
                  <div className="font-display font-bold text-base text-[#0C2B1C] pt-1">
                    "{rule.sayInstead}"
                  </div>
                </div>

                <p className="text-xs text-[#52705F] leading-relaxed pt-2 border-t border-[#EEF6F1]">
                  {rule.rationale}
                </p>
              </div>
            ))}
          </div>

          {/* Pilot Guarantee Card */}
          <div className="bg-[#0C2B1C] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-mono font-bold uppercase text-[#8EDDA6] tracking-wider">
                Risk-Free Commercial Gate
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Risk-free firm partnership pilot.
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                We handle 100% of setup and data migration. Your name stays on everything, and your team reviews everything through our dedicated firm dashboard. Pay only after your pilot if close time falls at least 40%.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('firms')}
              className="ret-btn bg-[#27B665] text-white hover:bg-[#8EDDA6] shrink-0"
            >
              Start Firm Partnership Pilot →
            </button>
          </div>
        </div>
      </section>

      {/* S-CORP INTERACTIVE CASH FLOW PIPELINE */}
      <section className="py-10">
        <div className="wrap">
          <SCorpFlowDiagram />
        </div>
      </section>

      {/* OPERATIONAL CAPACITY SIMULATOR */}
      <section id="calc" className="py-12">
        <div className="wrap">
          <div className="bg-[#EDF9F1] border border-[#D9F0E2] rounded-[40px] p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative overflow-hidden">
            
            <div>
              <h2 className="text-[clamp(32px,4vw,54px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
                Model Operational Cash Flow & Cost Efficiency
              </h2>

              <label htmlFor="portal-income" className="font-bold text-sm text-[#0C2B1C] block mt-8 mb-1">
                Your annual business revenue
              </label>

              <div className="font-display font-extrabold text-[clamp(36px,5vw,56px)] tracking-[-0.04em] text-[#0C2B1C] mb-4 tabular-nums">
                {formatMoney(calcIncome)}
              </div>

              <input
                id="portal-income"
                type="range"
                min={75000}
                max={400000}
                step={5000}
                value={calcIncome}
                style={{ '--f': `${sliderFillPercent}%` } as any}
                onChange={(e) => setCalcIncome(Number(e.target.value))}
                aria-label="Annual business revenue"
              />

              <p className="text-[13px] text-[#52705F] mt-5 leading-relaxed">
                Illustrative model for multi-industry business operations. Estimates administrative hours and operational costs reclaimed through automated bookkeeping and job costing.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="ret-btn sm"
                >
                  Explore Operations Engine →
                </button>
                <button
                  onClick={() => setActiveTab('portal')}
                  className="ret-btn sm secondary"
                >
                  View Client Portal
                </button>
              </div>
            </div>

            <div>
              <div className="flex gap-6 items-end h-[240px]">
                <div className="flex-1 rounded-t-[20px] rounded-b-[8px] bg-white border border-[#D9F0E2] p-4 flex flex-col justify-between h-full">
                  <small className="font-medium text-[#52705F] text-xs">Manual overhead</small>
                  <b className="font-display font-extrabold text-xl text-[#0C2B1C] tabular-nums">
                    {formatMoney(taxToday)}
                  </b>
                </div>

                <div 
                  className="flex-1 rounded-t-[20px] rounded-b-[8px] bg-gradient-to-b from-[#8EDDA6] to-[#27B665] text-white p-4 flex flex-col justify-between transition-all duration-500"
                  style={{ height: `${barBHeightPercent}%` }}
                >
                  <small className="font-medium text-white/90 text-xs">With Retalyy OS</small>
                  <b className="font-display font-extrabold text-xl text-white tabular-nums">
                    {formatMoney(taxWithPlan)}
                  </b>
                </div>
              </div>

              <div className="mt-6">
                <div className="font-display font-extrabold text-[clamp(32px,4vw,50px)] tracking-[-0.04em] text-[#0F7A41] tabular-nums leading-none">
                  {formatMoney(targetSavings)}
                </div>
                <p className="text-xs text-[#52705F] mt-1.5 font-medium">
                  estimated annual operational savings & hours reclaimed for growth
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SCHEDULE C INSPECTOR */}
      <section className="py-10">
        <div className="wrap">
          <ScheduleCInspector />
        </div>
      </section>

      {/* CPA TEAM CREDENTIAL CRESTS */}
      <section className="py-12 bg-[#EDF9F1] border-y border-[#D9F0E2]">
        <div className="wrap space-y-8">
          <div className="max-w-xl">
            <div className="ret-pill mb-2">
              <i />
              <span>Our Operational Model</span>
            </div>
            <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
              How We Work: Two Streams, One Core Engine
            </h2>
            <p className="text-base text-[#52705F] mt-1">
              We simplify finance operations through two clear paths: a dedicated partner dashboard for accounting firms, and an all-in-one autonomous finance department for businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CpaCredentialBadge 
              name="Accounting Firm Partners"
              title="Firm Partnership Workflow"
              license="Multi-Client Firm Dashboard"
              initials="FP"
              bio="We partner with accounting practices that manage contractor and SMB clients. Firms use our pre-built dashboard to view live client feeds, auto-code transactions, and review draft closes in minutes."
            />
            <CpaCredentialBadge 
              name="Direct Businesses"
              title="Direct Business Workflow"
              license="Autonomous AI Finance Dept"
              initials="DB"
              bio="We work directly with businesses to take over daily receipt capture, continuous bank reconciliation, project cost tracking, and cash forecasting so owners never worry about messy books."
            />
            <CpaCredentialBadge 
              name="Unified Ledger Core"
              title="QuickBooks & Xero Replacement"
              license="Modern Ledger Architecture"
              initials="UL"
              bio="Retalyy completely replaces legacy accounting tools with a native double-entry ledger. Every transaction is matched to source receipts, verified against accounting rules, and structured for real-time reporting."
            />
          </div>

          <VaultSecuritySeal />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16">
        <div className="wrap space-y-10">
          <div>
            <h2 className="text-[clamp(34px,4.5vw,58px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C]">
              Transparent SaaS Pricing
            </h2>
            <p className="text-base text-[#52705F] mt-2">
              Every plan delivers multiples of its cost in verified capital returned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            
            <div className="border border-[#D9F0E2] rounded-[30px] p-9 bg-white transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-[#0F7A41]/10 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">Starter Management OS</h3>
                <div className="font-display font-extrabold text-5xl tracking-[-0.04em] my-3.5 text-[#0C2B1C]">
                  $0
                </div>
                <small className="text-[#52705F] text-sm block">Continuous ledger sync & expense categorization</small>
                <ul className="mt-6 space-y-2.5 text-sm text-[#0C2B1C]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#27B665] font-bold">✓</span>
                    <span>Full general ledger line-item categorization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#27B665] font-bold">✓</span>
                    <span>Real-time budget vs. actual variance analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#27B665] font-bold">✓</span>
                    <span>Client Portal access with role-based access control</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setActiveTab('portal')}
                  className="ret-btn sm secondary w-full text-center"
                >
                  Enter Client Portal
                </button>
              </div>
            </div>

            <div className="rounded-[30px] p-9 bg-[#0C2B1C] text-white border border-[#0C2B1C] transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">Retalyy Pro Platform</h3>
                <div className="font-display font-extrabold text-5xl tracking-[-0.04em] my-3.5 text-white">
                  from $79<small className="font-sans font-medium text-base tracking-normal text-white/70">/mo</small>
                </div>
                <small className="text-white/70 text-sm block">billed annually · complete autonomous operations</small>
                <ul className="mt-6 space-y-2.5 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <span className="text-[#8EDDA6] font-bold">✓</span>
                    <span>Continuous Gusto & Mercury bank sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8EDDA6] font-bold">✓</span>
                    <span>Automated cash reserve & runway tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8EDDA6] font-bold">✓</span>
                    <span>Direct financial operations support & live chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8EDDA6] font-bold">✓</span>
                    <span>Annual Financial Reporting Binder + full audit trail</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setActiveTab('portal')}
                  className="ret-btn sm w-full text-center"
                >
                  Launch Retalyy Pro
                </button>
              </div>
            </div>

          </div>

          <div className="p-6 rounded-[22px] bg-[#EDF9F1] border border-[#D9F0E2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-[#0C2B1C] text-sm">Are you a high-volume accounting or bookkeeping firm?</div>
              <div className="text-xs text-[#52705F]">We offer dedicated partner dashboard access, batch client onboarding, and a flexible risk-free partnership pilot.</div>
            </div>
            <button
              onClick={() => setActiveTab('firms')}
              className="ret-btn sm secondary shrink-0"
            >
              Explore Firm Partnership →
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CONVERSION CTA */}
      <section id="start" className="py-12">
        <div className="wrap">
          <div className="text-center bg-[#EDF9F1] border border-[#D9F0E2] rounded-[48px] py-16 sm:py-24 px-6 relative overflow-hidden">
            <div className="blob b1 -top-32 -left-20 opacity-50" />
            
            <h2 className="relative mx-auto text-[clamp(34px,5vw,60px)] font-extrabold text-[#0C2B1C] max-w-[15ch] leading-[1.05]">
              Transform your financial operations into an asset.
            </h2>
            <p className="relative mx-auto text-lg text-[#52705F] mt-4 max-w-[500px]">
              Access our financial operations portal today or connect with our partnership desk.
            </p>

            <div className="relative flex flex-wrap gap-3 justify-center mt-9 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('portal')}
                className="ret-btn"
              >
                Launch Client Portal
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="ret-btn secondary"
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
