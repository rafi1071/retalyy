import { TransactionRecord, ClientProfile, ChartOfAccountItem } from '../types/accounting';

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'CL-8041',
    name: 'Retalyy Retail Innovations Inc.',
    industry: 'Omnichannel E-Commerce & Retail Tech',
    accountingStandard: 'US GAAP (Accrual)',
    fiscalYearEnd: 'December 31',
    capitalizationThreshold: 2500,
    prepaymentThreshold: 1000,
    taxJurisdiction: 'US - California / Multi-State',
    chartOfAccountsCount: 54,
  },
  {
    id: 'CL-3912',
    name: 'Helios Cloud Dynamics LLC',
    industry: 'B2B Enterprise Software (SaaS)',
    accountingStandard: 'US GAAP (Accrual)',
    fiscalYearEnd: 'December 31',
    capitalizationThreshold: 3000,
    prepaymentThreshold: 1200,
    taxJurisdiction: 'US - Delaware / New York',
    chartOfAccountsCount: 48,
  },
  {
    id: 'CL-9204',
    name: 'Vanguard Global Advisory Corp',
    industry: 'Professional Services & Consulting',
    accountingStandard: 'IFRS',
    fiscalYearEnd: 'June 30',
    capitalizationThreshold: 2000,
    prepaymentThreshold: 1000,
    taxJurisdiction: 'UK / International',
    chartOfAccountsCount: 62,
  },
];

export const CHART_OF_ACCOUNTS: ChartOfAccountItem[] = [
  { code: '1010', name: 'Operating Checking Account', category: 'Asset', type: 'Bank', description: 'Primary business checking feed' },
  { code: '1020', name: 'Payroll Clearing Account', category: 'Asset', type: 'Bank', description: 'Dedicated payroll funding' },
  { code: '1200', name: 'Accounts Receivable (A/R)', category: 'Asset', type: 'Current Asset', description: 'Customer invoices awaiting settlement' },
  { code: '1300', name: 'Prepaid Expenses', category: 'Asset', type: 'Current Asset', description: 'Expenses paid in advance to be amortized' },
  { code: '1500', name: 'Computer Equipment & Hardware', category: 'Asset', type: 'Fixed Asset', description: 'Capitalized hardware > $2,500' },
  { code: '1590', name: 'Accumulated Depreciation - Hardware', category: 'Asset', type: 'Fixed Asset (Contra)', description: 'Monthly depreciation offset' },
  { code: '2000', name: 'Accounts Payable (A/P)', category: 'Liability', type: 'Current Liability', description: 'Vendor bills awaiting payment' },
  { code: '2100', name: 'Deferred Revenue / Retainers', category: 'Liability', type: 'Current Liability', description: 'Advance client billings unearned' },
  { code: '2200', name: 'Sales Tax Payable', category: 'Liability', type: 'Current Liability', description: 'Collected sales tax owed to state' },
  { code: '2600', name: 'Commercial Term Loan Principal', category: 'Liability', type: 'Long-term Liability', description: 'Bank loan balance' },
  { code: '3010', name: 'Common Stock / Capital Contribution', category: 'Equity', type: 'Equity', description: 'Paid-in founder capital' },
  { code: '3020', name: "Owner's Draws & Distributions", category: 'Equity', type: 'Equity', description: 'Non-wage partner withdrawals' },
  { code: '4010', name: 'SaaS Subscription Revenue', category: 'Revenue', type: 'Operating Revenue', description: 'Recurring client software billing' },
  { code: '4020', name: 'Professional Services Revenue', category: 'Revenue', type: 'Operating Revenue', description: 'Consulting and onboarding fees' },
  { code: '5010', name: 'Merchant & Gateway Processing Fees', category: 'Expense', type: 'COGS', description: 'Stripe, PayPal, Interchange fees' },
  { code: '6010', name: 'Software Expense & Cloud Subscriptions', category: 'Expense', type: 'Operating Expense', description: 'Routine monthly software tools' },
  { code: '6020', name: 'Web Hosting & Infrastructure', category: 'Expense', type: 'Operating Expense', description: 'AWS, GCP, Vercel cloud services' },
  { code: '6030', name: 'Travel & Lodging', category: 'Expense', type: 'Operating Expense', description: 'Airlines, hotels, ground transport' },
  { code: '6040', name: 'Client Entertainment & Meals (50% Ded.)', category: 'Expense', type: 'Operating Expense', description: 'Business dining subject to 50% limitation' },
  { code: '6050', name: 'Legal & Professional Fees', category: 'Expense', type: 'Operating Expense', description: 'Outside legal counsel and CPA fees' },
  { code: '6060', name: 'Office Supplies & Materials', category: 'Expense', type: 'Operating Expense', description: 'Consumables under $200' },
  { code: '7010', name: 'Interest Expense', category: 'Expense', type: 'Non-Operating Expense', description: 'Loan financing and interest costs' },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  // 1. The primary showcase transaction specified in prompt:
  {
    id: 'TXN-2026-0891',
    clientId: 'CL-8041',
    transactionDate: '2026-10-12',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'CHECKOUT*CLOUDSTACK TECH 888-291-0021 SAN FRANCISCO CA',
    normalizedDescription: 'CloudStack Technologies Inc.',
    counterparty: 'CloudStack Technologies',
    direction: 'outflow',
    amount: 1200.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-INV-8812',
      filename: 'CloudStack_Annual_Invoice_INV8812.pdf',
      docType: 'invoice',
      uploadedAt: '2026-10-13 09:20 UTC',
      fileSize: '245 KB',
      pageCount: 1,
      extractedDate: '2026-10-12',
      extractedAmount: 1200.0,
      extractedVendor: 'CloudStack Technologies Inc.',
      extractedInvoiceNumber: 'INV-2026-8812',
      extractedTaxAmount: 0.0,
      extractedCurrency: 'USD',
      ocrConfidence: 99.4,
      rawTextExcerpt: 'INVOICE #INV-2026-8812\nBilled To: Retalyy Retail Innovations Inc.\nItem: Annual Enterprise Developer Subscription (Term: Oct 12, 2026 - Oct 11, 2027)\nTotal: $1,200.00 USD\nPayment Status: Paid in Full via Wire/ACH'
    },
    extractedFields: {
      vendor: 'CloudStack Technologies Inc.',
      date: '2026-10-12',
      grossAmount: 1200.0,
      taxAmount: 0.0,
      invoiceNumber: 'INV-2026-8812',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-01',
        severity: 'warning',
        code: 'PREPAYMENT_EVALUATION',
        message: 'Contract duration exceeds 90 days with materiality >= $1,000 threshold. Evaluating Prepaid Expense vs. Immediate Expense treatment.',
        resolved: false
      }
    ],
    validationScore: 98,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 99.2,
      matchedDocumentId: 'DOC-INV-8812',
      matchedInvoiceNumber: 'INV-2026-8812',
      matchedAmount: 1200.0,
      varianceAmount: 0.0,
      matchRuleUsed: 'Exact Amount + Date + Vendor Normalization Rule'
    },
    accountCode: '1300',
    accountName: 'Prepaid Expenses',
    accountCategory: 'Asset',
    taxCode: 'TAX-EXEMPT-SVC',
    taxTreatment: 'Ordinary business software deduction; subject to 12-month period amortization timing rule.',
    taxDeductiblePercentage: 100,
    treatmentType: 'prepaid_asset',
    treatmentJustification: 'Annual software contract covering 12 future months (Oct 2026 – Oct 2027) exceeding client materiality threshold ($1,000). Must be capitalized as Prepaid Expense on Balance Sheet and amortized at $100/mo over the service period to avoid distorting October earnings.',
    policyCitation: 'ASC 340-20 (Other Assets and Deferred Costs) & GAAP Matching Principle',
    amortizationMonths: 12,
    monthlyAmortizationAmount: 100.0,
    journalLines: [
      {
        id: 'JL-101',
        accountNumber: '1300',
        accountName: 'Prepaid Expenses',
        type: 'debit',
        amount: 1200.0,
        memo: 'Annual CloudStack Dev Subscription (Oct 2026 - Oct 2027)',
        taxCode: 'TAX-EXEMPT-SVC'
      },
      {
        id: 'JL-102',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 1200.0,
        memo: 'Settlement for INV-2026-8812 via Bank Feed'
      }
    ],
    status: 'needs_review',
    autoPostEligible: false,
    approvalHistory: [
      {
        id: 'LOG-01',
        timestamp: '2026-10-13 09:21 UTC',
        userRole: 'bookkeeper',
        userName: 'Elena Rostova (Bookkeeper)',
        stepNumber: 1,
        stepName: 'Data Extraction',
        action: 'OCR Parsed',
        details: 'Extracted $1,200.00 from invoice INV-2026-8812 with 99.4% OCR confidence.'
      },
      {
        id: 'LOG-02',
        timestamp: '2026-10-13 09:22 UTC',
        userRole: 'junior_accountant',
        userName: 'David Chen (Junior Accountant)',
        stepNumber: 2,
        stepName: 'Normalization',
        action: 'Vendor Standardized',
        details: 'Normalized "CHECKOUT*CLOUDSTACK TECH" to "CloudStack Technologies Inc."'
      },
      {
        id: 'LOG-03',
        timestamp: '2026-10-13 09:23 UTC',
        userRole: 'staff_accountant',
        userName: 'Sarah Jenkins (Staff Accountant)',
        stepNumber: 3,
        stepName: 'Reconciliation Match',
        action: 'Automated 1:1 Match',
        details: 'Matched bank outflow -$1,200.00 to source invoice with zero variance.'
      },
      {
        id: 'LOG-04',
        timestamp: '2026-10-13 09:25 UTC',
        userRole: 'staff_accountant',
        userName: 'Sarah Jenkins (Staff Accountant)',
        stepNumber: 5,
        stepName: 'Treatment Determination',
        action: 'Flagged for Review',
        details: 'Proposed Prepaid Asset treatment over Immediate Expensing due to 12-month contract window.'
      }
    ]
  },

  // 2. CapEx Hardware Purchase > $2,500
  {
    id: 'TXN-2026-0892',
    clientId: 'CL-8041',
    transactionDate: '2026-10-10',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'DELL DIRECT SALES ROUND ROCK TX REF 99041288',
    normalizedDescription: 'Dell Technologies',
    counterparty: 'Dell Technologies',
    direction: 'outflow',
    amount: 4250.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-INV-9904',
      filename: 'Dell_Precision_Workstation_Order9904.pdf',
      docType: 'invoice',
      uploadedAt: '2026-10-11 14:15 UTC',
      fileSize: '310 KB',
      pageCount: 2,
      extractedDate: '2026-10-10',
      extractedAmount: 4250.0,
      extractedVendor: 'Dell Direct Sales',
      extractedInvoiceNumber: 'DELL-9904-US',
      extractedTaxAmount: 312.50,
      extractedCurrency: 'USD',
      ocrConfidence: 98.7,
      rawTextExcerpt: 'Dell Precision 7780 Mobile Workstation x1: $3,937.50\nState Sales Tax: $312.50\nTotal Due: $4,250.00'
    },
    extractedFields: {
      vendor: 'Dell Technologies',
      date: '2026-10-10',
      grossAmount: 4250.0,
      taxAmount: 312.50,
      invoiceNumber: 'DELL-9904-US',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-02',
        severity: 'warning',
        code: 'CAPEX_THRESHOLD_EXCEEDED',
        message: 'Transaction amount ($4,250.00) exceeds firm de minimis capitalization limit ($2,500.00). Requires Fixed Asset capitalization.',
        resolved: false
      }
    ],
    validationScore: 97,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 98.9,
      matchedDocumentId: 'DOC-INV-9904',
      matchedInvoiceNumber: 'DELL-9904-US',
      matchedAmount: 4250.0,
      varianceAmount: 0.0,
      matchRuleUsed: 'Exact PO & Order Reference Match'
    },
    accountCode: '1500',
    accountName: 'Computer Equipment & Hardware',
    accountCategory: 'Asset',
    taxCode: 'TAX-CAPEX-HW',
    taxTreatment: 'Section 179 / Bonus Depreciation eligible under IRC § 168(k)',
    taxDeductiblePercentage: 100,
    treatmentType: 'capitalized_asset',
    treatmentJustification: 'Hardware purchase of $4,250.00 exceeds firm capitalization threshold ($2,500.00) with estimated useful life of 36 months. Must be capitalized on Balance Sheet and depreciated straight-line.',
    policyCitation: 'ASC 360 (Property, Plant, and Equipment) & Reg. § 1.263(a)-1(f) De Minimis Safe Harbor',
    journalLines: [
      {
        id: 'JL-201',
        accountNumber: '1500',
        accountName: 'Computer Equipment & Hardware',
        type: 'debit',
        amount: 4250.0,
        memo: 'Dell Precision 7780 Mobile Workstation (Useful life 3 yrs)',
        taxCode: 'TAX-CAPEX-HW'
      },
      {
        id: 'JL-202',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 4250.0,
        memo: 'ACH Settlement to Dell Direct Sales'
      }
    ],
    status: 'needs_review',
    autoPostEligible: false,
    approvalHistory: [
      {
        id: 'LOG-05',
        timestamp: '2026-10-11 15:00 UTC',
        userRole: 'staff_accountant',
        userName: 'Sarah Jenkins (Staff Accountant)',
        stepNumber: 5,
        stepName: 'Treatment Determination',
        action: 'Capitalized Asset Route',
        details: 'Routed to Senior Accountant Review Queue due to CapEx threshold rule.'
      }
    ]
  },

  // 3. Routine AWS Hosting - Fully Automated & Auto-Posted
  {
    id: 'TXN-2026-0897',
    clientId: 'CL-8041',
    transactionDate: '2026-10-03',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'AMZN MKTP US*771289190 SEATTLE WA AWS.AMAZON.COM',
    normalizedDescription: 'Amazon Web Services (AWS)',
    counterparty: 'Amazon Web Services',
    direction: 'outflow',
    amount: 680.40,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-INV-AWS-77',
      filename: 'AWS_Invoice_Oct2026_0981.pdf',
      docType: 'invoice',
      uploadedAt: '2026-10-04 03:00 UTC',
      fileSize: '180 KB',
      pageCount: 3,
      extractedDate: '2026-10-03',
      extractedAmount: 680.40,
      extractedVendor: 'Amazon Web Services, Inc.',
      extractedInvoiceNumber: 'AWS-2026-98104',
      extractedTaxAmount: 48.20,
      extractedCurrency: 'USD',
      ocrConfidence: 99.8,
      rawTextExcerpt: 'AWS Cloud Services Statement Oct 2026. Total Amount: $680.40 USD. Automatically debited from checking account ending 4819.'
    },
    extractedFields: {
      vendor: 'Amazon Web Services, Inc.',
      date: '2026-10-03',
      grossAmount: 680.40,
      taxAmount: 48.20,
      invoiceNumber: 'AWS-2026-98104',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [],
    validationScore: 100,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 100,
      matchedDocumentId: 'DOC-INV-AWS-77',
      matchedInvoiceNumber: 'AWS-2026-98104',
      matchedAmount: 680.40,
      varianceAmount: 0.0,
      matchRuleUsed: 'Recurring Vendor Rule + Exact Tax Breakdown'
    },
    accountCode: '6020',
    accountName: 'Web Hosting & Infrastructure',
    accountCategory: 'Expense',
    taxCode: 'TAX-OPEX-STD',
    taxTreatment: '100% Tax Deductible Operating Expense under IRC Sec 162',
    taxDeductiblePercentage: 100,
    treatmentType: 'immediate_expense',
    treatmentJustification: 'Monthly utility consumption expense for server infrastructure. Under $1,000 threshold and pertains strictly to October 2026 usage period.',
    policyCitation: 'ASC 720 (Other Expenses) & Routine Operating Classification',
    journalLines: [
      {
        id: 'JL-301',
        accountNumber: '6020',
        accountName: 'Web Hosting & Infrastructure',
        type: 'debit',
        amount: 680.40,
        memo: 'October 2026 AWS Cloud Compute & Storage',
        taxCode: 'TAX-OPEX-STD'
      },
      {
        id: 'JL-302',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 680.40,
        memo: 'Auto-Debit AWS Invoice AWS-2026-98104'
      }
    ],
    status: 'posted',
    autoPostEligible: true,
    reviewedBy: 'Autonomous Rule Engine v2.4',
    approvedBy: 'Auto-Post Policy (Rule #R-04)',
    postedAt: '2026-10-04 03:05 UTC',
    approvalHistory: [
      {
        id: 'LOG-06',
        timestamp: '2026-10-04 03:05 UTC',
        userRole: 'staff_accountant',
        userName: 'Retalyy Auto-Post Engine',
        stepNumber: 6,
        stepName: 'Ledger Posting',
        action: 'Auto-Posted to General Ledger',
        details: 'Passed all 6 verification checks: 100% match confidence, routine vendor profile, and sub-$1,000 limit.'
      }
    ]
  },

  // 4. Client Retainer Inflow - Deferred Revenue Liability
  {
    id: 'TXN-2026-0893',
    clientId: 'CL-8041',
    transactionDate: '2026-10-08',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'WIRE INCOMING FED RESERVE ACME RETAIL CORP REF W99281',
    normalizedDescription: 'Acme Retail Corp',
    counterparty: 'Acme Retail Corp',
    direction: 'inflow',
    amount: 15000.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-CONTR-081',
      filename: 'Acme_Enterprise_Service_Agreement_2026.pdf',
      docType: 'contract',
      uploadedAt: '2026-10-08 11:00 UTC',
      fileSize: '890 KB',
      pageCount: 8,
      extractedDate: '2026-10-08',
      extractedAmount: 15000.0,
      extractedVendor: 'Acme Retail Corp',
      extractedInvoiceNumber: 'SOW-ACME-Q4',
      extractedTaxAmount: 0.0,
      ocrConfidence: 99.1,
      rawTextExcerpt: 'Q4 Implementation Milestone Deposit. Non-refundable advance retainer: $15,000.00. Revenue recognized upon milestone delivery in November/December 2026.'
    },
    extractedFields: {
      vendor: 'Acme Retail Corp',
      date: '2026-10-08',
      grossAmount: 15000.0,
      taxAmount: 0.0,
      invoiceNumber: 'SOW-ACME-Q4',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-03',
        severity: 'info',
        code: 'REVENUE_RECOGNITION_ASC606',
        message: 'Advance retainer received prior to performance obligation satisfaction. Classified as Deferred Revenue.',
        resolved: true
      }
    ],
    validationScore: 99,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 97.8,
      matchedDocumentId: 'DOC-CONTR-081',
      matchedInvoiceNumber: 'SOW-ACME-Q4',
      matchedAmount: 15000.0,
      varianceAmount: 0.0,
      matchRuleUsed: 'Wire Reference Number + SOW Deposit Schedule'
    },
    accountCode: '2100',
    accountName: 'Deferred Revenue / Retainers',
    accountCategory: 'Liability',
    taxCode: 'TAX-EXEMPT-REV',
    taxTreatment: 'Taxable upon accrual or constructive receipt depending on tax method (§ 451)',
    taxDeductiblePercentage: 0,
    treatmentType: 'deferred_revenue',
    treatmentJustification: 'Cash received in advance of client milestone delivery. Under ASC 606, cannot recognize revenue until performance obligations are satisfied in Nov/Dec.',
    policyCitation: 'ASC 606 (Revenue from Contracts with Customers)',
    journalLines: [
      {
        id: 'JL-401',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'debit',
        amount: 15000.0,
        memo: 'Inbound Wire Deposit Acme Retail Corp'
      },
      {
        id: 'JL-402',
        accountNumber: '2100',
        accountName: 'Deferred Revenue / Retainers',
        type: 'credit',
        amount: 15000.0,
        memo: 'Deferred Revenue for Q4 SOW Milestones'
      }
    ],
    status: 'approved',
    autoPostEligible: false,
    reviewedBy: 'David Chen (Junior Accountant)',
    approvedBy: 'Marcus Brody, CPA (Senior Controller)',
    approvalHistory: [
      {
        id: 'LOG-07',
        timestamp: '2026-10-09 10:15 UTC',
        userRole: 'senior_accountant',
        userName: 'Marcus Brody, CPA (Senior Controller)',
        stepNumber: 6,
        stepName: 'Approval',
        action: 'Approved Treatment',
        details: 'Verified contract terms for milestone delivery schedule. Deferred revenue confirmed.'
      }
    ]
  },

  // 5. Client Dinner Meeting - 50% Disallowed Meals Tax Rule
  {
    id: 'TXN-2026-0895',
    clientId: 'CL-8041',
    transactionDate: '2026-10-14',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'MORTONS STEAKHOUSE #482 SAN FRANCISCO CA',
    normalizedDescription: "Morton's Steakhouse",
    counterparty: "Morton's Steakhouse",
    direction: 'outflow',
    amount: 340.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-REC-482',
      filename: 'Mortons_Receipt_Oct14.pdf',
      docType: 'receipt',
      uploadedAt: '2026-10-15 08:30 UTC',
      fileSize: '140 KB',
      pageCount: 1,
      extractedDate: '2026-10-14',
      extractedAmount: 340.0,
      extractedVendor: "Morton's The Steakhouse",
      extractedTaxAmount: 28.50,
      ocrConfidence: 96.5,
      rawTextExcerpt: "Morton's Steakhouse. 4 guests. Subtotal: $265.00, Tax: $28.50, Tip: $46.50. Total: $340.00. Business Purpose: Q4 Retail Strategy Dinner with Acme client leads."
    },
    extractedFields: {
      vendor: "Morton's Steakhouse",
      date: '2026-10-14',
      grossAmount: 340.0,
      taxAmount: 28.50,
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-04',
        severity: 'info',
        code: 'TAX_LIMITATION_50PCT',
        message: 'IRC § 274(n) limits business meal deduction to 50%. Entertainment activities are 100% non-deductible.',
        resolved: true
      }
    ],
    validationScore: 95,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 96.4,
      matchedDocumentId: 'DOC-REC-482',
      matchedAmount: 340.0,
      varianceAmount: 0.0,
      matchRuleUsed: 'Itemized Dining Receipt with Stated Business Purpose'
    },
    accountCode: '6040',
    accountName: 'Client Entertainment & Meals (50% Ded.)',
    accountCategory: 'Expense',
    taxCode: 'TAX-MEAL-50',
    taxTreatment: '50% Deductible for Federal and State Corporate Tax (IRC § 274(n))',
    taxDeductiblePercentage: 50,
    treatmentType: 'immediate_expense',
    treatmentJustification: 'Business dinner with prospective retail clients. Documented receipt with 4 attendees. Tax rules require 50% non-deductible book-to-tax M-1 adjustment at year end.',
    policyCitation: 'IRC § 274(n) & Treasury Reg. § 1.274-12',
    journalLines: [
      {
        id: 'JL-501',
        accountNumber: '6040',
        accountName: 'Client Entertainment & Meals (50% Ded.)',
        type: 'debit',
        amount: 340.0,
        memo: 'Dinner with Acme leads (50% tax deductible)',
        taxCode: 'TAX-MEAL-50'
      },
      {
        id: 'JL-502',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 340.0,
        memo: "Card charge Morton's Steakhouse"
      }
    ],
    status: 'matched',
    autoPostEligible: false,
    approvalHistory: [
      {
        id: 'LOG-08',
        timestamp: '2026-10-15 09:00 UTC',
        userRole: 'junior_accountant',
        userName: 'David Chen (Junior Accountant)',
        stepNumber: 4,
        stepName: 'Tax Classification',
        action: 'Applied 50% Meal Limitation',
        details: 'Confirmed business attendees documented on receipt.'
      }
    ]
  },

  // 6. Bank Loan Repayment - Principal (Liability) + Interest (Expense) Split
  {
    id: 'TXN-2026-0896',
    clientId: 'CL-8041',
    transactionDate: '2026-10-01',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'SVB LOAN SERVICING PAYMENT TRM-882190',
    normalizedDescription: 'Silicon Valley Bank Commercial Loan',
    counterparty: 'Silicon Valley Bank',
    direction: 'outflow',
    amount: 5000.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-LOAN-STMT-10',
      filename: 'SVB_Commercial_Loan_Amortization_Oct2026.pdf',
      docType: 'bank_statement',
      uploadedAt: '2026-10-02 08:00 UTC',
      fileSize: '420 KB',
      pageCount: 2,
      extractedDate: '2026-10-01',
      extractedAmount: 5000.0,
      extractedVendor: 'SVB Lending Services',
      extractedInvoiceNumber: 'TRM-882190-M24',
      ocrConfidence: 100,
      rawTextExcerpt: 'Monthly Payment Breakdown:\nPrincipal Reduction: $4,650.00\nInterest Portion: $350.00\nTotal Due & Collected: $5,000.00'
    },
    extractedFields: {
      vendor: 'SVB Lending Services',
      date: '2026-10-01',
      grossAmount: 5000.0,
      taxAmount: 0.0,
      invoiceNumber: 'TRM-882190-M24',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-05',
        severity: 'info',
        code: 'SPLIT_TRANSACTION_REQUIRED',
        message: 'Loan amortization statement requires splitting between balance sheet debt reduction ($4,650) and interest expense ($350).',
        resolved: true
      }
    ],
    validationScore: 100,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 100,
      matchedDocumentId: 'DOC-LOAN-STMT-10',
      matchedAmount: 5000.0,
      varianceAmount: 0.0,
      matchRuleUsed: 'Loan Amortization Schedule Multi-line Split'
    },
    accountCode: '2600',
    accountName: 'Commercial Term Loan Principal',
    accountCategory: 'Liability',
    taxCode: 'TAX-INTEREST-DED',
    taxTreatment: 'Interest portion is deductible under § 163; Principal reduction is a balance sheet transfer',
    taxDeductiblePercentage: 100,
    treatmentType: 'split_transaction',
    treatmentJustification: 'Monthly loan payment must not be expensed in full. $4,650 reduces long-term debt liability on the balance sheet, while $350 is recognized as non-operating interest expense.',
    policyCitation: 'ASC 470 (Debt) & GAAP Double-Entry Debt Accounting',
    journalLines: [
      {
        id: 'JL-601',
        accountNumber: '2600',
        accountName: 'Commercial Term Loan Principal',
        type: 'debit',
        amount: 4650.0,
        memo: 'Principal reduction on term loan TRM-882190'
      },
      {
        id: 'JL-602',
        accountNumber: '7010',
        accountName: 'Interest Expense',
        type: 'debit',
        amount: 350.0,
        memo: 'October 2026 loan interest financing cost',
        taxCode: 'TAX-INTEREST-DED'
      },
      {
        id: 'JL-603',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 5000.0,
        memo: 'SVB Auto-Debit Loan Payment'
      }
    ],
    status: 'needs_review',
    autoPostEligible: false,
    approvalHistory: [
      {
        id: 'LOG-09',
        timestamp: '2026-10-02 11:30 UTC',
        userRole: 'staff_accountant',
        userName: 'Sarah Jenkins (Staff Accountant)',
        stepNumber: 5,
        stepName: 'Split Journal Formulation',
        action: 'Formulated Compound Entry',
        details: 'Split $5,000 payment into $4,650 Principal debit and $350 Interest debit.'
      }
    ]
  },

  // 7. Potential Duplicate Exception Flag
  {
    id: 'TXN-2026-0900',
    clientId: 'CL-8041',
    transactionDate: '2026-10-12',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'CHECKOUT*CLOUDSTACK TECH 888-291-0021 SAN FRANCISCO CA [DUPLICATE CHARGE]',
    normalizedDescription: 'CloudStack Technologies Inc.',
    counterparty: 'CloudStack Technologies',
    direction: 'outflow',
    amount: 1200.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-INV-8812',
      filename: 'CloudStack_Annual_Invoice_INV8812.pdf',
      docType: 'invoice',
      uploadedAt: '2026-10-13 09:20 UTC',
      fileSize: '245 KB',
      pageCount: 1,
      extractedDate: '2026-10-12',
      extractedAmount: 1200.0,
      extractedVendor: 'CloudStack Technologies Inc.',
      ocrConfidence: 99.4
    },
    extractedFields: {
      vendor: 'CloudStack Technologies Inc.',
      date: '2026-10-12',
      grossAmount: 1200.0,
      taxAmount: 0.0,
      invoiceNumber: 'INV-2026-8812',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-06',
        severity: 'critical',
        code: 'SUSPECTED_DUPLICATE',
        message: 'Identical amount ($1,200.00), date, and vendor already matched to TXN-2026-0891. Possible double-billing by vendor or duplicate feed ingestion.',
        resolved: false
      }
    ],
    validationScore: 42,
    matching: {
      matchStatus: 'probable',
      confidence: 50.0,
      matchedDocumentId: 'DOC-INV-8812',
      varianceAmount: 0.0,
      matchRuleUsed: 'Potential Duplicate Feed Detection'
    },
    accountCode: '1300',
    accountName: 'Prepaid Expenses',
    accountCategory: 'Asset',
    taxCode: 'TAX-UNCONFIRMED',
    taxTreatment: 'Pending duplicate inquiry with vendor',
    taxDeductiblePercentage: 0,
    treatmentType: 'prepaid_asset',
    treatmentJustification: 'Hold posting. Suspected duplicate payment of invoice INV-2026-8812. Notify client to request vendor refund or dispute charge with bank.',
    policyCitation: 'Firm Internal Control Policy #IC-02: Duplicate Prevention',
    journalLines: [
      {
        id: 'JL-701',
        accountNumber: '1300',
        accountName: 'Prepaid Expenses',
        type: 'debit',
        amount: 1200.0,
        memo: 'HOLD - Suspected Duplicate'
      },
      {
        id: 'JL-702',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 1200.0,
        memo: 'Bank Outflow under dispute'
      }
    ],
    status: 'needs_review',
    autoPostEligible: false,
    approvalHistory: [
      {
        id: 'LOG-10',
        timestamp: '2026-10-13 14:00 UTC',
        userRole: 'junior_accountant',
        userName: 'David Chen (Junior Accountant)',
        stepNumber: 2,
        stepName: 'Duplicate Detection',
        action: 'Flagged Critical Duplicate',
        details: 'Blocked from automated workflow. Routed to Senior Accountant exception queue.'
      }
    ]
  },

  // 8. Founder / Owner Draw (Equity distribution)
  {
    id: 'TXN-2026-0898',
    clientId: 'CL-8041',
    transactionDate: '2026-10-15',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'ONLINE TRANSFER TO PERSONAL CHK MARCUS VANCE - DRAW',
    normalizedDescription: 'Marcus Vance (Founder)',
    counterparty: 'Marcus Vance',
    direction: 'outflow',
    amount: 2000.0,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-WITHDRAW-01',
      filename: 'Marcus_Vance_Equity_Distribution_Memo.pdf',
      docType: 'receipt',
      uploadedAt: '2026-10-15 16:00 UTC',
      fileSize: '95 KB',
      pageCount: 1,
      extractedDate: '2026-10-15',
      extractedAmount: 2000.0,
      extractedVendor: 'Marcus Vance',
      ocrConfidence: 98.2,
      rawTextExcerpt: 'Member Capital Distribution Request: $2,000.00 USD. Approved per operating agreement.'
    },
    extractedFields: {
      vendor: 'Marcus Vance',
      date: '2026-10-15',
      grossAmount: 2000.0,
      taxAmount: 0.0,
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-07',
        severity: 'info',
        code: 'EQUITY_DRAW_NON_DEDUCTIBLE',
        message: 'Owner withdrawal is not an operating expense. Excluded from P&L.',
        resolved: true
      }
    ],
    validationScore: 98,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 99.0,
      matchedDocumentId: 'DOC-WITHDRAW-01',
      matchedAmount: 2000.0,
      varianceAmount: 0.0,
      matchRuleUsed: 'Internal Partner Distribution Schedule'
    },
    accountCode: '3020',
    accountName: "Owner's Draws & Distributions",
    accountCategory: 'Equity',
    taxCode: 'TAX-NON-DEDUCTIBLE',
    taxTreatment: 'Non-deductible distribution of capital under IRC § 731',
    taxDeductiblePercentage: 0,
    treatmentType: 'owner_withdrawal',
    treatmentJustification: 'Owner distribution. Under partnership/S-Corp taxation, withdrawals reduce owner equity on the balance sheet and are non-deductible for entity tax calculations.',
    policyCitation: 'GAAP Equity Accounting & IRC § 731',
    journalLines: [
      {
        id: 'JL-801',
        accountNumber: '3020',
        accountName: "Owner's Draws & Distributions",
        type: 'debit',
        amount: 2000.0,
        memo: 'October 2026 Partner Distribution - Marcus Vance'
      },
      {
        id: 'JL-802',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 2000.0,
        memo: 'Transfer to personal checking'
      }
    ],
    status: 'approved',
    autoPostEligible: false,
    reviewedBy: 'Marcus Brody, CPA (Senior Controller)',
    approvedBy: 'Marcus Brody, CPA (Senior Controller)',
    approvalHistory: [
      {
        id: 'LOG-11',
        timestamp: '2026-10-16 11:00 UTC',
        userRole: 'senior_accountant',
        userName: 'Marcus Brody, CPA (Senior Controller)',
        stepNumber: 6,
        stepName: 'Approval',
        action: 'Approved Equity Treatment',
        details: 'Confirmed distribution authorization against Operating Agreement.'
      }
    ]
  },

  // 9. Unmatched Bank Debit - Missing Source Document
  {
    id: 'TXN-2026-0901',
    clientId: 'CL-8041',
    transactionDate: '2026-10-16',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'SQ *COFFEE ROASTERS DOWNTOWN SAN FRANCISCO CA',
    normalizedDescription: 'Coffee Roasters Downtown',
    counterparty: 'Coffee Roasters Downtown',
    direction: 'outflow',
    amount: 189.50,
    currency: 'USD',
    extractedFields: {
      vendor: 'Coffee Roasters Downtown',
      date: '2026-10-16',
      grossAmount: 189.50,
      taxAmount: 0.0,
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [
      {
        id: 'VF-08',
        severity: 'warning',
        code: 'MISSING_SOURCE_RECEIPT',
        message: 'No matching receipt or invoice found in client uploaded repository. A source document is required for audit readiness.',
        resolved: false
      }
    ],
    validationScore: 68,
    matching: {
      matchStatus: 'unmatched',
      confidence: 0,
      varianceAmount: 189.50,
      matchRuleUsed: 'None - Zero Candidate Invoices in Repository'
    },
    accountCode: '6060',
    accountName: 'Office Supplies & Materials',
    accountCategory: 'Expense',
    taxCode: 'TAX-PENDING-RECEIPT',
    taxTreatment: 'Deductibility unverified without itemized proof of business purpose',
    taxDeductiblePercentage: 0,
    treatmentType: 'immediate_expense',
    treatmentJustification: 'Probable office pantry catering or meeting refreshments. Cannot finalize tax deduction or post without itemized receipt.',
    policyCitation: 'IRC § 274(d) Substantiation Requirements',
    journalLines: [
      {
        id: 'JL-901',
        accountNumber: '6060',
        accountName: 'Office Supplies & Materials',
        type: 'debit',
        amount: 189.50,
        memo: 'Downtown Coffee Roasters (Pending Receipt Upload)'
      },
      {
        id: 'JL-902',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 189.50,
        memo: 'Square Debit'
      }
    ],
    status: 'needs_review',
    autoPostEligible: false,
    approvalHistory: [
      {
        id: 'LOG-12',
        timestamp: '2026-10-16 17:00 UTC',
        userRole: 'bookkeeper',
        userName: 'Elena Rostova (Bookkeeper)',
        stepNumber: 3,
        stepName: 'Matching Exception',
        action: 'Flagged Missing Receipt',
        details: 'Automated receipt request queued to client portal.'
      }
    ]
  },

  // 10. Travel & Lodging (Delta Airlines) - Matched & Ready for Final Post
  {
    id: 'TXN-2026-0894',
    clientId: 'CL-8041',
    transactionDate: '2026-10-06',
    accountingPeriod: '2026-10',
    bankAccount: 'SVB Operating Checking (*4819)',
    rawDescription: 'DELTA AIR LINES 006249102844 ATLANTA GA',
    normalizedDescription: 'Delta Air Lines',
    counterparty: 'Delta Air Lines',
    direction: 'outflow',
    amount: 842.50,
    currency: 'USD',
    sourceDocument: {
      id: 'DOC-ETKT-884',
      filename: 'Delta_E-Ticket_Receipt_Oct06.pdf',
      docType: 'receipt',
      uploadedAt: '2026-10-06 20:00 UTC',
      fileSize: '160 KB',
      pageCount: 1,
      extractedDate: '2026-10-06',
      extractedAmount: 842.50,
      extractedVendor: 'Delta Air Lines',
      extractedInvoiceNumber: 'ETKT-006249102844',
      extractedTaxAmount: 64.20,
      ocrConfidence: 99.5,
      rawTextExcerpt: 'Passenger: Sarah Jenkins. Route: SFO -> JFK (Onsite Client Audit). Fare: $778.30 + US Transportation Tax: $64.20. Total: $842.50.'
    },
    extractedFields: {
      vendor: 'Delta Air Lines',
      date: '2026-10-06',
      grossAmount: 842.50,
      taxAmount: 64.20,
      invoiceNumber: 'ETKT-006249102844',
      currency: 'USD'
    },
    isNormalized: true,
    validationFlags: [],
    validationScore: 100,
    matching: {
      matchStatus: 'high_confidence',
      confidence: 100,
      matchedDocumentId: 'DOC-ETKT-884',
      matchedInvoiceNumber: 'ETKT-006249102844',
      matchedAmount: 842.50,
      varianceAmount: 0.0,
      matchRuleUsed: 'Ticket Number & Flight Manifest Verification'
    },
    accountCode: '6030',
    accountName: 'Travel & Lodging',
    accountCategory: 'Expense',
    taxCode: 'TAX-TRAVEL-100',
    taxTreatment: '100% Tax Deductible Business Travel under IRC § 162(a)(2)',
    taxDeductiblePercentage: 100,
    treatmentType: 'immediate_expense',
    treatmentJustification: 'Staff travel to client site for on-site system integration. Ordinary and necessary business travel expenses are 100% deductible.',
    policyCitation: 'IRC § 162(a)(2) & ASC 720 Operating Expenses',
    journalLines: [
      {
        id: 'JL-1001',
        accountNumber: '6030',
        accountName: 'Travel & Lodging',
        type: 'debit',
        amount: 842.50,
        memo: 'Staff on-site flight SFO to JFK (Client Audit)',
        taxCode: 'TAX-TRAVEL-100'
      },
      {
        id: 'JL-1002',
        accountNumber: '1010',
        accountName: 'Operating Checking Account',
        type: 'credit',
        amount: 842.50,
        memo: 'Delta Airlines card settlement'
      }
    ],
    status: 'approved',
    autoPostEligible: true,
    reviewedBy: 'Elena Rostova (Bookkeeper)',
    approvedBy: 'Sarah Jenkins (Staff Accountant)',
    approvalHistory: [
      {
        id: 'LOG-13',
        timestamp: '2026-10-07 10:00 UTC',
        userRole: 'staff_accountant',
        userName: 'Sarah Jenkins (Staff Accountant)',
        stepNumber: 6,
        stepName: 'Approval',
        action: 'Approved for General Ledger Posting',
        details: 'E-ticket verified with client onsite travel approval.'
      }
    ]
  }
];
