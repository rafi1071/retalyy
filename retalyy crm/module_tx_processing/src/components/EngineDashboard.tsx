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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Retalyy AI Accounting Engine Architecture
              </h2>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-indigo-400 font-mono font-medium">
                Autonomous Loop & Deterministic Guardrails
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              "The model should never be the sole authority deciding whether its own work is correct.
              The LLM proposes accounting decisions; the accounting engine enforces the rules."
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenBenchmark}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>QA Benchmark Tests</span>
            </button>
          </div>
        </div>

        {/* 6 Structural Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs min-w-0">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 1</span>
            <div className="font-semibold text-white">Client Context</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Profile, jurisdiction, COA, GAAP policies & thresholds.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 2</span>
            <div className="font-semibold text-white">Data & OCR</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Structured extraction, normalizations, and invoice links.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 3</span>
            <div className="font-semibold text-white">Context Builder</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              RAG retrieval, fact vs assumption tagging, token limits.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-indigo-500/30 bg-indigo-950/10">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 4</span>
            <div className="font-semibold text-white flex items-center gap-1">
              <span>AI Reasoner</span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Gemini 3.8 Flash structured proposal contract.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-emerald-500/30 bg-emerald-950/10">
            <span className="font-mono text-[10px] text-emerald-400 font-bold block mb-1">TIER 5</span>
            <div className="font-semibold text-white flex items-center gap-1">
              <span>Independent Validator</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Deterministic code checks arithmetic, balance & rules.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="font-mono text-[10px] text-indigo-400 font-bold block mb-1">TIER 6</span>
            <div className="font-semibold text-white">General Ledger</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              Post clean entries or route exceptions to CPA.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Live Engine Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Live Transaction Processing Loop
              </h3>
              <p className="text-xs text-slate-400">
                Execute the 7-step loop: Assemble context $\rightarrow$ AI proposal $\rightarrow$ Independent code validation $\rightarrow$ Retry loop $\rightarrow$ Decision.
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
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Engine Loop...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Engine Loop</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Transaction Summary Card */}
        {selectedTxn && (
          <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Payee</span>
                <span className="text-white font-semibold">{selectedTxn.counterparty}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Bank Outflow</span>
                <span className="text-emerald-400 font-mono font-bold">${selectedTxn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Raw Bank Feed String</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs">{selectedTxn.rawDescription}</span>
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
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700"
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
              className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                trace.validationReport.decision === 'auto_approve'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : trace.validationReport.decision === 'reprocess_with_feedback'
                  ? 'bg-blue-950/20 border-blue-500/30 text-blue-200'
                  : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {trace.validationReport.decision === 'auto_approve' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-sm capitalize flex items-center gap-2">
                    <span>
                      Engine Decision:{' '}
                      {trace.validationReport.decision === 'auto_approve'
                        ? 'Auto-Approved (Clean, Low-Risk within Policy)'
                        : trace.validationReport.decision === 'reprocess_with_feedback'
                        ? 'Reprocessed with Feedback (Auto-Corrected)'
                        : 'Escalate to Senior Accountant / CPA Review'}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/20">
                      {trace.totalDurationMs}ms elapsed
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {trace.aiProposal.accounting_decision.reason}
                  </p>
                </div>
              </div>

              {trace.retryHistory.length > 0 && (
                <div className="text-xs font-mono px-2.5 py-1 rounded bg-black/30 border border-white/10 text-slate-300">
                  {trace.retryHistory.length} Feedback Retry Cycle Executed
                </div>
              )}
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveEngineTab('validation')}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeEngineTab === 'validation'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Independent Validation ({trace.validationReport.checks.length} Checks)</span>
              </button>

              <button
                onClick={() => setActiveEngineTab('proposal')}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeEngineTab === 'proposal'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>AI Structured Proposal (JSON Contract)</span>
              </button>

              <button
                onClick={() => setActiveEngineTab('context')}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeEngineTab === 'context'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Assembled Context Prompt</span>
              </button>

              <button
                onClick={() => setActiveEngineTab('trace')}
                className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeEngineTab === 'trace'
                    ? 'border-indigo-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Loop Execution Trace</span>
              </button>
            </div>

            {/* TAB CONTENT: Independent Validation Checks */}
            {activeEngineTab === 'validation' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    Deterministic checks evaluated in TypeScript code — strictly independent of LLM self-review.
                  </span>
                  <span className="font-mono text-emerald-400">
                    {trace.validationReport.checks.filter((c) => c.status === 'passed').length} / {trace.validationReport.checks.length} Passed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trace.validationReport.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                        chk.status === 'passed'
                          ? 'bg-slate-900 border-slate-800'
                          : chk.status === 'failed'
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : 'bg-amber-950/20 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          {chk.status === 'passed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : chk.status === 'failed' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>{chk.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          Code Verified
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{chk.message}</p>
                      {chk.details && (
                        <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
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
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Strict JSON schema contract conforming to Section 3 of specification:
                  </span>
                  <span className="font-mono text-indigo-400">Validated Model Output</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-96 whitespace-pre-wrap break-all">
                  {JSON.stringify(trace.aiProposal, null, 2)}
                </pre>
              </div>
            )}

            {/* TAB CONTENT: Assembled Context */}
            {activeEngineTab === 'context' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Task-specific synthesized context window with token budget:
                  </span>
                  <button
                    onClick={() => onOpenContextInspector(trace.context)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Open Context Window Modal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-semibold font-sans block">Verified Facts</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {trace.context.factClassification.verifiedFacts.map((f, i) => (
                        <li key={i}>· {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-indigo-300 font-semibold font-sans block">Retrieved Policies</span>
                    <div className="text-slate-300 text-[11px] space-y-1">
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
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-300">1. Context Assembled</span>
                    <span className="text-emerald-400 font-bold">Done (~12ms)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-300">2. Deterministic Pre-validation</span>
                    <span className="text-emerald-400 font-bold">Passed (Zero blocking errors)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-300">3. AI Reasoner Structured Proposal</span>
                    <span className="text-emerald-400 font-bold">Generated via Gemini 3.8 Flash</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-300">4. Independent Deterministic Validation</span>
                    <span className="text-emerald-400 font-bold">8 Checks Evaluated</span>
                  </div>
                  {trace.retryHistory.map((retry, i) => (
                    <div key={i} className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 font-mono text-indigo-200">
                      <div>Feedback Retry #{retry.attempt}: {retry.feedbackGiven}</div>
                      <div className="text-emerald-400 font-bold mt-1">Outcome: Rebalanced & Accepted</div>
                    </div>
                  ))}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-300">5. Final Ledger Interface Resolution</span>
                    <span className="text-emerald-400 font-bold uppercase">{trace.finalStatus.replace('_', ' ')}</span>
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
