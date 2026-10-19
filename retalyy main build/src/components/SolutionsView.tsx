import React, { useState } from 'react';
import { NavigationTab, FunctionalityModule } from '../types';
import { EXACT_FUNCTIONALITIES, SAMPLE_JOB_COSTS, SAMPLE_13_WEEK_FORECAST } from '../data/briefData';
import { RetalyyIconMark } from './RetalyyLogo';

interface SolutionsViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
  initialSelectedModuleId?: string;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({ 
  setActiveTab, 
  onOpenBooking,
  initialSelectedModuleId = 'vertical-workspace'
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'Launch' | 'Phase 2' | 'Phase 3'>('all');
  const [activeModuleId, setActiveModuleId] = useState<string>(initialSelectedModuleId);
  const [interactiveJobIndex, setInteractiveJobIndex] = useState(0);
  const [forecastHorizon, setForecastHorizon] = useState<4 | 8 | 13>(8);
  const [sampleInvoiceAmount, setSampleInvoiceAmount] = useState(14500);

  const filteredModules = selectedPhase === 'all' 
    ? EXACT_FUNCTIONALITIES 
    : EXACT_FUNCTIONALITIES.filter(m => m.phaseBadge === selectedPhase);

  const activeModule = EXACT_FUNCTIONALITIES.find(m => m.id === activeModuleId) || EXACT_FUNCTIONALITIES[0];
  const activeJob = SAMPLE_JOB_COSTS[interactiveJobIndex];

  // Quick calculations for interactive modules
  const estimatedTaxSetAside = Math.round(sampleInvoiceAmount * 0.285);
  const safeHarborEscrow = Math.round(sampleInvoiceAmount * 0.153);
  const netOperatingCash = sampleInvoiceAmount - estimatedTaxSetAside;

  return (
    <div className="wrap py-12 space-y-16">
      
      {/* Header & Positioning from Section 1 & 5 */}
      <div className="max-w-4xl space-y-5">
        <div className="flex items-center gap-2.5">
          <RetalyyIconMark size={26} />
          <div className="ret-pill">
            <i />
            <span>Retalyy Solutions · Final Startup Brief (Section 5)</span>
          </div>
        </div>
        
        <h1 className="text-[clamp(34px,4.8vw,64px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
          One unified ledger. Nine exact functional solutions.
        </h1>
        
        <p className="text-lg sm:text-xl text-[#52705F] leading-relaxed">
          One ledger and data layer sits under every module, built to replace QuickBooks and Xero with one coherent modern system rather than fragmented legacy tools. Prepares the first pass of bookkeeping, cost tracking, budgeting, and financial analysis—supporting both accounting firm partner dashboards and direct business finance operations.
        </p>

        {/* Strategic Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#F7FCF9] border border-[#D9F0E2]">
            <span className="font-bold text-[#0F7A41] block mb-1">UNIFIED LEDGER</span>
            <span className="text-[#52705F]">Every entry traceable to source document & classifying rule.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FCF9] border border-[#D9F0E2]">
            <span className="font-bold text-[#0F7A41] block mb-1">TWO OPERATING PATHS</span>
            <span className="text-[#52705F]">Seamless firm partner dashboard or direct business finance engine.</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FCF9] border border-[#D9F0E2]">
            <span className="font-bold text-[#0F7A41] block mb-1">DONE-FOR-YOU MIGRATION</span>
            <span className="text-[#52705F]">Risk-free partnership pilot with flexible terms; setup 100% handled.</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs by Phase */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9F0E2] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedPhase === 'all'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-white text-[#52705F] hover:bg-[#F2FAF5] border border-[#D9F0E2]'
            }`}
          >
            All Solutions ({EXACT_FUNCTIONALITIES.length})
          </button>
          <button
            onClick={() => setSelectedPhase('Launch')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedPhase === 'Launch'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-white text-[#52705F] hover:bg-[#F2FAF5] border border-[#D9F0E2]'
            }`}
          >
            Launch (Phase 1)
          </button>
          <button
            onClick={() => setSelectedPhase('Phase 2')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedPhase === 'Phase 2'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-white text-[#52705F] hover:bg-[#F2FAF5] border border-[#D9F0E2]'
            }`}
          >
            Phase 2 Solutions
          </button>
          <button
            onClick={() => setSelectedPhase('Phase 3')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedPhase === 'Phase 3'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-white text-[#52705F] hover:bg-[#F2FAF5] border border-[#D9F0E2]'
            }`}
          >
            Phase 3 (Managed Service)
          </button>
        </div>

        <div className="text-xs font-mono text-[#52705F]">
          Showing {filteredModules.length} functional modules
        </div>
      </div>

      {/* Main Grid: Interactive Module Selector + Deep Dive Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of Modules */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-neutral-400 font-semibold px-2">
            Section 5 Functionality Modules
          </div>
          
          <div className="space-y-2">
            {filteredModules.map((module) => {
              const isSelected = module.id === activeModule.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModuleId(module.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white border-[#27B665] shadow-lg ring-2 ring-[#27B665]/20'
                      : 'bg-white/80 border-[#E2F2E9] hover:bg-white hover:border-[#8EDDA6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[15px] font-bold text-[#0C2B1C]">
                      {module.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      module.phaseBadge === 'Launch'
                        ? 'bg-[#EDF9F1] text-[#0F7A41] border border-[#D9F0E2]'
                        : module.phaseBadge === 'Phase 2'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {module.phase}
                    </span>
                  </div>

                  <p className="text-xs text-[#52705F] line-clamp-2 leading-relaxed">
                    {module.exactFunctions}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-100">
                    <span className="truncate max-w-[200px]">Target: {module.targetCustomer}</span>
                    <span className="text-[#0F7A41] font-semibold">Inspect →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Showcase & Live Simulator for Selected Solution */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-xl space-y-6 lg:sticky lg:top-28">
          
          {/* Top Banner for Active Solution */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EEF6F1]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#0F7A41] font-bold bg-[#EDF9F1] px-2 py-0.5 rounded border border-[#D9F0E2]">
                  {activeModule.phase}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Target: {activeModule.targetCustomer}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0C2B1C]">
                {activeModule.name}
              </h2>
            </div>

            <button
              onClick={onOpenBooking}
              className="ret-btn sm self-start shrink-0"
            >
              Test in Pilot →
            </button>
          </div>

          {/* Section 5 Exact Functions Specification */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
              Exact Functions (Startup Brief §5)
            </div>
            <div className="p-4 rounded-2xl bg-[#F7FCF9] border border-[#D9F0E2] text-sm text-[#0C2B1C] font-medium leading-relaxed font-sans">
              "{activeModule.exactFunctions}"
            </div>
          </div>

          {/* Problem Solved & Test Metric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1">
              <span className="font-mono font-bold text-neutral-500 uppercase block">Exact Problem Solved</span>
              <p className="text-neutral-800 leading-relaxed">{activeModule.solvedProblem}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#EDF9F1] border border-[#D9F0E2] space-y-1">
              <span className="font-mono font-bold text-[#0F7A41] uppercase block">Validation Metric to Test</span>
              <p className="text-[#0C2B1C] font-medium leading-relaxed">{activeModule.metricToTest}</p>
            </div>
          </div>

          {/* Core Capabilities Checklist */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
              System Capabilities & Controls
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {activeModule.capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-800">
                  <span className="w-4 h-4 rounded-full bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    ✓
                  </span>
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE SIMULATOR BASED ON CURRENT MODULE */}
          <div className="pt-4 border-t border-[#EEF6F1]">
            <div className="text-xs font-mono uppercase tracking-wider text-[#0F7A41] font-bold mb-3 flex items-center justify-between">
              <span>Interactive Solution Preview</span>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-normal">Real-Time Engine</span>
            </div>

            {/* Case 1: Cost Tracking Simulator */}
            {activeModule.id === 'cost-tracking' && (
              <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>LIVE JOB COST LEDGER (BID VS ACTUAL)</span>
                  <div className="flex gap-1">
                    {SAMPLE_JOB_COSTS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setInteractiveJobIndex(i)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold cursor-pointer ${
                          interactiveJobIndex === i ? 'bg-[#27B665] text-white' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-bold text-white flex items-center justify-between">
                    <span>{activeJob.client}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                      activeJob.marginStatus === 'healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      activeJob.marginStatus === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {activeJob.currentMarginPercent}% Margin ({activeJob.marginStatus.toUpperCase()})
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">{activeJob.description}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-neutral-800">
                    <span className="text-neutral-400 text-[10px] block">BID TOTAL</span>
                    <span className="font-bold text-white">${activeJob.bidAmount.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-800">
                    <span className="text-neutral-400 text-[10px] block">ACTUAL TO DATE</span>
                    <span className="font-bold text-amber-400">${activeJob.actualCost.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-800">
                    <span className="text-neutral-400 text-[10px] block">PROJECTED PROFIT</span>
                    <span className="font-bold text-emerald-400">${activeJob.projectedProfit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between pt-1">
                  <span>Progress Billed: {activeJob.progressBillingPercent}%</span>
                  <span>1099s Chased: {activeJob.sub1099sChased ? '✓ Compliant' : '⚠ Missing W-9'}</span>
                </div>
              </div>
            )}

            {/* Case 2: Budget & Forecasting Simulator */}
            {activeModule.id === 'budget-forecasting' && (
              <div className="p-4 rounded-2xl bg-[#0C2B1C] text-white space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8EDDA6]">13-WEEK CASH FORECAST HORIZON</span>
                  <div className="flex gap-1">
                    {([4, 8, 13] as const).map(w => (
                      <button
                        key={w}
                        onClick={() => setForecastHorizon(w)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          forecastHorizon === w ? 'bg-[#27B665] text-white' : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {w} Wks
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  {SAMPLE_13_WEEK_FORECAST.slice(0, Math.min(forecastHorizon, 4)).map((week) => (
                    <div key={week.weekNumber} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/50">{week.weekDate}</div>
                      <div className="font-bold text-[#46D279] text-sm">+${(week.inflow / 1000).toFixed(0)}k</div>
                      <div className="text-white/70 text-[10px]">Bal: ${(week.projectedBalance / 1000).toFixed(0)}k</div>
                      <div className="text-[9px] text-[#8EDDA6] mt-1 border-t border-white/10 pt-1">
                        Res: ${(week.safeHarborReserve / 1000).toFixed(1)}k
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-[#8EDDA6] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#46D279] animate-ping" />
                  <span>Safe harbor reserve dynamically escrowed prior to net operating release.</span>
                </div>
              </div>
            )}

            {/* Case 3: Tax Planning Simulator */}
            {activeModule.id === 'tax-planning' && (
              <div className="p-4 rounded-2xl bg-white border border-[#D9F0E2] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#52705F]">
                  <span>RUNNING TAX SET-ASIDE PER INVOICE</span>
                  <span className="font-bold text-[#0C2B1C]">${sampleInvoiceAmount.toLocaleString()} Invoice</span>
                </div>

                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="500"
                  value={sampleInvoiceAmount}
                  onChange={(e) => setSampleInvoiceAmount(Number(e.target.value))}
                  className="w-full accent-[#27B665] cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                  <div className="p-2 rounded-lg bg-[#EDF9F1] border border-[#D9F0E2]">
                    <span className="text-[#0F7A41] text-[10px] block">TOTAL TAX SET-ASIDE</span>
                    <span className="font-bold text-[#0C2B1C]">${estimatedTaxSetAside.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-blue-700 text-[10px] block">SAFE HARBOR ESCROW</span>
                    <span className="font-bold text-blue-900">${safeHarborEscrow.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500 text-[10px] block">NET OPERATING CASH</span>
                    <span className="font-bold text-neutral-900">${netOperatingCash.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#52705F] font-mono">
                  Citation: IRC § 6654(d)(1)(B) & Treasury Reg § 1.6654-2(a) Safe Harbor Algorithm
                </div>
              </div>
            )}

            {/* Case 4: Control Layer (Review Queue) */}
            {activeModule.id === 'control-layer' && (
              <div className="p-4 rounded-2xl bg-white border border-[#D9F0E2] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center font-bold text-xs">
                      REV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0C2B1C]">Review Queue & Quality Control</div>
                      <div className="text-[10px] font-mono text-neutral-500">Automated exception triage & verified audit trail</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#EDF9F1] text-[#0F7A41] px-2 py-0.5 rounded border border-[#D9F0E2]">
                    REVIEW QUEUE GATE
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono space-y-1">
                  <div className="text-neutral-500">Exception Triage Queue: 0 pending · 42 verified without edits</div>
                  <div className="text-[#0F7A41] font-semibold">✓ Automated checks passed with complete source-document traceability.</div>
                </div>
              </div>
            )}

            {/* Default Case for other modules */}
            {activeModule.id !== 'cost-tracking' && activeModule.id !== 'budget-forecasting' && activeModule.id !== 'tax-planning' && activeModule.id !== 'control-layer' && (
              <div className="p-4 rounded-2xl bg-[#F7FCF9] border border-[#D9F0E2] text-xs text-[#52705F] space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[#0C2B1C]">UNIFIED LEDGER ARCHITECTURE</span>
                  <span className="text-[#0F7A41]">Zero-Knowledge Encrypted</span>
                </div>
                <p>
                  Every transaction processed under <strong>{activeModule.name}</strong> maintains an immutable cryptographically verifiable link to the underlying bank feed, receipt capture, and classifying tax rule.
                </p>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#0F7A41] pt-1">
                  <span>• Plaid API 2.0</span>
                  <span>• QBO / Xero Replacement</span>
                  <span>• Enterprise AES-256 Cloud</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Risk-Free Partnership Pilot Callout */}
      <div className="bg-[#0C2B1C] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#27B665]/15 blur-[90px] pointer-events-none -top-24 -right-24" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="ret-pill">
            <i />
            <span>Firm Channel Offer · Risk-Free Commercial Terms</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Claim a risk-free partnership pilot on your client accounts.
          </h2>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
            We handle setup and data migration 100%. Your firm's name stays on everything, with full review control directly inside your dedicated partner dashboard. You pay only after your pilot if close time falls at least 40%.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('firms')}
              className="ret-btn bg-[#27B665] text-white hover:bg-[#209d56] border-none font-bold"
            >
              Why Partner With Us →
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors text-sm cursor-pointer"
            >
              Schedule 15-Min Intro Call
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
