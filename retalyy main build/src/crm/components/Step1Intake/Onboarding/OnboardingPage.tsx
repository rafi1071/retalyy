import React, { useState, useRef } from 'react';
import {
  Client,
  ClientAccount,
  ChecklistTemplate,
  Period,
  LegalStructureType,
  RiskRatingType,
  ServiceType,
  ClientLifecycleStatus,
  ClientMasterRecord,
  EngagementRecord,
  ComplianceRecord,
  ChecklistRequirement,
  IdentityDocument
} from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Building2,
  ShieldCheck,
  Briefcase,
  FileCheck,
  CreditCard,
  Banknote,
  Users,
  AlertTriangle,
  FolderPlus,
  HelpCircle,
  Clock,
  DollarSign,
  FileText,
  UploadCloud,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';

interface OnboardingPageProps {
  onCancel: () => void;
  onComplete: (data: {
    client: Client;
    accounts: ClientAccount[];
    checklist: ChecklistTemplate;
    period: Period;
  }) => void;
  existingAccountants: string[];
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onCancel,
  onComplete,
  existingAccountants
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Prospective Inquiry & Identity
  const [businessName, setBusinessName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactTitle, setContactTitle] = useState('Founder / Managing Member');
  const [businessAddress, setBusinessAddress] = useState('');

  // Step 2: Legal Classification & Tax
  const [legalStructure, setLegalStructure] = useState<LegalStructureType>('llc');
  const [industry, setIndustry] = useState('Technology & Professional Services');
  const [country, setCountry] = useState('United States');
  const [stateJurisdiction, setStateJurisdiction] = useState('Delaware / California');
  const [businessSize, setBusinessSize] = useState('$1.5M Annual Revenue / 10 Employees');
  const [taxId, setTaxId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [incorporationDate, setIncorporationDate] = useState('2023-05-10');
  const [fiscalYearEnd, setFiscalYearEnd] = useState('December 31');
  const [accountingBasis, setAccountingBasis] = useState<'cash' | 'accrual'>('accrual');
  const [accountingSoftware, setAccountingSoftware] = useState('QuickBooks Online');

  // Step 3: Acceptance & Compliance Checks & Identity Document
  const [identityVerified, setIdentityVerified] = useState(true);
  const [identityMethod, setIdentityMethod] = useState('Government Passport & FinCEN BOI Registry');
  const [businessRegistrationVerified, setBusinessRegistrationVerified] = useState(true);
  const [conflictCheckPassed, setConflictCheckPassed] = useState(true);
  const [riskRating, setRiskRating] = useState<RiskRatingType>('low');
  const [complianceNotes, setComplianceNotes] = useState('Standard domestic business. Identity and corporate registration confirmed.');

  // Identity Document upload and update state
  const [idDocFile, setIdDocFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>({
    name: 'Gov_Passport_Scan_Primary_Officer.pdf',
    size: '1.4 MB',
    type: 'application/pdf'
  });
  const [idDocType, setIdDocType] = useState<'passport' | 'drivers_license' | 'state_id' | 'national_id' | 'incorporation_cert'>('passport');
  const [idDocNumber, setIdDocNumber] = useState('P-49210982');
  const [idDocIssuingAuthority, setIdDocIssuingAuthority] = useState('United States Department of State');
  const [idDocExpiration, setIdDocExpiration] = useState('2032-08-15');
  const [idDocStatus, setIdDocStatus] = useState<'verified' | 'pending_review' | 'expired'>('verified');

  // Interactive document update ref, preview modal, and alert notifications
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);

  const samplePresets = [
    {
      label: 'US Passport',
      name: 'Gov_Passport_Scan_Primary_Officer.pdf',
      size: '1.4 MB',
      type: 'passport' as const,
      number: 'P-49210982',
      authority: 'United States Department of State',
      expiration: '2032-08-15'
    },
    {
      label: 'Real-ID Driver License',
      name: 'RealID_Drivers_License_Front_Back.pdf',
      size: '1.8 MB',
      type: 'drivers_license' as const,
      number: 'CA-DL-98102419',
      authority: 'California DMV',
      expiration: '2029-11-20'
    },
    {
      label: 'Articles of Incorporation',
      name: 'Delaware_Cert_Of_Good_Standing.pdf',
      size: '2.6 MB',
      type: 'incorporation_cert' as const,
      number: 'DE-CORP-91823',
      authority: 'Delaware Secretary of State',
      expiration: '2099-12-31'
    },
    {
      label: 'National Identity Card',
      name: 'National_Identity_Card_Scan.pdf',
      size: '950 KB',
      type: 'national_id' as const,
      number: 'NID-88190241',
      authority: 'National Identification Authority',
      expiration: '2031-06-30'
    }
  ];

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const lower = file.name.toLowerCase();
    let guessedType: 'passport' | 'drivers_license' | 'state_id' | 'national_id' | 'incorporation_cert' = idDocType;
    if (lower.includes('passport')) guessedType = 'passport';
    else if (lower.includes('license') || lower.includes('dl')) guessedType = 'drivers_license';
    else if (lower.includes('corp') || lower.includes('inc') || lower.includes('cert') || lower.includes('standing')) guessedType = 'incorporation_cert';
    else if (lower.includes('national')) guessedType = 'national_id';

    setIdDocFile({
      name: file.name,
      size: sizeFormatted,
      type: file.type || 'application/pdf'
    });
    setIdDocType(guessedType);
    setIdDocStatus('verified');
    setIdentityVerified(true);
    setIdentityMethod(`Document Verified: ${file.name}`);
    setUpdateNotification(`✓ Identity document successfully updated to: ${file.name} (${sizeFormatted})`);
    setTimeout(() => setUpdateNotification(null), 4000);
  };

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setIdDocFile({
      name: preset.name,
      size: preset.size,
      type: 'application/pdf'
    });
    setIdDocType(preset.type);
    setIdDocNumber(preset.number);
    setIdDocIssuingAuthority(preset.authority);
    setIdDocExpiration(preset.expiration);
    setIdDocStatus('verified');
    setIdentityVerified(true);
    setIdentityMethod(`Government Verified: ${preset.authority} (${preset.number})`);
    setUpdateNotification(`✓ Identity document updated to "${preset.name}"`);
    setTimeout(() => setUpdateNotification(null), 4000);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveIdDoc = () => {
    setIdDocFile(null);
    setIdentityVerified(false);
    setIdDocStatus('pending_review');
    setUpdateNotification('Identity document removed. Please upload or select an identity document.');
    setTimeout(() => setUpdateNotification(null), 4000);
  };

  // Step 4: Engagement Scope, Services & Fees
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['bookkeeping', 'tax']);
  const [serviceFrequency, setServiceFrequency] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [monthlyFee, setMonthlyFee] = useState('$1,650/mo');
  const [setupFee, setSetupFee] = useState('$350');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [assignedAccountant, setAssignedAccountant] = useState(existingAccountants[0] || 'Sarah Chen, CPA');

  // Step 5: Documents & Authorization
  const [engagementAgreementSigned, setEngagementAgreementSigned] = useState(true);
  const [taxAuthorizationForm8821, setTaxAuthorizationForm8821] = useState(true);
  const [bankSystemAccessAuthorized, setBankSystemAccessAuthorized] = useState(true);

  // Step 6: Client Status & Master Record Review
  const [clientStatus, setClientStatus] = useState<ClientLifecycleStatus>('active');

  // Step 7: Operations & Bank Accounts / Checklist
  const [primaryBankName, setPrimaryBankName] = useState('JPMorgan Chase');
  const [primaryBankSuffix, setPrimaryBankSuffix] = useState('5104');
  const [cardName, setCardName] = useState('American Express');
  const [cardSuffix, setCardSuffix] = useState('9912');
  const [payrollProvider, setPayrollProvider] = useState('Gusto Payroll');

  // Autofill sample data for rapid testing
  const handleAutofillDemo = () => {
    setBusinessName('Northstar Clean Energy Corp');
    setTradeName('Northstar Solar Systems');
    setContactName('Elena Vasquez');
    setContactEmail('finance@northstarsolar.com');
    setContactPhone('(415) 555-0831');
    setContactTitle('Chief Operating Officer');
    setBusinessAddress('450 Mission Street, Suite 800, San Francisco, CA 94105');

    setLegalStructure('c_corp');
    setIndustry('Clean Energy & Engineering');
    setCountry('United States');
    setStateJurisdiction('Delaware / California');
    setBusinessSize('$3.5M Annual Revenue / 18 Employees');
    setTaxId('94-7819203');
    setRegistrationNumber('DE-CORP-91823');
    setIncorporationDate('2022-03-15');
    setFiscalYearEnd('December 31');
    setAccountingBasis('accrual');
    setAccountingSoftware('QuickBooks Online Advanced');

    setIdentityVerified(true);
    setIdentityMethod('California Real-ID & Certificate of Good Standing');
    setIdDocFile({
      name: 'Passport_Scan_Elena_Vasquez.pdf',
      size: '2.1 MB',
      type: 'application/pdf'
    });
    setIdDocType('passport');
    setIdDocNumber('US-981240182');
    setIdDocIssuingAuthority('United States Department of State');
    setIdDocExpiration('2033-04-12');
    setIdDocStatus('verified');
    setBusinessRegistrationVerified(true);
    setConflictCheckPassed(true);
    setRiskRating('low');
    setComplianceNotes('Clean commercial track record. Identity document verified via US Passport. Zero sanctions or PEP exposure.');

    setSelectedServices(['bookkeeping', 'tax', 'payroll']);
    setServiceFrequency('monthly');
    setMonthlyFee('$2,150/mo');
    setSetupFee('$500');
    setStartDate('2026-10-01');
    setAssignedAccountant(existingAccountants[0] || 'Sarah Chen, CPA');

    setEngagementAgreementSigned(true);
    setTaxAuthorizationForm8821(true);
    setBankSystemAccessAuthorized(true);

    setClientStatus('active');

    setPrimaryBankName('Silicon Valley Bank');
    setPrimaryBankSuffix('7201');
    setCardName('Brex Corporate Card');
    setCardSuffix('4419');
    setPayrollProvider('Rippling Payroll');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalizeOnboarding();
    }
  };

  const handleFinalizeOnboarding = () => {
    const clientId = `cli-${Date.now().toString(36)}`;
    const emailDomain = contactEmail.includes('@') ? contactEmail.split('@')[1] : 'client.com';

    // 1. Client Master Record
    const masterRecord: ClientMasterRecord = {
      id: `mst-${clientId}`,
      legalName: businessName || 'New Client Company',
      tradeName: tradeName || businessName,
      clientStatus,
      legalStructure,
      industry,
      country,
      stateJurisdiction,
      businessSize,
      taxId: taxId || 'XX-XXXXXXX',
      registrationNumber: registrationNumber || 'REG-PENDING',
      incorporationDate,
      registeredAddress: businessAddress || 'Corporate Address on File',
      primaryContact: {
        name: contactName || 'Primary Contact',
        email: contactEmail || 'client@example.com',
        phone: contactPhone || 'Phone',
        title: contactTitle
      },
      beneficialOwners: [
        {
          name: contactName || 'Principal Owner',
          ownershipPercentage: 100,
          role: contactTitle || 'Managing Director',
          idVerified: identityVerified
        }
      ],
      fiscalYearEnd,
      accountingBasis,
      accountingSoftware,
      createdAt: new Date().toISOString()
    };

    // 2. Engagement Record
    const engagementRecord: EngagementRecord = {
      id: `eng-${clientId}`,
      clientId,
      services: selectedServices,
      serviceFrequency,
      monthlyFee,
      setupFee,
      billingCadence: serviceFrequency,
      startDate,
      assignedAccountant,
      engagementAgreementSigned,
      taxAuthorizationForm8821,
      bankSystemAccessAuthorized,
      approvalStatus: 'approved',
      approvedBy: assignedAccountant
    };

    // 3. Compliance Record with Identity Document
    const complianceRecord: ComplianceRecord = {
      identityVerified,
      identityMethod,
      identityDocument: idDocFile ? {
        id: `iddoc-${Date.now()}`,
        fileName: idDocFile.name,
        fileSize: idDocFile.size,
        documentType: idDocType,
        idNumber: idDocNumber,
        issuingAuthority: idDocIssuingAuthority,
        expirationDate: idDocExpiration,
        uploadedAt: new Date().toISOString(),
        verificationStatus: idDocStatus
      } : undefined,
      businessRegistrationVerified,
      conflictCheckPassed,
      riskRating,
      complianceNotes,
      reviewerSignOff: assignedAccountant,
      signOffDate: new Date().toISOString().split('T')[0]
    };

    // Main Client Object
    const newClient: Client = {
      id: clientId,
      name: tradeName || businessName || 'New Client Entity',
      serviceTypes: selectedServices,
      owningAccountant: assignedAccountant,
      contactEmail,
      emailDomain,
      portalAccess: true,
      autoSendEnabled: false,
      totalSubmissions: 0,
      falseMissingRate: 0.0,
      status: clientStatus,
      masterRecord,
      engagementRecord,
      complianceRecord
    };

    // Initial Connected Accounts
    const newAccounts: ClientAccount[] = [
      {
        id: `acc-${clientId}-1`,
        clientId,
        type: 'bank',
        institution: primaryBankName || 'Primary Operating Checking',
        identifierSuffix: primaryBankSuffix || '1001',
        status: 'active',
        notes: 'Primary Operating Checking'
      }
    ];

    if (cardSuffix) {
      newAccounts.push({
        id: `acc-${clientId}-2`,
        clientId,
        type: 'card',
        institution: cardName || 'Corporate Card',
        identifierSuffix: cardSuffix,
        status: 'active',
        notes: 'Corporate Card'
      });
    }

    // Auto-generate expected checklist for this client
    const requirements: ChecklistRequirement[] = [
      {
        id: `req-${clientId}-bank`,
        documentType: 'bank_statement',
        targetInstitution: primaryBankName,
        targetAccountSuffix: primaryBankSuffix,
        description: `Monthly ${primaryBankName} Checking Statement (...${primaryBankSuffix})`,
        frequency: 'monthly',
        isExemptIfDormant: false
      }
    ];

    if (cardSuffix) {
      requirements.push({
        id: `req-${clientId}-card`,
        documentType: 'card_statement',
        targetInstitution: cardName,
        targetAccountSuffix: cardSuffix,
        description: `Monthly ${cardName} Statement (...${cardSuffix})`,
        frequency: 'monthly',
        isExemptIfDormant: false
      });
    }

    if (selectedServices.includes('payroll')) {
      requirements.push({
        id: `req-${clientId}-payroll`,
        documentType: 'payroll_report',
        targetInstitution: payrollProvider,
        description: `${payrollProvider} Monthly Payroll Summary`,
        frequency: 'monthly',
        isExemptIfDormant: false
      });
    }

    const newChecklist: ChecklistTemplate = {
      id: `chk-${clientId}`,
      clientId,
      periodType: 'monthly',
      version: 1,
      lastUpdated: new Date().toISOString(),
      requirements,
      exceptions: []
    };

    // Initial period folder (e.g. October 2026)
    const initialPeriod: Period = {
      id: `per-${clientId}-oct2026`,
      clientId,
      label: 'October 2026',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      deadline: '2026-11-10',
      status: 'open'
    };

    onComplete({
      client: newClient,
      accounts: newAccounts,
      checklist: newChecklist,
      period: initialPeriod
    });
  };

  const steps = [
    { num: 1, label: '1. Prospective Inquiry' },
    { num: 2, label: '2. Legal Classification' },
    { num: 3, label: '3. Compliance & Risk' },
    { num: 4, label: '4. Engagement Scope' },
    { num: 5, label: '5. Legal Authorizations' },
    { num: 6, label: '6. Master Profile' },
    { num: 7, label: '7. Operations Setup' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Top Banner Navigation Bar */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Files</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                New Client Onboarding Process
              </h2>
              <p className="text-[11px] text-slate-500">
                Step {currentStep} of 7: {steps[currentStep - 1].label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Autofill realistic clean energy client details"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Autofill Sample Client</span>
            </button>

            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Cancel & Exit
            </button>
          </div>
        </div>
      </div>

      {/* 7-Step Navigation Stepper Header */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 shrink-0 overflow-x-auto shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[700px] gap-2">
          {steps.map(step => {
            const isPast = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 text-xs py-1 transition-colors ${
                  isCurrent
                    ? 'font-bold text-slate-900 border-b-2 border-slate-900 pb-1'
                    : isPast
                    ? 'text-slate-700 hover:text-slate-900 font-medium'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent
                      ? 'bg-slate-900 text-white'
                      : isPast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPast ? '✓' : step.num}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Page Area: 2-Column Responsive Layout */}
      <div className="max-w-6xl w-full mx-auto p-6 md:p-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: The Active Step's Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleNext} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
              {/* STEP 1: PROSPECTIVE INQUIRY & CONTACT */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Step 1: Prospective Client Inquiry & Contact Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Received via website inquiry, consultation, email, or telephone referral.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Legal Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Industrial Logistics LLC"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Trade / Doing Business As (DBA) Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Freight Solutions"
                        value={tradeName}
                        onChange={e => setTradeName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Primary Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rachel Sterling"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="finance@acme-logistics.com"
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Direct Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="(312) 555-0198"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Contact Person Title / Role
                      </label>
                      <input
                        type="text"
                        value={contactTitle}
                        onChange={e => setContactTitle(e.target.value)}
                        placeholder="e.g. Managing Partner, Director of Finance"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Registered Principal Address
                      </label>
                      <input
                        type="text"
                        value={businessAddress}
                        onChange={e => setBusinessAddress(e.target.value)}
                        placeholder="e.g. 1420 Logistics Blvd, Suite 400, Chicago, IL"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: IDENTIFY AND CLASSIFY THE CLIENT */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Step 2: Legal Classification & Tax Profile
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Determine legal structure, industry classification, tax jurisdictions, and fiscal dates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Legal Entity Structure
                      </label>
                      <select
                        value={legalStructure}
                        onChange={e => setLegalStructure(e.target.value as LegalStructureType)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      >
                        <option value="llc">Limited Liability Company (LLC)</option>
                        <option value="s_corp">S-Corporation (Form 1120-S)</option>
                        <option value="c_corp">C-Corporation (Form 1120)</option>
                        <option value="partnership">Partnership / LLP (Form 1065)</option>
                        <option value="sole_proprietorship">Sole Proprietorship (Schedule C)</option>
                        <option value="individual">Individual Personal Tax (Form 1040)</option>
                        <option value="nonprofit">501(c)(3) Non-Profit Organization</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Industry / Business Activity
                      </label>
                      <input
                        type="text"
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        placeholder="e.g. Healthcare, Software, Freight, Construction"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Tax Jurisdiction
                      </label>
                      <input
                        type="text"
                        value={stateJurisdiction}
                        onChange={e => setStateJurisdiction(e.target.value)}
                        placeholder="e.g. Delaware / Illinois"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Business Scale & Headcount
                      </label>
                      <input
                        type="text"
                        value={businessSize}
                        onChange={e => setBusinessSize(e.target.value)}
                        placeholder="e.g. $2.8M Annual / 16 Employees"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Federal Tax ID (EIN)
                      </label>
                      <input
                        type="text"
                        value={taxId}
                        onChange={e => setTaxId(e.target.value)}
                        placeholder="XX-XXXXXXX"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Accounting Basis
                      </label>
                      <select
                        value={accountingBasis}
                        onChange={e => setAccountingBasis(e.target.value as 'cash' | 'accrual')}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      >
                        <option value="accrual">Accrual Basis (GAAP)</option>
                        <option value="cash">Cash Basis</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Fiscal Year End
                      </label>
                      <input
                        type="text"
                        value={fiscalYearEnd}
                        onChange={e => setFiscalYearEnd(e.target.value)}
                        placeholder="December 31"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Legacy Software Being Replaced
                      </label>
                      <input
                        type="text"
                        value={accountingSoftware}
                        onChange={e => setAccountingSoftware(e.target.value)}
                        placeholder="e.g. QuickBooks Online, Xero, NetSuite (Migrating to Retalyy)"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PERFORM ACCEPTANCE & COMPLIANCE CHECKS */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                      <span>Step 3: Acceptance & Compliance Checks</span>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        KYC / FinCEN BOI
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Check identity, upload/update primary officer identity documents, verify business registration in state records, assess conflicts, and assign risk rating.
                    </p>
                  </div>

                  {/* Real-time alert notification */}
                  {updateNotification && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{updateNotification}</span>
                    </div>
                  )}

                  {/* Hidden native file input for actual document uploading & updating */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />

                  {/* DEDICATED IDENTITY DOCUMENT VERIFICATION & UPDATE CARD */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              Officer Identity Document Verification
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                idDocStatus === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : idDocStatus === 'pending_review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {idDocStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Required identity proof for FinCEN Beneficial Ownership & accounting engagement due diligence
                          </span>
                        </div>
                      </div>

                      {/* Header Quick Upload Action */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTriggerUpload}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                          title="Upload new file from device to update identity document"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Update Identity Doc</span>
                        </button>

                        {idDocFile && (
                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(true)}
                            className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title="Inspect visual preview of identity credential"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Preview</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Active Uploaded Identity Document Display */}
                    {idDocFile ? (
                      <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 truncate max-w-xs">
                                  {idDocFile.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  ({idDocFile.size})
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Type: <strong className="uppercase text-slate-700">{idDocType.replace('_', ' ')}</strong> · Authority: {idDocIssuingAuthority}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={handleTriggerUpload}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <RefreshCw className="w-3 h-3 text-slate-600" />
                              <span>Replace File</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowPreviewModal(true)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3 text-slate-600" />
                              <span>View Scan</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleRemoveIdDoc}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title="Remove identity document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Editable Document Details Form for Immediate Updating */}
                        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                              Document Classification
                            </label>
                            <select
                              value={idDocType}
                              onChange={e => setIdDocType(e.target.value as any)}
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-medium"
                            >
                              <option value="passport">Government Passport</option>
                              <option value="drivers_license">Real-ID Driver's License</option>
                              <option value="state_id">State Identification Card</option>
                              <option value="national_id">National ID Card</option>
                              <option value="incorporation_cert">Articles of Incorporation / Good Standing</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                              ID / Credential Number
                            </label>
                            <input
                              type="text"
                              value={idDocNumber}
                              onChange={e => setIdDocNumber(e.target.value)}
                              placeholder="e.g. P-49210982"
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono font-semibold text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                              Issuing Authority
                            </label>
                            <input
                              type="text"
                              value={idDocIssuingAuthority}
                              onChange={e => setIdDocIssuingAuthority(e.target.value)}
                              placeholder="e.g. US Department of State"
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="date"
                              value={idDocExpiration}
                              onChange={e => setIdDocExpiration(e.target.value)}
                              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <div className="flex items-center gap-2">
                            <label className="font-semibold text-slate-600">Verification Status:</label>
                            <select
                              value={idDocStatus}
                              onChange={e => {
                                const newStatus = e.target.value as any;
                                setIdDocStatus(newStatus);
                                if (newStatus === 'verified') setIdentityVerified(true);
                              }}
                              className="p-1 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900"
                            >
                              <option value="verified">Verified & Authenticated</option>
                              <option value="pending_review">Pending Staff Verification</option>
                              <option value="expired">Expired Document</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Confirmed by:</span>
                            <span className="font-semibold text-slate-800">{assignedAccountant}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Empty state: Dropzone prompt to upload */
                      <div
                        onClick={handleTriggerUpload}
                        className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer text-center space-y-2"
                      >
                        <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Upload Primary Officer Identity Document
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Click to select government passport scan, driver's license, or business registration evidence (PDF, PNG, JPG up to 15MB)
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Select Document File</span>
                        </button>
                      </div>
                    )}

                    {/* Quick Preset Identity Documents */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider mb-2">
                        Quick Select Sample Officer Documents (One-Click Update):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {samplePresets.map(preset => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                              idDocFile?.name === preset.name
                                ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="font-bold block text-[11px] truncate">{preset.label}</span>
                            <span className={`text-[10px] font-mono block truncate ${
                              idDocFile?.name === preset.name ? 'text-slate-300' : 'text-slate-400'
                            }`}>
                              {preset.number}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Other Compliance & Good Standing Checks */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Identity Verification Confirmed</span>
                        <span className="text-[11px] text-slate-500">Government ID / Passport / FinCEN Beneficial Ownership verified on file</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={identityVerified}
                        onChange={e => setIdentityVerified(e.target.checked)}
                        className="h-4 w-4 rounded text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900 block">Secretary of State Good Standing</span>
                        <span className="text-[11px] text-slate-500">Business registration verified active in state registry</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={businessRegistrationVerified}
                        onChange={e => setBusinessRegistrationVerified(e.target.checked)}
                        className="h-4 w-4 rounded text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900 block">Conflict of Interest Assessment</span>
                        <span className="text-[11px] text-slate-500">No conflicts with existing firm clients or vendors</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={conflictCheckPassed}
                        onChange={e => setConflictCheckPassed(e.target.checked)}
                        className="h-4 w-4 rounded text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Assessed Risk Rating
                      </label>
                      <select
                        value={riskRating}
                        onChange={e => setRiskRating(e.target.value as RiskRatingType)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold"
                      >
                        <option value="low">Low Risk (Standard domestic commercial)</option>
                        <option value="medium">Medium Risk (Multi-state payroll / high volume)</option>
                        <option value="high">High Risk (Complex foreign operations / cash intensive)</option>
                        <option value="specialist_review">Requires Specialist / Partner Review</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Identity Verification Method / Note
                      </label>
                      <input
                        type="text"
                        value={identityMethod}
                        onChange={e => setIdentityMethod(e.target.value)}
                        placeholder="e.g. State Driver License & Certificate of Good Standing"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Due Diligence & Reviewer Notes
                    </label>
                    <textarea
                      value={complianceNotes}
                      onChange={e => setComplianceNotes(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: DEFINE THE ENGAGEMENT */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Step 4: Define Engagement Scope, Services & Fees
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Select services purchased, billing rates, deadlines, and assigned accountant.
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-2 text-xs">
                      Services Contracted:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {[
                        { id: 'bookkeeping', label: 'Monthly Bookkeeping', desc: 'Bank & ledger reconciliation' },
                        { id: 'tax', label: 'Tax Preparation', desc: 'Quarterly 941 & Annual 1120/1065' },
                        { id: 'payroll', label: 'Payroll Processing', desc: 'Wage liabilities & summaries' },
                        { id: 'advisory', label: 'Advisory / Fractional CFO', desc: 'Monthly cash-flow planning' }
                      ].map(srv => {
                        const isChecked = selectedServices.includes(srv.id as ServiceType);
                        return (
                          <button
                            type="button"
                            key={srv.id}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedServices(selectedServices.filter(s => s !== srv.id));
                              } else {
                                setSelectedServices([...selectedServices, srv.id as ServiceType]);
                              }
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-all ${
                              isChecked
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-bold block text-xs">{srv.label}</span>
                            <span className={`text-[10px] block mt-1 ${isChecked ? 'text-slate-300' : 'text-slate-500'}`}>
                              {srv.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Monthly Retainer Fee
                      </label>
                      <input
                        type="text"
                        value={monthlyFee}
                        onChange={e => setMonthlyFee(e.target.value)}
                        placeholder="$1,850/mo"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        One-Time Setup Fee
                      </label>
                      <input
                        type="text"
                        value={setupFee}
                        onChange={e => setSetupFee(e.target.value)}
                        placeholder="$500"
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Assigned Lead Accountant
                      </label>
                      <select
                        value={assignedAccountant}
                        onChange={e => setAssignedAccountant(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                      >
                        {existingAccountants.map(acc => (
                          <option key={acc} value={acc}>
                            {acc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: DOCUMENTS AND AUTHORIZATIONS */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Step 5: Obtain Documents & Authorization
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Confirm signed engagement agreement and tax information authorizations on file.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">1. Signed Engagement Letter & Contract</span>
                        <span className="text-[11px] text-slate-500">Legal agreement defining responsibilities, scope, and payment terms</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={engagementAgreementSigned}
                        onChange={e => setEngagementAgreementSigned(e.target.checked)}
                        className="h-4 w-4 rounded text-slate-900"
                      />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">2. IRS Form 8821 / Tax Authorization</span>
                        <span className="text-[11px] text-slate-500">Allows firm accountants to access tax transcripts and check filing standing</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={taxAuthorizationForm8821}
                        onChange={e => setTaxAuthorizationForm8821(e.target.checked)}
                        className="h-4 w-4 rounded text-slate-900"
                      />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">3. Bank Feeds View-Only Permission</span>
                        <span className="text-[11px] text-slate-500">Permission to connect read-only monthly statements from client financial institutions</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={bankSystemAccessAuthorized}
                        onChange={e => setBankSystemAccessAuthorized(e.target.checked)}
                        className="h-4 w-4 rounded text-slate-900"
                      />
                    </div>

                    {/* 4. Primary Officer Identity Evidence Document */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">4. Primary Officer Identity Verification Document</span>
                          <span className="text-[11px] text-slate-500">Legal proof of identity for authorized business officer & beneficial owner</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          idDocFile ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {idDocFile ? '✓ ID Attached' : 'Pending Upload'}
                        </span>
                      </div>

                      {idDocFile ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                              <FileCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs truncate max-w-sm">
                                {idDocFile.name}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {idDocType.replace('_', ' ').toUpperCase()} · #{idDocNumber} · Exp: {idDocExpiration}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowPreviewModal(true)}
                              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={handleTriggerUpload}
                              className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                            >
                              <UploadCloud className="w-3 h-3" />
                              Update ID Doc
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <span className="text-amber-800 text-xs font-medium">No officer identity document attached yet</span>
                          <button
                            type="button"
                            onClick={handleTriggerUpload}
                            className="px-2.5 py-1 text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-bold flex items-center gap-1"
                          >
                            <UploadCloud className="w-3 h-3" />
                            Upload ID Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: CREATE CLIENT RECORD */}
              {currentStep === 6 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Step 6: Review Client Master Record
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Verify profile and assign lifecycle status before creating active operational folders.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{businessName || 'Client Entity'}</span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">{industry} · {stateJurisdiction}</span>
                      </div>

                      <div className="text-right">
                        <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                          Client Lifecycle Status
                        </label>
                        <select
                          value={clientStatus}
                          onChange={e => setClientStatus(e.target.value as ClientLifecycleStatus)}
                          className="p-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-900"
                        >
                          <option value="active">Active (Begin document collection)</option>
                          <option value="approved">Approved (Awaiting start date)</option>
                          <option value="pending_verification">Pending Verification</option>
                          <option value="prospective">Prospective</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Tax ID (EIN)</span>
                        <span className="font-mono text-slate-800 font-semibold">{taxId || 'Pending'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Structure</span>
                        <span className="uppercase text-slate-800 font-medium">{legalStructure.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Lead Staff</span>
                        <span className="text-slate-800 font-medium">{assignedAccountant}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Monthly Fee</span>
                        <span className="font-mono font-bold text-slate-900">{monthlyFee}</span>
                      </div>
                    </div>

                    {/* Step 6 Identity Document Snapshot with direct update option */}
                    <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">
                              Identity Verification Document:
                            </span>
                            <span className="text-slate-800 font-semibold text-xs truncate max-w-xs">
                              {idDocFile ? idDocFile.name : 'Pending Document'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {idDocType.replace('_', ' ').toUpperCase()} #{idDocNumber} · Exp: {idDocExpiration} · Status: <strong className="text-emerald-700 capitalize">{idDocStatus}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {idDocFile && (
                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(true)}
                            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleTriggerUpload}
                          className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <UploadCloud className="w-3 h-3" />
                          Update ID Document
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: CONFIGURE ONGOING OPERATIONS */}
              {currentStep === 7 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Step 7: Configure Bank Accounts & Expected Document Checklist
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Connect client accounts so the system generates an expected document checklist and automatically builds the client's file folder for October 2026.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-slate-700" />
                        Primary Operating Bank Account
                      </span>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={primaryBankName}
                          onChange={e => setPrimaryBankName(e.target.value)}
                          placeholder="e.g. JPMorgan Chase"
                          className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Account Last 4 Digits
                        </label>
                        <input
                          type="text"
                          value={primaryBankSuffix}
                          onChange={e => setPrimaryBankSuffix(e.target.value)}
                          placeholder="e.g. 5104"
                          className="w-full p-2 bg-white border border-slate-300 rounded-md font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-slate-700" />
                        Corporate Card Account
                      </span>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Card Issuer
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="e.g. American Express"
                          className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Card Last 4 Digits
                        </label>
                        <input
                          type="text"
                          value={cardSuffix}
                          onChange={e => setCardSuffix(e.target.value)}
                          placeholder="e.g. 9912"
                          className="w-full p-2 bg-white border border-slate-300 rounded-md font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {selectedServices.includes('payroll') && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <div>
                          <span className="font-semibold text-slate-800 block">Payroll Provider</span>
                          <span className="text-[11px] text-slate-500">Will expect monthly wage liability & summary reports</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={payrollProvider}
                        onChange={e => setPayrollProvider(e.target.value)}
                        placeholder="e.g. Gusto, ADP, Rippling"
                        className="p-1.5 bg-white border border-slate-300 rounded-md text-slate-900 font-medium text-xs w-52"
                      />
                    </div>
                  )}

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-2.5 text-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Completing onboarding will create <strong>{tradeName || businessName}</strong>'s client folder, generate their expected document checklist for October 2026, and open their files view automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Form Navigation Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Previous Step
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {currentStep < 7 ? (
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Continue to {steps[currentStep].label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Complete Onboarding & Generate Client Folder</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Client Profile Preview Card */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Live Client Profile Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-800">
                  {clientStatus}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {businessName || 'Legal Name Pending'}
                  </h4>
                  {tradeName && (
                    <p className="text-[11px] text-slate-500 font-medium">DBA: {tradeName}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Structure</span>
                    <span className="font-semibold text-slate-800 uppercase">{legalStructure}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Tax ID (EIN)</span>
                    <span className="font-mono text-slate-800 font-semibold">{taxId || 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Assigned Staff</span>
                    <span className="font-semibold text-slate-800">{assignedAccountant}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Monthly Retainer</span>
                    <span className="font-mono font-bold text-slate-900">{monthlyFee}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Services Configured:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedServices.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] capitalize">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Compliance & Identity Status:
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className={`w-2 h-2 rounded-full ${identityVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>Identity Verification: {identityVerified ? 'Confirmed' : 'Pending'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleTriggerUpload}
                        className="text-[10px] text-slate-600 hover:text-slate-900 font-semibold underline"
                      >
                        Update
                      </button>
                    </div>

                    {/* Attached Document Snapshot */}
                    {idDocFile && (
                      <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 truncate max-w-[140px] block text-[10px]">
                            {idDocFile.name}
                          </span>
                          <span className="font-mono text-[9px] text-slate-400">
                            {idDocFile.size}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="uppercase">{idDocType.replace('_', ' ')}</span>
                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(true)}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            View Scan
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${engagementAgreementSigned ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>Engagement Contract: {engagementAgreementSigned ? 'Signed' : 'Pending'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Risk Rating: <strong className="uppercase">{riskRating}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE IDENTITY DOCUMENT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Officer Identity Document Inspection</h3>
                  <p className="text-[10px] text-slate-400">
                    KYC Due Diligence & FinCEN Beneficial Ownership Vault
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Body: Realistic Credential Specimen */}
            <div className="p-6 space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-lg relative overflow-hidden border border-slate-700">
                {/* Security Watermark Seal */}
                <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-36 h-36" />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 block">
                      OFFICIAL GOVERNMENT CREDENTIAL RECORD
                    </span>
                    <span className="font-bold text-sm text-slate-100 uppercase tracking-wide">
                      {idDocType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {idDocStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 items-center">
                  {/* Photo ID Box */}
                  <div className="w-24 h-28 rounded-lg bg-slate-800 border-2 border-slate-600 flex flex-col items-center justify-center text-slate-400 p-2 text-center relative overflow-hidden">
                    <Users className="w-10 h-10 text-slate-500 mb-1" />
                    <span className="text-[8px] font-mono text-slate-400 uppercase font-semibold">
                      PHOTO ID
                    </span>
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-emerald-300 text-[7px] font-mono py-0.5">
                      BIOMETRIC
                    </div>
                  </div>

                  {/* Officer & Document Details */}
                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                        Principal Officer / Holder
                      </span>
                      <span className="font-bold text-sm text-white">
                        {contactName || businessName || 'Principal Officer'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{contactTitle}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/50">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 block">Doc Number</span>
                        <span className="font-mono font-bold text-amber-300">{idDocNumber}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 block">Expiration</span>
                        <span className="font-mono text-slate-200">{idDocExpiration}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1">
                      <span>Issuing Authority: </span>
                      <strong className="text-slate-200">{idDocIssuingAuthority}</strong>
                    </div>
                  </div>
                </div>

                {/* Machine Readable Zone (MRZ) Mockup */}
                <div className="mt-4 pt-3 border-t border-slate-700/60 font-mono text-[9px] text-slate-400 tracking-wider leading-relaxed select-all">
                  <div>P&lt;USA{(contactName || 'OFFICER').replace(/\s+/g, '&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  <div>{idDocNumber}&lt;&lt;5USA{idDocExpiration.replace(/-/g, '').slice(2)}4M3208158&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</div>
                </div>
              </div>

              {/* Document File Metadata Row */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">{idDocFile?.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    File Size: {idDocFile?.size} · Uploaded for onboarding KYC
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleTriggerUpload();
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Replace Document</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Identity status: <strong className="text-emerald-700 capitalize">{idDocStatus}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
