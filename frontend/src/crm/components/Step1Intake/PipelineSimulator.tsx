import React, { useState } from 'react';
import {
  SAMPLE_TEST_DOCUMENTS
} from '../data/mockData';
import {
  Client,
  ChecklistTemplate,
  Period,
  ProcessedDocument,
  PipelineStageEvent,
  Submission,
  CaseTask,
  AuditEvent
} from '../types';
import {
  RetalyyPipelineEngine,
  RawFileInput,
  PipelineExecutionResult
} from '../services/pipelineEngine';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  UploadCloud,
  Mail,
  ShieldCheck,
  ChevronRight,
  Send,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PipelineSimulatorProps {
  clients: Client[];
  checklists: ChecklistTemplate[];
  periods: Period[];
  existingDocuments: ProcessedDocument[];
  onSubmissionCreated: (result: PipelineExecutionResult) => void;
  onOpenCase: (caseId: string) => void;
}

export const PipelineSimulator: React.FC<PipelineSimulatorProps> = ({
  clients,
  checklists,
  periods,
  existingDocuments,
  onSubmissionCreated,
  onOpenCase
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario-acme-email');
  const [activeChannel, setActiveChannel] = useState<'email' | 'portal'>('email');
  const [senderEmail, setSenderEmail] = useState<string>('finance@acme-logistics.com');
  const [customFiles, setCustomFiles] = useState<RawFileInput[]>([]);
  const [customFileName, setCustomFileName] = useState<string>('Chase_November_Preview.pdf');
  const [customFileContent, setCustomFileContent] = useState<string>('');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(-1);
  const [executionResult, setExecutionResult] = useState<PipelineExecutionResult | null>(null);

  // Scenarios matching the system design document
  const scenarios = [
    {
      id: 'scenario-acme-email',
      title: 'Routine Inbound Email (Chase + ADP)',
      client: 'Acme Industrial Logistics',
      channel: 'email' as const,
      sender: 'finance@acme-logistics.com',
      badge: 'Missing Doc Follow-up',
      description: 'Clean inbound submission with 2 files. Engine recognizes missing Amex Card and drafts follow-up for approval.',
      files: [
        {
          name: SAMPLE_TEST_DOCUMENTS[0].name,
          sizeBytes: 420 * 1024,
          type: 'application/pdf',
          contentSnippet: SAMPLE_TEST_DOCUMENTS[0].content,
          senderEmail: 'finance@acme-logistics.com',
          channel: 'email' as const,
          forcedClientHint: 'Acme Industrial Logistics'
        }
      ]
    },
    {
      id: 'scenario-duplicate-upload',
      title: 'Duplicate File Re-Upload Alert',
      client: 'Acme Industrial Logistics',
      channel: 'portal' as const,
      sender: 'portal-session@acme-logistics.com',
      badge: 'Duplicate Detected',
      description: 'Client uploads the exact same file hash as an existing statement. Engine raises duplicate finding without creating ghost cases.',
      files: [
        {
          name: SAMPLE_TEST_DOCUMENTS[5].name,
          sizeBytes: 482 * 1024,
          type: 'application/pdf',
          contentSnippet: SAMPLE_TEST_DOCUMENTS[5].content,
          senderEmail: 'portal-session@acme-logistics.com',
          channel: 'portal' as const,
          forcedClientHint: 'Acme Industrial Logistics'
        }
      ]
    },
    {
      id: 'scenario-blurry-triage',
      title: 'Unreadable Mobile Photo (Triage Queue)',
      client: 'Horizon Biotech Labs',
      channel: 'portal' as const,
      sender: 'treasury@horizonbio.io',
      badge: 'Human Triage Required',
      description: 'Low-quality photo with heavy flash glare. Quality scanner halts downstream automation and routes directly to human triage.',
      files: [
        {
          name: SAMPLE_TEST_DOCUMENTS[4].name,
          sizeBytes: 2100 * 1024,
          type: 'image/jpeg',
          contentSnippet: SAMPLE_TEST_DOCUMENTS[4].content,
          senderEmail: 'treasury@horizonbio.io',
          channel: 'portal' as const,
          forcedClientHint: 'Horizon Biotech Labs'
        }
      ]
    },
    {
      id: 'scenario-meridian-clean',
      title: '100% Satisfied Multi-Doc Intake',
      client: 'Meridian Health Clinics',
      channel: 'portal' as const,
      sender: 'accounts@meridianhealth.org',
      badge: 'Ready for Review',
      description: 'Wells Fargo checking statement + Gusto payroll report satisfying all checklist requirements. Routed ready for accountant.',
      files: [
        {
          name: SAMPLE_TEST_DOCUMENTS[2].name,
          sizeBytes: 280 * 1024,
          type: 'application/pdf',
          contentSnippet: SAMPLE_TEST_DOCUMENTS[2].content,
          senderEmail: 'accounts@meridianhealth.org',
          channel: 'portal' as const,
          forcedClientHint: 'Meridian Health Clinics'
        }
      ]
    },
    {
      id: 'scenario-custom',
      title: 'Custom File / Text Upload',
      client: 'Select or detect',
      channel: 'portal' as const,
      sender: 'custom-upload@example.com',
      badge: 'Interactive Testing',
      description: 'Upload your own document or paste text to test real-time classification, extraction, and checklist reconciliation.',
      files: []
    }
  ];

  const handleSelectScenario = (id: string) => {
    setSelectedScenario(id);
    const scen = scenarios.find(s => s.id === id);
    if (scen && scen.id !== 'scenario-custom') {
      setActiveChannel(scen.channel);
      setSenderEmail(scen.sender);
    }
  };

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setActiveStageIndex(0);
    setExecutionResult(null);

    let filesToRun: RawFileInput[] = [];
    const currentScen = scenarios.find(s => s.id === selectedScenario);

    if (selectedScenario === 'scenario-custom') {
      if (customFiles.length > 0) {
        filesToRun = customFiles;
      } else {
        filesToRun = [
          {
            name: customFileName || 'Custom_Upload.txt',
            sizeBytes: (customFileContent.length || 200) * 4,
            type: 'text/plain',
            contentSnippet: customFileContent || 'JPMorgan Chase commercial checking statement for Acme Industrial Logistics ending balance $184,290.44',
            senderEmail,
            channel: activeChannel
          }
        ];
      }
    } else if (currentScen) {
      filesToRun = currentScen.files;
    }

    const engine = new RetalyyPipelineEngine(
      clients,
      checklists,
      periods,
      existingDocuments
    );

    // Simulate animated stage-by-stage execution
    for (let i = 0; i < 7; i++) {
      setActiveStageIndex(i);
      await new Promise(r => setTimeout(r, 220));
    }

    const result = engine.executePipeline(filesToRun);
    setExecutionResult(result);
    setIsRunning(false);
    onSubmissionCreated(result);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    const newFiles: RawFileInput[] = [];
    for (let i = 0; i < uploaded.length; i++) {
      const file = uploaded[i];
      newFiles.push({
        name: file.name,
        sizeBytes: file.size,
        type: file.type || 'application/pdf',
        contentSnippet: `Uploaded document: ${file.name}. Size: ${Math.round(file.size / 1024)} KB.`,
        senderEmail,
        channel: activeChannel
      });
    }
    setCustomFiles(newFiles);
    setSelectedScenario('scenario-custom');
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-700" />
              Retalyy 7-Component Ingestion Pipeline Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Every channel feeds one ingestion gateway, and a staged pipeline processes each submission before reaching an accountant. Test automated triage, duplicate detection, and checklist rule enforcement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
            >
              {isRunning ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Executing Pipeline...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Pipeline Simulation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Test Scenarios & Inbound Configuration */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Select Test Scenario
            </h3>

            <div className="space-y-2">
              {scenarios.map(scen => (
                <div
                  key={scen.id}
                  onClick={() => handleSelectScenario(scen.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedScenario === scen.id
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{scen.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{scen.badge}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {scen.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Custom Input Fields if Custom Scenario */}
            {selectedScenario === 'scenario-custom' && (
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Upload Real PDF / Image or Mock Text
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Or paste document snippet text:
                  </label>
                  <textarea
                    value={customFileContent}
                    onChange={e => setCustomFileContent(e.target.value)}
                    placeholder="e.g. JPMorgan Chase Bank statement for Acme Industrial Logistics, ending balance $184,290.44..."
                    rows={3}
                    className="w-full text-xs p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Channel & Sender configuration */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Ingestion Channel
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveChannel('email')}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                    activeChannel === 'email'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Gateway
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('portal')}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                    activeChannel === 'portal'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Client Portal
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Sender Address:</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={e => setSenderEmail(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-200 rounded-md text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: 7-Stage Pipeline Live Execution */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Live 7-Stage Processing Pipeline
              </h3>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {isRunning ? 'Pipeline running...' : executionResult ? 'Execution completed' : 'Ready'}
              </span>
            </div>

            {/* The 7 Components Grid */}
            <div className="space-y-3">
              {[
                {
                  num: 1,
                  name: 'Ingestion Gateway',
                  desc: 'Normalizes portal & email uploads; scans malware; writes immutable SHA-256 blobs.'
                },
                {
                  num: 2,
                  name: 'Client and Period Resolver',
                  desc: 'Resolves client & accounting period using sender domain and metadata. Low confidence triggers triage.'
                },
                {
                  num: 3,
                  name: 'Document Processor',
                  desc: 'Readability quality check (glare/blur); duplicate detection via hash and totals matching.'
                },
                {
                  num: 4,
                  name: 'Classifier and Extractor',
                  desc: 'Document-vision model classifying statement type, account suffix, date range, and confidence.'
                },
                {
                  num: 5,
                  name: 'Checklist Engine',
                  desc: 'Deterministic plain rules (not LLM) comparing extracted docs to client checklist. Explainable.'
                },
                {
                  num: 6,
                  name: 'Follow-up Drafter',
                  desc: 'Drafts missing-document email specifying exact items and deadline; held for human approval.'
                },
                {
                  num: 7,
                  name: 'Case Router',
                  desc: 'Creates case record, assigns accountant by client ownership and workload, sets SLA due date.'
                }
              ].map((stage, idx) => {
                const isCurrent = activeStageIndex === idx;
                const isFinished = activeStageIndex > idx || (executionResult && !isRunning);
                const stageEvent = executionResult?.stageEvents.find(e => e.stageNumber === stage.num);

                return (
                  <div
                    key={stage.num}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : isFinished
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-100 bg-slate-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-mono ${
                          isFinished
                            ? 'bg-slate-900 text-white'
                            : isCurrent
                            ? 'bg-sky-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {stage.num}
                        </span>
                        <span className="font-semibold text-xs text-slate-900">
                          {stage.name}
                        </span>
                      </div>

                      <div className="text-right">
                        {isCurrent && (
                          <span className="text-[11px] text-sky-600 font-medium animate-pulse">
                            Processing...
                          </span>
                        )}
                        {isFinished && stageEvent && (
                          <span className="text-[11px] font-mono tabular-nums text-slate-500">
                            {stageEvent.durationMs}ms · {stageEvent.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 pl-7 leading-relaxed">
                      {stageEvent ? stageEvent.summary : stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Execution Result Actions */}
            {executionResult && (
              <div className="mt-6 p-4 bg-slate-900 text-white rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Submission Processed: {executionResult.submission.submissionNumber}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Case #{executionResult.caseTask.caseNumber} · State: {executionResult.caseTask.state.replace('_', ' ').toUpperCase()} · Assigned to {executionResult.caseTask.assignee}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenCase(executionResult.caseTask.id)}
                    className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    Inspect in Cases View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span>
                    Checklist satisfied: {executionResult.caseTask.satisfiedDocsCount} of {executionResult.caseTask.expectedDocsCount} items
                  </span>
                  <span>
                    Findings: {executionResult.submission.findings.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
