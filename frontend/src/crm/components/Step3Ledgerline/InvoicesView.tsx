import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  Trash2,
  X
} from 'lucide-react';
import { Invoice, InvoiceLine, InvoiceStatus } from '../../types/ledgerline';
import { formatMoney, todayISO } from '../../services/ledgerEngine';

interface InvoicesViewProps {
  invoices: Invoice[];
  onAddInvoice: (contact: string, date: string, due: string, lines: InvoiceLine[]) => void;
  onRecordPayment: (invoiceNo: number) => void;
  onCreditNote: (invoiceNo: number) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onAddInvoice,
  onRecordPayment,
  onCreditNote
}) => {
  const [filter, setFilter] = useState<'All' | InvoiceStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Invoice form state
  const [customer, setCustomer] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(todayISO(14));
  const [lines, setLines] = useState<InvoiceLine[]>([
    { d: 'Accounting & Advisory Services', q: 1, p: 1500, t: 8.25 }
  ]);

  const handleAddLine = () => {
    setLines([...lines, { d: '', q: 1, p: 0, t: 0 }]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== idx));
    }
  };

  const handleUpdateLine = (idx: number, field: keyof InvoiceLine, val: string | number) => {
    const updated = [...lines];
    updated[idx] = { ...updated[idx], [field]: val };
    setLines(updated);
  };

  const subtotal = lines.reduce((s, l) => s + (l.q || 0) * (l.p || 0), 0);
  const taxAmount = lines.reduce((s, l) => s + ((l.q || 0) * (l.p || 0) * (l.t || 0)) / 100, 0);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim()) {
      alert('Please enter a customer name');
      return;
    }
    const validLines = lines.filter(l => l.q * l.p > 0);
    if (validLines.length === 0) {
      alert('Please add at least one line item with an amount');
      return;
    }
    onAddInvoice(customer.trim(), invoiceDate, dueDate, validLines);
    setIsModalOpen(false);
    setCustomer('');
    setLines([{ d: 'Accounting & Advisory Services', q: 1, p: 1500, t: 8.25 }]);
  };

  const filteredInvoices = invoices
    .slice()
    .reverse()
    .filter(inv => {
      const matchesFilter = filter === 'All' || inv.status === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        inv.contact.toLowerCase().includes(q) ||
        String(inv.no).includes(q);
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
      case 'Credited':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <RotateCcw className="w-3 h-3" /> Credited
          </span>
        );
      case 'Awaiting':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Awaiting Payment
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
            Invoices & Accounts Receivable
          </h2>
          <p className="text-xs text-slate-400">
            Create customer invoices, track balances, record payments, and issue credit notes with automatic ledger posting.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'Awaiting', 'Overdue', 'Paid', 'Credited'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customer or #..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(inv => {
                  const balance = inv.total - inv.paid;
                  return (
                    <tr
                      key={inv.no}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-400">
                        #{inv.no}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {inv.contact}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{inv.date}</td>
                      <td className="py-3 px-4 text-slate-400">{inv.due}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-200 tabular-nums">
                        {formatMoney(inv.total)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold tabular-nums">
                        <span
                          className={
                            balance > 0.01 ? 'text-rose-400' : 'text-emerald-400'
                          }
                        >
                          {formatMoney(balance)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(inv.status)}</td>
                      <td className="py-3 px-4 text-right">
                        {balance > 0.01 && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onRecordPayment(inv.no)}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
                            >
                              Pay Full
                            </button>
                            <button
                              onClick={() => onCreditNote(inv.no)}
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                            >
                              Credit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No invoices match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                New Customer Invoice
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer}
                    onChange={e => setCustomer(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
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

              {/* Line Items */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Line Items
                </label>
                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={line.d}
                          onChange={e =>
                            handleUpdateLine(idx, 'd', e.target.value)
                          }
                          placeholder="Description of service..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={line.q}
                          onChange={e =>
                            handleUpdateLine(
                              idx,
                              'q',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Qty"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.p}
                          onChange={e =>
                            handleUpdateLine(
                              idx,
                              'p',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Price"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 text-right"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={line.t}
                          onChange={e =>
                            handleUpdateLine(
                              idx,
                              't',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Tax %"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 text-right"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddLine}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another item
                </button>
              </div>

              {/* Totals Summary */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-medium text-slate-200">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax:</span>
                  <span className="tabular-nums font-medium text-slate-200">
                    {formatMoney(taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span className="tabular-nums text-indigo-400">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
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
                  Approve & Post to General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
