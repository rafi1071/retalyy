import React, { useState } from 'react';
import { 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Layers, 
  Lock, 
  FileCheck, 
  Scale, 
  Cpu, 
  Keyboard,
  ArrowRight,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { RetalyyIconMark } from './RetalyyLogo';

interface ReviewQueueShowcaseSectionProps {
  onExploreFirmPartner: () => void;
  onExploreDirectBusiness: () => void;
}

export const ReviewQueueShowcaseSection: React.FC<ReviewQueueShowcaseSectionProps> = ({
  onExploreFirmPartner,
  onExploreDirectBusiness
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const reviewItems = [
    {
      vendor: 'Home Depot Pro Supply',
      amount: '$412.50',
      date: 'Oct 16, 2026',
      reason: 'Job Costing Allocation (Materials vs Supplies)',
      suggestedAccount: '5100 Direct Job Materials',
      confidence: 98.4,
      rationale: 'Line items match PVC piping and duct connectors for Project #101 (Metro Civic Center). 100% ordinary & necessary business expense under IRC § 162.',
      docName: 'HomeDepot_Receipt_Oct16_9021.pdf',
      docLines: ['PVC Schedule 40 2" Pipe (x12) - $288.00', 'Heavy-Duty Duct Connectors (x4) - $94.50', 'Sales Tax (8.25%) - $30.00']
    },
    {
      vendor: 'Bay Electrical Trades LLC',
      amount: '$540.00',
      date: 'Oct 14, 2026',
      reason: '1099-NEC Threshold Radar ($600 IRS Cap)',
      suggestedAccount: '5200 Subcontractor Trade Labor',
      confidence: 97.2,
      rationale: 'Payment brings subcontractor YTD total to $540.00 (within $60 of mandatory $600 IRS 1099-NEC threshold). W-9 form verification request queued.',
      docName: 'BayElectrical_SubInvoice_441.pdf',
      docLines: ['Phase 2 Conduit Wiring (8 hrs) - $500.00', 'Permit Expediting Fee - $40.00']
    },
    {
      vendor: 'Amazon Web Services, Inc.',
      amount: '$1,840.50',
      date: 'Oct 15, 2026',
      reason: 'Cloud Compute Infrastructure COGS',
      suggestedAccount: '6100 Software Subscriptions & Cloud',
      confidence: 99.2,
      rationale: 'EC2 cloud compute server hosting and database instances. Classified as Technology Operating Expense under IRC § 162.',
      docName: 'AWS_Oct2026_TaxInvoice_90124.pdf',
      docLines: ['Amazon EC2 Cloud Compute - $1,420.00', 'Amazon RDS PostgreSQL Database - $420.50']
    }
  ];

  const current = reviewItems[selectedItemIndex];

  return (
    <section className="py-20 bg-white border-b border-[#D9F0E2]">
      <div className="wrap space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="ret-pill mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
            <span>The 95% Automated Close · 5% Human Exception Triage</span>
          </div>
          <h2 className="text-[clamp(30px,4vw,50px)] font-extrabold tracking-[-0.035em] text-[#0C2B1C] leading-[1.08]">
            Accountants review roughly 5% of entries <br className="hidden sm:inline" />
            instead of touching 100%.
          </h2>
          <p className="text-base text-[#52705F] mt-3 leading-relaxed">
            Retalyy automates the entire monthly close: document vision extraction, transaction categorization, bank reconciliation, and draft statements. Only genuine anomalies and edge cases reach the reviewer in a keyboard-first queue, allowing firms to serve twice as many clients with the same staff.
          </p>
        </div>

        {/* 2-Column Grid: Review Queue UI on Left, 5 Invariants on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: SIMULATED 3-PANE KEYBOARD REVIEW QUEUE */}
          <div className="lg:col-span-7 bg-[#0C2B1C] rounded-[32px] p-5 sm:p-6 text-white shadow-xl border border-[#16442E] space-y-4">
            
            {/* Top Queue Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <RetalyyIconMark size={20} />
                <span className="font-bold text-[#8EDDA6]">Retalyy Review Queue</span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-white/60 hidden sm:inline">3 Exceptions Pending Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#27B665]/20 text-[#8EDDA6] font-mono text-[11px] font-bold border border-[#27B665]/30">
                  95% Auto-Posted
                </span>
              </div>
            </div>

            {/* 3-Pane Mini Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
              
              {/* Left Column: Item List */}
              <div className="sm:col-span-4 space-y-2">
                <div className="text-[10px] uppercase tracking-wider font-mono text-white/50 px-1 font-bold">
                  Review Items (3)
                </div>
                {reviewItems.map((item, idx) => {
                  const isSelected = selectedItemIndex === idx;
                  return (
                    <button
                      key={item.vendor}
                      type="button"
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-[#27B665] text-white border-[#27B665] shadow-sm'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <div className="font-bold truncate text-[11px]">{item.vendor}</div>
                      <div className="flex justify-between items-center text-[10px] mt-1 opacity-90 font-mono">
                        <span>{item.amount}</span>
                        <span>{item.confidence}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Center Column: AI Rationale & Suggestion */}
              <div className="sm:col-span-5 bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-2.5">
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#8EDDA6] font-bold">
                  AI Suggestion & Rationale
                </div>

                <div>
                  <div className="text-[10px] text-white/60">Suggested Account</div>
                  <div className="font-bold text-white font-mono text-xs">{current.suggestedAccount}</div>
                </div>

                <div>
                  <div className="text-[10px] text-white/60">Confidence Score</div>
                  <div className="font-bold text-[#8EDDA6] text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" />
                    <span>{current.confidence}% Match (Pydantic Verified)</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-white/60">AI Citation Rationale</div>
                  <p className="text-[11px] text-white/80 leading-relaxed mt-0.5 font-light">
                    {current.rationale}
                  </p>
                </div>
              </div>

              {/* Right Column: Source Document Viewer */}
              <div className="sm:col-span-3 bg-white/5 rounded-2xl p-3 border border-white/10 space-y-2 hidden sm:block">
                <div className="text-[10px] uppercase tracking-wider font-mono text-[#8EDDA6] font-bold flex items-center justify-between">
                  <span>Source Doc</span>
                  <Eye className="w-3 h-3 text-[#27B665]" />
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-[#27B665]/40 text-[10px] font-mono text-[#8EDDA6] truncate">
                  {current.docName}
                </div>
                <div className="space-y-1 pt-1">
                  {current.docLines.map((line, i) => (
                    <div key={i} className="text-[9px] text-white/70 bg-white/5 p-1 rounded border border-white/5 leading-tight">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Keyboard Shortcuts Strip */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-white/70">
              <div className="flex items-center gap-2">
                <Keyboard className="w-3.5 h-3.5 text-[#8EDDA6]" />
                <span className="text-white font-bold">Review Shortcuts:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold border border-white/10">[A] Approve</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold border border-white/10">[E] Edit</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold border border-white/10">[R] Reject</span>
                <span className="px-1.5 py-0.5 rounded bg-[#27B665]/20 text-[#8EDDA6] font-bold border border-[#27B665]/40">[B] Bulk Approve</span>
              </div>
            </div>

          </div>

          {/* RIGHT: THE 5 NON-NEGOTIABLE INVARIANTS */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="ret-pill mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#27B665]" />
              <span>Financial-Grade Safety Guardrails</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
              Built on strict accounting invariants, not AI hallucinations.
            </h3>
            <p className="text-xs text-[#52705F] leading-relaxed">
              Retalyy enforces financial invariants in code and database constraints. The LLM never touches arithmetic; every posted dollar is double-entry verified.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  title: '1. Money is Never a Float',
                  desc: 'All currency values are stored as integer minor units (cents) to mathematically eliminate floating-point rounding errors.',
                  icon: DollarSign
                },
                {
                  title: '2. The AI Never Computes Numbers',
                  desc: 'Totals, statements, tax reserves, and bank balances come strictly from SQL and Python code. The AI only classifies and extracts.',
                  icon: Cpu
                },
                {
                  title: '3. Narrative Numbers are Verified',
                  desc: 'Every number written in executive month-end commentary must exist in verified database statements before display.',
                  icon: FileCheck
                },
                {
                  title: '4. Double-Entry Balance Invariant',
                  desc: 'Every journal entry enforces debits = credits with database triggers. Posted entries are immutable (corrections via reversals).',
                  icon: Scale
                },
                {
                  title: '5. Immutable Audit Evidence Trail',
                  desc: 'Permanent cryptographic chain linking every general ledger line to its original receipt, AI decision, and human CPA approver.',
                  icon: Lock
                }
              ].map(inv => {
                const Icon = inv.icon;
                return (
                  <div key={inv.title} className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs flex items-start gap-3 hover:border-[#8EDDA6] transition-all">
                    <div className="w-7 h-7 rounded-lg bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#27B665]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0C2B1C]">{inv.title}</div>
                      <div className="text-[11px] text-[#52705F] mt-0.5 leading-relaxed">{inv.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onExploreFirmPartner}
                className="ret-btn sm"
              >
                <span>Partner Firm OS →</span>
              </button>
              <button
                type="button"
                onClick={onExploreDirectBusiness}
                className="ret-btn sm secondary"
              >
                <span>Direct Business OS</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
