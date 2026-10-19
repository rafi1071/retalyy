import React, { useState } from 'react';
import { StrategyFinding, NavigationTab } from '../types';
import { INITIAL_FINDINGS } from '../data/findingsData';
import { formatCurrency } from '../utils/taxCalculator';
import { 
  SCorpShieldIcon, 
  Solo401kVaultIcon, 
  AccountablePlanIcon, 
  AugustaRuleIcon, 
  SafeHarborBeaconIcon, 
  HealthDeductionIcon,
  QbiDiamondIcon 
} from './CustomIcons';

interface FindingsViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const [findings] = useState<StrategyFinding[]>(INITIAL_FINDINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<StrategyFinding | null>(INITIAL_FINDINGS[0]);

  const categories = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'entity', label: 'S-Corp & Entity' },
    { id: 'retirement', label: 'Solo 401(k) & Wealth' },
    { id: 'deduction', label: 'Deductions & Fringe' },
    { id: 'health', label: 'Health & Medical' },
    { id: 'penalty', label: 'Safe Harbor Penalties' }
  ];

  const filtered = selectedCategory === 'all' 
    ? findings 
    : findings.filter(f => f.category === selectedCategory);

  const totalMinSavings = findings.reduce((acc, f) => acc + f.estimatedSavingsRange[0], 0);
  const totalMaxSavings = findings.reduce((acc, f) => acc + f.estimatedSavingsRange[1], 0);

  const getFindingIcon = (category: string, id: string) => {
    if (id === 'find-augusta-rule') return <AugustaRuleIcon size={32} />;
    if (category === 'entity') return <SCorpShieldIcon size={32} />;
    if (category === 'retirement') return <Solo401kVaultIcon size={32} />;
    if (category === 'deduction') return <AccountablePlanIcon size={32} />;
    if (category === 'health') return <HealthDeductionIcon size={32} />;
    if (category === 'penalty') return <SafeHarborBeaconIcon size={32} />;
    return <QbiDiamondIcon size={32} />;
  };

  return (
    <div className="wrap py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9F0E2] pb-6">
        <div>
          <div className="ret-pill mb-3">
            <i />
            <span>Section 5 · Platform-Generated Intelligence</span>
          </div>
          <h1 className="text-[clamp(32px,4vw,52px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
            Financial Management & Strategy Findings
          </h1>
          <p className="text-sm text-[#52705F] mt-1.5">
            Standardized operational ledger recommendations prepared for business review or partner accounting firm sign-off.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] text-[#52705F] font-mono">COMBINED STRATEGY RANGE</div>
            <div className="font-display font-extrabold text-2xl text-[#0F7A41] tabular-nums">
              {formatCurrency(totalMinSavings)} – {formatCurrency(totalMaxSavings)}
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="ret-btn sm secondary"
          >
            Export Strategy Summary
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EDF9F1] rounded-full overflow-x-auto border border-[#D9F0E2]">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === c.id 
                ? 'bg-[#27B665] text-white shadow-sm' 
                : 'text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: List */}
        <div className="lg:col-span-5 space-y-3.5">
          {filtered.map((item) => {
            const isSelected = selectedFinding?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedFinding(item)}
                className={`w-full text-left p-5 rounded-[24px] border transition-all cursor-pointer flex gap-4 items-start ${
                  isSelected 
                    ? 'bg-[#EDF9F1] border-[#27B665] shadow-md ring-1 ring-[#27B665]' 
                    : 'bg-white border-[#D9F0E2] hover:border-[#8EDDA6]'
                }`}
              >
                <div className="mt-1 shrink-0 p-2 bg-white rounded-xl border border-[#D9F0E2]">
                  {getFindingIcon(item.category, item.id)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-[#52705F] font-mono mb-1">
                    <span>{item.citation}</span>
                    <span className="font-bold text-[#0F7A41]">{item.confidenceScore}% Confidence</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-[#0C2B1C] leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-2.5 pt-2 border-t border-[#EEF6F1] flex items-center justify-between text-xs">
                    <span className="text-[#52705F] font-mono">Estimated Savings:</span>
                    <span className="font-display font-extrabold text-[#0F7A41] text-sm tabular-nums">
                      {formatCurrency(item.estimatedSavingsRange[0])} – {formatCurrency(item.estimatedSavingsRange[1])}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Strategy Dossier */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 shadow-lg shadow-[#0F7A41]/5 space-y-6 relative overflow-hidden">
          
          {selectedFinding ? (
            <div className="space-y-6">
              
              <div className="stamp font-display font-extrabold">
                Reviewed
              </div>

              <div className="space-y-3 border-b border-[#EEF6F1] pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#EDF9F1] rounded-2xl border border-[#D9F0E2]">
                    {getFindingIcon(selectedFinding.category, selectedFinding.id)}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#0F7A41] font-bold">
                      {selectedFinding.citation} · {selectedFinding.citationSource}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0C2B1C] mt-0.5">
                      {selectedFinding.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-xs text-[#52705F]">Projected Tax Reduction:</span>
                  <span className="text-3xl font-display font-extrabold text-[#0F7A41] tabular-nums">
                    {formatCurrency(selectedFinding.estimatedSavingsRange[0])} – {formatCurrency(selectedFinding.estimatedSavingsRange[1])}
                  </span>
                  <span className="text-xs text-[#52705F]">/ tax year</span>
                </div>
              </div>

              {/* Assumptions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C2B1C] font-mono">
                  Underlying Tax Assumptions
                </h4>
                <ul className="space-y-1.5 text-xs text-[#52705F]">
                  {selectedFinding.assumptions.map((ass, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#27B665] font-bold">✓</span>
                      <span>{ass}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Steps */}
              <div className="p-5 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold text-[#0C2B1C]">
                  <span>Action Steps & Requirements</span>
                  <span className="font-mono text-[#0F7A41]">{selectedFinding.deadline}</span>
                </div>
                <ol className="space-y-2 text-xs text-[#0C2B1C] list-decimal pl-4">
                  {selectedFinding.actionSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Reviewer Audit Trail */}
              <div className="p-5 rounded-2xl border border-[#D9F0E2] bg-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#27B665] text-white font-display font-bold flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0C2B1C]">
                      Prepared & Verified by {selectedFinding.reviewerName}
                    </div>
                    <div className="text-[11px] text-[#52705F]">
                      {selectedFinding.reviewerTitle}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono text-[#52705F]">
                  <div>Audit Timestamp:</div>
                  <div className="font-bold text-[#0C2B1C]">{selectedFinding.reviewedDate}</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onOpenBooking}
                  className="ret-btn"
                >
                  Schedule Consultation with {selectedFinding.reviewerName.split(',')[0]}
                </button>
                <button
                  onClick={() => setActiveTab('vault')}
                  className="ret-btn secondary"
                >
                  Upload Documents to Vault
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-[#52705F]">
              Select a strategy finding to view citations.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
