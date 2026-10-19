import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { RetalyyIconMark } from './RetalyyLogo';
import { 
  CATEGORY_PACKS, 
  TARGET_SIZE_MATRIX, 
  PITCH_RULES, 
  PILOT_OFFER_DETAILS 
} from '../data/briefData';

interface MissionViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const MissionView: React.FC<MissionViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const [activeSection, setActiveSection] = useState<'decision' | 'size' | 'icp' | 'modules' | 'model' | 'validation' | 'risks'>('decision');

  return (
    <div className="wrap py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="max-w-4xl space-y-5">
        <div className="flex items-center gap-2.5">
          <RetalyyIconMark size={24} />
          <div className="ret-pill">
            <i />
            <span>Retalyy: Final Startup Brief · October 15, 2026</span>
          </div>
        </div>
        <h1 className="text-[clamp(36px,5.2vw,68px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.04]">
          Autonomous finance operations for accounting firms & businesses.
        </h1>
        <p className="text-xl text-[#52705F] leading-relaxed font-normal">
          Retalyy powers two streamlined workflows: we partner directly with accounting firms via a dedicated multi-client dashboard to automate data preparation, and we work directly with businesses to run real-time bookkeeping, job costing, and cash forecasting.
        </p>

        <div className="flex flex-wrap gap-3 text-xs font-mono text-[#52705F] pt-2">
          <span className="bg-[#EDF9F1] text-[#0F7A41] px-3 py-1 rounded-full border border-[#D9F0E2]">
            Workflows: Accounting Firms & Direct Businesses
          </span>
          <span className="bg-[#EDF9F1] text-[#0F7A41] px-3 py-1 rounded-full border border-[#D9F0E2]">
            Firm Partner: Dedicated Multi-Client OS
          </span>
          <span className="bg-[#EDF9F1] text-[#0F7A41] px-3 py-1 rounded-full border border-[#D9F0E2]">
            Direct Business: Autonomous Finance Dept
          </span>
          <span className="bg-[#EDF9F1] text-[#0F7A41] px-3 py-1 rounded-full border border-[#D9F0E2]">
            Pilot: Risk-Free Partnership Pilot
          </span>
        </div>
      </div>

      {/* Navigation Tabs for Brief Sections */}
      <div className="flex flex-wrap gap-2 border-b border-[#D9F0E2] pb-4">
        <button
          onClick={() => setActiveSection('decision')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'decision'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          1. Decision Summary
        </button>
        <button
          onClick={() => setActiveSection('size')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'size'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          2. Best Target Size ($2M–$30M)
        </button>
        <button
          onClick={() => setActiveSection('icp')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'icp'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          3. Exact ICPs & Category Packs
        </button>
        <button
          onClick={() => setActiveSection('modules')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'modules'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          4. Functionalities & Modules
        </button>
        <button
          onClick={() => setActiveSection('model')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'model'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          5. Operating Models & Wedge
        </button>
        <button
          onClick={() => setActiveSection('validation')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'validation'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          6. 60-Day Validation Plan
        </button>
        <button
          onClick={() => setActiveSection('risks')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'risks'
              ? 'bg-[#0C2B1C] text-white shadow-sm'
              : 'bg-white text-[#52705F] border border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          7. Risk Matrix & Mitigations
        </button>
      </div>

      {/* SECTION CONTENT ACCORDION / PANELS */}

      {/* 1. DECISION SUMMARY */}
      {activeSection === 'decision' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 1</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">Decision Summary</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              Supersedes the earlier startup brief and the ICP and B2C notes. Launch with owner-operator contractors reached through accounting firms, then extend to small and mid-sized companies as a managed finance function.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#0F7A41] block">Positioning Rule</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Run the finance function with a professional of record</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Do not say "replace the finance department" in outreach: it cannot be proven and it invites the licensing objection. Sell capacity and lower risk, not AI.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#0F7A41] block">Customer Dynamic</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Accounting firms are the channel and licensed backstop</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Individuals and micro-businesses in any category (B2C) are the daily users, served directly and through firms. Every signed firm becomes an acquisition channel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#0F7A41] block">Sequencing Architecture</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">One vertical first (Trades & Construction)</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Start with trades and construction, then the 10 to 150 employee company segment, then a second vertical. B2C is horizontal by design: one universal core with category packs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#0F7A41] block">Commercial Offer</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Risk-free partnership pilot on client accounts</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Setup and data migration handled 100% by Retalyy. Firm name stays on all work. CPA signs off on all output. Pay only after pilot if close time drops ≥40%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. BEST TARGET SIZE */}
      {activeSection === 'size' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 2</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">Best Target Size & Market Evidence</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              The best-fit company is a 15 to 100 employee business with roughly $3M to $25M in revenue and zero to three finance staff. Below $2M the need is mostly books; above $30M the buyer needs ERP integration and audit-grade controls.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] space-y-2 text-xs font-mono text-[#0C2B1C]">
            <div className="font-bold text-[#0F7A41] uppercase tracking-wider">Independent Survey Evidence</div>
            <ul className="space-y-1.5 list-disc pl-4 text-[#52705F]">
              <li><strong>UHY Middle-Market Survey:</strong> 45% of 275+ owners outsource accounting partly or entirely (19% fully, 26% in part).</li>
              <li><strong>Accounting Today Top 100:</strong> Client Accounting Services (CAS) was the #1 niche, with 84% seeing surging demand.</li>
              <li><strong>Vendor benchmarks:</strong> Controller and fractional CFO needs begin at roughly the $10M revenue stage.</li>
              <li><strong>Global Market:</strong> Finance and accounting outsourcing reaches ~$58B in 2025, with outsourced CFO and tax compliance growing fastest.</li>
            </ul>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#D9F0E2]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFDFB] text-xs font-mono uppercase text-[#52705F] border-b border-[#D9F0E2]">
                <tr>
                  <th className="py-3 px-4">Segment</th>
                  <th className="py-3 px-4">Size & Revenue</th>
                  <th className="py-3 px-4">Fit Status</th>
                  <th className="py-3 px-4">Strategic Reason</th>
                  <th className="py-3 px-4">Pricing Hypothesis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF6F1]">
                {TARGET_SIZE_MATRIX.map((item) => (
                  <tr key={item.segment} className={item.fit === 'Best fit' ? 'bg-[#EDF9F1]/40 font-medium' : 'bg-white'}>
                    <td className="py-3.5 px-4 font-bold text-[#0C2B1C]">{item.segment}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">{item.size} · {item.revenue}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        item.fit === 'Best fit' 
                          ? 'bg-[#27B665] text-white' 
                          : item.fit === 'Entry segment'
                          ? 'bg-[#EDF9F1] text-[#0F7A41]'
                          : 'bg-gray-100 text-[#52705F]'
                      }`}>
                        {item.fit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#52705F]">{item.reason}</td>
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#0C2B1C]">{item.pricingHypothesis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EXACT ICPS & CATEGORY PACKS */}
      {activeSection === 'icp' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 3</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">Exact ICPs & 6 B2C Category Packs</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              B2C means individuals and micro-businesses in any category, served directly or through a firm. They share one universal core, and each category adds a pack of rules on top.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORY_PACKS.map((pack) => (
              <div key={pack.id} className="p-6 rounded-3xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#0F7A41] bg-[#EDF9F1] px-2 py-0.5 rounded border border-[#D9F0E2]">
                    {pack.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0C2B1C]">
                    {pack.monthlyPriceAssumption}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#0C2B1C]">
                  {pack.name}
                </h3>
                <div className="text-xs text-[#52705F]">
                  <strong>Who:</strong> {pack.who}
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#D9F0E2] text-xs space-y-1">
                  <span className="font-mono font-bold text-[#0F7A41] block uppercase tracking-wider text-[10px]">Rules Added to Core</span>
                  <p className="text-[#52705F]">{pack.packRules}</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs space-y-1">
                  <span className="font-mono font-bold text-[#C0392B] block uppercase tracking-wider text-[10px]">Money Pain Solved</span>
                  <p className="text-[#52705F]">{pack.typicalMoneyPain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FUNCTIONALITIES & MODULES */}
      {activeSection === 'modules' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 5</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">Exact System Functionalities & Phasing</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              One ledger and data layer sits under every module, so the product is one system rather than six fragmented tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Data Layer</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#EDF9F1] text-[#0F7A41] px-2 py-0.5 rounded">Launch</span>
              </div>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Bank & card feeds; receipt capture by text, email, and mobile app; document matching; complete QuickBooks and Xero replacement with Mercury and Gusto integrations. Every entry traceable to source document.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Vertical Workspace (Contractor CRM)</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#EDF9F1] text-[#0F7A41] px-2 py-0.5 rounded">Launch</span>
              </div>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Configured in hours: trade chart of accounts, job records tied to financials, estimates and progress billing, subcontractor W-9 & 1099 tracking, and secure client portal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Cost Tracking & Job Margins</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#EDF9F1] text-[#0F7A41] px-2 py-0.5 rounded">Launch</span>
              </div>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Job and project costing, budget vs. actual, bid vs. actual, vendor cost view, and live margin slippage alerts before the job finishes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Accounting Operations & Close</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#EDF9F1] text-[#0F7A41] px-2 py-0.5 rounded">Launch</span>
              </div>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Reconciliation, draft balance sheet, income statement, cash flow statement, variance commentary, and month-end close checklist.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Budget & 13-Week Cash Forecast</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">Phase 2</span>
              </div>
              <p className="text-xs text-[#52705F] leading-relaxed">
                13-week rolling cash forecast, what-if scenarios, anomaly alerts, and on-demand lender/bonding reporting packs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-[#0C2B1C]">Control Layer (Review Queue)</span>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#EDF9F1] text-[#0F7A41] px-2 py-0.5 rounded">Launch</span>
              </div>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Review queue, reviewer sign-off, role permissions, and full audit log. Nothing reaches a client without licensed professional of record sign-off.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. OPERATING MODEL & WEDGE */}
      {activeSection === 'model' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 6 & 8</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">Operating Model Tiers & Competitive Wedge</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              Every output is a draft for a licensed professional. A named CPA or Enrolled Agent signs off before anything reaches an end client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#EDF9F1] border border-[#D9F0E2] space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Tier A · Revenue Core</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Firm-Branded App</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                The owner uses Retalyy, the firm is the visible provider and signs off, and the owner pays the firm. Lowest risk and primary channel.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#D9F0E2] space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0C2B1C]">Tier B · Network Scale</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Retalyy Consumer Brand</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Owners sign up directly; licensed partner firms in the network review and bill. Added once the partner firm network exists.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#D9F0E2] space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0C2B1C]">Tier C · Front Door</span>
              <h3 className="font-display font-bold text-lg text-[#0C2B1C]">Software-Only Tier</h3>
              <p className="text-xs text-[#52705F] leading-relaxed">
                Tracking, receipts, and estimated tax calculators with no advice. The front door ($30–$120/mo) and funnel into A or B.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0C2B1C] text-white space-y-4">
            <div className="text-xs font-mono font-bold uppercase text-[#8EDDA6]">
              Competitive Wedge vs. Funded Competitors
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Competitors like Synthetic ($10M Khosla seed) and Fondo focus exclusively on software startups and SaaS companies. Basis raised $100M for general AI accountants. <strong>Our wedge:</strong> none of these players combine depth in one blue-collar vertical (Trades & Construction), a firm channel with done-for-you onboarding, and risk-free commercial terms (flexible partnership pilot).
            </p>
          </div>
        </div>
      )}

      {/* 6. 60-DAY VALIDATION PLAN */}
      {activeSection === 'validation' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 12</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">60-Day Validation Plan & Phase Gates</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              Pre-validation execution gates to verify demand, willingness to pay, and operational metrics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#27B665] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="font-display font-bold text-[#0C2B1C]">Firm Discovery Interviews</h4>
                <p className="text-xs text-[#52705F] mt-0.5">
                  Interview 15 accounting firms that serve contractors: confirm the vertical, the month-end pain, and what they pay today.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#27B665] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="font-display font-bold text-[#0C2B1C]">Contractor & B2C Problem Validation</h4>
                <p className="text-xs text-[#52705F] mt-0.5">
                  Interview 15 to 20 owner-operator tradespeople and 10 contractor companies with 10 to 150 staff: test receipt-by-text behavior and willingness to pay in the $30 to $120/mo band.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#27B665] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="font-display font-bold text-[#0C2B1C]">5-Firm Pilot Execution</h4>
                <p className="text-xs text-[#52705F] mt-0.5">
                  Sign 5 pilot firms with 3 clients each. Measure hours per close before and after, share of transactions accepted without edits (&gt;85% target), and reviewer time per exception.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#EDF9F1] border border-[#27B665] flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0C2B1C] text-[#8EDDA6] font-bold flex items-center justify-center shrink-0 text-sm">
                4
              </div>
              <div>
                <h4 className="font-display font-bold text-[#0C2B1C]">Decision Gate (Day 60)</h4>
                <p className="text-xs text-[#0F7A41] mt-0.5 font-mono">
                  Proceed if at least 3 of 5 firms convert to paid and close time falls by at least 40%. If not, narrow the vertical or fix the exception rate before selling more.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. RISKS & MITIGATIONS */}
      {activeSection === 'risks' && (
        <div className="space-y-8 bg-white border border-[#D9F0E2] rounded-[32px] p-8 sm:p-12 shadow-sm">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#0F7A41]">Section 11</span>
            <h2 className="text-3xl font-extrabold text-[#0C2B1C] mt-1">Risk Matrix & Direct Mitigations</h2>
            <p className="text-[#52705F] mt-2 leading-relaxed">
              Transparent, objective assessment of startup risks and active engineering guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold text-[#C0392B] uppercase">Licensing & Advice Liability</span>
              <h4 className="font-bold text-sm text-[#0C2B1C]">Practice Boundary Compliance</h4>
              <p className="text-xs text-[#52705F] leading-relaxed">
                <strong>Mitigation:</strong> Retalyy operates strictly as financial management and ledger automation software, never providing public accounting or legal advice. Final reviews remain with partner accounting firms or internal business controllers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold text-[#C0392B] uppercase">Data Security & Safeguards</span>
              <h4 className="font-bold text-sm text-[#0C2B1C]">FTC Safeguards & Financial Data</h4>
              <p className="text-xs text-[#52705F] leading-relaxed">
                <strong>Mitigation:</strong> Enterprise AES-256 encryption, strict role-based access control (RBAC), and continuous data integrity audit logs built into Phase 1 before broad release.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold text-[#C0392B] uppercase">Scope Creep</span>
              <h4 className="font-bold text-sm text-[#0C2B1C]">Dilution Across 6 Modules</h4>
              <p className="text-xs text-[#52705F] leading-relaxed">
                <strong>Mitigation:</strong> Strict phase gates. Launch with contractor vertical template only; add B2C categories only as demand-tested packs on the shared core.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFDFB] border border-[#D9F0E2] space-y-2">
              <span className="text-xs font-mono font-bold text-[#C0392B] uppercase">Channel Conflict</span>
              <h4 className="font-bold text-sm text-[#0C2B1C]">Direct B2C vs. Partner Firms</h4>
              <p className="text-xs text-[#52705F] leading-relaxed">
                <strong>Mitigation:</strong> Route direct business owners to local licensed partner firms in the network; establish clear referral terms early so firms gain clients.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Immediate Next Steps Checklist */}
      <div className="bg-[#FAFDFB] border border-[#D9F0E2] rounded-[32px] p-8 sm:p-10 space-y-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#27B665]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F7A41]">
            Section 13 · Immediate Execution Checklist
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white border border-[#D9F0E2] flex items-center gap-2">
            <span className="text-[#27B665] font-bold">✓</span>
            <span>Build contractor vertical template: chart of accounts & job costing</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D9F0E2] flex items-center gap-2">
            <span className="text-[#27B665] font-bold">✓</span>
            <span>Build firm and owner interview lists and scripts</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D9F0E2] flex items-center gap-2">
            <span className="text-[#27B665] font-bold">✓</span>
            <span>Engage US tax attorney on licensing, advice boundaries, and B2C</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D9F0E2] flex items-center gap-2">
            <span className="text-[#27B665] font-bold">✓</span>
            <span>Recruit licensed CPA or Enrolled Agent as reviewer of record</span>
          </div>
        </div>
      </div>

    </div>
  );
};
