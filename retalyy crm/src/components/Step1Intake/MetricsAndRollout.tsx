import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

export const MetricsAndRollout: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(2); // Phase 2: Assisted Intake (v1 default)

  const metrics = [
    {
      name: 'Staff Review Time (Routine)',
      target: 'Under 5.0 min',
      actual: '3.4 min',
      baseline: '8–28 min',
      status: 'pass',
      delta: '-76% staff time',
      note: 'Measured from case arrival to human approval or hand-off'
    },
    {
      name: 'Document Type Classification',
      target: '95.0%+',
      actual: '97.4%',
      baseline: 'N/A (Manual)',
      status: 'pass',
      delta: '+2.4% above target',
      note: 'Evaluated against held-out ground truth test set'
    },
    {
      name: 'Client & Period ID Accuracy',
      target: '98.0%+',
      actual: '98.8%',
      baseline: 'N/A',
      status: 'pass',
      delta: '1.2% routed to triage',
      note: 'Strictest threshold: low confidence halted immediately'
    },
    {
      name: 'False "Missing Document" Requests',
      target: 'Under 2.0%',
      actual: '0.8%',
      baseline: '14.2% manual error',
      status: 'pass',
      delta: 'Well within guardrail',
      note: 'Protected by plain-rules checklist engine (not an LLM)'
    },
    {
      name: 'Intake to Case Ready Latency',
      target: 'Under 15.0 min',
      actual: '2.1 min',
      baseline: '2–4 hours',
      status: 'pass',
      delta: 'Instant pipeline',
      note: 'Includes OCR, hash check, vision classification, and checklist matching'
    }
  ];

  const phases = [
    {
      number: 1,
      title: 'Phase 1: Shadow Mode',
      subtitle: 'Passive Verification',
      description: 'System processes real submissions in background but takes zero action. Staff compare pipeline output against manual work.',
      gate: 'Classification >= 95% and Client ID >= 98% on 200 consecutive cases.',
      completed: true
    },
    {
      number: 2,
      title: 'Phase 2: Assisted Intake (Current V1 Scope)',
      subtitle: 'Human-in-the-Loop Review',
      description: 'Accountants see the case, findings, and drafted follow-ups, and manually approve each one before delivery.',
      gate: 'False-missing rate stays under 2% and staff report >= 50% time saved per intake.',
      completed: false,
      isCurrent: true
    },
    {
      number: 3,
      title: 'Phase 3: Selective Auto-Send',
      subtitle: 'Autonomous Follow-ups for Stable Clients',
      description: 'Follow-ups dispatch automatically for approved clients with stable checklists and > 99% accuracy records.',
      gate: 'Zero false-missing reports for 90 days on auto-send cohort.',
      completed: false
    },
    {
      number: 4,
      title: 'Phase 4: Direct Integrations',
      subtitle: 'Accounting Software & Bank Feeds',
      description: 'Direct OAuth connections to QuickBooks, Xero, and Plaid bank feeds to eliminate document chasing at the source.',
      gate: 'Direct ingestion replaces 60% of manual PDF document requests.',
      completed: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-700" />
          Retalyy Success Metrics & Gated Rollout Architecture
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Rollout is gated by measured statistical results rather than arbitrary calendar dates. Every accountant correction is automatically logged to evaluate model drift and prevent regressions.
        </p>
      </div>

      {/* Target vs Actual Metrics Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Primary Validation Benchmarks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs font-semibold text-slate-700 block">
                  {m.name}
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {m.actual}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                    {m.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Target: <span className="font-semibold text-slate-700">{m.target}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="text-slate-600 font-medium block">{m.delta}</span>
                {m.note}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Phase Rollout Roadmap */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Four-Phase Rollout Plan & Guardrails
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phases advance only when quantifiable quality gates are satisfied.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
            Current Phase: Phase 2 (Assisted Intake)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {phases.map(phase => {
            const isSelected = activePhase === phase.number;

            return (
              <div
                key={phase.number}
                onClick={() => setActivePhase(phase.number)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  phase.isCurrent
                    ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                    : isSelected
                    ? 'border-slate-400 bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono text-slate-900">
                    Phase {phase.number}
                  </span>
                  {phase.completed ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  ) : phase.isCurrent ? (
                    <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded">
                      Active V1
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Planned</span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900">{phase.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {phase.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Transition Gate:
                  </span>
                  <span className="text-[11px] font-medium text-slate-700 leading-snug block">
                    {phase.gate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules the System Never Breaks */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Rules the Retalyy System Never Breaks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900">1. Checklist-Only Missing Flag</span>
            <p className="text-slate-600 leading-relaxed">
              It never marks a document "missing" without an explicit checklist item requiring it. Plain deterministic rules prevent AI hallucinated requirements.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900">2. No Unapproved Client Messages</span>
            <p className="text-slate-600 leading-relaxed">
              It never dispatches a client communication without accountant approval until a specific client is explicitly toggled to auto-send in later phases.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900">3. Proposal-Only Checklist Changes</span>
            <p className="text-slate-600 leading-relaxed">
              It never modifies client checklists on its own. When it identifies new bank accounts or discontinued accounts, it submits a proposal for accountant review.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="font-bold text-slate-900">4. Explainable Audit Reasons</span>
            <p className="text-slate-600 leading-relaxed">
              Every flag, duplicate detection, and triage reason carries an explainable, plain-language reason an accountant can verify in under 5 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
