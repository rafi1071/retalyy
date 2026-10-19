import React, { useState } from 'react';
import {
  INITIAL_CLIENTS,
  INITIAL_ACCOUNTS,
  INITIAL_CHECKLISTS,
  INITIAL_PERIODS,
  INITIAL_CASES,
  INITIAL_SUBMISSIONS,
  INITIAL_AUDIT_LOG,
  INITIAL_PROPOSALS
} from './data/mockData';
import {
  Client,
  ClientAccount,
  ChecklistTemplate,
  Period,
  CaseTask,
  Submission,
  ProcessedDocument,
  AuditEvent,
  ChecklistProposal,
  ChecklistRequirement,
  DocumentClassificationType,
  IdentityDocument
} from './types';
import { Header, ActiveNavTab } from './components/Header';
import { ClientFolderTree } from './components/FileManager/ClientFolderTree';
import { FileExplorer } from './components/FileManager/FileExplorer';
import { FileInspector } from './components/FileManager/FileInspector';
import { AttentionView } from './components/FileManager/AttentionView';
import { UploadModal } from './components/FileManager/UploadModal';
import { ChecklistManager } from './components/ChecklistManager';
import { ClientPortalView } from './components/ClientPortalView';
import { AuditTrailView } from './components/AuditTrailView';
import { OnboardingPage } from './components/Onboarding/OnboardingPage';
import { OnboardingQueueView } from './components/Onboarding/OnboardingQueueView';
import { RetalyyPipelineEngine } from './services/pipelineEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('files');

  // Application State
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [accounts, setAccounts] = useState<ClientAccount[]>(INITIAL_ACCOUNTS);
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>(INITIAL_CHECKLISTS);
  const [periods, setPeriods] = useState<Period[]>(INITIAL_PERIODS);
  const [cases, setCases] = useState<CaseTask[]>(INITIAL_CASES);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>(INITIAL_SUBMISSIONS);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(INITIAL_AUDIT_LOG);
  const [proposals, setProposals] = useState<ChecklistProposal[]>(INITIAL_PROPOSALS);

  // Folder Explorer Selection State
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || 'cli-acme');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(periods[0]?.id || 'per-acme-oct2026');
  const [selectedDocId, setSelectedDocId] = useState<string | null>('doc-acme-chase');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Currently active client & period objects
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const currentPeriod = periods.find(p => p.id === selectedPeriodId && p.clientId === selectedClientId) ||
    periods.find(p => p.clientId === selectedClientId) || periods[0];
  const currentChecklist = checklists.find(c => c.clientId === selectedClientId) || checklists[0];

  // Find submission for current folder
  const currentSubmission = Object.values(submissions).find(
    s => s.clientId === currentClient.id && s.periodId === currentPeriod.id
  ) || submissions['sub-acme-01'];

  // Selected document for right inspector
  const currentDocument = currentSubmission?.documents.find(d => d.id === selectedDocId) ||
    currentSubmission?.documents[0] || null;

  // Counts
  const attentionCount = Object.values(submissions).reduce((acc, sub) => {
    return acc + (sub.findings?.filter(f => f.resolution !== 'resolved').length || 0);
  }, 0);

  const pendingOnboardingCount = clients.filter(c => c.status === 'pending_verification').length;

  // Handle folder selection from sidebar
  const handleSelectFolder = (clientId: string, periodId: string) => {
    setSelectedClientId(clientId);
    setSelectedPeriodId(periodId);

    // Pick first document in that folder
    const sub = Object.values(submissions).find(
      s => s.clientId === clientId && s.periodId === periodId
    );
    if (sub && sub.documents.length > 0) {
      setSelectedDocId(sub.documents[0].id);
    } else {
      setSelectedDocId(null);
    }
  };

  // Client Onboarding Complete Handler (from full page)
  const handleClientOnboarded = (data: {
    client: Client;
    accounts: ClientAccount[];
    checklist: ChecklistTemplate;
    period: Period;
  }) => {
    const { client, accounts: newAccs, checklist: newChk, period: newPer } = data;

    // 1. Add to clients
    setClients(prev => [client, ...prev]);

    // 2. Add accounts
    setAccounts(prev => [...newAccs, ...prev]);

    // 3. Add checklist
    setChecklists(prev => [newChk, ...prev]);

    // 4. Add period
    setPeriods(prev => [newPer, ...prev]);

    // 5. Create initial submission record for this client's folder
    const initialSubmissionId = `sub-${client.id}-oct2026`;
    const initialSubmission: Submission = {
      id: initialSubmissionId,
      submissionNumber: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: client.id,
      clientName: client.name,
      periodId: newPer.id,
      periodLabel: newPer.label,
      channel: 'portal',
      senderEmail: client.contactEmail,
      receivedAt: new Date().toISOString(),
      status: 'ready_for_review',
      documents: [],
      findings: [],
      checklistMatches: newChk.requirements.map(req => ({
        requirementId: req.id,
        requirement: req,
        status: 'missing' as const,
        explainableRuleReason: `Awaiting initial ${req.description} upload from client.`
      }))
    };

    setSubmissions(prev => ({
      ...prev,
      [initialSubmissionId]: initialSubmission
    }));

    // 6. Log onboarding audit event
    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: client.owningAccountant,
      component: 'Client Onboarding',
      action: 'CLIENT_ONBOARDING_COMPLETED',
      caseNumber: initialSubmission.submissionNumber,
      details: `Completed 7-step onboarding for ${client.name}. Master record created (EIN: ${client.masterRecord?.taxId || 'N/A'}), engagement fees set to ${client.engagementRecord?.monthlyFee}, and ${newChk.requirements.length} checklist items generated.`
    };
    setAuditLog(prev => [auditEvent, ...prev]);

    // 7. Navigate directly to this new client's folder in the file manager
    setSelectedClientId(client.id);
    setSelectedPeriodId(newPer.id);
    setSelectedDocId(null);
    setActiveTab('files');
  };

  // Activate pending client
  const handleActivateClient = (clientId: string) => {
    setClients(prev =>
      prev.map(c =>
        c.id === clientId
          ? {
              ...c,
              status: 'active' as const,
              masterRecord: c.masterRecord
                ? { ...c.masterRecord, clientStatus: 'active' as const }
                : undefined,
              complianceRecord: c.complianceRecord
                ? { ...c.complianceRecord, identityVerified: true, businessRegistrationVerified: true }
                : undefined
            }
          : c
      )
    );

    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Sarah Chen, CPA',
      component: 'Client Onboarding',
      action: 'CLIENT_VERIFICATION_APPROVED',
      details: `Accountant approved compliance verification checks for ${clientId} and activated document portal.`
    };
    setAuditLog(prev => [auditEvent, ...prev]);
  };

  // Identity document update handler
  const handleUpdateClientIdentityDoc = (clientId: string, doc: IdentityDocument) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          complianceRecord: {
            identityVerified: true,
            identityMethod: `Updated Document: ${doc.fileName}`,
            businessRegistrationVerified: c.complianceRecord?.businessRegistrationVerified ?? true,
            conflictCheckPassed: c.complianceRecord?.conflictCheckPassed ?? true,
            riskRating: c.complianceRecord?.riskRating ?? 'low',
            complianceNotes: `Primary officer identity document updated to "${doc.fileName}" (${doc.documentType}, #${doc.idNumber || 'N/A'}, Expiration: ${doc.expirationDate || 'N/A'}).`,
            ...c.complianceRecord,
            identityDocument: doc,
            reviewerSignOff: 'Sarah Chen, CPA',
            signOffDate: new Date().toISOString().split('T')[0]
          }
        };
      })
    );

    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Sarah Chen, CPA',
      component: 'Client Onboarding',
      action: 'IDENTITY_DOCUMENT_UPDATED',
      details: `Updated primary officer identity document for client to "${doc.fileName}" (${doc.documentType}, #${doc.idNumber || 'N/A'}).`
    };
    setAuditLog(prev => [auditEvent, ...prev]);
  };

  // Document update handler (from inspector)
  const handleUpdateDocument = (
    docId: string,
    updates: {
      documentType?: DocumentClassificationType;
      institution?: string;
      accountSuffix?: string;
      totalAmount?: string;
    }
  ) => {
    if (!currentSubmission) return;

    const now = new Date().toISOString();
    const updatedDocs = currentSubmission.documents.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        classification: {
          ...doc.classification,
          documentType: updates.documentType || doc.classification.documentType,
          detectedLabel: updates.documentType
            ? updates.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
            : doc.classification.detectedLabel
        },
        extractedFields: {
          ...doc.extractedFields,
          institution: updates.institution ?? doc.extractedFields.institution,
          accountSuffix: updates.accountSuffix ?? doc.extractedFields.accountSuffix,
          totalAmount: updates.totalAmount ?? doc.extractedFields.totalAmount
        },
        humanCorrection: {
          documentType: updates.documentType,
          accountSuffix: updates.accountSuffix,
          correctedBy: currentClient.owningAccountant,
          correctedAt: now
        },
        reviewStatus: 'overridden' as const
      };
    });

    // Re-evaluate checklist matches with updated documents
    const updatedMatches = (currentChecklist.requirements || []).map(req => {
      if (req.isExemptIfDormant) {
        return {
          requirementId: req.id,
          requirement: req,
          status: 'exempt' as const,
          explainableRuleReason: 'Account marked dormant.'
        };
      }
      const matched = updatedDocs.find(d => {
        if (d.classification.documentType !== req.documentType) return false;
        if (req.targetAccountSuffix && d.extractedFields.accountSuffix !== req.targetAccountSuffix) {
          return false;
        }
        return true;
      });

      return {
        requirementId: req.id,
        requirement: req,
        status: matched ? ('satisfied' as const) : ('missing' as const),
        matchedDocumentId: matched?.id,
        matchedDocumentName: matched?.fileName,
        explainableRuleReason: matched ? 'Matched requirement.' : 'No file found.'
      };
    });

    setSubmissions(prev => ({
      ...prev,
      [currentSubmission.id]: {
        ...currentSubmission,
        documents: updatedDocs,
        checklistMatches: updatedMatches
      }
    }));

    // Log to activity log
    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: now,
      actor: currentClient.owningAccountant,
      component: 'Human Accountant',
      action: 'FILE_DETAILS_UPDATED',
      caseNumber: currentSubmission.submissionNumber,
      details: `Accountant updated file details for ${docId}: Type: ${updates.documentType || 'kept'}, Account: ${updates.accountSuffix || 'kept'}`
    };
    setAuditLog(prev => [auditEvent, ...prev]);
  };

  // Upload file handler
  const handleUploadFile = (fileName: string, fileSize: number, content: string) => {
    const engine = new RetalyyPipelineEngine(
      clients,
      checklists,
      periods,
      Object.values(submissions).flatMap(s => s.documents)
    );

    const result = engine.executePipeline([
      {
        name: fileName,
        sizeBytes: fileSize,
        type: 'application/pdf',
        contentSnippet: content,
        senderEmail: currentClient.contactEmail,
        channel: 'portal',
        forcedClientHint: currentClient.name,
        forcedPeriodHint: currentPeriod.label
      }
    ]);

    // Merge new document into current submission
    const newDoc = result.submission.documents[0];
    if (newDoc && currentSubmission) {
      const mergedDocs = [newDoc, ...currentSubmission.documents];

      // Re-evaluate checklist
      const updatedMatches = currentChecklist.requirements.map(req => {
        if (req.isExemptIfDormant) {
          return {
            requirementId: req.id,
            requirement: req,
            status: 'exempt' as const,
            explainableRuleReason: 'Account marked dormant.'
          };
        }
        const matched = mergedDocs.find(d => {
          if (d.readabilityStatus === 'blurry') return false;
          if (d.classification.documentType !== req.documentType) return false;
          if (req.targetAccountSuffix && d.extractedFields.accountSuffix !== req.targetAccountSuffix) {
            return false;
          }
          return true;
        });

        return {
          requirementId: req.id,
          requirement: req,
          status: matched ? ('satisfied' as const) : ('missing' as const),
          matchedDocumentId: matched?.id,
          matchedDocumentName: matched?.fileName,
          explainableRuleReason: matched ? 'Document received and verified.' : 'Awaiting upload.'
        };
      });

      setSubmissions(prev => ({
        ...prev,
        [currentSubmission.id]: {
          ...currentSubmission,
          documents: mergedDocs,
          checklistMatches: updatedMatches,
          findings: [...result.submission.findings, ...currentSubmission.findings]
        }
      }));

      setSelectedDocId(newDoc.id);
      setIsInspectorOpen(true);
      setAuditLog(prev => [...result.auditEvents, ...prev]);
    }
  };

  // Resolve finding handler
  const handleResolveFinding = (findingId: string) => {
    setSubmissions(prev => {
      const updated: Record<string, Submission> = {};
      Object.entries(prev).forEach(([key, sub]) => {
        updated[key] = {
          ...sub,
          findings: sub.findings.map(f =>
            f.id === findingId ? { ...f, resolution: 'resolved' as const } : f
          )
        };
      });
      return updated;
    });

    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentClient.owningAccountant,
      component: 'Human Accountant',
      action: 'ISSUE_RESOLVED',
      details: `Marked issue as resolved by accountant.`
    };
    setAuditLog(prev => [auditEvent, ...prev]);
  };

  // Toggle account status
  const handleToggleAccountStatus = (accountId: string) => {
    setAccounts(prev =>
      prev.map(a =>
        a.id === accountId
          ? { ...a, status: a.status === 'active' ? 'dormant' : 'active' }
          : a
      )
    );
  };

  const existingAccountants = Array.from(
    new Set(clients.map(c => c.owningAccountant))
  );

  // If in dedicated full-page onboarding mode, render OnboardingPage as the full screen
  if (activeTab === 'onboard-new') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <OnboardingPage
          onCancel={() => setActiveTab('files')}
          onComplete={handleClientOnboarded}
          existingAccountants={existingAccountants}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        attentionCount={attentionCount}
        pendingOnboardingCount={pendingOnboardingCount}
        onOnboardClick={() => setActiveTab('onboard-new')}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* VIEW 1: CLIENT FILE MANAGER */}
        {activeTab === 'files' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Client Folders */}
            <ClientFolderTree
              clients={clients}
              periods={periods}
              submissions={submissions}
              selectedClientId={selectedClientId}
              selectedPeriodId={selectedPeriodId}
              onSelectFolder={handleSelectFolder}
              activeSpecialView="files"
              onSelectSpecialView={(v) => {
                if (v === 'attention') setActiveTab('attention');
                if (v === 'checklists') setActiveTab('checklists');
                if (v === 'portal') setActiveTab('portal');
                if (v === 'onboarding') setActiveTab('onboarding');
              }}
              onNewClientClick={() => setActiveTab('onboard-new')}
            />

            {/* Center: File Explorer Grid / List */}
            <FileExplorer
              client={currentClient}
              period={currentPeriod}
              submission={currentSubmission}
              checklist={currentChecklist}
              selectedDocId={selectedDocId}
              onSelectDocument={(id) => {
                setSelectedDocId(id);
                setIsInspectorOpen(true);
              }}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
              isInspectorOpen={isInspectorOpen}
            />

            {/* Right: File Details Inspector */}
            {isInspectorOpen && currentDocument && (
              <FileInspector
                document={currentDocument}
                onClose={() => setIsInspectorOpen(false)}
                onUpdateDocument={handleUpdateDocument}
              />
            )}
          </div>
        )}

        {/* VIEW 2: ONBOARDING & CLIENT PROFILE REGISTRY */}
        {activeTab === 'onboarding' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <OnboardingQueueView
              clients={clients}
              onOpenOnboardingModal={() => setActiveTab('onboard-new')}
              onSelectClientFolder={(cId) => {
                setSelectedClientId(cId);
                const p = periods.find(per => per.clientId === cId) || periods[0];
                setSelectedPeriodId(p.id);
                setActiveTab('files');
              }}
              onActivateClient={handleActivateClient}
              onUpdateClientIdentity={handleUpdateClientIdentityDoc}
            />
          </div>
        )}

        {/* VIEW 3: FILES NEEDING ATTENTION */}
        {activeTab === 'attention' && (
          <AttentionView
            submissions={submissions}
            clients={clients}
            onSelectDocument={(docId, cId, pId) => {
              setSelectedClientId(cId);
              setSelectedPeriodId(pId);
              setSelectedDocId(docId);
              setIsInspectorOpen(true);
              setActiveTab('files');
            }}
            onResolveFinding={handleResolveFinding}
            onOpenEmailModal={(client, item) => {
              setSelectedClientId(client.id);
              setEmailModalData({ isOpen: true, missingItems: [item] });
            }}
          />
        )}

        {/* VIEW 4: CHECKLIST RULES */}
        {activeTab === 'checklists' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <ChecklistManager
              clients={clients}
              accounts={accounts}
              checklists={checklists}
              proposals={proposals}
              onToggleAccountStatus={handleToggleAccountStatus}
              onAddRequirement={(templateId, req) => {
                const newReq = { ...req, id: `req-${Date.now()}` };
                setChecklists(prev =>
                  prev.map(c =>
                    c.id === templateId
                      ? { ...c, requirements: [...c.requirements, newReq], version: c.version + 1 }
                      : c
                  )
                );
              }}
              onRemoveRequirement={(templateId, reqId) => {
                setChecklists(prev =>
                  prev.map(c =>
                    c.id === templateId
                      ? { ...c, requirements: c.requirements.filter(r => r.id !== reqId) }
                      : c
                  )
                );
              }}
              onAcceptProposal={(proposalId) => {
                setProposals(prev =>
                  prev.map(p => (p.id === proposalId ? { ...p, status: 'accepted' as const } : p))
                );
              }}
              onDeclineProposal={(proposalId) => {
                setProposals(prev =>
                  prev.map(p => (p.id === proposalId ? { ...p, status: 'declined' as const } : p))
                );
              }}
            />
          </div>
        )}

        {/* VIEW 5: CLIENT PORTAL PREVIEW */}
        {activeTab === 'portal' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <ClientPortalView
              client={currentClient}
              checklist={currentChecklist}
              period={currentPeriod}
              submission={currentSubmission}
              onClientUpload={(fileName, content) => {
                handleUploadFile(fileName, 340 * 1024, content);
              }}
              onSendClientReply={(msg) => {
                const auditEvent: AuditEvent = {
                  id: `aud-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  actor: `${currentClient.name} (Client)`,
                  component: 'Ingestion Gateway',
                  action: 'CLIENT_REPLY',
                  details: `Client sent note: "${msg}"`
                };
                setAuditLog(prev => [auditEvent, ...prev]);
              }}
            />
          </div>
        )}

        {/* VIEW 6: ACTIVITY LOG */}
        {activeTab === 'audit' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <AuditTrailView auditLog={auditLog} />
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          client={currentClient}
          period={currentPeriod}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadFile={handleUploadFile}
        />
      )}
    </div>
  );
}
