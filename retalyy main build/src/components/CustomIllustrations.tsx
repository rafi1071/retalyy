import React, { useState } from 'react';
import { formatCurrency } from '../utils/taxCalculator';

// 1. Interactive S-Corp Flow Architecture Diagram
export const SCorpFlowDiagram: React.FC = () => {
  const [profit, setProfit] = useState(180000);
  const [salaryPercent, setSalaryPercent] = useState(45); // 45% reasonable salary

  const reasonableSalary = Math.round((profit * salaryPercent) / 100);
  const k1Distribution = profit - reasonableSalary;

  // Self employment tax comparison
  const solePropSeTax = Math.round(profit * 0.9235 * 0.153);
  const scorpFicaTax = Math.round(Math.min(reasonableSalary, 176100) * 0.153);
  const annualSavings = Math.max(0, solePropSeTax - scorpFicaTax - 1200);

  return (
    <div className="bg-[#EDF9F1] border border-[#D9F0E2] rounded-[36px] p-6 sm:p-10 shadow-lg shadow-[#0F7A41]/10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9F0E2] pb-6">
        <div>
          <div className="ret-pill mb-2">
            <i />
            <span>Interactive Operational Flow Architecture</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0C2B1C] tracking-tight">
            How Operating Margin & Working Capital Flow Through Your Business
          </h3>
          <p className="text-xs sm:text-sm text-[#52705F] mt-1">
            Slide revenue or direct cost ratio to visualize real-time operational margins and cash flow distribution across projects.
          </p>
        </div>

        <div className="text-right sm:shrink-0 bg-white px-5 py-3 rounded-2xl border border-[#D9F0E2] shadow-sm">
          <div className="text-[11px] font-mono font-bold text-[#52705F]">NET OPERATIONAL CASH FLOW</div>
          <div className="font-display font-extrabold text-3xl text-[#0F7A41] tabular-nums">
            {formatCurrency(annualSavings)}
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-[#D9F0E2]">
        <div>
          <div className="flex justify-between text-xs font-bold text-[#0C2B1C] mb-1.5">
            <span>Annual Gross Billings / Revenue:</span>
            <span className="font-mono text-[#0F7A41]">{formatCurrency(profit)}</span>
          </div>
          <input
            type="range"
            min={90000}
            max={350000}
            step={5000}
            value={profit}
            style={{ '--f': `${((profit - 90000) / (350000 - 90000)) * 100}%` } as any}
            onChange={(e) => setProfit(Number(e.target.value))}
            className="w-full cursor-pointer"
            aria-label="Net Profit"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-[#0C2B1C] mb-1.5">
            <span>Direct Labor & Delivery Cost Allocation:</span>
            <span className="font-mono text-[#0F7A41]">{salaryPercent}% ({formatCurrency(reasonableSalary)})</span>
          </div>
          <input
            type="range"
            min={35}
            max={65}
            step={1}
            value={salaryPercent}
            style={{ '--f': `${((salaryPercent - 35) / (65 - 35)) * 100}%` } as any}
            onChange={(e) => setSalaryPercent(Number(e.target.value))}
            className="w-full cursor-pointer"
            aria-label="Salary Allocation"
          />
        </div>
      </div>

      {/* Visual Pipe Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
        
        {/* Step 1: Inbound Revenue Box */}
        <div className="md:col-span-4 bg-white border border-[#D9F0E2] rounded-3xl p-6 text-center space-y-3 relative shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] flex items-center justify-center mx-auto text-[#0F7A41]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-mono text-[#52705F] uppercase font-bold">Gross Inflows</div>
            <div className="font-display font-extrabold text-2xl text-[#0C2B1C] tabular-nums">
              {formatCurrency(profit)}
            </div>
            <div className="text-xs text-[#52705F] mt-0.5">Operating Inbound Feeds</div>
          </div>
          <div className="text-[11px] bg-[#EDF9F1] text-[#0F7A41] font-bold py-1 px-2.5 rounded-full inline-block">
            Multi-Industry Revenue
          </div>
        </div>

        {/* Middle Connector */}
        <div className="md:col-span-1 flex flex-col items-center justify-center text-[#27B665]">
          <svg className="w-8 h-8 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="text-[10px] font-mono font-bold text-[#52705F] uppercase text-center mt-1">Split</div>
        </div>

        {/* Step 2: Dual Split Channels */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Channel A: Direct Labor & Project Costs */}
          <div className="bg-white border border-[#D9F0E2] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-sm">
                COGS
              </div>
              <div>
                <div className="font-bold text-sm text-[#0C2B1C]">Direct Project & Delivery Costs</div>
                <div className="text-xs text-[#52705F]">Labor, Subcontractors, Materials & Burden</div>
                <div className="text-[11px] text-amber-700 font-mono mt-0.5">Automated Job Costing Sync Active</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-xl text-[#0C2B1C] tabular-nums">
                {formatCurrency(reasonableSalary)}
              </div>
              <div className="text-[11px] text-[#52705F] font-mono">Cost Ratio: {salaryPercent}%</div>
            </div>
          </div>

          {/* Channel B: Operating Margin & Cash Buffer */}
          <div className="bg-[#EDF9F1] border-2 border-[#27B665] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#27B665] text-white flex items-center justify-center font-bold text-sm shadow">
                CASH
              </div>
              <div>
                <div className="font-bold text-sm text-[#0C2B1C]">Operating Margin & Cash Reserves</div>
                <div className="text-xs text-[#52705F]">Working Capital Available for Runway & Expansion</div>
                <div className="text-[11px] text-[#0F7A41] font-bold font-mono mt-0.5">13-Week Cash Forecast Protected</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-xl text-[#0F7A41] tabular-nums">
                {formatCurrency(k1Distribution)}
              </div>
              <div className="text-[11px] font-bold text-[#0F7A41] font-mono">Gross Margin: {100 - salaryPercent}%</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

// 2. Interactive Operational Ledger Inspector
export const ScheduleCInspector: React.FC = () => {
  const [activeLine, setActiveLine] = useState<'line31' | 'line12' | 'line30' | 'line10'>('line31');

  const lineData = {
    line31: {
      name: 'Line 31: Net Operating Income',
      statutoryCode: 'P&L Line 31',
      amount: '$175,000',
      issue: 'Manual month-end reconciliation creates 14-day reporting delays for owners and managers.',
      recommendation: 'Continuous bank sync and automated journal entries deliver same-day P&L and balance sheet visibility.'
    },
    line12: {
      name: 'Line 12: Equipment & Asset Depreciation',
      statutoryCode: 'Asset Schedule',
      amount: '$0 Allocated',
      issue: 'Asset maintenance and equipment depreciation not allocated to individual project costs.',
      recommendation: 'Assign machinery depreciation directly to active job sites for accurate gross margin reporting.'
    },
    line30: {
      name: 'Line 30: Operational Overhead & Software',
      statutoryCode: 'Operating Overhead',
      amount: '$1,500 / mo',
      issue: 'Recurring vendor bills and SaaS subscriptions unreviewed across multiple corporate card feeds.',
      recommendation: 'Consolidate vendor spend, eliminate duplicate seat licenses, and auto-categorize recurring AP.'
    },
    line10: {
      name: 'Line 10: Contractor & Vendor Invoices',
      statutoryCode: 'Accounts Payable',
      amount: '$3,200',
      issue: 'Vendor invoices pending W-9 compliance and automated two-way purchase order matching.',
      recommendation: 'Retalyy auto-matches invoices against purchase orders and tracks vendor compliance in real time.'
    }
  };

  const current = lineData[activeLine];

  return (
    <div className="bg-white border border-[#D9F0E2] rounded-[36px] p-6 sm:p-10 shadow-xl shadow-[#0F7A41]/5 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF6F1] pb-5">
        <div>
          <div className="ret-pill mb-2">
            <i />
            <span>Interactive Operational Ledger Inspector</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0C2B1C]">
            Diagnostic Scan of Operating Profit & Cost Drivers
          </h3>
          <p className="text-xs sm:text-sm text-[#52705F] mt-1">
            Click on highlighted operational lines below to see how our engine categorizes expenses and detects budget variances.
          </p>
        </div>

        <span className="font-mono text-xs font-bold text-[#0F7A41] bg-[#EDF9F1] px-3.5 py-1.5 rounded-full shrink-0">
          Standard Chart of Accounts
        </span>
      </div>

      {/* Form Mockup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: General Ledger Sheet */}
        <div className="lg:col-span-7 bg-[#FAFCFA] border-2 border-[#D9F0E2] rounded-2xl p-5 font-mono text-xs text-[#0C2B1C] shadow-inner space-y-3">
          
          <div className="border-b border-[#D9F0E2] pb-3 flex justify-between items-center text-[11px] text-[#52705F]">
            <span className="font-bold">OPERATING PROFIT & LOSS (P&L)</span>
            <span>Continuous General Ledger Feed</span>
          </div>

          <div className="space-y-2">
            {/* Line 1 */}
            <div className="flex justify-between items-center p-2 rounded hover:bg-[#EDF9F1]">
              <span>1. Gross receipts or sales</span>
              <span className="font-bold">$210,000</span>
            </div>

            {/* Line 10 (Interactive) */}
            <button
              onClick={() => setActiveLine('line10')}
              className={`w-full text-left flex justify-between items-center p-2 rounded transition-all cursor-pointer ${activeLine === 'line10' ? 'bg-[#27B665] text-white font-bold ring-2 ring-[#0F7A41]' : 'bg-[#EDF9F1] text-[#0C2B1C] hover:bg-[#C6EDD4]'}`}
            >
              <span>10. Contractor & vendor invoices</span>
              <span className="tabular-nums">$3,200 ★</span>
            </button>

            {/* Line 12 (Interactive) */}
            <button
              onClick={() => setActiveLine('line12')}
              className={`w-full text-left flex justify-between items-center p-2 rounded transition-all cursor-pointer ${activeLine === 'line12' ? 'bg-[#27B665] text-white font-bold ring-2 ring-[#0F7A41]' : 'bg-[#EDF9F1] text-[#0C2B1C] hover:bg-[#C6EDD4]'}`}
            >
              <span>12. Equipment & asset depreciation</span>
              <span className="tabular-nums">$0 (Unallocated) ★</span>
            </button>

            {/* Line 28 */}
            <div className="flex justify-between items-center p-2 rounded hover:bg-[#EDF9F1]">
              <span>28. Total operating expenses</span>
              <span className="font-bold">$33,500</span>
            </div>

            {/* Line 30 (Interactive) */}
            <button
              onClick={() => setActiveLine('line30')}
              className={`w-full text-left flex justify-between items-center p-2 rounded transition-all cursor-pointer ${activeLine === 'line30' ? 'bg-[#27B665] text-white font-bold ring-2 ring-[#0F7A41]' : 'bg-[#EDF9F1] text-[#0C2B1C] hover:bg-[#C6EDD4]'}`}
            >
              <span>30. Operational overhead & software</span>
              <span className="tabular-nums">$1,500 ★</span>
            </button>

            {/* Line 31 (Interactive - Primary) */}
            <button
              onClick={() => setActiveLine('line31')}
              className={`w-full text-left flex justify-between items-center p-2.5 rounded-lg transition-all cursor-pointer border-t-2 border-[#0F7A41] ${activeLine === 'line31' ? 'bg-[#0F7A41] text-white font-bold ring-2 ring-[#27B665]' : 'bg-[#EDF9F1] text-[#0C2B1C] hover:bg-[#C6EDD4]'}`}
            >
              <span className="font-bold">31. NET OPERATING INCOME</span>
              <span className="font-bold tabular-nums">$175,000 (Scanned) ★</span>
            </button>
          </div>

          <div className="text-[10px] text-[#52705F] text-center pt-2">
            ★ Lines flagged with operational efficiency and cost-control opportunities by Retalyy Engine
          </div>
        </div>

        {/* Right: Inspection Callout Card */}
        <div className="lg:col-span-5 bg-[#EDF9F1] border border-[#D9F0E2] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#0F7A41] bg-white px-3 py-1 rounded-full border border-[#D9F0E2]">
              {current.statutoryCode}
            </span>
            <span className="font-display font-extrabold text-xl text-[#0C2B1C]">
              {current.amount}
            </span>
          </div>

          <h4 className="font-display font-bold text-lg text-[#0C2B1C]">
            {current.name}
          </h4>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 bg-white rounded-xl border border-[#D9F0E2]">
              <span className="font-bold text-amber-800 block mb-0.5 font-mono">Current Audit Diagnostic:</span>
              <p className="text-[#52705F]">{current.issue}</p>
            </div>

            <div className="p-3 bg-[#27B665] text-white rounded-xl shadow-sm">
              <span className="font-bold text-white block mb-0.5 font-mono">Retalyy Strategic Action Plan:</span>
              <p className="text-white/95">{current.recommendation}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

// 3. Enterprise Security & Infrastructure Seal
export const VaultSecuritySeal: React.FC = () => (
  <div className="p-6 bg-white border border-[#D9F0E2] rounded-3xl flex items-center gap-5 shadow-sm">
    <div className="w-16 h-16 rounded-2xl bg-[#EDF9F1] border-2 border-[#27B665] flex items-center justify-center shrink-0">
      <svg className="w-9 h-9 text-[#0F7A41]" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#0F7A41" strokeWidth="1.8" strokeDasharray="3 2"/>
        <rect x="10" y="14" width="12" height="11" rx="2.5" fill="#27B665"/>
        <path d="M12 14V10C12 7.8 13.8 6 16 6C18.2 6 20 7.8 20 10V14" stroke="#0F7A41" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="16" cy="19.5" r="1.5" fill="#fff"/>
      </svg>
    </div>
    <div className="space-y-1">
      <div className="font-display font-bold text-base text-[#0C2B1C]">
        Enterprise-Grade AES-256 Cloud Security & Role-Based Access
      </div>
      <p className="text-xs text-[#52705F] leading-relaxed">
        Bank-level 256-bit encryption for all transactional data and financial records. Strict role-based access control (RBAC), multi-factor authentication, and SOC-2 compliant cloud infrastructure.
      </p>
    </div>
  </div>
);

// 4. Bespoke CPA Credential Crest Card
export const CpaCredentialBadge: React.FC<{
  name: string;
  title: string;
  license: string;
  initials: string;
  bio: string;
}> = ({ name, title, license, initials, bio }) => (
  <div className="bg-white border border-[#D9F0E2] rounded-[28px] p-7 space-y-4 hover:border-[#27B665] transition-all shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#27B665] to-[#0F7A41] text-white flex items-center justify-center font-display font-extrabold text-xl shadow-md shrink-0">
        {initials}
      </div>
      <div>
        <h4 className="font-display font-bold text-lg text-[#0C2B1C]">{name}</h4>
        <div className="text-xs font-semibold text-[#0F7A41]">{title}</div>
        <div className="text-[11px] font-mono text-[#52705F]">{license}</div>
      </div>
    </div>
    <p className="text-xs text-[#52705F] leading-relaxed">
      {bio}
    </p>
    <div className="pt-2 border-t border-[#EEF6F1] flex items-center justify-between text-[11px] font-mono text-[#52705F]">
      <span className="flex items-center gap-1.5 text-[#0F7A41] font-bold">
        <span className="w-2 h-2 rounded-full bg-[#27B665]" />
        Active Workflow
      </span>
      <span>Verified Engine</span>
    </div>
  </div>
);
