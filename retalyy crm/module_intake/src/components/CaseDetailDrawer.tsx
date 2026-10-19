import React, { useState } from 'react';
import {
  CaseTask,
  Submission,
  ProcessedDocument,
  Finding,
  ChecklistMatchResult,
  DraftMessage,
  DocumentClassificationType,
  AuditEvent
} from '../types';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  Send,
  Edit3,
  ShieldCheck,
  CheckSquare,
  HelpCircle,
  Copy,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface CaseDetailDrawerProps {
  caseTask: CaseTask;
  submission: Submission;
  onClose: () => void;
  onApproveMessage: (messageId: string, updatedBody: string) => void;
  onSaveCorrection: (
    documentId: string,
    correction: {
      documentType?: DocumentClassificationType;
      accountSuffix?: string;
      notes?: string;
    }
  ) => void;
  onResolveFinding: (findingId: string) => void;
  onReassignCase: (caseId: string, newAssignee: string, newState: any) => void;
  onToggleAutoSend: (clientId: string) => void;
  autoSendEnabled: boolean;
}

export const CaseDetailDrawer: React.FC<CaseDetailDrawerProps> = ({
  caseTask,
  submission,
  onClose,
  onApproveMessage,
  onSaveCorrection,
  onResolveFinding,
  onReassignCase,
  onToggleAutoSend,
  autoSendEnabled
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'documents' | 'followup' | 'findings'>(
    caseTask.findingsCount > 0 && caseTask.needsTriage ? 'findings' : 'checklist'
  );
  const [selectedDocId, setSelectedDocId] = useState<string>(
    submission.documents[0]?.id || ''
  );

  // Follow-up message editing state
  const [messageDraftText, setMessageDraftText] = useState<string>(
    submission.draftMessage?.draftBody || ''
  );
  const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
  const [messageApprovedNotice, setMessageApprovedNotice] = useState<boolean>(
    submission.draftMessage?.status === 'approved' || submission.draftMessage?.status === 'sent'
  );

  // Human correction state for selected document
  const currentDoc = submission.documents.find(d => d.id === selectedDocId) || submission.documents[0];
  const [correctType, setCorrectType] = useState<DocumentClassificationType>(
    currentDoc?.humanCorrection?.documentType || currentDoc?.classification.documentType || 'unknown'
  );
  const [correctSuffix, setCorrectSuffix] = useState<string>(
    currentDoc?.humanCorrection?.accountSuffix || currentDoc?.extractedFields.accountSuffix || ''
  );
  const [correctionNotes, setCorrectionNotes] = useState<string>(
    currentDoc?.humanCorrection?.notes || ''
  );
  const [correctionSaved, setCorrectionSaved] = useState<boolean>(false);

  const handleApplyCorrection = () => {
    if (!currentDoc) return;
    onSaveCorrection(currentDoc.id, {
      documentType: correctType,
      accountSuffix: correctSuffix,
      notes: correctionNotes
    });
    setCorrectionSaved(true);
    setTimeout(() => setCorrectionSaved(false), 2500);
  };

  const handleApproveSend = () => {
    if (submission.draftMessage) {
      onApproveMessage(submission.draftMessage.id, messageDraftText);
      setMessageApprovedNotice(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base tracking-wide tabular-nums text-white">
                  {caseTask.caseNumber}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-sm font-semibold text-slate-100">{caseTask.clientName}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300 font-mono tabular-nums">{caseTask.periodLabel}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Assigned to {caseTask.assignee} ({caseTask.assignedRole})</span>
                <span>·</span>
                <span>SLA Due: {caseTask.dueDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={caseTask.state}
              onChange={(e) => onReassignCase(caseTask.id, caseTask.assignee, e.target.value)}
              className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="ready_for_review">Ready for Review</option>
              <option value="awaiting_client">Awaiting Client Reply</option>
              <option value="triage">Needs Triage</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed / Handed Off</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close case drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-md'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Checklist Reconciliation
            <span className="text-[11px] font-mono tabular-nums text-slate-500">
              ({submission.checklistMatches?.filter(m => m.status === 'satisfied').length || 0}/
              {submission.checklistMatches?.filter(m => m.status !== 'exempt').length || 0})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-md'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Document Inspector & Correction
            <span className="text-[11px] font-mono tabular-nums text-slate-500">
              ({submission.documents.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('followup')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'followup'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-md'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Missing Documents Notice
            {submission.draftMessage && submission.draftMessage.status === 'draft' && (
              <span className="w-2 h-2 rounded-full bg-sky-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'findings'
                ? 'border-slate-900 text-slate-900 bg-white rounded-t-md'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Findings & Anomalies
            {submission.findings.length > 0 && (
              <span className="text-[11px] font-mono tabular-nums text-amber-700 font-bold">
                ({submission.findings.length})
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CHECKLIST RECONCILIATION */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Client Expected-Document Checklist Engine
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The checklist engine uses deterministic plain rules, not an LLM. Documents are only flagged as missing if explicitly required by this client’s approved checklist template.
                </p>
              </div>

              {/* Checklist Rules Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Requirement</th>
                      <th className="py-2.5 px-4">Target Account</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Matched Document</th>
                      <th className="py-2.5 px-4">Explainable Rule Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submission.checklistMatches && submission.checklistMatches.length > 0 ? (
                      submission.checklistMatches.map((match) => (
                        <tr key={match.requirementId} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {match.requirement.description}
                          </td>
                          <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                            {match.requirement.targetInstitution || 'Any'} {match.requirement.targetAccountSuffix ? `...${match.requirement.targetAccountSuffix}` : ''}
                          </td>
                          <td className="py-3 px-4">
                            {match.status === 'satisfied' && (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Satisfied
                              </span>
                            )}
                            {match.status === 'missing' && (
                              <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Missing
                              </span>
                            )}
                            {match.status === 'exempt' && (
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                Exempt (Dormant)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {match.matchedDocumentName ? (
                              <button
                                onClick={() => {
                                  if (match.matchedDocumentId) {
                                    setSelectedDocId(match.matchedDocumentId);
                                    setActiveTab('documents');
                                  }
                                }}
                                className="font-mono text-slate-700 hover:text-slate-900 underline flex items-center gap-1 text-[11px]"
                              >
                                {match.matchedDocumentName}
                              </button>
                            ) : (
                              <span className="text-slate-400 italic">None received</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px]">
                            {match.explainableRuleReason}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          Checklist evaluation pending or in triage.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Quick Action Banner */}
              {submission.draftMessage && submission.draftMessage.status === 'draft' && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-sky-900">
                      Missing document notice prepared
                    </h4>
                    <p className="text-xs text-sky-700 mt-0.5">
                      Checklist rules flagged {submission.draftMessage.missingItems.length} missing item(s) to obtain from the client.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('followup')}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
                  >
                    View Missing Items
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENT INSPECTOR & HUMAN CORRECTION */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Selector Pills (Functional buttons) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {submission.documents.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setCorrectType(doc.humanCorrection?.documentType || doc.classification.documentType);
                      setCorrectSuffix(doc.humanCorrection?.accountSuffix || doc.extractedFields.accountSuffix || '');
                      setCorrectionNotes(doc.humanCorrection?.notes || '');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      (currentDoc?.id === doc.id)
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Doc {idx + 1}: {doc.fileName.slice(0, 24)}...</span>
                    {doc.humanCorrection && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-1 rounded">
                        Overridden
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {currentDoc ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Original File Preview & OCR Text */}
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <div className="font-semibold text-slate-900 text-xs truncate max-w-xs">
                            {currentDoc.fileName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                            {currentDoc.fileSize} · SHA-256: {currentDoc.fileHash.slice(0, 16)}...
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold ${
                            currentDoc.readabilityStatus === 'clear' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            Readability: {currentDoc.readabilityScore}%
                          </span>
                        </div>
                      </div>

                      {/* Mock Rendered Document Page */}
                      <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg font-mono text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap max-h-80 overflow-y-auto">
                        {currentDoc.mockPageContent || currentDoc.rawSnippet || 'No document text content available.'}
                      </div>

                      <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Original file stored immutable in object storage</span>
                        <span className="text-emerald-600 font-medium">Virus scanned: Pass</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Extraction vs Human Correction Form */}
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Extracted Fields & Ground Truth
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Every AI extraction is preserved beside human overrides to evaluate model drift.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                            {currentDoc.classification.confidence}%
                          </span>
                          <span className="text-[10px] text-slate-500 block uppercase">
                            AI Confidence
                          </span>
                        </div>
                      </div>

                      {/* Extracted Comparison Grid */}
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                            Document Classification Type
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-md">
                              <span className="text-[10px] text-slate-400 block">AI Detected</span>
                              <span className="font-semibold text-slate-800">
                                {currentDoc.classification.detectedLabel}
                              </span>
                            </div>
                            <div>
                              <select
                                value={correctType}
                                onChange={(e) => setCorrectType(e.target.value as DocumentClassificationType)}
                                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                              >
                                <option value="bank_statement">Bank Statement</option>
                                <option value="card_statement">Card Statement</option>
                                <option value="payroll_report">Payroll Report</option>
                                <option value="tax_form_941">Tax Form (Form 941)</option>
                                <option value="tax_form_1099">Tax Form 1099</option>
                                <option value="vendor_invoice">Vendor Invoice</option>
                                <option value="sales_summary">Sales / Invoicing Summary</option>
                                <option value="unknown">Unknown / Needs Label</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                            Account Identifier Suffix (Last 4)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-md font-mono tabular-nums">
                              <span className="text-[10px] text-slate-400 block">AI Extracted</span>
                              <span className="font-semibold text-slate-800">
                                {currentDoc.extractedFields.accountSuffix || 'None detected'}
                              </span>
                            </div>
                            <div>
                              <input
                                type="text"
                                value={correctSuffix}
                                onChange={(e) => setCorrectSuffix(e.target.value)}
                                placeholder="e.g. 4102"
                                className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                            Institution / Service Provider
                          </label>
                          <div className="p-2 bg-slate-50 border border-slate-200 rounded-md text-slate-800 font-medium">
                            {currentDoc.extractedFields.institution || 'Unknown'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statement Total</span>
                            <span className="font-mono tabular-nums font-semibold text-slate-800">
                              {currentDoc.extractedFields.totalAmount || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Period Detected</span>
                            <span className="font-mono tabular-nums text-slate-800">
                              {currentDoc.extractedFields.periodStart || 'N/A'} - {currentDoc.extractedFields.periodEnd || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                            Accountant Correction Notes (Optional)
                          </label>
                          <textarea
                            value={correctionNotes}
                            onChange={(e) => setCorrectionNotes(e.target.value)}
                            rows={2}
                            placeholder="Add reason for correction to log in training/evaluation set..."
                            className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        {correctionSaved ? (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Correction saved to audit evaluation set!
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Overriding updates checklist matching
                          </span>
                        )}

                        <button
                          onClick={handleApplyCorrection}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Save Human Override
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No document selected.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MISSING DOCUMENTS RECORD */}
          {activeTab === 'followup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Client Missing-Document Notice
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Summary of missing checklist items. Accountants can download attachments directly and keep notes on this record.
                </p>
              </div>

              {submission.draftMessage ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {/* Notice Header Metadata */}
                  <div className="bg-slate-50 p-4 border-b border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-16">Client:</span>
                      <span className="font-semibold text-slate-900">{caseTask.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-16">Subject:</span>
                      <span className="font-semibold text-slate-900">{submission.draftMessage.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-16">Status:</span>
                      <span className="font-semibold text-slate-700">
                        Internal File Note
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="p-4">
                    {isEditingMessage ? (
                      <textarea
                        value={messageDraftText}
                        onChange={(e) => setMessageDraftText(e.target.value)}
                        rows={12}
                        className="w-full p-3 font-sans text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg text-xs leading-relaxed whitespace-pre-wrap text-slate-800">
                        {messageDraftText}
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditingMessage(!isEditingMessage)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {isEditingMessage ? 'Save Changes' : 'Edit Notice Text'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Recorded in Case Files
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-800">
                    All Required Checklist Items Received
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    No missing items were flagged. Case is ready for financial reconciliation and close.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FINDINGS & ANOMALIES */}
          {activeTab === 'findings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Exceptions & Triage Findings
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issues detected by the intake pipeline that require human judgment or verification.
                </p>
              </div>

              {submission.findings.length > 0 ? (
                <div className="space-y-3">
                  {submission.findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="p-4 border border-slate-200 rounded-xl bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${
                            finding.severity === 'blocker' ? 'text-rose-600' : 'text-amber-600'
                          }`} />
                          <span className="font-bold text-xs text-slate-900">
                            {finding.title}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            ({finding.kind})
                          </span>
                        </div>

                        <div>
                          {finding.resolution === 'resolved' ? (
                            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Resolved
                            </span>
                          ) : (
                            <button
                              onClick={() => onResolveFinding(finding.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {finding.plainLanguageReason}
                      </p>

                      {finding.ruleTrace && (
                        <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2 rounded-md">
                          {finding.ruleTrace}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-slate-200 rounded-xl bg-slate-50 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-800">
                    Zero Anomalies or Exceptions Flagged
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    No duplicate files, readability warnings, or unexpected accounts detected in this case.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
