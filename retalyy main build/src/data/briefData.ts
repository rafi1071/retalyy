import { CategoryPack, CompanyTargetSize, JobCostRecord, CashForecastWeek, FunctionalityModule } from '../types';

export const CATEGORY_PACKS: CategoryPack[] = [
  {
    id: 'trades',
    name: 'Trades & Construction',
    who: 'Owner-operators & trade crews (electricians, plumbers, HVAC, remodelers)',
    packRules: 'Job costing, progress billing schedules, subcontractor W-9 & 1099 tracking, material vs. labor splits',
    typicalMoneyPain: 'Surprise year-end tax bills, unknown job profitability, lost truck receipts, delayed draw releases',
    monthlyPriceAssumption: '$30 – $120 / mo',
    iconName: 'trades',
    badge: 'Launch Vertical',
    launchPhase: 'Launch'
  },
  {
    id: 'freelancers',
    name: 'Freelancers & Consultants',
    who: 'Designers, software engineers, fractional executives, copywriters, coaches',
    packRules: 'Client & project profitability, overhead allocation, milestone billing schedules, contractor vs. payroll splits',
    typicalMoneyPain: 'Lumpy monthly cash flow, delayed retainer invoicing, unclear project margins, unbilled client expenses',
    monthlyPriceAssumption: '$30 – $120 / mo',
    iconName: 'freelance',
    badge: 'Phase 2 Pack',
    launchPhase: 'Phase 2'
  },
  {
    id: 'gig',
    name: 'Gig & Delivery Operators',
    who: 'Rideshare drivers, courier fleets, logistics contractors',
    packRules: 'Multi-platform payout reconciliation (Uber, Lyft, DoorDash), operating expense logging, fleet fuel & maintenance tracking',
    typicalMoneyPain: 'Income fragmented across 4+ platforms, untracked vehicle maintenance overhead, unpredictable net margins',
    monthlyPriceAssumption: '$30 – $75 / mo',
    iconName: 'gig',
    badge: 'Phase 2 Pack',
    launchPhase: 'Phase 2'
  },
  {
    id: 'sellers',
    name: 'Online Sellers & Creators',
    who: 'Shopify merchants, Amazon FBA sellers, YouTube & newsletter creators',
    packRules: 'Gross marketplace payout reconciliation, COGS & inventory valuation, multi-channel fee audits, working capital tracking',
    typicalMoneyPain: 'Platform fees hiding true net margin, inventory working capital drag, multi-channel reconciliation chaos',
    monthlyPriceAssumption: '$45 – $120 / mo',
    iconName: 'sellers',
    badge: 'Phase 2 Pack',
    launchPhase: 'Phase 2'
  },
  {
    id: 'landlords',
    name: 'Landlords & Rental Hosts',
    who: 'Owners of 1 to 10 residential, multi-family, or Airbnb/VRBO properties',
    packRules: 'Per-property operational P&L, rent roll tracking, maintenance vs. capital improvement tagging, vendor billing audits',
    typicalMoneyPain: 'Co-mingled personal and property bank accounts, lost contractor invoices, delayed unit turnaround accounting',
    monthlyPriceAssumption: '$40 – $120 / mo',
    iconName: 'landlord',
    badge: 'Phase 2 Pack',
    launchPhase: 'Phase 2'
  },
  {
    id: 'services',
    name: 'Independent Service Providers',
    who: 'Stylists, physical therapists, private tutors, fitness studio instructors',
    packRules: 'Booking-to-books POS sync, tip reconciliation, cash drawer tracking, studio rental and supply overhead tracking',
    typicalMoneyPain: 'Informal cash records, unmapped merchant processing fees, unpredictable monthly cash reserves',
    monthlyPriceAssumption: '$30 – $90 / mo',
    iconName: 'services',
    badge: 'Phase 2 Pack',
    launchPhase: 'Phase 2'
  }
];

export const TARGET_SIZE_MATRIX: CompanyTargetSize[] = [
  {
    segment: 'Owner-Operator',
    size: 'Solo to 5 employees',
    revenue: '$150K to $1M',
    fit: 'Entry segment',
    reason: 'Needs books and running tax set-aside; low revenue per client, high volume. Reached direct or through firm channel.',
    pricingHypothesis: '$30 to $120 / month'
  },
  {
    segment: 'Core SMB (Sweet Spot)',
    size: '10 to 150 employees (0 to 3 finance staff)',
    revenue: '$2M to $30M',
    fit: 'Best fit',
    reason: 'Too big for DIY books, too small for a full in-house finance team. Controller, AP/AR, and 13-week CFO needs begin here.',
    pricingHypothesis: '$1,500 to $5,000 / month'
  },
  {
    segment: 'Upper Mid-Market',
    size: '150 to 500 employees',
    revenue: '$30M to $150M',
    fit: 'Later',
    reason: 'Requires complex ERP integration (NetSuite/SAP), audit-ready SOX controls, and prolonged 9-month enterprise sales cycles.',
    pricingHypothesis: '$5,000+ / month (Enterprise)'
  },
  {
    segment: 'Large Corporate',
    size: '500+ employees',
    revenue: '$150M+',
    fit: 'Not planned',
    reason: 'Heavy in-house treasury, entrenched standing finance teams, and institutional audit mandates outside Retalyy scope.',
    pricingHypothesis: 'N/A'
  }
];

export const PITCH_RULES = [
  {
    avoid: 'AI-powered, revolutionary, disruptive',
    sayInstead: 'First-pass books and a ready review queue',
    rationale: 'Focuses on tangible workflow capacity rather than tech hype.'
  },
  {
    avoid: 'Replaces your accountant or finance team',
    sayInstead: 'Your reviewers spend time on judgment, not data entry',
    rationale: 'Eliminates licensing objections and positions firms as indispensable partners.'
  },
  {
    avoid: '100x better, faster, cheaper',
    sayInstead: 'Hours saved per close, measured in your pilot',
    rationale: 'Grounds value proposition in hard, audit-verified firm metrics.'
  },
  {
    avoid: 'Tax lawyer in a box / certified CPA replacement',
    sayInstead: 'Standardized operational accounting software with complete audit trails for firm or business review',
    rationale: 'Clarifies that Retalyy is workflow software and preserves strict legal compliance boundaries.'
  }
];

export const PILOT_OFFER_DETAILS = {
  title: 'Risk-Free Accounting Firm Partnership Pilot',
  firmProfileTarget: 'Firms with 3 to 25 staff and at least 15 trades/contractor clients',
  clientCount: 'Flexible Live Client Accounts',
  duration: 'Risk-Free Partnership Pilot',
  onboarding: 'Setup & data migration 100% handled by Retalyy',
  branding: "Your firm's name stays on everything (Firm of Record)",
  governance: 'Your firm maintains complete review control on our dedicated partner dashboard',
  costDuringPilot: '$0 (Zero platform fee, zero migration cost)',
  postPilotPricing: '$30 to $120 / month per live client, pay only if close time falls ≥40%'
};

export const SAMPLE_JOB_COSTS: JobCostRecord[] = [
  {
    id: 'job-101',
    jobCode: 'JOB-2026-101',
    client: 'Highland Crest Commercial Complex',
    description: '3-Story Commercial HVAC & Ductwork Retrofit',
    bidAmount: 148500,
    actualCost: 112400,
    projectedProfit: 36100,
    currentMarginPercent: 24.3,
    marginStatus: 'healthy',
    progressBillingPercent: 75,
    subcontractorCount: 4,
    sub1099sChased: true
  },
  {
    id: 'job-102',
    jobCode: 'JOB-2026-102',
    client: 'Presidio Residential Estates',
    description: 'Architectural Framing & Structural Joist Remodel',
    bidAmount: 89000,
    actualCost: 78500,
    projectedProfit: 10500,
    currentMarginPercent: 11.8,
    marginStatus: 'warning',
    progressBillingPercent: 90,
    subcontractorCount: 3,
    sub1099sChased: true
  },
  {
    id: 'job-103',
    jobCode: 'JOB-2026-103',
    client: 'SOMA Tech Incubator HQ',
    description: 'Heavy Commercial 480V Subpanel & Wiring',
    bidAmount: 62000,
    actualCost: 41200,
    projectedProfit: 20800,
    currentMarginPercent: 33.5,
    marginStatus: 'healthy',
    progressBillingPercent: 60,
    subcontractorCount: 2,
    sub1099sChased: true
  },
  {
    id: 'job-104',
    jobCode: 'JOB-2026-104',
    client: 'Marina Bay Waterfront Villa',
    description: 'Custom Plumbing & Hydronic Radiant Heating',
    bidAmount: 115000,
    actualCost: 104500,
    projectedProfit: 10500,
    currentMarginPercent: 9.1,
    marginStatus: 'critical',
    progressBillingPercent: 95,
    subcontractorCount: 5,
    sub1099sChased: false
  }
];

export const SAMPLE_13_WEEK_FORECAST: CashForecastWeek[] = [
  { weekNumber: 1, weekDate: 'Oct 19', inflow: 42500, outflow: 28400, netCash: 14100, projectedBalance: 124500, safeHarborReserve: 4280 },
  { weekNumber: 2, weekDate: 'Oct 26', inflow: 38000, outflow: 34200, netCash: 3800, projectedBalance: 128300, safeHarborReserve: 3800 },
  { weekNumber: 3, weekDate: 'Nov 02', inflow: 65000, outflow: 48900, netCash: 16100, projectedBalance: 144400, safeHarborReserve: 6500 },
  { weekNumber: 4, weekDate: 'Nov 09', inflow: 29000, outflow: 31000, netCash: -2000, projectedBalance: 142400, safeHarborReserve: 2900 },
  { weekNumber: 5, weekDate: 'Nov 16', inflow: 51000, outflow: 36500, netCash: 14500, projectedBalance: 156900, safeHarborReserve: 5100 },
  { weekNumber: 6, weekDate: 'Nov 23', inflow: 18500, outflow: 22000, netCash: -3500, projectedBalance: 153400, safeHarborReserve: 1850 },
  { weekNumber: 7, weekDate: 'Nov 30', inflow: 74000, outflow: 46800, netCash: 27200, projectedBalance: 180600, safeHarborReserve: 7400 },
  { weekNumber: 8, weekDate: 'Dec 07', inflow: 36000, outflow: 32000, netCash: 4000, projectedBalance: 184600, safeHarborReserve: 3600 },
  { weekNumber: 9, weekDate: 'Dec 14', inflow: 44000, outflow: 38500, netCash: 5500, projectedBalance: 190100, safeHarborReserve: 4400 },
  { weekNumber: 10, weekDate: 'Dec 21', inflow: 21000, outflow: 25000, netCash: -4000, projectedBalance: 186100, safeHarborReserve: 2100 },
  { weekNumber: 11, weekDate: 'Dec 28', inflow: 33000, outflow: 29500, netCash: 3500, projectedBalance: 189600, safeHarborReserve: 3300 },
  { weekNumber: 12, weekDate: 'Jan 04', inflow: 58000, outflow: 42000, netCash: 16000, projectedBalance: 205600, safeHarborReserve: 5800 },
  { weekNumber: 13, weekDate: 'Jan 11', inflow: 62000, outflow: 44500, netCash: 17500, projectedBalance: 223100, safeHarborReserve: 6200 }
];

export const EXACT_FUNCTIONALITIES: FunctionalityModule[] = [
  {
    id: 'data-layer',
    name: 'Data Layer & Unified Ledger',
    shortName: 'Data Layer',
    phase: 'Launch',
    phaseBadge: 'Launch',
    exactFunctions: 'Bank and card feeds; receipt capture by text, email and app; document matching; complete QuickBooks and Xero replacement with 1-click ledger migration; every entry traceable to a source document and to the rule or person that classified it.',
    solvedProblem: 'Legacy accounting systems (QuickBooks, Xero) require tedious manual entry and lack vertical job-costing depth; finance work becomes periodic, reactive, and disconnected.',
    metricToTest: 'Days since last reconciliation; % of imported transactions matched to source document within 60 seconds; full migration from QBO/Xero under 2 hours.',
    targetCustomer: 'All tiers (Firms, Owner-operators, Core SMBs, B2C)',
    capabilities: [
      'Continuous live bank & credit card feed aggregation via Plaid Exchange',
      'Text SMS and camera receipt capture with instant OCR & merchant normalization',
      'Immutable audit trail linking every journal entry to source document',
      'Complete replacement for QuickBooks and Xero with 1-click historical ledger migration',
      'Enterprise-grade AES-256 cloud encryption with multi-factor audit controls'
    ]
  },
  {
    id: 'vertical-workspace',
    name: 'Vertical Workspace (CRM-Style)',
    shortName: 'Vertical Workspace',
    phase: 'Launch',
    phaseBadge: 'Launch',
    exactFunctions: 'Template per vertical or B2C category pack, configured in hours: chart of accounts, categorisation rules, customer and job records tied to financials, estimates and progress billing, subcontractor records, client portal, document requests and tasks.',
    solvedProblem: 'Generic accounting software lacks vertical depth; contractor job structures and category rules take weeks of bespoke manual setup.',
    metricToTest: 'Onboarding time under 2 hours; zero custom code required per client.',
    targetCustomer: 'Contractors, Trades & B2C Category Packs',
    capabilities: [
      'Pre-configured trades chart of accounts (CSI MasterFormat ready)',
      'Job & customer records directly tied to underlying financial ledger',
      'AIA G702/G703 style progress billing and draw schedule generation',
      'Subcontractor directory with W-9, COI, and lien waiver tracking',
      'White-labeled client portal for document requests, approvals, and reports'
    ]
  },
  {
    id: 'cost-tracking',
    name: 'Cost Tracking & Margin Alerts',
    shortName: 'Cost Tracking',
    phase: 'Launch (jobs), Phase 2 (departments)',
    phaseBadge: 'Launch',
    exactFunctions: 'Job and project cost, budget vs actual, bid vs actual, vendor cost view, margin alerts, purchase approval rules; department cost view for larger companies.',
    solvedProblem: 'Cost overruns surface after the job ends; no idea which jobs make money until tax season.',
    metricToTest: 'Overruns caught before job completion (target: 19+ days early); margin slippage alerts sent within 24h.',
    targetCustomer: 'Contractor companies (6 to 150 staff) & Owner-operators',
    capabilities: [
      'Live job-cost alerts comparing actual spend against estimated bids',
      'Direct labor, burden, subcontractor, and materials cost breakdown',
      'Automated purchase order matching and margin threshold warnings',
      'Vendor cost intelligence identifying pricing discrepancies across supply houses',
      'Departmental rollups for 15+ employee companies (Phase 2)'
    ]
  },
  {
    id: 'accounting-operations',
    name: 'Accounting Operations & Month-End Close',
    shortName: 'Accounting Ops',
    phase: 'Launch (reconciliation, statements), Phase 2 (AP and AR)',
    phaseBadge: 'Launch',
    exactFunctions: 'Reconciliation, draft balance sheet, income statement and cash flow statement, variance commentary, month-end close checklist; later AP bill capture and approval, AR invoicing and collection reminders.',
    solvedProblem: 'Reviewer hours cap growth at accounting firms; first week of each month lost to manual coding and chasing receipts.',
    metricToTest: 'Hours per close (target ≥40% reduction); share of transactions accepted without edits (target ≥90%).',
    targetCustomer: 'Accounting Firms (CAS) & Core SMBs',
    capabilities: [
      'Automated first-pass transaction coding and ledger reconciliation',
      'Draft balance sheet, income statement, and cash flow with variance commentary',
      'Month-end close checklist with multi-reviewer sign-off gates',
      'AP bill capture and approval routing with dual-authorization rules (Phase 2)',
      'AR progressive invoicing and smart collection reminders (Phase 2)'
    ]
  },
  {
    id: 'budget-forecasting',
    name: 'Budget & 13-Week Cash Forecasting',
    shortName: 'Budget & Forecast',
    phase: 'Phase 2',
    phaseBadge: 'Phase 2',
    exactFunctions: 'Budgets, rolling forecast, 13-week cash forecast, what-if scenarios, anomaly alerts.',
    solvedProblem: 'Lumpy cash flow and unexpected vendor/payroll bills; inability to forecast liquidity across job cycles.',
    metricToTest: 'Forecast accuracy within 6% at 4-week horizon; cash shortfall warnings generated 14+ days in advance.',
    targetCustomer: 'Core SMBs ($2M–$30M revenue) & Fractional CFOs',
    capabilities: [
      'Dynamic 13-week rolling cash forecast modeling inflows, outflows, and reserves',
      'What-if scenario engine for new crew hires, equipment purchases, and material price surges',
      'Automated operational cash reserve and working capital runway projections',
      'Cash burn anomaly detection flagging unexpected recurring subscriptions and fee spikes',
      'Executive summary reporting formatted for banking and bonding underwriters'
    ]
  },
  {
    id: 'tax-planning',
    name: 'Cash Reserve Planning & Entity Scenario Engine',
    shortName: 'Reserve Planning',
    phase: 'Phase 2',
    phaseBadge: 'Phase 2',
    exactFunctions: 'Operational cash set-aside, entity structure modeling, owner compensation planning, year-end financial close checklist.',
    solvedProblem: 'Financial planning happens once a year (if at all); surprise operating shortfalls; lack of real-time visibility.',
    metricToTest: 'Cash runway projection accuracy within 5%; 100% operational reserve targets met.',
    targetCustomer: 'Owner-operators, Core SMBs & B2C Users',
    capabilities: [
      'Real-time working capital and tax reserve set-aside calculated per deposit',
      'Entity structure operational efficiency modeling (LLC vs S-Corp overhead)',
      'Benchmark executive compensation studies using BLS regional industry data',
      'Quarterly cash reserve simulations and capital expenditure forecasting',
      'Transparent, audit-ready operational documentation for partner firm review'
    ]
  },
  {
    id: 'control-layer',
    name: 'Control Layer & Review Queue',
    shortName: 'Control Layer',
    phase: 'Launch',
    phaseBadge: 'Launch',
    exactFunctions: 'Review queue, exception triage, role permissions, full audit log; verified before release.',
    solvedProblem: 'Data errors undermine confidence; software without review control creates risk.',
    metricToTest: '100% of deliverables verified with full audit trail; reviewer triage time per exception <3 minutes.',
    targetCustomer: 'Accounting Firm Partners & Direct Businesses',
    capabilities: [
      'Exception-only triage queue routing ambiguous items to designated reviewers',
      'One-click digital approval and reconciliation before release to client portal',
      'Granular role-based access control (RBAC) separating preparers, reviewers, and owners',
      'Tamper-evident audit log recording every user touch, timestamp, and edit',
      'Backed by enterprise-grade data encryption and automated reconciliation checks'
    ]
  },
  {
    id: 'management-reporting',
    name: 'Management Reporting & CFO Layer',
    shortName: 'CFO Layer',
    phase: 'Phase 2 (packs), Phase 3 (managed service)',
    phaseBadge: 'Phase 2',
    exactFunctions: 'Monthly management pack, lender and bonding packs, KPI dashboard; a named controller or CFO of record for the managed finance function.',
    solvedProblem: 'Lender and bonding financial statements arrive late; owners lack high-level operational visibility.',
    metricToTest: 'Lender and bonding package turnaround under 48 hours; executive KPI review cycle <15 minutes.',
    targetCustomer: 'Core SMBs (10 to 150 employees) & Bonding Agencies',
    capabilities: [
      'Automated monthly executive management pack with graphical KPI dashboard',
      'On-demand surety bonding and commercial bank credit packages',
      'WIP (Work-In-Progress) schedule with over/under billing reconciliation',
      'Named Controller or Fractional CFO of record oversight (Phase 3)',
      'Board-ready financial decks with automated commentary'
    ]
  },
  {
    id: 'tax-filing-support',
    name: 'Tax Filing Support & Workpaper Assembly',
    shortName: 'Filing Support',
    phase: 'Phase 3',
    phaseBadge: 'Phase 3',
    exactFunctions: 'Data assembly, workpapers and review-ready return packages; the paid preparer of record reviews, signs and files.',
    solvedProblem: 'Year-end crunch; assembling raw receipts and trial balance takes weeks of billable accounting time.',
    metricToTest: 'Return preparation labor hours cut by 60%; zero rejection rate on e-filed packages.',
    targetCustomer: 'Partner Accounting Firms & Tax Practices',
    capabilities: [
      'Automated trial balance export and Schedule C / Form 1120-S workpaper mapping',
      'Source document binder assembled and hyperlinked to specific return line items',
      'State PTE and composite return workpaper packages prepared for review',
      'Review-ready return packet sent directly to firm’s paid preparer of record',
      'Full electronic signature integration and e-filing authorization queue'
    ]
  }
];

