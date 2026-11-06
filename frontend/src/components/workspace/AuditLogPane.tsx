import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';
import { AuditLogEntry } from '../../types';

export const AuditLogPane: React.FC = () => {
  const { auditLog, selectedClient } = useStartupSystem();
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [filterActor, setFilterActor] = useState<'all' | 'ai' | 'user' | 'system'>('all');

  const filteredLog = auditLog.filter(entry => {
    if (filterActor !== 'all' && entry.actorType !== filterActor) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Immutable Log (Section 7.8 of Brief) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D9F0E2]">
        <div>
          <h3 className="font-bold text-[#0C2B1C] text-lg">
            Immutable Audit Log & Evidence Chain
          </h3>
          <p className="text-xs text-[#52705F]">
            Append-only database table · Database constraints forbid UPDATE and DELETE operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'ai', 'user', 'system'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterActor(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterActor === f
                  ? 'bg-[#0C2B1C] text-white shadow-sm'
                  : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
              }`}
            >
              {f} ({
                f === 'all' ? auditLog.length : auditLog.filter(a => a.actorType === f).length
              })
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-[#52705F] border-b border-[#D9F0E2] text-left">
                <th className="py-2.5">Timestamp (UTC)</th>
                <th className="py-2.5">Actor</th>
                <th className="py-2.5">Action Executed</th>
                <th className="py-2.5">Subject & ID</th>
                <th className="py-2.5">Input Hash</th>
                <th className="py-2.5 text-right">Details & Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9F0E2]/60">
              {filteredLog.map(entry => {
                const isAi = entry.actorType === 'ai';
                const isUser = entry.actorType === 'user';

                return (
                  <tr key={entry.id} className="hover:bg-[#F8FCF9]">
                    <td className="py-3 font-semibold text-[#0C2B1C]">{entry.timestamp}</td>
                    <td className="py-3">
                      <div className="font-sans font-bold text-[#0C2B1C]">{entry.actorName}</div>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        isAi ? 'bg-purple-100 text-purple-800' :
                        isUser ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.actorType}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-[#0C2B1C]">{entry.action}</td>
                    <td className="py-3 text-gray-600">
                      <span className="uppercase text-[10px] text-gray-400 block">{entry.subjectType}</span>
                      {entry.subjectId}
                    </td>
                    <td className="py-3 text-[10px] text-gray-400 font-mono">{entry.inputHash}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="px-2.5 py-1 rounded-lg bg-[#F2F9F5] border border-[#D9F0E2] text-[#0C2B1C] hover:bg-[#EDF9F1] transition-all text-[11px] font-sans font-bold"
                      >
                        Inspect Chain ↗
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVIDENCE CHAIN INSPECTOR MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D9F0E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
              <div>
                <span className="text-[10px] font-mono text-[#52705F] uppercase font-bold">
                  Evidence Chain & Custody View
                </span>
                <h3 className="font-bold text-base text-[#0C2B1C]">{selectedEntry.action}</h3>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="text-gray-400 hover:text-black font-bold">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9F0E2] space-y-2 text-xs font-mono">
              <div><span className="text-gray-500">Log Entry ID:</span> <strong>{selectedEntry.id}</strong></div>
              <div><span className="text-gray-500">Timestamp:</span> <strong>{selectedEntry.timestamp}</strong></div>
              <div><span className="text-gray-500">Actor:</span> <strong>{selectedEntry.actorName} ({selectedEntry.actorType})</strong></div>
              <div><span className="text-gray-500">Subject:</span> <strong>{selectedEntry.subjectType} / {selectedEntry.subjectId}</strong></div>
              <div><span className="text-gray-500">SHA-256 Input Hash:</span> <strong>{selectedEntry.inputHash}</strong></div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0C2B1C] text-white text-xs font-mono space-y-1">
              <div className="text-[10px] uppercase text-[#8EDDA6] font-bold">Recorded Details:</div>
              <p className="text-white/90 leading-relaxed font-sans">{selectedEntry.details}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-[#0C2B1C] text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
