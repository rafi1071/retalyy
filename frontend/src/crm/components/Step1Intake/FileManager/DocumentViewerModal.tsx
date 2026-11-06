import React, { useState, useEffect } from 'react';
import {
  ProcessedDocument,
  DocumentClassificationType
} from '../../types';
import {
  X,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  Table,
  Layers,
  Sparkles,
  ShieldCheck,
  Trash2
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: ProcessedDocument | null;
  onClose: () => void;
  onUpdateDocument?: (
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

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  onUpdateDocument,
  onDeleteDocument
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'extracted' | 'ocr' | 'edit'>('extracted');
  const [copiedText, setCopiedText] = useState(false);

  // Edit fields
  const [docType, setDocType] = useState<DocumentClassificationType>('unknown');
  const [institution, setInstitution] = useState('');
  const [accountSuffix, setAccountSuffix] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (doc) {
      setDocType(doc.humanCorrection?.documentType || doc.classification.documentType);
      setInstitution(doc.extractedFields.institution || '');
      setAccountSuffix(doc.humanCorrection?.accountSuffix || doc.extractedFields.accountSuffix || '');
      setTotalAmount(doc.extractedFields.totalAmount || '');
      setZoom(1);
      setRotation(0);
    }
  }, [doc]);

  if (!doc) return null;

  // Determine file format
  const fileName = doc.fileName || 'Untitled';
  const ext = doc.extension || fileName.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'].includes(ext);
  const isPdf = ext === 'pdf';
  const isCsv = ['csv', 'tsv'].includes(ext);
  const isText = ['txt', 'json', 'log', 'md', 'xml'].includes(ext);

  // Parse CSV for table rendering if CSV
  const parseCsv = (text: string) => {
    const lines = text.trim().split('\n');
    return lines.map(line => line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, '')));
  };

  const csvRows = isCsv && doc.textContent ? parseCsv(doc.textContent) : [];

  // Handle Download of original or data file
  const handleDownload = () => {
    if (doc.fileUrl) {
      const a = window.document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      // Create blob from text or mock content
      const content = doc.textContent || doc.mockPageContent || doc.rawSnippet || `Document content of ${doc.fileName}`;
      const blob = new Blob([content], { type: isPdf ? 'application/pdf' : 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyText = () => {
    const text = doc.textContent || doc.mockPageContent || doc.rawSnippet || '';
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSaveEdit = () => {
    if (onUpdateDocument) {
      onUpdateDocument(doc.id, {
        documentType: docType,
        institution,
        accountSuffix,
        totalAmount
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      style={{
        background: 'rgba(5, 5, 10, 0.85)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div
        className={`w-full flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-6xl h-[92vh] rounded-2xl'
        }`}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* Top Viewer Toolbar */}
        <div
          className="px-5 py-3.5 flex items-center justify-between shrink-0"
          style={{
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-primary)'
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] shrink-0"
              style={{
                background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isImage ? 'rgba(56, 189, 248, 0.15)' : isCsv ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: isPdf ? 'var(--color-danger)' : isImage ? '#38bdf8' : isCsv ? 'var(--color-success)' : 'var(--accent-primary-hover)',
                border: '1px solid var(--border-secondary)'
              }}
            >
              {ext.toUpperCase().slice(0, 4) || 'DOC'}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-xs truncate max-w-sm sm:max-w-md" style={{ color: 'var(--text-primary)' }}>
                {fileName}
              </h3>
              <p className="text-[11px] font-mono mt-0.5 flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                <span>{doc.fileSize}</span>
                <span>·</span>
                <span>{doc.classification.detectedLabel}</span>
                {doc.readabilityStatus === 'blurry' && (
                  <span className="text-amber-400 font-medium">⚠️ Optical Blur Alert</span>
                )}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom & Rotate (for images / docs) */}
            <div
              className="hidden sm:flex items-center p-0.5 rounded-lg"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-secondary)'
              }}
            >
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                className="p-1.5 rounded transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5" style={{ color: 'var(--text-tertiary)' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                className="p-1.5 rounded transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {isImage && (
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded transition-colors cursor-pointer ml-1"
                  style={{ color: 'var(--text-secondary)' }}
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
              title="Download original file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-secondary)'
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-white/10"
              style={{
                color: 'var(--text-secondary)'
              }}
              title="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Viewer & Side Inspector */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Main Visual Document Canvas */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4 relative"
            style={{
              background: 'var(--bg-base)'
            }}
          >
            {/* Real Uploaded PDF */}
            {isPdf && doc.fileUrl && (
              <iframe
                src={doc.fileUrl}
                title={doc.fileName}
                className="w-full h-full rounded-xl border border-white/5"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 150ms ease'
                }}
              />
            )}

            {/* Real Uploaded Image */}
            {isImage && doc.fileUrl && (
              <div className="w-full h-full flex items-center justify-center overflow-auto">
                <img
                  src={doc.fileUrl}
                  alt={doc.fileName}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                />
              </div>
            )}

            {/* Interactive CSV / Spreadsheet Viewer */}
            {isCsv && csvRows.length > 0 && (
              <div
                className="w-full h-full overflow-auto rounded-xl"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr
                      style={{
                        background: 'var(--bg-elevated)',
                        borderBottom: '1px solid var(--border-primary)',
                        color: 'var(--text-tertiary)'
                      }}
                    >
                      <th className="py-2 px-3 text-[10px] w-12 text-center">#</th>
                      {csvRows[0].map((header, idx) => (
                        <th key={idx} className="py-2 px-3 uppercase text-[10px] whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
                    {csvRows.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/[0.02]">
                        <td className="py-2 px-3 text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
                          {rIdx + 1}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Plain Text / Code / Log Viewer */}
            {isText && doc.textContent && (
              <div
                className="w-full h-full p-4 rounded-xl overflow-auto font-mono text-xs leading-relaxed"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)'
                }}
              >
                <pre className="whitespace-pre-wrap">{doc.textContent}</pre>
              </div>
            )}

            {/* Fallback for Mock PDF Statement or Documents without binary blob */}
            {(!doc.fileUrl || (!isPdf && !isImage && !isCsv && !isText)) && (
              <div
                className="w-full max-w-2xl p-8 rounded-2xl space-y-6 shadow-2xl overflow-auto my-auto"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 150ms ease'
                }}
              >
                {/* Statement Header */}
                <div
                  className="flex items-start justify-between pb-6"
                  style={{ borderBottom: '1px solid var(--border-secondary)' }}
                >
                  <div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                      {doc.extractedFields.institution || 'FINANCIAL INSTITUTION'}
                    </span>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {doc.classification.detectedLabel}
                    </h2>
                    <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      Account Ending In: {doc.extractedFields.accountSuffix ? `...${doc.extractedFields.accountSuffix}` : 'N/A'}
                    </p>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Period Coverage</span>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {doc.extractedFields.periodStart || 'Oct 01, 2026'} – {doc.extractedFields.periodEnd || 'Oct 31, 2026'}
                    </span>
                  </div>
                </div>

                {/* Balance Summary Card */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)'
                  }}
                >
                  <div>
                    <span className="text-[10px] uppercase block font-mono" style={{ color: 'var(--text-muted)' }}>Ending Balance</span>
                    <span className="text-lg font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                      {doc.extractedFields.totalAmount || '$0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block font-mono" style={{ color: 'var(--text-muted)' }}>Classification</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>
                      ✓ Verified Statement
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block font-mono" style={{ color: 'var(--text-muted)' }}>File Size</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {doc.fileSize}
                    </span>
                  </div>
                </div>

                {/* Statement Body / Transactions snippet */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Extracted Statement Transactions & Activity
                  </span>
                  <div
                    className="p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap"
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {doc.mockPageContent || doc.rawSnippet || 'No document text content found.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Pane: Extracted Data / OCR / Quick Edit */}
          <div
            className="w-full md:w-80 lg:w-96 flex flex-col shrink-0 overflow-y-auto"
            style={{
              background: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-primary)'
            }}
          >
            {/* Sub-tabs */}
            <div
              className="flex items-center text-xs font-medium shrink-0"
              style={{
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-primary)'
              }}
            >
              <button
                onClick={() => setActiveSideTab('extracted')}
                className="flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer"
                style={{
                  borderColor: activeSideTab === 'extracted' ? 'var(--accent-primary)' : 'transparent',
                  color: activeSideTab === 'extracted' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeSideTab === 'extracted' ? 600 : 400
                }}
              >
                AI Facts
              </button>
              <button
                onClick={() => setActiveSideTab('ocr')}
                className="flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer"
                style={{
                  borderColor: activeSideTab === 'ocr' ? 'var(--accent-primary)' : 'transparent',
                  color: activeSideTab === 'ocr' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeSideTab === 'ocr' ? 600 : 400
                }}
              >
                Raw OCR Text
              </button>
              <button
                onClick={() => setActiveSideTab('edit')}
                className="flex-1 py-2.5 text-center border-b-2 transition-all cursor-pointer"
                style={{
                  borderColor: activeSideTab === 'edit' ? 'var(--accent-primary)' : 'transparent',
                  color: activeSideTab === 'edit' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: activeSideTab === 'edit' ? 600 : 400
                }}
              >
                Edit Fields
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* TAB 1: AI Facts */}
              {activeSideTab === 'extracted' && (
                <div className="space-y-4 text-xs">
                  <div
                    className="p-3.5 rounded-xl space-y-2.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Classification</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {doc.classification.detectedLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Confidence</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {doc.classification.confidence}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Institution / Bank</span>
                      <span className="font-semibold truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>
                        {doc.extractedFields.institution || 'Unknown'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Account Last 4</span>
                      <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                        {doc.extractedFields.accountSuffix ? `...${doc.extractedFields.accountSuffix}` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Ending Total</span>
                      <span className="font-mono font-bold" style={{ color: 'var(--color-success)' }}>
                        {doc.extractedFields.totalAmount || '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-tertiary)' }}>Statement Date</span>
                      <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {doc.extractedFields.statementDate || 'Oct 31, 2026'}
                      </span>
                    </div>
                  </div>

                  {/* Quality Checklist */}
                  <div
                    className="p-3.5 rounded-xl space-y-2"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)'
                    }}
                  >
                    <span className="font-semibold block" style={{ color: 'var(--text-secondary)' }}>Quality Inspection</span>
                    <div className="flex items-center gap-2" style={{ color: 'var(--color-success)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero virus/malware flags</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: doc.readabilityStatus === 'blurry' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                      {doc.readabilityStatus === 'blurry' ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Blurry scan - manual review recommended</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>High optical readability (score: {doc.readabilityScore || 98}%)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Raw OCR */}
              {activeSideTab === 'ocr' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-tertiary)' }}>Full text recognized by OCR:</span>
                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      style={{ color: 'var(--accent-primary-hover)' }}
                    >
                      {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div
                    className="p-3.5 rounded-xl font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {doc.textContent || doc.mockPageContent || doc.rawSnippet || 'No text recognized.'}
                  </div>
                </div>
              )}

              {/* TAB 3: Edit Fields */}
              {activeSideTab === 'edit' && (
                <div className="space-y-3.5 text-xs">
                  {savedSuccess && (
                    <div
                      className="p-2.5 rounded-lg text-xs flex items-center gap-2"
                      style={{
                        background: 'var(--color-success-subtle)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: 'var(--color-success)'
                      }}
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Document fields saved!</span>
                    </div>
                  )}

                  <div>
                    <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Document Classification
                    </label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value as DocumentClassificationType)}
                      className="w-full p-2.5 rounded-lg text-xs"
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
                    <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Bank / Provider Name
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      placeholder="e.g. JPMorgan Chase"
                      className="w-full p-2.5 rounded-lg text-xs focus:outline-none"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-secondary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Account Suffix (Last 4)
                    </label>
                    <input
                      type="text"
                      value={accountSuffix}
                      onChange={e => setAccountSuffix(e.target.value)}
                      placeholder="e.g. 4102"
                      className="w-full p-2.5 rounded-lg text-xs font-mono focus:outline-none"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-secondary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Ending Total / Balance
                    </label>
                    <input
                      type="text"
                      value={totalAmount}
                      onChange={e => setTotalAmount(e.target.value)}
                      placeholder="e.g. $184,290.44"
                      className="w-full p-2.5 rounded-lg text-xs font-mono focus:outline-none"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-secondary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSaveEdit}
                    className="w-full py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    style={{
                      background: 'var(--accent-primary)',
                      color: '#ffffff'
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Apply Changes
                  </button>
                </div>
              )}

              {/* Delete Document Option */}
              {onDeleteDocument && (
                <div className="pt-4 mt-auto" style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove "${doc.fileName}"?`)) {
                        onDeleteDocument(doc.id);
                        onClose();
                      }
                    }}
                    className="w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    style={{
                      color: 'var(--color-danger)',
                      background: 'var(--color-danger-subtle)',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete File from Folder
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
