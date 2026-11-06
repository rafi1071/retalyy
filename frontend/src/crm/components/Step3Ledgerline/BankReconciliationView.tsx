import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { BankStatementLine, ChartAccount, JournalEntry } from '../../types/ledgerline';
import { formatMoney } from '../../services/ledgerEngine';

interface BankReconciliationViewProps {
  bankStatements: BankStatementLine[];
  journalEntries: JournalEntry[];
  accounts: ChartAccount[];
  bankBalance: number;
  onMatchLine: (bankLineId: number, journalEntryId: number) => void;
  onCodeLine: (bankLineId: number, accountCode: string) => void;
}

export const BankReconciliationView: React.FC<BankReconciliationViewProps> = ({
  bankStatements,
  journalEntries,
  accounts,
  bankBalance,
  onMatchLine,
  onCodeLine
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<Record<number, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'unreconciled' | 'reconciled'>('unreconciled');

  // Accounts available to code statement lines directly (exclude 1000, 1100, 2000)
  const codableAccounts = accounts.filter(
    a => !['1000', '1100', '2000'].includes(a.code)
  );

  // Find candidate journal entry matching amount
  const findCandidate = (statement: BankStatementLine) => {
    return journalEntries.find(j => {
      if (j.rec) return false;
      // Net effect on bank account 1000
      const bankEffect = j.lines
        .filter(l => l.a === '1000')
        .reduce((sum, l) => sum + (l.dr || 0) - (l.cr || 0), 0);
      return Math.abs(bankEffect - statement.amt) < 0.01;
    });
  };

  const handleAccountChange = (id: number, code: string) => {
    setSelectedAccounts(prev => ({ ...prev, [id]: code }));
  };

  const filteredStatements = bankStatements.filter(s => {
    if (filterMode === 'unreconciled') return !s.done;
    if (filterMode === 'reconciled') return s.done;
    return true;
  });

  const unreconciledCount = bankStatements.filter(s => !s.done).length;

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            Bank Feed & Reconciliation
          </h2>
          <p className="text-xs text-slate-400">
            Match bank statement transactions against journal entries or create new double-entry postings with 1-click.
          </p>
        </div>

        {/* Bank Status Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
            <span className="text-slate-400">Books Balance (1000):</span>
            <span className="font-bold text-white tabular-nums">
              {formatMoney(bankBalance)}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-center gap-2">
            <span className="text-cyan-400">Unreconciled:</span>
            <span className="font-bold text-cyan-300 tabular-nums">
              {unreconciledCount} lines
            </span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterMode('unreconciled')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterMode === 'unreconciled'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Needs Action ({unreconciledCount})
        </button>
        <button
          onClick={() => setFilterMode('reconciled')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterMode === 'reconciled'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          Reconciled ({bankStatements.length - unreconciledCount})
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterMode === 'all'
              ? 'bg-cyan-600 text-white font-semibold'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          All Feed Lines ({bankStatements.length})
        </button>
      </div>

      {/* Reconciliation Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Statement Date</th>
                <th className="py-3 px-4">Bank Statement Line</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Reconciliation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStatements.length > 0 ? (
                filteredStatements.map(stmt => {
                  const candidate = !stmt.done ? findCandidate(stmt) : null;
                  const chosenAccount =
                    selectedAccounts[stmt.id] ||
                    (stmt.amt > 0 ? '4000' : '6100');

                  return (
                    <tr
                      key={stmt.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {stmt.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white flex items-center gap-2">
                          {stmt.desc}
                        </div>
                        {stmt.matchedMemo && (
                          <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Matched: {stmt.matchedMemo}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-semibold">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            stmt.amt >= 0 ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {stmt.amt >= 0 ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          {formatMoney(stmt.amt)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {stmt.done ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Reconciled
                          </span>
                        ) : candidate ? (
                          <button
                            onClick={() => onMatchLine(stmt.id, candidate.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 ml-auto active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Match: {candidate.memo}
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={chosenAccount}
                              onChange={e =>
                                handleAccountChange(stmt.id, e.target.value)
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            >
                              {codableAccounts.map(a => (
                                <option key={a.code} value={a.code}>
                                  {a.code} — {a.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => onCodeLine(stmt.id, chosenAccount)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-all whitespace-nowrap active:scale-95"
                            >
                              Post & Match
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No bank statement lines match the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
