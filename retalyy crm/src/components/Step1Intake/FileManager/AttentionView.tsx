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
  Building2,
  Mail
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
    <div
      className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Header */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Files & Exceptions That Need Your Attention
        </h2>
        <p className="text-xs mt-1.5 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Clean files are automatically filed and verified. Only unreadable scans, duplicate uploads, or missing items appear here for your review.
        </p>
      </div>

      {allIssues.length === 0 ? (
        <div
          className="p-12 text-center rounded-2xl space-y-3"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>All Files Are in Order</h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
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
                className="p-5 rounded-xl border transition-all"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: isResolved
                    ? 'var(--border-secondary)'
                    : finding.kind === 'unreadable'
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'var(--border-primary)',
                  opacity: isResolved ? 0.6 : 1
                }}
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3"
                  style={{ borderBottom: '1px solid var(--border-secondary)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: 'var(--color-warning-subtle)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{client.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>·</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{submission.periodLabel}</span>
                      </div>
                      <h4 className="font-medium text-xs mt-0.5" style={{ color: 'var(--color-warning)' }}>
                        {finding.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
                        <Check className="w-4 h-4" />
                        Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => onResolveFinding(finding.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-secondary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Mark as Handled
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-3 text-xs leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <p>{finding.plainLanguageReason}</p>

                  {finding.relatedDocumentId && (
                    <div className="pt-2 flex items-center gap-4">
                      <button
                        onClick={() =>
                          onSelectDocument(
                            finding.relatedDocumentId!,
                            client.id,
                            submission.periodId
                          )
                        }
                        className="text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                        style={{ color: 'var(--accent-primary-hover)' }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Open File in Inspector
                      </button>
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
