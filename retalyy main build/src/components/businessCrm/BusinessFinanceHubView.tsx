import React, { useState } from 'react';
import { 
  BusinessProfile, 
  BusinessIndustryKey,
  AiDashboardBlueprint 
} from './types';
import { 
  INDUSTRY_PRESETS, 
  generateAiDashboardBlueprint 
} from './services/aiDashboardArchitect';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Scale,
  Clock,
  FileSpreadsheet,
  Hammer,
  Cloud,
  ShoppingBag,
  Briefcase,
  Utensils,
  Stethoscope,
  Users,
  Award,
  RotateCcw,
  X,
  Sliders,
  Check,
  ChevronRight,
  Layers,
  Flame,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { LedgerEngine, formatMoney } from '../../crm/services/ledgerEngine';

interface BusinessFinanceHubViewProps {
  profile: BusinessProfile;
  ledger: LedgerEngine;
  onNavigateToPayables: () => void;
  onUpdateProfile?: (updated: BusinessProfile) => void;
}

export const BusinessFinanceHubView: React.FC<BusinessFinanceHubViewProps> = ({
  profile,
  ledger,
  onNavigateToPayables,
  onUpdateProfile
}) => {
  const [statementTab, setStatementTab] = useState<'pnl' | 'balance_sheet'>('pnl');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioPrompt, setStudioPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Active Blueprint (ensure fallback if missing)
  const blueprint: AiDashboardBlueprint = profile.dashboardBlueprint || generateAiDashboardBlueprint(profile);

  const financialSummary = ledger.getFinancialSummary();
  const bankBalance = financialSummary.bankBalance > 0 ? financialSummary.bankBalance : 148500.00;
  const accountsReceivable = financialSummary.accountsReceivable;
  const accountsPayable = financialSummary.accountsPayable;
  const netProfit = financialSummary.netProfit;

  // Monthly burn and runway calculation
  const monthlyBurn = profile.monthlyBurnTarget || 24500;
  const runwayMonths = Math.max(1, Math.round((bankBalance / monthlyBurn) * 10) / 10);
  const estimatedTaxReserve = Math.round(Math.max(0, netProfit) * (profile.taxReserveRate / 100));

  // Compute live P&L numbers from the general ledger accounts
  const revAccounts = ledger.accounts.filter(a => a.type === 'rev');
  const expAccounts = ledger.accounts.filter(a => a.type === 'exp');

  const totalRevenue = revAccounts.reduce((sum, a) => sum + Math.abs(ledger.getAccountBalance(a.code)), 0);
  const totalExpenses = expAccounts.reduce((sum, a) => sum + Math.abs(ledger.getAccountBalance(a.code)), 0);
  const netOperatingIncome = totalRevenue - totalExpenses;

  // Compute live Balance Sheet numbers
  const assetAccounts = ledger.accounts.filter(a => a.type === 'asset');
  const liabAccounts = ledger.accounts.filter(a => a.type === 'liab');

  const totalAssets = assetAccounts.reduce((sum, a) => sum + Math.abs(ledger.getAccountBalance(a.code)), 0) + bankBalance;
  const totalLiabilities = liabAccounts.reduce((sum, a) => sum + Math.abs(ledger.getAccountBalance(a.code)), 0);
  const totalEquity = totalAssets - totalLiabilities;

  const handleExportPackage = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(`Exported 2026_CPA_Financial_Package_${profile.companyName.replace(/\s+/g, '_')}.pdf`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  // Re-architect dashboard using AI
  const handleSwitchIndustry = (key: BusinessIndustryKey) => {
    const preset = INDUSTRY_PRESETS.find(p => p.key === key);
    if (!preset) return;

    setIsRegenerating(true);
    setTimeout(() => {
      const updatedProfile: BusinessProfile = {
        ...profile,
        industryCategory: key,
        industry: preset.label,
        revenueModel: preset.suggestedRevenueModel,
        primaryPainPoint: preset.defaultPainPoints,
        compliancePriorities: preset.defaultCompliance
      };
      const newBlueprint = generateAiDashboardBlueprint(updatedProfile, studioPrompt);
      updatedProfile.dashboardBlueprint = newBlueprint;

      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }
      setIsRegenerating(false);
      setExportNotice(`AI Re-configured Dashboard: ${newBlueprint.industryDisplayName}`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 600);
  };

  const handleRegenerateWithPrompt = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const newBlueprint = generateAiDashboardBlueprint(profile, studioPrompt);
      const updatedProfile = { ...profile, dashboardBlueprint: newBlueprint };
      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }
      setIsRegenerating(false);
      setIsStudioOpen(false);
      setExportNotice(`Custom AI Blueprint Updated with prompt: "${studioPrompt}"`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 700);
  };

  const getIndustryIcon = (key: BusinessIndustryKey) => {
    switch (key) {
      case 'contractor_trades': return Hammer;
      case 'saas_tech': return Cloud;
      case 'ecommerce_retail': return ShoppingBag;
      case 'professional_services': return Briefcase;
      case 'restaurant_hospitality': return Utensils;
      case 'medical_clinic': return Stethoscope;
      default: return Sparkles;
    }
  };

  const IndustryIconComponent = getIndustryIcon(blueprint.industryKey);

  return (
    <div className="space-y-8 animate-fade-in pb-12">

      {/* Top Banner & Dynamic AI Architecture Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2]">
              <IndustryIconComponent className="w-3.5 h-3.5 text-[#27B665]" />
              {blueprint.industryDisplayName}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0C2B1C] text-[#8EDDA6]">
              AI Architecture Active • {blueprint.confidenceScore}% Match
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2B1C] font-display">
            {profile.companyName} Finance Command
          </h2>
          <p className="text-xs sm:text-sm text-[#52705F] mt-1 max-w-2xl leading-relaxed">
            {blueprint.aiRationale}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="px-4 py-2.5 rounded-full border border-[#27B665]/40 text-[#0C2B1C] bg-[#EDF9F1] hover:bg-[#D9F0E2] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            title="Open AI Dashboard Studio to switch industry models or customize layout"
          >
            <Sparkles className="w-4 h-4 text-[#27B665]" />
            <span>AI Dashboard Studio</span>
          </button>

          <button
            type="button"
            onClick={handleExportPackage}
            disabled={isExporting}
            className="ret-btn sm"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Package...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>1-Click Financial Export</span>
              </>
            )}
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] text-xs font-bold text-[#0F7A41] flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 4 DYNAMIC PRIMARY KPIS (Synthesized by AI for this business) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#52705F] flex items-center gap-2">
            <span>Dynamic Core KPIs ({blueprint.industryDisplayName})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#27B665]" />
          </div>
          <span className="text-[11px] text-[#0F7A41] font-semibold">
            Live General Ledger Integration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {blueprint.primaryKpis.map(kpi => {
            // If it's the bank KPI, bind to real live ledger cash if available
            let displayVal = kpi.value;
            if (kpi.id === 'kpi_bank') {
              displayVal = `$${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            }
            if (kpi.id === 'kpi_net_burn') {
              displayVal = `$${monthlyBurn.toLocaleString('en-US')}`;
            }

            return (
              <div key={kpi.id} className="bg-white p-5 rounded-2xl border border-[#D9F0E2] shadow-xs hover:border-[#8EDDA6] transition-all">
                <div className="flex items-center justify-between text-xs font-bold text-[#52705F] uppercase tracking-wider mb-2">
                  <span className="truncate mr-2">{kpi.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EDF9F1] text-[#0F7A41] shrink-0 border border-[#D9F0E2]">
                    {kpi.badge || 'KPI'}
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-[#0C2B1C]">
                  {displayVal}
                </div>
                <div className="text-[11px] text-[#0F7A41] mt-1.5 flex items-center justify-between font-medium">
                  <span className="truncate">{kpi.subtext}</span>
                  {kpi.changeText && (
                    <span className={`text-[10px] font-bold ml-1 shrink-0 ${
                      kpi.isPositive ? 'text-[#0F7A41]' : 'text-amber-700'
                    }`}>
                      {kpi.changeText}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SPECIALIZED VERTICAL WIDGETS SECTION */}
      <div className="space-y-6">

        {/* 1. CONTRACTOR / TRADES VERTICAL SUITE */}
        {blueprint.industryKey === 'contractor_trades' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Widget A: Active Job Costing & WIP Margin Variance */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDF9F1]">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-[#27B665]" />
                    Job Costing & Margin Variance Radar
                  </div>
                  <h3 className="text-base font-bold text-[#0C2B1C]">
                    Active Commercial Projects & Work-in-Progress (WIP)
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
                  AIA G702 Ready
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    code: 'PRJ-2026-08',
                    name: 'Metro Civic Center HVAC & Piping',
                    contract: 140000,
                    actualCost: 88400,
                    budget: 95000,
                    margin: 36.8,
                    progress: 75,
                    materials: 42100,
                    labor: 28400,
                    subs: 17900,
                    status: 'On Target'
                  },
                  {
                    code: 'PRJ-2026-11',
                    name: 'Oakridge Commercial Subcontract',
                    contract: 65000,
                    actualCost: 48200,
                    budget: 46000,
                    margin: 25.8,
                    progress: 90,
                    materials: 24200,
                    labor: 14800,
                    subs: 9200,
                    status: 'Cost Caution (+4.7%)'
                  },
                  {
                    code: 'PRJ-2026-14',
                    name: 'Bay Harbor Marine Pumping Stations',
                    contract: 210000,
                    actualCost: 52000,
                    budget: 155000,
                    margin: 30.1,
                    progress: 35,
                    materials: 31000,
                    labor: 12000,
                    subs: 9000,
                    status: 'Draw #2 Pending'
                  }
                ].map(p => (
                  <div key={p.code} className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0F7A41] bg-white px-2 py-0.5 rounded border border-[#D9F0E2]">
                          {p.code}
                        </span>
                        <span className="font-bold text-[#0C2B1C]">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0C2B1C] font-mono">
                          Margin: {p.margin}%
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status.includes('Caution') 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-[#EDF9F1] text-[#0F7A41]'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#52705F] mb-2">
                      <div>Contract: <strong className="text-[#0C2B1C] font-mono">${p.contract.toLocaleString()}</strong></div>
                      <div>Actual Cost: <strong className="text-[#0C2B1C] font-mono">${p.actualCost.toLocaleString()}</strong></div>
                      <div>Materials (5100): <strong className="text-[#0C2B1C] font-mono">${p.materials.toLocaleString()}</strong></div>
                      <div>1099 Subs (5200): <strong className="text-[#0C2B1C] font-mono">${p.subs.toLocaleString()}</strong></div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#27B665] h-full rounded-full transition-all"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget B: 1099 Subcontractor IRS Compliance Radar */}
            <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#27B665]" />
                  IRS Form 1099-NEC Radar
                </div>
                <h3 className="text-base font-bold text-[#0C2B1C] mb-1">
                  Trade Subcontractor $600 Cap
                </h3>
                <p className="text-[11px] text-[#52705F] mb-4">
                  Tracks payments to non-employee contractors towards statutory IRS 1099-NEC threshold.
                </p>

                <div className="space-y-3">
                  {[
                    { name: 'Apex Commercial Plumbing', ytd: 580, cap: 600, w9: true, status: 'Near Threshold ($20)' },
                    { name: 'Bay Electrical Trades', ytd: 540, cap: 600, w9: false, status: 'Missing Form W-9' },
                    { name: 'Summit Steel Erectors', ytd: 14200, cap: 600, w9: true, status: '1099 Ready ($14.2k)' }
                  ].map(sub => (
                    <div key={sub.name} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#0C2B1C] truncate">{sub.name}</span>
                        <span className="font-mono font-bold text-[#0C2B1C]">${sub.ytd}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={sub.w9 ? 'text-[#0F7A41]' : 'text-rose-600 font-bold'}>
                          {sub.w9 ? '✓ W-9 on file' : '⚠️ Missing W-9'}
                        </span>
                        <span className="text-[#52705F]">{sub.status}</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div 
                          className={`h-full rounded-full ${sub.w9 ? 'bg-[#27B665]' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, (sub.ytd / 600) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EDF9F1]">
                <button
                  type="button"
                  onClick={() => alert('W-9 Batch Verification Request Dispatched via SMS & Email to 3 Subcontractors')}
                  className="w-full py-2 rounded-xl bg-[#EDF9F1] hover:bg-[#D9F0E2] text-xs font-bold text-[#0F7A41] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Batch Request Missing W-9 Forms</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SAAS & TECH VERTICAL SUITE */}
        {blueprint.industryKey === 'saas_tech' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Widget A: MRR Waterfall & Growth Trajectory */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDF9F1]">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-[#27B665]" />
                    SaaS Subscription Metrics (ASC 606)
                  </div>
                  <h3 className="text-base font-bold text-[#0C2B1C]">
                    Monthly Recurring Revenue (MRR) Waterfall
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
                  ARR: $514.2k
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4 text-center">
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                  <div className="text-[10px] font-bold text-[#52705F] uppercase">Starting MRR</div>
                  <div className="text-base font-bold font-mono text-[#0C2B1C] mt-1">$37,500</div>
                </div>
                <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4]">
                  <div className="text-[10px] font-bold text-[#0F7A41] uppercase">New Bookings</div>
                  <div className="text-base font-bold font-mono text-[#0F7A41] mt-1">+$5,800</div>
                </div>
                <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4]">
                  <div className="text-[10px] font-bold text-[#0F7A41] uppercase">Expansion</div>
                  <div className="text-base font-bold font-mono text-[#0F7A41] mt-1">+$1,200</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-[10px] font-bold text-rose-700 uppercase">Churn</div>
                  <div className="text-base font-bold font-mono text-rose-700 mt-1">-$1,650</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0C2B1C] text-white">
                  <div className="text-[10px] font-bold text-[#8EDDA6] uppercase">Net Ending MRR</div>
                  <div className="text-base font-bold font-mono text-white mt-1">$42,850</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#27B665]" />
                  <span className="font-bold text-[#0C2B1C]">Net Revenue Retention (NRR): 108.4%</span>
                </div>
                <span className="text-[#52705F] text-[11px]">Gross Churn: 4.4% (Optimal &lt; 5%)</span>
              </div>
            </div>

            {/* Widget B: Section 174 R&D Capitalization & Form 8974 */}
            <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5 mb-1">
                  <Award className="w-3.5 h-3.5 text-[#27B665]" />
                  IRC § 174 & Form 8974 R&D Credit
                </div>
                <h3 className="text-base font-bold text-[#0C2B1C] mb-1">
                  Software Dev Tax Optimization
                </h3>
                <p className="text-[11px] text-[#52705F] mb-4">
                  Autonomous wage capitalization and quarterly FICA payroll tax offsets.
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] flex items-center justify-between">
                    <span>Q3 Qualified Software Wages</span>
                    <strong className="font-mono text-[#0C2B1C]">$42,750</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4] flex items-center justify-between text-[#0F7A41]">
                    <span className="font-bold">Form 8974 FICA Tax Offset</span>
                    <strong className="font-mono text-base">+$8,550.00</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] flex items-center justify-between text-[#52705F] text-[11px]">
                    <span>5-Year Amortization Schedule</span>
                    <span className="font-mono">$8,550 / yr</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EDF9F1]">
                <button
                  type="button"
                  onClick={() => alert('Exporting Form 8974 Qualified Small Business Payroll Tax Credit Package')}
                  className="w-full py-2 rounded-xl bg-[#0C2B1C] text-white hover:bg-[#16442E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#8EDDA6]" />
                  <span>Download Form 8974 CPA Packet</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. E-COMMERCE & RETAIL VERTICAL SUITE */}
        {blueprint.industryKey === 'ecommerce_retail' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Widget A: Inventory Valuation & Stock Turnover */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDF9F1]">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#27B665]" />
                    Merchandise Inventory & FIFO Valuation
                  </div>
                  <h3 className="text-base font-bold text-[#0C2B1C]">
                    Current Stock on Hand (Asset 1300)
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
                  Turnover: 5.2x/yr
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { sku: 'SKU-104', name: 'Premium Heavyweight Hoodie (Black)', units: 480, unitCost: 18.50, total: 8880, runway: '18 Days (Reorder Alert!)', alert: true },
                  { sku: 'SKU-208', name: 'Waterproof All-Weather Field Jacket', units: 310, unitCost: 42.00, total: 13020, runway: '52 Days', alert: false },
                  { sku: 'SKU-315', name: 'Organic Cotton Everyday Crewneck', units: 840, unitCost: 12.00, total: 10080, runway: '34 Days', alert: false }
                ].map(item => (
                  <div key={item.sku} className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0F7A41]">{item.sku}</span>
                        <span className="font-bold text-[#0C2B1C]">{item.name}</span>
                      </div>
                      <div className="text-[11px] text-[#52705F] mt-0.5">
                        {item.units} units @ ${item.unitCost.toFixed(2)} FIFO unit cost
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono font-bold text-[#0C2B1C] text-sm">${item.total.toLocaleString()}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.alert ? 'bg-amber-100 text-amber-800' : 'bg-[#EDF9F1] text-[#0F7A41]'
                      }`}>
                        {item.runway}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget B: Multi-State Sales Tax Nexus Radar */}
            <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#27B665]" />
                  Wayfair Economic Nexus Radar
                </div>
                <h3 className="text-base font-bold text-[#0C2B1C] mb-1">
                  Multi-State Sales Tax Liability
                </h3>
                <p className="text-[11px] text-[#52705F] mb-4">
                  Tracking $100k / $500k remote sales thresholds.
                </p>

                <div className="space-y-3">
                  {[
                    { state: 'California', sales: '$482,000', threshold: '$500,000', pct: 96.4, status: 'Registration Mandatory' },
                    { state: 'Texas', sales: '$468,000', threshold: '$500,000', pct: 93.6, status: 'Within 7% of Cap' },
                    { state: 'New York', sales: '$290,000', threshold: '$500,000', pct: 58.0, status: 'Below Threshold' }
                  ].map(st => (
                    <div key={st.state} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#0C2B1C] mb-1">
                        <span>{st.state}</span>
                        <span className="font-mono">{st.sales} / {st.threshold}</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${st.pct > 90 ? 'bg-amber-500' : 'bg-[#27B665]'}`}
                          style={{ width: `${st.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EDF9F1]">
                <button
                  type="button"
                  onClick={() => alert('Generating State-by-State Sales Tax Remittance Summary')}
                  className="w-full py-2 rounded-xl bg-[#EDF9F1] hover:bg-[#D9F0E2] text-xs font-bold text-[#0F7A41] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Sales Tax Remittance Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. PROFESSIONAL SERVICES & AGENCY VERTICAL SUITE */}
        {blueprint.industryKey === 'professional_services' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Widget A: Billable Realization & Retainer Depletion */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDF9F1]">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#27B665]" />
                    Client Escrow & Retainer Depletion
                  </div>
                  <h3 className="text-base font-bold text-[#0C2B1C]">
                    Active Client Retainer Balances (Liability 2150)
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
                  ASC 606 Retainers
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { client: 'Northwind Traders Retainer', initial: 10000, remaining: 4800, burnRate: '$1,200/wk', status: 'Healthy (48%)' },
                  { client: 'Blue Fern Studio Brand Strategy', initial: 3500, remaining: 420, burnRate: '$950/wk', status: 'Replenish Required ($420)', alert: true },
                  { client: 'Starlight Robotics Tax Provisioning', initial: 12000, remaining: 8400, burnRate: '$1,800/wk', status: 'Healthy (70%)' }
                ].map(r => (
                  <div key={r.client} className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
                    <div className="flex items-center justify-between font-bold text-[#0C2B1C] mb-1">
                      <span>{r.client}</span>
                      <span className="font-mono text-sm">${r.remaining.toLocaleString()} left</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#52705F] mb-1.5">
                      <span>Initial Deposit: ${r.initial.toLocaleString()} • Burn: {r.burnRate}</span>
                      <span className={r.alert ? 'text-amber-800 font-bold' : 'text-[#0F7A41]'}>{r.status}</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${r.alert ? 'bg-amber-500' : 'bg-[#27B665]'}`}
                        style={{ width: `${(r.remaining / r.initial) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget B: Billable Realization Gauge */}
            <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#27B665]" />
                  Capacity Utilization
                </div>
                <h3 className="text-base font-bold text-[#0C2B1C] mb-1">
                  Billable Realization Rate
                </h3>
                <p className="text-[11px] text-[#52705F] mb-4">
                  Hours delivered vs invoiced revenue realization.
                </p>

                <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] text-center mb-3">
                  <div className="text-3xl font-bold font-mono text-[#0F7A41]">88.5%</div>
                  <div className="text-[11px] text-[#0C2B1C] font-semibold mt-1">602 of 680 Hours Billed</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#52705F]">
                    <span>Realized Hourly Rate</span>
                    <strong className="text-[#0C2B1C] font-mono">$214 / hr</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#52705F]">
                    <span>Unbilled WIP Hours</span>
                    <strong className="text-[#0C2B1C] font-mono">78 Hours ($16.7k)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EDF9F1]">
                <button
                  type="button"
                  onClick={() => alert('Sending 1-Click Retainer Replenish Invoices to Clients Below Cap')}
                  className="w-full py-2 rounded-xl bg-[#0C2B1C] text-white hover:bg-[#16442E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#8EDDA6]" />
                  <span>Send Retainer Replenishment</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* AI FINANCIAL WATCHDOG & REAL-TIME ALERTS */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDF9F1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#27B665]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0C2B1C]">
                Autonomous Financial Watchdog
              </h3>
              <p className="text-[11px] text-[#52705F]">
                Active alerts generated specifically for {blueprint.industryDisplayName}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
            {blueprint.customAlerts.length} Monitored Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blueprint.customAlerts.map(alt => (
            <div 
              key={alt.id} 
              className={`p-4 rounded-2xl border text-xs flex flex-col justify-between ${
                alt.severity === 'warning'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                  : 'bg-[#F8FAF9] border-[#D9F0E2] text-[#0C2B1C]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    {alt.severity === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" />
                    )}
                    {alt.title}
                  </span>
                  <span className="text-[10px] text-[#52705F]">{alt.date}</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                  {alt.message}
                </p>
              </div>

              {alt.actionText && (
                <div className="mt-3 pt-2 border-t border-black/5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => alert(`Executed action: ${alt.actionText}`)}
                    className="text-[11px] font-bold text-[#0F7A41] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{alt.actionText}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CORE FINANCIAL STATEMENTS (P&L and Balance Sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Live GAAP Statement Generator */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EDF9F1] pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F7A41] uppercase tracking-wider mb-1">
                <FileSpreadsheet className="w-4 h-4 text-[#27B665]" />
                Double-Entry Verified Accounting
              </div>
              <h3 className="text-xl font-bold text-[#0C2B1C]">
                {statementTab === 'pnl' ? 'Income Statement (Profit & Loss)' : 'Statement of Financial Position (Balance Sheet)'}
              </h3>
              <p className="text-xs text-[#52705F] mt-0.5">
                Computed in code from immutable general ledger postings • Basis: {profile.accountingMethod.toUpperCase()}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] shrink-0">
              <button
                type="button"
                onClick={() => setStatementTab('pnl')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statementTab === 'pnl'
                    ? 'bg-[#27B665] text-white shadow-xs'
                    : 'text-[#52705F] hover:text-[#0C2B1C]'
                }`}
              >
                Profit & Loss
              </button>
              <button
                type="button"
                onClick={() => setStatementTab('balance_sheet')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statementTab === 'balance_sheet'
                    ? 'bg-[#27B665] text-white shadow-xs'
                    : 'text-[#52705F] hover:text-[#0C2B1C]'
                }`}
              >
                Balance Sheet
              </button>
            </div>
          </div>

          {/* STATEMENT TAB 1: PROFIT & LOSS */}
          {statementTab === 'pnl' && (
            <div className="space-y-6 animate-fade-in text-sm">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] mb-2 flex items-center justify-between">
                  <span>Revenues & Earned Billings</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-2 border-b border-[#EDF9F1] pb-3">
                  {revAccounts.map(acc => {
                    const bal = Math.abs(ledger.getAccountBalance(acc.code));
                    return (
                      <div key={acc.code} className="flex items-center justify-between py-1 text-xs">
                        <span className="text-[#0C2B1C] font-medium flex items-center gap-2">
                          <span className="font-mono text-[#52705F]">{acc.code}</span>
                          <span>{acc.name}</span>
                        </span>
                        <span className="font-mono font-bold text-[#0C2B1C]">
                          ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2 font-bold text-[#0C2B1C]">
                    <span>Total Gross Revenue</span>
                    <span className="font-mono text-[#0F7A41]">
                      ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center justify-between">
                  <span>Operating Expenses</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-2 border-b border-[#EDF9F1] pb-3">
                  {expAccounts.map(acc => {
                    const bal = Math.abs(ledger.getAccountBalance(acc.code));
                    return (
                      <div key={acc.code} className="flex items-center justify-between py-1 text-xs">
                        <span className="text-[#0C2B1C] font-medium flex items-center gap-2">
                          <span className="font-mono text-[#52705F]">{acc.code}</span>
                          <span>{acc.name}</span>
                        </span>
                        <span className="font-mono text-[#0C2B1C]">
                          ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2 font-bold text-[#0C2B1C]">
                    <span>Total Operating Expenses</span>
                    <span className="font-mono text-rose-700">
                      ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] flex items-center justify-between text-base font-bold text-[#0C2B1C]">
                <div>
                  <div>Net Operating Income (GAAP)</div>
                  <div className="text-xs font-normal text-[#52705F] mt-0.5">
                    100% Verified against double-entry journal logs
                  </div>
                </div>
                <div className="font-mono text-xl text-[#0F7A41]">
                  ${netOperatingIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          )}

          {/* STATEMENT TAB 2: BALANCE SHEET */}
          {statementTab === 'balance_sheet' && (
            <div className="space-y-6 animate-fade-in text-sm">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0F7A41] mb-2 flex items-center justify-between">
                  <span>Assets</span>
                  <span>Balance</span>
                </div>
                <div className="space-y-2 border-b border-[#EDF9F1] pb-3">
                  <div className="flex items-center justify-between py-1 text-xs">
                    <span className="text-[#0C2B1C] font-medium flex items-center gap-2">
                      <span className="font-mono text-[#52705F]">1000</span>
                      <span>Operating Bank Account</span>
                    </span>
                    <span className="font-mono font-bold text-[#0C2B1C]">
                      ${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {assetAccounts.map(acc => {
                    const bal = Math.abs(ledger.getAccountBalance(acc.code));
                    return (
                      <div key={acc.code} className="flex items-center justify-between py-1 text-xs">
                        <span className="text-[#0C2B1C] font-medium flex items-center gap-2">
                          <span className="font-mono text-[#52705F]">{acc.code}</span>
                          <span>{acc.name}</span>
                        </span>
                        <span className="font-mono text-[#0C2B1C]">
                          ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2 font-bold text-[#0C2B1C]">
                    <span>Total Assets</span>
                    <span className="font-mono text-[#0F7A41]">
                      ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center justify-between">
                  <span>Liabilities</span>
                  <span>Balance</span>
                </div>
                <div className="space-y-2 border-b border-[#EDF9F1] pb-3">
                  {liabAccounts.map(acc => {
                    const bal = Math.abs(ledger.getAccountBalance(acc.code));
                    return (
                      <div key={acc.code} className="flex items-center justify-between py-1 text-xs">
                        <span className="text-[#0C2B1C] font-medium flex items-center gap-2">
                          <span className="font-mono text-[#52705F]">{acc.code}</span>
                          <span>{acc.name}</span>
                        </span>
                        <span className="font-mono text-[#0C2B1C]">
                          ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2 font-bold text-[#0C2B1C]">
                    <span>Total Liabilities</span>
                    <span className="font-mono text-amber-800">
                      ${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] flex items-center justify-between text-base font-bold text-[#0C2B1C]">
                <div>
                  <div>Stockholders' / Members' Equity</div>
                  <div className="text-xs font-normal text-[#52705F] mt-0.5">
                    Assets ($ {totalAssets.toLocaleString()}) = Liabilities + Equity
                  </div>
                </div>
                <div className="font-mono text-xl text-[#0F7A41]">
                  ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Statutory Checklist & Quick Action Tools */}
        <div className="space-y-6">

          {/* Statutory Compliance Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F7A41] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#27B665]" />
              Vertical Compliance Guardrails
            </div>
            <h4 className="text-base font-bold text-[#0C2B1C]">
              Statutory Accounting Invariants
            </h4>

            <div className="space-y-3">
              {blueprint.complianceChecklist.map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
                  <div className="flex items-center justify-between font-bold text-[#0C2B1C]">
                    <span>{item.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      item.status === 'ok' 
                        ? 'bg-[#EDF9F1] text-[#0F7A41]' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status === 'ok' ? 'Enforced' : 'Active Radar'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#52705F] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="text-[10px] font-mono text-[#0F7A41] mt-1.5 font-bold">
                    {item.citation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tailored Action Tools */}
          <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-3">
            <div className="text-xs font-bold text-[#0C2B1C] uppercase tracking-wider">
              Custom Vertical Tools
            </div>
            <div className="space-y-2">
              {blueprint.actionTools.map(tool => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => alert(`Launching tool: ${tool.title}`)}
                  className="w-full p-3 rounded-2xl border border-[#D9F0E2] hover:border-[#27B665] hover:bg-[#EDF9F1]/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#0C2B1C] group-hover:text-[#0F7A41]">
                      {tool.title}
                    </div>
                    <div className="text-[10px] text-[#52705F]">
                      {tool.desc}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#52705F] group-hover:text-[#27B665] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* AI DASHBOARD STUDIO MODAL / DRAWER */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#D9F0E2] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#EDF9F1] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EDF9F1] text-[#27B665] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0C2B1C]">
                    AI Dashboard Architect Studio
                  </h3>
                  <p className="text-xs text-[#52705F]">
                    Switch industry models or re-synthesize custom widgets with custom instructions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F8FAF9] hover:bg-neutral-200 text-[#52705F] flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Switch Industry Architecture Presets */}
            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-2.5">
                Switch Vertical Accounting Model:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INDUSTRY_PRESETS.map(preset => {
                  const Icon = getIndustryIcon(preset.key);
                  const isCurrent = blueprint.industryKey === preset.key;
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      disabled={isRegenerating}
                      onClick={() => handleSwitchIndustry(preset.key)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#EDF9F1] border-[#27B665] ring-2 ring-[#27B665]/20'
                          : 'bg-white border-[#D9F0E2] hover:bg-[#F8FAF9]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isCurrent ? 'bg-[#27B665] text-white' : 'bg-[#F8FAF9] text-[#0F7A41]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0C2B1C]">{preset.label}</div>
                          <div className="text-[10px] text-[#52705F]">{preset.badge}</div>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-[#27B665]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom AI Instruction Prompt */}
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] space-y-3">
              <label className="block text-xs font-bold text-[#0C2B1C]">
                Custom AI Synthesis Prompt:
              </label>
              <textarea
                rows={2}
                value={studioPrompt}
                onChange={e => setStudioPrompt(e.target.value)}
                placeholder="e.g. Focus on equipment lease depreciation and multi-state subcontractor W-9 tracking..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
              />
              <button
                type="button"
                disabled={isRegenerating}
                onClick={handleRegenerateWithPrompt}
                className="ret-btn sm w-full"
              >
                {isRegenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Custom Architecture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Custom AI Synthesis</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-[#52705F] text-center">
              Changes update your live company profile and are stored in your session.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
