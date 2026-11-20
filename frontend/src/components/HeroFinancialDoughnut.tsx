import React, { useState, useEffect, useRef } from 'react';

interface CategoryData {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  txCount: number;
  sampleTx: string;
  color: string;
  glowColor: string;
}

const MARCH_CATEGORIES: CategoryData[] = [
  { id: 'payroll', name: 'Payroll & Benefits', amount: 41260, percentage: 48.7, txCount: 28, sampleTx: 'Gusto payroll batch #8841 · Matched Form 941', color: '#1FAE5B', glowColor: 'rgba(31,174,91,0.35)' },
  { id: 'software', name: 'Software & Cloud', amount: 18420, percentage: 21.7, txCount: 142, sampleTx: 'AWS & Datadog reserve · Auto-coded ASC-340', color: '#0C2B1C', glowColor: 'rgba(12,43,28,0.25)' },
  { id: 'operations', name: 'Operations & Facilities', amount: 14110, percentage: 16.7, txCount: 64, sampleTx: 'WeWork lease & utilities · Matched invoice', color: '#27B665', glowColor: 'rgba(39,182,101,0.30)' },
  { id: 'contractors', name: 'Contractors & 1099', amount: 7500, percentage: 8.9, txCount: 19, sampleTx: 'J. Alvarez Dev Consulting · W-9 verified', color: '#F59E0B', glowColor: 'rgba(245,158,11,0.35)' },
  { id: 'compliance', name: 'Tax & Compliance', amount: 3420, percentage: 4.0, txCount: 14, sampleTx: 'Delaware franchise & statutory prep fee', color: '#6B8074', glowColor: 'rgba(107,128,116,0.30)' },
];

const Q1_CATEGORIES: CategoryData[] = [
  { id: 'payroll', name: 'Payroll & Benefits', amount: 123780, percentage: 48.7, txCount: 84, sampleTx: 'Q1 Payroll run cumulative · 84 disbursements', color: '#1FAE5B', glowColor: 'rgba(31,174,91,0.35)' },
  { id: 'software', name: 'Software & Cloud', amount: 55260, percentage: 21.7, txCount: 426, sampleTx: 'Q1 Cloud infrastructure & SaaS amortized', color: '#0C2B1C', glowColor: 'rgba(12,43,28,0.25)' },
  { id: 'operations', name: 'Operations & Facilities', amount: 42330, percentage: 16.7, txCount: 192, sampleTx: 'Q1 Operating facilities & utilities balanced', color: '#27B665', glowColor: 'rgba(39,182,101,0.30)' },
  { id: 'contractors', name: 'Contractors & 1099', amount: 22500, percentage: 8.9, txCount: 57, sampleTx: 'Q1 1099 Contractor filings & W-9s matched', color: '#F59E0B', glowColor: 'rgba(245,158,11,0.35)' },
  { id: 'compliance', name: 'Tax & Compliance', amount: 10260, percentage: 4.0, txCount: 42, sampleTx: 'Q1 Estimated tax payments & audit prep', color: '#6B8074', glowColor: 'rgba(107,128,116,0.30)' },
];

export const HeroFinancialDoughnut: React.FC = () => {
  const [period, setPeriod] = useState<'march' | 'q1'>('march');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = period === 'march' ? MARCH_CATEGORIES : Q1_CATEGORIES;
  const totalAmount = categories.reduce((acc, c) => acc + c.amount, 0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Subtle auto-cycling highlight when idle to make hero feel dynamic
  useEffect(() => {
    if (userInteracted) return;
    const interval = setInterval(() => {
      setHoveredId((current) => {
        if (!current) return categories[0].id;
        const idx = categories.findIndex((c) => c.id === current);
        return categories[(idx + 1) % categories.length].id;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [userInteracted, categories]);

  const handleMouseEnter = (id: string) => {
    setUserInteracted(true);
    setHoveredId(id);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setUserInteracted(false), 5000);
  };

  const radius = 82;
  const defaultStroke = 20;
  const hoveredStroke = 26;
  const circumference = 2 * Math.PI * radius; // ~515.22
  const gap = 3.5;

  let cumulativeAngle = -90;
  const activeCategory = categories.find((c) => c.id === hoveredId);

  return (
    <div
      onMouseEnter={() => setUserInteracted(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[580px] rounded-3xl bg-white/95 backdrop-blur-xl border border-[#D9F0E2] shadow-[0_20px_50px_rgba(11,18,16,0.08),0_1px_3px_rgba(11,18,16,0.04)] p-6 sm:p-7 text-left transition-all duration-300"
    >
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F3EE]">
        <div>
          <div className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#86928B]">
            Automated Ledger Breakdown
          </div>
          <div className="text-[16px] font-bold text-[#0B1210] mt-0.5">
            {period === 'march' ? 'March Close Distribution' : 'Q1 2026 Close Distribution'}
          </div>
        </div>

        {/* Period Filter Toggle */}
        <div className="flex items-center bg-[#F2F5F1] p-0.5 rounded-xl border border-[#E4EAE2]">
          <button
            type="button"
            onClick={() => setPeriod('march')}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all duration-200 ${
              period === 'march'
                ? 'bg-white text-[#0B1210] shadow-[0_1px_3px_rgba(11,18,16,0.08)]'
                : 'text-[#6B766F] hover:text-[#0B1210]'
            }`}
          >
            March
          </button>
          <button
            type="button"
            onClick={() => setPeriod('q1')}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all duration-200 ${
              period === 'q1'
                ? 'bg-white text-[#0B1210] shadow-[0_1px_3px_rgba(11,18,16,0.08)]'
                : 'text-[#6B766F] hover:text-[#0B1210]'
            }`}
          >
            Q1 (YTD)
          </button>
        </div>
      </div>

      {/* Spacious Side-by-Side Content */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-4">
        
        {/* Left: Doughnut SVG */}
        <div className="sm:col-span-5 flex items-center justify-center relative">
          <svg
            viewBox="0 0 210 210"
            className="w-[190px] h-[190px] sm:w-[205px] sm:h-[205px] transform transition-transform duration-500"
          >
            {/* Background Ring Track */}
            <circle
              cx="105"
              cy="105"
              r={radius}
              fill="none"
              stroke="#F2F4F0"
              strokeWidth={defaultStroke}
            />

            {/* Animated Slices */}
            {categories.map((cat, idx) => {
              const arcLength = (cat.percentage / 100) * circumference;
              const startRot = cumulativeAngle;
              cumulativeAngle += (cat.percentage / 100) * 360;

              const isHovered = hoveredId === cat.id;
              const isAnyHovered = hoveredId !== null;
              const strokeW = isHovered ? hoveredStroke : defaultStroke;

              const strokeDash = mounted
                ? `${Math.max(0, arcLength - gap)} ${circumference}`
                : `0 ${circumference}`;

              return (
                <circle
                  key={cat.id}
                  cx="105"
                  cy="105"
                  r={radius}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth={strokeW}
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                  transform={`rotate(${startRot} 105 105)`}
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300 ease-out"
                  style={{
                    transition: `stroke-dasharray 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 70}ms, stroke-width 0.25s ease, opacity 0.25s ease`,
                    opacity: isAnyHovered && !isHovered ? 0.35 : 1,
                    filter: isHovered ? `drop-shadow(0 4px 10px ${cat.glowColor})` : 'none',
                  }}
                />
              );
            })}
          </svg>

          {/* Dynamic Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#7B8880] transition-colors duration-200 truncate max-w-[120px]">
              {activeCategory ? activeCategory.name : 'Total Volume'}
            </span>
            <span className="rt-display text-[22px] sm:text-[25px] font-bold text-[#0B1210] tabular-nums leading-none mt-1 transition-all duration-200">
              ${(activeCategory ? activeCategory.amount : totalAmount).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </span>
            <span className="text-[10.5px] font-semibold text-[#1FAE5B] mt-1 transition-colors duration-200">
              {activeCategory
                ? `${activeCategory.percentage}% · ${activeCategory.txCount} txns`
                : `${period === 'march' ? '1,267 txns' : '3,801 txns'} · 95% auto`}
            </span>
          </div>
        </div>

        {/* Right: Category List */}
        <div className="sm:col-span-7 space-y-2 pl-0 sm:pl-2 border-t sm:border-t-0 sm:border-l border-[#F0F3EE] pt-3.5 sm:pt-0">
          {categories.map((cat) => {
            const isHovered = hoveredId === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                  isHovered
                    ? 'bg-[#F2FAF5] font-semibold text-[#0B1210] shadow-[0_2px_8px_rgba(31,174,91,0.08)]'
                    : 'hover:bg-[#F9FAF8] text-[#4D5C54]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-150"
                    style={{
                      backgroundColor: cat.color,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 tabular-nums font-mono">
                  <span className={isHovered ? 'text-[#0B1210]' : 'text-[#28322D]'}>
                    ${cat.amount.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#7B8880] w-10 text-right font-medium">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Live Context / Sample Transaction Inspection Badge */}
      <div className="pt-3 border-t border-[#F0F3EE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#7B8880]">
        <div className="flex items-center gap-1.5 min-w-0 text-[#0F7A41]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAE5B] animate-pulse shrink-0" />
          <span className="truncate font-mono text-[10.5px]">
            {activeCategory ? activeCategory.sampleTx : 'Continuous double-entry balance invariant active'}
          </span>
        </div>
        <span className="font-mono text-[#52705F] shrink-0 text-[10.5px]">GAAP & ASC-340 Enforced</span>
      </div>
    </div>
  );
};
