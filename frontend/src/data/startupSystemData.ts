import {
  ClientEntity,
  FirmSettings,
  ReviewItem,
  BankTransaction,
  ExtractedDocument,
  LedgerAccount,
  JournalEntry,
  ReconciliationMatch,
  CategorizationRule,
  PeriodCloseRecord,
  AuditLogEntry,
  DeadlineItem,
  ClientRequestItem
} from '../types';

export const INITIAL_FIRM_SETTINGS: FirmSettings = {
  firmName: 'Cascade Accounting & Advisory LLP',
  autoApproveEnabled: false,
  autoApproveMinConfirmations: 3,
  confidenceThreshold: 0.95,
  baselineMinutesPerTx: 1.5,
  baselineMinutesPerDoc: 3.0,
  firmHourlyBillingRate: 175,
  activeClientMonthlyFee: 75
};

export const INITIAL_CLIENTS: ClientEntity[] = [
  {
    id: 'cli-apex',
    name: 'Apex Mechanical & HVAC Services LLC',
    entityType: 'multi_member_llc',
    fiscalYearEnd: '12-31',
    accountingBasis: 'cash',
    state: 'CA',
    status: 'in_close',
    inboundEmailSlug: 'apex-mechanical',
    industry: 'Commercial HVAC & Mechanical Trades',
    staffReviewer: 'Elena Rostova, Senior Bookkeeper',
    partnerCpa: 'Marcus Vance, CPA, MST (License #89214-CA)',
    qboConnected: true,
    plaidConnected: true,
    bankAccountMask: 'Chase Operating x4409',
    currentPeriod: 'October 2026'
  },
  {
    id: 'cli-miller',
    name: 'Miller Cloud Systems LLC',
    entityType: 's_corporation',
    fiscalYearEnd: '12-31',
    accountingBasis: 'accrual',
    state: 'CA',
    status: 'active',
    inboundEmailSlug: 'miller-cloud',
    industry: 'Cloud Infrastructure & Tech Consulting',
    staffReviewer: 'Sarah Chen, EA',
    partnerCpa: 'Marcus Vance, CPA, MST (License #89214-CA)',
    qboConnected: true,
    plaidConnected: true,
    bankAccountMask: 'Brex Treasury x9102',
    currentPeriod: 'October 2026'
  },
  {
    id: 'cli-summit',
    name: 'Summit Framing & Drywall LLC',
    entityType: 'multi_member_llc',
    fiscalYearEnd: '12-31',
    accountingBasis: 'cash',
    state: 'OR',
    status: 'in_close',
    inboundEmailSlug: 'summit-framing',
    industry: 'Commercial Construction & Framing',
    staffReviewer: 'Elena Rostova, Senior Bookkeeper',
    partnerCpa: 'Brian Miller, CPA',
    qboConnected: false,
    plaidConnected: true,
    bankAccountMask: 'Wells Fargo Commercial x7193',
    currentPeriod: 'October 2026'
  }
];

export const INITIAL_CHART_OF_ACCOUNTS: LedgerAccount[] = [
  // Assets (1000s)
  { id: 'acc-1010', clientId: 'cli-apex', code: '1010', name: 'Operating Checking Account (Chase x4409)', type: 'asset', normalBalance: 'debit', currentBalanceMinor: 14820000 },
  { id: 'acc-1020', clientId: 'cli-apex', code: '1020', name: 'High Yield Tax Reserve (Chase x8821)', type: 'asset', normalBalance: 'debit', currentBalanceMinor: 4250000 },
  { id: 'acc-1200', clientId: 'cli-apex', code: '1200', name: 'Accounts Receivable', type: 'asset', normalBalance: 'debit', currentBalanceMinor: 6850000 },
  { id: 'acc-1500', clientId: 'cli-apex', code: '1500', name: 'Service Fleet & Equipment Vehicles', type: 'asset', normalBalance: 'debit', currentBalanceMinor: 18500000 },

  // Liabilities (2000s)
  { id: 'acc-2010', clientId: 'cli-apex', code: '2010', name: 'Accounts Payable', type: 'liability', normalBalance: 'credit', currentBalanceMinor: 2450000 },
  { id: 'acc-2100', clientId: 'cli-apex', code: '2100', name: 'Commercial Credit Card (Ramp x1104)', type: 'liability', normalBalance: 'credit', currentBalanceMinor: 1245000 },
  { id: 'acc-2200', clientId: 'cli-apex', code: '2200', name: 'California Sales & Use Tax Payable', type: 'liability', normalBalance: 'credit', currentBalanceMinor: 480000 },

  // Equity (3000s)
  { id: 'acc-3010', clientId: 'cli-apex', code: '3010', name: "Owner's Capital Contribution", type: 'equity', normalBalance: 'credit', currentBalanceMinor: 20000000 },
  { id: 'acc-3020', clientId: 'cli-apex', code: '3020', name: "Owner's Draws & Distributions", type: 'equity', normalBalance: 'debit', currentBalanceMinor: 8500000 },
  { id: 'acc-3900', clientId: 'cli-apex', code: '3900', name: 'Retained Earnings', type: 'equity', normalBalance: 'credit', currentBalanceMinor: 14645000 },

  // Revenue (4000s)
  { id: 'acc-4010', clientId: 'cli-apex', code: '4010', name: 'Commercial Mechanical Installation Revenue', type: 'revenue', normalBalance: 'credit', currentBalanceMinor: 11450000 },
  { id: 'acc-4020', clientId: 'cli-apex', code: '4020', name: 'Preventative Maintenance Service Agreements', type: 'revenue', normalBalance: 'credit', currentBalanceMinor: 2800000 },

  // Cost of Goods Sold (5000s)
  { id: 'acc-5100', clientId: 'cli-apex', code: '5100', name: 'Direct Job Materials & Supplies', type: 'cogs', normalBalance: 'debit', currentBalanceMinor: 4860000 },
  { id: 'acc-5200', clientId: 'cli-apex', code: '5200', name: 'Subcontractor Labor (1099-NEC)', type: 'cogs', normalBalance: 'debit', currentBalanceMinor: 3200000 },
  { id: 'acc-5300', clientId: 'cli-apex', code: '5300', name: 'Heavy Equipment Rental & Crane Service', type: 'cogs', normalBalance: 'debit', currentBalanceMinor: 1250000 },

  // Operating Expenses (6000s)
  { id: 'acc-6100', clientId: 'cli-apex', code: '6100', name: 'Fleet Fuel & Vehicle Maintenance', type: 'expense', normalBalance: 'debit', currentBalanceMinor: 685000 },
  { id: 'acc-6200', clientId: 'cli-apex', code: '6200', name: 'Field Tools & Small Safety Equipment (<$2,500)', type: 'expense', normalBalance: 'debit', currentBalanceMinor: 345000 },
  { id: 'acc-6300', clientId: 'cli-apex', code: '6300', name: 'Commercial Liability & Workers Comp Insurance', type: 'expense', normalBalance: 'debit', currentBalanceMinor: 750000 },
  { id: 'acc-6400', clientId: 'cli-apex', code: '6400', name: 'Software & Cloud Dispatch (ServiceTitan / QBO)', type: 'expense', normalBalance: 'debit', currentBalanceMinor: 295000 },
  { id: 'acc-6900', clientId: 'cli-apex', code: '6900', name: 'Bank & Merchant Processing Fees', type: 'expense', normalBalance: 'debit', currentBalanceMinor: 112000 }
];

export const INITIAL_EXTRACTED_DOCUMENTS: ExtractedDocument[] = [
  {
    id: 'doc-101',
    clientId: 'cli-apex',
    source: 'upload',
    storageKey: 's3://retalyy-vault/cli-apex/2026-10/ferguson_inv_94821.pdf',
    sha256: '9f83a48e8941bc34e628a3014a6e382b6c934f5904838271a283e7482910fa44',
    mime: 'application/pdf',
    docType: 'invoice',
    status: 'extracted',
    uploadedBy: 'Elena Rostova (Firm)',
    uploadedAt: '2026-10-12 09:14 AM',
    vendorName: 'Ferguson HVAC Supply Inc.',
    documentDate: '2026-10-11',
    dueDate: '2026-11-10',
    invoiceNumber: 'INV-FERG-948210',
    subtotalMinor: 385000,
    taxMinor: 32725,
    totalMinor: 417725,
    paymentMethod: 'Net 30 terms / ACH',
    last4: '4409',
    lineItems: [
      { id: 'li-1', description: 'Carrier 5-Ton 16 SEER2 Commercial Condenser Unit', quantity: 1, unitPriceMinor: 285000, amountMinor: 285000 },
      { id: 'li-2', description: 'Insulated Copper Line Sets 3/4 x 3/8 (50 ft)', quantity: 4, unitPriceMinor: 15000, amountMinor: 60000 },
      { id: 'li-3', description: 'R-410A Refrigerant Cylinders (25 lbs)', quantity: 2, unitPriceMinor: 20000, amountMinor: 40000 }
    ],
    fieldConfidence: {
      vendorName: 99,
      documentDate: 98,
      invoiceNumber: 99,
      subtotal: 99,
      tax: 97,
      total: 99,
      lineItems: 98
    },
    validationErrors: [],
    validationPassed: true,
    redactedPii: true
  },
  {
    id: 'doc-102',
    clientId: 'cli-apex',
    source: 'portal',
    storageKey: 's3://retalyy-vault/cli-apex/2026-10/sunbelt_rental_88192.pdf',
    sha256: '5a28189e4912fa92019842aef9120398412e873a910248a31e84a2938174a912',
    mime: 'application/pdf',
    docType: 'invoice',
    status: 'extracted',
    uploadedBy: 'Carlos Mendoza (Apex Mechanical Tech)',
    uploadedAt: '2026-10-14 02:40 PM',
    vendorName: 'Sunbelt Rentals Inc.',
    documentDate: '2026-10-13',
    invoiceNumber: 'SBR-881924-CA',
    subtotalMinor: 125000,
    taxMinor: 0,
    totalMinor: 125000,
    paymentMethod: 'Credit Card (Ramp x1104)',
    last4: '1104',
    lineItems: [
      { id: 'li-4', description: '45ft Articulating Boom Lift Rental (3 Days - Job #101)', quantity: 1, unitPriceMinor: 125000, amountMinor: 125000 }
    ],
    fieldConfidence: {
      vendorName: 99,
      documentDate: 96,
      invoiceNumber: 98,
      subtotal: 99,
      tax: 95,
      total: 99,
      lineItems: 99
    },
    validationErrors: [],
    validationPassed: true,
    redactedPii: true
  },
  {
    id: 'doc-103',
    clientId: 'cli-apex',
    source: 'email',
    storageKey: 's3://retalyy-vault/cli-apex/2026-10/homedepot_receipt_4910.pdf',
    sha256: '3f7821901aef4920491823a0194e8a192830192a83e0192a83e8471928374a91',
    mime: 'image/jpeg',
    docType: 'receipt',
    status: 'extracted',
    uploadedBy: 'Inbound Email (apex-mechanical@inbound.retalyy.com)',
    uploadedAt: '2026-10-15 11:22 AM',
    vendorName: 'The Home Depot #0421',
    documentDate: '2026-10-14',
    invoiceNumber: 'HD-98412-SANJOSE',
    subtotalMinor: 68540,
    taxMinor: 6205,
    totalMinor: 74745,
    paymentMethod: 'Debit Card (Chase x4409)',
    last4: '4409',
    lineItems: [
      { id: 'li-5', description: 'Galvanized Sheet Metal Screws & Fasteners (500pk)', quantity: 2, unitPriceMinor: 4850, amountMinor: 9700 },
      { id: 'li-6', description: 'Milwaukee M18 Fuel Cordless Band Saw Kit', quantity: 1, unitPriceMinor: 38900, amountMinor: 38900 },
      { id: 'li-7', description: 'Mastic Duct Sealant & Foil Tape Rolls', quantity: 6, unitPriceMinor: 3323, amountMinor: 19940 }
    ],
    fieldConfidence: {
      vendorName: 98,
      documentDate: 97,
      invoiceNumber: 94,
      subtotal: 97,
      tax: 96,
      total: 98,
      lineItems: 96
    },
    validationErrors: [],
    validationPassed: true,
    redactedPii: true
  }
];

export const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'btx-1001',
    clientId: 'cli-apex',
    bankAccountId: 'ba-chase-4409',
    postedDate: '2026-10-11',
    amountMinor: -417725, // -$4,177.25
    currency: 'USD',
    descriptionRaw: 'ACH DEBIT FERGUSON ENT 948210 SAN JOSE CA 10-11-26',
    descriptionClean: 'Ferguson HVAC Supply',
    counterparty: 'Ferguson HVAC Supply Inc.',
    status: 'matched',
    source: 'plaid',
    categoryAccountId: 'acc-5100',
    categoryAccountName: 'Direct Job Materials & Supplies',
    matchedDocId: 'doc-101'
  },
  {
    id: 'btx-1002',
    clientId: 'cli-apex',
    bankAccountId: 'ba-ramp-1104',
    postedDate: '2026-10-13',
    amountMinor: -125000, // -$1,250.00
    currency: 'USD',
    descriptionRaw: 'SUNBELT RENTALS #088192 SAN JOSE CA CARD 1104',
    descriptionClean: 'Sunbelt Rentals',
    counterparty: 'Sunbelt Rentals Inc.',
    status: 'matched',
    source: 'plaid',
    categoryAccountId: 'acc-5300',
    categoryAccountName: 'Heavy Equipment Rental & Crane Service',
    matchedDocId: 'doc-102'
  },
  {
    id: 'btx-1003',
    clientId: 'cli-apex',
    bankAccountId: 'ba-chase-4409',
    postedDate: '2026-10-14',
    amountMinor: -74745, // -$747.45
    currency: 'USD',
    descriptionRaw: 'POS DEBIT 1012 THE HOME DEPOT #0421 SAN JOSE CA',
    descriptionClean: 'The Home Depot',
    counterparty: 'The Home Depot',
    status: 'new',
    source: 'plaid',
    categoryAccountId: 'acc-5100',
    categoryAccountName: 'Direct Job Materials & Supplies',
    matchedDocId: 'doc-103'
  },
  {
    id: 'btx-1004',
    clientId: 'cli-apex',
    bankAccountId: 'ba-chase-4409',
    postedDate: '2026-10-15',
    amountMinor: -142000, // -$1,420.00
    currency: 'USD',
    descriptionRaw: 'ACH DEBIT GRAINGER WW 8912480 LAKE FOREST IL',
    descriptionClean: 'W.W. Grainger Industrial',
    counterparty: 'W.W. Grainger',
    status: 'exception',
    source: 'plaid',
    categoryAccountId: undefined
  },
  {
    id: 'btx-1005',
    clientId: 'cli-apex',
    bankAccountId: 'ba-chase-4409',
    postedDate: '2026-10-15',
    amountMinor: -2500000, // -$25,000.00 internal transfer
    currency: 'USD',
    descriptionRaw: 'ONLINE TRANSFER TO SAVINGS x8821 CONF# 9821481',
    descriptionClean: 'Online Transfer to Tax Reserve',
    counterparty: 'Internal Transfer (Chase x8821)',
    status: 'categorized',
    source: 'plaid',
    categoryAccountId: 'acc-1020',
    categoryAccountName: 'High Yield Tax Reserve (Chase x8821)'
  },
  {
    id: 'btx-1006',
    clientId: 'cli-apex',
    bankAccountId: 'ba-chase-4409',
    postedDate: '2026-10-16',
    amountMinor: 8950000, // +$89,500.00 progress payment deposit
    currency: 'USD',
    descriptionRaw: 'WIRE CREDIT HIGHLAND CREST COMM PROGRESS BILL #2',
    descriptionClean: 'Highland Crest Commercial Complex',
    counterparty: 'Highland Crest General Contracting',
    status: 'new',
    source: 'plaid',
    categoryAccountId: 'acc-4010',
    categoryAccountName: 'Commercial Mechanical Installation Revenue'
  }
];

export const INITIAL_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: 'rev-201',
    clientId: 'cli-apex',
    kind: 'categorization',
    subjectType: 'bank_transaction',
    subjectId: 'btx-1003',
    bankTransactionId: 'btx-1003',
    sourceDocumentId: 'doc-103',
    reason: 'Multi-category hardware receipt detected ($389 Milwaukee tool + $358 job consumables)',
    priority: 'high',
    status: 'needs_review',
    aiSuggestion: {
      accountId: 'acc-5100',
      accountCode: '5100',
      accountName: 'Direct Job Materials & Supplies',
      confidence: 0.94,
      rationale: 'Home Depot consumables tie to Job #101 HVAC install. Tool meets de minimis expensing §1.263(a)-1(f).',
      model: 'claude-haiku-5-5',
      promptVersion: 'v2.4-contractor-rules',
      learnedRuleId: 'rule-proposed-1'
    },
    assignedTo: 'Elena Rostova, Senior Bookkeeper'
  },
  {
    id: 'rev-202',
    clientId: 'cli-apex',
    kind: 'exception',
    subjectType: 'bank_transaction',
    subjectId: 'btx-1004',
    bankTransactionId: 'btx-1004',
    reason: 'Missing source receipt: $1,420.00 Grainger payment has no uploaded invoice or packing slip',
    priority: 'high',
    status: 'needs_review',
    aiSuggestion: {
      accountId: 'acc-5100',
      accountCode: '5100',
      accountName: 'Direct Job Materials & Supplies',
      confidence: 0.72,
      rationale: 'Historically 88% Grainger charges are direct job materials; request packing slip from client before posting.',
      model: 'claude-sonnet-5-5',
      promptVersion: 'v2.4-missing-doc-check'
    },
    assignedTo: 'Elena Rostova, Senior Bookkeeper'
  },
  {
    id: 'rev-203',
    clientId: 'cli-apex',
    kind: 'match',
    subjectType: 'match',
    subjectId: 'btx-1006',
    bankTransactionId: 'btx-1006',
    reason: 'Batch deposit candidate: $89,500.00 wire matches Milestone 2 progress draw minus 10% retainage',
    priority: 'medium',
    status: 'needs_review',
    aiSuggestion: {
      accountId: 'acc-4010',
      accountCode: '4010',
      accountName: 'Commercial Mechanical Installation Revenue',
      confidence: 0.96,
      rationale: 'Matches AIA G702 Pay App #2 for Highland Crest project. Credit Revenue $99,444 less $9,944 Retainage.',
      model: 'claude-sonnet-5-5',
      promptVersion: 'v2.4-progress-bill'
    },
    assignedTo: 'Marcus Vance, CPA'
  }
];

export const INITIAL_CATEGORIZATION_RULES: CategorizationRule[] = [
  {
    id: 'rule-1',
    scope: 'client',
    clientId: 'cli-apex',
    counterpartyPattern: 'FERGUSON',
    accountId: 'acc-5100',
    accountCode: '5100',
    accountName: 'Direct Job Materials & Supplies',
    confirmationsCount: 4,
    createdFrom: 'learned',
    isActive: true
  },
  {
    id: 'rule-2',
    scope: 'client',
    clientId: 'cli-apex',
    counterpartyPattern: 'SUNBELT RENTALS',
    accountId: 'acc-5300',
    accountCode: '5300',
    accountName: 'Heavy Equipment Rental & Crane Service',
    confirmationsCount: 5,
    createdFrom: 'learned',
    isActive: true
  },
  {
    id: 'rule-3',
    scope: 'firm',
    counterpartyPattern: 'CHEVRON|SHELL|76 GAS',
    accountId: 'acc-6100',
    accountCode: '6100',
    accountName: 'Fleet Fuel & Vehicle Maintenance',
    confirmationsCount: 18,
    createdFrom: 'manual',
    isActive: true
  },
  {
    id: 'rule-proposed-1',
    scope: 'client',
    clientId: 'cli-apex',
    counterpartyPattern: 'HOME DEPOT',
    accountId: 'acc-5100',
    accountCode: '5100',
    accountName: 'Direct Job Materials & Supplies',
    confirmationsCount: 3,
    createdFrom: 'learned',
    isActive: false,
    isProposed: true // Candidate for 1-click activation!
  }
];

export const INITIAL_RECONCILIATION_MATCHES: ReconciliationMatch[] = [
  {
    id: 'rec-1',
    clientId: 'cli-apex',
    bankTransactionId: 'btx-1001',
    documentId: 'doc-101',
    matchType: 'one_to_one',
    score: 0.99,
    status: 'confirmed',
    reasons: [
      'Exact amount match ($4,177.25)',
      'Date proximity: within 1 business day (Oct 11 vs Oct 11)',
      'Vendor token match: Ferguson HVAC Supply',
      'Invoice #948210 referenced in ACH trace'
    ],
    amountDifferenceMinor: 0
  },
  {
    id: 'rec-2',
    clientId: 'cli-apex',
    bankTransactionId: 'btx-1002',
    documentId: 'doc-102',
    matchType: 'one_to_one',
    score: 0.98,
    status: 'confirmed',
    reasons: [
      'Exact amount match ($1,250.00)',
      'Date proximity: within 1 day (Oct 13 vs Oct 13)',
      'Merchant match: Sunbelt Rentals Inc.',
      'Card mask match: Ramp x1104'
    ],
    amountDifferenceMinor: 0
  },
  {
    id: 'rec-3',
    clientId: 'cli-apex',
    bankTransactionId: 'btx-1003',
    documentId: 'doc-103',
    matchType: 'one_to_one',
    score: 0.94,
    status: 'suggested',
    reasons: [
      'Exact amount match ($747.45)',
      'Date proximity: same-day POS debit (Oct 14)',
      'Merchant name: The Home Depot #0421'
    ],
    amountDifferenceMinor: 0
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je-5001',
    clientId: 'cli-apex',
    entryDate: '2026-10-11',
    memo: 'Ferguson HVAC Condenser & Copper line set - Job #101',
    reference: 'INV-FERG-948210',
    status: 'posted',
    sourceType: 'bank_sync',
    sourceId: 'btx-1001',
    postedBy: 'AI Auto-Approval (Rule #1, 4 confirmations)',
    postedAt: '2026-10-11 10:04 AM',
    lines: [
      { id: 'jl-1', accountId: 'acc-5100', accountCode: '5100', accountName: 'Direct Job Materials & Supplies', debitMinor: 417725, creditMinor: 0 },
      { id: 'jl-2', accountId: 'acc-1010', accountCode: '1010', accountName: 'Operating Checking Account (Chase x4409)', debitMinor: 0, creditMinor: 417725 }
    ]
  },
  {
    id: 'je-5002',
    clientId: 'cli-apex',
    entryDate: '2026-10-13',
    memo: 'Sunbelt 45ft Boom lift rental - Job #101 Commercial HVAC',
    reference: 'SBR-881924-CA',
    status: 'posted',
    sourceType: 'reconciliation',
    sourceId: 'btx-1002',
    postedBy: 'Elena Rostova, Senior Bookkeeper',
    postedAt: '2026-10-13 03:15 PM',
    lines: [
      { id: 'jl-3', accountId: 'acc-5300', accountCode: '5300', accountName: 'Heavy Equipment Rental & Crane Service', debitMinor: 125000, creditMinor: 0 },
      { id: 'jl-4', accountId: 'acc-2100', accountCode: '2100', accountName: 'Commercial Credit Card (Ramp x1104)', debitMinor: 0, creditMinor: 125000 }
    ]
  },
  {
    id: 'je-5003',
    clientId: 'cli-apex',
    entryDate: '2026-10-15',
    memo: 'Quarterly estimated tax set-aside transfer from Operating to High Yield Reserve',
    reference: 'XFER-CONF-9821481',
    status: 'posted',
    sourceType: 'manual',
    sourceId: 'btx-1005',
    postedBy: 'Marcus Vance, CPA',
    postedAt: '2026-10-15 01:10 PM',
    lines: [
      { id: 'jl-5', accountId: 'acc-1020', accountCode: '1020', accountName: 'High Yield Tax Reserve (Chase x8821)', debitMinor: 2500000, creditMinor: 0 },
      { id: 'jl-6', accountId: 'acc-1010', accountCode: '1010', accountName: 'Operating Checking Account (Chase x4409)', debitMinor: 0, creditMinor: 2500000 }
    ]
  }
];

export const INITIAL_PERIOD_CLOSE: PeriodCloseRecord = {
  id: 'close-2026-10',
  clientId: 'cli-apex',
  year: 2026,
  month: 10,
  monthName: 'October 2026',
  status: 'in_review',
  tasks: [
    { key: 'docs_extracted', title: 'Document Intake & OCR Extraction', description: 'All supplier invoices and receipts ingested, deduplicated, and validated.', status: 'completed', completedAt: '2026-10-15 04:00 PM', completedBy: 'System Auto-Pipeline' },
    { key: 'bank_reconciled', title: 'Bank & Credit Feeds Reconciled', description: 'Checking, Tax Reserve, and Ramp card reconciled to third-party bank balance.', status: 'completed', completedAt: '2026-10-16 09:30 AM', completedBy: 'Elena Rostova, Senior Bookkeeper' },
    { key: 'exceptions_cleared', title: 'Review Queue & Exceptions Cleared', description: '1 remaining missing-receipt exception pending client response for Grainger purchase.', status: 'in_progress' },
    { key: 'statements_drafted', title: 'Financial Statements Engine Run', description: 'Deterministic P&L, Balance Sheet, Cash Flow, and Trial Balance generated from posted journal entries.', status: 'completed', completedAt: '2026-10-16 11:15 AM', completedBy: 'Retalyy Deterministic Math Engine' },
    { key: 'partner_signoff', title: 'Partner CPA Review & Period Lock', description: 'Named licensed professional audit review, verification of AI narrative, and immutable close.', status: 'pending' }
  ],
  statements: {
    pnl: {
      revenueMinor: 14250000, // $142,500.00
      cogsMinor: 9310000,     // $93,100.00
      grossProfitMinor: 4940000, // $49,400.00 (34.7% Margin)
      operatingExpensesMinor: 2187000, // $21,870.00
      netIncomeMinor: 2753000, // $27,530.00 Net Operating Income
      categories: [
        { name: 'Commercial Mechanical Installation Revenue', amountMinor: 11450000 },
        { name: 'Preventative Maintenance Service Agreements', amountMinor: 2800000 },
        { name: 'Direct Job Materials & Supplies', amountMinor: -4860000 },
        { name: 'Subcontractor Labor (1099-NEC)', amountMinor: -3200000 },
        { name: 'Heavy Equipment Rental & Crane Service', amountMinor: -1250000 },
        { name: 'Fleet Fuel & Vehicle Maintenance', amountMinor: -685000 },
        { name: 'Commercial Liability & Workers Comp Insurance', amountMinor: -750000 },
        { name: 'Field Tools & Small Safety Equipment (<$2,500)', amountMinor: -345000 },
        { name: 'Software & Cloud Dispatch (ServiceTitan / QBO)', amountMinor: -295000 },
        { name: 'Bank & Merchant Processing Fees', amountMinor: -112000 }
      ]
    },
    balanceSheet: {
      totalAssetsMinor: 44420000, // $444,200.00
      totalLiabilitiesMinor: 4175000, // $41,750.00
      totalEquityMinor: 40245000, // $402,450.00
      isBalanced: true // Invariant: Assets ($444,200) = Liabilities ($41,750) + Equity ($402,450)
    },
    cashFlow: {
      operatingActivitiesMinor: 3120000, // +$31,200.00
      investingActivitiesMinor: -500000, // -$5,000.00 tool additions
      financingActivitiesMinor: -850000, // -$8,500.00 owner draw
      netChangeInCashMinor: 1770000, // +$17,700.00
      endingCashMinor: 19070000 // $190,700.00 (Chase Checking + Tax Reserve)
    },
    trialBalance: {
      totalDebitsMinor: 67320000,
      totalCreditsMinor: 67320000,
      isBalanced: true
    }
  },
  aiNarrative: 'October 2026 performance demonstrates solid top-line momentum with total recognized revenue of $142,500.00 across commercial mechanical installations and maintenance contracts. Direct job costs of $93,100.00 yielded a gross profit of $49,400.00 (34.7% gross margin). After accounting for operating overhead of $21,870.00, net operating income concluded at $27,530.00. Cash flow from operations was positive at $31,200.00, ending with total liquid reserves of $190,700.00 across operating and tax reserve accounts.',
  narrativeVerified: true,
  narrativeAuditNumbers: [
    { value: '$142,500.00', sourceField: 'pnl.revenueMinor', verified: true },
    { value: '$93,100.00', sourceField: 'pnl.cogsMinor', verified: true },
    { value: '$49,400.00', sourceField: 'pnl.grossProfitMinor', verified: true },
    { value: '34.7%', sourceField: 'Gross Margin (49,400 / 142,500)', verified: true },
    { value: '$21,870.00', sourceField: 'pnl.operatingExpensesMinor', verified: true },
    { value: '$27,530.00', sourceField: 'pnl.netIncomeMinor', verified: true },
    { value: '$31,200.00', sourceField: 'cashFlow.operatingActivitiesMinor', verified: true },
    { value: '$190,700.00', sourceField: 'cashFlow.endingCashMinor', verified: true }
  ]
};

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'aud-9001',
    timestamp: '2026-10-11 10:04:12',
    actorType: 'ai',
    actorName: 'Claude 3.5 Haiku (Auto-Approver)',
    action: 'POST_JOURNAL_ENTRY',
    subjectType: 'journal_entry',
    subjectId: 'je-5001',
    details: 'Auto-approved $4,177.25 Ferguson invoice posting under learned client rule #1 (4 prior confirmations, 99% confidence).',
    inputHash: 'sha256-a9812bc814e910'
  },
  {
    id: 'aud-9002',
    timestamp: '2026-10-13 15:15:33',
    actorType: 'user',
    actorName: 'Elena Rostova, Senior Bookkeeper',
    action: 'APPROVE_REVIEW_ITEM',
    subjectType: 'review_item',
    subjectId: 'rev-201',
    details: 'Approved Sunbelt Rentals $1,250.00 boom lift charge coded to 5300 Equipment Rental.',
    inputHash: 'sha256-55a819b9104fa2'
  },
  {
    id: 'aud-9003',
    timestamp: '2026-10-15 11:25:01',
    actorType: 'system',
    actorName: 'Retalyy Document Pipeline',
    action: 'DEDUPLICATE_DOCUMENT',
    subjectType: 'document',
    subjectId: 'doc-103',
    details: 'Inbound receipt sha256 checked against client vault: Unique document verified and OCR schema validated.',
    inputHash: 'sha256-3f7821901aef49'
  },
  {
    id: 'aud-9004',
    timestamp: '2026-10-16 11:15:20',
    actorType: 'system',
    actorName: 'Retalyy Financial Engine',
    action: 'GENERATE_STATEMENTS',
    subjectType: 'period_close',
    subjectId: 'close-2026-10',
    details: 'Computed deterministic P&L, Balance Sheet, Cash Flow, and Trial Balance from 100% posted entries. Trial balance debits equal credits ($673,200.00).',
    inputHash: 'sha256-7819ef390142aa'
  }
];

export const INITIAL_DEADLINES: DeadlineItem[] = [
  {
    id: 'dl-1',
    title: 'IRS Form 941 - Q3 Employer Quarterly Federal Tax Return',
    jurisdiction: 'Federal (IRS)',
    formNumber: 'Form 941',
    dueDate: '2026-10-31',
    description: 'Quarterly reporting of income taxes, social security tax, and Medicare tax withheld from employee wages.',
    sourceUrl: 'https://www.irs.gov/forms-pubs/about-form-941',
    verified: true,
    verifiedBy: 'Marcus Vance, CPA (License #89214-CA)',
    status: 'upcoming'
  },
  {
    id: 'dl-2',
    title: 'California FTB Form 3804-Q - Pass-Through Entity Tax (PTET)',
    jurisdiction: 'California FTB',
    formNumber: 'Form 3804-Q',
    dueDate: '2026-10-15',
    description: 'Elective pass-through entity tax payment to bypass federal $10k SALT cap under CA AB 150.',
    sourceUrl: 'https://www.ftb.ca.gov/file/business/types/pass-through-entity-tax.html',
    verified: true,
    verifiedBy: 'Marcus Vance, CPA',
    status: 'completed'
  },
  {
    id: 'dl-3',
    title: 'IRS Form 1099-NEC & 1099-MISC - Nonemployee Compensation',
    jurisdiction: 'Federal (IRS)',
    formNumber: 'Form 1099-NEC',
    dueDate: '2027-01-31',
    description: 'Mandatory reporting for contractor payments >= $600 made during tax year 2026.',
    sourceUrl: 'https://www.irs.gov/forms-pubs/about-form-1099-nec',
    verified: false, // Badge displayed as Unverified until reviewed!
    status: 'upcoming'
  },
  {
    id: 'dl-4',
    title: 'IRS Form 1120-S - U.S. Income Tax Return for an S Corporation',
    jurisdiction: 'Federal (IRS)',
    formNumber: 'Form 1120-S',
    dueDate: '2027-03-15',
    description: 'Annual corporate tax return for calendar year S-Corporation entities.',
    sourceUrl: 'https://www.irs.gov/forms-pubs/about-form-1120-s',
    verified: false,
    status: 'upcoming'
  }
];

export const INITIAL_CLIENT_REQUESTS: ClientRequestItem[] = [
  {
    id: 'req-301',
    clientId: 'cli-apex',
    kind: 'missing_document',
    title: 'Missing Invoice: $1,420.00 Grainger Industrial Purchase',
    description: 'Please upload the invoice or itemized packing slip for the Oct 15 payment to Grainger Industrial so we can categorize it accurately for Job #101.',
    amountMinor: 142000,
    status: 'sent',
    sentAt: '2026-10-15 03:00 PM',
    reminderCount: 1,
    targetTransactionId: 'btx-1004'
  },
  {
    id: 'req-302',
    clientId: 'cli-apex',
    kind: 'question',
    title: 'Confirm Equipment Usage for $1,250 Sunbelt Rental',
    description: 'Was the 45ft boom lift used exclusively on the Highland Crest project, or split across another site?',
    status: 'answered',
    sentAt: '2026-10-13 04:00 PM',
    clientAnswer: 'Used 100% on the Highland Crest commercial HVAC retrofit job.',
    answeredAt: '2026-10-14 09:15 AM',
    reminderCount: 0
  }
];
