import { StrategyFinding } from '../types';

export const INITIAL_FINDINGS: StrategyFinding[] = [
  {
    id: 'find-scorp-2553',
    title: 'S-Corporation Election (Form 2553) & Reasonable Salary Optimization',
    category: 'entity',
    estimatedSavingsRange: [8200, 14500],
    confidenceScore: 97,
    citation: 'IRC §1362(a), §1402(a)',
    citationSource: 'IRS Rev. Rul. 74-44; IRS Fact Sheet FS-2008-25',
    assumptions: [
      'Net self-employment profit consistently exceeds $80,000 annually',
      'Business activity involves independent services that allow reasonable wage defensibility',
      'Owner willing to run quarterly payroll via automated provider (e.g., Gusto)'
    ],
    actionSteps: [
      'File IRS Form 2553 within 75 days of start of tax year (or request late election relief under Rev. Proc. 2013-30)',
      'Establish formal BLS (Bureau of Labor Statistics) benchmark compensation study',
      'Set automated quarterly payroll with proper federal and state withholding'
    ],
    deadline: 'March 15, 2026 (or 75 days post formation)',
    status: 'certified',
    reviewerName: 'Marcus Vance',
    reviewerTitle: 'Finance Operations Director',
    reviewedDate: 'Oct 12, 2026'
  },
  {
    id: 'find-solo-401k',
    title: 'Solo 401(k) / Individual 401(k) Employer Profit-Sharing Integration',
    category: 'retirement',
    estimatedSavingsRange: [5400, 11800],
    confidenceScore: 94,
    citation: 'IRC §401(k), §402(g), §415(c)',
    citationSource: 'IRS Publication 560; ERISA §403(b)',
    assumptions: [
      'Business has zero full-time non-owner W-2 employees working >1,000 hours',
      'Owner has sufficient cash liquidity to fund up to $23,500 employee + 25% W-2 profit share'
    ],
    actionSteps: [
      'Execute Solo 401(k) plan adoption agreement prior to December 31',
      'Fund employee elective deferrals before year-end payroll processing',
      'Fund employer non-elective contribution by corporate tax return deadline (including extensions)'
    ],
    deadline: 'December 31, 2026 for plan adoption',
    status: 'certified',
    reviewerName: 'Sarah Chen',
    reviewerTitle: 'Senior Retirement & Ledger Lead',
    reviewedDate: 'Oct 14, 2026'
  },
  {
    id: 'find-accountable-plan',
    title: 'Corporate Accountable Plan for Home Office & Mixed-Use Assets',
    category: 'deduction',
    estimatedSavingsRange: [2200, 4800],
    confidenceScore: 91,
    citation: 'IRC §62(a)(2)(A), §280A',
    citationSource: 'Treas. Reg. §1.62-2; Rev. Proc. 2013-12',
    assumptions: [
      'Dedicated space in personal residence used exclusively and regularly for administrative work',
      'High-speed internet, mobile phone, and computer hardware utilized for business operations'
    ],
    actionSteps: [
      'Adopt formal written Board Resolution implementing Corporate Accountable Plan',
      'Submit monthly expense reimbursement vouchers with itemized receipts and utility bills',
      'Deduct reimbursements as ordinary corporate expenses (100% tax-free to shareholder-employee)'
    ],
    deadline: 'Ongoing monthly substantiation',
    status: 'certified',
    reviewerName: 'Marcus Vance',
    reviewerTitle: 'Finance Operations Director',
    reviewedDate: 'Oct 13, 2026'
  },
  {
    id: 'find-augusta-rule',
    title: '14-Day Residence Rental for Strategic Board Meetings (Augusta Rule)',
    category: 'deduction',
    estimatedSavingsRange: [1800, 3600],
    confidenceScore: 89,
    citation: 'IRC §280A(g)',
    citationSource: 'IRS Publication 527; Tax Court Memo 2022-83',
    assumptions: [
      'Entity is an S-Corporation or C-Corporation with legitimate corporate governance needs',
      'Home used for genuine business purposes (shareholder meetings, annual planning, retreats) for <=14 days'
    ],
    actionSteps: [
      'Document formal board meeting minutes with agenda, attendees, and operational decisions',
      'Obtain 3 independent local commercial venue rental quotes to prove arm-length fair market value',
      'Issue corporate payment directly to homeowner; do not report as gross income on personal 1040'
    ],
    deadline: 'Prior to corporate tax year-end',
    status: 'recommended',
    reviewerName: 'David K. Reynolds',
    reviewerTitle: 'Governance & Strategy Specialist',
    reviewedDate: 'Oct 10, 2026'
  },
  {
    id: 'find-health-insurance',
    title: 'Self-Employed Health Insurance Deduction via S-Corp Payroll Inclusion',
    category: 'health',
    estimatedSavingsRange: [1200, 2900],
    confidenceScore: 98,
    citation: 'IRC §162(l)',
    citationSource: 'IRS Notice 2008-1; IRC §3121(a)(2)(B)',
    assumptions: [
      'Shareholder owns >2% of S-Corporation stock',
      'Policy established under business name or paid by business and reported on W-2 Box 14'
    ],
    actionSteps: [
      'Include total medical, dental, and Medicare premiums in W-2 wages Box 1',
      'Exclude from FICA/FUTA taxable wages in Boxes 3 and 5',
      'Claim 100% deduction on personal Form 1040 Schedule 1 Line 17'
    ],
    deadline: 'December 31 payroll reconciliation',
    status: 'certified',
    reviewerName: 'Sarah Chen',
    reviewerTitle: 'Senior Payroll & Benefits Lead',
    reviewedDate: 'Oct 14, 2026'
  },
  {
    id: 'find-safe-harbor',
    title: 'Underpayment Penalty Shield & Safe Harbor Rebalancing',
    category: 'penalty',
    estimatedSavingsRange: [450, 1100],
    confidenceScore: 99,
    citation: 'IRC §6654(d)(1)(B)',
    citationSource: 'IRS Form 2210 Instructions; Treas. Reg. §1.6654-2',
    assumptions: [
      'Prior year adjusted gross income exceeded $150,000 (qualifying for 110% prior-year safe harbor)',
      'Current year income has quarterly volatility'
    ],
    actionSteps: [
      'Lock in quarterly 1040-ES payments equal to exactly 27.5% of prior year total tax liability',
      'Eliminate all IRS interest and failure-to-pay penalties regardless of current year income spikes',
      'Retain excess cash in high-yield treasury bills until April 15 final settlement'
    ],
    deadline: 'Quarterly payment deadlines (Apr 15, Jun 15, Sep 15, Jan 15)',
    status: 'certified',
    reviewerName: 'Marcus Vance',
    reviewerTitle: 'Finance Operations Director',
    reviewedDate: 'Oct 11, 2026'
  }
];
