import React, { useState } from 'react';
import {
  ProcessedDocument,
  DocumentClassificationType
} from '../../types';
import {
  X,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Check,
  Eye,
  Trash2
} from 'lucide-react';

interface FileInspectorProps {
  document: ProcessedDocument | null;
  onClose: () => void;
  onUpdateDocument: (
    docId: string,
    updates: {
      documentType?: DocumentClassificationType;
      institution?: string;
      accountSuffix?: string;
      totalAmount?: string;
    }
  ) => void;
  onDeleteDocument?: (docId: string) => void;
}

export const FileInspector: React.FC<FileInspectorProps> = ({
  document,
  onClose,
  onUpdateDocument,
  onDeleteDocument
}) => {
  if (!document) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [docType, setDocType] = useState<DocumentClassificationType>(
    document.humanCorrection?.documentType || document.classification.documentType
  );
  const [institution, setInstitution] = useState(
    document.extractedFields.institution || ''
  );
  const [accountSuffix, setAccountSuffix] = useState(
    document.humanCorrection?.accountSuffix || document.extractedFields.accountSuffix || ''
  );
  const [totalAmount, setTotalAmount] = useState(
    document.extractedFields.totalAmount || ''
  );
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const handleSave = () => {
    onUpdateDocument(document.id, {
      documentType: docType,
      institution,
      accountSuffix,
      totalAmount
    });
    setIsEditing(false);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2500);
  };

  const isBlurry = document.readabilityStatus === 'blurry';
  const isDuplicate = document.fileName.toLowerCase().includes('duplicate') || document.fileName.toLowerCase().includes('resend');

  return (
    <div className="w-80 md:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg shrink-0 overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-700" />
          <span className="font-bold text-xs text-slate-900">File Details</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          title="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* File Preview Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 font-bold text-xs">
              PDF
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-xs text-slate-900 truncate" title={document.fileName}>
                {document.fileName}
              </h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {document.fileSize} · {document.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="pt-2 border-t border-slate-200/60">
            {isBlurry ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Blurry scan: numbers may need a manual double check.</span>
              </div>
            ) : isDuplicate ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: This looks like a duplicate file already uploaded.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clean & readable file</span>
              </div>
            )}
          </div>
        </div>

        {/* Saved Toast */}
        {showSavedNotification && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Details updated successfully!</span>
          </div>
        )}

        {/* Extracted Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Information on this File
            </h5>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              {isEditing ? 'Cancel' : 'Edit details'}
            </button>
          </div>

          {isEditing ? (
            /* Edit Form */
            <div className="space-y-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentClassificationType)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-900 text-xs"
                >
                  <option value="bank_statement">Bank Statement</option>
                  <option value="card_statement">Credit Card Statement</option>
                  <option value="payroll_report">Payroll Summary</option>
                  <option value="tax_form_941">Quarterly Tax Form (Form 941)</option>
                  <option value="sales_summary">Sales / Invoicing Report</option>
                  <option value="vendor_invoice">Vendor Invoice / Receipt</option>
                  <option value="unknown">Other / Uncategorized</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Bank or Provider Name
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Chase Bank, American Express"
                  className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Account Number (Last 4 digits)
                </label>
                <input
                  type="text"
                  value={accountSuffix}
                  onChange={(e) => setAccountSuffix(e.target.value)}
                  placeholder="e.g. 4102"
                  className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Ending Balance or Total Amount
                </label>
                <input
                  type="text"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g. $184,290.44"
                  className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-900 text-xs font-mono"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2 bg-slate-900 text-white rounded-md font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          ) : (
            /* Read-only details */
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">Document Type</span>
                <span className="font-semibold text-slate-900">
                  {document.classification.detectedLabel}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">Bank / Provider</span>
                <span className="font-semibold text-slate-900">
                  {document.extractedFields.institution || 'Not detected'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">Account (Last 4)</span>
                <span className="font-semibold font-mono text-slate-900 tabular-nums">
                  {document.extractedFields.accountSuffix ? `...${document.extractedFields.accountSuffix}` : 'N/A'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">Statement Dates</span>
                <span className="font-semibold text-slate-900 font-mono text-[11px] tabular-nums">
                  {document.extractedFields.periodStart || 'Oct 01'} – {document.extractedFields.periodEnd || 'Oct 31, 2026'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="text-slate-500">Total / Ending Balance</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums text-xs">
                  {document.extractedFields.totalAmount || 'Not detected'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text Preview / Content */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Document Text Preview
          </h5>
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap selection:bg-slate-700">
            {document.mockPageContent || document.rawSnippet || 'No preview text available for this file.'}
          </div>
        </div>

        {/* Actions */}
        {onDeleteDocument && (
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => onDeleteDocument(document.id)}
              className="w-full py-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove this file from folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
