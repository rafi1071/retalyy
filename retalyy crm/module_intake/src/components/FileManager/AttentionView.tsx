import React from 'react';
import {
  Submission,
  ProcessedDocument,
  Client,
  Finding
} from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Check,
  Eye,
  RefreshCw,
  Building2
} from 'lucide-react';

interface AttentionViewProps {
  submissions: Record<string, Submission>;
  clients: Client[];
  onSelectDocument: (docId: string, clientId: string, periodId: string) => void;
  onResolveFinding: (findingId: string) => void;
}

export const AttentionView: React.FC<AttentionViewProps> = ({
  submissions,
  clients,
  onSelectDocument,
  onResolveFinding
}) => {
  // Collect all findings across all submissions
  const allIssues: {
    submission: Submission;
    finding: Finding;
    client: Client;
  }[] = [];

  Object.values(submissions).forEach(sub => {
    const client = clients.find(c => c.id === sub.clientId) || clients[0];
    sub.findings.forEach(f => {
      allIssues.push({
        submission: sub,
        finding: f,
        client
      });
    });
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Files & Exceptions That Need Your Attention
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Clean files are automatically filed and verified. Only unreadable scans, duplicate uploads, or missing items appear here for your review.
        </p>
      </div>

      {allIssues.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900">All Files Are in Order</h3>
          <p className="text-xs text-slate-500">
            No blurry documents, duplicates, or unresolved errors found across any client folders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allIssues.map(({ submission, finding, client }) => {
            const isResolved = finding.resolution === 'resolved';

            return (
              <div
                key={finding.id}
                className={`p-5 rounded-xl border transition-all bg-white ${
                  isResolved
                    ? 'border-slate-200 opacity-60'
                    : finding.kind === 'unreadable'
                    ? 'border-amber-300 ring-1 ring-amber-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{client.name}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600 font-medium">{submission.periodLabel}</span>
                      </div>
                      <h4 className="font-semibold text-xs text-amber-900 mt-0.5">
                        {finding.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => onResolveFinding(finding.id)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as Handled
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>{finding.plainLanguageReason}</p>

                  {finding.relatedDocumentId && (
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() =>
                          onSelectDocument(
                            finding.relatedDocumentId!,
                            client.id,
                            submission.periodId
                          )
                        }
                        className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Open File in Inspector
                      </button>

                      {finding.kind === 'unreadable' && (
                        <button
                          onClick={() =>
                            onOpenEmailModal(
                              client,
                              'Clearer replacement copy of blurry document'
                            )
                          }
                          className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Ask Client to Retake Photo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
