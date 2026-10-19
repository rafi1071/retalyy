import React, { useState } from 'react';
import {
  FileSpreadsheet,
  PieChart,
  Calendar,
  Download,
  Scale,
  DollarSign,
  TrendingUp,
  Percent
} from 'lucide-react';
import { ChartAccount, AgedBucket } from '../../types/ledgerline';
import { formatMoney } from '../../services/ledgerEngine';

interface FinancialReportsViewProps {
  accounts: ChartAccount[];
  getAccountBalance: (code: string) => number;
  getSumByType: (type: 'asset' | 'liab' | 'rev' | 'exp') => number;
  agedReceivables: AgedBucket;
  agedPayables: AgedBucket;
}

export const FinancialReportsView: React.FC<FinancialReportsViewProps> = ({
  accounts,
  getAccountBalance,
  getSumByType,
  agedReceivables,
  agedPayables
}) => {
  const [reportTab, setReportTab] = useState<'pnl' | 'balanceSheet' | 'aged' | 'tax'>('pnl');

  // Revenue & Expenses
  const revAccounts = accounts.filter(
    a => a.type === 'rev' && Math.abs(getAccountBalance(a.code)) > 0.001
  );
  const expAccounts = accounts.filter(
    a => a.type === 'exp' && Math.abs(getAccountBalance(a.code)) > 0.001
  );

  const totalRev = -getSumByType('rev');
  const totalExp = getSumByType('exp');
  const netProfit = totalRev - totalExp;

  // Assets & Liabilities
  const assetAccounts = accounts.filter(
    a => a.type === 'asset' && Math.abs(getAccountBalance(a.code)) > 0.001
  );
  const liabAccounts = accounts.filter(
    a => a.type === 'liab' && Math.abs(getAccountBalance(a.code)) > 0.001
  );

  const totalAssets = getSumByType('asset');
  const totalLiab = -getSumByType('liab');
  const totalLiabAndEquity = totalLiab + netProfit;

  // Sales Tax (Account 2200)
  const salesTaxBalance = -getAccountBalance('2200');

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            Financial Statements & Tax Reporting
          </h2>
          <p className="text-xs text-slate-400">
            Real-time GAAP compliant financial reports generated directly from the double-entry general journal.
          </p>
        </div>

        {/* Report Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setReportTab('pnl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportTab === 'pnl'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profit & Loss
          </button>
          <button
            onClick={() => setReportTab('balanceSheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportTab === 'balanceSheet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setReportTab('aged')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportTab === 'aged'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aged Schedules
          </button>
          <button
            onClick={() => setReportTab('tax')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportTab === 'tax'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sales Tax
          </button>
        </div>
      </div>

      {/* Tab 1: Profit & Loss */}
      {reportTab === 'pnl' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm max-w-3xl mx-auto">
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Income Statement (Profit and Loss)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Accrual Basis · Year-to-Date
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Net Income</span>
                <span
                  className={`text-lg font-bold tabular-nums ${
                    netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatMoney(netProfit)}
                </span>
              </div>
            </div>

            {/* Income Section */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Operating Revenue
              </h4>
              <div className="divide-y divide-slate-800/60">
                {revAccounts.map(a => (
                  <div
                    key={a.code}
                    className="flex justify-between py-2 text-xs text-slate-300"
                  >
                    <span>
                      {a.code} — {a.name}
                    </span>
                    <span className="tabular-nums font-medium text-slate-200">
                      {formatMoney(-getAccountBalance(a.code))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-semibold text-xs text-white">
                <span>Total Income</span>
                <span className="tabular-nums text-emerald-400">
                  {formatMoney(totalRev)}
                </span>
              </div>
            </div>

            {/* Expenses Section */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Operating Expenses
              </h4>
              <div className="divide-y divide-slate-800/60">
                {expAccounts.map(a => (
                  <div
                    key={a.code}
                    className="flex justify-between py-2 text-xs text-slate-300"
                  >
                    <span>
                      {a.code} — {a.name}
                    </span>
                    <span className="tabular-nums font-medium text-slate-200">
                      {formatMoney(getAccountBalance(a.code))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-semibold text-xs text-white">
                <span>Total Expenses</span>
                <span className="tabular-nums text-rose-400">
                  {formatMoney(totalExp)}
                </span>
              </div>
            </div>

            {/* Net Profit Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Net Operating Profit</span>
              <span
                className={`tabular-nums text-base ${
                  netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatMoney(netProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Balance Sheet */}
      {reportTab === 'balanceSheet' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm max-w-3xl mx-auto">
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">
                  Statement of Financial Position (Balance Sheet)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  As of Today
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Assets</span>
                <span className="text-lg font-bold text-indigo-400 tabular-nums">
                  {formatMoney(totalAssets)}
                </span>
              </div>
            </div>

            {/* Assets */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Current Assets
              </h4>
              <div className="divide-y divide-slate-800/60">
                {assetAccounts.map(a => (
                  <div
                    key={a.code}
                    className="flex justify-between py-2 text-xs text-slate-300"
                  >
                    <span>
                      {a.code} — {a.name}
                    </span>
                    <span className="tabular-nums font-medium text-slate-200">
                      {formatMoney(getAccountBalance(a.code))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-semibold text-xs text-white">
                <span>Total Assets</span>
                <span className="tabular-nums text-sky-400">
                  {formatMoney(totalAssets)}
                </span>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Liabilities & Equity
              </h4>
              <div className="divide-y divide-slate-800/60">
                {liabAccounts.map(a => (
                  <div
                    key={a.code}
                    className="flex justify-between py-2 text-xs text-slate-300"
                  >
                    <span>
                      {a.code} — {a.name}
                    </span>
                    <span className="tabular-nums font-medium text-slate-200">
                      {formatMoney(-getAccountBalance(a.code))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2 text-xs text-slate-300">
                  <span>Current Year Retained Earnings</span>
                  <span className="tabular-nums font-medium text-emerald-400">
                    {formatMoney(netProfit)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-semibold text-xs text-white">
                <span>Total Liabilities + Equity</span>
                <span className="tabular-nums text-amber-400">
                  {formatMoney(totalLiabAndEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Aged Schedules */}
      {reportTab === 'aged' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aged Receivables */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Aged Receivables (Unpaid Customer Invoices)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Current
                </span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {formatMoney(agedReceivables.current)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  1-30 Days
                </span>
                <span className="text-sm font-bold text-yellow-400 tabular-nums">
                  {formatMoney(agedReceivables.days30)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  31-60 Days
                </span>
                <span className="text-sm font-bold text-amber-500 tabular-nums">
                  {formatMoney(agedReceivables.days60)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  61+ Days
                </span>
                <span className="text-sm font-bold text-rose-500 tabular-nums">
                  {formatMoney(agedReceivables.days90Plus)}
                </span>
              </div>
            </div>
          </div>

          {/* Aged Payables */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Aged Payables (Unpaid Supplier Bills)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  Current
                </span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {formatMoney(agedPayables.current)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  1-30 Days
                </span>
                <span className="text-sm font-bold text-yellow-400 tabular-nums">
                  {formatMoney(agedPayables.days30)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  31-60 Days
                </span>
                <span className="text-sm font-bold text-amber-500 tabular-nums">
                  {formatMoney(agedPayables.days60)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">
                  61+ Days
                </span>
                <span className="text-sm font-bold text-rose-500 tabular-nums">
                  {formatMoney(agedPayables.days90Plus)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sales Tax */}
      {reportTab === 'tax' && (
        <div className="max-w-xl mx-auto p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Sales Tax Liability (Account 2200)
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated sales tax collected on customer invoices minus tax credits.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-300 font-medium">
              Net Sales Tax Payable to State:
            </span>
            <span className="text-base font-bold text-amber-400 tabular-nums">
              {formatMoney(salesTaxBalance)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
