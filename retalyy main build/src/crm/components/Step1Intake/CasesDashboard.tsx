import React, { useState } from 'react';
import {
  CaseTask,
  CaseState,
  Client
} from '../types';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  UploadCloud,
  ArrowRight,
  FileText,
  Filter,
  CheckSquare
} from 'lucide-react';

interface CasesDashboardProps {
  cases: CaseTask[];
  clients: Client[];
  onSelectCase: (caseId: string) => void;
  onOpenPipeline: () => void;
}

export const CasesDashboard: React.FC<CasesDashboardProps> = ({
  cases,
  clients,
  onSelectCase,
  onOpenPipeline
}) => {
  const [filterState, setFilterState] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate metrics
  const triageCount = cases.filter(c => c.state === 'triage' || c.needsTriage).length;
  const readyCount = cases.filter(c => c.state === 'ready_for_review').length;
  const awaitingClientCount = cases.filter(c => c.state === 'awaiting_client').length;
  const closedCount = cases.filter(c => c.state === 'closed').length;

  const filteredCases = cases.filter(c => {
    if (filterState === 'triage' && (c.state !== 'triage' && !c.needsTriage)) return false;
    if (filterState === 'ready' && c.state !== 'ready_for_review') return false;
    if (filterState === 'awaiting' && c.state !== 'awaiting_client') return false;
    if (filterState === 'closed' && c.state !== 'closed') return false;

    if (selectedClientId !== 'all' && c.clientId !== selectedClientId) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.caseNumber.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.periodLabel.toLowerCase().includes(q) ||
        c.assignee.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div
          className="p-4 rounded-xl transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Routine Review Time</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>3.4 min</span>
            <span className="text-xs font-medium font-mono tabular-nums text-emerald-400">Target &lt; 5m</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Down from 8–28 min baseline</div>
        </div>

        <div
          className="p-4 rounded-xl transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: triageCount > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-primary)',
            boxShadow: triageCount > 0 ? '0 0 16px rgba(245, 158, 11, 0.08)' : 'var(--shadow-sm)'
          }}
        >
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Needs Human Triage</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">{triageCount}</span>
            <span className="text-xs text-amber-400 font-medium">Low conf / glare</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Blocks downstream flow</div>
        </div>

        <div
          className="p-4 rounded-xl transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Ready for Review</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>{readyCount}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Intake verified</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>All expected docs matched</div>
        </div>

        <div
          className="p-4 rounded-xl transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Awaiting Client Reply</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>{awaitingClientCount}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Drafted follow-ups</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Chasing missing items</div>
        </div>

        <div
          className="p-4 rounded-xl transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>False-Missing Rate</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">0.8%</span>
            <span className="text-xs font-medium font-mono tabular-nums text-emerald-400">Target &lt; 2.0%</span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Checklist rule integrity</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-xl"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)'
        }}
      >
        {/* Interactive Segmented Filter Controls */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg overflow-x-auto"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          <button
            onClick={() => setFilterState('all')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              background: filterState === 'all' ? 'var(--accent-primary)' : 'transparent',
              color: filterState === 'all' ? '#ffffff' : 'var(--text-tertiary)'
            }}
          >
            All Cases ({cases.length})
          </button>
          <button
            onClick={() => setFilterState('triage')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            style={{
              background: filterState === 'triage' ? 'var(--color-warning-subtle)' : 'transparent',
              color: filterState === 'triage' ? 'var(--color-warning)' : 'var(--text-tertiary)',
              border: filterState === 'triage' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent'
            }}
          >
            <span>Needs Triage</span>
            {triageCount > 0 && (
              <span
                className="text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums font-bold"
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: 'var(--color-warning)'
                }}
              >
                {triageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterState('ready')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              background: filterState === 'ready' ? 'var(--accent-primary)' : 'transparent',
              color: filterState === 'ready' ? '#ffffff' : 'var(--text-tertiary)'
            }}
          >
            Ready for Review ({readyCount})
          </button>
          <button
            onClick={() => setFilterState('awaiting')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              background: filterState === 'awaiting' ? 'var(--accent-primary)' : 'transparent',
              color: filterState === 'awaiting' ? '#ffffff' : 'var(--text-tertiary)'
            }}
          >
            Awaiting Client ({awaitingClientCount})
          </button>
          <button
            onClick={() => setFilterState('closed')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            style={{
              background: filterState === 'closed' ? 'var(--accent-primary)' : 'transparent',
              color: filterState === 'closed' ? '#ffffff' : 'var(--text-tertiary)'
            }}
          >
            Closed ({closedCount})
          </button>
        </div>

        {/* Search & Client Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search case, client, accountant..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg w-56 focus:outline-none transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <select
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <option value="all">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="font-semibold uppercase tracking-wider text-[10px]"
              style={{
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-primary)',
                color: 'var(--text-tertiary)'
              }}
            >
              <tr>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Client & Period</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Checklist Status</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">SLA Due</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center" style={{ color: 'var(--text-tertiary)' }}>
                    <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No cases match the selected filters</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try resetting the filter or test a new ingestion.</p>
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => {
                  const isTriage = c.state === 'triage' || c.needsTriage;
                  const isAwaiting = c.state === 'awaiting_client';
                  const isReady = c.state === 'ready_for_review';
                  const isComplete = c.state === 'closed';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCase(c.id)}
                      className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Case Number */}
                      <td className="py-3.5 px-4 font-mono font-medium tabular-nums" style={{ color: 'var(--accent-primary-hover)' }}>
                        {c.caseNumber}
                      </td>

                      {/* Client & Period */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{c.clientName}</div>
                        <div className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          <span>{c.periodLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                          {c.channel === 'email' ? (
                            <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                          <span className="capitalize">{c.channel}</span>
                        </div>
                      </td>

                      {/* Documents */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{c.documentsCount} file{c.documentsCount !== 1 ? 's' : ''}</span>
                        </div>
                        {c.findingsCount > 0 && (
                          <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                            <span>{c.findingsCount} flag{c.findingsCount !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </td>

                      {/* Checklist Engine Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
                            {c.satisfiedDocsCount} of {c.expectedDocsCount} received
                          </span>
                        </div>
                        <div className="text-[11px] mt-0.5">
                          {c.satisfiedDocsCount >= c.expectedDocsCount ? (
                            <span className="text-emerald-400 font-medium">All requirements met</span>
                          ) : (
                            <span className="text-amber-400 font-medium">
                              {c.expectedDocsCount - c.satisfiedDocsCount} missing document
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{c.assignee}</div>
                        <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{c.assignedRole}</div>
                      </td>

                      {/* SLA Due */}
                      <td className="py-3.5 px-4 font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {c.dueDate}
                      </td>

                      {/* State */}
                      <td className="py-3.5 px-4">
                        {isTriage && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{
                              background: 'var(--color-warning-subtle)',
                              color: 'var(--color-warning)'
                            }}
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            Needs Triage
                          </span>
                        )}
                        {isAwaiting && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{
                              background: 'rgba(6, 182, 212, 0.1)',
                              color: '#38bdf8'
                            }}
                          >
                            <Clock className="w-3 h-3 text-sky-400" />
                            Awaiting Client
                          </span>
                        )}
                        {isReady && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{
                              background: 'var(--color-success-subtle)',
                              color: 'var(--color-success)'
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Ready for Review
                          </span>
                        )}
                        {isComplete && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{
                              background: 'var(--bg-elevated)',
                              color: 'var(--text-tertiary)'
                            }}
                          >
                            Completed
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCase(c.id);
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded-md transition-all inline-flex items-center gap-1 cursor-pointer"
                          style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-secondary)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          Review
                          <ArrowRight className="w-3 h-3 text-indigo-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
