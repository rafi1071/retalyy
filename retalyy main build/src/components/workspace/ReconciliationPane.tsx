import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const ReconciliationPane: React.FC = () => {
  const {
    reconciliationMatches,
    confirmReconciliationMatch,
    rejectReconciliationMatch,
    bankTransactions,
    documents,
    metrics,
    selectedClient
  } = useStartupSystem();

  const [activeTab, setActiveTab] = useState<'all' | 'suggested' | 'confirmed' | 'exceptions'>('all');

  const filteredMatches = reconciliationMatches.filter(m => {
    if (activeTab === 'suggested') return m.status === 'suggested';
    if (activeTab === 'confirmed') return m.status === 'confirmed';
    if (activeTab === 'exceptions') return m.status === 'rejected' || m.score < 0.60;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Unreconciled Difference & Status (Invariant from Section 7.4) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Unreconciled Difference</div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2B1C] mt-1">
            ${(metrics.unreconciledDifferenceMinor / 100).toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#0F7A41] font-semibold mt-1">
            <span>✓</span>
            <span>Ledger ties directly to bank balance</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Auto-Match Precision</div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2B1C] mt-1">
            {metrics.autoMatchRate}%
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            Target: ≥85% routine auto-match rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Total Confirmed Matches</div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2B1C] mt-1">
            {metrics.autoMatchCount} of {reconciliationMatches.length}
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            Multi-rule candidate scoring
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Connected Account</div>
          <div className="text-base font-bold text-[#0C2B1C] mt-1 truncate">
            {selectedClient.bankAccountMask}
          </div>
          <div className="text-xs text-[#0F7A41] font-mono mt-1">
            Plaid OAuth Sync Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#D9F0E2] pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'suggested', 'confirmed', 'exceptions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#0C2B1C] text-white shadow-sm'
                  : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
              }`}
            >
              {tab} ({
                tab === 'all' ? reconciliationMatches.length :
                tab === 'suggested' ? reconciliationMatches.filter(m => m.status === 'suggested').length :
                tab === 'confirmed' ? reconciliationMatches.filter(m => m.status === 'confirmed').length :
                reconciliationMatches.filter(m => m.status === 'rejected' || m.score < 0.60).length
              })
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#52705F]">
          Candidate Window: ±7 days · Weighted Deterministic Matcher
        </span>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map(match => {
          const tx = bankTransactions.find(t => t.id === match.bankTransactionId);
          const doc = documents.find(d => d.id === match.documentId);
          const isConfirmed = match.status === 'confirmed';

          return (
            <div
              key={match.id}
              className={`p-6 rounded-3xl border transition-all ${
                isConfirmed
                  ? 'bg-white border-[#D9F0E2]'
                  : 'bg-[#FFFBF0] border-[#FEE685] shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#D9F0E2]/70">
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    isConfirmed ? 'bg-[#EDF9F1] text-[#0F7A41]' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isConfirmed ? '✓' : '⚡'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#52705F] font-bold">
                        Match Candidate #{match.id} · Type: {match.matchType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        match.score >= 0.90 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Score: {Math.round(match.score * 100)}%
                      </span>
                    </div>
                    <div className="text-base font-bold text-[#0C2B1C] mt-0.5">
                      {tx?.counterparty || 'Bank Line'} ↔ {doc?.vendorName || 'Source Receipt'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {match.status === 'suggested' && (
                    <>
                      <button
                        onClick={() => confirmReconciliationMatch(match.id)}
                        className="px-4 py-2 rounded-xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-sm"
                      >
                        Confirm Match ✓
                      </button>
                      <button
                        onClick={() => rejectReconciliationMatch(match.id)}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all"
                      >
                        Flag Exception ✕
                      </button>
                    </>
                  )}
                  {isConfirmed && (
                    <span className="px-3.5 py-1.5 rounded-xl bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#27B665]/30 flex items-center gap-1.5">
                      <span>✓ Reconciled & Locked</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Two Column Comparative Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Bank feed side */}
                <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9F0E2] text-xs space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-[#52705F] font-bold flex justify-between">
                    <span>Bank Statement Line</span>
                    <span className="text-[#0C2B1C]">{tx?.postedDate}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#0C2B1C]">
                    {tx ? (tx.amountMinor < 0 ? `-$${(Math.abs(tx.amountMinor) / 100).toFixed(2)}` : `+$${(tx.amountMinor / 100).toFixed(2)}`) : '--'}
                  </div>
                  <div className="text-[11px] text-gray-600 font-mono break-all">{tx?.descriptionRaw}</div>
                </div>

                {/* Document/Receipt side */}
                <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9F0E2] text-xs space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-[#52705F] font-bold flex justify-between">
                    <span>Source Document (OCR)</span>
                    <span className="text-[#0C2B1C]">{doc?.documentDate || 'N/A'}</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#0C2B1C]">
                    {doc ? `$${(doc.totalMinor / 100).toFixed(2)}` : 'No document attached'}
                  </div>
                  <div className="text-[11px] text-gray-600 font-mono">
                    Invoice: {doc?.invoiceNumber || 'N/A'} · Terms: {doc?.paymentMethod || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Scoring Reasons Breakdown */}
              <div className="mt-4 pt-3 border-t border-[#D9F0E2]/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#52705F]">Scoring Criteria:</span>
                {match.reasons.map((reason, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-[#D9F0E2] text-[#0C2B1C]"
                  >
                    ✓ {reason}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
