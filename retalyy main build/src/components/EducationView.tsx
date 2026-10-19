import React, { useState } from 'react';
import { TAX_RULES_DIRECTORY, IRS_DEADLINE_CALENDAR, PROFESSION_GUIDES } from '../data/taxRules';
import { NavigationTab } from '../types';

interface EducationViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const EducationView: React.FC<EducationViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'deadlines' | 'guides'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<'year2024' | 'year2025' | 'year2026'>('year2025');

  const filteredRules = TAX_RULES_DIRECTORY.filter(rule => 
    rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.legalCitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCalendarFile = (deadline: typeof IRS_DEADLINE_CALENDAR[0]) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Retalyy Inc//Tax Deadlines//EN
BEGIN:VEVENT
SUMMARY:Retalyy Tax Deadline: ${deadline.title}
DESCRIPTION:${deadline.description} (IRS Form: ${deadline.irsForm})
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${deadline.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="wrap py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#D9F0E2] pb-6">
        <div className="ret-pill mb-3">
          <i />
          <span>Section 6 · Rules Layer & Calendar</span>
        </div>
        <h1 className="text-[clamp(32px,4vw,52px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
          Tax Rules Engine & Compliance Calendar
        </h1>
        <p className="text-sm text-[#52705F] mt-1.5 max-w-2xl">
          IRS statutory limits, multi-year version history (2024–2026), tax deduction blueprints by profession, and compliance calendars.
        </p>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeSubTab === 'rules' 
                ? 'bg-[#27B665] text-white shadow-sm' 
                : 'bg-[#EDF9F1] text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            Tax Rules & Thresholds (2024–2026)
          </button>
          <button
            onClick={() => setActiveSubTab('deadlines')}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeSubTab === 'deadlines' 
                ? 'bg-[#27B665] text-white shadow-sm' 
                : 'bg-[#EDF9F1] text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            IRS Tax Deadlines Calendar
          </button>
          <button
            onClick={() => setActiveSubTab('guides')}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeSubTab === 'guides' 
                ? 'bg-[#27B665] text-white shadow-sm' 
                : 'bg-[#EDF9F1] text-[#52705F] hover:text-[#0C2B1C]'
            }`}
          >
            Deduction Guides by Profession
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TAX RULES DIRECTORY */}
      {activeSubTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search rules, IRC citations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#52705F] font-mono font-bold">Tax Year:</span>
              {(['year2024', 'year2025', 'year2026'] as const).map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-3 py-1.5 rounded-full font-mono text-xs cursor-pointer font-bold transition-colors ${
                    selectedYear === y ? 'bg-[#27B665] text-white' : 'bg-[#EDF9F1] text-[#52705F]'
                  }`}
                >
                  {y.replace('year', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[28px] border border-[#D9F0E2] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D9F0E2] bg-[#EDF9F1] font-mono text-[#0C2B1C]">
                  <th className="p-4 font-bold">Rule / Statutory Provision</th>
                  <th className="p-4 font-bold">Legal Citation</th>
                  <th className="p-4 font-bold">Limit ({selectedYear.replace('year', '')})</th>
                  <th className="p-4 font-bold hidden md:table-cell">Strategic Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF6F1]">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#EDF9F1]/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#0C2B1C] text-sm">{rule.title}</div>
                      <div className="text-xs text-[#52705F] font-mono">{rule.category}</div>
                    </td>
                    <td className="p-4 font-mono text-[#0F7A41] font-bold whitespace-nowrap">
                      {rule.legalCitation}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#0C2B1C] whitespace-nowrap">
                      {rule[selectedYear]}
                    </td>
                    <td className="p-4 text-[#52705F] text-xs leading-relaxed hidden md:table-cell">
                      {rule.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DEADLINES CALENDAR */}
      {activeSubTab === 'deadlines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {IRS_DEADLINE_CALENDAR.map((d) => (
            <div 
              key={d.id}
              className="bg-white rounded-[28px] border border-[#D9F0E2] p-8 space-y-4 shadow-sm hover:border-[#27B665] transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0F7A41] bg-[#EDF9F1] px-3 py-1 rounded-full">
                    {d.date}
                  </span>
                  <span className="text-xs font-mono text-[#52705F]">{d.irsForm}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-[#0C2B1C]">
                  {d.title}
                </h3>

                <p className="text-sm text-[#52705F] leading-relaxed">
                  {d.description}
                </p>

                <div className="text-xs text-[#52705F] font-mono">
                  Target: {d.targetAudience}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EEF6F1] flex items-center justify-between">
                <button
                  onClick={() => downloadCalendarFile(d)}
                  className="ret-btn sm"
                >
                  Add to Calendar (.ics)
                </button>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="text-xs font-bold text-[#0F7A41] hover:underline"
                >
                  Calculate Amount →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: PROFESSION GUIDES */}
      {activeSubTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROFESSION_GUIDES.map((guide) => (
            <div 
              key={guide.id}
              className="bg-white rounded-[28px] border border-[#D9F0E2] p-8 space-y-4 shadow-sm hover:border-[#27B665] transition-all"
            >
              <div>
                <h3 className="font-display font-bold text-xl text-[#0C2B1C]">
                  {guide.role}
                </h3>
                <div className="text-xs font-mono font-bold text-[#0F7A41] mt-1">
                  Average Annual Savings: {guide.avgSavings}
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#0C2B1C]">
                <div className="font-bold">Primary Strategic Moves:</div>
                <ul className="space-y-1 list-disc pl-4 text-[#52705F]">
                  {guide.primaryMoves.map((m, idx) => (
                    <li key={idx} className="leading-relaxed">{m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] text-xs text-[#0C2B1C] space-y-1">
                <div className="font-bold text-[#0F7A41]">IRS Audit Watch-Out:</div>
                <p className="text-[#52705F]">{guide.watchOuts}</p>
              </div>

              <div className="pt-2 border-t border-[#EEF6F1] flex items-center justify-between">
                <span className="text-xs text-[#52705F] italic truncate max-w-xs">{guide.caseNote}</span>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="ret-btn sm secondary"
                >
                  Model This Role →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
