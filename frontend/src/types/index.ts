export type NavigationTab = 
  | 'home' 
  | 'workspace'
  | 'business_crm'
  | 'solutions'
  | 'portal' 
  | 'mission' 
  | 'calculator' 
  | 'vault' 
  | 'firms' 
  | 'findings' 
  | 'contact' 
  | 'education' 
  | 'legal';

export interface FunctionalityModule {
  id: string;
  name: string;
  shortName: string;
  phase: string;
  phaseBadge: 'Launch' | 'Phase 2' | 'Phase 3';
  exactFunctions: string;
  solvedProblem: string;
  metricToTest: string;
  targetCustomer: string;
  capabilities: string[];
}

export type FilingStatus = 'single' | 'married_joint' | 'head_household' | 'married_separate';

export type EntityType = 
  | 'sole_proprietorship' 
  | 'single_member_llc' 
  | 'multi_member_llc' 
  | 's_corporation' 
  | 'c_corporation';

export type SCorpStatus = 'not_elected' | 'considering' | 'already_active';

export interface CalculatorInputs {
  fullName: string;
  email: string;
  phone?: string;
  role: 'self_employed' | 'firm';
  filingStatus: FilingStatus;
  state: string;
  netIncome: number;
  entityType: EntityType;
  sCorpStatus: SCorpStatus;
  retirementContribution: number;
  healthInsurancePaid: number;
  hasHomeOffice: boolean;
  marketingConsent: boolean;
  sourceUtm?: string;
}

export interface TaxCalculationResults {
  currentSeTax: number;
  currentFederalIncomeTax: number;
  currentStateIncomeTax: number;
  currentTotalTax: number;
  
  optimizedSeTax: number;
  optimizedFederalIncomeTax: number;
  optimizedStateIncomeTax: number;
  optimizedTotalTax: number;
  
  netAnnualSavings: number;
  sCorpSavings: number;
  retirementSavings: number;
  homeOfficeSavings: number;
  healthInsuranceSavings: number;
  qbiSavings: number;
  recommendedSalary: number;
  recommendedDistribution: number;
}

export interface StrategyFinding {
  id: string;
  title: string;
  category: 'entity' | 'retirement' | 'deduction' | 'penalty' | 'health';
  estimatedSavingsRange: [number, number];
  confidenceScore: number; // e.g. 96
  citation: string; // e.g. IRC §1362, IRC §199A
  citationSource: string; // e.g. "IRS Form 2553 & Rev. Rul. 74-44"
  assumptions: string[];
  actionSteps: string[];
  deadline: string;
  status: 'recommended' | 'in_review' | 'certified' | 'implemented';
  reviewerName: string;
  reviewerTitle: string;
  reviewedDate: string;
}

export interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  dba: string;
  ein: string;
  industryNaics: string;
  startDate: string;
  state: string;
  ownerPayHistory: string;
  priorYearReturnUploaded: boolean;
  priorYearFileName?: string;
  extractedNetProfit?: number;
  consentSigned: boolean;
  consentTimestamp?: string;
  consentSignatureText?: string;
  engagementLetterSigned: boolean;
  assignedCpa: string;
}

export interface FirmProfile {
  firmName: string;
  contactName: string;
  email: string;
  phone: string;
  size: '1-5' | '6-20' | '21-50' | '50+';
  credentials: string[];
  hasPtinEfin: boolean;
  primaryBrandColor: string;
  logoUrl?: string;
}

export interface TaxRuleReference {
  id: string;
  title: string;
  year2024: string;
  year2025: string;
  year2026: string;
  category: string;
  legalCitation: string;
  description: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  detail: string;
  date: string;
  type: 'action' | 'update' | 'security';
}

export type CategoryPackId = 
  | 'trades' 
  | 'freelancers' 
  | 'gig' 
  | 'sellers' 
  | 'landlords' 
  | 'services';

export interface CategoryPack {
  id: CategoryPackId;
  name: string;
  who: string;
  packRules: string;
  typicalMoneyPain: string;
  monthlyPriceAssumption: string;
  iconName: string;
  badge: string;
  launchPhase: 'Launch' | 'Phase 2' | 'Phase 3';
}

export interface CompanyTargetSize {
  segment: string;
  size: string;
  revenue: string;
  fit: 'Entry segment' | 'Best fit' | 'Later' | 'Not planned';
  reason: string;
  pricingHypothesis: string;
}

export interface JobCostRecord {
  id: string;
  jobCode: string;
  client: string;
  description: string;
  bidAmount: number;
  actualCost: number;
  projectedProfit: number;
  currentMarginPercent: number;
  marginStatus: 'healthy' | 'warning' | 'critical';
  progressBillingPercent: number;
  subcontractorCount: number;
  sub1099sChased: boolean;
}

export interface CashForecastWeek {
  weekNumber: number;
  weekDate: string;
  inflow: number;
  outflow: number;
  netCash: number;
  projectedBalance: number;
  safeHarborReserve: number;
}

// ==========================================
// RETALYY OPERATING SYSTEM DATA TYPES
// ==========================================

export interface ClientEntity {
  id: string;
  name: string;
  entityType: string;
  fiscalYearEnd: string;
  accountingBasis: 'cash' | 'accrual';
  state: string;
  status: 'active' | 'in_close' | 'closed' | 'onboarding';
  inboundEmailSlug: string;
  industry: string;
  staffReviewer: string;
  partnerCpa: string;
  qboConnected: boolean;
  plaidConnected: boolean;
  bankAccountMask: string;
  currentPeriod: string; // e.g. "October 2026"
}

export interface FirmSettings {
  firmName: string;
  autoApproveEnabled: boolean;
  autoApproveMinConfirmations: number;
  confidenceThreshold: number; // e.g. 0.95
  baselineMinutesPerTx: number; // 1.5
  baselineMinutesPerDoc: number; // 3.0
  firmHourlyBillingRate: number; // 175
  activeClientMonthlyFee: number; // 75
}

export type ReviewItemKind = 'categorization' | 'extraction' | 'match' | 'exception' | 'statement';
export type ReviewItemStatus = 'needs_review' | 'approved' | 'edited' | 'rejected' | 'skipped';

export interface ReviewItem {
  id: string;
  clientId: string;
  kind: ReviewItemKind;
  subjectType: 'bank_transaction' | 'document' | 'match';
  subjectId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  status: ReviewItemStatus;
  aiSuggestion: {
    accountId?: string;
    accountCode?: string;
    accountName?: string;
    confidence: number;
    rationale: string;
    model: string;
    promptVersion: string;
    matchType?: string;
    validationErrors?: string[];
    learnedRuleId?: string;
  };
  assignedTo: string;
  resolvedBy?: string;
  resolvedAt?: string;
  sourceDocumentId?: string;
  bankTransactionId?: string;
}

export interface BankTransaction {
  id: string;
  clientId: string;
  bankAccountId: string;
  postedDate: string;
  amountMinor: number; // Minor units (cents): negative for outflow, positive for deposit
  currency: string;
  descriptionRaw: string;
  descriptionClean: string;
  counterparty: string;
  status: 'new' | 'categorized' | 'matched' | 'exception' | 'ignored';
  source: 'plaid' | 'csv' | 'statement';
  categoryAccountId?: string;
  categoryAccountName?: string;
  matchedDocId?: string;
}

export interface DocumentLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceMinor: number;
  amountMinor: number;
}

export interface ExtractedDocument {
  id: string;
  clientId: string;
  source: 'upload' | 'portal' | 'email' | 'plaid';
  storageKey: string;
  sha256: string;
  mime: string;
  docType: 'receipt' | 'invoice' | 'bank_statement' | 'other';
  status: 'received' | 'classified' | 'extracted' | 'needs_review' | 'done' | 'failed';
  uploadedBy: string;
  uploadedAt: string;
  vendorName: string;
  documentDate: string;
  dueDate?: string;
  invoiceNumber?: string;
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  paymentMethod?: string;
  last4?: string;
  lineItems: DocumentLineItem[];
  fieldConfidence: Record<string, number>;
  validationErrors: string[];
  validationPassed: boolean;
  redactedPii: boolean;
}

export interface LedgerAccount {
  id: string;
  clientId: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense' | 'cogs';
  normalBalance: 'debit' | 'credit';
  parentCode?: string;
  currentBalanceMinor: number;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debitMinor: number;
  creditMinor: number;
}

export interface JournalEntry {
  id: string;
  clientId: string;
  entryDate: string;
  memo: string;
  reference: string;
  status: 'draft' | 'posted' | 'reversed';
  sourceType: 'bank_sync' | 'manual' | 'reconciliation' | 'close_adjustment';
  sourceId?: string;
  postedBy: string;
  postedAt: string;
  reversesEntryId?: string;
  lines: JournalLine[];
}

export interface ReconciliationMatch {
  id: string;
  clientId: string;
  bankTransactionId: string;
  documentId?: string;
  journalEntryId?: string;
  matchType: 'one_to_one' | 'split' | 'batch' | 'transfer';
  score: number;
  status: 'suggested' | 'confirmed' | 'rejected';
  reasons: string[];
  amountDifferenceMinor: number;
}

export interface CategorizationRule {
  id: string;
  scope: 'client' | 'firm' | 'global';
  clientId?: string;
  counterpartyPattern: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  confirmationsCount: number;
  createdFrom: 'manual' | 'learned';
  isActive: boolean;
  isProposed?: boolean;
}

export interface PeriodCloseTask {
  key: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  completedBy?: string;
}

export interface FinancialStatements {
  pnl: {
    revenueMinor: number;
    cogsMinor: number;
    grossProfitMinor: number;
    operatingExpensesMinor: number;
    netIncomeMinor: number;
    categories: Array<{ name: string; amountMinor: number }>;
  };
  balanceSheet: {
    totalAssetsMinor: number;
    totalLiabilitiesMinor: number;
    totalEquityMinor: number;
    isBalanced: boolean;
  };
  cashFlow: {
    operatingActivitiesMinor: number;
    investingActivitiesMinor: number;
    financingActivitiesMinor: number;
    netChangeInCashMinor: number;
    endingCashMinor: number;
  };
  trialBalance: {
    totalDebitsMinor: number;
    totalCreditsMinor: number;
    isBalanced: boolean;
  };
}

export interface PeriodCloseRecord {
  id: string;
  clientId: string;
  year: number;
  month: number;
  monthName: string;
  status: 'open' | 'in_review' | 'closed';
  closedBy?: string;
  closedAt?: string;
  tasks: PeriodCloseTask[];
  statements: FinancialStatements;
  aiNarrative: string;
  narrativeVerified: boolean;
  narrativeAuditNumbers: Array<{
    value: string;
    sourceField: string;
    verified: boolean;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorType: 'user' | 'ai' | 'system';
  actorName: string;
  action: string;
  subjectType: string;
  subjectId: string;
  details: string;
  inputHash: string;
  beforeState?: string;
  afterState?: string;
}

export interface DeadlineItem {
  id: string;
  title: string;
  jurisdiction: string;
  formNumber: string;
  dueDate: string;
  description: string;
  sourceUrl: string;
  verified: boolean;
  verifiedBy?: string;
  status: 'upcoming' | 'completed' | 'filed';
}

export interface ClientRequestItem {
  id: string;
  clientId: string;
  kind: 'missing_document' | 'question';
  title: string;
  description: string;
  amountMinor?: number;
  status: 'open' | 'sent' | 'answered' | 'closed';
  sentAt: string;
  clientAnswer?: string;
  answeredAt?: string;
  reminderCount: number;
  targetTransactionId?: string;
}
