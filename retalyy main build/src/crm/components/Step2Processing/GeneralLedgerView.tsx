import React from 'react';
import { BookCheck, CheckCircle2, ShieldCheck, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { TransactionRecord } from '../types/accounting';

interface GeneralLedgerViewProps {
  transactions: TransactionRecord[];
  onOpenDrawer: (txn: TransactionRecord) => void;
  onExport: () => void;
}

export const GeneralLedgerView: React.FC<GeneralLedgerViewProps> = ({
  transactions,
  onOpenDrawer,
  onExport,
}) => {
  const postedOrApproved = transactions.filter(
    (t) => t.status === 'posted' || t.status === 'approved'
  );

  // Compute trial balance
  let grandTotalDebits = 0;
  let grandTotalCredits = 0;

  postedOrApproved.forEach((t) => {
    t.journalLines.forEach((jl) => {
      if (jl.type === 'debit') grandTotalDebits += jl.amount;
      if (jl.type === 'credit') grandTotalCredits += jl.amount;
    });
  });

  const isBalanced = Math.abs(grandTotalDebits - grandTotalCredits) < 0.01;

  return (
    <div className="space-y-5">
      {/* GL Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">
              General Ledger Journal Audit
            </h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-emerald-400 font-mono font-medium">
              Period 2026-10 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Immutable audit record of all transactions approved and committed to the general ledger.
            Ready for downstream Step 3 Bank Reconciliation.
          </p>
        </div>

        {/* Trial Balance Card */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Trial Balance Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBalanced ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                {isBalanced ? 'In Perfect Balance' : 'Out of Balance'}
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-800" />

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Total Debits / Credits
            </span>
            <div className="text-xs font-mono font-bold text-slate-200 tabular-nums mt-0.5">
              ${grandTotalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <button
            onClick={onExport}
            className="ml-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium shadow-sm transition-all"
          >
            Export GL
          </button>
        </div>
      </div>

      {/* Ledger Journal Entries List */}
      <div className="space-y-4">
        {postedOrApproved.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all"
          >
            {/* Entry Header */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-indigo-400">{t.id}</span>
                <span className="text-slate-600">·</span>
                <span className="font-semibold text-white">{t.counterparty}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">Date: {t.transactionDate}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono">Doc: {t.sourceDocument?.filename || 'Manual Wire'}</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                    t.status === 'posted'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {t.status}
                </span>

                <button
                  onClick={() => onOpenDrawer(t)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <span>Inspect Audit Proof</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Journal Table */}
            <div className="p-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-medium">
                    <th className="pb-2 w-24">Account #</th>
                    <th className="pb-2">Account Title</th>
                    <th className="pb-2 text-right">Debit ($)</th>
                    <th className="pb-2 text-right">Credit ($)</th>
                    <th className="pb-2 pl-4">Memo</th>
                    <th className="pb-2">Tax Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {t.journalLines.map((jl) => (
                    <tr key={jl.id} className="text-slate-300">
                      <td className="py-2 text-indigo-400 font-semibold">{jl.accountNumber}</td>
                      <td className="py-2 font-sans text-slate-200">{jl.accountName}</td>
                      <td className="py-2 text-right font-bold text-emerald-400 tabular-nums">
                        {jl.type === 'debit' ? jl.amount.toFixed(2) : '—'}
                      </td>
                      <td className="py-2 text-right font-bold text-slate-300 tabular-nums">
                        {jl.type === 'credit' ? jl.amount.toFixed(2) : '—'}
                      </td>
                      <td className="py-2 pl-4 font-sans text-[11px] text-slate-400 truncate max-w-xs">
                        {jl.memo}
                      </td>
                      <td className="py-2 text-[10px] text-slate-400">{jl.taxCode || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom Justification & Signer */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>
                  <strong>Policy Citation:</strong> {t.policyCitation} · {t.treatmentJustification}
                </span>
                <span className="text-slate-500">
                  Reviewed & Signed: <strong className="text-slate-300">{t.reviewedBy || t.approvedBy || 'Autonomous Engine'}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}

        {postedOrApproved.length === 0 && (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <BookCheck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">No Ledger Entries Posted Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Approve transactions in the Workbench to post them to the General Ledger.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
