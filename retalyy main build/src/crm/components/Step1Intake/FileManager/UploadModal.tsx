import React, { useState } from 'react';
import { Client, Period, ProcessedDocument, DocumentClassificationType } from '../../types';
import { SAMPLE_TEST_DOCUMENTS } from '../../data/mockData';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  Check,
  Plus
} from 'lucide-react';

interface UploadModalProps {
  client: Client;
  period: Period;
  onClose: () => void;
  isOpen?: boolean;
  onUploadFile?: (fileName: string, fileSize: number, content: string) => void;
  onUploadComplete?: (newDocs: ProcessedDocument[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  client,
  period,
  onClose,
  onUploadFile,
  onUploadComplete
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  // Helper to format bytes
  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return Math.round(bytes / 1024) + ' KB';
  };

  // Process and ingest the files into the submission
  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);

    const createdDocs: ProcessedDocument[] = [];

    for (const file of selectedFiles) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isPdf = ext === 'pdf';
      const isImg = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
      const isSpreadsheet = ['csv', 'tsv', 'xlsx', 'xls'].includes(ext);
      const isTxt = ['txt', 'json', 'log', 'md'].includes(ext);

      // Create Object URL for viewing the actual file
      const fileUrl = URL.createObjectURL(file);

      // Read text content if text/csv
      let textContent = '';
      if (isSpreadsheet || isTxt) {
        try {
          textContent = await file.text();
        } catch {
          textContent = `Content of ${file.name}`;
        }
      }

      // Lightweight heuristic classification
      const lowerName = file.name.toLowerCase();
      let docType: DocumentClassificationType = 'unknown';
      let detectedLabel = 'Uploaded Document';
      let institution = 'Detected Provider';
      let suffix = Math.floor(1000 + Math.random() * 9000).toString();

      if (lowerName.includes('chase') || lowerName.includes('checking') || lowerName.includes('bank')) {
        docType = 'bank_statement';
        detectedLabel = 'Bank Statement';
        institution = 'JPMorgan Chase Bank';
      } else if (lowerName.includes('amex') || lowerName.includes('card') || lowerName.includes('credit')) {
        docType = 'card_statement';
        detectedLabel = 'Credit Card Statement';
        institution = 'American Express';
      } else if (lowerName.includes('payroll') || lowerName.includes('adp') || lowerName.includes('gusto')) {
        docType = 'payroll_report';
        detectedLabel = 'Payroll Liability Summary';
        institution = 'ADP Workforce';
      } else if (lowerName.includes('invoice') || lowerName.includes('receipt') || lowerName.includes('bill')) {
        docType = 'vendor_invoice';
        detectedLabel = 'Vendor Invoice / Receipt';
        institution = 'Vendor';
      } else if (isSpreadsheet) {
        docType = 'sales_summary';
        detectedLabel = 'Financial Spreadsheet';
      } else if (isImg) {
        docType = 'vendor_invoice';
        detectedLabel = 'Receipt Scan';
      }

      const newDoc: ProcessedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        submissionId: period.id,
        fileName: file.name,
        fileSize: formatSize(file.size),
        fileHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
        fileType: file.type || `application/${ext}`,
        isVirusScanned: true,
        readabilityScore: lowerName.includes('blurry') ? 42 : 98,
        readabilityStatus: lowerName.includes('blurry') ? 'blurry' : 'clear',
        fileUrl,
        fileBlob: file,
        textContent: textContent || undefined,
        extension: ext,
        classification: {
          documentType: docType,
          confidence: lowerName.includes('blurry') ? 54 : 96,
          confidenceLevel: lowerName.includes('blurry') ? 'low' : 'high',
          detectedLabel
        },
        extractedFields: {
          institution,
          accountSuffix: suffix,
          periodStart: period.startDate || 'Oct 01, 2026',
          periodEnd: period.endDate || 'Oct 31, 2026',
          totalAmount: `$${(Math.random() * 15000 + 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          statementDate: period.endDate || 'Oct 31, 2026',
          pageCount: 1
        },
        reviewStatus: lowerName.includes('blurry') ? 'triage' : 'accepted',
        mockPageContent: textContent || `Extracted text from uploaded file: ${file.name}\nSize: ${formatSize(file.size)}\nType: ${file.type}`
      };

      createdDocs.push(newDoc);

      // Support legacy callback
      if (onUploadFile) {
        onUploadFile(file.name, file.size, `Uploaded file ${file.name} for ${client.name}`);
      }
    }

    if (onUploadComplete) {
      onUploadComplete(createdDocs);
    }

    setIsProcessing(false);
    onClose();
  };

  // 1-Click test document
  const handleUploadSample = (sample: typeof SAMPLE_TEST_DOCUMENTS[0]) => {
    const isBlurry = sample.name.toLowerCase().includes('blurry');
    const isDuplicate = sample.name.toLowerCase().includes('duplicate');

    const sampleDoc: ProcessedDocument = {
      id: `doc-sample-${Date.now()}`,
      submissionId: period.id,
      fileName: sample.name,
      fileSize: '380 KB',
      fileHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      fileType: 'application/pdf',
      isVirusScanned: true,
      readabilityScore: isBlurry ? 38 : 99,
      readabilityStatus: isBlurry ? 'blurry' : 'clear',
      extension: 'pdf',
      classification: {
        documentType: 'bank_statement',
        confidence: isBlurry ? 45 : 98,
        confidenceLevel: isBlurry ? 'low' : 'high',
        detectedLabel: sample.name.includes('Amex') ? 'Credit Card Statement' : 'Bank Checking Statement'
      },
      extractedFields: {
        institution: sample.name.includes('Amex') ? 'American Express' : 'Chase Bank',
        accountSuffix: sample.name.includes('Amex') ? '8910' : '4102',
        periodStart: 'Oct 01, 2026',
        periodEnd: 'Oct 31, 2026',
        totalAmount: sample.name.includes('Amex') ? '$9,420.15' : '$184,290.44',
        statementDate: 'Oct 31, 2026',
        pageCount: 3
      },
      reviewStatus: isBlurry ? 'triage' : 'accepted',
      mockPageContent: sample.content
    };

    if (onUploadComplete) {
      onUploadComplete([sampleDoc]);
    } else if (onUploadFile) {
      onUploadFile(sample.name, 380 * 1024, sample.content);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(5, 5, 10, 0.80)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="rounded-2xl max-w-xl w-full overflow-hidden animate-fade-in"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-hover)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* Modal Header */}
        <div
          className="p-4 px-5 flex items-center justify-between"
          style={{
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-primary)'
          }}
        >
          <div>
            <h3 className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
              Add Documents to {client.name}
            </h3>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Folder: {period.label} · Any file format accepted
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors cursor-pointer"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-xl p-7 text-center transition-all"
            style={{
              borderColor: dragActive ? 'var(--accent-primary)' : 'var(--border-secondary)',
              background: dragActive ? 'var(--accent-primary-subtle)' : 'var(--bg-elevated)'
            }}
          >
            <UploadCloud className="w-9 h-9 mx-auto mb-2 text-indigo-400" />
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Drag and drop any file here
            </p>
            <p className="text-[11px] mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              Upload PDFs, images (PNG, JPG), spreadsheets (CSV, Excel), text, invoices, or statements.
            </p>

            <label
              className="mt-3.5 inline-block px-4 py-2 rounded-lg font-medium cursor-pointer transition-all"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)'
              }}
            >
              Browse Computer
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2 text-left">
                <div className="text-[11px] font-semibold flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Files to upload ({selectedFiles.length}):</span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {selectedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg flex items-center justify-between"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-secondary)'
                      }}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-medium truncate text-xs" style={{ color: 'var(--text-primary)' }}>
                          {f.name}
                        </span>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {formatSize(f.size)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUploadAll}
                  disabled={isProcessing}
                  className="w-full mt-2 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload & Ingest {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick 1-Click Sample Accounting Documents */}
          <div className="space-y-2.5 pt-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between">
              <span
                className="font-semibold uppercase tracking-wider text-[11px]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Or test with sample documents (1-click test):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[1])}
                className="p-3 text-left rounded-xl transition-all flex flex-col justify-between cursor-pointer"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">Amex Corporate Card (*8910)</span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Fulfills missing document checklist!
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[0])}
                className="p-3 text-left rounded-xl transition-all flex flex-col justify-between cursor-pointer"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Chase Operating Checking</span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Standard clean bank statement (...4102).
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[4])}
                className="p-3 text-left rounded-xl transition-all flex flex-col justify-between cursor-pointer"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--color-warning)' }}>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Blurry Camera Photo</span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Tests how the system alerts on unreadable glare.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[5])}
                className="p-3 text-left rounded-xl transition-all flex flex-col justify-between cursor-pointer"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <div className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Duplicate Statement</span>
                </div>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Tests duplicate detection and alert.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
