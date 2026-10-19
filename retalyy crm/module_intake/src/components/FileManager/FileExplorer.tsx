import React, { useState } from 'react';
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
  ExternalLink,
  Info
} from 'lucide-react';

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
  isInspectorOpen
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

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

  const missingItemNames = missingMatches.map(m => m.requirement.description);
  const totalRequired = checklistMatches.filter(m => m.status !== 'exempt').length || 3;
  const totalSatisfied = satisfiedMatches.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Folder className="w-3.5 h-3.5 text-slate-400" />
            Clients
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-slate-700">{client.name}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {period.label}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files or bank..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md w-44 md:w-56 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
          </div>

          {/* View Toggle (Grid / List) */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upload Files Button */}
          <button
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Files</span>
          </button>
        </div>
      </div>

      {/* Status Bar for this Client's Folder */}
      <div className="p-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {missingMatches.length > 0 ? (
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            )}

            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>
                  {totalSatisfied} of {totalRequired} documents received for {period.label}
                </span>
                {missingMatches.length > 0 ? (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Missing {missingMatches.length} file{missingMatches.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Folder Complete
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Assigned Accountant: <span className="font-semibold text-slate-700">{client.owningAccountant}</span> · Due date: <span className="font-mono text-slate-700">{period.deadline}</span>
              </p>
            </div>
          </div>

          {/* Direct upload button for attachments downloaded by the accountant */}
          <button
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Add Downloaded File
          </button>
        </div>
      </div>

      {/* Main Folder Contents View */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* SECTION 1: RECEIVED DOCUMENTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Received Files in this Folder ({filteredDocs.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Click any file to view details and edit
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-300 rounded-xl bg-white text-center space-y-2">
              <Folder className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No documents in this folder yet</p>
              <p className="text-[11px] text-slate-400">
                Click "Add Files" above to upload or test with sample statements.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDocs.map(doc => {
                const isSelected = selectedDocId === doc.id;
                const isBlurry = doc.readabilityStatus === 'blurry';
                const isDuplicate = doc.fileName.toLowerCase().includes('duplicate');

                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc.id)}
                    className={`p-4 bg-white rounded-xl border cursor-pointer transition-all hover:shadow-sm space-y-3 ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* File Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[11px] text-slate-700 shrink-0">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate" title={doc.fileName}>
                            {doc.fileName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {doc.fileSize}
                          </span>
                        </div>
                      </div>

                      {/* Badge */}
                      {isBlurry ? (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                          Needs Check
                        </span>
                      ) : isDuplicate ? (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                          Duplicate
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Extracted File Details */}
                    <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[11px] text-slate-400">Type</span>
                        <span className="font-semibold text-slate-800 text-[11px]">
                          {doc.classification.detectedLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[11px] text-slate-400">Bank / Provider</span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate max-w-xs">
                          {doc.extractedFields.institution || 'Unknown'}
                        </span>
                      </div>

                      {doc.extractedFields.accountSuffix && (
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-[11px] text-slate-400">Account</span>
                          <span className="font-mono text-slate-800 font-semibold text-[11px]">
                            ...{doc.extractedFields.accountSuffix}
                          </span>
                        </div>
                      )}

                      {doc.extractedFields.totalAmount && (
                        <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/50">
                          <span className="text-[11px] text-slate-400">Ending Balance</span>
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {doc.extractedFields.totalAmount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">File Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Bank / Provider</th>
                    <th className="py-2.5 px-3">Account</th>
                    <th className="py-2.5 px-3">Balance / Total</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map(doc => {
                    const isSelected = selectedDocId === doc.id;
                    const isBlurry = doc.readabilityStatus === 'blurry';

                    return (
                      <tr
                        key={doc.id}
                        onClick={() => onSelectDocument(doc.id)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-100/70 font-medium' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-xs">{doc.fileName}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {doc.classification.detectedLabel}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">
                          {doc.extractedFields.institution || '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {doc.extractedFields.accountSuffix ? `...${doc.extractedFields.accountSuffix}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {doc.extractedFields.totalAmount || '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          {isBlurry ? (
                            <span className="text-amber-800 font-medium text-[11px]">Needs Check</span>
                          ) : (
                            <span className="text-emerald-700 font-medium text-[11px]">✓ Verified</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 2: MISSING DOCUMENTS (EXPECTED FROM THIS CLIENT) */}
        {missingMatches.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Missing Documents Expected from {client.name} ({missingMatches.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missingMatches.map(missing => (
                <div
                  key={missing.requirementId}
                  className="p-4 bg-amber-50/50 border-2 border-dashed border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="font-bold text-amber-950 block truncate">
                      {missing.requirement.description}
                    </span>
                    <p className="text-[11px] text-amber-800/80 leading-snug">
                      Required by client checklist for {period.label}.
                    </p>
                  </div>

                  <button
                    onClick={onOpenUploadModal}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
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
          <div className="p-3.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs space-y-1">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              Exempt Accounts for this Month:
            </span>
            {exemptMatches.map(ex => (
              <p key={ex.requirementId} className="text-slate-600 text-[11px] pl-5">
                • {ex.requirement.description}: Account is marked dormant (no statement required unless balance changes).
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
