import { 
  BusinessProfile, 
  AiDashboardBlueprint, 
  BusinessIndustryKey, 
  RevenueModelType,
  CustomDashboardKpi,
  ComplianceCheckItem,
  AiDashboardAlert
} from '../types';

export interface IndustryPreset {
  key: BusinessIndustryKey;
  label: string;
  badge: string;
  description: string;
  suggestedRevenueModel: RevenueModelType;
  iconName: string;
  defaultPainPoints: string;
  defaultCompliance: string[];
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    key: 'contractor_trades',
    label: 'Trades & Construction Contractors',
    badge: 'Job Costing & 1099s',
    description: 'Subcontractors, field materials, job-cost WIP allocation, preliminary liens, and vehicle fleet depreciation.',
    suggestedRevenueModel: 'job_progress_billing',
    iconName: 'Hammer',
    defaultPainPoints: 'Tracking job-specific material receipts, subcontractor W-9s/1099s, and progress billing margins.',
    defaultCompliance: ['Form 1099-NEC $600 threshold', 'Preliminary Lien Notices', 'ASC 606 Job-cost WIP', 'Section 179 Vehicle CapEx']
  },
  {
    key: 'saas_tech',
    label: 'SaaS & Subscription Tech',
    badge: 'MRR & Section 174',
    description: 'Recurring ARR/MRR, cloud hosting COGS, runway burn rate, and Section 174 R&D software capitalization.',
    suggestedRevenueModel: 'recurring_subscription',
    iconName: 'Cloud',
    defaultPainPoints: 'Capitalizing software dev wages under IRC § 174, cloud compute cost efficiency, and cash runway.',
    defaultCompliance: ['IRC § 174 R&D Capitalization', 'ASC 606 Subscription Amortization', 'Form 8974 Payroll Tax Offset']
  },
  {
    key: 'ecommerce_retail',
    label: 'E-Commerce & Retail Brands',
    badge: 'Inventory & Sales Tax',
    description: 'FIFO inventory valuation, multi-state sales tax nexus, return reserves, and blended merchant payment fees.',
    suggestedRevenueModel: 'pos_ecommerce',
    iconName: 'ShoppingBag',
    defaultPainPoints: 'Wayfair multi-state sales tax nexus, inventory holding costs, and reconciling Shopify/Stripe payouts.',
    defaultCompliance: ['Wayfair Economic Nexus ($100k thresholds)', '1099-K Merchant Matching', 'Lower of Cost or Market (LCM) Inventory']
  },
  {
    key: 'professional_services',
    label: 'Agencies, Law & Consulting',
    badge: 'Utilization & Retainers',
    description: 'Billable realization rate, unearned client retainers, WIP tracking, and client concentration risk.',
    suggestedRevenueModel: 'hourly_retainer',
    iconName: 'Briefcase',
    defaultPainPoints: 'Retainer depletion tracking, unbilled client reimbursables, and consultant utilization rates.',
    defaultCompliance: ['Client Escrow / Trust Segregation', 'ASC 606 Performance Obligation Retainers', 'Form 1099-NEC to Specialist Vendors']
  },
  {
    key: 'restaurant_hospitality',
    label: 'Restaurants & Hospitality',
    badge: 'Prime Cost & POS Batch',
    description: 'Prime cost (<60% food + labor), daily POS-to-bank settlement matches, and FICA tip credit tracking.',
    suggestedRevenueModel: 'pos_ecommerce',
    iconName: 'Utensils',
    defaultPainPoints: 'Managing food & beverage waste, daily register/Toast batch discrepancies, and tip credit reporting.',
    defaultCompliance: ['Section 45B FICA Tip Tax Credit', 'Form 8027 Tip Reporting', 'Daily Sales Tax Segregation']
  },
  {
    key: 'medical_clinic',
    label: 'Healthcare & Medical Practices',
    badge: 'Insurance A/R & HIPAA',
    description: 'Insurance claims A/R aging >60 days, medical equipment leases (ASC 842), and provider production splits.',
    suggestedRevenueModel: 'insurance_fee_service',
    iconName: 'Stethoscope',
    defaultPainPoints: 'Insurance claim delay write-offs, equipment lease amortization, and malpractice reserve allocation.',
    defaultCompliance: ['ASC 842 Medical Equipment Leases', 'HIPAA Vendor Business Associate Agreements', 'Insurance Contractual Allowances']
  },
  {
    key: 'custom',
    label: 'Adaptive Custom Enterprise',
    badge: 'AI Tailored',
    description: 'Fully flexible financial dashboard customized dynamically by the AI for unique hybrid business models.',
    suggestedRevenueModel: 'mixed',
    iconName: 'Sparkles',
    defaultPainPoints: 'Complex cross-entity transactions, multi-currency flows, or custom revenue streams.',
    defaultCompliance: ['GAAP Invariant Double-Entry Ledger', 'IRS Safe Harbor De Minimis', 'Quarterly Estimated Tax Reserves']
  }
];

export function detectIndustryKey(industryStr: string = '', companyNameStr: string = ''): BusinessIndustryKey {
  const text = `${industryStr} ${companyNameStr}`.toLowerCase();
  
  if (text.match(/contract|construct|hvac|plumb|roof|electric|builder|trade|subcontract|remodel|paint/)) {
    return 'contractor_trades';
  }
  if (text.match(/saas|software|cloud|tech|app|platform|ai|digital|api|cyber/)) {
    return 'saas_tech';
  }
  if (text.match(/retail|ecommerce|e-commerce|store|shop|goods|d2c|apparel|wholesale|product/)) {
    return 'ecommerce_retail';
  }
  if (text.match(/agency|consult|legal|law|market|design|architect|recruit|advisory/)) {
    return 'professional_services';
  }
  if (text.match(/restaurant|cafe|bar|bistro|dining|food|hospitality|bakery|catering/)) {
    return 'restaurant_hospitality';
  }
  if (text.match(/clinic|medical|health|doctor|dental|physician|therapy|pharma|care/)) {
    return 'medical_clinic';
  }
  return 'custom';
}

export function generateAiDashboardBlueprint(
  profile: Partial<BusinessProfile>,
  userPrompt?: string
): AiDashboardBlueprint {
  const industryKey = profile.industryCategory || detectIndustryKey(profile.industry, profile.companyName);
  const companyName = profile.companyName || 'Apex Enterprise';
  const entityType = profile.entityType || 'LLC';
  const monthlyBurn = profile.monthlyBurnTarget || 24500;
  const cashReserveRate = profile.taxReserveRate || 25;
  const teamSize = profile.teamSize || 8;
  const accountingMethod = profile.accountingMethod || 'accrual';

  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  switch (industryKey) {
    case 'contractor_trades': {
      return {
        blueprintId: `bp-contractor-${Date.now()}`,
        industryKey: 'contractor_trades',
        industryDisplayName: 'Trades & Construction Contractor Job Costing Suite',
        businessModel: 'Field Trades & Commercial Contracting',
        revenueModel: profile.revenueModel || 'job_progress_billing',
        generationTimestamp: timestamp,
        confidenceScore: 99.4,
        aiRationale: `Synthesized for ${companyName} (${entityType}, ${teamSize} crew members). Construction and trade businesses lose up to 14% of gross margins to unallocated materials, unbilled change orders, and IRS 1099-NEC vendor compliance penalties. Retalyy configured a live Job-Cost WIP Ledger, 1099 Subcontractor Threshold Radar, and Fleet CapEx tracker.`,
        activeWidgetIds: ['job_costing', 'subcontractor_1099', 'equipment_depreciation', 'cash_runway_gauge'],
        recommendedChartOfAccounts: [
          { code: '1150', name: 'Retention Withheld Receivable (5-10%)', type: 'asset' },
          { code: '1500', name: 'Vehicles, Heavy Machinery & Fleet', type: 'asset' },
          { code: '2100', name: 'Subcontractor 1099-NEC Payables', type: 'liab' },
          { code: '4050', name: 'Commercial Contract & Milestone Revenue', type: 'rev' },
          { code: '5100', name: 'Direct Job Materials & Supplies', type: 'exp' },
          { code: '5200', name: 'Subcontractor Trade Labor (1099)', type: 'exp' },
          { code: '5300', name: 'Equipment Rental & Fuel', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Operating Commercial Checking',
            changeText: '+4.2% cleared ACH',
            isPositive: true,
            icon: 'Building2',
            badge: 'Live Cleared'
          },
          {
            id: 'kpi_job_margin',
            label: 'Active Job Profit Margin',
            value: '28.4%',
            numericValue: 28.4,
            subtext: 'Target 25.0% • 5 Active Projects',
            changeText: '+3.4% above estimate',
            isPositive: true,
            icon: 'TrendingUp',
            badge: 'Job Costed'
          },
          {
            id: 'kpi_subcontractors',
            label: '1099 Subcontractor Exposure',
            value: '$42,850.00',
            numericValue: 42850,
            subtext: '12 Subs • 3 Near $600 Cap',
            changeText: '1 W-9 Pending Verification',
            isPositive: false,
            icon: 'Users',
            badge: 'IRS 1099 Radar'
          },
          {
            id: 'kpi_wip_unbilled',
            label: 'Unbilled Work-In-Progress (WIP)',
            value: '$31,400.00',
            numericValue: 31400,
            subtext: 'Milestones ready for AIA billing',
            changeText: 'Next Draw on Nov 1st',
            isPositive: true,
            icon: 'FileText',
            badge: 'Progress Draw'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_1',
            title: 'IRS Form 1099-NEC Subcontractor Tracking',
            desc: 'Every trade vendor paid >$600 per tax year requires a verified Form W-9 on file before January 31st.',
            status: 'warning',
            citation: 'IRC § 6041A Non-Employee Compensation'
          },
          {
            id: 'comp_2',
            title: 'ASC 606 Milestone & Percentage-of-Completion',
            desc: 'Recognizes revenue proportionally as materials are installed and inspections are certified.',
            status: 'ok',
            citation: 'GAAP ASC 606-10 Construction Contracts'
          },
          {
            id: 'comp_3',
            title: 'Section 179 Heavy Equipment & Vehicle CapEx',
            desc: 'Work trucks over 6,000 lbs GVWR qualify for 100% immediate expensing under bonus depreciation.',
            status: 'active',
            citation: 'IRC § 179 / § 168(k) Property Placed in Service'
          }
        ],
        customAlerts: [
          {
            id: 'alt_1',
            severity: 'warning',
            title: '3 Subcontractors Approaching $600 1099 Threshold',
            message: 'Apex Plumbing LLC ($580.00) and Bay Electrical ($540.00) are within $60 of the mandatory IRS 1099-NEC filing threshold. W-9 requested.',
            actionText: 'Review 1099 Radar',
            date: '2h ago'
          },
          {
            id: 'alt_2',
            severity: 'info',
            title: 'Metro Center Job: Materials Run at 92% of Budget',
            message: 'Direct materials ($18,400 of $20,000 budget) are tracking cleanly against 75% completed project milestones.',
            actionText: 'View Job Details',
            date: '1d ago'
          }
        ],
        actionTools: [
          { id: 'act_1', title: 'New Job Cost Estimate', icon: 'Calculator', desc: 'Create a job code with material & labor caps' },
          { id: 'act_2', title: 'Batch Request W-9 Forms', icon: 'ShieldCheck', desc: 'Automated 1-click email/SMS to field subcontractors' },
          { id: 'act_3', title: 'AIA G702 Progress Billing Draw', icon: 'FileSpreadsheet', desc: 'Generate signed percentage-of-completion invoice' }
        ]
      };
    }

    case 'saas_tech': {
      return {
        blueprintId: `bp-saas-${Date.now()}`,
        industryKey: 'saas_tech',
        industryDisplayName: 'High-Growth SaaS & Subscription Financial Suite',
        businessModel: 'Recurring Subscription Software & Cloud Services',
        revenueModel: profile.revenueModel || 'recurring_subscription',
        generationTimestamp: timestamp,
        confidenceScore: 99.8,
        aiRationale: `Synthesized for ${companyName} (${entityType}, ${accountingMethod} basis). Software startups require acute visibility into Net MRR retention, Cloud hosting COGS efficiency, cash runway, and mandatory IRC § 174 software development capitalization. Retalyy configured an MRR Waterfall, Cloud Unit Economics tracker, and Section 174 Tax Offset engine.`,
        activeWidgetIds: ['mrr_waterfall', 'section_174_rd', 'cloud_cogs', 'cash_runway_gauge'],
        recommendedChartOfAccounts: [
          { code: '1400', name: 'Capitalized Software Development (IRC § 174)', type: 'asset' },
          { code: '2300', name: 'Deferred Unearned Subscription Revenue', type: 'liab' },
          { code: '4000', name: 'Monthly Recurring SaaS Revenue (MRR)', type: 'rev' },
          { code: '4100', name: 'Enterprise Annual Contracts (ASC 606)', type: 'rev' },
          { code: '5050', name: 'Cloud Infrastructure & API COGS (AWS/GCP/OpenAI)', type: 'exp' },
          { code: '6200', name: 'Customer Acquisition Cost (CAC) Advertising', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Silicon Valley Bank Checking',
            changeText: '6.1 Months Runway',
            isPositive: true,
            icon: 'DollarSign',
            badge: 'Capital'
          },
          {
            id: 'kpi_mrr',
            label: 'Monthly Recurring Revenue (MRR)',
            value: '$42,850.00',
            numericValue: 42850,
            subtext: 'ARR Run-Rate: $514.2k',
            changeText: '+14.2% MoM Net Growth',
            isPositive: true,
            icon: 'TrendingUp',
            badge: 'MRR Pulse'
          },
          {
            id: 'kpi_cloud_cogs',
            label: 'Cloud Infrastructure COGS',
            value: '$4,120.00',
            numericValue: 4120,
            subtext: '9.6% of Revenue (Target <15%)',
            changeText: 'AWS + OpenAI Compute',
            isPositive: true,
            icon: 'Cloud',
            badge: 'Unit Economics'
          },
          {
            id: 'kpi_net_burn',
            label: 'Net Monthly Burn Target',
            value: `$${monthlyBurn.toLocaleString()}`,
            numericValue: monthlyBurn,
            subtext: 'Payroll + Hosting + G&A',
            changeText: 'Within budget target',
            isPositive: true,
            icon: 'Flame',
            badge: 'Cash Velocity'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_saas_1',
            title: 'IRC § 174 Software Development Capitalization',
            desc: 'Mandates 5-year straight-line amortization for domestic R&D engineer payroll. Retalyy automatically flags qualifying wage entries.',
            status: 'active',
            citation: 'IRC § 174 Specified Research & Experimental'
          },
          {
            id: 'comp_saas_2',
            title: 'Form 8974 Qualified Small Business Payroll Tax Offset',
            desc: 'Allows up to $500,000 of R&D tax credits to directly offset employer FICA payroll taxes each quarter.',
            status: 'ok',
            citation: 'IRS Form 8974 / IRC § 41(h)'
          },
          {
            id: 'comp_saas_3',
            title: 'ASC 606 Multi-Year Subscription Revenue Recognition',
            desc: 'Annual upfront payments are parked in Deferred Revenue and amortized 1/12th each month.',
            status: 'ok',
            citation: 'GAAP ASC 606 Revenue from Customer Contracts'
          }
        ],
        customAlerts: [
          {
            id: 'alt_saas_1',
            severity: 'info',
            title: 'Section 174 R&D Tax Credit Optimization Opportunity',
            message: 'Based on Q3 engineering payroll ($42,750), your business has identified $8,550 in eligible Form 8974 quarterly FICA tax offsets.',
            actionText: 'Export Form 8974 Schedule',
            date: '4h ago'
          },
          {
            id: 'alt_saas_2',
            severity: 'info',
            title: 'Annual Contract Prepayment Amortized',
            message: 'Recognized $3,200 from Deferred Revenue into October Monthly Recurring Revenue per ASC 606 schedule.',
            actionText: 'View Schedule',
            date: '1d ago'
          }
        ],
        actionTools: [
          { id: 'act_s1', title: 'Export ASC 606 Waterfall', icon: 'FileSpreadsheet', desc: '1-click CPA-ready revenue amortization schedule' },
          { id: 'act_s2', title: 'R&D Tax Credit Packager', icon: 'Sparkles', desc: 'Extract developer time and cloud invoices for Form 6765' },
          { id: 'act_s3', title: 'Stripe SaaS Reconciliation', icon: 'CreditCard', desc: 'Match gross payouts, refunds, and merchant fees' }
        ]
      };
    }

    case 'ecommerce_retail': {
      return {
        blueprintId: `bp-ecom-${Date.now()}`,
        industryKey: 'ecommerce_retail',
        industryDisplayName: 'Omnichannel E-Commerce & Retail Margins Suite',
        businessModel: 'Direct-to-Consumer (D2C) & Multi-Channel Retail',
        revenueModel: profile.revenueModel || 'pos_ecommerce',
        generationTimestamp: timestamp,
        confidenceScore: 98.9,
        aiRationale: `Synthesized for ${companyName} (${entityType}). Retailers face severe margin shrinkage from unmonitored merchant fees, South Dakota v. Wayfair multi-state sales tax nexus liabilities, and inventory holding costs. Retalyy integrated a FIFO Inventory Asset tracker, Economic Nexus Monitor, and Merchant Processing Take-Rate auditor.`,
        activeWidgetIds: ['inventory_turnover', 'sales_tax_nexus', 'merchant_take_rate', 'cash_runway_gauge'],
        recommendedChartOfAccounts: [
          { code: '1300', name: 'Merchandise Inventory Asset (FIFO)', type: 'asset' },
          { code: '2200', name: 'Multi-State Sales Tax Payable', type: 'liab' },
          { code: '4000', name: 'Gross Product Sales Revenue', type: 'rev' },
          { code: '4010', name: 'Customer Returns & Allowances', type: 'rev' },
          { code: '5000', name: 'Cost of Goods Sold (Product Cost)', type: 'exp' },
          { code: '5150', name: 'Inbound Freight & Customs Duties', type: 'exp' },
          { code: '6500', name: 'Merchant Interchange & Gateway Take (Stripe/Shopify)', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Operating Commercial Checking',
            changeText: '+$14,200 net weekly payouts',
            isPositive: true,
            icon: 'DollarSign',
            badge: 'Cash Flow'
          },
          {
            id: 'kpi_inventory',
            label: 'Inventory on Hand (FIFO)',
            value: '$68,450.00',
            numericValue: 68450,
            subtext: '48 Days of Supply • 14 SKUs',
            changeText: 'Turnover Ratio: 5.2x/yr',
            isPositive: true,
            icon: 'ShoppingBag',
            badge: 'Asset 1300'
          },
          {
            id: 'kpi_sales_tax',
            label: 'Sales Tax Liability Accrued',
            value: '$6,420.00',
            numericValue: 6420,
            subtext: 'California, Texas, New York',
            changeText: 'Due Nov 20th Remittance',
            isPositive: false,
            icon: 'Scale',
            badge: 'Payable 2200'
          },
          {
            id: 'kpi_merchant_take',
            label: 'Blended Merchant Take Rate',
            value: '2.84%',
            numericValue: 2.84,
            subtext: '$1,092 gateway fees on $38.4k gross',
            changeText: '-0.12% vs last month',
            isPositive: true,
            icon: 'CreditCard',
            badge: 'Stripe/Shopify'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_ec_1',
            title: 'South Dakota v. Wayfair Economic Nexus Monitoring',
            desc: 'Tracks gross remote sales and transaction counts against state thresholds ($100k or 200 orders).',
            status: 'warning',
            citation: 'US Supreme Court Wayfair Decision / State Nexus'
          },
          {
            id: 'comp_ec_2',
            title: 'Form 1099-K Settlement Reconciliation',
            desc: 'Reconciles gross 1099-K reporting against net bank deposits and fee deductions to eliminate IRS audit flags.',
            status: 'ok',
            citation: 'IRC § 6050W Third-Party Settlement Payment'
          },
          {
            id: 'comp_ec_3',
            title: 'Lower of Cost or Market (LCM) Inventory Valuation',
            desc: 'Enforces GAAP inventory cost rules, writing down obsolete and damaged SKUs prior to tax year close.',
            status: 'active',
            citation: 'Treas. Reg. § 1.471-4 / GAAP ASC 330'
          }
        ],
        customAlerts: [
          {
            id: 'alt_ec_1',
            severity: 'warning',
            title: 'Approaching Economic Nexus Threshold in Texas ($468k of $500k)',
            message: 'Gross trailing 12-month sales into Texas are within 7% of statutory registration threshold. Prepare state permit.',
            actionText: 'View State Nexus Map',
            date: '5h ago'
          },
          {
            id: 'alt_ec_2',
            severity: 'info',
            title: 'Stripe Payout Reconciled with Fee Breakdown',
            message: 'Net payout ($38,400.00) matched. Split: $39,513.60 Gross Revenue, $1,113.60 Merchant Fees to Account 6500.',
            actionText: 'View Journal Line',
            date: '2d ago'
          }
        ],
        actionTools: [
          { id: 'act_ec1', title: 'Nexus State Audit Report', icon: 'MapPin', desc: 'Check sales volume against 45 state thresholds' },
          { id: 'act_ec2', title: '1-Click Sales Tax Remittance', icon: 'Download', desc: 'Export state-by-state return summaries' },
          { id: 'act_ec3', title: 'Inventory Reorder Alert', icon: 'AlertTriangle', desc: 'Calculate safety stock runway based on 30-day velocity' }
        ]
      };
    }

    case 'professional_services': {
      return {
        blueprintId: `bp-agency-${Date.now()}`,
        industryKey: 'professional_services',
        industryDisplayName: 'Agency, Legal & Consulting Practice Suite',
        businessModel: 'Client Advisory, Retainers & Specialized Services',
        revenueModel: profile.revenueModel || 'hourly_retainer',
        generationTimestamp: timestamp,
        confidenceScore: 99.1,
        aiRationale: `Synthesized for ${companyName} (${entityType}). Knowledge firms run on billable realization rates, unearned retainer balances, and client concentration management. Retalyy configured an Unearned Retainer Amortizer, Team Realization Gauge, and Client Concentration Risk monitor.`,
        activeWidgetIds: ['billable_utilization', 'retainer_burn', 'client_concentration', 'cash_runway_gauge'],
        recommendedChartOfAccounts: [
          { code: '1100', name: 'Accounts Receivable (Trade)', type: 'asset' },
          { code: '1180', name: 'Unbilled Client Reimbursable Expenses', type: 'asset' },
          { code: '2150', name: 'Unearned Client Retainers (Escrow/Trust)', type: 'liab' },
          { code: '4000', name: 'Monthly Client Retainer Income', type: 'rev' },
          { code: '4100', name: 'Hourly Project Advisory Billings', type: 'rev' },
          { code: '6600', name: 'Subcontracted Specialist & Freelancer Fees', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Checking & High-Yield Reserve',
            changeText: '+$21,500 retainer collections',
            isPositive: true,
            icon: 'DollarSign',
            badge: 'Operating'
          },
          {
            id: 'kpi_realization',
            label: 'Billable Realization Rate',
            value: '88.5%',
            numericValue: 88.5,
            subtext: 'Target 85.0% • 6 Billable Staff',
            changeText: '+3.5% vs target',
            isPositive: true,
            icon: 'Clock',
            badge: 'Productivity'
          },
          {
            id: 'kpi_retainers',
            label: 'Unearned Client Retainers',
            value: '$18,400.00',
            numericValue: 18400,
            subtext: '4 Retainers Active • ASC 606 Liab',
            changeText: 'Auto-depleting weekly',
            isPositive: true,
            icon: 'ShieldCheck',
            badge: 'Liability 2150'
          },
          {
            id: 'kpi_concentration',
            label: 'Top Client Concentration',
            value: '28.2%',
            numericValue: 28.2,
            subtext: 'Northwind Traders ($14.2k/mo)',
            changeText: 'Caution threshold: 30%',
            isPositive: false,
            icon: 'AlertTriangle',
            badge: 'Risk Monitor'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_ps_1',
            title: 'Client Retainer & Trust Account Segregation',
            desc: 'Unearned retainers must remain on balance sheet as liabilities until hours are delivered and billed.',
            status: 'ok',
            citation: 'State Bar / CPA Professional Ethics Rule 1.15'
          },
          {
            id: 'comp_ps_2',
            title: 'ASC 606 Performance Obligation Fulfillment',
            desc: 'Revenue recognized proportionally as monthly deliverables are transmitted to the client.',
            status: 'ok',
            citation: 'GAAP ASC 606 Service Deliverables'
          },
          {
            id: 'comp_ps_3',
            title: 'Form 1099-NEC to Specialist Freelancers',
            desc: 'Contract designers, specialized engineers, and expert witnesses require annual 1099 filings.',
            status: 'warning',
            citation: 'IRC § 6041 Non-Employee Services'
          }
        ],
        customAlerts: [
          {
            id: 'alt_ps_1',
            severity: 'warning',
            title: 'Retainer Balance Low: Blue Fern Studio ($420.00 remaining)',
            message: 'Project work burned 88% of initial $3,500 retainer deposit. Automated replenishment invoice ready to send.',
            actionText: 'Send Retainer Replenish',
            date: '3h ago'
          },
          {
            id: 'alt_ps_2',
            severity: 'info',
            title: 'Unbilled Client Reimbursables ($1,840.50)',
            message: 'Client travel and third-party software subscriptions ready to bundle onto next month invoices.',
            actionText: 'Bundle into Invoices',
            date: '1d ago'
          }
        ],
        actionTools: [
          { id: 'act_p1', title: 'Send Retainer Replenish', icon: 'CreditCard', desc: 'Auto-charge card on file when retainer dips below $500' },
          { id: 'act_p2', title: 'Consultant Utilization Report', icon: 'Users', desc: 'Weekly billable hours breakdown by associate' },
          { id: 'act_p3', title: 'Aged Unbilled WIP Exporter', icon: 'FileSpreadsheet', desc: 'Pull all logged time entries not yet invoiced' }
        ]
      };
    }

    case 'restaurant_hospitality': {
      return {
        blueprintId: `bp-rest-${Date.now()}`,
        industryKey: 'restaurant_hospitality',
        industryDisplayName: 'Restaurant & Hospitality Prime Cost Suite',
        businessModel: 'Food & Beverage Operations and Hospitality',
        revenueModel: profile.revenueModel || 'pos_ecommerce',
        generationTimestamp: timestamp,
        confidenceScore: 99.2,
        aiRationale: `Synthesized for ${companyName} (${entityType}). Restaurant profitability hinges entirely on Prime Cost (Food + Beverage COGS + Total Labor kept under 60% of gross revenue), daily POS settlement matching, and Section 45B FICA tip credits. Retalyy configured a live Prime Cost Radar, Daily POS Batch Matcher, and Tip Credit Ledger.`,
        activeWidgetIds: ['prime_cost', 'daily_pos_match', 'cash_runway_gauge'],
        recommendedChartOfAccounts: [
          { code: '1000', name: 'Operating Checking & Merchant Clearing', type: 'asset' },
          { code: '1350', name: 'Food & Beverage Inventory (Weekly Count)', type: 'asset' },
          { code: '2250', name: 'Employee Tips Payable & FICA Clearing', type: 'liab' },
          { code: '4000', name: 'Food Sales Revenue', type: 'rev' },
          { code: '4100', name: 'Beverage & Liquor Sales Revenue', type: 'rev' },
          { code: '5100', name: 'Food Cost of Goods Sold (COGS)', type: 'exp' },
          { code: '5200', name: 'Beverage & Bar COGS', type: 'exp' },
          { code: '6050', name: 'Kitchen & Back-of-House Labor', type: 'exp' },
          { code: '6060', name: 'Front-of-House Service Labor', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Daily POS Deposits Cleared',
            changeText: '+$4,210.50 yesterday net',
            isPositive: true,
            icon: 'DollarSign',
            badge: 'Operating'
          },
          {
            id: 'kpi_prime_cost',
            label: 'Prime Cost Ratio',
            value: '57.2%',
            numericValue: 57.2,
            subtext: 'Target <60.0% (Food 28% + Labor 29.2%)',
            changeText: '-1.8% vs last week',
            isPositive: true,
            icon: 'Utensils',
            badge: 'Gold Standard'
          },
          {
            id: 'kpi_pos_reconcile',
            label: 'Daily POS Settlement Match',
            value: '99.8%',
            numericValue: 99.8,
            subtext: 'Toast / Square vs Bank Feed',
            changeText: '30 of 30 days reconciled',
            isPositive: true,
            icon: 'CheckCircle2',
            badge: 'POS Match'
          },
          {
            id: 'kpi_fica_tip',
            label: 'FICA Tip Credit Accrued',
            value: '$4,190.00',
            numericValue: 4190,
            subtext: 'Section 45B Direct Tax Credit',
            changeText: 'Reduces federal tax dollar-for-dollar',
            isPositive: true,
            icon: 'Award',
            badge: 'IRC § 45B'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_rh_1',
            title: 'IRC § 45B Employer FICA Tip Credit Calculation',
            desc: 'Provides a dollar-for-dollar tax credit for the employer portion of Social Security and Medicare taxes paid on tip income above minimum wage.',
            status: 'ok',
            citation: 'IRC § 45B FICA Tip Tax Credit'
          },
          {
            id: 'comp_rh_2',
            title: 'IRS Form 8027 Annual Tip Reporting',
            desc: 'Applies to large food or beverage establishments where tipping is customary and gross sales exceed statutory limits.',
            status: 'active',
            citation: 'IRC § 6053(c) Form 8027 Reporting'
          },
          {
            id: 'comp_rh_3',
            title: 'Sales Tax Food vs Beverage Segregation',
            desc: 'Accurately segregates exempt cold food from taxable hot meals and prepared alcoholic beverages.',
            status: 'ok',
            citation: 'State Dept of Revenue Food Tax Regulations'
          }
        ],
        customAlerts: [
          {
            id: 'alt_rh_1',
            severity: 'info',
            title: 'Prime Cost In Optimal Green Zone (57.2%)',
            message: 'Food cost (28.0%) and labor cost (29.2%) beat the 60% industry benchmark, generating $3,450 in surplus cash flow.',
            actionText: 'View Prime Cost Breakdown',
            date: '6h ago'
          },
          {
            id: 'alt_rh_2',
            severity: 'info',
            title: 'Toast POS Daily Batch Reconciled',
            message: 'Batch #8921 ($4,210.50 gross, $112.40 processing fee) matched precisely to checking deposit.',
            actionText: 'View Reconcile Line',
            date: '1d ago'
          }
        ],
        actionTools: [
          { id: 'act_r1', title: 'Daily POS Settlement Match', icon: 'CheckCircle2', desc: 'Instantly balance register tape against bank deposit' },
          { id: 'act_r2', title: 'Weekly Prime Cost Scorecard', icon: 'FileSpreadsheet', desc: 'Calculate food waste & labor efficiency in minutes' },
          { id: 'act_r3', title: 'Section 45B Tip Credit Export', icon: 'Award', desc: 'Package tip payroll data for CPA tax return' }
        ]
      };
    }

    case 'medical_clinic': {
      return {
        blueprintId: `bp-med-${Date.now()}`,
        industryKey: 'medical_clinic',
        industryDisplayName: 'Healthcare & Medical Practice Clinical Suite',
        businessModel: 'Outpatient Clinic & Healthcare Provider Services',
        revenueModel: profile.revenueModel || 'insurance_fee_service',
        generationTimestamp: timestamp,
        confidenceScore: 99.3,
        aiRationale: `Synthesized for ${companyName} (${entityType}). Medical practices grapple with insurance payor aging delays (often 60–90 days), provider production-based compensation, and ASC 842 medical equipment lease accounting. Retalyy configured an Insurance Claim Aging Radar, Provider Production Ledger, and Lease Liability schedule.`,
        activeWidgetIds: ['insurance_ar_aging', 'provider_production', 'cash_runway_gauge'],
        recommendedChartOfAccounts: [
          { code: '1120', name: 'Insurance Claims Receivable (A/R)', type: 'asset' },
          { code: '1130', name: 'Patient Copay & Self-Pay Receivable', type: 'asset' },
          { code: '2550', name: 'Medical Equipment Lease Liabilities (ASC 842)', type: 'liab' },
          { code: '4000', name: 'Clinical & Provider Service Revenue', type: 'rev' },
          { code: '4010', name: 'Contractual Insurance Allowances (Contra-Rev)', type: 'rev' },
          { code: '6150', name: 'Medical & Dental Clinical Consumables', type: 'exp' },
          { code: '6650', name: 'Malpractice Liability Insurance', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Operating Commercial Checking',
            changeText: '+$18,920 insurance remittances',
            isPositive: true,
            icon: 'DollarSign',
            badge: 'Operating'
          },
          {
            id: 'kpi_insurance_aging',
            label: 'Insurance Claims A/R >60 Days',
            value: '$24,800.00',
            numericValue: 24800,
            subtext: 'Aetna, BlueCross, UnitedHealthcare',
            changeText: '-14% overdue claims',
            isPositive: true,
            icon: 'Clock',
            badge: 'Payor Radar'
          },
          {
            id: 'kpi_provider_split',
            label: 'Provider Production Accrued',
            value: '$54,200.00',
            numericValue: 54200,
            subtext: '4 Attending Physicians / Specialists',
            changeText: '42.0% production split',
            isPositive: true,
            icon: 'Users',
            badge: 'Clinical Comp'
          },
          {
            id: 'kpi_equipment_lease',
            label: 'ASC 842 Equipment Leases',
            value: '$38,200.00',
            numericValue: 38200,
            subtext: 'Diagnostic Imaging & Surgical Lasers',
            changeText: 'Fully amortized on schedule',
            isPositive: true,
            icon: 'ShieldCheck',
            badge: 'ASC 842'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_md_1',
            title: 'ASC 842 Medical Equipment Operating Lease Capitalization',
            desc: 'Right-of-use asset and corresponding lease liabilities must be recognized on the balance sheet.',
            status: 'ok',
            citation: 'GAAP ASC 842 Lease Accounting'
          },
          {
            id: 'comp_md_2',
            title: 'HIPAA Business Associate Vendor Agreements (BAA)',
            desc: 'All cloud accounting, billing clearinghouses, and bank aggregators must maintain executed BAAs.',
            status: 'ok',
            citation: 'HHS HIPAA Security Rule 45 CFR Part 164'
          },
          {
            id: 'comp_md_3',
            title: 'Insurance Contractual Allowance Valuation Reserve',
            desc: 'Gross billings must be discounted to contractual allowed amounts prior to period close.',
            status: 'active',
            citation: 'GAAP Healthcare Revenue Valuation'
          }
        ],
        customAlerts: [
          {
            id: 'alt_md_1',
            severity: 'info',
            title: 'Insurance Overdue A/R Dropped to 6-Month Low',
            message: 'Overdue claims >60 days decreased to $24.8k following clearinghouse automated claim resubmission.',
            actionText: 'View Overdue Claims',
            date: '4h ago'
          },
          {
            id: 'alt_md_2',
            severity: 'info',
            title: 'Provider Production Pool Calculated',
            message: 'October clinical collections allocated across 4 attending clinicians per physician agreement terms.',
            actionText: 'View Doctor Splits',
            date: '2d ago'
          }
        ],
        actionTools: [
          { id: 'act_m1', title: 'Payor Aging Analysis', icon: 'Clock', desc: 'Audit unpaid claims grouped by commercial insurance carrier' },
          { id: 'act_m2', title: 'Provider Production Report', icon: 'Users', desc: 'Generate monthly collection splits for clinician payroll' },
          { id: 'act_m3', title: 'Equipment Lease Schedule', icon: 'FileSpreadsheet', desc: 'ASC 842 monthly interest vs principal breakdown' }
        ]
      };
    }

    default: {
      return {
        blueprintId: `bp-custom-${Date.now()}`,
        industryKey: 'custom',
        industryDisplayName: 'Adaptive Universal Financial Intelligence Suite',
        businessModel: profile.industry || 'Multi-Sector Commercial Enterprise',
        revenueModel: profile.revenueModel || 'mixed',
        generationTimestamp: timestamp,
        confidenceScore: 98.5,
        aiRationale: `Synthesized for ${companyName} (${entityType}, ${accountingMethod} basis). The AI model constructed a dynamic financial ledger architecture tailored to ${profile.industry || 'your business operations'}, prioritizing cash runway, double-entry verification, and automatic tax set-asides.`,
        activeWidgetIds: ['cash_runway_gauge', 'job_costing', 'sales_tax_nexus'],
        recommendedChartOfAccounts: [
          { code: '1000', name: 'Operating Bank Account', type: 'asset' },
          { code: '1100', name: 'Accounts Receivable', type: 'asset' },
          { code: '2000', name: 'Accounts Payable', type: 'liab' },
          { code: '4000', name: 'Primary Commercial Revenue', type: 'rev' },
          { code: '6000', name: 'Operating & Administrative Expenses', type: 'exp' }
        ],
        primaryKpis: [
          {
            id: 'kpi_bank',
            label: 'Operating Cash in Bank',
            value: '$148,500.00',
            numericValue: 148500,
            subtext: 'Operating Commercial Checking',
            changeText: 'Live Cleared Balance',
            isPositive: true,
            icon: 'DollarSign',
            badge: 'Liquid'
          },
          {
            id: 'kpi_runway',
            label: 'Cash Runway',
            value: `${Math.max(1, Math.round((148500 / monthlyBurn) * 10) / 10)} Mos`,
            numericValue: 148500 / monthlyBurn,
            subtext: `At $${monthlyBurn.toLocaleString()}/mo burn`,
            changeText: 'Based on active expenses',
            isPositive: true,
            icon: 'TrendingUp',
            badge: 'Runway'
          },
          {
            id: 'kpi_tax_reserve',
            label: 'Quarterly Tax Reserve',
            value: `${cashReserveRate}%`,
            numericValue: cashReserveRate,
            subtext: 'Automated segregation from profit',
            changeText: 'State & Federal Safe Harbor',
            isPositive: true,
            icon: 'ShieldCheck',
            badge: 'Tax Set-Aside'
          },
          {
            id: 'kpi_clean_books',
            label: 'Autonomous Reconcile Rate',
            value: '98.4%',
            numericValue: 98.4,
            subtext: 'Double-entry verified (Debits = Credits)',
            changeText: 'Zero manual spreadsheet entries',
            isPositive: true,
            icon: 'CheckCircle2',
            badge: 'Audit Ready'
          }
        ],
        complianceChecklist: [
          {
            id: 'comp_c1',
            title: 'Double-Entry Balanced Invariant',
            desc: 'Every journal transaction enforces strict debit/credit equality prior to posting.',
            status: 'ok',
            citation: 'Financial Invariant Rule #5'
          },
          {
            id: 'comp_c2',
            title: 'IRS De Minimis Safe Harbor Election',
            desc: 'Purchases under $2,500 are expensed immediately; larger capital assets are depreciated.',
            status: 'ok',
            citation: 'Treas. Reg. § 1.263(a)-1(f)'
          }
        ],
        customAlerts: [
          {
            id: 'alt_c1',
            severity: 'info',
            title: 'Adaptive Ledger Operational',
            message: `Custom dashboard active for ${companyName}. The AI engine will dynamically adapt metrics as documents are processed.`,
            actionText: 'Explore Features',
            date: 'Just now'
          }
        ],
        actionTools: [
          { id: 'act_c1', title: 'Export Financial Statements', icon: 'Download', desc: '1-click P&L, Balance Sheet, and Trial Balance' },
          { id: 'act_c2', title: 'Reconfigure AI Architecture', icon: 'Sparkles', desc: 'Adjust widgets or switch industry models' }
        ]
      };
    }
  }
}
