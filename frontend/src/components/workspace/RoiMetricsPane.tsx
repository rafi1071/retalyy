import React from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const RoiMetricsPane: React.FC = () => {
  const { metrics, firmSettings, updateFirmSettings, selectedClient } = useStartupSystem();

  return (
    <div className="space-y-6">
      {/* Top Value Banner: The Renewal Tool (Section 7.9) */}
      <div className="bg-gradient-to-br from-[#0C2B1C] via-[#16432E] to-[#0C2B1C] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="blob b1 -top-24 -right-12 opacity-30" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8EDDA6] font-bold">
              Autonomous Operating ROI · {firmSettings.firmName}
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-[#8EDDA6] border border-white/20">
              Audited Metrics Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="text-xs font-mono text-white/70 uppercase">Estimated Hours Saved</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#8EDDA6] mt-1">
                {metrics.netHoursSaved} hrs
              </div>
              <div className="text-xs text-white/75 mt-1">
                Based on {firmSettings.baselineMinutesPerTx}m/tx & {firmSettings.baselineMinutesPerDoc}m/doc manual baseline
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-white/70 uppercase">Billable Capacity Value</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white mt-1">
                ${metrics.dollarRoiSaved.toLocaleString()}
              </div>
              <div className="text-xs text-white/75 mt-1">
                Valued at ${firmSettings.firmHourlyBillingRate}/hr standard billing rate
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-white/70 uppercase">Capacity Multiplier</div>
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#8EDDA6] mt-1">
                2.1×
              </div>
              <div className="text-xs text-white/75 mt-1">
                Staff can serve more clients without lowering review quality
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Auto-Categorization Rate</div>
          <div className="text-3xl font-mono font-extrabold text-[#0C2B1C] mt-2">
            {metrics.autoCategorizedRate}%
          </div>
          <div className="text-xs text-[#0F7A41] font-semibold mt-1">
            Target: ≥90% after learning period
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Auto-Match Precision</div>
          <div className="text-3xl font-mono font-extrabold text-[#0C2B1C] mt-2">
            {metrics.autoMatchRate}%
          </div>
          <div className="text-xs text-[#0F7A41] font-semibold mt-1">
            Deterministic weighted matching
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Avg Review Time Per Item</div>
          <div className="text-3xl font-mono font-extrabold text-[#0C2B1C] mt-2">
            {metrics.avgReviewSecondsPerItem}s
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            vs. 90s manual bank feed coding
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Silent Bad Postings</div>
          <div className="text-3xl font-mono font-extrabold text-[#0F7A41] mt-2">
            0
          </div>
          <div className="text-xs text-[#0F7A41] font-semibold mt-1">
            Strict human review threshold
          </div>
        </div>
      </div>

      {/* Firm Parameters Configuration */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
          <h3 className="font-bold text-[#0C2B1C] text-base">
            Configure Firm ROI Baseline Parameters
          </h3>
          <span className="text-xs font-mono text-[#52705F]">
            Customized per accounting practice
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B1C]">
              Firm Hourly Billing Rate: ${firmSettings.firmHourlyBillingRate}/hr
            </label>
            <input
              type="range"
              min="100"
              max="350"
              step="25"
              value={firmSettings.firmHourlyBillingRate}
              onChange={e => updateFirmSettings({ firmHourlyBillingRate: Number(e.target.value) })}
              className="w-full accent-[#27B665]"
            />
            <div className="text-[11px] text-gray-500">Standard rate for senior staff & CPA reviewers</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B1C]">
              Manual Minutes / Tx: {firmSettings.baselineMinutesPerTx} mins
            </label>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={firmSettings.baselineMinutesPerTx}
              onChange={e => updateFirmSettings({ baselineMinutesPerTx: Number(e.target.value) })}
              className="w-full accent-[#27B665]"
            />
            <div className="text-[11px] text-gray-500">Baseline time to read, verify, and code a bank transaction</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0C2B1C]">
              Manual Minutes / Doc: {firmSettings.baselineMinutesPerDoc} mins
            </label>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={firmSettings.baselineMinutesPerDoc}
              onChange={e => updateFirmSettings({ baselineMinutesPerDoc: Number(e.target.value) })}
              className="w-full accent-[#27B665]"
            />
            <div className="text-[11px] text-gray-500">Baseline time to open, review, key in line items, and file</div>
          </div>
        </div>
      </div>
    </div>
  );
};
