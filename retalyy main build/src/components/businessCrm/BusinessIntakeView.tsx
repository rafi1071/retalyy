import React, { useState, useRef } from 'react';
import { BusinessDocument, BusinessDocType } from './types';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  FileCheck, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  X,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from './mockData';

interface BusinessIntakeViewProps {
  documents: BusinessDocument[];
  onUploadDocuments: (newDocs: BusinessDocument[]) => void;
  onSelectDocumentForReview?: (doc: BusinessDocument) => void;
  onRunAiBatch: () => void;
}

export const BusinessIntakeView: React.FC<BusinessIntakeViewProps> = ({
  documents,
  onUploadDocuments,
  onRunAiBatch
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<BusinessDocument | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocs: BusinessDocument[] = files.map((f, i) => {
      const lower = f.name.toLowerCase();
      let type: BusinessDocType = 'vendor_bill';
      let vendor = 'Detected Vendor';
      let amount = 350.00;
      let account = '6100';
      let accName = 'Software Subscriptions & Cloud';
      let justification = 'General operational expense under IRC § 162';

      if (lower.includes('bank') || lower.includes('statement') || lower.includes('chase') || lower.includes('mercury')) {
        type = 'bank_statement';
        vendor = 'Mercury Commercial Banking';
        amount = 18450.00;
        account = '1000';
        accName = 'Operating Bank Account';
        justification = 'Monthly checking account statement with cleared disbursements';
      } else if (lower.includes('payroll') || lower.includes('gusto') || lower.includes('adp')) {
        type = 'payroll_report';
        vendor = 'Gusto Payroll Processing';
        amount = 14200.00;
        account = '1050';
        accName = 'Payroll Clearing & Wages';
        justification = 'Gross wages, FICA and state withholding payroll allocation';
      } else if (lower.includes('aws') || lower.includes('cloud') || lower.includes('hosting')) {
        type = 'vendor_bill';
        vendor = 'Amazon Web Services';
        amount = 1840.50;
        account = '6100';
        accName = 'Software Subscriptions & Cloud';
        justification = 'Cloud infrastructure hosting under IRC § 162';
      } else if (lower.includes('receipt') || lower.includes('apple') || lower.includes('hardware')) {
        type = 'receipt';
        vendor = 'Apple Commercial Store';
        amount = 2899.00;
        account = '6700';
        accName = 'Hardware & Office Equipment';
        justification = 'Engineering workstation hardware';
      }

      return {
        id: `doc-${Date.now()}-${i}`,
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
        uploadDate: new Date().toISOString().slice(0, 10),
        type,
        status: 'queued',
        detectedVendor: vendor,
        extractedAmount: amount,
        confidence: 98.4,
        suggestedAccount: account,
        accountName: accName,
        taxDeductible: true,
        justification,
        invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`
      };
    });

    onUploadDocuments(newDocs);
  };

  const handleLoadSampleBatch = () => {
    // Add sample documents that aren't already in the list
    const existingIds = new Set(documents.map(d => d.id));
    const toAdd = SAMPLE_DOCUMENTS.filter(d => !existingIds.has(d.id));
    if (toAdd.length > 0) {
      onUploadDocuments(toAdd);
    } else {
      // Re-create a fresh batch with unique IDs
      const freshBatch = SAMPLE_DOCUMENTS.map((d, i) => ({
        ...d,
        id: `sample-${Date.now()}-${i}`,
        status: 'queued' as const
      }));
      onUploadDocuments(freshBatch);
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesFilter = filterType === 'all' || d.type === filterType || (filterType === 'pending' && d.status === 'queued');
    const matchesQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (d.detectedVendor && d.detectedVendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.accountName && d.accountName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  const queuedCount = documents.filter(d => d.status === 'queued').length;
  const processedCount = documents.filter(d => d.status === 'posted_to_gl' || d.status === 'reconciled').length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Banner & Quick Trigger */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2] mb-2">
            <UploadCloud className="w-3.5 h-3.5 text-[#27B665]" />
            Business Data & Documents Vault
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2B1C] font-display">
            Upload & Ingest Financial Records
          </h2>
          <p className="text-sm text-[#52705F] mt-1 max-w-xl">
            Drop your vendor bills, employee payroll summaries, customer invoices, or monthly bank statements. The autonomous engine extracts line items, applies GAAP policies, and syncs them directly to your live books.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleLoadSampleBatch}
            className="px-4 py-2.5 rounded-full border border-[#D9F0E2] text-[#0C2B1C] bg-[#F8FAF9] hover:bg-[#EDF9F1] text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
            <span>Load 6 Sample Invoices & Feeds</span>
          </button>

          {queuedCount > 0 && (
            <button
              type="button"
              onClick={onRunAiBatch}
              className="ret-btn sm"
            >
              <span>Process {queuedCount} Queued Docs</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#27B665] bg-[#EDF9F1]/60 ring-4 ring-[#27B665]/20'
            : 'border-[#D9F0E2] bg-white hover:border-[#8EDDA6] hover:bg-[#F8FAF9]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => {
            if (e.target.files) handleFiles(Array.from(e.target.files));
          }}
        />
        
        <div className="w-14 h-14 rounded-2xl bg-[#EDF9F1] text-[#27B665] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>
        
        <h3 className="text-base font-bold text-[#0C2B1C]">
          Drop statements, receipts, and invoices here, or <span className="text-[#27B665] underline">browse files</span>
        </h3>
        
        <p className="text-xs text-[#52705F] mt-1.5 max-w-md mx-auto">
          Supports PDF, CSV, Excel, OFX, and image receipts. Auto-extracted by OCR and classified into your Chart of Accounts.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-[#EDF9F1] text-[11px] font-bold text-[#52705F]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Bank & Card Statements
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Vendor Bills & Cloud Subscriptions
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Gusto / ADP Payroll Registers
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Stripe & Merchant Payout Summaries
          </span>
        </div>
      </div>

      {/* Document Vault Controls & Table */}
      <div className="bg-white rounded-3xl border border-[#D9F0E2] shadow-sm overflow-hidden">
        
        {/* Table Filters & Search */}
        <div className="p-4 sm:p-5 border-b border-[#EDF9F1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Files (${documents.length})` },
              { id: 'pending', label: `Queued (${queuedCount})` },
              { id: 'vendor_bill', label: 'Bills & OpEx' },
              { id: 'bank_statement', label: 'Bank Feeds' },
              { id: 'payroll_report', label: 'Payroll' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0C2B1C] text-white shadow-xs'
                    : 'bg-[#F8FAF9] text-[#52705F] hover:bg-[#EDF9F1] hover:text-[#0C2B1C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search vendor, file, account..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-[#D9F0E2] bg-[#F8FAF9] text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EDF9F1] bg-[#F8FAF9] text-[#52705F] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Document / File</th>
                <th className="py-3 px-4">Detected Vendor / Payee</th>
                <th className="py-3 px-4">Extracted Amount</th>
                <th className="py-3 px-4">Target Account</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF9F1]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#52705F]">
                    No documents found matching current filter. Upload or click "Load 6 Sample Invoices".
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-[#F8FAF9] transition-colors group">
                    <td className="py-3.5 px-4 font-medium text-[#0C2B1C]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold truncate max-w-[200px] sm:max-w-[260px]">{doc.name}</div>
                          <div className="text-[10px] text-[#52705F] flex items-center gap-1.5">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.uploadDate}</span>
                            {doc.invoiceNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{doc.invoiceNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0C2B1C]">
                      {doc.detectedVendor || '—'}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#0C2B1C]">
                      {doc.extractedAmount ? `$${doc.extractedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-[#52705F]">
                      <div className="font-bold text-[#0C2B1C]">{doc.accountName}</div>
                      <div className="text-[10px] font-mono text-[#52705F]">Account #{doc.suggestedAccount}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[11px] font-bold font-mono">
                        <Sparkles className="w-3 h-3 text-[#27B665]" />
                        {doc.confidence}%
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {doc.status === 'queued' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                          <Clock className="w-3 h-3" /> Queued
                        </span>
                      )}
                      {doc.status === 'posted_to_gl' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[11px] font-bold border border-[#D9F0E2]">
                          <CheckCircle2 className="w-3 h-3 text-[#27B665]" /> GL Posted
                        </span>
                      )}
                      {doc.status === 'reconciled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                          <ShieldCheck className="w-3 h-3" /> Reconciled
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDoc(doc)}
                        className="px-2.5 py-1 rounded-lg border border-[#D9F0E2] text-[#0C2B1C] hover:bg-[#EDF9F1] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#27B665]" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspector Modal / Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-[#0C2B1C]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#D9F0E2] shadow-2xl space-y-6 relative animate-scale-in">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute right-5 top-5 p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#27B665] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0C2B1C] font-display">
                  {selectedDoc.name}
                </h3>
                <p className="text-xs text-[#52705F]">
                  Uploaded {selectedDoc.uploadDate} • Size: {selectedDoc.size}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#52705F]">Detected Vendor</span>
                <div className="font-bold text-[#0C2B1C] text-sm mt-0.5">{selectedDoc.detectedVendor}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#52705F]">Total Extracted</span>
                <div className="font-bold font-mono text-[#0C2B1C] text-sm mt-0.5">
                  ${selectedDoc.extractedAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#52705F]">Target Account</span>
                <div className="font-bold text-[#0C2B1C] mt-0.5">{selectedDoc.accountName} (#{selectedDoc.suggestedAccount})</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#52705F]">OCR Confidence</span>
                <div className="font-bold text-[#27B665] font-mono mt-0.5">{selectedDoc.confidence}% Match</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] space-y-1">
              <div className="text-xs font-bold text-[#0C2B1C] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#27B665]" />
                Accounting Treatment & Tax Citation
              </div>
              <p className="text-xs text-[#2C4B3B] leading-relaxed">
                {selectedDoc.justification}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-full border border-[#D9F0E2] text-xs font-bold text-[#0C2B1C] hover:bg-neutral-50 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
