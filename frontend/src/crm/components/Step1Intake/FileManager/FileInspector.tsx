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
  Download,
  Trash2,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  ExternalLink
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
  onViewDocument?: (doc: ProcessedDocument) => void;
}

export const FileInspector: React.FC<FileInspectorProps> = ({
  document,
  onClose,
  onUpdateDocument,
  onDeleteDocument,
  onViewDocument
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

  const handleDownload = () => {
    if (document.fileUrl) {
      const a = window.document.createElement('a');
      a.href = document.fileUrl;
      a.download = document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      const content = document.textContent || document.mockPageContent || document.rawSnippet || `Document content for ${document.fileName}`;
      const blob = new Blob([content], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const ext = document.extension || document.fileName.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext);
  const isPdf = ext === 'pdf';
  const isCsv = ['csv', 'tsv', 'xlsx'].includes(ext);

  const isBlurry = document.readabilityStatus === 'blurry';
  const isDuplicate = document.fileName.toLowerCase().includes('duplicate') || document.fileName.toLowerCase().includes('resend');

  return (
    <div
      className="w-80 md:w-96 flex flex-col h-full shrink-0 overflow-y-auto"
      style={{
        background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-xl)'
      }}
    >
      {/* Top Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>File Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md transition-all cursor-pointer"
          style={{ color: 'var(--text-tertiary)' }}
          title="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* File Preview Card */}
        <div
          className="p-3.5 rounded-xl space-y-3"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <div className="flex items-start gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-[10px]"
              style={{
                background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isImage ? 'rgba(56, 189, 248, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: isPdf ? 'var(--color-danger)' : isImage ? '#38bdf8' : 'var(--accent-primary-hover)',
                border: '1px solid var(--border-secondary)'
              }}
            >
              {ext.toUpperCase().slice(0, 4) || 'FILE'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-xs truncate" title={document.fileName} style={{ color: 'var(--text-primary)' }}>
                {document.fileName}
              </h4>
              <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {document.fileSize} · {document.fileType.split('/')[1]?.toUpperCase() || ext.toUpperCase() || 'DOCUMENT'}
              </p>
            </div>
          </div>

          {/* Quick Actions Bar (View in Fullscreen & Download) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onViewDocument && (
              <button
                onClick={() => onViewDocument(document)}
                className="py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff'
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View File</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-secondary)'
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          {/* Live Thumbnail / Visual Preview */}
          {isImage && document.fileUrl && (
            <div className="rounded-lg overflow-hidden border border-white/5 max-h-36 flex items-center justify-center bg-black/40">
              <img
                src={document.fileUrl}
                alt={document.fileName}
                className="max-h-36 max-w-full object-contain cursor-pointer"
                onClick={() => onViewDocument && onViewDocument(document)}
              />
            </div>
          )}

          {/* Status badge */}
          <div className="pt-2" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            {isBlurry ? (
              <div
                className="flex items-center gap-2 text-xs p-2.5 rounded-lg"
                style={{
                  background: 'var(--color-warning-subtle)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--color-warning)'
                }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Blurry scan: numbers may need a manual double check.</span>
              </div>
            ) : isDuplicate ? (
              <div
                className="flex items-center gap-2 text-xs p-2.5 rounded-lg"
                style={{
                  background: 'var(--color-warning-subtle)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--color-warning)'
                }}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Notice: This looks like a duplicate file already uploaded.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-success)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Clean & verified document</span>
              </div>
            )}
          </div>
        </div>

        {/* Saved Toast */}
        {showSavedNotification && (
          <div
            className="p-2.5 text-xs rounded-lg flex items-center gap-2"
            style={{
              background: 'var(--color-success-subtle)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: 'var(--color-success)'
            }}
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Details updated successfully!</span>
          </div>
        )}

        {/* Extracted Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Extracted Information
            </h5>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              style={{ color: 'var(--accent-primary-hover)' }}
            >
              <Edit2 className="w-3 h-3" />
              {isEditing ? 'Cancel' : 'Edit details'}
            </button>
          </div>

          {isEditing ? (
            /* Edit Form */
            <div
              className="space-y-3 text-xs p-3.5 rounded-xl"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div>
                <label className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentClassificationType)}
                  className="w-full p-2 rounded-lg text-xs"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
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
                <label className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Bank or Provider Name
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Chase Bank, American Express"
                  className="w-full p-2 rounded-lg text-xs focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Account Number (Last 4 digits)
                </label>
                <input
                  type="text"
                  value={accountSuffix}
                  onChange={(e) => setAccountSuffix(e.target.value)}
                  placeholder="e.g. 4102"
                  className="w-full p-2 rounded-lg text-xs font-mono focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Ending Balance or Total Amount
                </label>
                <input
                  type="text"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g. $184,290.44"
                  className="w-full p-2 rounded-lg text-xs font-mono focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          ) : (
            /* Read-only details */
            <div className="space-y-2 text-xs">
              <div
                className="p-2.5 rounded-lg flex items-center justify-between"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Document Type</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {document.classification.detectedLabel}
                </span>
              </div>

              <div
                className="p-2.5 rounded-lg flex items-center justify-between"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Bank / Provider</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {document.extractedFields.institution || 'Not detected'}
                </span>
              </div>

              <div
                className="p-2.5 rounded-lg flex items-center justify-between"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Account (Last 4)</span>
                <span className="font-semibold font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {document.extractedFields.accountSuffix ? `...${document.extractedFields.accountSuffix}` : 'N/A'}
                </span>
              </div>

              <div
                className="p-2.5 rounded-lg flex items-center justify-between"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Statement Dates</span>
                <span className="font-semibold font-mono text-[11px] tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {document.extractedFields.periodStart || 'Oct 01'} – {document.extractedFields.periodEnd || 'Oct 31, 2026'}
                </span>
              </div>

              <div
                className="p-2.5 rounded-lg flex items-center justify-between"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Total / Ending Balance</span>
                <span className="font-bold font-mono tabular-nums text-xs" style={{ color: 'var(--color-success)' }}>
                  {document.extractedFields.totalAmount || 'Not detected'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text Preview / Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Document Text Preview
            </h5>
            {onViewDocument && (
              <button
                onClick={() => onViewDocument(document)}
                className="text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                style={{ color: 'var(--accent-primary-hover)' }}
              >
                <span>Full Viewer</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <div
            className="p-3 rounded-xl font-mono text-[11px] leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap"
            style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)'
            }}
          >
            {document.textContent || document.mockPageContent || document.rawSnippet || 'No preview text available for this file.'}
          </div>
        </div>

        {/* Actions */}
        {onDeleteDocument && (
          <div className="pt-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove "${document.fileName}"?`)) {
                  onDeleteDocument(document.id);
                  onClose();
                }
              }}
              className="w-full py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              style={{
                color: 'var(--color-danger)',
                background: 'var(--color-danger-subtle)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
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
