import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { Bill, ChartAccount, InvoiceStatus } from '../../types/ledgerline';
import { formatMoney, todayISO } from '../../services/ledgerEngine';

interface BillsViewProps {
  bills: Bill[];
  accounts: ChartAccount[];
  onAddBill: (
    supplier: string,
    date: string,
    due: string,
    categoryAccount: string,
    amount: number,
    taxRate: number
  ) => void;
  onPayBill: (billNo: string) => void;
}

export const BillsView: React.FC<BillsViewProps> = ({
  bills,
  accounts,
  onAddBill,
  onPayBill
}) => {
  const [filter, setFilter] = useState<'All' | InvoiceStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [supplier, setSupplier] = useState('');
  const [billDate, setBillDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(todayISO(14));
  const [category, setCategory] = useState('6100');
  const [amount, setAmount] = useState<number | ''>('');
  const [taxRate, setTaxRate] = useState<number>(0);

  const expenseAccounts = accounts.filter(a => a.type === 'exp');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter a supplier and a valid amount');
      return;
    }
    onAddBill(supplier.trim(), billDate, dueDate, category, Number(amount), taxRate);
    setIsModalOpen(false);
    setSupplier('');
    setAmount('');
  };

  const filteredBills = bills
    .slice()
    .reverse()
    .filter(b => {
      const matchesFilter = filter === 'All' || b.status === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.supplier.toLowerCase().includes(q) ||
        b.no.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

  const getStatusBadge = (status?: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        );
      case 'Awaiting':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Unpaid
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Bills & Accounts Payable
          </h2>
          <p className="text-xs text-slate-400">
            Record and approve vendor bills, manage due dates, and issue payments with automated double-entry general ledger posting.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Enter Bill
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'Awaiting', 'Overdue', 'Paid'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab === 'Awaiting' ? 'Unpaid' : tab}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search supplier or bill #..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Bill #</th>
                <th className="py-3 px-4">Supplier / Vendor</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Expense Category</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBills.length > 0 ? (
                filteredBills.map(b => {
                  const balance = b.total - b.paid;
                  const catAccount = accounts.find(a => a.code === b.category);
                  return (
                    <tr
                      key={b.no}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-amber-400">
                        {b.no}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {b.supplier}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{b.due}</td>
                      <td className="py-3 px-4 text-slate-400">
                        <span className="font-mono text-[11px] text-indigo-400 mr-1.5">
                          {b.category}
                        </span>
                        {catAccount?.name || 'Expense'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-200 tabular-nums">
                        {formatMoney(b.total)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold tabular-nums">
                        <span
                          className={
                            balance > 0.01 ? 'text-amber-400' : 'text-emerald-400'
                          }
                        >
                          {formatMoney(balance)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(b.status)}</td>
                      <td className="py-3 px-4 text-right">
                        {balance > 0.01 && (
                          <button
                            onClick={() => onPayBill(b.no)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1 ml-auto"
                          >
                            <CreditCard className="w-3 h-3" />
                            Pay Bill
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No bills match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Building className="w-4 h-4 text-indigo-400" />
              Enter Supplier Bill
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Supplier / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                  placeholder="e.g. AWS, Slack, WeWork"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={e => setBillDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Expense Category (Account)
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Amount ($) *
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Tax %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={taxRate}
                    onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  Approve Bill & Post AP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
