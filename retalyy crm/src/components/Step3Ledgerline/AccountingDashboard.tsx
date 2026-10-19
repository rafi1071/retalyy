import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  FileCheck2,
  Receipt,
  Scale,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Lock,
  Building
} from 'lucide-react';
import { FinancialSummary } from '../../types/ledgerline';
import { formatMoney } from '../../services/ledgerEngine';

interface AccountingDashboardProps {
  summary: FinancialSummary;
  onNavigateTab: (tab: string) => void;
  lockDate: string;
}

/* ─── Metric Card ─── */
const MetricCard: React.FC<{
  label: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  onClick: () => void;
  index: number;
}> = ({ label, value, subtitle, icon, accentColor, onClick, index }) => (
  <div
    onClick={onClick}
    className="group relative p-4 cursor-pointer transition-all animate-fade-in-up"
    style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-xl)',
      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      animationDelay: `${index * 60}ms`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${accentColor}40`;
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 8px 24px ${accentColor}10`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border-primary)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ background: `${accentColor}12`, color: accentColor }}
      >
        {icon}
      </div>
    </div>
    <div className="text-xl font-semibold tracking-tight tabular-nums" style={{ color: accentColor }}>
      {value}
    </div>
    <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
      {subtitle}
    </div>
  </div>
);

export const AccountingDashboard: React.FC<AccountingDashboardProps> = ({
  summary,
  onNavigateTab,
  lockDate
}) => {
  return (
    <div className="space-y-6">
      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden p-6 animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(99, 102, 241, 0.04) 50%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-2xl)',
        }}
      >
        {/* Subtle glow accent */}
        <div className="absolute top-0 right-0 w-[300px] h-[200px] pointer-events-none opacity-[0.06]"
             style={{ background: 'radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 70%)' }} />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                    style={{
                      background: 'var(--color-success-subtle)',
                      color: 'var(--color-success)',
                      border: '1px solid rgba(34, 197, 94, 0.15)',
                    }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft"
                      style={{ background: 'var(--color-success)' }} />
                Double-Entry Balanced
              </span>
              {lockDate && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{
                        background: 'var(--color-warning-subtle)',
                        color: 'var(--color-warning)',
                        border: '1px solid rgba(245, 158, 11, 0.15)',
                      }}>
                  <Lock className="w-3 h-3" /> Locked: {lockDate}
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Accounting Core
            </h2>
            <p className="text-[13px] mt-1 max-w-xl leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              Live general ledger synchronized with AI transaction processing. Every entry updates with strict debit/credit verification.
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('invoices')}
              className="px-3.5 py-2 text-[12px] font-semibold text-white flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2), 0 0 16px rgba(99, 102, 241, 0.12)',
                transition: 'all 200ms ease',
              }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              New Invoice
            </button>
            <button
              onClick={() => onNavigateTab('bills')}
              className="px-3.5 py-2 text-[12px] font-semibold flex items-center gap-1.5"
              style={{
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Enter Bill
            </button>
            <button
              onClick={() => onNavigateTab('bank')}
              className="px-3.5 py-2 text-[12px] font-semibold flex items-center gap-1.5"
              style={{
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <Scale className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
              Reconcile
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          label="Bank Balance"
          value={formatMoney(summary.bankBalance)}
          subtitle="Operating 1000"
          icon={<DollarSign className="w-3.5 h-3.5" />}
          accentColor="#0ea5e9"
          onClick={() => onNavigateTab('bank')}
          index={0}
        />
        <MetricCard
          label="Owed to You (AR)"
          value={formatMoney(summary.accountsReceivable)}
          subtitle="Customer Invoices"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          accentColor="#6366f1"
          onClick={() => onNavigateTab('invoices')}
          index={1}
        />
        <MetricCard
          label="Overdue Invoices"
          value={formatMoney(summary.overdueReceivables)}
          subtitle="Requires follow-up"
          icon={<AlertCircle className="w-3.5 h-3.5" />}
          accentColor="#ef4444"
          onClick={() => onNavigateTab('invoices')}
          index={2}
        />
        <MetricCard
          label="You Owe (AP)"
          value={formatMoney(summary.accountsPayable)}
          subtitle="Supplier Bills"
          icon={<TrendingDown className="w-3.5 h-3.5" />}
          accentColor="#f59e0b"
          onClick={() => onNavigateTab('bills')}
          index={3}
        />
        <MetricCard
          label="Net Profit (YTD)"
          value={formatMoney(summary.netProfit)}
          subtitle="Revenue minus expenses"
          icon={<Receipt className="w-3.5 h-3.5" />}
          accentColor={summary.netProfit >= 0 ? '#22c55e' : '#ef4444'}
          onClick={() => onNavigateTab('reports')}
          index={4}
        />
        <MetricCard
          label="To Reconcile"
          value={`${summary.unreconciledBankCount} Lines`}
          subtitle="Statement feed items"
          icon={<FileCheck2 className="w-3.5 h-3.5" />}
          accentColor="#06b6d4"
          onClick={() => onNavigateTab('bank')}
          index={5}
        />
      </div>

      {/* ── Insight Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          className="p-5 animate-fade-in-up"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            animationDelay: '300ms',
          }}
        >
          <h3 className="text-[13px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
            Automated Ledger Pipeline
          </h3>
          <p className="text-[12px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            Every transaction validated in the <strong style={{ color: '#818cf8' }}>AI Workbench</strong> creates balanced double-entry lines automatically. No manual re-keying.
          </p>
        </div>

        <div
          className="p-5 animate-fade-in-up"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            animationDelay: '360ms',
          }}
        >
          <h3 className="text-[13px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            Audit & Compliance
          </h3>
          <p className="text-[12px] mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            All general ledger entries are immutable, referencing original source documents, OCR confidence, and accountant review sign-offs.
          </p>
        </div>
      </div>
    </div>
  );
};
