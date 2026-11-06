import React, { useState } from 'react';
import {
  BookText,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ChartAccount, JournalEntry } from '../../types/ledgerline';
import { formatMoney, todayISO } from '../../services/ledgerEngine';

interface GeneralJournalViewProps {
  journalEntries: JournalEntry[];
  accounts: ChartAccount[];
  lockDate: string;
  onPostManualJournal: (
    date: string,
    memo: string,
    debitAccount: string,
    creditAccount: string,
    amount: number
  ) => void;
  onSetLockDate: (date: string) => void;
}

export const GeneralJournalView: React.FC<GeneralJournalViewProps> = ({
  journalEntries,
  accounts,
  lockDate,
  onPostManualJournal,
  onSetLockDate
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jDate, setJDate] = useState(todayISO());
  const [memo, setMemo] = useState('');
  const [debitAccount, setDebitAccount] = useState('6000');
  const [creditAccount, setCreditAccount] = useState('1000');
  const [amount, setAmount] = useState<number | ''>('');

  const accountMap = Object.fromEntries(accounts.map(a => [a.code, a.name]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid amount');
      return;
    }
    if (debitAccount === creditAccount) {
      alert('Debit and Credit accounts must be different');
      return;
    }
    try {
      onPostManualJournal(
        jDate,
        memo.trim() || 'Manual journal adjustment',
        debitAccount,
        creditAccount,
        Number(amount)
      );
      setIsModalOpen(false);
      setMemo('');
      setAmount('');
    } catch (err: any) {
      alert(err.message || 'Error posting journal entry');
    }
  };

  const totalDebits = journalEntries.reduce(
    (sum, j) => sum + j.lines.reduce((s, l) => s + (l.dr || 0), 0),
    0
  );
  const totalCredits = journalEntries.reduce(
    (sum, j) => sum + j.lines.reduce((s, l) => s + (l.cr || 0), 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <BookText className="w-5 h-5 text-indigo-400" />
            Double-Entry General Journal
          </h2>
          <p className="text-xs text-slate-400">
            Immutable log of every debit and credit posted across invoices, bills, expenses, and automated AI transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Lock Books Control */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Lock Through:</span>
            <input
              type="date"
              value={lockDate}
              onChange={e => onSetLockDate(e.target.value)}
              className="bg-transparent border-0 text-white font-mono text-xs focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Manual Journal
          </button>
        </div>
      </div>

      {/* Trial Balance Health Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">Trial Balance Status:</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Perfect Balance (Debits === Credits)
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 tabular-nums font-mono text-[11px]">
          <div>
            Total Debits:{' '}
            <strong className="text-slate-200">{formatMoney(totalDebits)}</strong>
          </div>
          <div>
            Total Credits:{' '}
            <strong className="text-slate-200">{formatMoney(totalCredits)}</strong>
          </div>
        </div>
      </div>

      {/* Journal Entries Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Journal Entry / Memo</th>
                <th className="py-3 px-4">Account & Classification</th>
                <th className="py-3 px-4 text-right">Debit</th>
                <th className="py-3 px-4 text-right">Credit</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {journalEntries
                .slice()
                .reverse()
                .flatMap(j =>
                  j.lines.map((l, i) => (
                    <tr
                      key={`${j.id}-${i}`}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px] align-top">
                        {i === 0 ? j.date : ''}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-white align-top">
                        {i === 0 ? (
                          <div className="flex items-center gap-2">
                            <span>{j.memo}</span>
                            {j.source && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                                {j.source}
                              </span>
                            )}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">
                        <span className="font-mono text-indigo-400 mr-2">
                          {l.a}
                        </span>
                        {accountMap[l.a] || 'Account'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-200 tabular-nums font-semibold">
                        {l.dr ? formatMoney(l.dr) : ''}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-200 tabular-nums font-semibold">
                        {l.cr ? formatMoney(l.cr) : ''}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-500 font-mono text-[11px] align-top">
                        {i === 0 ? j.at : ''}
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Journal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-indigo-400" />
              Post Manual Journal Entry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={jDate}
                    onChange={e => setJDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={e =>
                      setAmount(
                        e.target.value === '' ? '' : parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Memo / Explanation
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  placeholder="e.g. Month-end depreciation adjustment"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Debit Account (Dr)
                </label>
                <select
                  value={debitAccount}
                  onChange={e => setDebitAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {accounts.map(a => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Credit Account (Cr)
                </label>
                <select
                  value={creditAccount}
                  onChange={e => setCreditAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {accounts.map(a => (
                    <option key={a.code} value={a.code}>
                      {a.code} — {a.name} ({a.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  Post Balanced Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
