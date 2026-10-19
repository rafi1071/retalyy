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
      <div
        className="p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <History className="w-5 h-5 text-indigo-400" />
            Append-Only Immutable Audit Trail
          </h2>
          <p className="text-xs mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Every read of a client financial document, every AI decision, and every human override is logged and exportable for CPA compliance, SOC 2, and model drift evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <FileJson className="w-3.5 h-3.5 text-indigo-400" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-xl"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center gap-3">
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="text-xs rounded-lg px-3 py-1.5 focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
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
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search action, actor, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-lg w-64 focus:outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* Audit Log Table */}
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
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Case #</th>
                <th className="py-3 px-4">Event Details & State Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                    No audit records match filters.
                  </td>
                </tr>
              ) : (
                filteredLog.map(event => (
                  <tr key={event.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                      {event.actor}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {event.component}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-[11px] whitespace-nowrap" style={{ color: 'var(--accent-primary-hover)' }}>
                      {event.action}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {event.caseNumber || '—'}
                    </td>
                    <td className="py-3 px-4 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                      <div>{event.details}</div>
                      {(event.beforeState || event.afterState) && (
                        <div
                          className="mt-1 font-mono text-[10px] p-2 rounded-lg space-y-0.5"
                          style={{
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border-secondary)',
                            color: 'var(--text-muted)'
                          }}
                        >
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
