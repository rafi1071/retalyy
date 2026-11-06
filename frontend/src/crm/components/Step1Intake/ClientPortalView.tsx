import React, { useState } from 'react';
import {
  Client,
  ChecklistTemplate,
  Period,
  ProcessedDocument,
  Submission
} from '../types';
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react';

interface ClientPortalViewProps {
  client: Client;
  checklist: ChecklistTemplate;
  period: Period;
  submission?: Submission;
  onClientUpload: (fileName: string, content: string) => void;
  onSendClientReply: (messageText: string) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  client,
  checklist,
  period,
  submission,
  onClientUpload,
  onSendClientReply
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<{
    status: 'success' | 'warning' | 'idle';
    message: string;
  }>({ status: 'idle', message: '' });
  const [clientReplyText, setClientReplyText] = useState<string>('');
  const [replySent, setReplySent] = useState<boolean>(false);

  // Check received status from submission matches
  const requirementsStatus = checklist.requirements.map(req => {
    const match = submission?.checklistMatches?.find(m => m.requirementId === req.id);
    const isSatisfied = match?.status === 'satisfied';
    const isExempt = match?.status === 'exempt';
    return {
      ...req,
      isSatisfied,
      isExempt,
      matchedDocName: match?.matchedDocumentName
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Immediate image quality check simulation
      if (file.name.toLowerCase().includes('blurry') || file.name.toLowerCase().includes('photo')) {
        setUploadFeedback({
          status: 'warning',
          message: 'Immediate Quality Check Alert: High glare or optical blur detected on page edges. For fastest processing, please upload an electronic PDF statement or retake photo flat with flash turned off.'
        });
      } else {
        setUploadFeedback({
          status: 'success',
          message: 'Quality Pre-scan: High clarity (100%). Ready for automatic ingestion and reconciliation.'
        });
      }
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    setIsSimulatingUpload(true);
    setTimeout(() => {
      onClientUpload(
        selectedFile.name,
        `Client portal upload for ${client.name}. File: ${selectedFile.name}`
      );
      setIsSimulatingUpload(false);
      setSelectedFile(null);
      setUploadFeedback({
        status: 'success',
        message: 'Document successfully transmitted! Your accounting team has been notified.'
      });
      setTimeout(() => setUploadFeedback({ status: 'idle', message: '' }), 4000);
    }, 600);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientReplyText.trim()) return;
    onSendClientReply(clientReplyText);
    setReplySent(true);
    setClientReplyText('');
    setTimeout(() => setReplySent(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Client View Disclaimer Banner */}
      <div
        className="p-3 px-4 rounded-xl text-xs flex items-center justify-between"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)'
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-indigo-400">Client Portal Simulator:</span>
          <span style={{ color: 'var(--text-tertiary)' }}>Viewing from the perspective of</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{client.name}</span>
        </div>
        <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
          Accounting Period: {period.label}
        </span>
      </div>

      {/* Main Client Hub Card */}
      <div
        className="rounded-2xl p-6 md:p-8 space-y-6"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {client.name} · Document Intake Portal
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Please submit your monthly accounting files for <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{period.label}</span>. Due by <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{period.deadline}</span>.
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>Your Assigned Accountant</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{client.owningAccountant}</span>
          </div>
        </div>

        {/* Expected Checklist Status */}
        <div className="space-y-3">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            What We Need for {period.label}
          </h3>

          <div
            className="rounded-xl overflow-hidden divide-y"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              borderColor: 'var(--border-secondary)'
            }}
          >
            {requirementsStatus.map(item => (
              <div
                key={item.id}
                className="p-3.5 flex items-center justify-between transition-colors text-xs"
                style={{ borderColor: 'var(--border-secondary)' }}
              >
                <div className="flex items-center gap-3">
                  {item.isSatisfied ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : item.isExempt ? (
                    <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  )}

                  <div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.description}
                    </div>
                    <div className="text-[11px] mt-0.5">
                      {item.isSatisfied ? (
                        <span style={{ color: 'var(--color-success)' }}>
                          Received ({item.matchedDocName || 'Statement verified'})
                        </span>
                      ) : item.isExempt ? (
                        <span style={{ color: 'var(--text-muted)' }}>
                          Exempt (Account marked inactive for this period)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-warning)' }}>
                          Awaiting your upload
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!item.isSatisfied && !item.isExempt && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded"
                    style={{
                      background: 'var(--color-warning-subtle)',
                      color: 'var(--color-warning)'
                    }}
                  >
                    Action Required
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="space-y-3 pt-2">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Upload Accounting Documents
          </h3>

          <div
            className="border-2 border-dashed rounded-xl p-8 text-center transition-all"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-secondary)'
            }}
          >
            <UploadCloud className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
              Drag & drop bank statements, payroll journals, or tax filings here
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Supports electronic PDF, scanned PDF, PNG, JPG (up to 50MB per file).
            </p>

            <label
              className="mt-4 inline-block px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Choose Files from Computer
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div
                className="mt-4 p-3 rounded-lg max-w-md mx-auto text-left flex items-center justify-between"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div className="truncate">
                  <span className="text-xs font-semibold block truncate" style={{ color: 'var(--text-primary)' }}>
                    {selectedFile.name}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {Math.round(selectedFile.size / 1024)} KB
                  </span>
                </div>
                <button
                  onClick={handleUploadSubmit}
                  disabled={isSimulatingUpload}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff'
                  }}
                >
                  {isSimulatingUpload ? 'Uploading...' : 'Transmit File'}
                </button>
              </div>
            )}
          </div>

          {/* Immediate Pre-scan Feedback Box */}
          {uploadFeedback.status !== 'idle' && (
            <div
              className="p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5"
              style={{
                background: uploadFeedback.status === 'warning'
                  ? 'var(--color-warning-subtle)'
                  : 'var(--color-success-subtle)',
                borderColor: uploadFeedback.status === 'warning'
                  ? 'rgba(245, 158, 11, 0.3)'
                  : 'rgba(34, 197, 94, 0.3)',
                color: uploadFeedback.status === 'warning'
                  ? 'var(--color-warning)'
                  : 'var(--color-success)'
              }}
            >
              {uploadFeedback.status === 'warning' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              )}
              <div>{uploadFeedback.message}</div>
            </div>
          )}
        </div>

        {/* Message Thread with Accounting Team */}
        <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Communication with {client.owningAccountant}
          </h3>

          {submission?.draftMessage && submission.draftMessage.status === 'sent' ? (
            <div
              className="p-4 rounded-xl space-y-2 text-xs"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Message from {client.owningAccountant}:
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  {submission.draftMessage.sentAt || 'Today'}
                </span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {submission.draftMessage.draftBody}
              </p>
            </div>
          ) : (
            <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
              No outstanding inquiries from your accounting team.
            </p>
          )}

          <form onSubmit={handleSendReply} className="flex gap-2">
            <input
              type="text"
              value={clientReplyText}
              onChange={(e) => setClientReplyText(e.target.value)}
              placeholder="Type a message or note about your submission..."
              className="flex-1 p-2.5 text-xs rounded-xl focus:outline-none"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-primary)'
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{
                background: 'var(--accent-primary)',
                color: '#ffffff'
              }}
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>

          {replySent && (
            <span className="text-xs font-medium block" style={{ color: 'var(--color-success)' }}>
              Reply posted to case audit log.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
