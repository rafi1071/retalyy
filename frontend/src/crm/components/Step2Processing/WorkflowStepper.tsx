import React from 'react';
import {
  FileText,
  CheckCircle,
  GitCompare,
  Tags,
  Calculator,
  Send,
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

const STEP_COLORS = ['#6366f1', '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#22c55e'];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  selectedStep,
  setSelectedStep,
  transactions,
  onRunBatchPipeline,
  isProcessing
}) => {
  const steps = [
    {
      num: 1, title: 'Extract Data', icon: FileText, tag: 'OCR & Feeds',
      desc: 'Dates, amounts, counterparties, invoice #s & tax',
      count: transactions.filter((t) => t.sourceDocument !== undefined).length,
    },
    {
      num: 2, title: 'Normalize & Validate', icon: CheckCircle, tag: 'Integrity Check',
      desc: 'Standardize vendors, ISO dates, signs & duplicates',
      count: transactions.filter((t) => t.isNormalized).length,
    },
    {
      num: 3, title: 'Match Records', icon: GitCompare, tag: '2-Way / 3-Way Match',
      desc: 'Link bank debits to bills, receipts & payments',
      count: transactions.filter((t) => t.matching.matchStatus === 'high_confidence').length,
    },
    {
      num: 4, title: 'Classify (COA)', icon: Tags, tag: 'Chart of Accounts',
      desc: 'Map to revenue, expense, asset or liability codes',
      count: transactions.filter((t) => t.accountCode).length,
    },
    {
      num: 5, title: 'Determine Treatment', icon: Calculator, tag: 'GAAP & Tax Logic',
      desc: 'Immediate expense vs prepaid asset vs CapEx',
      count: transactions.filter((t) => t.journalLines.length > 0).length,
    },
    {
      num: 6, title: 'Post / Approve', icon: Send, tag: 'General Ledger',
      desc: 'Auto-post clean rules; route exceptions to CPA',
      count: transactions.filter((t) => t.status === 'posted' || t.status === 'approved').length,
    }
  ];

  return (
    <div
      className="p-5 mb-0"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4"
           style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
              Processing Pipeline
            </h2>
            <span className="text-[12px] font-medium" style={{ color: 'var(--accent-primary)' }}>
              6 Stages
            </span>
          </div>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Documents & bank feeds → validated, audit-ready journal entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedStep !== null && (
            <button
              onClick={() => setSelectedStep(null)}
              className="text-[12px] px-2.5 py-1.5 font-medium"
              style={{
                color: 'var(--text-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Show All
            </button>
          )}

          <button
            onClick={onRunBatchPipeline}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3.5 py-1.5 text-[12px] font-semibold text-white"
            style={{
              background: isProcessing ? 'var(--bg-surface-active)' : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              boxShadow: isProcessing ? 'none' : '0 0 16px rgba(99, 102, 241, 0.12)',
              transition: 'all 200ms ease',
            }}
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2">
        {steps.map((s, i) => {
          const isSelected = selectedStep === s.num;
          const Icon = s.icon;
          const color = STEP_COLORS[i];
          const pct = transactions.length > 0 ? Math.round((s.count / transactions.length) * 100) : 0;

          return (
            <button
              key={s.num}
              onClick={() => setSelectedStep(isSelected ? null : s.num)}
              className="text-left p-3 relative group transition-all"
              style={{
                borderRadius: 'var(--radius-lg)',
                background: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-base)',
                border: `1px solid ${isSelected ? `${color}50` : 'var(--border-secondary)'}`,
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.background = 'var(--bg-surface-hover)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-secondary)';
                  e.currentTarget.style.background = 'var(--bg-base)';
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
                  0{s.num}
                </span>
                <span className="text-[11px] font-mono font-bold tabular-nums px-1.5 py-0.5 rounded"
                      style={{
                        background: `${color}12`,
                        color: color,
                        border: `1px solid ${color}20`,
                      }}>
                  {s.count}/{transactions.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                <h3 className="text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {s.title}
                </h3>
              </div>

              <p className="text-[11px] line-clamp-2 leading-relaxed mt-1" style={{ color: 'var(--text-muted)' }}>
                {s.desc}
              </p>

              {/* Progress bar */}
              <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-secondary)' }}>
                <div className="h-full rounded-full transition-all"
                     style={{ width: `${pct}%`, background: color, opacity: 0.7 }} />
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 flex items-center justify-between text-[10px] font-medium"
                     style={{ borderTop: `1px solid ${color}25`, color }}>
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
