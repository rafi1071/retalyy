import React, { useState } from 'react';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight,
  Plus, 
  Building2, 
  DollarSign, 
  Send, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { LedgerEngine, formatMoney } from '../../crm/services/ledgerEngine';

interface BusinessPayablesReceivablesViewProps {
  ledger: LedgerEngine;
  onRefreshLedger: () => void;
}

export const BusinessPayablesReceivablesView: React.FC<BusinessPayablesReceivablesViewProps> = ({
  ledger,
  onRefreshLedger
}) => {
  const [activeTab, setActiveTab] = useState<'ap' | 'ar'>('ap');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Bill Pay Action
  const handlePayBill = (billNo: string, supplier: string, amount: number) => {
    try {
      ledger.payBill(billNo);
      onRefreshLedger();
      setSuccessToast(`Disbursed payment of ${formatMoney(amount)} to ${supplier} via Operating Bank.`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Customer Payment Action
  const handleReceivePayment = (invoiceNo: number, customer: string, amount: number) => {
    try {
      ledger.recordPayment(invoiceNo, amount);
      onRefreshLedger();
      setSuccessToast(`Recorded payment received of ${formatMoney(amount)} from ${customer}. Deposited to Bank.`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const bills = ledger.bills;
  const invoices = ledger.invoices;

  const totalApOutstanding = bills.reduce((sum, b) => sum + (b.total - b.paid), 0);
  const totalArOutstanding = invoices.reduce((sum, inv) => sum + (inv.total - inv.paid), 0);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2] mb-2">
            <CreditCard className="w-3.5 h-3.5 text-[#27B665]" />
            Cash Flow & Working Capital
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2B1C] font-display">
            Accounts Payable & Receivable
          </h2>
          <p className="text-sm text-[#52705F] mt-1 max-w-xl">
            Autonomous invoice scheduling, vendor bill disbursements, and receivables matching with real-time double-entry posting to cash and liability accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs text-right">
            <div className="text-[10px] uppercase font-bold text-[#52705F]">Total AP Due</div>
            <div className="text-base font-bold font-mono text-[#0C2B1C]">
              {formatMoney(totalApOutstanding)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] text-xs text-right">
            <div className="text-[10px] uppercase font-bold text-[#0F7A41]">Total AR Inflow Pending</div>
            <div className="text-base font-bold font-mono text-[#0F7A41]">
              {formatMoney(totalArOutstanding)}
            </div>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] text-xs font-bold text-[#0F7A41] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="bg-white rounded-3xl border border-[#D9F0E2] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#EDF9F1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ap')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ap'
                  ? 'bg-[#0C2B1C] text-white shadow-xs'
                  : 'bg-[#F8FAF9] text-[#52705F] hover:bg-[#EDF9F1]'
              }`}
            >
              <span>Accounts Payable (Bills to Pay)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#27B665] text-white font-mono">
                {bills.filter(b => b.total - b.paid > 0.01).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ar'
                  ? 'bg-[#0C2B1C] text-white shadow-xs'
                  : 'bg-[#F8FAF9] text-[#52705F] hover:bg-[#EDF9F1]'
              }`}
            >
              <span>Accounts Receivable (Customer Invoices)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0F7A41] text-white font-mono">
                {invoices.filter(i => i.total - i.paid > 0.01).length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="overflow-x-auto">
          {activeTab === 'ap' ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF9F1] bg-[#F8FAF9] text-[#52705F] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Bill No</th>
                  <th className="py-3 px-4">Vendor / Supplier</th>
                  <th className="py-3 px-4">Date Incurred</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Outstanding</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Autonomous Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF9F1]">
                {bills.map(b => {
                  const outstanding = b.total - b.paid;
                  const isPaid = outstanding <= 0.01;
                  return (
                    <tr key={b.no} className="hover:bg-[#F8FAF9] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">{b.no}</td>
                      <td className="py-3.5 px-4 font-bold text-[#0C2B1C]">{b.supplier}</td>
                      <td className="py-3.5 px-4 text-[#52705F]">{b.date}</td>
                      <td className="py-3.5 px-4 text-[#52705F] font-medium">{b.due}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">{formatMoney(b.total)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">
                        {isPaid ? <span className="text-neutral-400">$0.00</span> : formatMoney(outstanding)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#27B665]" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                            <Clock className="w-3 h-3" /> Due Soon
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => handlePayBill(b.no, b.supplier, outstanding)}
                            className="px-3 py-1.5 rounded-xl bg-[#27B665] text-white hover:bg-[#1fa357] text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Approve & Pay Bill</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF9F1] bg-[#F8FAF9] text-[#52705F] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Payment Due</th>
                  <th className="py-3 px-4">Total Billed</th>
                  <th className="py-3 px-4">Balance Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF9F1]">
                {invoices.map(inv => {
                  const balanceDue = inv.total - inv.paid;
                  const isPaid = balanceDue <= 0.01;
                  return (
                    <tr key={inv.no} className="hover:bg-[#F8FAF9] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">#{inv.no}</td>
                      <td className="py-3.5 px-4 font-bold text-[#0C2B1C]">{inv.contact}</td>
                      <td className="py-3.5 px-4 text-[#52705F]">{inv.date}</td>
                      <td className="py-3.5 px-4 text-[#52705F] font-medium">{inv.due}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">{formatMoney(inv.total)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">
                        {isPaid ? <span className="text-neutral-400">$0.00</span> : formatMoney(balanceDue)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#27B665]" /> Paid in Full
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                            Awaiting Pmt
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => handleReceivePayment(inv.no, inv.contact, balanceDue)}
                            className="px-3 py-1.5 rounded-xl bg-[#0C2B1C] text-white hover:bg-[#1a4a33] text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Record Payment</span>
                            <CheckCircle2 className="w-3 h-3 text-[#27B665]" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
