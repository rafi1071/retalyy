import React, { useState } from 'react';
import { X, Search, BookOpen, Layers } from 'lucide-react';
import { CHART_OF_ACCOUNTS } from '../data/mockData';
import { ChartOfAccountItem } from '../types/accounting';

interface ChartOfAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChartOfAccountsModal: React.FC<ChartOfAccountsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  const filtered = CHART_OF_ACCOUNTS.filter((acc) => {
    if (selectedCategory !== 'all' && acc.category !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        acc.code.includes(q) ||
        acc.name.toLowerCase().includes(q) ||
        acc.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Standard Chart of Accounts (COA)
              </h2>
              <p className="text-xs text-slate-400">
                General Ledger account mapping hierarchy for classification (Step 4)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by account # or name..."
              className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Account Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4 w-24">Account #</th>
                <th className="py-2.5 px-4">Account Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Sub-Type</th>
                <th className="py-2.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((acc) => (
                <tr key={acc.code} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-bold text-indigo-400">
                    {acc.code}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-200 font-semibold">
                    {acc.name}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                        acc.category === 'Asset'
                          ? 'bg-blue-500/10 text-blue-300'
                          : acc.category === 'Liability'
                          ? 'bg-amber-500/10 text-amber-300'
                          : acc.category === 'Equity'
                          ? 'bg-purple-500/10 text-purple-300'
                          : acc.category === 'Revenue'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-rose-500/10 text-rose-300'
                      }`}
                    >
                      {acc.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-400">
                    {acc.type}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-400 text-[11px]">
                    {acc.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
