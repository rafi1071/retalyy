import React, { useState } from 'react';
import { BusinessDocument, AiProcessingEvent } from './types';
import { 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileCheck, 
  FileText, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Clock, 
  AlertTriangle,
  Zap,
  TrendingUp,
  Scale
} from 'lucide-react';

interface BusinessAiPipelineViewProps {
  documents: BusinessDocument[];
  events: AiProcessingEvent[];
  onRunBatch: () => void;
  isProcessing: boolean;
}

export const BusinessAiPipelineView: React.FC<BusinessAiPipelineViewProps> = ({
  documents,
  events,
  onRunBatch,
  isProcessing
}) => {
  const queuedDocs = documents.filter(d => d.status === 'queued');
  const processedDocs = documents.filter(d => d.status === 'posted_to_gl' || d.status === 'reconciled');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Banner & Control */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2] mb-2">
            <Cpu className="w-3.5 h-3.5 text-[#27B665]" />
            Autonomous AI Finance Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2B1C] font-display">
            Autonomous Document Processing & GL Posting
          </h2>
          <p className="text-sm text-[#52705F] mt-1 max-w-xl">
            Watch the AI engine ingest receipts and statements, extract structured line items, execute IRC § 162 and ASC 340 compliance checks, and balance debits and credits on your general ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isProcessing || queuedDocs.length === 0}
            onClick={onRunBatch}
            className={`ret-btn sm ${isProcessing || queuedDocs.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Process {queuedDocs.length} Queued Documents</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4-Stage Pipeline Flow Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            stage: 'Stage 1',
            title: 'OCR & Line Item Extraction',
            icon: FileText,
            detail: 'Extracts vendor, subtotal, tax, date, and items with 99%+ accuracy.',
            status: isProcessing ? 'active' : 'ready'
          },
          {
            stage: 'Stage 2',
            title: 'Policy & Tax Engine',
            icon: ShieldCheck,
            detail: 'Applies ASC 340 prepaids, IRC § 162 deductions & CapEx rules.',
            status: isProcessing ? 'active' : 'ready'
          },
          {
            stage: 'Stage 3',
            title: 'Double-Entry GL Posting',
            icon: Scale,
            detail: 'Generates balanced debits and credits into your live accounts.',
            status: isProcessing ? 'active' : 'ready'
          },
          {
            stage: 'Stage 4',
            title: 'Bank Statement Match',
            icon: CheckCircle2,
            detail: 'Reconciles cleared payments against live commercial bank feeds.',
            status: isProcessing ? 'active' : 'ready'
          }
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                isProcessing
                  ? 'bg-white border-[#27B665] shadow-md ring-2 ring-[#27B665]/20'
                  : 'bg-white border-[#D9F0E2] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52705F]">
                  {s.stage}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#EDF9F1] text-[#27B665] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#0C2B1C]">{s.title}</h4>
              <p className="text-xs text-[#52705F] mt-1.5 leading-relaxed">{s.detail}</p>
              
              <div className="mt-4 pt-3 border-t border-[#EDF9F1] flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#0F7A41]">
                  {isProcessing ? '⚡ Analyzing...' : 'Autonomous'}
                </span>
                <span className="text-neutral-400 font-mono">Real-time</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Queue on Left, Real-Time GL Events on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Pending & Extracted Queue (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDF9F1] pb-3">
            <h3 className="text-base font-bold text-[#0C2B1C] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#27B665]" />
              Document Ingestion Queue
            </h3>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41]">
              {queuedDocs.length} Pending
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {queuedDocs.length === 0 ? (
              <div className="py-12 text-center text-[#52705F]">
                <CheckCircle2 className="w-8 h-8 text-[#27B665] mx-auto mb-2 opacity-80" />
                <div className="text-sm font-bold text-[#0C2B1C]">Queue All Clear</div>
                <p className="text-xs mt-1">All uploaded documents have been classified and posted to the General Ledger.</p>
              </div>
            ) : (
              queuedDocs.map(doc => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl border border-[#D9F0E2] bg-[#F8FAF9] hover:bg-white hover:border-[#8EDDA6] transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs text-[#0C2B1C] truncate">{doc.name}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      Ready to Post
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#52705F]">{doc.detectedVendor}</span>
                    <span className="font-mono font-bold text-[#0C2B1C]">
                      ${doc.extractedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#2C4B3B] bg-[#EDF9F1] p-2 rounded-xl border border-[#C6EDD4] flex items-center justify-between">
                    <span>Target: {doc.accountName} (#{doc.suggestedAccount})</span>
                    <span className="font-bold font-mono text-[#0F7A41]">{doc.confidence}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Live AI Accounting Event Feed & General Ledger Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDF9F1] pb-3">
            <h3 className="text-base font-bold text-[#0C2B1C] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#27B665]" />
              Live Double-Entry Journal Audit Feed
            </h3>
            <span className="text-xs text-[#52705F]">Autonomous Real-Time Ledger</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {events.map(evt => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl border border-[#D9F0E2] bg-[#F8FAF9] space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#27B665]" />
                    <span className="font-bold text-[#0C2B1C]">{evt.vendor}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#52705F]">{evt.timestamp}</span>
                </div>

                {/* Double Entry Debit / Credit visualization */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-white border border-[#D9F0E2] text-[#0C2B1C]">
                    <div className="text-[10px] uppercase font-bold text-[#0F7A41]">Debit (Dr)</div>
                    <div className="font-bold truncate mt-0.5">{evt.drAccount}</div>
                    <div className="text-[#0F7A41] font-bold mt-0.5">
                      +${evt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-[#D9F0E2] text-[#0C2B1C]">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Credit (Cr)</div>
                    <div className="font-bold truncate mt-0.5">{evt.crAccount}</div>
                    <div className="text-neutral-700 font-bold mt-0.5">
                      -${evt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EDF9F1]">
                  <span className="text-[#52705F] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#27B665]" />
                    {evt.ruleCitation}
                  </span>
                  <span className="font-bold text-[#0F7A41] font-mono">
                    Verified {evt.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
