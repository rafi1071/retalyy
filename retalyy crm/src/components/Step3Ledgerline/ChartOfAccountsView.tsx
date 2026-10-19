import React, { useState } from 'react';
import { Plus, BookOpen, Search, Layers, Check } from 'lucide-react';
import { ChartAccount, AccountType } from '../../types/ledgerline';
import { formatMoney } from '../../services/ledgerEngine';

interface ChartOfAccountsViewProps {
  accounts: ChartAccount[];
  getAccountBalance: (code: string) => number;
  onAddAccount: (code: string, name: string, type: AccountType) => void;
}

export const ChartOfAccountsView: React.FC<ChartOfAccountsViewProps> = ({
  accounts,
  getAccountBalance,
  onAddAccount
}) => {
  const [filterType, setFilterType] = useState<'All' | AccountType>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('exp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      alert('Please fill out account code and name');
      return;
    }
    if (accounts.some(a => a.code === code.trim())) {
      alert(`Account code ${code} already exists`);
      return;
    }
    onAddAccount(code.trim(), name.trim(), type);
    setIsModalOpen(false);
    setCode('');
    setName('');
  };

  const filteredAccounts = accounts
    .slice()
    .sort((a, b) => (a.code < b.code ? -1 : 1))
    .filter(a => {
      const matchesType = filterType === 'All' || a.type === filterType;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });

  const getTypeBadge = (t: AccountType) => {
    switch (t) {
      case 'asset':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Asset
          </span>
        );
      case 'liab':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Liability
          </span>
        );
      case 'rev':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Revenue
          </span>
        );
      case 'exp':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Expense
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Chart of Accounts
          </h2>
          <p className="text-xs text-slate-400">
            Universal standard accounts directory with real-time balance queries computed from posted journal lines.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'asset', 'liab', 'rev', 'exp'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap ${
                filterType === tab
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'All'
                ? 'All Accounts'
                : tab === 'liab'
                ? 'Liabilities'
                : tab + 's'}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search code or account name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Computed Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAccounts.map(a => {
                const rawBal = getAccountBalance(a.code);
                // In standard accounting, revenue & liabilities display positive for credit balance
                const displayBal =
                  a.type === 'rev' || a.type === 'liab' ? -rawBal : rawBal;

                return (
                  <tr
                    key={a.code}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-400">
                      {a.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      {a.name}
                      {a.isSystem && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          (system)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(a.type)}</td>
                    <td className="py-3 px-4 text-right font-semibold tabular-nums text-slate-200">
                      {formatMoney(displayBal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-indigo-400" />
              Add Chart Account
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Account Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="e.g. 6800"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Account Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Subcontractor Expense"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Account Type *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as AccountType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="asset">Asset (1000s)</option>
                  <option value="liab">Liability (2000s)</option>
                  <option value="rev">Revenue (4000s)</option>
                  <option value="exp">Expense (6000s)</option>
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
