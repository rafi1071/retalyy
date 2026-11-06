import React from 'react';
import { X, Layers, CheckCircle, AlertCircle, Sparkles, BookOpen, Scale, FileText, Cpu } from 'lucide-react';
import { AssembledContext } from '../types/engine';

interface ContextWindowInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: AssembledContext | null;
}

export const ContextWindowInspectorModal: React.FC<ContextWindowInspectorModalProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  if (!isOpen || !context) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  Accounting Context Assembly System
                </h2>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-xs text-indigo-400 font-medium">
                  {context.transactionEvidence.transactionId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dynamic context retrieval: verified facts, relevant policies, and standards with strict token budgeting.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Budget & Entity Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Client Target</span>
              <span className="text-slate-200 font-semibold">{context.clientIdentity.name}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Standard</span>
              <span className="text-indigo-300 font-mono font-medium">{context.accountingConfiguration.accountingBasis}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Jurisdiction</span>
              <span className="text-slate-300">{context.clientIdentity.taxJurisdiction}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px]">Token Budget:</span>
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-slate-200 font-bold tabular-nums">
                ~{context.tokenBudget.estimatedPromptTokens} / {context.tokenBudget.allocatedTokens} tokens
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase ml-1">Optimal</span>
            </div>
          </div>
        </div>

        {/* Scrollable Context Layers */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Layer 1: Epistemological Classification (Facts vs Assumptions) */}
          <div>
            <h3 className="font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>1. Information Provenance & Epistemic Classification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Verified Facts */}
              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                <span className="font-semibold text-emerald-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Deterministic Facts</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {context.factClassification.verifiedFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-400">·</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Working Assumptions */}
              <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                <span className="font-semibold text-amber-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Working Assumptions (Requires Model Scrutiny)</span>
                </span>
                <ul className="space-y-1 text-slate-300">
                  {context.factClassification.workingAssumptions.map((assump, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-amber-400">·</span>
                      <span>{assump}</span>
                    </li>
                  ))}
                  {context.factClassification.workingAssumptions.length === 0 && (
                    <li className="text-slate-400 italic">No ungrounded assumptions active.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Layer 2: Relevant Accounting Policies & Standards Retrieved */}
          <div>
            <h3 className="font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>2. Retrieved Policies & Accounting Standards (RAG Subset)</span>
            </h3>

            <div className="space-y-2">
              {context.applicableStandards.map((std, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-300">{std.standardCode}</span>
                    <span className="text-[11px] text-slate-400">{std.title}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{std.summary}</p>
                  <div className="text-[11px] text-emerald-400 font-mono pt-1">
                    Rule Criteria: {std.ruleCriteria}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 3: Chart of Accounts Focused Subset */}
          <div>
            <h3 className="font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>3. Target Chart of Accounts Subset ({context.accountingConfiguration.relevantAccountsSubset.length} Accounts Filtered)</span>
            </h3>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2 px-3 w-20">Code</th>
                    <th className="py-2 px-3">Account Title</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Description & Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {context.accountingConfiguration.relevantAccountsSubset.map((acc) => (
                    <tr key={acc.code} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 text-indigo-400 font-bold">{acc.code}</td>
                      <td className="py-2 px-3 font-sans text-slate-200">{acc.name}</td>
                      <td className="py-2 px-3 font-sans text-slate-400">{acc.category}</td>
                      <td className="py-2 px-3 font-sans text-slate-400 text-[11px]">{acc.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>Engine: <strong className="text-white">Retalyy Context Composer v2.0</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
