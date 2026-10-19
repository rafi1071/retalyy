import React from 'react';
import {
  FileText,
  CheckCircle,
  GitCompare,
  Tags,
  Calculator,
  Send,
  Play,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { TransactionRecord } from '../types/accounting';

interface WorkflowStepperProps {
  selectedStep: number | null;
  setSelectedStep: (step: number | null) => void;
  transactions: TransactionRecord[];
  onRunBatchPipeline: () => void;
  isProcessing: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  selectedStep,
  setSelectedStep,
  transactions,
  onRunBatchPipeline,
  isProcessing
}) => {
  const steps = [
    {
      num: 1,
      title: 'Extract Data',
      icon: FileText,
      tag: 'OCR & Feeds',
      desc: 'Dates, amounts, counterparties, invoice #s & tax',
      count: transactions.filter((t) => t.sourceDocument !== undefined).length,
      color: 'indigo'
    },
    {
      num: 2,
      title: 'Normalize & Validate',
      icon: CheckCircle,
      tag: 'Integrity Check',
      desc: 'Standardize vendors, ISO dates, signs & duplicates',
      count: transactions.filter((t) => t.isNormalized).length,
      color: 'blue'
    },
    {
      num: 3,
      title: 'Match Records',
      icon: GitCompare,
      tag: '2-Way / 3-Way Match',
      desc: 'Link bank debits to bills, receipts & payments',
      count: transactions.filter((t) => t.matching.matchStatus === 'high_confidence').length,
      color: 'teal'
    },
    {
      num: 4,
      title: 'Classify (COA)',
      icon: Tags,
      tag: 'Chart of Accounts',
      desc: 'Map to revenue, expense, asset or liability codes',
      count: transactions.filter((t) => t.accountCode).length,
      color: 'violet'
    },
    {
      num: 5,
      title: 'Determine Treatment',
      icon: Calculator,
      tag: 'GAAP & Tax Logic',
      desc: 'Immediate expense vs prepaid asset vs CapEx',
      count: transactions.filter((t) => t.journalLines.length > 0).length,
      color: 'amber'
    },
    {
      num: 6,
      title: 'Post / Approve',
      icon: Send,
      tag: 'General Ledger',
      desc: 'Auto-post clean rules; route exceptions to CPA',
      count: transactions.filter((t) => t.status === 'posted' || t.status === 'approved').length,
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Transaction Processing Pipeline
            </h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-indigo-400 font-medium">6 Automated Verification Stages</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingested documents & bank feeds are converted into validated, audit-ready double-entry journal entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedStep !== null && (
            <button
              onClick={() => setSelectedStep(null)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded border border-slate-700 hover:border-slate-600 transition-colors"
            >
              Show All Stages
            </button>
          )}

          <button
            onClick={onRunBatchPipeline}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Ingestion Batch...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Autonomous Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((s) => {
          const isSelected = selectedStep === s.num;
          const Icon = s.icon;
          return (
            <button
              key={s.num}
              onClick={() => setSelectedStep(isSelected ? null : s.num)}
              className={`text-left p-3 rounded-lg border transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500/50 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  Step 0{s.num}
                </span>
                <span className="text-xs font-mono font-bold text-white tabular-nums bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                  {s.count}/{transactions.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                <h3 className="text-xs font-semibold text-white truncate">
                  {s.title}
                </h3>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-1">
                {s.desc}
              </p>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-indigo-300 font-medium">
                  <span>Filtered View</span>
                  <span>Active</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
