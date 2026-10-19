import { BusinessProfile, BusinessDocument, AiProcessingEvent } from './types';
import { generateAiDashboardBlueprint } from './services/aiDashboardArchitect';

const defaultProfileBase = {
  companyName: 'Miller Cloud Systems LLC',
  dba: 'Miller Strategy Group',
  ein: '84-2918491',
  entityType: 'S-Corp' as const,
  industry: 'Cloud Architecture & SaaS',
  industryCategory: 'saas_tech' as const,
  revenueModel: 'recurring_subscription' as const,
  primaryPainPoint: 'IRC § 174 Software Dev Capitalization & Cloud Hosting COGS',
  compliancePriorities: ['IRC § 174', 'Form 8974', 'ASC 606'],
  state: 'California',
  incorporationDate: '2023-04-15',
  fiscalYearEnd: 'December 31',
  accountingMethod: 'accrual' as const,
  teamSize: 8,
  monthlyBurnTarget: 24500,
  primaryBank: 'Silicon Valley Bank / First Republic (Checking ...8921)',
  primaryCard: 'Brex Corporate Mastercard (...4402)',
  stripeConnected: true,
  plaidConnected: true,
  capExThreshold: 2500,
  taxReserveRate: 25,
  isOnboarded: true
};

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  ...defaultProfileBase,
  dashboardBlueprint: generateAiDashboardBlueprint(defaultProfileBase)
};

export const SAMPLE_DOCUMENTS: BusinessDocument[] = [
  {
    id: 'doc-aws-1',
    name: 'AWS_Oct2026_TaxInvoice_90124.pdf',
    size: '284 KB',
    uploadDate: '2026-10-15',
    type: 'vendor_bill',
    status: 'posted_to_gl',
    detectedVendor: 'Amazon Web Services, Inc.',
    extractedAmount: 1840.50,
    confidence: 99.2,
    suggestedAccount: '6100',
    accountName: 'Software Subscriptions & Cloud',
    taxDeductible: true,
    justification: 'Cloud infrastructure hosting and compute servers. 100% ordinary & necessary business expense under IRC § 162.',
    invoiceNumber: 'INV-AWS-90124',
    dueDate: '2026-10-30',
    isCapEx: false,
    isPrepaid: false
  },
  {
    id: 'doc-gusto-1',
    name: 'Gusto_Payroll_Summary_OctPeriod1.pdf',
    size: '412 KB',
    uploadDate: '2026-10-14',
    type: 'payroll_report',
    status: 'posted_to_gl',
    detectedVendor: 'Gusto Payroll Processing',
    extractedAmount: 14250.00,
    confidence: 98.7,
    suggestedAccount: '1050',
    accountName: 'Payroll Clearing & Wages',
    taxDeductible: true,
    justification: 'Gross payroll wages, employee withholdings, and employer FICA/FUTA liabilities.',
    invoiceNumber: 'PR-2026-10A',
    dueDate: '2026-10-15'
  },
  {
    id: 'doc-stripe-1',
    name: 'Stripe_Monthly_Payout_Summary_Oct.pdf',
    size: '198 KB',
    uploadDate: '2026-10-12',
    type: 'merchant_payout',
    status: 'reconciled',
    detectedVendor: 'Stripe Merchant Gateway',
    extractedAmount: 38400.00,
    confidence: 99.8,
    suggestedAccount: '4000',
    accountName: 'Client Retainer & Service Revenue',
    taxDeductible: false,
    justification: 'Net merchant deposit after $1,113.60 gateway processing fees.',
    invoiceNumber: 'PO-STR-8812'
  },
  {
    id: 'doc-slack-1',
    name: 'Slack_Technologies_Annual_License.pdf',
    size: '156 KB',
    uploadDate: '2026-10-16',
    type: 'vendor_bill',
    status: 'queued',
    detectedVendor: 'Slack Technologies / Salesforce',
    extractedAmount: 4200.00,
    confidence: 97.4,
    suggestedAccount: '1200',
    accountName: 'Prepaid Expenses',
    taxDeductible: true,
    justification: 'Annual upfront software license covering 12 months. Requires prepaid capitalization and $350/mo straight-line amortization under ASC 340-20.',
    invoiceNumber: 'SLK-2026-449',
    dueDate: '2026-11-05',
    isPrepaid: true
  },
  {
    id: 'doc-apple-1',
    name: 'AppleStore_Receipt_M4_MacBookPro.pdf',
    size: '345 KB',
    uploadDate: '2026-10-17',
    type: 'receipt',
    status: 'queued',
    detectedVendor: 'Apple Inc.',
    extractedAmount: 3499.00,
    confidence: 98.1,
    suggestedAccount: '6700',
    accountName: 'Hardware & Office Equipment',
    taxDeductible: true,
    justification: 'Hardware purchase ($3,499) exceeds $2,500 de minimis safe harbor threshold. Evaluated for Section 179 immediate expensing election.',
    invoiceNumber: 'APL-R-99214',
    isCapEx: true
  },
  {
    id: 'doc-wework-1',
    name: 'WeWork_November_Office_Invoice.pdf',
    size: '220 KB',
    uploadDate: '2026-10-17',
    type: 'vendor_bill',
    status: 'queued',
    detectedVendor: 'WeWork Companies LLC',
    extractedAmount: 2850.00,
    confidence: 99.5,
    suggestedAccount: '6000',
    accountName: 'Office Rent & Facilities',
    taxDeductible: true,
    justification: 'Monthly dedicated engineering team office space.',
    invoiceNumber: 'WW-NOV-491',
    dueDate: '2026-11-01'
  }
];

export const INITIAL_AI_EVENTS: AiProcessingEvent[] = [
  {
    id: 'evt-1',
    timestamp: '2026-10-15 14:22:10',
    docName: 'AWS_Oct2026_TaxInvoice_90124.pdf',
    vendor: 'Amazon Web Services, Inc.',
    amount: 1840.50,
    drAccount: '6100 (Software & Cloud)',
    crAccount: '2000 (Accounts Payable)',
    ruleCitation: 'IRC § 162 Routine Technology Operating Expense',
    confidence: 99.2,
    status: 'auto_posted'
  },
  {
    id: 'evt-2',
    timestamp: '2026-10-14 11:05:44',
    docName: 'Gusto_Payroll_Summary_OctPeriod1.pdf',
    vendor: 'Gusto Payroll Processing',
    amount: 14250.00,
    drAccount: '1050 (Payroll Clearing)',
    crAccount: '1000 (Operating Bank SVB)',
    ruleCitation: 'ASC 715 Compensation & Payroll Tax Withholdings',
    confidence: 98.7,
    status: 'auto_posted'
  },
  {
    id: 'evt-3',
    timestamp: '2026-10-12 09:18:22',
    docName: 'Stripe_Monthly_Payout_Summary_Oct.pdf',
    vendor: 'Stripe Merchant Gateway',
    amount: 38400.00,
    drAccount: '1000 (Operating Bank SVB)',
    crAccount: '4000 (Service Revenue)',
    ruleCitation: 'ASC 606 Revenue Recognition from Contracts',
    confidence: 99.8,
    status: 'reconciled'
  }
];
