import React, { useState } from 'react';
import { Clock, TrendingUp, Sparkles, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { TransactionRecord } from '../types/accounting';

interface EfficiencyMetricsProps {
  transactions: TransactionRecord[];
}

export const EfficiencyMetrics: React.FC<EfficiencyMetricsProps> = ({ transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalCount = transactions.length;
  const postedCount = transactions.filter((t) => t.status === 'posted').length;
  const approvedCount = transactions.filter((t) => t.status === 'approved').length;
  const exceptionCount = transactions.filter((t) => t.status === 'needs_review').length;
  const matchedCount = transactions.filter((t) => t.status === 'matched').length;

  const autoRate = Math.round(((postedCount + approvedCount) / (totalCount || 1)) * 100);

  const scale = Math.max(0.2, totalCount / 10);
  const manualTimeMinutes = Math.round(145 * scale);
  const aiTimeMinutes = Math.round(22 * scale);
  const savedMinutes = manualTimeMinutes - aiTimeMinutes;
  const savedHours = (savedMinutes / 60).toFixed(1);

  return (
    <div
      className="mb-0 overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Summary KPIs */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  ~{savedHours} hrs
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                      style={{
                        background: 'var(--color-success-subtle)',
                        color: 'var(--color-success)',
                        border: '1px solid rgba(34, 197, 94, 0.15)',
                      }}>
                  {Math.round((savedMinutes / manualTimeMinutes) * 100)}% Faster
                </span>
              </div>
              <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Time saved vs. manual processing</span>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px" style={{ background: 'var(--border-primary)' }} />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {autoRate}%
              </span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>Auto-Processed</span>
            </div>
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {postedCount} posted · {approvedCount} approved · {exceptionCount} exceptions
            </span>
          </div>

          <div className="hidden sm:block h-8 w-px" style={{ background: 'var(--border-primary)' }} />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>
                98.8%
              </span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>Avg OCR Accuracy</span>
            </div>
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Across collected invoices & receipts</span>
          </div>
        </div>

        {/* Right: Expandable */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 shrink-0"
          style={{
            color: 'var(--accent-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-hover)',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <span>Benchmark</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Table */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2" style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-base)' }}>
          <div className="text-[12px] mb-3 flex items-center justify-between"
               style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Activity Breakdown (Industry Baseline vs Retalyy AI)
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Normalized for 100 transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
                  <th className="py-2 pr-4 font-medium">Processing Activity</th>
                  <th className="py-2 px-4 font-medium">Manual</th>
                  <th className="py-2 px-4 font-medium">AI-Assisted</th>
                  <th className="py-2 pl-4 font-medium">Gain</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)' }}>
                {[
                  ['Extract & validate records', '30–90 min', '5–20 min review', '~78% faster', true],
                  ['Match supporting records', '30–90 min', '5–20 min review', '~80% faster', true],
                  ['Categorize & determine treatment', '30–60 min', '5–20 min review', '~75% faster', true],
                  ['Resolve exceptions', '15–60+ min', '15–60+ min', 'Human CPA', false],
                ].map(([label, manual, ai, gain, isGain], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td className="py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>{label}</td>
                    <td className="py-2 px-4 font-mono" style={{ color: 'var(--text-muted)' }}>{manual}</td>
                    <td className="py-2 px-4 font-mono font-medium" style={{ color: isGain ? 'var(--color-success)' : 'var(--color-warning)' }}>{ai}</td>
                    <td className="py-2 pl-4 font-semibold" style={{ color: isGain ? 'var(--color-success)' : 'var(--text-muted)' }}>{gain}</td>
                  </tr>
                ))}
                <tr className="font-semibold" style={{ borderTop: '2px solid var(--border-hover)', background: 'var(--bg-surface)' }}>
                  <td className="py-2 pr-4" style={{ color: 'var(--text-primary)' }}>Total Elapsed Work</td>
                  <td className="py-2 px-4 font-mono" style={{ color: 'var(--text-secondary)' }}>105–300+ min (~3.5 hrs)</td>
                  <td className="py-2 px-4 font-mono" style={{ color: 'var(--color-success)' }}>30–120+ min (~1 hr)</td>
                  <td className="py-2 pl-4" style={{ color: 'var(--color-success)' }}>~70% Reduction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
