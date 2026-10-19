import React, { useState } from 'react';
import { Plus, Receipt, DollarSign, Tag, Calendar } from 'lucide-react';
import { ChartAccount, JournalEntry } from '../../types/ledgerline';
import { formatMoney, todayISO } from '../../services/ledgerEngine';

interface ExpensesViewProps {
  journalEntries: JournalEntry[];
  accounts: ChartAccount[];
  onAddExpense: (description: string, categoryAccount: string, amount: number) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  journalEntries,
  accounts,
  onAddExpense
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('6100');
  const [amount, setAmount] = useState<number | ''>('');

  const expenseAccounts = accounts.filter(a => a.type === 'exp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter a description and valid amount');
      return;
    }
    onAddExpense(description.trim(), category, Number(amount));
    setDescription('');
    setAmount('');
  };

  // Find all expense journal entries: Debits to 6xxx, Credit to 1000
  const expenseEntries = journalEntries
    .filter(j =>
      j.lines.some(l => l.a.startsWith('6') && (l.dr || 0) > 0)
    )
    .slice()
    .reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white">
          Direct Expenses
        </h2>
        <p className="text-xs text-slate-400">
          Record operational disbursements and out-of-pocket expenses. Each entry posts balanced debits to the selected expense account and credits the operating bank account.
        </p>
      </div>

      {/* Quick Add Expense Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Receipt className="w-4 h-4 text-indigo-400" />
          Log Expense Transaction
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              What was it for? *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Notion team subscription, Airport taxi, Team lunch"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Expense Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {expenseAccounts.map(a => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Amount ($) *
            </label>
            <div className="flex gap-2">
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
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap shadow-md shadow-indigo-600/30"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Expense History Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recorded Expense Ledger Lines
          </h4>
          <span className="text-[11px] text-slate-500">
            {expenseEntries.length} total entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description / Memo</th>
                <th className="py-3 px-4">Account Debited</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenseEntries.length > 0 ? (
                expenseEntries.map(entry => {
                  const expLine = entry.lines.find(l => l.a.startsWith('6'));
                  const acc = accounts.find(a => a.code === expLine?.a);
                  const amt = expLine?.dr || 0;
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-400">{entry.date}</td>
                      <td className="py-3 px-4 font-medium text-white">
                        {entry.memo}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-mono text-indigo-400 mr-1.5 text-[11px]">
                          {expLine?.a}
                        </span>
                        {acc?.name || 'Expense'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400">
                          {entry.source || 'expense'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-rose-400 tabular-nums">
                        {formatMoney(amt)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No expense records yet.
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
