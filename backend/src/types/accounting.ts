export type TransactionStatus =
  | 'extracted'
  | 'validated'
  | 'matched'
  | 'needs_review'
  | 'approved'
  | 'posted';

export type UserRole =
  | 'bookkeeper'
  | 'junior_accountant'
  | 'staff_accountant'
  | 'senior_accountant';

export type TreatmentType =
  | 'immediate_expense'
  | 'prepaid_asset'
  | 'capitalized_asset'
  | 'loan_repayment'
  | 'owner_withdrawal'
  | 'deferred_revenue'
  | 'split_transaction'
  | 'accrual';

export interface JournalLine {
  id: string;
  accountNumber: string;
  accountName: string;
  type: 'debit' | 'credit';
  amount: number;
  memo: string;
  taxCode?: string;
}

export interface ValidationFlag {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  code: string;
  message: string;
  resolved: boolean;
}

export interface SourceDocument {
  id: string;
  filename: string;
  docType: 'invoice' | 'receipt' | 'bank_statement' | 'bill' | 'credit_note' | 'contract';
  uploadedAt: string;
  fileSize: string;
  pageCount: number;
  extractedDate?: string;
  extractedAmount?: number;
  extractedVendor?: string;
  extractedInvoiceNumber?: string;
  extractedTaxAmount?: number;
  extractedCurrency?: string;
  ocrConfidence: number; // 0-100
  snippetUrl?: string;
  rawTextExcerpt?: string;
}

export interface MatchDetails {
  matchStatus: 'high_confidence' | 'probable' | 'partial' | 'transfer' | 'unmatched';
  confidence: number;
  matchedDocumentId?: string;
  matchedInvoiceNumber?: string;
  matchedAmount?: number;
  varianceAmount?: number;
  matchRuleUsed: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stepName: string;
  action: string;
  details: string;
}

export interface TransactionRecord {
  id: string;
  clientId: string;
  transactionDate: string; // ISO 8601
  accountingPeriod: string; // e.g. "2026-10"
  bankAccount: string;
  rawDescription: string;
  normalizedDescription: string;
  counterparty: string;
  direction: 'inflow' | 'outflow';
  amount: number; // positive number
  currency: string;
  fxRate?: number;
  baseAmount?: number; // in USD
  
  // Step 1: Extraction
  sourceDocument?: SourceDocument;
  extractedFields: {
    vendor: string;
    date: string;
    grossAmount: number;
    taxAmount: number;
    invoiceNumber?: string;
    currency: string;
  };

  // Step 2: Normalization & Validation
  isNormalized: boolean;
  validationFlags: ValidationFlag[];
  validationScore: number; // 0-100

  // Step 3: Match
  matching: MatchDetails;

  // Step 4: Classification
  accountCode: string;
  accountName: string;
  accountCategory: 'Revenue' | 'Expense' | 'Asset' | 'Liability' | 'Equity';
  taxCode: string;
  taxTreatment: string;
  taxDeductiblePercentage: number; // e.g. 100, 50, 0

  // Step 5: Treatment & Journal Entry
  treatmentType: TreatmentType;
  treatmentJustification: string;
  policyCitation: string;
  journalLines: JournalLine[];
  amortizationMonths?: number;
  monthlyAmortizationAmount?: number;

  // Step 6: Post / Approval
  status: TransactionStatus;
  autoPostEligible: boolean;
  reviewedBy?: string;
  approvedBy?: string;
  postedAt?: string;
  approvalHistory: AuditLogEntry[];
}

export interface ClientProfile {
  id: string;
  name: string;
  industry: string;
  accountingStandard: 'US GAAP (Accrual)' | 'IFRS' | 'Cash Basis';
  fiscalYearEnd: string;
  capitalizationThreshold: number; // e.g. 2500
  prepaymentThreshold: number; // e.g. 1000
  taxJurisdiction: string;
  chartOfAccountsCount: number;
}

export interface ChartOfAccountItem {
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  type: string;
  description: string;
}
