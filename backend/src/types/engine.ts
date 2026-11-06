export interface AssembledContext {
  clientIdentity: {
    name: string;
    id: string;
    businessType: string;
    industry: string;
    taxJurisdiction: string;
    entityStructure: string;
  };
  accountingConfiguration: {
    fiscalYearEnd: string;
    baseCurrency: string;
    accountingBasis: 'US GAAP (Accrual)' | 'IFRS' | 'Cash Basis';
    relevantAccountsSubset: {
      code: string;
      name: string;
      category: string;
      normalBalance: 'debit' | 'credit';
      description: string;
    }[];
  };
  transactionEvidence: {
    transactionId: string;
    bankFeedEntry: {
      date: string;
      amount: number;
      direction: 'inflow' | 'outflow';
      rawDescription: string;
      bankAccount: string;
    };
    sourceDocument?: {
      docId: string;
      docType: string;
      filename: string;
      extractedDate: string;
      extractedAmount: number;
      extractedVendor: string;
      extractedInvoiceNumber?: string;
      ocrConfidence: number;
      rawTextExcerpt: string;
    };
    servicePeriod?: string;
  };
  relevantPolicies: {
    capitalizationThreshold: number;
    prepaymentThreshold: number;
    prepaymentMinDurationDays: number;
    deMinimisSafeHarborApplies: boolean;
    mealsAndEntertainmentDeductibilityLimit: number;
  };
  applicableStandards: {
    standardCode: string;
    title: string;
    summary: string;
    ruleCriteria: string;
  }[];
  historicalPrecedents: {
    vendorName: string;
    pastTreatment: string;
    accountCode: string;
    sampleDate: string;
    cpaReviewerNotes: string;
    precedentConfidence: 'high' | 'provisional';
  }[];
  relatedRecords: {
    duplicateCandidateFound: boolean;
    duplicateReferenceId?: string;
    openInvoicesForVendor: number;
  };
  factClassification: {
    verifiedFacts: string[];
    clientProvidedInfo: string[];
    historicalPatterns: string[];
    workingAssumptions: string[];
  };
  tokenBudget: {
    allocatedTokens: number;
    estimatedPromptTokens: number;
    status: 'optimal' | 'approaching_limit';
  };
}

export interface AIStructuredProposal {
  transaction_id: string;
  event_type: string;
  counterparty: string;
  amount: number;
  currency: string;
  evidence: string[];
  matching: {
    status: 'matched' | 'unmatched' | 'probable' | 'partial';
    invoice_id?: string;
    confidence_score: number;
  };
  accounting_decision: {
    account_code: string;
    account_name: string;
    category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
    recognition: 'immediate' | 'over_subscription_period' | 'capitalized_depreciation' | 'deferred_milestone' | 'non_operating';
    amortization_months?: number;
    reason: string;
  };
  journal_entry: {
    lines: {
      account_code: string;
      account_name: string;
      debit: number;
      credit: number;
      memo: string;
    }[];
  };
  tax_analysis: {
    status: 'applicable' | 'requires_rule_evaluation' | 'exempt' | 'disallowed';
    jurisdiction: string;
    tax_code: string;
    deductible_percentage: number;
    citations: string[];
    evidence_required: string;
  };
  review: {
    status: 'pending_validation' | 'auto_approved_candidate' | 'escalation_required';
    issues: string[];
    confidence: number;
  };
}

export interface ValidationCheckResult {
  dimension:
    | 'arithmetic'
    | 'double_entry_balance'
    | 'account_validity'
    | 'evidence_grounding'
    | 'duplicate_detection'
    | 'policy_compliance'
    | 'tax_calculations'
    | 'anomaly_detection';
  name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: string;
  codeValidated: boolean; // Indicates verified by deterministic TS code, NOT LLM
}

export interface EngineValidationReport {
  passed: boolean;
  decision: 'auto_approve' | 'reprocess_with_feedback' | 'escalate_to_human';
  checks: ValidationCheckResult[];
  errors: string[];
  warnings: string[];
  correctable: boolean;
  retryCount: number;
  feedbackForRetry?: string;
}

export interface EngineExecutionTrace {
  transactionId: string;
  timestamp: string;
  context: AssembledContext;
  aiProposal: AIStructuredProposal;
  validationReport: EngineValidationReport;
  retryHistory: {
    attempt: number;
    feedbackGiven: string;
    correctedProposal?: AIStructuredProposal;
    validationOutcome: boolean;
  }[];
  finalStatus: 'auto_approved' | 'escalated_for_review' | 'posted_to_ledger';
  totalDurationMs: number;
}

export interface BenchmarkCaseResult {
  id: string;
  title: string;
  category: string;
  expectedTreatment: string;
  modelProposedTreatment: string;
  extractionAccuracy: number; // 0-100
  classificationPassed: boolean;
  journalBalanced: boolean;
  policyEnforced: boolean;
  taxRuleAccurate: boolean;
  exceptionCorrectlyHandled: boolean;
  validationDecision: 'auto_approve' | 'reprocess_with_feedback' | 'escalate_to_human';
  durationMs: number;
}

export interface BenchmarkSummary {
  runTimestamp: string;
  totalCases: number;
  overallScore: number;
  extractionAccuracyAvg: number;
  classificationAccuracyAvg: number;
  journalBalanceRate: number; // 100% enforced by validator
  policyComplianceRate: number;
  taxRuleAccuracyAvg: number;
  exceptionDetectionRate: number;
  cases: BenchmarkCaseResult[];
}
