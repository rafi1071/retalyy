import React, { useState, useMemo } from 'react';
import { NavigationTab } from '../types';
import { RetalyyIconMark } from './RetalyyLogo';
import { 
  Wrench, 
  HardHat, 
  Truck, 
  Receipt, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  Zap,
  Building2,
  Calculator
} from 'lucide-react';

interface TradesViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const TradesView: React.FC<TradesViewProps> = ({ setActiveTab, onOpenBooking }) => {
  // Interactive estimator state for trades
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(45000);
  const [receiptCount, setReceiptCount] = useState<number>(120);
  const [subcontractorCount, setSubcontractorCount] = useState<number>(6);
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // Estimator logic
  const tradeSavings = useMemo(() => {
    const hoursSavedAdmin = Math.round((receiptCount * 8) / 60); // 8 mins manual receipt matching saved
    const contractorComplianceHours = subcontractorCount * 3; // W9 & 1099 prep
    const totalHoursSaved = hoursSavedAdmin + contractorComplianceHours;
    const valueOfTimeSaved = totalHoursSaved * 95; // Owner hourly rate
    const estimatedMissedDeductionsRecovered = Math.round(monthlyExpenses * 0.04); // 4% missed job deductions
    const totalMonthlyGain = valueOfTimeSaved + estimatedMissedDeductionsRecovered;

    return {
      totalHoursSaved,
      valueOfTimeSaved,
      estimatedMissedDeductionsRecovered,
      totalMonthlyGain
    };
  }, [monthlyExpenses, receiptCount, subcontractorCount]);

  return (
    <div className="bg-[#FAFBF9] text-[#0B1210] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-20 border-b border-[#E4E7E1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#27B665_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF7F0] border border-[#27B665]/30 text-[#0C2B1C] text-xs font-semibold uppercase tracking-wider mb-6">
            <HardHat className="w-4 h-4 text-[#27B665]" />
            Purpose-Built for Trades & Contractors
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0C2B1C] mb-6 font-display max-w-4xl">
            Autonomous Bookkeeping for Trades and Growing Businesses
          </h1>

          <p className="text-lg md:text-xl text-[#465E51] max-w-3xl leading-relaxed mb-10">
            Stop spending Sunday nights matching supply house receipts and chasing job costs. Retalyy turns raw bank feeds, material invoices, and subcontractor payments into audit-ready books automatically.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenBooking}
              className="ret-btn px-8 py-3.5 text-base font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Start Free Trades Pilot
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/calculator"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('calculator');
                window.history.pushState(null, '', '/calculator');
              }}
              className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-white border border-[#D5DDD7] hover:border-[#27B665] text-[#0C2B1C] transition-colors flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#27B665]" />
              Calculate Tax Savings
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-10 border-t border-[#E4E7E1]">
            <div className="p-4 bg-white rounded-xl border border-[#E4E7E1] shadow-xs">
              <div className="text-2xl font-bold text-[#0C2B1C] font-mono">100%</div>
              <div className="text-xs text-[#52705F] mt-1 font-medium">Receipt & Invoice OCR Match</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E4E7E1] shadow-xs">
              <div className="text-2xl font-bold text-[#0C2B1C] font-mono">18 hrs/mo</div>
              <div className="text-xs text-[#52705F] mt-1 font-medium">Owner Admin Time Recovered</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E4E7E1] shadow-xs">
              <div className="text-2xl font-bold text-[#0C2B1C] font-mono">IRC § 179</div>
              <div className="text-xs text-[#52705F] mt-1 font-medium">Auto-Flagged Equipment CapEx</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E4E7E1] shadow-xs">
              <div className="text-2xl font-bold text-[#0C2B1C] font-mono">Zero</div>
              <div className="text-xs text-[#52705F] mt-1 font-medium">QuickBooks Clutter or Stress</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Trades Workflows */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-[#0C2B1C] mb-4 font-display">
            Built for Job Sites, Not Boring Cubicles
          </h2>
          <p className="text-sm md:text-base text-[#465E51]">
            Generic software expects you to sit at a desk entering journal entries. Retalyy automates the unique financial friction of contractor operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-[#E4E7E1] shadow-xs hover:border-[#27B665] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EBF7F0] flex items-center justify-center text-[#27B665] mb-6">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0C2B1C] mb-3">Supply House & Receipt Capture</h3>
            <p className="text-sm text-[#465E51] leading-relaxed mb-4">
              Snap photos of Home Depot, supply counter, or fuel slips. Retalyy extracts line items, applies sales tax rules, and ties costs to the matching bank outflow.
            </p>
            <ul className="text-xs text-[#2F4D3C] space-y-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Auto-splits inventory vs job supplies</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Matches vendor statement credits</li>
            </ul>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#E4E7E1] shadow-xs hover:border-[#27B665] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EBF7F0] flex items-center justify-center text-[#27B665] mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0C2B1C] mb-3">Equipment vs Expense Discretion</h3>
            <p className="text-sm text-[#465E51] leading-relaxed mb-4">
              Never misclassify a \$4,000 trailer or heavy tool. The engine automatically enforces the \$2,500 de minimis safe harbor and prepares Section 179 workpapers.
            </p>
            <ul className="text-xs text-[#2F4D3C] space-y-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> ASC 360 fixed asset capitalization</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Ready for your CPA at year-end</li>
            </ul>
          </div>

          <div className="p-8 bg-white rounded-2xl border border-[#E4E7E1] shadow-xs hover:border-[#27B665] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EBF7F0] flex items-center justify-center text-[#27B665] mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0C2B1C] mb-3">1099 Subcontractor Tracking</h3>
            <p className="text-sm text-[#465E51] leading-relaxed mb-4">
              Track trade sub payments over \$600 across Zelle, check, and ACH. Collect W-9s before paying invoices to avoid IRS backup withholding penalties.
            </p>
            <ul className="text-xs text-[#2F4D3C] space-y-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Continuous 1099-NEC accumulation</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> EIN/SSN verification compliance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Interactive Trades Estimator */}
      <section className="py-20 bg-[#F2F5F1] border-y border-[#E4E7E1]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mb-3 font-display">
              See How Much Admin Time & Cash Retalyy Recovers
            </h2>
            <p className="text-sm text-[#465E51]">
              Adjust the sliders below to calculate recovered contractor hours and tax deductions.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#D5DDD7] shadow-sm">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#465E51] mb-2">
                  Monthly Job Expenses ($)
                </label>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="5000"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full accent-[#27B665]"
                />
                <div className="text-lg font-bold font-mono text-[#0C2B1C] mt-2">
                  ${monthlyExpenses.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#465E51] mb-2">
                  Monthly Receipts & Slips
                </label>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={receiptCount}
                  onChange={(e) => setReceiptCount(Number(e.target.value))}
                  className="w-full accent-[#27B665]"
                />
                <div className="text-lg font-bold font-mono text-[#0C2B1C] mt-2">
                  {receiptCount} receipts
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#465E51] mb-2">
                  Active 1099 Subcontractors
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={subcontractorCount}
                  onChange={(e) => setSubcontractorCount(Number(e.target.value))}
                  className="w-full accent-[#27B665]"
                />
                <div className="text-lg font-bold font-mono text-[#0C2B1C] mt-2">
                  {subcontractorCount} subs
                </div>
              </div>
            </div>

            {/* Calculated Metrics Output */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#EBF7F0]/60 rounded-2xl border border-[#27B665]/30 mb-8">
              <div>
                <div className="text-xs text-[#52705F] font-semibold">Admin Time Saved</div>
                <div className="text-2xl font-bold text-[#0C2B1C] font-mono mt-1">
                  {tradeSavings.totalHoursSaved} hrs/mo
                </div>
              </div>
              <div>
                <div className="text-xs text-[#52705F] font-semibold">Owner Time Value</div>
                <div className="text-2xl font-bold text-[#0C2B1C] font-mono mt-1">
                  ${tradeSavings.valueOfTimeSaved.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#52705F] font-semibold">Deductions Recovered</div>
                <div className="text-2xl font-bold text-[#0C2B1C] font-mono mt-1">
                  ${tradeSavings.estimatedMissedDeductionsRecovered.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#52705F] font-semibold">Total Monthly Value</div>
                <div className="text-2xl font-bold text-[#27B665] font-mono mt-1">
                  ${tradeSavings.totalMonthlyGain.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={onOpenBooking}
                className="ret-btn px-8 py-3.5 text-base font-bold shadow-md cursor-pointer"
              >
                Apply for Trades Early Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Internal Navigation & Interlinking */}
      <section className="py-16 max-w-6xl mx-auto px-6 border-t border-[#E4E7E1]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-2xl border border-[#E4E7E1]">
          <div>
            <h3 className="text-xl font-bold text-[#0C2B1C] mb-1">Are you an Accounting Firm or CPA?</h3>
            <p className="text-sm text-[#465E51]">
              Explore Retalyy's firm multi-entity dashboard and autonomous monthly closing platform.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/firms"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('firms');
                window.history.pushState(null, '', '/firms');
              }}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#0C2B1C] text-white hover:bg-[#153e2a] transition-colors"
            >
              View Firm Platform
            </a>
            <a
              href="/solutions"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('solutions');
                window.history.pushState(null, '', '/solutions');
              }}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-[#D5DDD7] text-[#0C2B1C] hover:border-[#27B665] transition-colors"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
