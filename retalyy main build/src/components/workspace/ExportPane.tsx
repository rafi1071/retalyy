import React from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const ExportPane: React.FC = () => {
  const {
    exportQboCsv,
    exportFullClientDataJson,
    resetToDemoData,
    selectedClient,
    journalEntries,
    metrics,
    firmSettings
  } = useStartupSystem();

  return (
    <div className="space-y-6">
      {/* Top Banner: Section 9 & 14 of Brief */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D9F0E2]">
        <div>
          <h3 className="font-bold text-[#0C2B1C] text-lg">
            Data Portability & Full Audit Archive Export
          </h3>
          <p className="text-xs text-[#52705F]">
            Full data portability at any time · No vendor lock-in · Standard General Journal & CSV format
          </p>
        </div>

        <button
          onClick={resetToDemoData}
          className="text-xs text-gray-500 hover:text-red-600 underline font-mono"
        >
          Reset Demo State ↺
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export 1: QuickBooks Online CSV */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#0F7A41]/10 text-[#0F7A41] flex items-center justify-center font-bold text-sm">
                CSV
              </span>
              <h4 className="font-bold text-lg text-[#0C2B1C]">General Journal & QBO Format Export</h4>
            </div>

            <p className="text-xs text-[#52705F] leading-relaxed">
              Export all approved and posted double-entry journal entries formatted for external backups, tax workpapers, or QBO journal compatibility.
            </p>

            <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9F0E2] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-gray-600">
                <span>Target Client:</span>
                <strong className="text-[#0C2B1C]">{selectedClient.name}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Posted Entries:</span>
                <strong className="text-[#0C2B1C]">{journalEntries.length} entries</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>CSV Schema:</span>
                <strong className="text-[#0F7A41]">JournalNo, Date, AccountCode, Debit, Credit</strong>
              </div>
            </div>
          </div>

          <button
            onClick={exportQboCsv}
            className="w-full py-3.5 rounded-2xl bg-[#0C2B1C] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#16432E] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Download QBO Journal CSV</span>
            <span>↓</span>
          </button>
        </div>

        {/* Export 2: Full Client Audit Package JSON */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#27B665]/20 text-[#0F7A41] flex items-center justify-center font-bold text-sm">
                JSON
              </span>
              <h4 className="font-bold text-lg text-[#0C2B1C]">Complete Audit Archive</h4>
            </div>

            <p className="text-xs text-[#52705F] leading-relaxed">
              Download the comprehensive JSON audit package containing Chart of Accounts, Bank Feeds, Extracted Documents with OCR metadata, Journal entries, and the immutable Audit Log.
            </p>

            <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9F0E2] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-gray-600">
                <span>Security Level:</span>
                <strong className="text-[#0C2B1C]">SOC-2 Type II Compatible</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Hash Verifications:</span>
                <strong className="text-[#0C2B1C]">SHA-256 Checksums Included</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Format:</span>
                <strong className="text-[#0F7A41]">Full JSON Raw Archive</strong>
              </div>
            </div>
          </div>

          <button
            onClick={exportFullClientDataJson}
            className="w-full py-3.5 rounded-2xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Download Full JSON Archive</span>
            <span>↓</span>
          </button>
        </div>

      </div>

      {/* Stripe Active Client Billing Card (Section 4 & 13 M7) */}
      <div className="bg-[#0C2B1C] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#8EDDA6] uppercase font-bold">
            Stripe Pilot & Billing · Active Client Metering
          </div>
          <h4 className="font-bold text-xl text-white">
            Risk-Free Partnership Pilot Active
          </h4>
          <p className="text-xs text-white/75 max-w-lg">
            During your risk-free pilot on live contractor clients, platform cost is $0. Post-pilot billing is automatically metered by Stripe at ${firmSettings.activeClientMonthlyFee}/mo per active client only if close time falls ≥40%.
          </p>
        </div>

        <div className="text-right shrink-0 bg-white/10 p-4 rounded-2xl border border-white/15">
          <div className="text-xs font-mono text-white/70">Current Pilot Billing</div>
          <div className="text-3xl font-mono font-extrabold text-[#8EDDA6] mt-0.5">$0.00 / mo</div>
          <div className="text-[11px] font-mono text-white/60 mt-1">Live Pilot Clients · Stripe Connect Verified</div>
        </div>
      </div>
    </div>
  );
};
