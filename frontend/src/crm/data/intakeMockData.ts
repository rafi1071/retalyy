import {
  Client,
  ClientAccount,
  ChecklistTemplate,
  Period,
  CaseTask,
  Submission,
  ProcessedDocument,
  Finding,
  DraftMessage,
  AuditEvent,
  ChecklistProposal
} from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-acme',
    name: 'Acme Industrial Logistics',
    serviceTypes: ['bookkeeping', 'tax'],
    owningAccountant: 'Sarah Chen, CPA',
    contactEmail: 'finance@acme-logistics.com',
    emailDomain: 'acme-logistics.com',
    portalAccess: true,
    autoSendEnabled: false, // Rule: never auto-sends until explicitly enabled
    totalSubmissions: 38,
    falseMissingRate: 0.006, // 0.6%
    status: 'active',
    masterRecord: {
      id: 'mst-acme',
      legalName: 'Acme Industrial Logistics LLC',
      tradeName: 'Acme Freight & Logistics',
      clientStatus: 'active',
      legalStructure: 'llc',
      industry: 'Freight, Logistics & Supply Chain',
      country: 'United States',
      stateJurisdiction: 'Delaware / Illinois',
      businessSize: '$2.8M Annual / 16 Employees',
      taxId: '36-4921092',
      registrationNumber: 'DE-LLC-78912',
      incorporationDate: '2021-04-15',
      registeredAddress: '1420 Logistics Blvd, Suite 400, Chicago, IL 60607',
      primaryContact: {
        name: 'Rachel Sterling',
        email: 'finance@acme-logistics.com',
        phone: '(312) 555-0198',
        title: 'Director of Finance'
      },
      beneficialOwners: [
        { name: 'Marcus Sterling', ownershipPercentage: 60, role: 'Managing Member', idVerified: true },
        { name: 'Rachel Sterling', ownershipPercentage: 40, role: 'CFO / Member', idVerified: true }
      ],
      fiscalYearEnd: 'December 31',
      accountingBasis: 'accrual',
      accountingSoftware: 'QuickBooks Online Advanced',
      createdAt: '2026-01-10T10:00:00Z'
    },
    engagementRecord: {
      id: 'eng-acme',
      clientId: 'cli-acme',
      services: ['bookkeeping', 'tax'],
      serviceFrequency: 'monthly',
      monthlyFee: '$1,850/mo',
      setupFee: '$500',
      billingCadence: 'monthly',
      startDate: '2026-02-01',
      assignedAccountant: 'Sarah Chen, CPA',
      engagementAgreementSigned: true,
      agreementSignedDate: '2026-01-15',
      taxAuthorizationForm8821: true,
      bankSystemAccessAuthorized: true,
      approvalStatus: 'approved',
      approvedBy: 'Sarah Chen, CPA'
    },
    complianceRecord: {
      identityVerified: true,
      identityMethod: 'State Real-ID Driver License & FinCEN BOI Registry',
      identityDocument: {
        id: 'iddoc-acme-1',
        fileName: 'RealID_Drivers_License_Marcus_Sterling.pdf',
        fileSize: '1.8 MB',
        documentType: 'drivers_license',
        idNumber: 'IL-DL-98214018',
        issuingAuthority: 'Illinois Secretary of State',
        expirationDate: '2029-08-14',
        uploadedAt: '2026-01-14T10:15:00Z',
        verificationStatus: 'verified'
      },
      businessRegistrationVerified: true,
      conflictCheckPassed: true,
      riskRating: 'low',
      complianceNotes: 'Standard domestic freight logistics entity. Zero overseas operations. Passed FinCEN BOI cross-reference.',
      reviewerSignOff: 'Sarah Chen, CPA',
      signOffDate: '2026-01-14'
    }
  },
  {
    id: 'cli-meridian',
    name: 'Meridian Health Clinics',
    serviceTypes: ['bookkeeping', 'payroll'],
    owningAccountant: 'Marcus Vance',
    contactEmail: 'accounts@meridianhealth.org',
    emailDomain: 'meridianhealth.org',
    portalAccess: true,
    autoSendEnabled: false,
    totalSubmissions: 42,
    falseMissingRate: 0.008,
    status: 'active',
    masterRecord: {
      id: 'mst-meridian',
      legalName: 'Meridian Clinical Health Associates P.C.',
      tradeName: 'Meridian Health Clinics',
      clientStatus: 'active',
      legalStructure: 's_corp',
      industry: 'Healthcare & Outpatient Clinics',
      country: 'United States',
      stateJurisdiction: 'California',
      businessSize: '$4.2M Annual / 28 Employees',
      taxId: '95-8821941',
      registrationNumber: 'CA-CORP-44810',
      incorporationDate: '2019-09-12',
      registeredAddress: '880 Medical Center Way, Suite 210, Irvine, CA 92618',
      primaryContact: {
        name: 'Dr. Gregory Vance',
        email: 'accounts@meridianhealth.org',
        phone: '(949) 555-0812',
        title: 'Managing Medical Director'
      },
      beneficialOwners: [
        { name: 'Dr. Gregory Vance', ownershipPercentage: 100, role: 'President & Sole Director', idVerified: true }
      ],
      fiscalYearEnd: 'December 31',
      accountingBasis: 'cash',
      accountingSoftware: 'QuickBooks Online',
      createdAt: '2026-01-05T09:30:00Z'
    },
    engagementRecord: {
      id: 'eng-meridian',
      clientId: 'cli-meridian',
      services: ['bookkeeping', 'payroll'],
      serviceFrequency: 'monthly',
      monthlyFee: '$2,400/mo',
      billingCadence: 'monthly',
      startDate: '2026-01-15',
      assignedAccountant: 'Marcus Vance',
      engagementAgreementSigned: true,
      agreementSignedDate: '2026-01-12',
      taxAuthorizationForm8821: true,
      bankSystemAccessAuthorized: true,
      approvalStatus: 'approved',
      approvedBy: 'Sarah Chen, CPA'
    },
    complianceRecord: {
      identityVerified: true,
      identityMethod: 'Medical Board of California License & Passport',
      identityDocument: {
        id: 'iddoc-meridian-1',
        fileName: 'US_Passport_Dr_Gregory_Vance.pdf',
        fileSize: '2.4 MB',
        documentType: 'passport',
        idNumber: 'P-94810281',
        issuingAuthority: 'United States Department of State',
        expirationDate: '2033-04-18',
        uploadedAt: '2026-01-11T14:30:00Z',
        verificationStatus: 'verified'
      },
      businessRegistrationVerified: true,
      conflictCheckPassed: true,
      riskRating: 'low',
      complianceNotes: 'Licensed medical practice in good standing with CA Department of Public Health.',
      reviewerSignOff: 'Sarah Chen, CPA',
      signOffDate: '2026-01-11'
    }
  },
  {
    id: 'cli-horizon',
    name: 'Horizon Biotech Labs',
    serviceTypes: ['bookkeeping', 'tax', 'payroll'],
    owningAccountant: 'Elena Rostova, CPA',
    contactEmail: 'treasury@horizonbio.io',
    emailDomain: 'horizonbio.io',
    portalAccess: true,
    autoSendEnabled: false,
    totalSubmissions: 19,
    falseMissingRate: 0.011,
    status: 'active',
    masterRecord: {
      id: 'mst-horizon',
      legalName: 'Horizon Biotech Therapeutics Inc.',
      clientStatus: 'active',
      legalStructure: 'c_corp',
      industry: 'Biotechnology & Life Sciences R&D',
      country: 'United States',
      stateJurisdiction: 'Delaware / Massachusetts',
      businessSize: '$6.5M Venture Capital / 24 Researchers',
      taxId: '04-9912048',
      registrationNumber: 'DE-C-991823',
      incorporationDate: '2022-06-01',
      registeredAddress: '100 Innovation Way, Cambridge, MA 02142',
      primaryContact: {
        name: 'Dr. Aris Thorne',
        email: 'treasury@horizonbio.io',
        phone: '(617) 555-0344',
        title: 'VP Finance & Operations'
      },
      beneficialOwners: [
        { name: 'Dr. Aris Thorne', ownershipPercentage: 45, role: 'Chief Scientist', idVerified: true },
        { name: 'Horizon Catalyst Ventures LP', ownershipPercentage: 55, role: 'Institutional Investor', idVerified: true }
      ],
      fiscalYearEnd: 'December 31',
      accountingBasis: 'accrual',
      accountingSoftware: 'NetSuite / QuickBooks',
      createdAt: '2026-03-01T14:00:00Z'
    },
    engagementRecord: {
      id: 'eng-horizon',
      clientId: 'cli-horizon',
      services: ['bookkeeping', 'tax', 'payroll'],
      serviceFrequency: 'monthly',
      monthlyFee: '$3,200/mo',
      billingCadence: 'monthly',
      startDate: '2026-03-15',
      assignedAccountant: 'Elena Rostova, CPA',
      engagementAgreementSigned: true,
      taxAuthorizationForm8821: true,
      bankSystemAccessAuthorized: true,
      approvalStatus: 'approved'
    },
    complianceRecord: {
      identityVerified: true,
      identityMethod: 'Government Passport & Certificate of Incorporation',
      businessRegistrationVerified: true,
      conflictCheckPassed: true,
      riskRating: 'medium',
      complianceNotes: 'R&D tax credits and multi-state payroll require specialized annual tax review.',
      reviewerSignOff: 'Elena Rostova, CPA',
      signOffDate: '2026-03-10'
    }
  },
  {
    id: 'cli-vanguard',
    name: 'Vanguard Digital Media',
    serviceTypes: ['bookkeeping'],
    owningAccountant: 'David Miller',
    contactEmail: 'operations@vanguardmedia.co',
    emailDomain: 'vanguardmedia.co',
    portalAccess: true,
    autoSendEnabled: false,
    totalSubmissions: 25,
    falseMissingRate: 0.004,
    status: 'active'
  },
  {
    id: 'cli-apex',
    name: 'Apex Robotics Labs Inc',
    serviceTypes: ['bookkeeping', 'tax'],
    owningAccountant: 'Sarah Chen, CPA',
    contactEmail: 'founders@apexrobotics.io',
    emailDomain: 'apexrobotics.io',
    portalAccess: false,
    autoSendEnabled: false,
    totalSubmissions: 0,
    falseMissingRate: 0.0,
    status: 'pending_verification',
    masterRecord: {
      id: 'mst-apex',
      legalName: 'Apex Robotics Labs Inc',
      tradeName: 'Apex Autonomy',
      clientStatus: 'pending_verification',
      legalStructure: 'c_corp',
      industry: 'Robotics & Hardware Engineering',
      country: 'United States',
      stateJurisdiction: 'Delaware / Texas',
      businessSize: '$1.2M Seed Round / 8 Engineers',
      taxId: '74-8891042',
      registrationNumber: 'DE-C-881920',
      incorporationDate: '2024-02-18',
      registeredAddress: '500 Tech Ridge Parkway, Austin, TX 78753',
      primaryContact: {
        name: 'Julian Vance',
        email: 'founders@apexrobotics.io',
        phone: '(512) 555-0911',
        title: 'CEO & Co-founder'
      },
      beneficialOwners: [
        { name: 'Julian Vance', ownershipPercentage: 60, role: 'CEO', idVerified: true },
        { name: 'Kavita Patel', ownershipPercentage: 40, role: 'CTO', idVerified: false }
      ],
      fiscalYearEnd: 'December 31',
      accountingBasis: 'accrual',
      accountingSoftware: 'QuickBooks Online',
      createdAt: '2026-10-15T11:00:00Z'
    },
    engagementRecord: {
      id: 'eng-apex',
      clientId: 'cli-apex',
      services: ['bookkeeping', 'tax'],
      serviceFrequency: 'monthly',
      monthlyFee: '$1,650/mo',
      setupFee: '$400',
      billingCadence: 'monthly',
      startDate: '2026-11-01',
      assignedAccountant: 'Sarah Chen, CPA',
      engagementAgreementSigned: false, // Needs signature
      taxAuthorizationForm8821: false,
      bankSystemAccessAuthorized: false,
      approvalStatus: 'pending_review'
    },
    complianceRecord: {
      identityVerified: false,
      identityMethod: 'Government Passport pending upload',
      businessRegistrationVerified: true,
      conflictCheckPassed: true,
      riskRating: 'medium',
      complianceNotes: 'Awaiting co-founder ID verification and signed engagement letter before activating document portal.'
    }
  }
];

export const INITIAL_ACCOUNTS: ClientAccount[] = [
  {
    id: 'acc-acme-1',
    clientId: 'cli-acme',
    type: 'bank',
    institution: 'JPMorgan Chase',
    identifierSuffix: '4102',
    status: 'active',
    lastReconciled: 'Sep 30, 2026',
    notes: 'Primary Operating Checking'
  },
  {
    id: 'acc-acme-2',
    clientId: 'cli-acme',
    type: 'card',
    institution: 'American Express',
    identifierSuffix: '8910',
    status: 'active',
    lastReconciled: 'Sep 30, 2026',
    notes: 'Corporate Card Gold'
  },
  {
    id: 'acc-acme-3',
    clientId: 'cli-acme',
    type: 'bank',
    institution: 'Silicon Valley Bank / First Citizens',
    identifierSuffix: '1190',
    status: 'dormant', // Legitimate dormant account
    lastReconciled: 'Jun 30, 2026',
    notes: 'Escrow Reserve - zero activity this period'
  },
  {
    id: 'acc-meridian-1',
    clientId: 'cli-meridian',
    type: 'bank',
    institution: 'Wells Fargo',
    identifierSuffix: '7724',
    status: 'active',
    lastReconciled: 'Sep 30, 2026',
    notes: 'Clinical Operations Checking'
  },
  {
    id: 'acc-meridian-2',
    clientId: 'cli-meridian',
    type: 'payroll',
    institution: 'Gusto Payroll',
    identifierSuffix: '9920',
    status: 'active',
    lastReconciled: 'Sep 30, 2026',
    notes: 'Bi-weekly medical staff payroll'
  },
  {
    id: 'acc-horizon-1',
    clientId: 'cli-horizon',
    type: 'bank',
    institution: 'Bank of America',
    identifierSuffix: '5501',
    status: 'active',
    lastReconciled: 'Sep 30, 2026',
    notes: 'R&D Operating Account'
  },
  {
    id: 'acc-horizon-2',
    clientId: 'cli-horizon',
    type: 'payroll',
    institution: 'Rippling',
    identifierSuffix: '3318',
    status: 'active',
    lastReconciled: 'Sep 30, 2026',
    notes: 'Lab researchers payroll'
  }
];

export const INITIAL_CHECKLISTS: ChecklistTemplate[] = [
  {
    id: 'chk-acme-oct2026',
    clientId: 'cli-acme',
    periodType: 'monthly',
    version: 3,
    lastUpdated: '2026-10-01T09:00:00Z',
    requirements: [
      {
        id: 'req-acme-chase',
        documentType: 'bank_statement',
        targetInstitution: 'JPMorgan Chase',
        targetAccountSuffix: '4102',
        description: 'Monthly Chase Operating Checking Statement (...4102)',
        frequency: 'monthly',
        isExemptIfDormant: false
      },
      {
        id: 'req-acme-amex',
        documentType: 'card_statement',
        targetInstitution: 'American Express',
        targetAccountSuffix: '8910',
        description: 'Monthly Amex Corporate Card Statement (...8910)',
        frequency: 'monthly',
        isExemptIfDormant: false
      },
      {
        id: 'req-acme-svb',
        documentType: 'bank_statement',
        targetInstitution: 'Silicon Valley Bank / First Citizens',
        targetAccountSuffix: '1190',
        description: 'Escrow Reserve Account (...1190)',
        frequency: 'monthly',
        isExemptIfDormant: true // Exception allowed if dormant
      },
      {
        id: 'req-acme-payroll',
        documentType: 'payroll_report',
        targetInstitution: 'ADP Workforce',
        description: 'Monthly Payroll Tax & Wage Summary',
        frequency: 'monthly',
        isExemptIfDormant: false
      }
    ],
    exceptions: [
      'Account ...1190 is verified dormant for Q3/Q4 2026 by Sarah Chen; statement not required unless balance changes.'
    ]
  },
  {
    id: 'chk-meridian-oct2026',
    clientId: 'cli-meridian',
    periodType: 'monthly',
    version: 2,
    lastUpdated: '2026-10-02T11:30:00Z',
    requirements: [
      {
        id: 'req-mer-wf',
        documentType: 'bank_statement',
        targetInstitution: 'Wells Fargo',
        targetAccountSuffix: '7724',
        description: 'Monthly Clinical Operating Statement (...7724)',
        frequency: 'monthly'
      },
      {
        id: 'req-mer-gusto',
        documentType: 'payroll_report',
        targetInstitution: 'Gusto Payroll',
        targetAccountSuffix: '9920',
        description: 'Gusto Monthly Payroll Journal',
        frequency: 'monthly'
      }
    ],
    exceptions: []
  }
];

export const INITIAL_PERIODS: Period[] = [
  {
    id: 'per-acme-oct2026',
    clientId: 'cli-acme',
    label: 'October 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    deadline: '2026-11-08',
    status: 'in_review'
  },
  {
    id: 'per-meridian-oct2026',
    clientId: 'cli-meridian',
    label: 'October 2026',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    deadline: '2026-11-05',
    status: 'open'
  },
  {
    id: 'per-horizon-q3-2026',
    clientId: 'cli-horizon',
    label: 'Q3 2026',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    deadline: '2026-10-31',
    status: 'in_review'
  }
];

export const INITIAL_CASES: CaseTask[] = [
  {
    id: 'case-1082',
    caseNumber: 'CS-2026-1082',
    submissionId: 'sub-acme-01',
    clientId: 'cli-acme',
    clientName: 'Acme Industrial Logistics',
    periodId: 'per-acme-oct2026',
    periodLabel: 'October 2026',
    channel: 'email',
    assignee: 'Sarah Chen, CPA',
    assignedRole: 'Senior Accountant',
    dueDate: '2026-10-22',
    state: 'awaiting_client',
    priority: 'standard',
    findingsCount: 1, // 1 missing document
    documentsCount: 2,
    expectedDocsCount: 3, // (4 minus 1 dormant exception = 3 expected)
    satisfiedDocsCount: 2,
    createdAt: '2026-10-17T08:14:00Z',
    confidenceScore: 98,
    needsTriage: false
  },
  {
    id: 'case-1083',
    caseNumber: 'CS-2026-1083',
    submissionId: 'sub-meridian-01',
    clientId: 'cli-meridian',
    clientName: 'Meridian Health Clinics',
    periodId: 'per-meridian-oct2026',
    periodLabel: 'October 2026',
    channel: 'portal',
    assignee: 'Marcus Vance',
    assignedRole: 'Staff Accountant',
    dueDate: '2026-10-24',
    state: 'ready_for_review',
    priority: 'standard',
    findingsCount: 0,
    documentsCount: 2,
    expectedDocsCount: 2,
    satisfiedDocsCount: 2,
    createdAt: '2026-10-17T07:45:00Z',
    confidenceScore: 99,
    needsTriage: false
  },
  {
    id: 'case-1084',
    caseNumber: 'CS-2026-1084',
    submissionId: 'sub-horizon-01',
    clientId: 'cli-horizon',
    clientName: 'Horizon Biotech Labs',
    periodId: 'per-horizon-q3-2026',
    periodLabel: 'Q3 2026',
    channel: 'portal',
    assignee: 'Elena Rostova, CPA',
    assignedRole: 'Tax Manager',
    dueDate: '2026-10-19',
    state: 'triage',
    priority: 'urgent',
    findingsCount: 2, // Low confidence readability + unreadable totals
    documentsCount: 1,
    expectedDocsCount: 3,
    satisfiedDocsCount: 0,
    createdAt: '2026-10-17T09:05:00Z',
    confidenceScore: 61,
    needsTriage: true,
    triageReason: 'Document processor flagged low-quality camera photo with heavy glare. OCR confidence 61% (<70% threshold). Downstream pipeline halted.'
  },
  {
    id: 'case-1085',
    caseNumber: 'CS-2026-1085',
    submissionId: 'sub-vanguard-01',
    clientId: 'cli-vanguard',
    clientName: 'Vanguard Digital Media',
    periodId: 'per-vanguard-oct2026',
    periodLabel: 'October 2026',
    channel: 'email',
    assignee: 'David Miller',
    assignedRole: 'Staff Accountant',
    dueDate: '2026-10-25',
    state: 'ready_for_review',
    priority: 'high',
    findingsCount: 1, // Duplicate document detected
    documentsCount: 2,
    expectedDocsCount: 2,
    satisfiedDocsCount: 1,
    createdAt: '2026-10-16T16:20:00Z',
    confidenceScore: 96,
    needsTriage: false
  }
];

export const INITIAL_SUBMISSIONS: Record<string, Submission> = {
  'sub-acme-01': {
    id: 'sub-acme-01',
    submissionNumber: 'SUB-2026-8812',
    clientId: 'cli-acme',
    clientName: 'Acme Industrial Logistics',
    periodId: 'per-acme-oct2026',
    periodLabel: 'October 2026',
    channel: 'email',
    senderEmail: 'finance@acme-logistics.com',
    receivedAt: '2026-10-17T08:14:00Z',
    status: 'ready_for_review',
    documents: [
      {
        id: 'doc-acme-chase',
        submissionId: 'sub-acme-01',
        fileName: 'Chase_Operating_Oct2026_Stmt.pdf',
        fileSize: '482 KB',
        fileHash: 'sha256-a94f82c199e4b77d61b369c',
        fileType: 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 99,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'bank_statement',
          confidence: 99,
          confidenceLevel: 'high',
          detectedLabel: 'Commercial Bank Statement'
        },
        extractedFields: {
          institution: 'JPMorgan Chase Bank, N.A.',
          accountSuffix: '4102',
          periodStart: '2026-10-01',
          periodEnd: '2026-10-31',
          totalAmount: '$184,290.44',
          statementDate: '2026-10-31',
          pageCount: 4,
          detectedAccountType: 'Commercial Checking'
        },
        reviewStatus: 'accepted',
        mockPageContent: `JPMORGAN CHASE BANK, N.A.
P.O. BOX 182051, COLUMBUS, OH 43218

COMMERCIAL CHECKING ACCOUNT SUMMARY
Account Number: *******4102
Statement Period: October 01, 2026 through October 31, 2026
Customer: ACME INDUSTRIAL LOGISTICS LLC

Beginning Balance:    $142,500.12
Electronic Deposits:  $98,420.00
Checks Paid:         -$31,210.50
Other Withdrawals:   -$25,419.18
Ending Balance:       $184,290.44`
      },
      {
        id: 'doc-acme-payroll',
        submissionId: 'sub-acme-01',
        fileName: 'ADP_Payroll_Summary_Oct2026.pdf',
        fileSize: '310 KB',
        fileHash: 'sha256-f87c29b12204a919cb49a',
        fileType: 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 97,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'payroll_report',
          confidence: 96,
          confidenceLevel: 'high',
          detectedLabel: 'Payroll Tax & Wage Summary'
        },
        extractedFields: {
          institution: 'ADP Workforce Now',
          accountSuffix: 'ADP-9941',
          periodStart: '2026-10-01',
          periodEnd: '2026-10-31',
          totalAmount: '$42,180.50',
          statementDate: '2026-10-31',
          einOrTaxId: 'XX-XXX4491'
        },
        reviewStatus: 'accepted',
        mockPageContent: `ADP WORKFORCE NOW - PAYROLL LIABILITY & SUMMARY
Client: ACME INDUSTRIAL LOGISTICS LLC
Tax ID: XX-XXX4491
Run Date: 10/31/2026
Gross Pay: $42,180.50
Net Pay:   $31,635.40
Total Taxes Withheld: $10,545.10`
      }
    ],
    findings: [
      {
        id: 'fnd-acme-missing-amex',
        submissionId: 'sub-acme-01',
        periodId: 'per-acme-oct2026',
        kind: 'missing',
        severity: 'high',
        title: 'Missing Required Statement',
        plainLanguageReason: 'Checklist requirement #2 expects American Express Corporate Card ending in ...8910 for period October 2026. No corresponding file was uploaded.',
        ruleTrace: 'Rule: Checklist Template v3 [req-acme-amex] -> Monthly Card Statement Amex ...8910',
        resolution: 'open'
      }
    ],
    checklistMatches: [
      {
        requirementId: 'req-acme-chase',
        requirement: INITIAL_CHECKLISTS[0].requirements[0],
        status: 'satisfied',
        matchedDocumentId: 'doc-acme-chase',
        matchedDocumentName: 'Chase_Operating_Oct2026_Stmt.pdf',
        explainableRuleReason: 'Extracted account Chase *4102 matches checklist requirement. Period 10/01-10/31 aligns with October 2026.'
      },
      {
        requirementId: 'req-acme-amex',
        requirement: INITIAL_CHECKLISTS[0].requirements[1],
        status: 'missing',
        explainableRuleReason: 'No uploaded document extracted as American Express statement ending in ...8910 for October 2026.'
      },
      {
        requirementId: 'req-acme-svb',
        requirement: INITIAL_CHECKLISTS[0].requirements[2],
        status: 'exempt',
        explainableRuleReason: 'Client account ...1190 is marked Dormant. Checklist exception rule #1 applied; document not flagged missing.'
      },
      {
        requirementId: 'req-acme-payroll',
        requirement: INITIAL_CHECKLISTS[0].requirements[3],
        status: 'satisfied',
        matchedDocumentId: 'doc-acme-payroll',
        matchedDocumentName: 'ADP_Payroll_Summary_Oct2026.pdf',
        explainableRuleReason: 'Extracted ADP Payroll summary matches monthly payroll requirement for October 2026.'
      }
    ],
    draftMessage: {
      id: 'msg-acme-01',
      submissionId: 'sub-acme-01',
      clientId: 'cli-acme',
      recipient: 'finance@acme-logistics.com',
      subject: 'Action Needed: Missing document for October 2026 intake (Acme Industrial Logistics)',
      draftBody: `Hi Acme Finance Team,

Thank you for sending your October 2026 accounting documents. We have successfully received and processed your Chase Operating Checking statement (*4102) and your ADP Payroll report.

To complete your October intake and prepare your monthly financials, we are still missing:
• American Express Corporate Card Statement (*8910) for October 1 – October 31, 2026

Please upload this missing statement via your Retalyy Client Portal or reply directly to this email with the PDF attached by Wednesday, October 22, 2026.

Thank you,
Sarah Chen, CPA
Retalyy Client Intake Team`,
      missingItems: ['American Express Corporate Card Statement (*8910) for Oct 2026'],
      dueDate: '2026-10-22',
      status: 'draft',
      autoSendEligible: false
    }
  },
  'sub-meridian-01': {
    id: 'sub-meridian-01',
    submissionNumber: 'SUB-2026-8813',
    clientId: 'cli-meridian',
    clientName: 'Meridian Health Clinics',
    periodId: 'per-meridian-oct2026',
    periodLabel: 'October 2026',
    channel: 'portal',
    senderEmail: 'accounts@meridianhealth.org',
    receivedAt: '2026-10-17T07:45:00Z',
    status: 'ready_for_review',
    documents: [
      {
        id: 'doc-mer-wf',
        submissionId: 'sub-meridian-01',
        fileName: 'WellsFargo_Operations_Oct2026.pdf',
        fileSize: '512 KB',
        fileHash: 'sha256-91e843b00c98114f8221890',
        fileType: 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 100,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'bank_statement',
          confidence: 99,
          confidenceLevel: 'high',
          detectedLabel: 'Commercial Checking Statement'
        },
        extractedFields: {
          institution: 'Wells Fargo Bank, N.A.',
          accountSuffix: '7724',
          periodStart: '2026-10-01',
          periodEnd: '2026-10-31',
          totalAmount: '$312,840.10',
          statementDate: '2026-10-31'
        },
        reviewStatus: 'accepted'
      },
      {
        id: 'doc-mer-gusto',
        submissionId: 'sub-meridian-01',
        fileName: 'Gusto_Payroll_Journal_Oct2026.pdf',
        fileSize: '298 KB',
        fileHash: 'sha256-43b91a7c001928df772a819',
        fileType: 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 98,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'payroll_report',
          confidence: 98,
          confidenceLevel: 'high',
          detectedLabel: 'Payroll Journal'
        },
        extractedFields: {
          institution: 'Gusto Payroll',
          accountSuffix: '9920',
          periodStart: '2026-10-01',
          periodEnd: '2026-10-31',
          totalAmount: '$68,450.00',
          statementDate: '2026-10-31'
        },
        reviewStatus: 'accepted'
      }
    ],
    findings: [],
    checklistMatches: [
      {
        requirementId: 'req-mer-wf',
        requirement: INITIAL_CHECKLISTS[1].requirements[0],
        status: 'satisfied',
        matchedDocumentId: 'doc-mer-wf',
        matchedDocumentName: 'WellsFargo_Operations_Oct2026.pdf',
        explainableRuleReason: 'Extracted account Wells Fargo *7724 satisfies requirement #1.'
      },
      {
        requirementId: 'req-mer-gusto',
        requirement: INITIAL_CHECKLISTS[1].requirements[1],
        status: 'satisfied',
        matchedDocumentId: 'doc-mer-gusto',
        matchedDocumentName: 'Gusto_Payroll_Journal_Oct2026.pdf',
        explainableRuleReason: 'Extracted Gusto Payroll journal satisfies requirement #2.'
      }
    ]
  },
  'sub-horizon-01': {
    id: 'sub-horizon-01',
    submissionNumber: 'SUB-2026-8814',
    clientId: 'cli-horizon',
    clientName: 'Horizon Biotech Labs',
    periodId: 'per-horizon-q3-2026',
    periodLabel: 'Q3 2026',
    channel: 'portal',
    senderEmail: 'treasury@horizonbio.io',
    receivedAt: '2026-10-17T09:05:00Z',
    status: 'needs_triage',
    documents: [
      {
        id: 'doc-hor-blurry',
        submissionId: 'sub-horizon-01',
        fileName: 'IMG_4821_Payroll_Mobile_Photo.jpeg',
        fileSize: '3.4 MB',
        fileHash: 'sha256-7882ab018129ccbb8271101',
        fileType: 'image/jpeg',
        isVirusScanned: true,
        readabilityScore: 54,
        readabilityStatus: 'blurry',
        classification: {
          documentType: 'payroll_report',
          confidence: 61,
          confidenceLevel: 'low',
          detectedLabel: 'Possible Payroll Screenshot (Low Confidence)'
        },
        extractedFields: {
          institution: 'Uncertain (Rippling?)',
          accountSuffix: 'Unclear',
          totalAmount: 'Unreadable due to glare'
        },
        reviewStatus: 'triage',
        rawSnippet: '[OCR Confidence 0.61] ...pay roll sum... ...glare on column 3... net amnt [unreadable]... 2026'
      }
    ],
    findings: [
      {
        id: 'fnd-hor-unreadable',
        submissionId: 'sub-horizon-01',
        periodId: 'per-horizon-q3-2026',
        kind: 'unreadable',
        severity: 'blocker',
        title: 'Low Readability Mobile Photo',
        plainLanguageReason: 'Image quality check failed: heavy flash reflection obscures gross wage totals and period end date. Document held in triage queue.',
        resolution: 'open'
      }
    ],
    checklistMatches: []
  },
  'sub-vanguard-01': {
    id: 'sub-vanguard-01',
    submissionNumber: 'SUB-2026-8815',
    clientId: 'cli-vanguard',
    clientName: 'Vanguard Digital Media',
    periodId: 'per-vanguard-oct2026',
    periodLabel: 'October 2026',
    channel: 'email',
    senderEmail: 'operations@vanguardmedia.co',
    receivedAt: '2026-10-16T16:20:00Z',
    status: 'ready_for_review',
    documents: [
      {
        id: 'doc-van-chase',
        submissionId: 'sub-vanguard-01',
        fileName: 'Vanguard_Chase_Checking_Oct2026.pdf',
        fileSize: '412 KB',
        fileHash: 'sha256-3398acba711094ba0018821',
        fileType: 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 99,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'bank_statement',
          confidence: 97,
          confidenceLevel: 'high',
          detectedLabel: 'Bank Statement'
        },
        extractedFields: {
          institution: 'JPMorgan Chase',
          accountSuffix: '6620',
          periodStart: '2026-10-01',
          periodEnd: '2026-10-31',
          totalAmount: '$74,120.00'
        },
        reviewStatus: 'accepted'
      },
      {
        id: 'doc-van-dup',
        submissionId: 'sub-vanguard-01',
        fileName: 'Vanguard_Chase_Checking_September_Resend.pdf',
        fileSize: '410 KB',
        fileHash: 'sha256-3398acba711094ba0018821', // Identical hash to prior month
        fileType: 'application/pdf',
        isVirusScanned: true,
        readabilityScore: 99,
        readabilityStatus: 'clear',
        classification: {
          documentType: 'bank_statement',
          confidence: 98,
          confidenceLevel: 'high',
          detectedLabel: 'Bank Statement (Duplicate)'
        },
        extractedFields: {
          institution: 'JPMorgan Chase',
          accountSuffix: '6620',
          periodStart: '2026-09-01',
          periodEnd: '2026-09-30',
          totalAmount: '$69,450.00'
        },
        reviewStatus: 'needs_verification'
      }
    ],
    findings: [
      {
        id: 'fnd-van-dup',
        submissionId: 'sub-vanguard-01',
        periodId: 'per-vanguard-oct2026',
        kind: 'duplicate',
        severity: 'medium',
        title: 'Duplicate File Detected',
        plainLanguageReason: 'File hash sha256-3398... exactly matches previously reconciled document #doc-van-sep filed on Sep 18, 2026. Extracted period is September, not October.',
        ruleTrace: 'Processor Engine: Exact SHA-256 match & identical statement date range.',
        resolution: 'open'
      }
    ],
    checklistMatches: []
  }
};

export const INITIAL_AUDIT_LOG: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-17T08:14:02Z',
    actor: 'Ingestion Gateway',
    component: 'Ingestion Gateway',
    action: 'INBOUND_EMAIL_RECEIVED',
    caseNumber: 'CS-2026-1082',
    details: 'Received email from finance@acme-logistics.com with 2 PDF attachments. Virus scan passed; immutable blobs written to object storage.'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-17T08:14:04Z',
    actor: 'Client & Period Resolver',
    component: 'Client & Period Resolver',
    action: 'CLIENT_RESOLVED',
    caseNumber: 'CS-2026-1082',
    details: 'Resolved client: Acme Industrial Logistics (id: cli-acme) via sender domain acme-logistics.com (Confidence: 99.4%). Resolved period: October 2026.'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-17T08:14:07Z',
    actor: 'Classifier & Extractor',
    component: 'Classifier & Extractor',
    action: 'DOCUMENTS_CLASSIFIED',
    caseNumber: 'CS-2026-1082',
    details: 'Doc #1 classified as Bank Statement (Chase ...4102, Confidence 99%). Doc #2 classified as Payroll Report (ADP, Confidence 96%).'
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-17T08:14:08Z',
    actor: 'Checklist Engine',
    component: 'Checklist Engine',
    action: 'CHECKLIST_EVALUATED',
    caseNumber: 'CS-2026-1082',
    beforeState: 'Expected: 3 active requirements',
    afterState: 'Satisfied: 2 / Missing: 1 / Dormant Exempt: 1',
    details: 'Flagged missing: American Express Corporate Card (...8910). Applied dormant exception on SVB (...1190).'
  },
  {
    id: 'aud-005',
    timestamp: '2026-10-17T08:14:09Z',
    actor: 'Follow-up Drafter',
    component: 'Follow-up Drafter',
    action: 'FOLLOWUP_DRAFTED',
    caseNumber: 'CS-2026-1082',
    details: 'Drafted follow-up request to finance@acme-logistics.com detailing Amex ...8910 statement with deadline 2026-10-22. Held for accountant approval.'
  },
  {
    id: 'aud-006',
    timestamp: '2026-10-17T08:14:10Z',
    actor: 'Case Router',
    component: 'Case Router',
    action: 'CASE_ROUTED',
    caseNumber: 'CS-2026-1082',
    details: 'Assigned case to owning accountant Sarah Chen, CPA. SLA due date set to 2026-10-22.'
  },
  {
    id: 'aud-007',
    timestamp: '2026-10-17T09:05:03Z',
    actor: 'Document Processor',
    component: 'Document Processor',
    action: 'QUALITY_CHECK_FAILED',
    caseNumber: 'CS-2026-1084',
    details: 'File IMG_4821_Payroll_Mobile_Photo.jpeg scored 54% readability. Flashed into human triage queue. Downstream auto-actions blocked.'
  }
];

export const INITIAL_PROPOSALS: ChecklistProposal[] = [
  {
    id: 'prop-01',
    clientId: 'cli-acme',
    clientName: 'Acme Industrial Logistics',
    proposedChange: 'Add New Card: Stripe Corporate Card (*7731)',
    reason: 'System detected repeated settlements to Stripe Card ending in 7731 across September and October statements. Card is not currently on checklist.',
    detectedFromDoc: 'Chase_Operating_Oct2026_Stmt.pdf',
    status: 'pending_review',
    proposedAt: '2026-10-17T08:14:08Z'
  }
];

// Sample document presets for rapid testing in the pipeline simulator
export const SAMPLE_TEST_DOCUMENTS = [
  {
    id: 'sample-chase-checking',
    name: 'Chase_Operating_Checking_Oct2026.pdf',
    clientHint: 'Acme Industrial Logistics',
    periodHint: 'October 2026',
    size: '420 KB',
    description: 'Clean PDF bank statement with Chase logo, account *4102, dates Oct 1 - Oct 31, 2026',
    expectedType: 'bank_statement' as const,
    institution: 'JPMorgan Chase',
    suffix: '4102',
    content: `JPMORGAN CHASE BANK, N.A.
Commercial Checking Account Summary
Account Number: *******4102
Period: 10/01/2026 to 10/31/2026
Client: Acme Industrial Logistics LLC
Beginning Balance: $142,500.12
Total Deposits: $98,420.00
Total Withdrawals: -$56,629.68
Ending Balance: $184,290.44`
  },
  {
    id: 'sample-amex-card',
    name: 'Amex_Corporate_Card_Oct2026.pdf',
    clientHint: 'Acme Industrial Logistics',
    periodHint: 'October 2026',
    size: '340 KB',
    description: 'Clean American Express statement ending in *8910 (satisfies the missing requirement)',
    expectedType: 'card_statement' as const,
    institution: 'American Express',
    suffix: '8910',
    content: `AMERICAN EXPRESS
CORPORATE CARD STATEMENT
Account ending in: 8910
Statement Period: Oct 1, 2026 - Oct 31, 2026
Cardholder: ACME INDUSTRIAL LOGISTICS LLC
New Charges: $14,892.40
Payment Due Date: Nov 15, 2026`
  },
  {
    id: 'sample-gusto-payroll',
    name: 'Gusto_Payroll_Journal_Oct2026.pdf',
    clientHint: 'Meridian Health Clinics',
    periodHint: 'October 2026',
    size: '280 KB',
    description: 'Clean payroll report with wage liabilities and tax withholding',
    expectedType: 'payroll_report' as const,
    institution: 'Gusto Payroll',
    suffix: '9920',
    content: `GUSTO PAYROLL REPORT
Company: Meridian Health Clinics Inc
Tax ID: XX-XXX8921
Pay Period: October 01 - October 31, 2026
Total Gross Pay: $68,450.00
Federal Taxes: $14,210.00
State Taxes: $4,980.00
Net Pay: $49,260.00`
  },
  {
    id: 'sample-form-941',
    name: 'Form_941_Employer_Quarterly_Q3_2026.pdf',
    clientHint: 'Horizon Biotech Labs',
    periodHint: 'Q3 2026',
    size: '512 KB',
    description: 'Official IRS Form 941 Quarterly Federal Tax Return for Q3 2026',
    expectedType: 'tax_form_941' as const,
    institution: 'Internal Revenue Service',
    suffix: '941',
    content: `Department of the Treasury - Internal Revenue Service
Form 941: Employer's QUARTERLY Federal Tax Return
For Quarter ending September 30, 2026
Employer Identification Number: XX-XXX3910
Name: HORIZON BIOTECH LABS INC
Number of employees who received wages: 24
Total wages, tips, and other compensation: $482,900.00
Federal income tax withheld from wages: $96,580.00
Total taxes after adjustments: $170,463.70`
  },
  {
    id: 'sample-blurry-photo',
    name: 'IMG_Receipt_Blurry_Photo.jpg',
    clientHint: 'Acme Industrial Logistics',
    periodHint: 'October 2026',
    size: '2.1 MB',
    description: 'Low-quality mobile snapshot with severe glare and motion blur (triggers triage queue)',
    expectedType: 'unknown' as const,
    institution: 'Unknown',
    suffix: '????',
    content: `[CORRUPTED OCR - LENS FLARE AT (x:140, y:280) - TEXT READABILITY 42%]
...pay... chk ... ...amoun... $[unreadable]... 2026`
  },
  {
    id: 'sample-duplicate-chase',
    name: 'Chase_Operating_Duplicate_Check.pdf',
    clientHint: 'Acme Industrial Logistics',
    periodHint: 'October 2026',
    size: '482 KB',
    description: 'Exact duplicate of the already-processed Chase statement (triggers duplicate detection)',
    expectedType: 'bank_statement' as const,
    institution: 'JPMorgan Chase',
    suffix: '4102',
    content: `JPMORGAN CHASE BANK, N.A.
Commercial Checking Account Summary
Account Number: *******4102
Period: 10/01/2026 to 10/31/2026
Client: Acme Industrial Logistics LLC
Ending Balance: $184,290.44`
  }
];
