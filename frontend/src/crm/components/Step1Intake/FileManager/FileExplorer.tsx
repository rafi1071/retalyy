import React, { useState, useRef } from 'react';
import {
  Client,
  Period,
  Submission,
  ProcessedDocument,
  ChecklistTemplate,
  DocumentClassificationType
} from '../../types';
import {
  Folder,
  FileText,
  LayoutGrid,
  List,
  Search,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Plus,
  ShieldCheck,
  ChevronRight,
  Eye,
  Download,
  Trash2,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCode,
  ExternalLink,
  Info
} from 'lucide-react';
import { DocumentViewerModal } from './DocumentViewerModal';

interface FileExplorerProps {
  client: Client;
  period: Period;
  submission?: Submission;
  checklist?: ChecklistTemplate;
  selectedDocId: string | null;
  onSelectDocument: (docId: string) => void;
  onOpenUploadModal: () => void;
  onToggleInspector: () => void;
  isInspectorOpen: boolean;
  onUploadFiles?: (files: File[]) => void;
  onDeleteDocument?: (docId: string) => void;
  onUpdateDocument?: (
    docId: string,
    updates: {
      documentType?: DocumentClassificationType;
      institution?: string;
      accountSuffix?: string;
      totalAmount?: string;
    }
  ) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  client,
  period,
  submission,
  checklist,
  selectedDocId,
  onSelectDocument,
  onOpenUploadModal,
  onToggleInspector,
  isInspectorOpen,
  onUploadFiles,
  onDeleteDocument,
  onUpdateDocument
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<ProcessedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const documents = submission?.documents || [];

  // Filter files by search
  const filteredDocs = documents.filter(doc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.fileName.toLowerCase().includes(q) ||
      (doc.extractedFields.institution && doc.extractedFields.institution.toLowerCase().includes(q)) ||
      (doc.extractedFields.accountSuffix && doc.extractedFields.accountSuffix.includes(q)) ||
      doc.classification.detectedLabel.toLowerCase().includes(q)
    );
  });

  // Calculate missing requirements
  const checklistMatches = submission?.checklistMatches || [];
  const missingMatches = checklistMatches.filter(m => m.status === 'missing');
  const exemptMatches = checklistMatches.filter(m => m.status === 'exempt');
  const satisfiedMatches = checklistMatches.filter(m => m.status === 'satisfied');

  const totalRequired = checklistMatches.filter(m => m.status !== 'exempt').length || 3;
  const totalSatisfied = satisfiedMatches.length;

  // Drag and drop directly onto canvas
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCanvas(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragOverCanvas) setDragOverCanvas(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only turn off if leaving main container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverCanvas(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCanvas(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (onUploadFiles) {
        onUploadFiles(files);
      } else {
        onOpenUploadModal();
      }
    }
  };

  const handleNativeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (onUploadFiles) {
        onUploadFiles(files);
      }
      e.target.value = '';
    }
  };

  // Helper to trigger file download
  const handleDownloadFile = (e: React.MouseEvent, doc: ProcessedDocument) => {
    e.stopPropagation();
    if (doc.fileUrl) {
      const a = window.document.createElement('a');
      a.href = doc.fileUrl;
      a.download = doc.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } else {
      const content = doc.textContent || doc.mockPageContent || doc.rawSnippet || `Document content for ${doc.fileName}`;
      const blob = new Blob([content], { type: 'application/octet-stream' });
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

  // Helper to get file icon and extension styling
  const getFileBadge = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(ext)) {
      return {
        label: ext.toUpperCase(),
        bg: 'rgba(56, 189, 248, 0.15)',
        color: '#38bdf8',
        border: 'rgba(56, 189, 248, 0.3)',
        icon: <ImageIcon className="w-3.5 h-3.5" />
      };
    }
    if (['csv', 'xlsx', 'xls', 'tsv'].includes(ext)) {
      return {
        label: ext.toUpperCase(),
        bg: 'rgba(34, 197, 94, 0.15)',
        color: '#4ade80',
        border: 'rgba(34, 197, 94, 0.3)',
        icon: <FileSpreadsheet className="w-3.5 h-3.5" />
      };
    }
    if (['txt', 'json', 'log', 'md'].includes(ext)) {
      return {
        label: ext.toUpperCase(),
        bg: 'rgba(168, 85, 247, 0.15)',
        color: '#c084fc',
        border: 'rgba(168, 85, 247, 0.3)',
        icon: <FileCode className="w-3.5 h-3.5" />
      };
    }
    return {
      label: 'PDF',
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: 'rgba(239, 68, 68, 0.3)',
      icon: <FileText className="w-3.5 h-3.5" />
    };
  };

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden relative"
      style={{ background: 'var(--bg-base)' }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input for 1-click native file dialog */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleNativeFileSelect}
        className="hidden"
      />

      {/* Drag & Drop Overlay */}
      {dragOverCanvas && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none animate-fade-in"
          style={{
            background: 'rgba(10, 10, 15, 0.88)',
            border: '2px dashed var(--accent-primary)',
            backdropFilter: 'blur(6px)'
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid var(--border-accent)'
            }}
          >
            <UploadCloud className="w-8 h-8 text-indigo-400 animate-bounce" />
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Drop files to upload directly
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Uploading to {client.name} &bull; {period.label}
          </p>
        </div>
      )}

      {/* Top Breadcrumb & Action Toolbar */}
      <div
        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0"
        style={{
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap">
          <span
            className="flex items-center gap-1.5 font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Folder className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            Clients
          </span>
          <ChevronRight className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {client.name}
          </span>
          <ChevronRight className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span
            className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--accent-primary-hover)',
              border: '1px solid var(--border-secondary)'
            }}
          >
            {period.label}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search
              className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Search files or bank..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg w-44 md:w-56 transition-all focus:outline-none"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* View Toggle (Grid / List) */}
          <div
            className="flex items-center p-0.5 rounded-lg"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-1.5 rounded transition-all cursor-pointer"
              style={{
                background: viewMode === 'grid' ? 'var(--bg-elevated)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-tertiary)'
              }}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5 rounded transition-all cursor-pointer"
              style={{
                background: viewMode === 'list' ? 'var(--bg-elevated)' : 'transparent',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-tertiary)'
              }}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Direct File Picker Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
            title="Browse and upload any file from computer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Upload Files Modal Button */}
          <button
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            style={{
              background: 'var(--accent-primary)',
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Files</span>
          </button>
        </div>
      </div>

      {/* Status Bar for this Client's Folder */}
      <div
        className="px-5 py-3.5 shrink-0"
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {missingMatches.length > 0 ? (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--color-warning-subtle)',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--color-success-subtle)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            <div>
              <div className="text-xs font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>
                  {totalSatisfied} of {totalRequired} documents received for {period.label}
                </span>
                {missingMatches.length > 0 ? (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{
                      background: 'var(--color-warning-subtle)',
                      color: 'var(--color-warning)'
                    }}
                  >
                    Missing {missingMatches.length} file{missingMatches.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{
                      background: 'var(--color-success-subtle)',
                      color: 'var(--color-success)'
                    }}
                  >
                    Folder Complete
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Assigned Accountant: <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{client.owningAccountant}</span> · Due date: <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{period.deadline}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              Add Downloaded File
            </button>
          </div>
        </div>
      </div>

      {/* Main Folder Contents View */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* SECTION 1: RECEIVED DOCUMENTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Received Files in this Folder ({filteredDocs.length})
            </h3>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Click to inspect · Double-click to view full document
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div
              className="p-12 rounded-xl text-center space-y-3 cursor-pointer"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px dashed var(--border-hover)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Folder className="w-10 h-10 mx-auto" style={{ color: 'var(--text-muted)' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>No documents in this folder yet</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Drag & drop any file here or click &ldquo;Upload&rdquo; to add PDFs, receipts, CSVs, or images.
                </p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDocs.map(doc => {
                const isSelected = selectedDocId === doc.id;
                const isBlurry = doc.readabilityStatus === 'blurry';
                const isDuplicate = doc.fileName.toLowerCase().includes('duplicate');
                const badge = getFileBadge(doc.fileName);

                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc.id)}
                    onDoubleClick={() => setViewingDoc(doc)}
                    className="p-4 rounded-xl cursor-pointer transition-all space-y-3 group relative"
                    style={{
                      background: 'var(--bg-surface)',
                      border: isSelected
                        ? '1px solid var(--accent-primary)'
                        : '1px solid var(--border-primary)',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(99, 102, 241, 0.2)'
                        : 'var(--shadow-sm)'
                    }}
                  >
                    {/* File Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] shrink-0"
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`
                          }}
                        >
                          {badge.label.slice(0, 4)}
                        </div>
                        <div className="min-w-0">
                          <h4
                            className="text-xs font-semibold truncate group-hover:text-indigo-400 transition-colors"
                            title={doc.fileName}
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {doc.fileName}
                          </h4>
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            {doc.fileSize}
                          </span>
                        </div>
                      </div>

                      {/* Quick Hover Actions (View & Download) */}
                      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDoc(doc);
                          }}
                          className="p-1 rounded-md transition-colors cursor-pointer"
                          style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--accent-primary-hover)',
                            border: '1px solid var(--border-secondary)'
                          }}
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDownloadFile(e, doc)}
                          className="p-1 rounded-md transition-colors cursor-pointer"
                          style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-secondary)'
                          }}
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Extracted File Details */}
                    <div
                      className="p-2.5 rounded-lg text-xs space-y-1.5"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-secondary)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Type</span>
                        <span className="font-semibold text-[11px]" style={{ color: 'var(--text-primary)' }}>
                          {doc.classification.detectedLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Bank / Provider</span>
                        <span className="font-semibold text-[11px] truncate max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                          {doc.extractedFields.institution || 'Unknown'}
                        </span>
                      </div>

                      {doc.extractedFields.accountSuffix && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Account</span>
                          <span className="font-mono font-medium text-[11px]" style={{ color: 'var(--text-primary)' }}>
                            ...{doc.extractedFields.accountSuffix}
                          </span>
                        </div>
                      )}

                      {doc.extractedFields.totalAmount && (
                        <div
                          className="flex items-center justify-between pt-1"
                          style={{ borderTop: '1px solid var(--border-secondary)' }}
                        >
                          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Ending Balance</span>
                          <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-success)' }}>
                            {doc.extractedFields.totalAmount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Status Pill */}
                    <div className="flex items-center justify-between pt-1">
                      {isBlurry ? (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 flex items-center gap-1"
                          style={{
                            background: 'var(--color-warning-subtle)',
                            color: 'var(--color-warning)'
                          }}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Needs Check
                        </span>
                      ) : isDuplicate ? (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded shrink-0"
                          style={{
                            background: 'var(--color-warning-subtle)',
                            color: 'var(--color-warning)'
                          }}
                        >
                          Duplicate
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 flex items-center gap-1"
                          style={{
                            background: 'var(--color-success-subtle)',
                            color: 'var(--color-success)'
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingDoc(doc);
                        }}
                        className="text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        style={{ color: 'var(--accent-primary-hover)' }}
                      >
                        <span>View</span>
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <table className="w-full text-left text-xs">
                <thead
                  style={{
                    background: 'var(--bg-elevated)',
                    borderBottom: '1px solid var(--border-primary)',
                    color: 'var(--text-tertiary)'
                  }}
                  className="font-semibold uppercase text-[10px]"
                >
                  <tr>
                    <th className="py-2.5 px-3.5">File Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Bank / Provider</th>
                    <th className="py-2.5 px-3">Account</th>
                    <th className="py-2.5 px-3">Balance / Total</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
                  {filteredDocs.map(doc => {
                    const isSelected = selectedDocId === doc.id;
                    const isBlurry = doc.readabilityStatus === 'blurry';
                    const badge = getFileBadge(doc.fileName);

                    return (
                      <tr
                        key={doc.id}
                        onClick={() => onSelectDocument(doc.id)}
                        onDoubleClick={() => setViewingDoc(doc)}
                        className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                        style={{
                          background: isSelected ? 'var(--accent-primary-subtle)' : 'transparent',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <td className="py-2.5 px-3.5 font-medium flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-mono font-bold"
                            style={{
                              background: badge.bg,
                              color: badge.color
                            }}
                          >
                            {badge.label.slice(0, 3)}
                          </span>
                          <span className="truncate max-w-xs">{doc.fileName}</span>
                        </td>
                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>
                          {doc.classification.detectedLabel}
                        </td>
                        <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>
                          {doc.extractedFields.institution || '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono" style={{ color: 'var(--text-muted)' }}>
                          {doc.extractedFields.accountSuffix ? `...${doc.extractedFields.accountSuffix}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold" style={{ color: 'var(--color-success)' }}>
                          {doc.extractedFields.totalAmount || '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          {isBlurry ? (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-medium"
                              style={{
                                background: 'var(--color-warning-subtle)',
                                color: 'var(--color-warning)'
                              }}
                            >
                              Needs Check
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-medium"
                              style={{
                                background: 'var(--color-success-subtle)',
                                color: 'var(--color-success)'
                              }}
                            >
                              ✓ Verified
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingDoc(doc);
                              }}
                              className="px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                              style={{
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border-secondary)',
                                color: 'var(--accent-primary-hover)'
                              }}
                              title="View Document"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => handleDownloadFile(e, doc)}
                              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 2: MISSING DOCUMENTS */}
        {missingMatches.length > 0 && (
          <div
            className="space-y-3 pt-4"
            style={{ borderTop: '1px solid var(--border-primary)' }}
          >
            <h3
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--color-warning)' }}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Missing Documents Expected from {client.name} ({missingMatches.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missingMatches.map(missing => (
                <div
                  key={missing.requirementId}
                  className="p-4 rounded-xl flex items-center justify-between gap-3 text-xs"
                  style={{
                    background: 'var(--color-warning-subtle)',
                    border: '1px dashed rgba(245, 158, 11, 0.4)'
                  }}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="font-semibold block truncate" style={{ color: 'var(--color-warning)' }}>
                      {missing.requirement.description}
                    </span>
                    <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                      Required by client checklist for {period.label}.
                    </p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg font-medium text-xs transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: 'var(--color-warning)'
                    }}
                  >
                    <UploadCloud className="w-3 h-3" />
                    Upload File
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: EXEMPT / DORMANT ACCOUNTS */}
        {exemptMatches.length > 0 && (
          <div
            className="p-3.5 rounded-xl text-xs space-y-1.5"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <span
              className="font-semibold flex items-center gap-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Exempt Accounts for this Month:
            </span>
            {exemptMatches.map(ex => (
              <p key={ex.requirementId} className="text-[11px] pl-5" style={{ color: 'var(--text-tertiary)' }}>
                • {ex.requirement.description}: Account is marked dormant (no statement required unless balance changes).
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewerModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
          onUpdateDocument={onUpdateDocument}
          onDeleteDocument={(id) => {
            if (onDeleteDocument) onDeleteDocument(id);
            setViewingDoc(null);
          }}
        />
      )}
    </div>
  );
};
