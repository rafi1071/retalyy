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

      // Immediate image quality check simulation (design doc requirement)
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
      <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Client Portal Simulator:</span>
          <span className="text-slate-400">Viewing from the perspective of</span>
          <span className="font-bold text-white">{client.name}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Accounting Period: {period.label}
        </span>
      </div>

      {/* Main Client Hub Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {client.name} · Document Intake Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please submit your monthly accounting files for <span className="font-semibold text-slate-800">{period.label}</span>. Due by <span className="font-semibold text-slate-800">{period.deadline}</span>.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Your Assigned Accountant</span>
            <span className="text-xs font-bold text-slate-900">{client.owningAccountant}</span>
          </div>
        </div>

        {/* Expected Checklist Status */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            What We Need for {period.label}
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {requirementsStatus.map(item => (
              <div
                key={item.id}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  {item.isSatisfied ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : item.isExempt ? (
                    <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  )}

                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.description}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.isSatisfied ? (
                        <span className="text-emerald-700 font-medium">
                          Received ({item.matchedDocName || 'Statement verified'})
                        </span>
                      ) : item.isExempt ? (
                        <span className="text-slate-400">
                          Exempt (Account marked inactive for this period)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">
                          Awaiting your upload
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!item.isSatisfied && !item.isExempt && (
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded">
                    Action Required
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drag & Drop Upload Zone with Instant Quality Feedback */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Upload Accounting Documents
          </h3>

          <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-8 text-center bg-slate-50/60 transition-colors">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-800">
              Drag & drop bank statements, payroll journals, or tax filings here
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports electronic PDF, scanned PDF, PNG, JPG (up to 50MB per file).
            </p>

            <label className="mt-4 inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs">
              Choose Files from Computer
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg max-w-md mx-auto text-left flex items-center justify-between">
                <div className="truncate">
                  <span className="text-xs font-semibold text-slate-800 block truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                    {Math.round(selectedFile.size / 1024)} KB
                  </span>
                </div>
                <button
                  onClick={handleUploadSubmit}
                  disabled={isSimulatingUpload}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0"
                >
                  {isSimulatingUpload ? 'Uploading...' : 'Transmit File'}
                </button>
              </div>
            )}
          </div>

          {/* Immediate Pre-scan Feedback Box */}
          {uploadFeedback.status !== 'idle' && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                uploadFeedback.status === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              {uploadFeedback.status === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div>{uploadFeedback.message}</div>
            </div>
          )}
        </div>

        {/* Message Thread with Accounting Team */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Communication with {client.owningAccountant}
          </h3>

          {submission?.draftMessage && submission.draftMessage.status === 'sent' ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Message from {client.owningAccountant}:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {submission.draftMessage.sentAt || 'Today'}
                </span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {submission.draftMessage.draftBody}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No outstanding inquiries from your accounting team.
            </p>
          )}

          <form onSubmit={handleSendReply} className="flex gap-2">
            <input
              type="text"
              value={clientReplyText}
              onChange={(e) => setClientReplyText(e.target.value)}
              placeholder="Type a message or note about your submission..."
              className="flex-1 p-2 text-xs border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>

          {replySent && (
            <span className="text-xs text-emerald-700 font-medium block">
              Reply posted to case audit log.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
