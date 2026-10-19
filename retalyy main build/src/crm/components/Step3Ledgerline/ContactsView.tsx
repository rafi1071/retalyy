import React, { useState } from 'react';
import { Users, Search, Building2, User, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ContactRecord } from '../../types/ledgerline';
import { formatMoney } from '../../services/ledgerEngine';

interface ContactsViewProps {
  contacts: ContactRecord[];
  onSelectContact?: (contactName: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onSelectContact
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Customer' | 'Supplier'>('All');

  const filtered = contacts.filter(c => {
    const matchesFilter =
      filterType === 'All' ||
      c.type === filterType ||
      c.type === 'Both';
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Contacts Directory
          </h2>
          <p className="text-xs text-slate-400">
            Unified directory of customers and vendors with cumulative transaction volume and live accounts receivable / accounts payable balances.
          </p>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          {(['All', 'Customer', 'Supplier'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === tab
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'All' ? 'All Contacts' : tab + 's'}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contact name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Contact Name</th>
                <th className="py-3 px-4">Role / Type</th>
                <th className="py-3 px-4 text-right">Cumulative Billed</th>
                <th className="py-3 px-4 text-right">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length > 0 ? (
                filtered.map(contact => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                        {contact.name[0]}
                      </div>
                      <span>{contact.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          contact.type === 'Customer'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : contact.type === 'Supplier'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {contact.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-200 tabular-nums">
                      {formatMoney(contact.totalBilled)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold tabular-nums">
                      <span
                        className={
                          contact.outstanding > 0.01
                            ? contact.type === 'Supplier'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                            : 'text-slate-400'
                        }
                      >
                        {formatMoney(contact.outstanding)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No contacts found. Contacts automatically populate when invoices or bills are created.
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
