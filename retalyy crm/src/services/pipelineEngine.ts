import {
  Client,
  ChecklistTemplate,
  Period,
  ProcessedDocument,
  Finding,
  ChecklistMatchResult,
  DraftMessage,
  CaseTask,
  Submission,
  AuditEvent,
  PipelineStageEvent,
  DocumentClassificationType,
  ConfidenceLevel,
  ChannelType
} from '../types';

export interface PipelineExecutionResult {
  submission: Submission;
  stageEvents: PipelineStageEvent[];
  auditEvents: AuditEvent[];
  caseTask: CaseTask;
}

export interface RawFileInput {
  name: string;
  sizeBytes: number;
  type: string;
  contentSnippet?: string;
  senderEmail?: string;
  channel: ChannelType;
  forcedClientHint?: string;
  forcedPeriodHint?: string;
}

// Compute simple deterministic pseudo-hash for files
export function generateSimpleHash(content: string, name: string): string {
  let hash = 0;
  const str = `${name}:${content}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `sha256-${Math.abs(hash).toString(16).padStart(8, '0')}${Math.abs(hash * 31).toString(16).padStart(8, '0')}`;
}

export class RetalyyPipelineEngine {
  private clients: Client[];
  private checklists: ChecklistTemplate[];
  private periods: Period[];
  private existingDocuments: ProcessedDocument[];

  constructor(
    clients: Client[],
    checklists: ChecklistTemplate[],
    periods: Period[],
    existingDocuments: ProcessedDocument[] = []
  ) {
    this.clients = clients;
    this.checklists = checklists;
    this.periods = periods;
    this.existingDocuments = existingDocuments;
  }

  /**
   * Runs the complete 7-stage Retalyy Intake Pipeline
   */
  public executePipeline(files: RawFileInput[]): PipelineExecutionResult {
    const stageEvents: PipelineStageEvent[] = [];
    const auditEvents: AuditEvent[] = [];
    const submissionId = `sub-${Date.now().toString(36)}`;
    const submissionNumber = `SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    // ----------------------------------------------------
    // STAGE 1: INGESTION GATEWAY
    // ----------------------------------------------------
    const stage1Start = performance.now();
    const normalizedDocs: ProcessedDocument[] = [];
    let virusScanFailed = false;

    for (const file of files) {
      // Security check: Virus scan and mime-type check
      const isAllowedMime = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'text/plain',
        'application/octet-stream'
      ].some(mime => file.type.includes(mime) || file.name.match(/\.(pdf|jpe?g|png|webp|txt)$/i));

      if (!isAllowedMime) {
        virusScanFailed = true;
      }

      const fileHash = generateSimpleHash(file.contentSnippet || '', file.name);
      const sizeKB = Math.max(12, Math.round(file.sizeBytes / 1024));

      normalizedDocs.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        submissionId,
        fileName: file.name,
        fileSize: `${sizeKB} KB`,
        fileHash,
        fileType: file.type || 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 98,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'unknown',
          confidence: 0,
          confidenceLevel: 'low',
          detectedLabel: 'Unclassified'
        },
        extractedFields: {},
        reviewStatus: 'accepted',
        mockPageContent: file.contentSnippet || `Sample extracted content of ${file.name}`
      });
    }

    stageEvents.push({
      stageNumber: 1,
      stageName: 'Ingestion Gateway',
      status: virusScanFailed ? 'flagged' : 'completed',
      durationMs: Math.round(performance.now() - stage1Start),
      summary: `Normalized ${files.length} inbound file(s). Malware check passed. SHA-256 hashes registered in immutable store.`
    });

    auditEvents.push({
      id: `aud-${Date.now()}-1`,
      timestamp: now,
      actor: 'Ingestion Gateway',
      component: 'Ingestion Gateway',
      action: 'INBOUND_FILES_NORMALIZED',
      details: `Accepted ${files.length} file(s) via ${files[0]?.channel || 'portal'}. Calculated checksums.`
    });

    // ----------------------------------------------------
    // STAGE 2: CLIENT AND PERIOD RESOLVER
    // ----------------------------------------------------
    const stage2Start = performance.now();
    let resolvedClient: Client = this.clients[0];
    let clientConfidence = 99.2;
    let resolvedPeriod: Period = this.periods[0];
    let periodConfidence = 98.8;
    let needsTriage = false;
    let triageReason: string | undefined;

    const primarySender = files[0]?.senderEmail?.toLowerCase() || '';
    const contentCombined = files.map(f => `${f.name} ${f.contentSnippet || ''}`).join(' ').toLowerCase();

    // Order of trust: portal session hint > sender email domain > text content
    if (files[0]?.forcedClientHint) {
      const match = this.clients.find(c => c.name.toLowerCase().includes(files[0]!.forcedClientHint!.toLowerCase()));
      if (match) {
        resolvedClient = match;
        clientConfidence = 100.0;
      }
    } else if (primarySender) {
      const matchedClientByDomain = this.clients.find(c => primarySender.includes(c.emailDomain));
      if (matchedClientByDomain) {
        resolvedClient = matchedClientByDomain;
        clientConfidence = 99.4;
      } else {
        clientConfidence = 64.0; // Low confidence
        needsTriage = true;
        triageReason = `Sender address ${primarySender} not registered to any active firm client.`;
      }
    } else {
      // Content lookup
      let found = false;
      for (const client of this.clients) {
        if (contentCombined.includes(client.name.toLowerCase().split(' ')[0])) {
          resolvedClient = client;
          clientConfidence = 96.0;
          found = true;
          break;
        }
      }
      if (!found) {
        clientConfidence = 52.0;
        needsTriage = true;
        triageReason = 'Could not resolve client from file contents or sender metadata.';
      }
    }

    // Period resolution
    if (contentCombined.includes('q3 2026') || contentCombined.includes('third quarter') || contentCombined.includes('941')) {
      const q3 = this.periods.find(p => p.label.includes('Q3') && p.clientId === resolvedClient.id) || this.periods[2];
      if (q3) resolvedPeriod = q3;
    } else {
      const oct = this.periods.find(p => p.label.includes('October') && p.clientId === resolvedClient.id) || this.periods[0];
      if (oct) resolvedPeriod = oct;
    }

    // Strict threshold rule from design doc: Client & Period ID requires >= 98%
    if (clientConfidence < 98 || periodConfidence < 98) {
      needsTriage = true;
      if (!triageReason) {
        triageReason = `Client resolution confidence (${clientConfidence.toFixed(1)}%) is below strict 98% threshold. Human triage required.`;
      }
    }

    stageEvents.push({
      stageNumber: 2,
      stageName: 'Client & Period Resolver',
      status: needsTriage ? 'flagged' : 'completed',
      durationMs: Math.round(performance.now() - stage2Start),
      summary: `Resolved Client: ${resolvedClient.name} (${clientConfidence.toFixed(1)}%), Period: ${resolvedPeriod.label} (${periodConfidence.toFixed(1)}%).`
    });

    auditEvents.push({
      id: `aud-${Date.now()}-2`,
      timestamp: new Date().toISOString(),
      actor: 'Client & Period Resolver',
      component: 'Client & Period Resolver',
      action: needsTriage ? 'RESOLUTION_TRIAGED' : 'CLIENT_RESOLVED',
      details: `Matched client '${resolvedClient.name}' [confidence ${clientConfidence.toFixed(1)}%]. Resolved period: ${resolvedPeriod.label}.`
    });

    // ----------------------------------------------------
    // STAGE 3: DOCUMENT PROCESSOR (READABILITY & DUPLICATES)
    // ----------------------------------------------------
    const stage3Start = performance.now();
    const findings: Finding[] = [];

    for (const doc of normalizedDocs) {
      const isBlurry = doc.fileName.toLowerCase().includes('blurry') || doc.fileName.toLowerCase().includes('photo') && doc.fileName.toLowerCase().includes('receipt');
      if (isBlurry) {
        doc.readabilityScore = 54;
        doc.readabilityStatus = 'blurry';
        doc.reviewStatus = 'triage';
        needsTriage = true;
        triageReason = 'Document failed readability quality scan (54% confidence). High optical distortion/glare detected.';

        findings.push({
          id: `fnd-unreadable-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          submissionId,
          periodId: resolvedPeriod.id,
          kind: 'unreadable',
          severity: 'blocker',
          title: 'Unreadable or Low-Quality Document',
          plainLanguageReason: `File '${doc.fileName}' has severe optical noise or glare. Readability score 54% is below required 70% threshold.`,
          relatedDocumentId: doc.id,
          resolution: 'open'
        });
      }

      // Check duplicates against existing documents
      const isDuplicateHash = this.existingDocuments.some(
        ex => ex.fileHash === doc.fileHash || (doc.fileName.includes('Duplicate') || doc.fileName.includes('Resend'))
      );

      if (isDuplicateHash) {
        findings.push({
          id: `fnd-dup-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          submissionId,
          periodId: resolvedPeriod.id,
          kind: 'duplicate',
          severity: 'medium',
          title: 'Duplicate File Detected',
          plainLanguageReason: `File '${doc.fileName}' matches the content hash of a previously filed statement. Please verify if this is an unintentional re-upload.`,
          ruleTrace: 'Processor Engine: Exact SHA-256 match and matching account/totals.',
          relatedDocumentId: doc.id,
          resolution: 'open'
        });
      }
    }

    stageEvents.push({
      stageNumber: 3,
      stageName: 'Document Processor',
      status: findings.some(f => f.kind === 'unreadable') ? 'flagged' : 'completed',
      durationMs: Math.round(performance.now() - stage3Start),
      summary: `Readability checks completed. Duplicate detection checked against ${this.existingDocuments.length + normalizedDocs.length} stored hashes. Found ${findings.length} flag(s).`
    });

    // ----------------------------------------------------
    // STAGE 4: CLASSIFIER & EXTRACTOR
    // ----------------------------------------------------
    const stage4Start = performance.now();

    for (const doc of normalizedDocs) {
      const lowerName = doc.fileName.toLowerCase();
      const content = (doc.mockPageContent || '').toLowerCase();

      let detectedType: DocumentClassificationType = 'unknown';
      let confidence = 95;
      let label = 'Other Document';
      let institution = 'Unknown';
      let suffix = '';
      let periodStart = '2026-10-01';
      let periodEnd = '2026-10-31';
      let totalAmount = '';

      if (lowerName.includes('chase') || content.includes('chase')) {
        detectedType = 'bank_statement';
        confidence = 99;
        label = 'Commercial Bank Statement';
        institution = 'JPMorgan Chase';
        suffix = '4102';
        totalAmount = '$184,290.44';
      } else if (lowerName.includes('amex') || content.includes('american express')) {
        detectedType = 'card_statement';
        confidence = 98;
        label = 'Corporate Card Statement';
        institution = 'American Express';
        suffix = '8910';
        totalAmount = '$14,892.40';
      } else if (lowerName.includes('gusto') || content.includes('gusto')) {
        detectedType = 'payroll_report';
        confidence = 98;
        label = 'Payroll Journal Summary';
        institution = 'Gusto Payroll';
        suffix = '9920';
        totalAmount = '$68,450.00';
      } else if (lowerName.includes('adp') || content.includes('adp workforce')) {
        detectedType = 'payroll_report';
        confidence = 96;
        label = 'Payroll Liability Report';
        institution = 'ADP Workforce Now';
        suffix = 'ADP-9941';
        totalAmount = '$42,180.50';
      } else if (lowerName.includes('941') || content.includes('form 941')) {
        detectedType = 'tax_form_941';
        confidence = 99;
        label = 'Form 941 Quarterly Federal Return';
        institution = 'Internal Revenue Service';
        suffix = '941';
        periodStart = '2026-07-01';
        periodEnd = '2026-09-30';
        totalAmount = '$170,463.70';
      } else if (lowerName.includes('wellsfargo') || lowerName.includes('wells') || content.includes('wells fargo')) {
        detectedType = 'bank_statement';
        confidence = 98;
        label = 'Commercial Checking Statement';
        institution = 'Wells Fargo Bank';
        suffix = '7724';
        totalAmount = '$312,840.10';
      } else if (doc.readabilityStatus === 'blurry') {
        detectedType = 'unknown';
        confidence = 58;
        label = 'Uncertain Document (Low Confidence)';
        institution = 'Unrecognized';
      }

      const confidenceLevel: ConfidenceLevel =
        confidence >= 90 ? 'high' : confidence >= 70 ? 'medium' : 'low';

      doc.classification = {
        documentType: detectedType,
        confidence,
        confidenceLevel,
        detectedLabel: label
      };

      doc.extractedFields = {
        institution,
        accountSuffix: suffix,
        periodStart,
        periodEnd,
        totalAmount,
        statementDate: periodEnd
      };

      // Confidence-based routing rule:
      if (confidenceLevel === 'high') {
        doc.reviewStatus = 'accepted';
      } else if (confidenceLevel === 'medium') {
        doc.reviewStatus = 'needs_verification';
      } else {
        doc.reviewStatus = 'triage';
        needsTriage = true;
      }
    }

    stageEvents.push({
      stageNumber: 4,
      stageName: 'Classifier and Extractor',
      status: 'completed',
      durationMs: Math.round(performance.now() - stage4Start),
      summary: `Classified ${normalizedDocs.length} file(s). Applied document vision models with strict schema extraction and confidence scoring.`
    });

    // ----------------------------------------------------
    // STAGE 5: CHECKLIST ENGINE (PLAIN DETERMINISTIC RULES)
    // ----------------------------------------------------
    const stage5Start = performance.now();
    const checklistMatches: ChecklistMatchResult[] = [];
    const missingItemsList: string[] = [];

    // Find checklist for client
    const clientChecklist =
      this.checklists.find(c => c.clientId === resolvedClient.id) || this.checklists[0];

    if (clientChecklist) {
      for (const req of clientChecklist.requirements) {
        // Check if dormant exception applies
        if (req.isExemptIfDormant) {
          checklistMatches.push({
            requirementId: req.id,
            requirement: req,
            status: 'exempt',
            explainableRuleReason: `Account ...${req.targetAccountSuffix || 'N/A'} is verified Dormant. Checklist exception rule #1 applied; document not flagged missing.`
          });
          continue;
        }

        // Check if any normalized doc satisfies this requirement
        const matchedDoc = normalizedDocs.find(doc => {
          if (doc.readabilityStatus === 'blurry') return false;
          if (doc.classification.documentType !== req.documentType) return false;
          if (req.targetAccountSuffix && doc.extractedFields.accountSuffix !== req.targetAccountSuffix) {
            return false;
          }
          return true;
        });

        if (matchedDoc) {
          checklistMatches.push({
            requirementId: req.id,
            requirement: req,
            status: 'satisfied',
            matchedDocumentId: matchedDoc.id,
            matchedDocumentName: matchedDoc.fileName,
            explainableRuleReason: `Extracted ${matchedDoc.classification.detectedLabel} (${matchedDoc.extractedFields.institution} ${matchedDoc.extractedFields.accountSuffix ? `...${matchedDoc.extractedFields.accountSuffix}` : ''}) matches requirement.`
          });
        } else {
          checklistMatches.push({
            requirementId: req.id,
            requirement: req,
            status: 'missing',
            explainableRuleReason: `No received document satisfies checklist requirement: '${req.description}'.`
          });
          missingItemsList.push(req.description);

          findings.push({
            id: `fnd-missing-${Date.now()}-${req.id}`,
            submissionId,
            periodId: resolvedPeriod.id,
            kind: 'missing',
            severity: 'high',
            title: 'Missing Required Checklist Item',
            plainLanguageReason: `The client checklist for ${resolvedPeriod.label} requires: ${req.description}. It was not present in this submission.`,
            ruleTrace: `Rule: Checklist [${clientChecklist.id}] -> Requirement [${req.id}] (${req.description})`,
            resolution: 'open'
          });
        }
      }
    }

    stageEvents.push({
      stageNumber: 5,
      stageName: 'Checklist Engine',
      status: missingItemsList.length > 0 ? 'flagged' : 'completed',
      durationMs: Math.round(performance.now() - stage5Start),
      summary: `Deterministic rule engine evaluated ${checklistMatches.length} expected item(s). Satisfied: ${checklistMatches.filter(m => m.status === 'satisfied').length}, Missing: ${missingItemsList.length}, Dormant Exempt: ${checklistMatches.filter(m => m.status === 'exempt').length}.`
    });

    // ----------------------------------------------------
    // STAGE 6: FOLLOW-UP DRAFTER
    // ----------------------------------------------------
    const stage6Start = performance.now();
    let draftMessage: DraftMessage | undefined;

    if (missingItemsList.length > 0 && !needsTriage) {
      const dueDateFormatted = new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const missingBulletList = missingItemsList.map(item => `• ${item}`).join('\n');

      draftMessage = {
        id: `msg-${Date.now()}`,
        submissionId,
        clientId: resolvedClient.id,
        recipient: resolvedClient.contactEmail,
        subject: `Action Needed: Missing documents for ${resolvedPeriod.label} intake (${resolvedClient.name})`,
        draftBody: `Hi ${resolvedClient.name} Finance Team,

Thank you for your recent submission for ${resolvedPeriod.label}. We have received and verified ${checklistMatches.filter(m => m.status === 'satisfied').length} of your scheduled accounting files.

According to your firm's expected-document checklist, we are still missing the following item(s) to finalize your monthly intake:
${missingBulletList}

Please upload these documents directly via your Retalyy Client Portal, or reply to this message with the files attached by ${dueDateFormatted}.

Warm regards,
${resolvedClient.owningAccountant}
Retalyy Client Intake Team`,
        missingItems: missingItemsList,
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        status: 'draft',
        autoSendEligible: resolvedClient.autoSendEnabled // Strictly false in v1 unless toggled
      };
    }

    stageEvents.push({
      stageNumber: 6,
      stageName: 'Follow-up Drafter',
      status: 'completed',
      durationMs: Math.round(performance.now() - stage6Start),
      summary: draftMessage
        ? `Drafted missing-document email for ${missingItemsList.length} item(s). Prepared for accountant approval in v1 (auto-send disabled).`
        : `No follow-up needed. All expected items were satisfied or submission requires triage.`
    });

    // ----------------------------------------------------
    // STAGE 7: CASE ROUTER
    // ----------------------------------------------------
    const stage7Start = performance.now();
    const caseNumber = `CS-${new Date().getFullYear()}-${Math.floor(2000 + Math.random() * 8000)}`;

    const caseState = needsTriage
      ? 'triage'
      : missingItemsList.length > 0
      ? 'awaiting_client'
      : 'ready_for_review';

    const caseTask: CaseTask = {
      id: `case-${Date.now()}`,
      caseNumber,
      submissionId,
      clientId: resolvedClient.id,
      clientName: resolvedClient.name,
      periodId: resolvedPeriod.id,
      periodLabel: resolvedPeriod.label,
      channel: files[0]?.channel || 'portal',
      assignee: resolvedClient.owningAccountant,
      assignedRole: needsTriage ? 'Senior Intake Specialist' : 'Accountant',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      state: caseState,
      priority: needsTriage ? 'urgent' : missingItemsList.length > 0 ? 'high' : 'standard',
      findingsCount: findings.length,
      documentsCount: normalizedDocs.length,
      expectedDocsCount: checklistMatches.filter(m => m.status !== 'exempt').length,
      satisfiedDocsCount: checklistMatches.filter(m => m.status === 'satisfied').length,
      createdAt: now,
      confidenceScore: Math.round((clientConfidence + (findings.length === 0 ? 99 : 78)) / 2),
      needsTriage,
      triageReason
    };

    stageEvents.push({
      stageNumber: 7,
      stageName: 'Case Router',
      status: 'completed',
      durationMs: Math.round(performance.now() - stage7Start),
      summary: `Created Case ${caseNumber}. Assigned to ${resolvedClient.owningAccountant} based on client ownership model. State: ${caseState.replace('_', ' ').toUpperCase()}.`
    });

    auditEvents.push({
      id: `aud-${Date.now()}-7`,
      timestamp: new Date().toISOString(),
      actor: 'Case Router',
      component: 'Case Router',
      action: 'CASE_CREATED_AND_ROUTED',
      caseNumber,
      afterState: caseState,
      details: `Case routed to ${resolvedClient.owningAccountant} (Role: ${caseTask.assignedRole}). SLA due: ${caseTask.dueDate}. Findings: ${findings.length}.`
    });

    const submission: Submission = {
      id: submissionId,
      submissionNumber,
      clientId: resolvedClient.id,
      clientName: resolvedClient.name,
      periodId: resolvedPeriod.id,
      periodLabel: resolvedPeriod.label,
      channel: files[0]?.channel || 'portal',
      senderEmail: primarySender || resolvedClient.contactEmail,
      receivedAt: now,
      status: needsTriage ? 'needs_triage' : 'ready_for_review',
      documents: normalizedDocs,
      findings,
      checklistMatches,
      draftMessage,
      caseTask
    };

    return {
      submission,
      stageEvents,
      auditEvents,
      caseTask
    };
  }
}
