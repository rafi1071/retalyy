export type ServiceType = 'bookkeeping' | 'tax' | 'payroll' | 'advisory' | 'audit';

export type ChannelType = 'portal' | 'email' | 'api' | 'bank_feed';

export type CaseState = 'triage' | 'ready_for_review' | 'awaiting_client' | 'in_progress' | 'closed';

export type PriorityLevel = 'urgent' | 'high' | 'standard';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type ClientLifecycleStatus = 'prospective' | 'pending_verification' | 'approved' | 'active';

export type LegalStructureType =
  | 'individual'
  | 'sole_proprietorship'
  | 'partnership'
  | 'llc'
  | 's_corp'
  | 'c_corp'
  | 'nonprofit'
  | 'other';

export type RiskRatingType = 'low' | 'medium' | 'high' | 'specialist_review';

export type DocumentClassificationType =
  | 'bank_statement'
  | 'card_statement'
  | 'payroll_report'
  | 'tax_form_941'
  | 'tax_form_1099'
  | 'sales_summary'
  | 'vendor_invoice'
  | 'receipt_batch'
  | 'unknown';

/**
 * 1. Client Master Record
 * Who they are, entity type, jurisdiction, ownership, tax profile
 */
export interface ClientMasterRecord {
  id: string;
  legalName: string;
  tradeName?: string;
  clientStatus: ClientLifecycleStatus;
  legalStructure: LegalStructureType;
  industry: string;
  country: string;
  stateJurisdiction: string;
  businessSize: string; // e.g. '$2.4M Annual / 18 Employees'
  taxId: string; // EIN / SSN
  registrationNumber: string;
  incorporationDate: string;
  registeredAddress: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
  beneficialOwners: {
    name: string;
    ownershipPercentage: number;
    role: string;
    idVerified: boolean;
  }[];
  fiscalYearEnd: string;
  accountingBasis: 'cash' | 'accrual';
  accountingSoftware: string;
  createdAt: string;
}

/**
 * 2. Engagement Record
 * Services purchased, responsibilities, fees, assigned staff, deadlines
 */
export interface EngagementRecord {
  id: string;
  clientId: string;
  services: ServiceType[];
  serviceFrequency: 'monthly' | 'quarterly' | 'annual';
  monthlyFee: string;
  setupFee?: string;
  billingCadence: 'monthly' | 'quarterly' | 'annual';
  startDate: string;
  assignedAccountant: string;
  assignedReviewer?: string;
  engagementAgreementSigned: boolean;
  agreementSignedDate?: string;
  taxAuthorizationForm8821: boolean;
  bankSystemAccessAuthorized: boolean;
  approvalStatus: 'pending_review' | 'approved' | 'rejected';
  approvedBy?: string;
  notes?: string;
}

export interface IdentityDocument {
  id: string;
  fileName: string;
  fileSize: string;
  documentType: 'passport' | 'drivers_license' | 'state_id' | 'national_id' | 'incorporation_cert';
  idNumber?: string;
  issuingAuthority?: string;
  expirationDate?: string;
  uploadedAt: string;
  verificationStatus: 'verified' | 'pending_review' | 'expired' | 'unreadable';
  previewSnippet?: string;
}

/**
 * Compliance & Acceptance Record
 */
export interface ComplianceRecord {
  identityVerified: boolean;
  identityMethod: string;
  identityDocument?: IdentityDocument;
  businessRegistrationVerified: boolean;
  conflictCheckPassed: boolean;
  riskRating: RiskRatingType;
  complianceNotes: string;
  reviewerSignOff?: string;
  signOffDate?: string;
}

export interface Client {
  id: string;
  name: string;
  serviceTypes: ServiceType[];
  owningAccountant: string;
  contactEmail: string;
  emailDomain: string;
  portalAccess: boolean;
  autoSendEnabled: boolean;
  totalSubmissions: number;
  falseMissingRate: number; // e.g. 0.007 = 0.7%
  status: ClientLifecycleStatus;
  masterRecord?: ClientMasterRecord;
  engagementRecord?: EngagementRecord;
  complianceRecord?: ComplianceRecord;
}

export interface ClientAccount {
  id: string;
  clientId: string;
  type: 'bank' | 'card' | 'payroll' | 'invoicing';
  institution: string;
  identifierSuffix: string; // e.g. '4102'
  status: 'active' | 'dormant';
  lastReconciled?: string;
  notes?: string;
}

export interface ChecklistRequirement {
  id: string;
  documentType: DocumentClassificationType;
  targetAccountSuffix?: string;
  targetInstitution?: string;
  description: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  isExemptIfDormant?: boolean;
}

export interface ChecklistTemplate {
  id: string;
  clientId: string;
  periodType: 'monthly' | 'quarterly' | 'annual';
  requirements: ChecklistRequirement[];
  exceptions: string[];
  version: number;
  lastUpdated: string;
}

export interface Period {
  id: string;
  clientId: string;
  label: string; // e.g. 'October 2026'
  startDate: string;
  endDate: string;
  deadline: string;
  status: 'open' | 'in_review' | 'complete';
}

export interface ProcessedDocument {
  id: string;
  submissionId: string;
  fileName: string;
  fileSize: string;
  fileHash: string;
  fileType: string;
  isVirusScanned: boolean;
  readabilityScore: number; // 0-100
  readabilityStatus: 'clear' | 'blurry' | 'truncated';
  classification: {
    documentType: DocumentClassificationType;
    confidence: number; // 0-100
    confidenceLevel: ConfidenceLevel;
    detectedLabel: string;
  };
  extractedFields: {
    institution?: string;
    accountSuffix?: string;
    periodStart?: string;
    periodEnd?: string;
    totalAmount?: string;
    statementDate?: string;
    pageCount?: number;
    einOrTaxId?: string;
    detectedAccountType?: string;
  };
  humanCorrection?: {
    documentType?: DocumentClassificationType;
    accountSuffix?: string;
    periodStart?: string;
    periodEnd?: string;
    correctedBy: string;
    correctedAt: string;
    notes?: string;
  };
  reviewStatus: 'accepted' | 'needs_verification' | 'triage' | 'overridden';
  rawSnippet?: string;
  mockPageContent?: string;
}

export interface Finding {
  id: string;
  submissionId: string;
  periodId: string;
  kind: 'missing' | 'duplicate' | 'unreadable' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'blocker';
  title: string;
  plainLanguageReason: string;
  ruleTrace?: string;
  relatedDocumentId?: string;
  resolution: 'open' | 'resolved' | 'dismissed';
}

export interface ChecklistMatchResult {
  requirementId: string;
  requirement: ChecklistRequirement;
  status: 'satisfied' | 'missing' | 'exempt';
  matchedDocumentId?: string;
  matchedDocumentName?: string;
  explainableRuleReason: string;
}

export interface DraftMessage {
  id: string;
  submissionId: string;
  clientId: string;
  recipient: string;
  subject: string;
  draftBody: string;
  missingItems: string[];
  dueDate: string;
  status: 'draft' | 'approved' | 'sent';
  approver?: string;
  sentAt?: string;
  autoSendEligible: boolean;
}

export interface CaseTask {
  id: string;
  caseNumber: string;
  submissionId: string;
  clientId: string;
  clientName: string;
  periodId: string;
  periodLabel: string;
  channel: ChannelType;
  assignee: string;
  assignedRole: string;
  dueDate: string;
  state: CaseState;
  priority: PriorityLevel;
  findingsCount: number;
  documentsCount: number;
  expectedDocsCount: number;
  satisfiedDocsCount: number;
  createdAt: string;
  confidenceScore: number;
  needsTriage: boolean;
  triageReason?: string;
}

export interface Submission {
  id: string;
  submissionNumber: string;
  clientId: string;
  clientName: string;
  periodId: string;
  periodLabel: string;
  channel: ChannelType;
  senderEmail: string;
  receivedAt: string;
  status: 'processing' | 'ready_for_review' | 'needs_triage' | 'completed';
  documents: ProcessedDocument[];
  findings: Finding[];
  checklistMatches: ChecklistMatchResult[];
  draftMessage?: DraftMessage;
  caseTask?: CaseTask;
}

export interface ChecklistProposal {
  id: string;
  clientId: string;
  clientName: string;
  proposedChange: string;
  reason: string;
  detectedFromDoc: string;
  status: 'pending_review' | 'accepted' | 'declined';
  proposedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  component:
    | 'Ingestion Gateway'
    | 'Client & Period Resolver'
    | 'Document Processor'
    | 'Classifier & Extractor'
    | 'Checklist Engine'
    | 'Follow-up Drafter'
    | 'Case Router'
    | 'Human Accountant'
    | 'Client Onboarding';
  action: string;
  caseNumber?: string;
  beforeState?: string;
  afterState?: string;
  details: string;
}

export interface PipelineStageEvent {
  stageNumber: number;
  stageName: string;
  status: 'pending' | 'running' | 'completed' | 'flagged' | 'failed';
  durationMs: number;
  summary: string;
  details?: Record<string, any>;
}
