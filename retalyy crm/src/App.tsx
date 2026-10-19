import React, { useState, useMemo } from 'react';
import {
  SimplifiedHeader,
  MainStepTab,
  Step1SubTab,
  Step2SubTab,
  Step3SubTab
} from './components/SimplifiedHeader';
import {
  AuthLoginView,
  UserSession,
  PERSONAS
} from './components/Auth/AuthLoginView';

// Step 1: Intake & Onboarding Imports
import { ClientFolderTree } from './components/Step1Intake/FileManager/ClientFolderTree';
import { FileExplorer } from './components/Step1Intake/FileManager/FileExplorer';
import { FileInspector } from './components/Step1Intake/FileManager/FileInspector';
import { UploadModal } from './components/Step1Intake/FileManager/UploadModal';
import { DocumentViewerModal } from './components/Step1Intake/FileManager/DocumentViewerModal';
import { OnboardingQueueView } from './components/Step1Intake/Onboarding/OnboardingQueueView';
import { OnboardingPage } from './components/Step1Intake/Onboarding/OnboardingPage';
import { ChecklistManager } from './components/Step1Intake/ChecklistManager';
import { ClientPortalView } from './components/Step1Intake/ClientPortalView';
import { AuditTrailView } from './components/Step1Intake/AuditTrailView';
import { CasesDashboard } from './components/Step1Intake/CasesDashboard';
import { CaseDetailDrawer } from './components/Step1Intake/CaseDetailDrawer';
import { PipelineSimulator } from './components/Step1Intake/PipelineSimulator';

// Step 2: AI Transaction Processing Imports
import { ClientContextBar } from './components/Step2Processing/ClientContextBar';
import { WorkflowStepper } from './components/Step2Processing/WorkflowStepper';
import { EfficiencyMetrics } from './components/Step2Processing/EfficiencyMetrics';
import { TransactionTable } from './components/Step2Processing/TransactionTable';
import { TransactionDrawer } from './components/Step2Processing/TransactionDrawer';
import { BatchActionsBar } from './components/Step2Processing/BatchActionsBar';
import { ExceptionsQueue } from './components/Step2Processing/ExceptionsQueue';
import { GeneralLedgerView } from './components/Step2Processing/GeneralLedgerView';
import { PipelineWalkthroughView } from './components/Step2Processing/PipelineWalkthroughView';
import { EngineDashboard } from './components/Step2Processing/EngineDashboard';
import { ContextWindowInspectorModal } from './components/Step2Processing/ContextWindowInspectorModal';
import { BenchmarkModal } from './components/Step2Processing/BenchmarkModal';
import { ExportModal } from './components/Step2Processing/ExportModal';
import { ChartOfAccountsModal } from './components/Step2Processing/ChartOfAccountsModal';

// Step 3: Ledgerline Accounting Core Imports
import { AccountingDashboard } from './components/Step3Ledgerline/AccountingDashboard';
import { InvoicesView } from './components/Step3Ledgerline/InvoicesView';
import { BillsView } from './components/Step3Ledgerline/BillsView';
import { ExpensesView } from './components/Step3Ledgerline/ExpensesView';
import { BankReconciliationView } from './components/Step3Ledgerline/BankReconciliationView';
import { ChartOfAccountsView } from './components/Step3Ledgerline/ChartOfAccountsView';
import { GeneralJournalView } from './components/Step3Ledgerline/GeneralJournalView';
import { ContactsView } from './components/Step3Ledgerline/ContactsView';
import { FinancialReportsView } from './components/Step3Ledgerline/FinancialReportsView';

// Services & Data
import { LedgerEngine, formatMoney } from './services/ledgerEngine';
import {
  INITIAL_CLIENTS,
  INITIAL_ACCOUNTS,
  INITIAL_CHECKLISTS,
  INITIAL_PERIODS,
  INITIAL_CASES,
  INITIAL_SUBMISSIONS,
  INITIAL_AUDIT_LOG,
  INITIAL_PROPOSALS
} from './data/intakeMockData';
import { MOCK_CLIENTS, INITIAL_TRANSACTIONS } from './data/txMockData';
import {
  Client,
  ClientAccount,
  ChecklistTemplate,
  Period,
  CaseTask,
  Submission,
  ProcessedDocument,
  AuditEvent,
  ChecklistProposal,
  IdentityDocument
} from './types/intake';
import { TransactionRecord, ClientProfile, UserRole } from './types/accounting';
import { AssembledContext } from './types/engine';
import { InvoiceLine, AccountType } from './types/ledgerline';

import { CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function App() {
  // ----------------------------------------------------
  // AUTHENTICATION & SESSION STATE
  // ----------------------------------------------------
  const [session, setSession] = useState<UserSession | null>(PERSONAS[0]);

  // Navigation State
  const [currentStep, setCurrentStep] = useState<MainStepTab>('step3_ledgerline');
  const [step1Tab, setStep1Tab] = useState<Step1SubTab>('files');
  const [step2Tab, setStep2Tab] = useState<Step2SubTab>('workbench');
  const [step3Tab, setStep3Tab] = useState<Step3SubTab>('dashboard');

  // Shared Client Selection
  const [selectedClientId, setSelectedClientId] = useState<string>('cli-acme');
  const [currentRole, setCurrentRole] = useState<UserRole>('staff_accountant');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // ----------------------------------------------------
  // STEP 1: INTAKE & ONBOARDING STATE
  // ----------------------------------------------------
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>(INITIAL_ACCOUNTS);
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>(INITIAL_CHECKLISTS);
  const [periods, setPeriods] = useState<Period[]>(INITIAL_PERIODS);
  const [cases, setCases] = useState<CaseTask[]>(INITIAL_CASES);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>(INITIAL_SUBMISSIONS);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(INITIAL_AUDIT_LOG);
  const [proposals, setProposals] = useState<ChecklistProposal[]>(INITIAL_PROPOSALS);

  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('per-acme-oct2026');
  const [selectedDocId, setSelectedDocId] = useState<string | null>('doc-acme-chase');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [viewingDocument, setViewingDocument] = useState<ProcessedDocument | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // ----------------------------------------------------
  // STEP 2: TRANSACTION PROCESSING STATE
  // ----------------------------------------------------
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [selectedTxnIds, setSelectedTxnIds] = useState<string[]>([]);
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number | null>(null);
  const [activeDrawerTxn, setActiveDrawerTxn] = useState<TransactionRecord | null>(null);
  const [currentTxnFilter, setCurrentTxnFilter] = useState<'all' | 'needs_review' | 'matched' | 'approved' | 'posted'>('all');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCoaModalOpen, setIsCoaModalOpen] = useState<boolean>(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);
  const [activeInspectedContext, setActiveInspectedContext] = useState<AssembledContext | null>(null);

  // ----------------------------------------------------
  // STEP 3: LEDGERLINE ACCOUNTING ENGINE STATE
  // ----------------------------------------------------
  const ledgerEngine = useMemo(() => new LedgerEngine(), []);
  const [ledgerVersion, setLedgerVersion] = useState<number>(0);
  const refreshLedger = () => setLedgerVersion(v => v + 1);

  // Computed Financial Summary & Status
  const financialSummary = ledgerEngine.getFinancialSummary();
  const accountsList = ledgerEngine.accounts;
  const journalEntries = ledgerEngine.journalEntries;
  const invoicesList = ledgerEngine.invoices;
  const billsList = ledgerEngine.bills;
  const bankStatementsList = ledgerEngine.bankStatements;
  const contactsList = ledgerEngine.getContacts();
  const agedReceivables = ledgerEngine.getAgedReceivables();
  const agedPayables = ledgerEngine.getAgedPayables();

  // Helper variables for current client & period in Step 1
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const currentPeriod =
    periods.find(p => p.id === selectedPeriodId && p.clientId === selectedClientId) ||
    periods.find(p => p.clientId === selectedClientId) ||
    periods[0];
  const currentChecklist =
    checklists.find(c => c.clientId === selectedClientId) || checklists[0];

  const currentSubmission =
    Object.values(submissions).find(
      s => s.clientId === currentClient.id && s.periodId === currentPeriod.id
    ) || submissions['sub-acme-01'];

  const currentDocument =
    currentSubmission?.documents.find(d => d.id === selectedDocId) ||
    currentSubmission?.documents[0] ||
    null;

  const attentionCount = Object.values(submissions).reduce((acc, sub) => {
    return acc + (sub.findings?.filter(f => f.resolution !== 'resolved').length || 0);
  }, 0);

  const pendingOnboardingCount = clients.filter(
    c => c.status === 'pending_verification'
  ).length;

  const step2ExceptionCount = transactions.filter(
    t => t.status === 'needs_review' || t.validationFlags.some(f => !f.resolved)
  ).length;

  const currentProfile: ClientProfile =
    MOCK_CLIENTS.find(c => c.id === selectedClientId) || MOCK_CLIENTS[0];

  // ----------------------------------------------------
  // LOGIN ROLE DISPATCHER
  // ----------------------------------------------------
  const handleLogin = (userSession: UserSession) => {
    setSession(userSession);
    if (userSession.role === 'client') {
      setCurrentStep('step1_intake');
      setStep1Tab('portal');
    } else if (userSession.role === 'intake_specialist') {
      setCurrentStep('step1_intake');
      setStep1Tab('files');
    } else if (userSession.role === 'staff_accountant') {
      setCurrentStep('step2_processing');
      setStep2Tab('workbench');
      setCurrentRole('staff_accountant');
    } else if (userSession.role === 'cpa_controller') {
      setCurrentStep('step3_ledgerline');
      setStep3Tab('dashboard');
      setCurrentRole('senior_accountant');
    } else {
      // firm admin
      setCurrentStep('step3_ledgerline');
      setStep3Tab('dashboard');
    }
  };

  // If user is not logged in, show AuthLoginView
  if (!session) {
    return <AuthLoginView onLogin={handleLogin} />;
  }

  // ----------------------------------------------------
  // HANDLERS: STEP 1 ACTIONS
  // ----------------------------------------------------
  const handleSelectFolder = (cId: string, pId: string) => {
    setSelectedClientId(cId);
    setSelectedPeriodId(pId);
    const sub = Object.values(submissions).find(
      s => s.clientId === cId && s.periodId === pId
    );
    if (sub && sub.documents.length > 0) {
      setSelectedDocId(sub.documents[0].id);
    } else {
      setSelectedDocId(null);
    }
  };

  const handleUpdateDocument = (
    docOrId: ProcessedDocument | string,
    updates?: {
      documentType?: DocumentClassificationType;
      institution?: string;
      accountSuffix?: string;
      totalAmount?: string;
    }
  ) => {
    setSubmissions(prev => {
      const copy = { ...prev };
      for (const [subId, sub] of Object.entries(copy)) {
        copy[subId] = {
          ...sub,
          documents: sub.documents.map(d => {
            if (typeof docOrId === 'string') {
              if (d.id === docOrId && updates) {
                return {
                  ...d,
                  classification: {
                    ...d.classification,
                    documentType: updates.documentType || d.classification.documentType,
                    detectedLabel: updates.documentType
                      ? updates.documentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : d.classification.detectedLabel
                  },
                  extractedFields: {
                    ...d.extractedFields,
                    institution: updates.institution !== undefined ? updates.institution : d.extractedFields.institution,
                    accountSuffix: updates.accountSuffix !== undefined ? updates.accountSuffix : d.extractedFields.accountSuffix,
                    totalAmount: updates.totalAmount !== undefined ? updates.totalAmount : d.extractedFields.totalAmount
                  },
                  humanCorrection: {
                    ...d.humanCorrection,
                    documentType: updates.documentType,
                    accountSuffix: updates.accountSuffix,
                    correctedBy: session.name,
                    correctedAt: new Date().toISOString()
                  }
                };
              }
              return d;
            } else {
              return d.id === docOrId.id ? docOrId : d;
            }
          })
        };
      }
      return copy;
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setSubmissions(prev => {
      const copy = { ...prev };
      for (const [subId, sub] of Object.entries(copy)) {
        if (sub.documents.some(d => d.id === docId)) {
          copy[subId] = {
            ...sub,
            documents: sub.documents.filter(d => d.id !== docId)
          };
        }
      }
      return copy;
    });
    if (selectedDocId === docId) {
      setSelectedDocId(null);
    }
    setToastMessage({
      title: 'File Deleted',
      description: 'The document was removed from the client folder.'
    });
  };

  const handleDirectUploadFiles = async (files: File[]) => {
    if (!currentSubmission) return;
    const newDocs: ProcessedDocument[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isSpreadsheet = ['csv', 'tsv', 'xlsx', 'xls'].includes(ext);
      const isTxt = ['txt', 'json', 'log', 'md'].includes(ext);
      const fileUrl = URL.createObjectURL(file);
      let textContent = '';
      if (isSpreadsheet || isTxt) {
        try { textContent = await file.text(); } catch { textContent = ''; }
      }

      const lowerName = file.name.toLowerCase();
      let docType: DocumentClassificationType = 'unknown';
      let detectedLabel = 'Uploaded Document';
      let institution = 'Detected Provider';
      if (lowerName.includes('chase') || lowerName.includes('checking') || lowerName.includes('bank')) {
        docType = 'bank_statement';
        detectedLabel = 'Bank Statement';
        institution = 'JPMorgan Chase Bank';
      } else if (lowerName.includes('amex') || lowerName.includes('card') || lowerName.includes('credit')) {
        docType = 'card_statement';
        detectedLabel = 'Credit Card Statement';
        institution = 'American Express';
      } else if (lowerName.includes('payroll') || lowerName.includes('adp')) {
        docType = 'payroll_report';
        detectedLabel = 'Payroll Liability Summary';
        institution = 'ADP Workforce';
      } else if (lowerName.includes('invoice') || lowerName.includes('receipt') || lowerName.includes('bill')) {
        docType = 'vendor_invoice';
        detectedLabel = 'Vendor Invoice / Receipt';
      }

      const newDoc: ProcessedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        submissionId: currentSubmission.id,
        fileName: file.name,
        fileSize: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        fileHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
        fileType: file.type || `application/${ext}`,
        isVirusScanned: true,
        readabilityScore: 98,
        readabilityStatus: 'clear',
        fileUrl,
        fileBlob: file,
        textContent: textContent || undefined,
        extension: ext,
        classification: {
          documentType: docType,
          confidence: 96,
          confidenceLevel: 'high',
          detectedLabel
        },
        extractedFields: {
          institution,
          accountSuffix: Math.floor(1000 + Math.random() * 9000).toString(),
          periodStart: currentPeriod.startDate || 'Oct 01, 2026',
          periodEnd: currentPeriod.endDate || 'Oct 31, 2026',
          totalAmount: `$${(Math.random() * 15000 + 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          statementDate: currentPeriod.endDate || 'Oct 31, 2026',
          pageCount: 1
        },
        reviewStatus: 'accepted',
        mockPageContent: textContent || `Extracted text from ${file.name}`
      };
      newDocs.push(newDoc);
    }

    setSubmissions(prev => {
      const copy = { ...prev };
      const cur = copy[currentSubmission.id];
      if (cur) {
        copy[currentSubmission.id] = {
          ...cur,
          documents: [...cur.documents, ...newDocs]
        };
      }
      return copy;
    });

    setToastMessage({
      title: `${newDocs.length} File${newDocs.length > 1 ? 's' : ''} Uploaded`,
      description: `Added to ${currentClient.name} (${currentPeriod.label}). Click any file to view.`
    });
  };

  const handleResolveFinding = (findingId: string) => {
    setSubmissions(prev => {
      const copy = { ...prev };
      for (const [subId, sub] of Object.entries(copy)) {
        if (sub.findings?.some(f => f.id === findingId)) {
          copy[subId] = {
            ...sub,
            findings: sub.findings.map(f =>
              f.id === findingId ? { ...f, resolution: 'resolved' as const } : f
            )
          };
        }
      }
      return copy;
    });
  };

  const handleActivateClient = (cId: string) => {
    setClients(prev =>
      prev.map(c => (c.id === cId ? { ...c, status: 'active' as const } : c))
    );
    setToastMessage({
      title: 'Client Activated',
      description: 'Client profile verified and active in firm directory.'
    });
  };

  const handleUpdateClientIdentityDoc = (
    cId: string,
    idDoc: IdentityDocument
  ) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id === cId && c.complianceRecord) {
          return {
            ...c,
            complianceRecord: {
              ...c.complianceRecord,
              identityDocument: idDoc,
              identityVerified: idDoc.verificationStatus === 'verified'
            }
          };
        }
        return c;
      })
    );
  };

  const handleClientOnboarded = (data: {
    client: Client;
    accounts: ClientAccount[];
    checklist: ChecklistTemplate;
    period: Period;
  }) => {
    setClients(prev => [data.client, ...prev]);
    setClientAccounts(prev => [...data.accounts, ...prev]);
    setChecklists(prev => [data.checklist, ...prev]);
    setPeriods(prev => [data.period, ...prev]);

    setSelectedClientId(data.client.id);
    setSelectedPeriodId(data.period.id);
    setSelectedDocId(null);
    setStep1Tab('files');

    setToastMessage({
      title: `Onboarded: ${data.client.name}`,
      description: 'Client profile and expected checklist initialized.'
    });
  };

  // ----------------------------------------------------
  // HANDLERS: STEP 2 ACTIONS & THE CRITICAL POSTING BRIDGE
  // ----------------------------------------------------
  const handleToggleSelectTxn = (id: string) => {
    setSelectedTxnIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllTxns = () => {
    if (selectedTxnIds.length === transactions.length) {
      setSelectedTxnIds([]);
    } else {
      setSelectedTxnIds(transactions.map(t => t.id));
    }
  };

  const handleBatchNormalize = () => {
    setTransactions(prev =>
      prev.map(t => {
        if (selectedTxnIds.includes(t.id)) {
          return {
            ...t,
            isNormalized: true,
            status: t.status === 'extracted' ? 'validated' : t.status
          };
        }
        return t;
      })
    );
    setSelectedTxnIds([]);
  };

  const handleBatchMatch = () => {
    setTransactions(prev =>
      prev.map(t => {
        if (selectedTxnIds.includes(t.id) && t.matching.confidence >= 90) {
          return {
            ...t,
            status:
              t.status === 'validated' || t.status === 'extracted'
                ? 'matched'
                : t.status
          };
        }
        return t;
      })
    );
    setSelectedTxnIds([]);
  };

  // --- THE CORE INTEGRATION: Post Approved Transactions to Ledgerline General Ledger ---
  const handleBatchPostToLedger = () => {
    const txnsToPost = transactions.filter(
      t => selectedTxnIds.includes(t.id) && t.status !== 'posted'
    );

    if (txnsToPost.length === 0) {
      alert('Please select transactions that are not already posted');
      return;
    }

    try {
      const result = ledgerEngine.postBatchFromAIWorkbench(txnsToPost);
      refreshLedger();

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
      setTransactions(prev =>
        prev.map(t => {
          if (selectedTxnIds.includes(t.id)) {
            return {
              ...t,
              status: 'posted' as const,
              postedAt: timestamp
            };
          }
          return t;
        })
      );

      setSelectedTxnIds([]);

      setToastMessage({
        title: `Posted ${result.postedCount} Transactions to Ledger`,
        description: `Successfully posted ${formatMoney(
          result.totalAmount
        )} to General Journal. Debit/credit balance verified.`,
        actionLabel: 'View in General Journal',
        onAction: () => {
          setCurrentStep('step3_ledgerline');
          setStep3Tab('journal');
        }
      });
    } catch (err: any) {
      alert(`Ledger posting error: ${err.message}`);
    }
  };

  // ----------------------------------------------------
  // HANDLERS: STEP 3 LEDGERLINE ACTIONS
  // ----------------------------------------------------
  const handleAddInvoice = (
    contact: string,
    date: string,
    due: string,
    lines: InvoiceLine[]
  ) => {
    try {
      const inv = ledgerEngine.addInvoice(contact, date, due, lines);
      refreshLedger();
      setToastMessage({
        title: `Invoice #${inv.no} Created`,
        description: `Posted Dr Accounts Receivable (1100) ${formatMoney(
          inv.total
        )}, Cr Revenue.`
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRecordPayment = (no: number) => {
    try {
      ledgerEngine.recordPayment(no);
      refreshLedger();
      setToastMessage({
        title: `Payment Recorded for Invoice #${no}`,
        description: 'Debited Operating Bank (1000) and Credited Accounts Receivable (1100).'
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreditNote = (no: number) => {
    try {
      ledgerEngine.issueCreditNote(no);
      refreshLedger();
      setToastMessage({
        title: `Credit Note Issued for Invoice #${no}`,
        description: 'Customer balance adjusted and revenue debited accordingly.'
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddBill = (
    supplier: string,
    date: string,
    due: string,
    category: string,
    amount: number,
    taxRate: number
  ) => {
    try {
      const b = ledgerEngine.addBill(supplier, date, due, category, amount, taxRate);
      refreshLedger();
      setToastMessage({
        title: `Bill ${b.no} Approved`,
        description: `Debited Expense Account ${category} and Credited Accounts Payable (2000) for ${formatMoney(
          b.total
        )}.`
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePayBill = (billNo: string) => {
    try {
      ledgerEngine.payBill(billNo);
      refreshLedger();
      setToastMessage({
        title: `Bill ${billNo} Paid`,
        description: 'Debited Accounts Payable (2000) and Credited Operating Bank (1000).'
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddExpense = (
    description: string,
    category: string,
    amount: number
  ) => {
    try {
      ledgerEngine.addExpense(description, category, amount);
      refreshLedger();
      setToastMessage({
        title: 'Expense Recorded',
        description: `Debited ${category} and Credited Operating Bank (1000) for ${formatMoney(
          amount
        )}.`
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMatchBankLine = (bankId: number, jeId: number) => {
    try {
      ledgerEngine.matchBankLine(bankId, jeId);
      refreshLedger();
      setToastMessage({
        title: 'Bank Line Reconciled',
        description: 'Statement line matched with verified journal entry.'
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCodeBankLine = (bankId: number, accountCode: string) => {
    try {
      ledgerEngine.codeBankLine(bankId, accountCode);
      refreshLedger();
      setToastMessage({
        title: 'Statement Line Coded & Reconciled',
        description: `Posted balanced entry to account ${accountCode} and reconciled.`
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddAccount = (code: string, name: string, type: AccountType) => {
    ledgerEngine.accounts.push({ code, name, type });
    refreshLedger();
    setToastMessage({
      title: `Account Added: ${code}`,
      description: `${name} (${type.toUpperCase()}) added to Chart of Accounts.`
    });
  };

  const handlePostManualJournal = (
    date: string,
    memo: string,
    drAccount: string,
    crAccount: string,
    amount: number
  ) => {
    ledgerEngine.postJournalEntry(
      date,
      memo,
      [
        { a: drAccount, dr: amount },
        { a: crAccount, cr: amount }
      ],
      'manual'
    );
    refreshLedger();
    setToastMessage({
      title: 'Manual Journal Entry Posted',
      description: `Balanced Debits & Credits (${formatMoney(
        amount
      )}) posted successfully.`
    });
  };

  const clientsList = clients.map(c => ({ id: c.id, name: c.name }));

  return (
    <div className="min-h-screen flex flex-col font-sans w-full max-w-full overflow-x-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* 1. SIMPLIFIED ROLE-BASED HEADER */}
      <SimplifiedHeader
        session={session}
        onLogout={() => setSession(null)}
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        step1Tab={step1Tab}
        onSelectStep1Tab={setStep1Tab}
        step2Tab={step2Tab}
        onSelectStep2Tab={setStep2Tab}
        step3Tab={step3Tab}
        onSelectStep3Tab={setStep3Tab}
        attentionCount={attentionCount}
        pendingOnboardingCount={pendingOnboardingCount}
        exceptionsCount={step2ExceptionCount}
        bankBalance={financialSummary.bankBalance}
        unreconciledCount={financialSummary.unreconciledBankCount}
        selectedClientName={selectedClientId}
        clientsList={clientsList}
        onSelectClient={setSelectedClientId}
      />

      {/* 2. NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md p-4 flex items-start justify-between gap-3 animate-fade-in-up"
             style={{
               background: 'var(--bg-elevated)',
               border: '1px solid var(--border-accent)',
               borderRadius: 'var(--radius-xl)',
               boxShadow: 'var(--shadow-xl), var(--shadow-glow)',
             }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                 style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)' }}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {toastMessage.title}
              </h4>
              <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {toastMessage.description}
              </p>
              {toastMessage.actionLabel && toastMessage.onAction && (
                <button
                  onClick={() => {
                    toastMessage.onAction?.();
                    setToastMessage(null);
                  }}
                  className="mt-2 text-[12px] font-semibold flex items-center gap-1"
                  style={{ color: 'var(--accent-primary-hover)', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  {toastMessage.actionLabel} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. WORKSPACE VIEWPORT */}
      <main className="flex-1 flex overflow-hidden w-full">
        {/* ============================================================ */}
        {/* SPECIAL VIEW: CLIENT PORTAL ONLY                             */}
        {/* ============================================================ */}
        {session.role === 'client' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-5xl mx-auto">
            <ClientPortalView
              client={currentClient}
              period={currentPeriod}
              checklist={currentChecklist}
              submission={currentSubmission}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* TIMELINE 1: INTAKE & ONBOARDING (For Intake Staff & Admin)    */}
        {/* ============================================================ */}
        {session.role !== 'client' && currentStep === 'step1_intake' && (
          <div className="flex-1 flex overflow-hidden w-full">
            {step1Tab === 'files' && (
              <div className="flex-1 flex overflow-hidden w-full">
                <ClientFolderTree
                  clients={clients}
                  periods={periods}
                  submissions={submissions}
                  selectedClientId={selectedClientId}
                  selectedPeriodId={selectedPeriodId}
                  onSelectFolder={handleSelectFolder}
                  activeSpecialView="files"
                  onSelectSpecialView={v => {
                    if (v === 'attention') setStep1Tab('attention');
                    if (v === 'checklists') setStep1Tab('checklists');
                    if (v === 'portal') setStep1Tab('portal');
                    if (v === 'onboarding') setStep1Tab('onboarding');
                  }}
                  onNewClientClick={() => setStep1Tab('onboard_new')}
                />

                <FileExplorer
                  client={currentClient}
                  period={currentPeriod}
                  submission={currentSubmission}
                  checklist={currentChecklist}
                  selectedDocId={selectedDocId}
                  onSelectDocument={id => {
                    setSelectedDocId(id);
                    setIsInspectorOpen(true);
                  }}
                  onOpenUploadModal={() => setIsUploadModalOpen(true)}
                  onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
                  isInspectorOpen={isInspectorOpen}
                  onUploadFiles={handleDirectUploadFiles}
                  onDeleteDocument={handleDeleteDocument}
                  onUpdateDocument={handleUpdateDocument}
                />

                {isInspectorOpen && currentDocument && (
                  <FileInspector
                    document={currentDocument}
                    onClose={() => setIsInspectorOpen(false)}
                    onUpdateDocument={handleUpdateDocument}
                    onDeleteDocument={handleDeleteDocument}
                    onViewDocument={doc => setViewingDocument(doc)}
                  />
                )}
              </div>
            )}

            {step1Tab === 'onboarding' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <OnboardingQueueView
                  clients={clients}
                  onOpenOnboardingModal={() => setStep1Tab('onboard_new')}
                  onSelectClientFolder={cId => {
                    setSelectedClientId(cId);
                    const p =
                      periods.find(per => per.clientId === cId) || periods[0];
                    setSelectedPeriodId(p.id);
                    setStep1Tab('files');
                  }}
                  onActivateClient={handleActivateClient}
                  onUpdateClientIdentity={handleUpdateClientIdentityDoc}
                />
              </div>
            )}

            {step1Tab === 'onboard_new' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
                <OnboardingPage
                  onClose={() => setStep1Tab('onboarding')}
                  onComplete={handleClientOnboarded}
                />
              </div>
            )}

            {step1Tab === 'attention' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <AttentionView
                  submissions={submissions}
                  clients={clients}
                  onSelectDocument={(docId, cId, pId) => {
                    setSelectedClientId(cId);
                    setSelectedPeriodId(pId);
                    setSelectedDocId(docId);
                    setIsInspectorOpen(true);
                    setStep1Tab('files');
                  }}
                  onResolveFinding={handleResolveFinding}
                  onOpenEmailModal={(c, item) => {
                    alert(`Drafting missing document email for ${c.name}: ${item}`);
                  }}
                />
              </div>
            )}

            {step1Tab === 'checklists' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <ChecklistManager
                  clients={clients}
                  checklists={checklists}
                  clientAccounts={clientAccounts}
                  proposals={proposals}
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                  onUpdateChecklist={updatedChk => {
                    setChecklists(prev =>
                      prev.map(c => (c.id === updatedChk.id ? updatedChk : c))
                    );
                  }}
                  onApproveProposal={propId => {
                    setProposals(prev =>
                      prev.map(p =>
                        p.id === propId ? { ...p, status: 'approved' as const } : p
                      )
                    );
                  }}
                  onRejectProposal={propId => {
                    setProposals(prev =>
                      prev.map(p =>
                        p.id === propId ? { ...p, status: 'rejected' as const } : p
                      )
                    );
                  }}
                />
              </div>
            )}

            {step1Tab === 'portal' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <ClientPortalView
                  client={currentClient}
                  period={currentPeriod}
                  checklist={currentChecklist}
                  submission={currentSubmission}
                />
              </div>
            )}

            {step1Tab === 'cases' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <CasesDashboard
                  cases={cases}
                  onSelectCase={c => setSelectedCaseId(c.id)}
                />
              </div>
            )}

            {step1Tab === 'simulator' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <PipelineSimulator
                  clients={clients}
                  periods={periods}
                  checklists={checklists}
                />
              </div>
            )}

            {step1Tab === 'audit' && (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
                <AuditTrailView events={auditLog} />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TIMELINE 2: AI TRANSACTION PROCESSING WORKBENCH              */}
        {/* ============================================================ */}
        {session.role !== 'client' && currentStep === 'step2_processing' && (
          <div className="flex-1 overflow-y-auto w-full">
            <ClientContextBar
              selectedClient={currentProfile}
              setSelectedClient={c => setSelectedClientId(c.id)}
              currentRole={currentRole}
              setCurrentRole={setCurrentRole}
            />

            {step2Tab === 'workbench' && (
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
                <WorkflowStepper
                  transactions={transactions}
                  selectedStep={selectedWorkflowStep}
                  onSelectStep={setSelectedWorkflowStep}
                />

                <EfficiencyMetrics transactions={transactions} />

                <TransactionTable
                  transactions={transactions}
                  selectedTxnIds={selectedTxnIds}
                  selectedIds={selectedTxnIds}
                  onToggleSelect={handleToggleSelectTxn}
                  onSelectAll={handleSelectAllTxns}
                  onOpenDrawer={txn => setActiveDrawerTxn(txn)}
                  currentFilter={currentTxnFilter}
                  setCurrentFilter={setCurrentTxnFilter}
                  onFilterChange={setCurrentTxnFilter}
                />

                <BatchActionsBar
                  selectedCount={selectedTxnIds.length}
                  onNormalize={handleBatchNormalize}
                  onAutoMatch={handleBatchMatch}
                  onPostLedger={handleBatchPostToLedger}
                />
              </div>
            )}

            {step2Tab === 'engine' && (
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6">
                <EngineDashboard
                  client={currentProfile}
                  transactions={transactions}
                  onOpenContextInspector={ctx => setActiveInspectedContext(ctx)}
                  onOpenBenchmark={() => setIsBenchmarkOpen(true)}
                />
              </div>
            )}

            {step2Tab === 'pipeline' && (
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6">
                <PipelineWalkthroughView transactions={transactions} />
              </div>
            )}

            {step2Tab === 'exceptions' && (
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6">
                <ExceptionsQueue
                  transactions={transactions}
                  onOpenDrawer={txn => setActiveDrawerTxn(txn)}
                />
              </div>
            )}

            {step2Tab === 'audit' && (
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6">
                <GeneralLedgerView transactions={transactions} />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TIMELINE 3: ACCOUNTING CORE (QUICKBOOKS / XERO REPLACEMENT)   */}
        {/* ============================================================ */}
        {session.role !== 'client' && currentStep === 'step3_ledgerline' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full max-w-[1700px] mx-auto">
            {step3Tab === 'dashboard' && (
              <AccountingDashboard
                summary={financialSummary}
                onNavigateTab={tab => setStep3Tab(tab as Step3SubTab)}
                lockDate={ledgerEngine.lockDate}
              />
            )}

            {step3Tab === 'invoices' && (
              <InvoicesView
                invoices={invoicesList}
                onAddInvoice={handleAddInvoice}
                onRecordPayment={handleRecordPayment}
                onCreditNote={handleCreditNote}
              />
            )}

            {step3Tab === 'bills' && (
              <BillsView
                bills={billsList}
                accounts={accountsList}
                onAddBill={handleAddBill}
                onPayBill={handlePayBill}
              />
            )}

            {step3Tab === 'expenses' && (
              <ExpensesView
                journalEntries={journalEntries}
                accounts={accountsList}
                onAddExpense={handleAddExpense}
              />
            )}

            {step3Tab === 'bank' && (
              <BankReconciliationView
                bankStatements={bankStatementsList}
                journalEntries={journalEntries}
                accounts={accountsList}
                bankBalance={financialSummary.bankBalance}
                onMatchLine={handleMatchBankLine}
                onCodeLine={handleCodeBankLine}
              />
            )}

            {step3Tab === 'accounts' && (
              <ChartOfAccountsView
                accounts={accountsList}
                getAccountBalance={code => ledgerEngine.getAccountBalance(code)}
                onAddAccount={handleAddAccount}
              />
            )}

            {step3Tab === 'journal' && (
              <GeneralJournalView
                journalEntries={journalEntries}
                accounts={accountsList}
                lockDate={ledgerEngine.lockDate}
                onPostManualJournal={handlePostManualJournal}
                onSetLockDate={d => {
                  ledgerEngine.lockDate = d;
                  refreshLedger();
                }}
              />
            )}

            {step3Tab === 'contacts' && (
              <ContactsView
                contacts={contactsList}
                onSelectContact={name => alert(`Filter transactions for ${name}`)}
              />
            )}

            {step3Tab === 'reports' && (
              <FinancialReportsView
                accounts={accountsList}
                getAccountBalance={code => ledgerEngine.getAccountBalance(code)}
                getSumByType={type => ledgerEngine.getSumByType(type)}
                agedReceivables={agedReceivables}
                agedPayables={agedPayables}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. MODALS & DRAWERS */}
      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          client={currentClient}
          period={currentPeriod}
          onUploadComplete={newDocs => {
            setSubmissions(prev => {
              const copy = { ...prev };
              const currentSub = copy[currentSubmission.id];
              if (currentSub) {
                copy[currentSubmission.id] = {
                  ...currentSub,
                  documents: [...currentSub.documents, ...newDocs]
                };
              }
              return copy;
            });
            setIsUploadModalOpen(false);
            setToastMessage({
              title: `${newDocs.length} Documents Ingested`,
              description: 'AI processing pipeline triggered. Validating checksums and OCR.'
            });
          }}
        />
      )}

      {viewingDocument && (
        <DocumentViewerModal
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
          onUpdateDocument={handleUpdateDocument}
          onDeleteDocument={docId => {
            handleDeleteDocument(docId);
            setViewingDocument(null);
          }}
        />
      )}

      {selectedCaseId && (
        <CaseDetailDrawer
          caseTask={cases.find(c => c.id === selectedCaseId) || cases[0]}
          onClose={() => setSelectedCaseId(null)}
        />
      )}

      {activeDrawerTxn && (
        <TransactionDrawer
          transaction={activeDrawerTxn}
          onClose={() => setActiveDrawerTxn(null)}
          onUpdate={updatedTxn => {
            setTransactions(prev =>
              prev.map(t => (t.id === updatedTxn.id ? updatedTxn : t))
            );
            setActiveDrawerTxn(updatedTxn);
          }}
          onResolveFlag={(tId, flagId) => {
            setTransactions(prev =>
              prev.map(t => {
                if (t.id === tId) {
                  return {
                    ...t,
                    validationFlags: t.validationFlags.map(f =>
                      f.id === flagId ? { ...f, resolved: true } : f
                    )
                  };
                }
                return t;
              })
            );
          }}
          onOpenContext={ctx => setActiveInspectedContext(ctx)}
        />
      )}

      {activeInspectedContext && (
        <ContextWindowInspectorModal
          context={activeInspectedContext}
          onClose={() => setActiveInspectedContext(null)}
        />
      )}

      {isBenchmarkOpen && (
        <BenchmarkModal onClose={() => setIsBenchmarkOpen(false)} />
      )}

      {isCoaModalOpen && (
        <ChartOfAccountsModal onClose={() => setIsCoaModalOpen(false)} />
      )}

      {isExportOpen && (
        <ExportModal
          transactions={transactions}
          client={currentProfile}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
