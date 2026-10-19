export interface BusinessUserSession {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  role: 'founder' | 'cfo' | 'controller' | 'bookkeeper';
  loginTimestamp: string;
}

export type BusinessIndustryKey =
  | 'contractor_trades'
  | 'saas_tech'
  | 'ecommerce_retail'
  | 'professional_services'
  | 'restaurant_hospitality'
  | 'medical_clinic'
  | 'custom';

export type RevenueModelType =
  | 'job_progress_billing'
  | 'recurring_subscription'
  | 'pos_ecommerce'
  | 'hourly_retainer'
  | 'insurance_fee_service'
  | 'mixed';

export interface CustomDashboardKpi {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  subtext: string;
  changeText?: string;
  isPositive?: boolean;
  icon: string;
  badge?: string;
}

export interface ComplianceCheckItem {
  id: string;
  title: string;
  desc: string;
  status: 'active' | 'warning' | 'ok';
  citation: string;
}

export interface AiDashboardAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionText?: string;
  date: string;
}

export interface AiDashboardBlueprint {
  blueprintId: string;
  industryKey: BusinessIndustryKey;
  industryDisplayName: string;
  businessModel: string;
  revenueModel: RevenueModelType;
  generationTimestamp: string;
  aiRationale: string;
  confidenceScore: number;
  recommendedChartOfAccounts: Array<{ code: string; name: string; type: string }>;
  activeWidgetIds: string[];
  primaryKpis: CustomDashboardKpi[];
  complianceChecklist: ComplianceCheckItem[];
  customAlerts: AiDashboardAlert[];
  actionTools: Array<{ id: string; title: string; icon: string; desc: string }>;
}

export interface BusinessProfile {
  companyName: string;
  dba: string;
  ein: string;
  entityType: 'LLC' | 'S-Corp' | 'C-Corp' | 'Partnership' | 'Sole Proprietorship';
  industry: string;
  industryCategory?: BusinessIndustryKey;
  revenueModel?: RevenueModelType;
  primaryPainPoint?: string;
  compliancePriorities?: string[];
  state: string;
  incorporationDate: string;
  fiscalYearEnd: string;
  accountingMethod: 'accrual' | 'cash';
  teamSize: number;
  monthlyBurnTarget: number;
  primaryBank: string;
  primaryCard: string;
  stripeConnected: boolean;
  plaidConnected: boolean;
  capExThreshold: number;
  taxReserveRate: number;
  isOnboarded: boolean;
  dashboardBlueprint?: AiDashboardBlueprint;
}

export type BusinessDocType =
  | 'bank_statement'
  | 'vendor_bill'
  | 'receipt'
  | 'payroll_report'
  | 'customer_invoice'
  | 'merchant_payout';

export type BusinessDocStatus =
  | 'queued'
  | 'extracting'
  | 'rules_applied'
  | 'posted_to_gl'
  | 'reconciled';

export interface BusinessDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: BusinessDocType;
  status: BusinessDocStatus;
  detectedVendor?: string;
  extractedAmount?: number;
  confidence: number;
  suggestedAccount: string;
  accountName: string;
  taxDeductible: boolean;
  justification: string;
  invoiceNumber?: string;
  dueDate?: string;
  isPrepaid?: boolean;
  isCapEx?: boolean;
}

export interface AiProcessingEvent {
  id: string;
  timestamp: string;
  docName: string;
  vendor: string;
  amount: number;
  drAccount: string;
  crAccount: string;
  ruleCitation: string;
  confidence: number;
  status: 'auto_posted' | 'flagged' | 'reconciled';
}

export interface BusinessKpis {
  cashInBank: number;
  monthlyRevenue: number;
  monthlyBurn: number;
  netRunwayMonths: number;
  accountsPayableDue: number;
  accountsReceivablePending: number;
  estimatedTaxReserve: number;
  pendingDocumentsCount: number;
}
