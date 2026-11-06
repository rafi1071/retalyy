import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileText,
  GitCompare,
  ArrowUpDown,
  Tag,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { TransactionRecord, TransactionStatus } from '../types/accounting';

interface TransactionTableProps {
  transactions: TransactionRecord[];
  selectedTxnIds?: string[];
  selectedIds?: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onOpenDrawer: (txn: TransactionRecord) => void;
  currentFilter: 'all' | 'needs_review' | 'matched' | 'approved' | 'posted';
  setCurrentFilter?: (filter: 'all' | 'needs_review' | 'matched' | 'approved' | 'posted') => void;
  onFilterChange?: (filter: 'all' | 'needs_review' | 'matched' | 'approved' | 'posted') => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedTxnIds: propSelectedTxnIds,
  selectedIds: altSelectedIds,
  onToggleSelect,
  onSelectAll,
  onOpenDrawer,
  currentFilter,
  setCurrentFilter: propSetFilter,
  onFilterChange: altSetFilter,
}) => {
  const selectedTxnIds = propSelectedTxnIds || altSelectedIds || [];
  const setCurrentFilter = propSetFilter || altSetFilter || (() => {});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'confidence'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    // Status filter
    if (currentFilter !== 'all' && t.status !== currentFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchVendor = t.counterparty.toLowerCase().includes(q);
      const matchRaw = t.rawDescription.toLowerCase().includes(q);
      const matchAccount = t.accountName.toLowerCase().includes(q) || t.accountCode.includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      const matchDoc = t.sourceDocument?.filename.toLowerCase().includes(q);
      return matchVendor || matchRaw || matchAccount || matchId || matchDoc;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortField === 'date') {
      diff = new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
    } else if (sortField === 'amount') {
      diff = b.amount - a.amount;
    } else if (sortField === 'confidence') {
      diff = b.matching.confidence - a.matching.confidence;
    }
    return sortAsc ? -diff : diff;
  });

  const allSelected = sorted.length > 0 && sorted.every((t) => selectedTxnIds.includes(t.id));

  return (
    <div className="overflow-hidden min-w-0 w-full max-w-full" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)' }}>
      {/* Table Toolbar */}
      <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg overflow-x-auto text-[12px]" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <button
            onClick={() => setCurrentFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setCurrentFilter('needs_review')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentFilter === 'needs_review'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <span>Needs Review</span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-black/20 rounded">
              {transactions.filter((t) => t.status === 'needs_review').length}
            </span>
          </button>
          <button
            onClick={() => setCurrentFilter('matched')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentFilter === 'matched'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Matched ({transactions.filter((t) => t.status === 'matched').length})
          </button>
          <button
            onClick={() => setCurrentFilter('approved')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentFilter === 'approved'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Approved ({transactions.filter((t) => t.status === 'approved').length})
          </button>
          <button
            onClick={() => setCurrentFilter('posted')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentFilter === 'posted'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Posted to GL ({transactions.filter((t) => t.status === 'posted').length})
          </button>
        </div>

        {/* Search Input & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor, invoice, account..."
              className="w-full text-[12px] pl-9 pr-3 py-2 focus:outline-none"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
            />
          </div>

          <button
            onClick={() => {
              setSortAsc(!sortAsc);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium whitespace-nowrap"
            style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort {sortAsc ? 'Asc' : 'Desc'}</span>
          </button>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-x-auto max-w-full min-w-0">
        <table className="w-full text-xs text-left min-w-[850px] lg:min-w-full">
          <thead>
            <tr className="text-[11px] font-semibold uppercase" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-4">Counterparty / Description</th>
              <th className="py-3 px-4 text-right">Amount (USD)</th>
              <th className="py-3 px-4">Source Document</th>
              <th className="py-3 px-4">Match Status</th>
              <th className="py-3 px-4">Classification (COA)</th>
              <th className="py-3 px-4">Proposed Treatment</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const isSelected = selectedTxnIds.includes(t.id);
              const hasCritical = t.validationFlags.some((f) => f.severity === 'critical');
              const hasWarning = t.validationFlags.some((f) => f.severity === 'warning');

              return (
                <tr
                  key={t.id}
                  onClick={() => onOpenDrawer(t)}
                  className="cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'rgba(99, 102, 241, 0.06)' : 'transparent',
                    borderBottom: '1px solid var(--border-secondary)',
                    transition: 'background 150ms ease',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <td
                    className="py-3 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(t.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>

                  {/* Date & Period */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-mono text-slate-200 font-medium">{t.transactionDate}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.accountingPeriod}</div>
                  </td>

                  {/* Counterparty & Description */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{t.counterparty}</span>
                      {hasCritical && (
                        <span title="Critical Validation Flag" className="inline-block">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        </span>
                      )}
                      {!hasCritical && hasWarning && (
                        <span title="Policy Review Required" className="inline-block">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs mt-0.5">
                      {t.rawDescription}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div
                      className={`font-mono font-bold tabular-nums ${
                        t.direction === 'inflow' ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {t.direction === 'inflow' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.currency}</div>
                  </td>

                  {/* Source Document Reference */}
                  <td className="py-3 px-4">
                    {t.sourceDocument ? (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[130px] font-mono text-[11px]" title={t.sourceDocument.filename}>
                          {t.sourceDocument.filename}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Unmatched Feed</span>
                      </span>
                    )}
                  </td>

                  {/* Match Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.matching.matchStatus === 'high_confidence'
                            ? 'bg-emerald-400'
                            : t.matching.matchStatus === 'probable'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      <span className="text-slate-300 font-medium capitalize">
                        {t.matching.matchStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {t.matching.confidence}% match
                    </div>
                  </td>

                  {/* Classification (COA) */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200 flex items-center gap-1">
                      <span className="font-mono text-indigo-400">{t.accountCode}</span>
                      <span className="truncate max-w-[140px]">{t.accountName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t.accountCategory} · {t.taxCode}
                    </div>
                  </td>

                  {/* Proposed Treatment */}
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-300 font-medium block truncate max-w-[160px]">
                      {t.treatmentType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate block max-w-[160px]">
                      {t.policyCitation}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize inline-block ${
                        t.status === 'posted'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : t.status === 'approved'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                          : t.status === 'needs_review'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDrawer(t);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 ml-auto"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  No transactions match the selected filter or search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
