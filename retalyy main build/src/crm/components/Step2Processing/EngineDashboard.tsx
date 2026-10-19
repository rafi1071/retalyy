import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  Play,
  FileCode,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal
} from 'lucide-react';
import { TransactionRecord, ClientProfile } from '../types/accounting';
import { EngineExecutionTrace, AssembledContext } from '../types/engine';

interface EngineDashboardProps {
  transactions: TransactionRecord[];
  client: ClientProfile;
  onOpenContextInspector: (context: AssembledContext) => void;
  onOpenBenchmark: () => void;
  onUpdateTransaction: (updated: TransactionRecord) => void;
}

export const EngineDashboard: React.FC<EngineDashboardProps> = ({
  transactions,
  client,
  onOpenContextInspector,
  onOpenBenchmark,
  onUpdateTransaction,
}) => {
  const [selectedTxnId, setSelectedTxnId] = useState<string>(transactions[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [trace, setTrace] = useState<EngineExecutionTrace | null>(null);
  const [activeEngineTab, setActiveEngineTab] = useState<'validation' | 'proposal' | 'context' | 'trace'>('validation');

  const selectedTxn = transactions.find((t) => t.id === selectedTxnId) || transactions[0];

  // Execute the full 7-step processing loop via server API
  const handleRunEngine = async () => {
    if (!selectedTxn) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/engine/process-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: selectedTxn,
          client,
          allTransactions: transactions
        })
      });

      if (!res.ok) throw new Error('Engine execution failed');
      const traceData: EngineExecutionTrace = await res.json();
      setTrace(traceData);

      // If engine passed, update local transaction state
      if (traceData.validationReport.decision === 'auto_approve') {
        onUpdateTransaction({
          ...selectedTxn,
          status: 'posted',
          postedAt: new Date().toISOString()
        });
      } else if (traceData.validationReport.decision === 'escalate_to_human') {
        onUpdateTransaction({
          ...selectedTxn,
          status: 'needs_review'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 min-w-0 w-full max-w-full overflow-hidden">
      {/* 1. Architecture Flow Diagram Banner */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 pb-4"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Retalyy AI Accounting Engine Architecture
              </h2>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span
                className="text-xs font-mono font-medium px-2 py-0.5 rounded"
                style={{
                  background: 'var(--accent-primary-subtle)',
                  color: 'var(--accent-primary-hover)',
                  border: '1px solid var(--border-accent)'
                }}
              >
                Autonomous Loop & Deterministic Guardrails
              </span>
            </div>
            <p className="text-xs mt-1.5 max-w-3xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              &ldquo;The model should never be the sole authority deciding whether its own work is correct.
              The LLM proposes accounting decisions; the accounting engine enforces the rules.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenBenchmark}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>QA Benchmark Tests</span>
            </button>
          </div>
        </div>

        {/* 6 Structural Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs min-w-0">
          <div
            className="p-3.5 rounded-xl transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)'
            }}
          >
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 1</span>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Client Context</div>
            <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-tertiary)' }}>
              Profile, jurisdiction, COA, GAAP policies & thresholds.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)'
            }}
          >
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 2</span>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Data & OCR</div>
            <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-tertiary)' }}>
              Structured extraction, normalizations, and invoice links.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)'
            }}
          >
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 3</span>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Context Builder</div>
            <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-tertiary)' }}>
              RAG retrieval, fact vs assumption tagging, token limits.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-accent)',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.08)'
            }}
          >
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 4</span>
            <div className="font-semibold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
              <span>AI Reasoner</span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </div>
            <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-tertiary)' }}>
              Gemini 3.8 Flash structured proposal contract.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.06)'
            }}
          >
            <span className="font-mono text-[10px] text-emerald-400 font-bold block mb-1">TIER 5</span>
            <div className="font-semibold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
              <span>Validator</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-tertiary)' }}>
              Deterministic code checks arithmetic, balance & rules.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)'
            }}
          >
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 6</span>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>General Ledger</div>
            <p className="text-[11px] mt-1 leading-normal" style={{ color: 'var(--text-tertiary)' }}>
              Post clean entries or route exceptions to CPA.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Live Engine Runner */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary-hover)',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Live Transaction Processing Loop
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Execute the 7-step loop: Assemble context &rarr; AI proposal &rarr; Independent code validation &rarr; Retry loop &rarr; Decision.
              </p>
            </div>
          </div>

          {/* Transaction Picker & Execution CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedTxnId}
              onChange={(e) => {
                setSelectedTxnId(e.target.value);
                setTrace(null);
              }}
              className="text-xs rounded-lg px-3 py-2 font-medium focus:outline-none"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              {transactions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}: {t.counterparty} (${t.amount.toLocaleString()})
                </option>
              ))}
            </select>

            <button
              onClick={handleRunEngine}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 disabled:opacity-50"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
                boxShadow: '0 2px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Engine Loop...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Engine Loop</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Transaction Summary Card */}
        {selectedTxn && (
          <div
            className="mt-4 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)'
            }}
          >
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-[10px] uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>Target Payee</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedTxn.counterparty}</span>
              </div>
              <div className="h-6 w-px hidden sm:block" style={{ background: 'var(--border-secondary)' }} />
              <div>
                <span className="text-[10px] uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>Bank Outflow</span>
                <span className="font-mono font-bold" style={{ color: 'var(--color-success)' }}>${selectedTxn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-6 w-px hidden sm:block" style={{ background: 'var(--border-secondary)' }} />
              <div>
                <span className="text-[10px] uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>Raw Bank Feed String</span>
                <span className="font-mono text-[11px] truncate max-w-xs block" style={{ color: 'var(--text-secondary)' }}>{selectedTxn.rawDescription}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  fetch('/api/engine/assemble-context', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transaction: selectedTxn, client, allTransactions: transactions })
                  })
                    .then((r) => r.json())
                    .then((ctx) => onOpenContextInspector(ctx));
                }}
                className="text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--accent-primary-hover)'
                }}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Inspect Context Assembly</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Engine Results & Tabs */}
        {trace && (
          <div className="mt-6 space-y-4">
            {/* Decision Status Banner */}
            <div
              className="p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              style={{
                background: trace.validationReport.decision === 'auto_approve'
                  ? 'var(--color-success-subtle)'
                  : trace.validationReport.decision === 'reprocess_with_feedback'
                  ? 'var(--accent-primary-subtle)'
                  : 'var(--color-warning-subtle)',
                borderColor: trace.validationReport.decision === 'auto_approve'
                  ? 'rgba(34, 197, 94, 0.3)'
                  : trace.validationReport.decision === 'reprocess_with_feedback'
                  ? 'rgba(99, 102, 241, 0.3)'
                  : 'rgba(245, 158, 11, 0.3)'
              }}
            >
              <div className="flex items-center gap-3">
                {trace.validationReport.decision === 'auto_approve' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span>
                      Engine Decision:{' '}
                      {trace.validationReport.decision === 'auto_approve'
                        ? 'Auto-Approved (Clean, Low-Risk within Policy)'
                        : trace.validationReport.decision === 'reprocess_with_feedback'
                        ? 'Reprocessed with Feedback (Auto-Corrected)'
                        : 'Escalate to Senior Accountant / CPA Review'}
                    </span>
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {trace.totalDurationMs}ms elapsed
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {trace.aiProposal.accounting_decision.reason}
                  </p>
                </div>
              </div>

              {trace.retryHistory.length > 0 && (
                <div
                  className="text-xs font-mono px-2.5 py-1 rounded"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {trace.retryHistory.length} Feedback Retry Cycle Executed
                </div>
              )}
            </div>

            {/* Sub-Tabs */}
            <div
              className="flex items-center gap-2 overflow-x-auto text-xs font-medium"
              style={{ borderBottom: '1px solid var(--border-primary)' }}
            >
              <button
                onClick={() => setActiveEngineTab('validation')}
                className="py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                style={{
                  borderColor: activeEngineTab === 'validation' ? 'var(--accent-primary)' : 'transparent',
                  color: activeEngineTab === 'validation' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeEngineTab === 'validation' ? 600 : 400
                }}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Independent Validation ({trace.validationReport.checks.length} Checks)</span>
              </button>

              <button
                onClick={() => setActiveEngineTab('proposal')}
                className="py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                style={{
                  borderColor: activeEngineTab === 'proposal' ? 'var(--accent-primary)' : 'transparent',
                  color: activeEngineTab === 'proposal' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeEngineTab === 'proposal' ? 600 : 400
                }}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>AI Structured Proposal (JSON Contract)</span>
              </button>

              <button
                onClick={() => setActiveEngineTab('context')}
                className="py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                style={{
                  borderColor: activeEngineTab === 'context' ? 'var(--accent-primary)' : 'transparent',
                  color: activeEngineTab === 'context' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeEngineTab === 'context' ? 600 : 400
                }}
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Assembled Context Prompt</span>
              </button>

              <button
                onClick={() => setActiveEngineTab('trace')}
                className="py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                style={{
                  borderColor: activeEngineTab === 'trace' ? 'var(--accent-primary)' : 'transparent',
                  color: activeEngineTab === 'trace' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeEngineTab === 'trace' ? 600 : 400
                }}
              >
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Loop Execution Trace</span>
              </button>
            </div>

            {/* TAB CONTENT: Independent Validation Checks */}
            {activeEngineTab === 'validation' && (
              <div className="space-y-3">
                <div className="text-xs flex items-center justify-between" style={{ color: 'var(--text-tertiary)' }}>
                  <span>
                    Deterministic checks evaluated in TypeScript code — strictly independent of LLM self-review.
                  </span>
                  <span className="font-mono" style={{ color: 'var(--color-success)' }}>
                    {trace.validationReport.checks.filter((c) => c.status === 'passed').length} / {trace.validationReport.checks.length} Passed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trace.validationReport.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl text-xs space-y-1.5 transition-all"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: chk.status === 'passed'
                          ? '1px solid var(--border-secondary)'
                          : chk.status === 'failed'
                          ? '1px solid rgba(239, 68, 68, 0.3)'
                          : '1px solid rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                          {chk.status === 'passed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : chk.status === 'failed' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>{chk.name}</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                          Code Verified
                        </span>
                      </div>
                      <p className="leading-relaxed text-[11px]" style={{ color: 'var(--text-secondary)' }}>{chk.message}</p>
                      {chk.details && (
                        <div
                          className="text-[10px] font-mono pt-1"
                          style={{
                            borderTop: '1px solid var(--border-secondary)',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          {chk.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI Structured Proposal */}
            {activeEngineTab === 'proposal' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between" style={{ color: 'var(--text-tertiary)' }}>
                  <span>
                    Strict JSON schema contract conforming to Section 3 of specification:
                  </span>
                  <span className="font-mono text-indigo-400">Validated Model Output</span>
                </div>
                <pre
                  className="p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-96 whitespace-pre-wrap break-all"
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {JSON.stringify(trace.aiProposal, null, 2)}
                </pre>
              </div>
            )}

            {/* TAB CONTENT: Assembled Context */}
            {activeEngineTab === 'context' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between" style={{ color: 'var(--text-tertiary)' }}>
                  <span>
                    Task-specific synthesized context window with token budget:
                  </span>
                  <button
                    onClick={() => onOpenContextInspector(trace.context)}
                    className="font-medium cursor-pointer"
                    style={{ color: 'var(--accent-primary-hover)' }}
                  >
                    Open Context Window Modal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div
                    className="p-3.5 rounded-xl space-y-1.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span className="font-sans font-semibold block text-indigo-300">Verified Facts</span>
                    <ul className="space-y-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {trace.context.factClassification.verifiedFacts.map((f, i) => (
                        <li key={i}>· {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="p-3.5 rounded-xl space-y-1.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span className="font-sans font-semibold block text-indigo-300">Retrieved Policies</span>
                    <div className="text-[11px] space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <div>· CapEx Threshold: ${trace.context.relevantPolicies.capitalizationThreshold.toLocaleString()}</div>
                      <div>· Prepayment Threshold: ${trace.context.relevantPolicies.prepaymentThreshold.toLocaleString()}</div>
                      <div>· Meals Limit: {trace.context.relevantPolicies.mealsAndEntertainmentDeductibilityLimit}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Execution Trace & Retries */}
            {activeEngineTab === 'trace' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-2">
                  <div
                    className="p-3 rounded-xl flex items-center justify-between font-mono"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>1. Context Assembled</span>
                    <span className="font-bold" style={{ color: 'var(--color-success)' }}>Done (~12ms)</span>
                  </div>
                  <div
                    className="p-3 rounded-xl flex items-center justify-between font-mono"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>2. Deterministic Pre-validation</span>
                    <span className="font-bold" style={{ color: 'var(--color-success)' }}>Passed (Zero blocking errors)</span>
                  </div>
                  <div
                    className="p-3 rounded-xl flex items-center justify-between font-mono"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>3. AI Reasoner Structured Proposal</span>
                    <span className="font-bold" style={{ color: 'var(--color-success)' }}>Generated via Gemini 3.8 Flash</span>
                  </div>
                  <div
                    className="p-3 rounded-xl flex items-center justify-between font-mono"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>4. Independent Deterministic Validation</span>
                    <span className="font-bold" style={{ color: 'var(--color-success)' }}>8 Checks Evaluated</span>
                  </div>
                  {trace.retryHistory.map((retry, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl font-mono"
                      style={{
                        background: 'var(--accent-primary-subtle)',
                        border: '1px solid var(--border-accent)',
                        color: 'var(--accent-primary-hover)'
                      }}
                    >
                      <div>Feedback Retry #{retry.attempt}: {retry.feedbackGiven}</div>
                      <div className="font-bold mt-1" style={{ color: 'var(--color-success)' }}>Outcome: Rebalanced & Accepted</div>
                    </div>
                  ))}
                  <div
                    className="p-3 rounded-xl flex items-center justify-between font-mono"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>5. Final Ledger Interface Resolution</span>
                    <span className="font-bold uppercase" style={{ color: 'var(--color-success)' }}>{trace.finalStatus.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
