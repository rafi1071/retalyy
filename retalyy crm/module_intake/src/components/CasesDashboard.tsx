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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Routine Review Time</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">3.4 min</span>
            <span className="text-xs text-emerald-600 font-medium font-mono tabular-nums">Target &lt; 5m</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Down from 8–28 min baseline</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Needs Human Triage</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">{triageCount}</span>
            <span className="text-xs text-amber-700 font-medium">Low conf / glare</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Blocks downstream flow</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Ready for Review</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{readyCount}</span>
            <span className="text-xs text-slate-500">Intake verified</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">All expected docs matched</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Awaiting Client Reply</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{awaitingClientCount}</span>
            <span className="text-xs text-slate-500">Drafted follow-ups</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Chasing missing items</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">False-Missing Rate</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">0.8%</span>
            <span className="text-xs text-emerald-600 font-medium font-mono tabular-nums">Target &lt; 2.0%</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Checklist rule integrity</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterState === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Cases ({cases.length})
          </button>
          <button
            onClick={() => setFilterState('triage')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              filterState === 'triage'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Triage
            {triageCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[11px] px-1.5 py-0.2 rounded font-mono tabular-nums font-bold">
                {triageCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterState('ready')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterState === 'ready'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ready for Review ({readyCount})
          </button>
          <button
            onClick={() => setFilterState('awaiting')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterState === 'awaiting'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Awaiting Client ({awaitingClientCount})
          </button>
          <button
            onClick={() => setFilterState('closed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterState === 'closed'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Closed ({closedCount})
          </button>
        </div>

        {/* Search & Client Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search case, client, accountant..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-slate-900"
            />
          </div>

          <select
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Client & Period</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Checklist Engine Status</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">SLA Due</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <p className="font-medium text-slate-700">No cases match the selected filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the filter or test a new ingestion.</p>
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
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      {/* Case Number */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                        {c.caseNumber}
                      </td>

                      {/* Client & Period (Unboxed clean metadata with · separator) */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{c.clientName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{c.periodLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          {c.channel === 'email' ? (
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className="capitalize">{c.channel}</span>
                        </div>
                      </td>

                      {/* Documents */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono tabular-nums text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.documentsCount} file{c.documentsCount !== 1 ? 's' : ''}</span>
                        </div>
                        {c.findingsCount > 0 && (
                          <div className="text-[11px] text-amber-700 flex items-center gap-1 mt-0.5">
                            <span>{c.findingsCount} flag{c.findingsCount !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </td>

                      {/* Checklist Engine Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono tabular-nums font-semibold text-slate-800">
                            {c.satisfiedDocsCount} of {c.expectedDocsCount} received
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {c.satisfiedDocsCount >= c.expectedDocsCount ? (
                            <span className="text-emerald-700 font-medium">All requirements met</span>
                          ) : (
                            <span className="text-amber-700 font-medium">
                              {c.expectedDocsCount - c.satisfiedDocsCount} missing document
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{c.assignee}</div>
                        <div className="text-[11px] text-slate-400">{c.assignedRole}</div>
                      </td>

                      {/* SLA Due */}
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                        {c.dueDate}
                      </td>

                      {/* State */}
                      <td className="py-3.5 px-4">
                        {isTriage && (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-800">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Needs Triage
                          </span>
                        )}
                        {isAwaiting && (
                          <span className="inline-flex items-center gap-1 font-semibold text-sky-800">
                            <Clock className="w-3 h-3 text-sky-600" />
                            Awaiting Client
                          </span>
                        )}
                        {isReady && (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Ready for Review
                          </span>
                        )}
                        {isComplete && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
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
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                        >
                          Review
                          <ArrowRight className="w-3 h-3" />
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
