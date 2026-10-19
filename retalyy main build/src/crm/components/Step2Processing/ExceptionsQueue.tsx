import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, FileQuestion, ArrowRight } from 'lucide-react';
import { TransactionRecord } from '../types/accounting';

interface ExceptionsQueueProps {
  transactions: TransactionRecord[];
  onOpenDrawer: (txn: TransactionRecord) => void;
  onResolveFlag: (txnId: string, flagId: string) => void;
}

export const ExceptionsQueue: React.FC<ExceptionsQueueProps> = ({
  transactions,
  onOpenDrawer,
  onResolveFlag,
}) => {
  // Collect all transactions with unresolved flags or needs_review status
  const exceptions = transactions.filter(
    (t) => t.status === 'needs_review' || t.validationFlags.some((f) => !f.resolved)
  );

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">
              Senior Accountant & Controller Exception Queue
            </h2>
          </div>
          <span className="font-mono text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
            {exceptions.length} Items Requiring Intervention
          </span>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Autonomous rules hold transactions when confidence is below threshold, potential duplicates are detected,
          materiality caps are triggered (e.g. CapEx &gt; $2,500), or documentation is incomplete.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {exceptions.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-indigo-400">
                  {t.id}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-semibold text-white text-sm">
                  {t.counterparty}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-xs font-bold text-slate-200">
                  ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Validation Flags list */}
              <div className="space-y-1">
                {t.validationFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className={`text-xs flex items-start gap-1.5 ${
                      flag.severity === 'critical'
                        ? 'text-rose-300'
                        : flag.severity === 'warning'
                        ? 'text-amber-300'
                        : 'text-blue-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      <strong>{flag.code}:</strong> {flag.message}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                <span>Date: <strong className="text-slate-300">{t.transactionDate}</strong></span>
                <span>Match Status: <strong className="text-slate-300 capitalize">{t.matching.matchStatus.replace('_', ' ')}</strong></span>
                <span>Proposed: <strong className="text-slate-300">{t.accountCode} - {t.accountName}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenDrawer(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all whitespace-nowrap"
              >
                <span>Review & Decide Treatment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {exceptions.length === 0 && (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">Exception Queue Clear</h3>
            <p className="text-xs text-slate-400 mt-1">
              All transactions have been validated, matched, or approved by the accounting team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
