import React from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const DeadlinesPane: React.FC = () => {
  const {
    deadlines,
    verifyDeadline,
    selectedClient
  } = useStartupSystem();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D9F0E2]">
        <div>
          <h3 className="font-bold text-[#0C2B1C] text-lg">
            Statutory Deadlines & Compliance Calendar
          </h3>
          <p className="text-xs text-[#52705F]">
            Federal and state tax filing obligations · Pre-seeded templates require human CPA verification
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#EDF9F1] border border-[#27B665]/30 text-[#0F7A41] font-bold">
          IRC & Treasury Reg. Compliant
        </div>
      </div>

      {/* Deadlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deadlines.map(item => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all space-y-4 ${
              item.verified
                ? 'bg-white border-[#D9F0E2] shadow-sm'
                : 'bg-[#FFFBF0] border-[#FEE685] shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0C2B1C] bg-[#F2F9F5] px-2 py-0.5 rounded">
                    {item.formNumber}
                  </span>
                  <span className="text-[11px] font-mono text-[#52705F]">{item.jurisdiction}</span>
                </div>
                <h4 className="font-bold text-base text-[#0C2B1C] mt-1.5">{item.title}</h4>
              </div>

              {item.verified ? (
                <span className="px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[10px] font-mono font-bold shrink-0">
                  ✓ Verified by CPA
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold shrink-0 animate-pulse">
                  ⚠ Unverified Template
                </span>
              )}
            </div>

            <p className="text-xs text-[#52705F] leading-relaxed">
              {item.description}
            </p>

            <div className="p-3 bg-[#F8FCF9] rounded-2xl border border-[#D9F0E2] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[#52705F]">Statutory Due Date: </span>
                <strong className="text-[#0C2B1C]">{item.dueDate}</strong>
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#0F7A41] font-bold underline hover:text-[#0C2B1C]"
              >
                Official IRS/State Rule ↗
              </a>
            </div>

            {!item.verified ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#8F4F00] italic">
                  Rule citation must be confirmed by firm reviewer
                </span>
                <button
                  onClick={() => verifyDeadline(item.id)}
                  className="px-4 py-2 rounded-xl bg-[#0C2B1C] text-white font-bold text-xs hover:bg-[#16432E] transition-all"
                >
                  Verify Rule & Cite Source ✓
                </button>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-[#52705F]">
                Verified by {item.verifiedBy} · Safe Harbor Confirmed
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
