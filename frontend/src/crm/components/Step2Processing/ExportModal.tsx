import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, FileSpreadsheet } from 'lucide-react';
import { TransactionRecord, ClientProfile } from '../types/accounting';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionRecord[];
  client: ClientProfile;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  client,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'json' | 'csv'>('json');

  // Format data exactly per prompt specification Section 5
  const formattedOutput = transactions.map((t) => ({
    transactionId: t.id,
    clientId: t.clientId,
    transactionDate: t.transactionDate,
    accountingPeriod: t.accountingPeriod,
    description: t.normalizedDescription,
    counterparty: t.counterparty,
    amount: t.direction === 'inflow' ? t.amount : -t.amount,
    currency: t.currency,
    fxConversion: t.fxRate ? { rate: t.fxRate, baseAmountUSD: t.baseAmount } : 'USD (Base)',
    sourceDocumentReference: t.sourceDocument?.filename || 'UNMATCHED_FEED',
    matchedInvoiceReference: t.matching.matchedInvoiceNumber || 'N/A',
    proposedAccountCode: t.accountCode,
    proposedAccountName: t.accountName,
    accountCategory: t.accountCategory,
    proposedTreatment: t.treatmentType,
    policyCitation: t.policyCitation,
    debitCreditJournalLines: t.journalLines.map((jl) => ({
      accountNumber: jl.accountNumber,
      accountName: jl.accountName,
      type: jl.type,
      amount: jl.amount,
      memo: jl.memo
    })),
    taxCode: t.taxCode,
    taxTreatment: t.taxTreatment,
    taxDeductiblePercentage: t.taxDeductiblePercentage,
    confidenceScore: t.matching.confidence,
    validationFlags: t.validationFlags.map((f) => ({ code: f.code, severity: f.severity, message: f.message })),
    processingStatus: t.status,
    reviewerIdentity: t.reviewedBy || 'Autonomous Rule Engine',
    approvalHistory: t.approvalHistory
  }));

  const jsonString = JSON.stringify(formattedOutput, null, 2);

  // CSV generation
  const generateCSV = () => {
    const headers = [
      'Transaction ID',
      'Client ID',
      'Date',
      'Period',
      'Counterparty',
      'Amount',
      'Currency',
      'Source Doc Ref',
      'Matched Invoice',
      'Account Code',
      'Account Name',
      'Treatment',
      'Tax Code',
      'Tax Deductible %',
      'Status',
      'Reviewer'
    ];
    const rows = formattedOutput.map((t) => [
      t.transactionId,
      t.clientId,
      t.transactionDate,
      t.accountingPeriod,
      `"${t.counterparty}"`,
      t.amount,
      t.currency,
      `"${t.sourceDocumentReference}"`,
      `"${t.matchedInvoiceReference}"`,
      t.proposedAccountCode,
      `"${t.proposedAccountName}"`,
      t.proposedTreatment,
      t.taxCode,
      `${t.taxDeductiblePercentage}%`,
      t.processingStatus,
      `"${t.reviewerIdentity}"`
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(format === 'json' ? jsonString : generateCSV());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = format === 'json' ? jsonString : generateCSV();
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const ext = format === 'json' ? 'json' : 'csv';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Retalyy_Step2_Transactions_${client.id}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                Step 2 Final Structured Output
              </h2>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-indigo-400 font-mono">
                {transactions.length} Records Formatted
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured ledger schema conforming to Retalyy Step 2 specifications ready for Step 3 reconciliation.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                format === 'json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Schema</span>
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                format === 'csv'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV Spreadsheet</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap break-all leading-relaxed">
            {format === 'json' ? jsonString : generateCSV()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 text-xs text-slate-400 flex items-center justify-between">
          <span>Client: <strong className="text-white">{client.name}</strong></span>
          <span>Next Pipeline Stage: <strong className="text-indigo-400">Step 3: Bank Reconciliation & Review</strong></span>
        </div>
      </div>
    </div>
  );
};
