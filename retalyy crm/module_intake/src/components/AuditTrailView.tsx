import React, { useState } from 'react';
import { AuditEvent } from '../types';
import {
  History,
  Download,
  Search,
  Filter,
  ShieldCheck,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';

interface AuditTrailViewProps {
  auditLog: AuditEvent[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditLog }) => {
  const [componentFilter, setComponentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLog = auditLog.filter(event => {
    if (componentFilter !== 'all' && event.component !== componentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        event.action.toLowerCase().includes(q) ||
        event.actor.toLowerCase().includes(q) ||
        event.details.toLowerCase().includes(q) ||
        (event.caseNumber && event.caseNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLog, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `retalyy_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Component', 'Action', 'Case', 'Before State', 'After State', 'Details'];
    const rows = auditLog.map(e => [
      e.timestamp,
      `"${e.actor.replace(/"/g, '""')}"`,
      `"${e.component.replace(/"/g, '""')}"`,
      `"${e.action.replace(/"/g, '""')}"`,
      `"${e.caseNumber || ''}"`,
      `"${(e.beforeState || '').replace(/"/g, '""')}"`,
      `"${(e.afterState || '').replace(/"/g, '""')}"`,
      `"${e.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `retalyy_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            Append-Only Immutable Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Every read of a client financial document, every AI decision, and every human override is logged and exportable for CPA compliance, SOC 2, and model drift evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            <FileJson className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">All Components ({auditLog.length})</option>
            <option value="Ingestion Gateway">Ingestion Gateway</option>
            <option value="Client & Period Resolver">Client & Period Resolver</option>
            <option value="Document Processor">Document Processor</option>
            <option value="Classifier & Extractor">Classifier & Extractor</option>
            <option value="Checklist Engine">Checklist Engine</option>
            <option value="Follow-up Drafter">Follow-up Drafter</option>
            <option value="Case Router">Case Router</option>
            <option value="Human Accountant">Human Accountant</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-slate-900"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Event Details & State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No audit records match filters.
                  </td>
                </tr>
              ) : (
                filteredLog.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {event.actor}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {event.component}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 text-[11px] whitespace-nowrap">
                      {event.action}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 tabular-nums whitespace-nowrap">
                      {event.caseNumber || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">
                      <div>{event.details}</div>
                      {(event.beforeState || event.afterState) && (
                        <div className="mt-1 font-mono text-[10px] text-slate-400 bg-slate-50 p-1.5 rounded">
                          {event.beforeState && <div>Before: {event.beforeState}</div>}
                          {event.afterState && <div>After: {event.afterState}</div>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
