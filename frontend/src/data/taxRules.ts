import { TaxRuleReference } from '../types';

export interface StateTaxRate {
  code: string;
  name: string;
  rate: number; // Approximate effective rate on self-employment net
  ptetAvailable: boolean; // Pass-Through Entity Tax
}

export const US_STATES: StateTaxRate[] = [
  { code: 'AL', name: 'Alabama', rate: 0.05, ptetAvailable: true },
  { code: 'AK', name: 'Alaska', rate: 0.00, ptetAvailable: false },
  { code: 'AZ', name: 'Arizona', rate: 0.025, ptetAvailable: true },
  { code: 'AR', name: 'Arkansas', rate: 0.044, ptetAvailable: true },
  { code: 'CA', name: 'California', rate: 0.093, ptetAvailable: true },
  { code: 'CO', name: 'Colorado', rate: 0.044, ptetAvailable: true },
  { code: 'CT', name: 'Connecticut', rate: 0.0699, ptetAvailable: true },
  { code: 'DE', name: 'Delaware', rate: 0.066, ptetAvailable: false },
  { code: 'FL', name: 'Florida', rate: 0.00, ptetAvailable: false },
  { code: 'GA', name: 'Georgia', rate: 0.0549, ptetAvailable: true },
  { code: 'HI', name: 'Hawaii', rate: 0.08, ptetAvailable: true },
  { code: 'ID', name: 'Idaho', rate: 0.058, ptetAvailable: true },
  { code: 'IL', name: 'Illinois', rate: 0.0495, ptetAvailable: true },
  { code: 'IN', name: 'Indiana', rate: 0.0305, ptetAvailable: true },
  { code: 'IA', name: 'Iowa', rate: 0.057, ptetAvailable: true },
  { code: 'KS', name: 'Kansas', rate: 0.057, ptetAvailable: true },
  { code: 'KY', name: 'Kentucky', rate: 0.04, ptetAvailable: true },
  { code: 'LA', name: 'Louisiana', rate: 0.0425, ptetAvailable: true },
  { code: 'ME', name: 'Maine', rate: 0.0715, ptetAvailable: false },
  { code: 'MD', name: 'Maryland', rate: 0.0575, ptetAvailable: true },
  { code: 'MA', name: 'Massachusetts', rate: 0.05, ptetAvailable: true },
  { code: 'MI', name: 'Michigan', rate: 0.0425, ptetAvailable: true },
  { code: 'MN', name: 'Minnesota', rate: 0.0785, ptetAvailable: true },
  { code: 'MS', name: 'Mississippi', rate: 0.047, ptetAvailable: true },
  { code: 'MO', name: 'Missouri', rate: 0.048, ptetAvailable: true },
  { code: 'MT', name: 'Montana', rate: 0.059, ptetAvailable: true },
  { code: 'NE', name: 'Nebraska', rate: 0.0584, ptetAvailable: true },
  { code: 'NV', name: 'Nevada', rate: 0.00, ptetAvailable: false },
  { code: 'NH', name: 'New Hampshire', rate: 0.00, ptetAvailable: false },
  { code: 'NJ', name: 'New Jersey', rate: 0.0637, ptetAvailable: true },
  { code: 'NM', name: 'New Mexico', rate: 0.049, ptetAvailable: true },
  { code: 'NY', name: 'New York', rate: 0.0685, ptetAvailable: true },
  { code: 'NC', name: 'North Carolina', rate: 0.045, ptetAvailable: true },
  { code: 'ND', name: 'North Dakota', rate: 0.025, ptetAvailable: false },
  { code: 'OH', name: 'Ohio', rate: 0.035, ptetAvailable: true },
  { code: 'OK', name: 'Oklahoma', rate: 0.0475, ptetAvailable: true },
  { code: 'OR', name: 'Oregon', rate: 0.09, ptetAvailable: true },
  { code: 'PA', name: 'Pennsylvania', rate: 0.0307, ptetAvailable: false },
  { code: 'RI', name: 'Rhode Island', rate: 0.0599, ptetAvailable: true },
  { code: 'SC', name: 'South Carolina', rate: 0.064, ptetAvailable: true },
  { code: 'SD', name: 'South Dakota', rate: 0.00, ptetAvailable: false },
  { code: 'TN', name: 'Tennessee', rate: 0.00, ptetAvailable: false },
  { code: 'TX', name: 'Texas', rate: 0.00, ptetAvailable: false },
  { code: 'UT', name: 'Utah', rate: 0.0465, ptetAvailable: true },
  { code: 'VT', name: 'Vermont', rate: 0.066, ptetAvailable: false },
  { code: 'VA', name: 'Virginia', rate: 0.0575, ptetAvailable: true },
  { code: 'WA', name: 'Washington', rate: 0.00, ptetAvailable: false },
  { code: 'WV', name: 'West Virginia', rate: 0.0512, ptetAvailable: true },
  { code: 'WI', name: 'Wisconsin', rate: 0.053, ptetAvailable: true },
  { code: 'WY', name: 'Wyoming', rate: 0.00, ptetAvailable: false }
];

export const TAX_RULES_DIRECTORY: TaxRuleReference[] = [
  {
    id: 'rule-solo401k',
    title: 'Solo 401(k) Employee Deferral Limit',
    year2024: '$23,000 ($30,500 age 50+)',
    year2025: '$23,500 ($31,000 age 50+)',
    year2026: '$24,000 ($31,500 age 50+)',
    category: 'Retirement Limits',
    legalCitation: 'IRC §402(g), §414(v)',
    description: 'Permits 100% of earned compensation up to the limit to be contributed pretax, lowering immediate federal and state adjusted gross income.'
  },
  {
    id: 'rule-solo401k-total',
    title: 'Solo 401(k) Total Employer/Employee Cap',
    year2024: '$69,000 ($76,500 age 50+)',
    year2025: '$70,000 ($77,500 age 50+)',
    year2026: '$71,000 ($78,500 age 50+)',
    category: 'Retirement Limits',
    legalCitation: 'IRC §415(c)(1)(A)',
    description: 'Allows an additional 25% of W-2 payroll (or 20% of net Schedule C profit) as a tax-deductible employer profit-sharing contribution.'
  },
  {
    id: 'rule-ss-wage-base',
    title: 'Social Security Wage Base (OASDI 12.4%)',
    year2024: '$168,600',
    year2025: '$176,100',
    year2026: '$181,800 (projected)',
    category: 'Self-Employment Tax',
    legalCitation: 'IRC §1402(b), §3121(a)(1)',
    description: 'Earnings above this threshold are exempt from the 12.4% Social Security portion of FICA / SE tax. S-Corporations leverage this via reasonable salary distributions.'
  },
  {
    id: 'rule-qbi-threshold',
    title: 'Section 199A QBI Deduction Phaseout (Single / MFJ)',
    year2024: '$191,950 / $383,900',
    year2025: '$197,300 / $394,600',
    year2026: '$202,500 / $405,000',
    category: 'Pass-Through Entity Tax',
    legalCitation: 'IRC §199A(e)(2)',
    description: 'Allows up to 20% deduction on qualified business income. Specified Service Trades or Businesses (SSTB) phase out above these thresholds unless optimized via W-2 wage balance.'
  },
  {
    id: 'rule-std-deduction',
    title: 'Federal Standard Deduction (Single / MFJ)',
    year2024: '$14,600 / $29,200',
    year2025: '$15,000 / $30,000',
    year2026: '$15,350 / $30,700',
    category: 'Deductions',
    legalCitation: 'IRC §63(c)',
    description: 'Baseline federal deduction applied to adjusted gross income when itemized deductions do not exceed this threshold.'
  },
  {
    id: 'rule-home-office',
    title: 'Home Office Deduction (Simplified Method)',
    year2024: '$5 per sq ft (max 300 sq ft = $1,500)',
    year2025: '$5 per sq ft (max 300 sq ft = $1,500)',
    year2026: '$5 per sq ft (max 300 sq ft = $1,500)',
    category: 'Deductions',
    legalCitation: 'IRC §280A(c)(1), Rev. Proc. 2013-12',
    description: 'Actual expense method (prorated rent, utilities, depreciation) frequently yields $3,500 to $7,000+ for home-based founders, documented via Accountable Plan.'
  }
];

export interface TaxDeadlineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  targetAudience: string;
  irsForm: string;
  isUpcoming: boolean;
}

export const IRS_DEADLINE_CALENDAR: TaxDeadlineItem[] = [
  {
    id: 'd-q1',
    date: 'April 15, 2026',
    title: 'Q1 Estimated Tax Payment & 2025 Federal Tax Return',
    description: 'Form 1040-ES payment for Q1 income, or Form 4868 to file for an automatic 6-month extension to October 15.',
    targetAudience: 'All Self-Employed & 1099',
    irsForm: 'Form 1040-ES / Form 1040',
    isUpcoming: true
  },
  {
    id: 'd-s-corp',
    date: 'March 15, 2026',
    title: 'Form 2553 S-Corp Election & Form 1120-S Corporate Return',
    description: 'Strict 75-day deadline to elect S-Corp tax status for the current calendar tax year or file Form 7004 extension.',
    targetAudience: 'S-Corporations & Electing LLCs',
    irsForm: 'Form 2553 / Form 1120-S',
    isUpcoming: false
  },
  {
    id: 'd-q2',
    date: 'June 15, 2026',
    title: 'Q2 Estimated Tax Payment',
    description: 'Second quarterly instalment of self-employment and federal income tax for income earned April 1 – May 31.',
    targetAudience: 'All Self-Employed & 1099',
    irsForm: 'Form 1040-ES',
    isUpcoming: false
  },
  {
    id: 'd-q3',
    date: 'September 15, 2026',
    title: 'Q3 Estimated Tax Payment & Extended S-Corp Return Deadline',
    description: 'Third quarterly payment + final filing deadline for calendar-year S-Corporations that filed Form 7004 extension.',
    targetAudience: 'All Self-Employed & S-Corps',
    irsForm: 'Form 1040-ES / Form 1120-S (ext)',
    isUpcoming: false
  },
  {
    id: 'd-q4',
    date: 'January 15, 2027',
    title: 'Q4 Estimated Tax Payment',
    description: 'Final estimated quarterly payment for fourth quarter earnings, reconciling full-year safe harbor thresholds.',
    targetAudience: 'All Self-Employed & 1099',
    irsForm: 'Form 1040-ES',
    isUpcoming: false
  }
];

export interface ProfessionGuide {
  id: string;
  role: string;
  avgSavings: string;
  primaryMoves: string[];
  watchOuts: string;
  caseNote: string;
}

export const PROFESSION_GUIDES: ProfessionGuide[] = [
  {
    id: 'p-tech',
    role: 'Tech Contractors & Staff Augmentation Engineers',
    avgSavings: '$14,500 – $24,000 / year',
    primaryMoves: [
      'S-Corp Election to split $180k–$300k billing into $105k reasonable salary + remaining distribution',
      'Individual 401(k) elective deferral + 25% employer profit share to shelter up to $69,000',
      'Home office accountable plan covering fiber internet, multi-monitor workstation, and prorated rent'
    ],
    watchOuts: 'Reasonable compensation must reflect BLS benchmarks for senior engineering lead roles to withstand IRS audit.',
    caseNote: 'San Francisco full-stack contractor earning $240k saved $18,900 in year one via Retalyy plan.'
  },
  {
    id: 'p-creative',
    role: 'Creative Directors, Agency Owners & Video Producers',
    avgSavings: '$12,000 – $21,000 / year',
    primaryMoves: [
      'Section 179 expensing & bonus depreciation on cinema cameras, editing rigs, and studio audio',
      'IRC §280A(g) Augusta Rule (up to 14 days of tax-free personal home rental for company planning)',
      'Accountable plan reimbursement for mileage, travel meals (50%), and client pitch development'
    ],
    watchOuts: 'Augusta Rule meetings require written corporate minutes, independent market appraisal for day rates, and formal checks.',
    caseNote: 'Brooklyn boutique creative studio owner earning $190k trimmed $14,400 off effective tax liability.'
  },
  {
    id: 'p-medical',
    role: '1099 Healthcare, Locum Tenens & Allied Specialists',
    avgSavings: '$16,000 – $32,000 / year',
    primaryMoves: [
      'Defined Benefit Cash Balance Plan alongside Solo 401(k) for $100k+ annual pretax sheltering',
      'Self-Employed Health Insurance Deduction under IRC §162(l) covering medical, dental, and Medicare premiums',
      'State Pass-Through Entity Tax (PTET) election to bypass the federal $10,000 SALT cap'
    ],
    watchOuts: 'Healthcare is a Specified Service Trade or Business (SSTB); QBI phases out quickly, making pension shelters paramount.',
    caseNote: 'Austin locum tenens specialist earning $310k protected $28,700 in combined state & federal taxes.'
  },
  {
    id: 'p-ecomm',
    role: 'E-Commerce Sellers & Amazon FBA Operators',
    avgSavings: '$11,000 – $19,500 / year',
    primaryMoves: [
      'Inventory capitalization optimization (UNICAP rules under TCJA small business exemption IRC §471(c))',
      'Foreign currency transaction accounting & software subscription write-offs',
      'S-Corp multi-state nexus containment to prevent inadvertent franchise tax liabilities'
    ],
    watchOuts: 'Physical warehouse inventory can trigger nexus in states like PA, CA, and NC regardless of home residence.',
    caseNote: 'Miami DTC brand operator with $165k net profit saved $13,100 in unneeded self-employment tax.'
  }
];
