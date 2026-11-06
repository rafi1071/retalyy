import React, { useState } from 'react';
import { 
  Hammer, 
  Cloud, 
  ShoppingBag, 
  Briefcase, 
  Utensils, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Award, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  FileSpreadsheet, 
  ChevronRight,
  TrendingUp,
  MapPin,
  TrendingDown
} from 'lucide-react';
import { RetalyyIconMark } from './RetalyyLogo';

interface DynamicDashboardShowcaseSectionProps {
  onLaunchBusinessCrm: () => void;
  onLaunchFirmCrm: () => void;
}

type ShowcaseVertical = 'contractor' | 'saas' | 'ecommerce' | 'agency' | 'restaurant';

export const DynamicDashboardShowcaseSection: React.FC<DynamicDashboardShowcaseSectionProps> = ({
  onLaunchBusinessCrm,
  onLaunchFirmCrm
}) => {
  const [activeVertical, setActiveVertical] = useState<ShowcaseVertical>('contractor');

  const verticals = [
    {
      id: 'contractor' as ShowcaseVertical,
      icon: Hammer,
      title: 'Trades & Contractors',
      badge: 'Job Costing & 1099s',
      company: 'Titan Commercial Mechanical LLC',
      blueprintName: 'Commercial Contractor & Job Costing Suite',
      rationale: 'Configured for job-cost WIP allocations, tracking direct materials vs sub labor, preliminary lien compliance, and IRS 1099-NEC vendor threshold tracking.',
      kpis: [
        { label: 'Operating Bank Cash', value: '$148,500.00', sub: 'Operating Checking', change: '+4.2% cleared', positive: true, badge: 'Live Cleared' },
        { label: 'Active Job Profit Margin', value: '28.4%', sub: 'Target 25.0% • 5 Projects', change: '+3.4% above est', positive: true, badge: 'Job Costed' },
        { label: '1099 Subcontractor Exposure', value: '$42,850.00', sub: '12 Subs • 3 Near $600 Cap', change: '1 W-9 Pending', positive: false, badge: 'IRS 1099' },
        { label: 'Unbilled Work-in-Progress (WIP)', value: '$31,400.00', sub: 'Ready for AIA progress draw', change: 'Draw on Nov 1st', positive: true, badge: 'Progress Draw' }
      ]
    },
    {
      id: 'saas' as ShowcaseVertical,
      icon: Cloud,
      title: 'SaaS & Subscription Tech',
      badge: 'MRR & Section 174',
      company: 'Apex Cloud Systems LLC',
      blueprintName: 'High-Growth SaaS & Subscription Financial Suite',
      rationale: 'Configured for ASC 606 subscription revenue recognition, cloud infrastructure COGS efficiency, cash runway velocity, and mandatory IRC § 174 software development capitalization.',
      kpis: [
        { label: 'Cash in Bank', value: '$148,500.00', sub: 'SVB Operating Checking', change: '6.1 Mos Runway', positive: true, badge: 'Capital' },
        { label: 'Monthly Recurring Revenue', value: '$42,850.00', sub: 'ARR: $514.2k • 108% NRR', change: '+14.2% MoM Net', positive: true, badge: 'MRR Pulse' },
        { label: 'Cloud Hosting COGS', value: '$4,120.00', sub: '9.6% of Rev (Target <15%)', change: 'AWS + OpenAI', positive: true, badge: 'Unit Econ' },
        { label: 'Net Monthly Burn Target', value: '$24,500.00', sub: 'Engineering + Hosting + G&A', change: 'Within budget', positive: true, badge: 'Velocity' }
      ]
    },
    {
      id: 'ecommerce' as ShowcaseVertical,
      icon: ShoppingBag,
      title: 'E-Commerce & Retail',
      badge: 'Inventory & Sales Tax',
      company: 'Hudson & Harbor Goods Inc.',
      blueprintName: 'Omnichannel E-Commerce & Retail Margins Suite',
      rationale: 'Configured for merchandise inventory FIFO valuation (Asset 1300), stock turnover runway, South Dakota v. Wayfair multi-state sales tax nexus, and merchant interchange fee audits.',
      kpis: [
        { label: 'Operating Checking Cash', value: '$148,500.00', sub: 'Net weekly merchant payouts', change: '+$14.2k weekly', positive: true, badge: 'Cash Flow' },
        { label: 'Inventory on Hand (FIFO)', value: '$68,450.00', sub: '48 Days Supply • 14 SKUs', change: 'Turnover 5.2x/yr', positive: true, badge: 'Asset 1300' },
        { label: 'Sales Tax Liability Accrued', value: '$6,420.00', sub: 'California, Texas, New York', change: 'Due Nov 20th', positive: false, badge: 'Payable 2200' },
        { label: 'Blended Merchant Take Rate', value: '2.84%', sub: 'Shopify / Stripe Gateway', change: '-0.12% vs prior', positive: true, badge: 'Interchange' }
      ]
    },
    {
      id: 'agency' as ShowcaseVertical,
      icon: Briefcase,
      title: 'Agencies & Consulting',
      badge: 'Utilization & Retainers',
      company: 'Vanguard Strategy & Legal LLP',
      blueprintName: 'Agency, Legal & Consulting Practice Suite',
      rationale: 'Configured for unearned client escrow retainers (Liability 2150), team billable realization rates (target >85%), unbilled client reimbursables, and client concentration management.',
      kpis: [
        { label: 'Liquid Operating Cash', value: '$148,500.00', sub: 'Checking & Escrow Reserve', change: '+$21.5k deposits', positive: true, badge: 'Operating' },
        { label: 'Billable Realization Rate', value: '88.5%', sub: 'Target 85.0% • 6 Billable Staff', change: '+3.5% vs target', positive: true, badge: 'Productivity' },
        { label: 'Unearned Client Retainers', value: '$18,400.00', sub: '4 Retainers • ASC 606 Liab', change: 'Auto-depleting', positive: true, badge: 'Liability 2150' },
        { label: 'Top Client Concentration', value: '28.2%', sub: 'Northwind ($14.2k/mo)', change: 'Caution threshold 30%', positive: false, badge: 'Risk Monitor' }
      ]
    },
    {
      id: 'restaurant' as ShowcaseVertical,
      icon: Utensils,
      title: 'Restaurants & Hospitality',
      badge: 'Prime Cost & POS Match',
      company: 'The Copper Kettle Bistro LLC',
      blueprintName: 'Restaurant & Hospitality Prime Cost Suite',
      rationale: 'Configured for Prime Cost monitoring (Food/Beverage COGS + Labor kept strictly under 60%), daily Toast/Square POS settlement batch reconciliation, and Section 45B FICA tip credits.',
      kpis: [
        { label: 'Daily Bank Cash Cleared', value: '$148,500.00', sub: 'Toast/Square Cleared Feeds', change: '+$4,210 yesterday', positive: true, badge: 'Operating' },
        { label: 'Prime Cost Ratio', value: '57.2%', sub: 'Target <60% (Food 28% + Labor 29.2%)', change: '-1.8% vs last wk', positive: true, badge: 'Gold Standard' },
        { label: 'Daily POS Settlement Match', value: '99.8%', sub: 'Toast POS vs Bank Feed', change: '30 of 30 days matched', positive: true, badge: 'POS Match' },
        { label: 'FICA Tip Credit Accrued', value: '$4,190.00', sub: 'Section 45B Direct Tax Credit', change: 'Dollar-for-dollar credit', positive: true, badge: 'IRC § 45B' }
      ]
    }
  ];

  const current = verticals.find(v => v.id === activeVertical) || verticals[0];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#F8FAF9] to-white border-b border-[#D9F0E2] relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#27B665]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#8EDDA6]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="wrap space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl">
          <div>
            <div className="ret-pill mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
              <span>AI Dynamic Dashboard Synthesis · Built for Individual Businesses</span>
            </div>
            <h2 className="text-[clamp(30px,4vw,50px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C] leading-[1.08]">
              Different businesses have different financial needs. <br className="hidden sm:inline" />
              Retalyy synthesizes a custom dashboard for each.
            </h2>
            <p className="text-base text-[#52705F] mt-3 leading-relaxed max-w-3xl">
              During onboarding, the business provides its legal entity, revenue model, and compliance priorities. Our AI model dynamically generates a tailored financial command center with vertical-specific KPIs, custom chart of accounts, and automated compliance watchdogs.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onLaunchBusinessCrm}
              className="ret-btn sm"
            >
              <span>Test Onboarding Synthesis →</span>
            </button>
          </div>
        </div>

        {/* Industry Vertical Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {verticals.map(v => {
            const Icon = v.icon;
            const isSelected = activeVertical === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVertical(v.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#27B665] bg-[#EDF9F1] shadow-md ring-2 ring-[#27B665]/30 scale-[1.02]'
                    : 'border-[#D9F0E2] bg-white hover:border-[#8EDDA6] hover:bg-[#F9FCFA]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#27B665] text-white shadow-xs' : 'bg-[#EDF9F1] text-[#0F7A41]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#27B665] text-white' : 'bg-[#F0FDF4] text-[#0F7A41] border border-[#D9F0E2]'
                    }`}>
                      {v.badge}
                    </span>
                  </div>
                  <div className="font-display font-bold text-xs sm:text-sm text-[#0C2B1C] mb-0.5">
                    {v.title}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 pt-1.5 border-t border-[#D9F0E2] flex items-center justify-between text-[10px] font-bold text-[#0F7A41]">
                    <span>Simulating UI</span>
                    <Check className="w-3.5 h-3.5 text-[#27B665]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* SIMULATED DYNAMIC DASHBOARD WINDOW */}
        <div className="bg-white rounded-[32px] border-2 border-[#D9F0E2] shadow-2xl overflow-hidden animate-fade-in">
          
          {/* Mock Browser Title Bar */}
          <div className="bg-[#0C2B1C] px-5 py-3.5 flex items-center justify-between border-b border-[#16442E] text-white">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <div className="hidden sm:flex items-center gap-2 ml-4 text-[11px] font-mono text-white/60 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <span className="text-[#8EDDA6]">https://</span>app.retalyy.com/workspace/finance-hub?blueprint={current.id}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full bg-[#27B665]/20 text-[#8EDDA6] border border-[#27B665]/30">
                <Sparkles className="w-3 h-3 text-[#27B665]" />
                {current.blueprintName}
              </span>
              <span className="text-white/60 font-mono text-[11px] hidden md:inline">
                Live Cleared Ledger
              </span>
            </div>
          </div>

          {/* Inner Dashboard Viewport */}
          <div className="p-6 sm:p-8 space-y-6 bg-[#FAFDFB]">
            
            {/* Blueprint Rationale Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center shrink-0 mt-0.5">
                  <RetalyyIconMark size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0C2B1C]">
                      AI Financial Architecture Active for {current.company}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
                      99.4% Model Match
                    </span>
                  </div>
                  <p className="text-xs text-[#52705F] mt-1 leading-relaxed max-w-3xl">
                    {current.rationale}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#0F7A41] bg-[#EDF9F1] px-2.5 py-1 rounded-xl font-bold border border-[#D9F0E2]">
                  Live Reconciled
                </span>
              </div>
            </div>

            {/* 4 DYNAMIC PRIMARY KPIS */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52705F] mb-2 flex items-center justify-between">
                <span>Synthesized Primary KPIs for {current.title}</span>
                <span className="text-[#27B665] text-[10px] font-bold">Updated Live</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {current.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs hover:border-[#8EDDA6] transition-all">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#52705F] mb-1">
                      <span className="truncate mr-2">{kpi.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDF9F1] text-[#0F7A41] font-bold border border-[#D9F0E2]">
                        {kpi.badge}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#0C2B1C] font-mono my-1">
                      {kpi.value}
                    </div>
                    <div className="text-[11px] flex items-center justify-between text-[#52705F]">
                      <span className="truncate">{kpi.sub}</span>
                      <span className={`text-[10px] font-bold ml-1 shrink-0 ${
                        kpi.positive ? 'text-[#0F7A41]' : 'text-amber-700'
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SPECIALIZED VERTICAL PREVIEW CONTENT */}
            {activeVertical === 'contractor' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDF9F1]">
                    <div className="flex items-center gap-2">
                      <Hammer className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Active Job Costing & WIP Margin Variance</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] px-2 py-0.5 rounded-full">
                      AIA G702 Ready
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { code: 'PRJ-101', name: 'Metro Civic Center HVAC & Piping', contract: '$140k', actual: '$88.4k', margin: '36.8%', progress: 75 },
                      { code: 'PRJ-104', name: 'Oakridge Commercial Subcontract', contract: '$65k', actual: '$48.2k', margin: '25.8%', progress: 90 }
                    ].map(p => (
                      <div key={p.code} className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
                        <div className="flex items-center justify-between font-bold text-[#0C2B1C] mb-1">
                          <span>{p.code} · {p.name}</span>
                          <span className="text-[#0F7A41] font-mono">Margin: {p.margin}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#52705F] mb-1.5">
                          <span>Contract: {p.contract} • Actual Cost: {p.actual}</span>
                          <span>{p.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#27B665] h-full rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">IRS Form 1099-NEC Radar</span>
                    </div>
                    <div className="text-[11px] text-[#52705F] mb-3">
                      Automatic tracking of subcontractor payments towards $600 threshold.
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                        <div className="flex justify-between font-bold text-[#0C2B1C]">
                          <span>Apex Plumbing</span>
                          <span className="font-mono">$580 / $600</span>
                        </div>
                        <div className="text-[10px] text-amber-700 font-bold mt-0.5">Within $20 of mandatory 1099 threshold</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                        <div className="flex justify-between font-bold text-[#0C2B1C]">
                          <span>Bay Electrical</span>
                          <span className="font-mono text-rose-600">Missing W-9</span>
                        </div>
                        <div className="text-[10px] text-[#52705F] mt-0.5">$540 YTD • 1-click W-9 SMS request sent</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] p-2 rounded-xl text-center mt-3 border border-[#D9F0E2]">
                    ✓ Prevents IRS non-employee penalty ($310/sub)
                  </div>
                </div>
              </div>
            )}

            {activeVertical === 'saas' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDF9F1]">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Monthly Recurring Revenue (MRR) Waterfall</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] px-2 py-0.5 rounded-full">
                      ARR: $514.2k
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs mb-3">
                    <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                      <div className="text-[10px] text-[#52705F]">Start</div>
                      <div className="font-bold font-mono text-[#0C2B1C]">$37.5k</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4]">
                      <div className="text-[10px] text-[#0F7A41]">New</div>
                      <div className="font-bold font-mono text-[#0F7A41]">+$5.8k</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4]">
                      <div className="text-[10px] text-[#0F7A41]">Expansion</div>
                      <div className="font-bold font-mono text-[#0F7A41]">+$1.2k</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="text-[10px] text-rose-700">Churn</div>
                      <div className="font-bold font-mono text-rose-700">-$1.6k</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0C2B1C] text-white">
                      <div className="text-[10px] text-[#8EDDA6]">Net End</div>
                      <div className="font-bold font-mono text-white">$42.8k</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#52705F] bg-[#F8FAF9] p-2 rounded-xl flex justify-between">
                    <span>Net Revenue Retention: <strong>108.4%</strong></span>
                    <span>Cloud COGS efficiency: <strong>9.6%</strong> of revenue</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">IRC § 174 & Form 8974 R&D</span>
                    </div>
                    <div className="text-[11px] text-[#52705F] mb-3">
                      Autonomous R&D wage capitalization & quarterly FICA tax offsets.
                    </div>
                    <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4] text-xs space-y-1 mb-2">
                      <div className="text-[#0C2B1C]">Qualified Dev Wages: <strong>$42,750</strong></div>
                      <div className="font-bold text-[#0F7A41] text-sm">+$8,550 FICA Credit Accrued</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[#0C2B1C] bg-[#F8FAF9] p-2 rounded-xl text-center border border-[#D9F0E2]">
                    1-Click Form 8974 CPA Export Ready
                  </div>
                </div>
              </div>
            )}

            {activeVertical === 'ecommerce' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDF9F1]">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Merchandise Inventory FIFO & Stock Turnover</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] px-2 py-0.5 rounded-full">
                      5.2x Turnover
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#0C2B1C]">SKU-104: Heavyweight Hoodie</div>
                        <div className="text-[11px] text-[#52705F]">480 units @ $18.50 unit cost</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        18 Days Runway (Reorder!)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#0C2B1C]">SKU-208: Weatherproof Field Jacket</div>
                        <div className="text-[11px] text-[#52705F]">310 units @ $42.00 unit cost</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
                        52 Days Runway (Healthy)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Wayfair Economic Nexus</span>
                    </div>
                    <div className="text-[11px] text-[#52705F] mb-3">
                      Monitoring $100k / $500k remote sales thresholds.
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                        <div className="flex justify-between font-bold text-[#0C2B1C]">
                          <span>California</span>
                          <span className="font-mono text-amber-700">96.4% of Cap</span>
                        </div>
                        <div className="text-[10px] text-[#52705F]">$482k / $500k • State permit active</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                        <div className="flex justify-between font-bold text-[#0C2B1C]">
                          <span>Texas</span>
                          <span className="font-mono text-[#0F7A41]">93.6%</span>
                        </div>
                        <div className="text-[10px] text-[#52705F]">$468k / $500k • Within 7% warning</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] p-2 rounded-xl text-center mt-3 border border-[#D9F0E2]">
                    ✓ 1-Click State Sales Tax Remittance
                  </div>
                </div>
              </div>
            )}

            {activeVertical === 'agency' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDF9F1]">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Client Retainer Depletion & Escrow (Liab 2150)</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] px-2 py-0.5 rounded-full">
                      ASC 606 Retainers
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                      <div className="flex justify-between font-bold text-[#0C2B1C]">
                        <span>Northwind Traders Retainer</span>
                        <span className="font-mono">$4,800 / $10,000</span>
                      </div>
                      <div className="text-[11px] text-[#52705F] mt-1">Burn: $1,200/wk • 48% remaining (Healthy)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                      <div className="flex justify-between font-bold text-[#0C2B1C]">
                        <span>Blue Fern Studio Strategy</span>
                        <span className="font-mono text-amber-700">$420 / $3,500</span>
                      </div>
                      <div className="text-[10px] text-amber-800 font-bold mt-1">⚠️ Retainer Depleted: Auto-replenishment invoice dispatched</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Billable Realization Rate</span>
                    </div>
                    <div className="text-[11px] text-[#52705F] mb-3">
                      Hours delivered vs billed revenue efficiency.
                    </div>
                    <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4] text-center mb-2">
                      <div className="text-2xl font-bold font-mono text-[#0F7A41]">88.5%</div>
                      <div className="text-[10px] text-[#0C2B1C] font-semibold mt-0.5">602 of 680 Hours Billed</div>
                    </div>
                    <div className="text-[11px] text-[#52705F]">Realized Rate: <strong>$214/hr</strong></div>
                  </div>
                  <div className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] p-2 rounded-xl text-center mt-3 border border-[#D9F0E2]">
                    ✓ Client concentration capped at 28%
                  </div>
                </div>
              </div>
            )}

            {activeVertical === 'restaurant' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
                <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EDF9F1]">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Restaurant Prime Cost Breakdown</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] px-2 py-0.5 rounded-full">
                      Prime Cost: 57.2% (&lt;60% Target)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-xs text-center mb-3">
                    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                      <div className="text-[10px] text-[#52705F]">Food COGS</div>
                      <div className="font-bold font-mono text-[#0C2B1C] mt-1">$28.4k (28%)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#D9F0E2]">
                      <div className="text-[10px] text-[#52705F]">Beverage COGS</div>
                      <div className="font-bold font-mono text-[#0C2B1C] mt-1">$8.2k (18%)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4]">
                      <div className="text-[10px] text-[#0F7A41]">Total Labor</div>
                      <div className="font-bold font-mono text-[#0F7A41] mt-1">$29.6k (29.2%)</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#52705F] bg-[#F8FAF9] p-2 rounded-xl">
                    Gold standard: Keeping food + labor under 60% generates $3,450 surplus monthly cash flow.
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
                      <span className="font-bold text-xs text-[#0C2B1C]">Daily Toast POS Reconciliation</span>
                    </div>
                    <div className="text-[11px] text-[#52705F] mb-3">
                      Register settlement matched to bank cleared ACH.
                    </div>
                    <div className="p-3 rounded-xl bg-[#EDF9F1] border border-[#C6EDD4] text-xs space-y-1 mb-2">
                      <div className="text-[#0C2B1C]">Batch #8921: <strong>$4,210.50 Gross</strong></div>
                      <div className="text-[#0F7A41] font-bold">100% Reconciled to Bank Feed</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[#0F7A41] bg-[#EDF9F1] p-2 rounded-xl text-center mt-3 border border-[#D9F0E2]">
                    ✓ Section 45B Tip Credit Accrued: $4,190
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Showcase CTA Strip */}
            <div className="pt-4 border-t border-[#EDF9F1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#52705F]">
                Every business gets this custom architecture generated in under 60 seconds upon completing onboarding.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onLaunchBusinessCrm}
                  className="ret-btn sm cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Business AI Finance Dept</span>
                </button>
                <button
                  type="button"
                  onClick={onLaunchFirmCrm}
                  className="ret-btn sm secondary cursor-pointer shadow-xs"
                >
                  <span>Accounting Firm OS →</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
