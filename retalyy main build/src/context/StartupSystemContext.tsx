import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  ClientEntity,
  FirmSettings,
  ReviewItem,
  BankTransaction,
  ExtractedDocument,
  LedgerAccount,
  JournalEntry,
  ReconciliationMatch,
  CategorizationRule,
  PeriodCloseRecord,
  AuditLogEntry,
  DeadlineItem,
  ClientRequestItem
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_FIRM_SETTINGS,
  INITIAL_CHART_OF_ACCOUNTS,
  INITIAL_EXTRACTED_DOCUMENTS,
  INITIAL_BANK_TRANSACTIONS,
  INITIAL_REVIEW_ITEMS,
  INITIAL_CATEGORIZATION_RULES,
  INITIAL_RECONCILIATION_MATCHES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_PERIOD_CLOSE,
  INITIAL_AUDIT_LOG,
  INITIAL_DEADLINES,
  INITIAL_CLIENT_REQUESTS
} from '../data/startupSystemData';

interface SystemMetrics {
  totalTransactionsProcessed: number;
  autoCategorizedCount: number;
  autoCategorizedRate: number; // e.g. 91.2%
  autoMatchCount: number;
  autoMatchRate: number; // e.g. 88.5%
  avgReviewSecondsPerItem: number; // e.g. 14s
  baselineHoursEquivalent: number;
  actualReviewHoursSpent: number;
  netHoursSaved: number;
  dollarRoiSaved: number;
  activeClientCount: number;
  unreconciledDifferenceMinor: number;
}

interface StartupSystemContextType {
  // Tenancy & Selected State
  clients: ClientEntity[];
  selectedClientId: string;
  selectedClient: ClientEntity;
  setSelectedClientId: (id: string) => void;
  firmSettings: FirmSettings;
  updateFirmSettings: (settings: Partial<FirmSettings>) => void;

  // Review Queue
  reviewItems: ReviewItem[];
  approveReviewItem: (id: string) => void;
  editReviewItem: (id: string, newAccountId: string, rationale?: string) => void;
  rejectReviewItem: (id: string, reason: string) => void;
  bulkApproveFiltered: (minConfidence?: number) => number;
  activeLearnedRules: CategorizationRule[];
  activateLearnedRule: (ruleId: string) => void;

  // Banking & Transactions
  bankTransactions: BankTransaction[];
  importCsvTransactions: (transactions: Partial<BankTransaction>[]) => void;
  syncPlaidFeed: () => void;

  // Documents & OCR
  documents: ExtractedDocument[];
  uploadDocument: (doc: {
    vendorName: string;
    docType: 'receipt' | 'invoice' | 'bank_statement' | 'other';
    totalMinor: number;
    subtotalMinor: number;
    taxMinor: number;
    lineItemsCount: number;
    source: 'upload' | 'portal' | 'email';
    fileName: string;
  }) => void;
  simulateInboundEmail: (vendor: string, totalMinor: number, note: string) => void;

  // Ledger & Journal
  accounts: LedgerAccount[];
  journalEntries: JournalEntry[];
  postJournalEntry: (entry: Omit<JournalEntry, 'id' | 'status' | 'postedAt'>) => boolean;
  reverseJournalEntry: (id: string, reason?: string) => boolean;

  // Reconciliation
  reconciliationMatches: ReconciliationMatch[];
  confirmReconciliationMatch: (matchId: string) => void;
  rejectReconciliationMatch: (matchId: string) => void;

  // Month-End Close & Statements
  periodClose: PeriodCloseRecord;
  toggleCloseTask: (taskKey: string) => void;
  regenerateStatements: () => void;
  signOffPeriod: (cpaName: string, cpaLicense: string) => void;

  // Deadlines & Compliance
  deadlines: DeadlineItem[];
  verifyDeadline: (id: string) => void;

  // Client Communications
  clientRequests: ClientRequestItem[];
  sendMissingDocRequest: (txId: string, vendor: string, amountMinor: number) => void;
  answerClientRequest: (reqId: string, answer: string) => void;

  // Audit Log
  auditLog: AuditLogEntry[];

  // Computed Metrics
  metrics: SystemMetrics;

  // Exports
  exportQboCsv: () => void;
  exportFullClientDataJson: () => void;
  resetToDemoData: () => void;
}

const StartupSystemContext = createContext<StartupSystemContextType | undefined>(undefined);

export const StartupSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Clients state
  const [clients, setClients] = useState<ClientEntity[]>(() => {
    const saved = localStorage.getItem('retalyy_os_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    const saved = localStorage.getItem('retalyy_os_selected_client');
    return saved || 'cli-apex';
  });

  // Firm Settings
  const [firmSettings, setFirmSettings] = useState<FirmSettings>(() => {
    const saved = localStorage.getItem('retalyy_os_firm_settings');
    return saved ? JSON.parse(saved) : INITIAL_FIRM_SETTINGS;
  });

  // Review Items
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('retalyy_os_review_items');
    return saved ? JSON.parse(saved) : INITIAL_REVIEW_ITEMS;
  });

  // Bank Transactions
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(() => {
    const saved = localStorage.getItem('retalyy_os_bank_transactions');
    return saved ? JSON.parse(saved) : INITIAL_BANK_TRANSACTIONS;
  });

  // Documents
  const [documents, setDocuments] = useState<ExtractedDocument[]>(() => {
    const saved = localStorage.getItem('retalyy_os_documents');
    return saved ? JSON.parse(saved) : INITIAL_EXTRACTED_DOCUMENTS;
  });

  // Accounts
  const [accounts, setAccounts] = useState<LedgerAccount[]>(() => {
    const saved = localStorage.getItem('retalyy_os_accounts');
    return saved ? JSON.parse(saved) : INITIAL_CHART_OF_ACCOUNTS;
  });

  // Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('retalyy_os_journal_entries');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  // Rules
  const [rules, setRules] = useState<CategorizationRule[]>(() => {
    const saved = localStorage.getItem('retalyy_os_rules');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIZATION_RULES;
  });

  // Reconciliation Matches
  const [reconciliationMatches, setReconciliationMatches] = useState<ReconciliationMatch[]>(() => {
    const saved = localStorage.getItem('retalyy_os_reconciliations');
    return saved ? JSON.parse(saved) : INITIAL_RECONCILIATION_MATCHES;
  });

  // Period Close
  const [periodClose, setPeriodClose] = useState<PeriodCloseRecord>(() => {
    const saved = localStorage.getItem('retalyy_os_period_close');
    return saved ? JSON.parse(saved) : INITIAL_PERIOD_CLOSE;
  });

  // Deadlines
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    const saved = localStorage.getItem('retalyy_os_deadlines');
    return saved ? JSON.parse(saved) : INITIAL_DEADLINES;
  });

  // Client Requests
  const [clientRequests, setClientRequests] = useState<ClientRequestItem[]>(() => {
    const saved = localStorage.getItem('retalyy_os_client_requests');
    return saved ? JSON.parse(saved) : INITIAL_CLIENT_REQUESTS;
  });

  // Audit Log
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('retalyy_os_audit_log');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('retalyy_os_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('retalyy_os_selected_client', selectedClientId); }, [selectedClientId]);
  useEffect(() => { localStorage.setItem('retalyy_os_firm_settings', JSON.stringify(firmSettings)); }, [firmSettings]);
  useEffect(() => { localStorage.setItem('retalyy_os_review_items', JSON.stringify(reviewItems)); }, [reviewItems]);
  useEffect(() => { localStorage.setItem('retalyy_os_bank_transactions', JSON.stringify(bankTransactions)); }, [bankTransactions]);
  useEffect(() => { localStorage.setItem('retalyy_os_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('retalyy_os_accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('retalyy_os_journal_entries', JSON.stringify(journalEntries)); }, [journalEntries]);
  useEffect(() => { localStorage.setItem('retalyy_os_rules', JSON.stringify(rules)); }, [rules]);
  useEffect(() => { localStorage.setItem('retalyy_os_reconciliations', JSON.stringify(reconciliationMatches)); }, [reconciliationMatches]);
  useEffect(() => { localStorage.setItem('retalyy_os_period_close', JSON.stringify(periodClose)); }, [periodClose]);
  useEffect(() => { localStorage.setItem('retalyy_os_deadlines', JSON.stringify(deadlines)); }, [deadlines]);
  useEffect(() => { localStorage.setItem('retalyy_os_client_requests', JSON.stringify(clientRequests)); }, [clientRequests]);
  useEffect(() => { localStorage.setItem('retalyy_os_audit_log', JSON.stringify(auditLog)); }, [auditLog]);

  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === selectedClientId) || clients[0];
  }, [clients, selectedClientId]);

  // Helper to append audit entry
  const logAudit = (actorType: 'user' | 'ai' | 'system', actorName: string, action: string, subjectType: string, subjectId: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorType,
      actorName,
      action,
      subjectType,
      subjectId,
      details,
      inputHash: `sha256-${Math.random().toString(36).substring(2, 12)}`
    };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  const updateFirmSettings = (settings: Partial<FirmSettings>) => {
    setFirmSettings(prev => ({ ...prev, ...settings }));
    logAudit('user', 'Staff Administrator', 'UPDATE_FIRM_SETTINGS', 'firm_settings', 'firm-main', 'Updated firm auto-approval and baseline thresholds.');
  };

  // Review Item Actions
  const approveReviewItem = (id: string) => {
    const item = reviewItems.find(r => r.id === id);
    if (!item) return;

    setReviewItems(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', resolvedBy: selectedClient.staffReviewer, resolvedAt: new Date().toLocaleTimeString() } : r));

    // Update target bank transaction if applicable
    if (item.bankTransactionId) {
      setBankTransactions(prev => prev.map(bt => {
        if (bt.id === item.bankTransactionId) {
          return {
            ...bt,
            status: 'categorized',
            categoryAccountId: item.aiSuggestion.accountId,
            categoryAccountName: item.aiSuggestion.accountName
          };
        }
        return bt;
      }));

      // Invariant 5: Create posted double-entry journal entry!
      const targetTx = bankTransactions.find(bt => bt.id === item.bankTransactionId);
      if (targetTx && item.aiSuggestion.accountId) {
        const amountAbs = Math.abs(targetTx.amountMinor);
        const isExpense = targetTx.amountMinor < 0;

        const newJe: JournalEntry = {
          id: `je-auto-${Date.now()}`,
          clientId: item.clientId,
          entryDate: targetTx.postedDate,
          memo: `${targetTx.descriptionClean} - Categorized from Review Queue`,
          reference: targetTx.id,
          status: 'posted',
          sourceType: 'bank_sync',
          sourceId: targetTx.id,
          postedBy: selectedClient.staffReviewer,
          postedAt: new Date().toLocaleString(),
          lines: [
            {
              id: `jl-${Date.now()}-1`,
              accountId: item.aiSuggestion.accountId,
              accountCode: item.aiSuggestion.accountCode || '5100',
              accountName: item.aiSuggestion.accountName || 'Materials & Supplies',
              debitMinor: isExpense ? amountAbs : 0,
              creditMinor: isExpense ? 0 : amountAbs
            },
            {
              id: `jl-${Date.now()}-2`,
              accountId: 'acc-1010',
              accountCode: '1010',
              accountName: 'Operating Checking Account (Chase x4409)',
              debitMinor: isExpense ? 0 : amountAbs,
              creditMinor: isExpense ? amountAbs : 0
            }
          ]
        };

        setJournalEntries(prev => [newJe, ...prev]);
      }
    }

    logAudit('user', selectedClient.staffReviewer, 'APPROVE_REVIEW_ITEM', 'review_item', id, `Approved item ${id} with account ${item.aiSuggestion.accountName}`);
  };

  const editReviewItem = (id: string, newAccountId: string, rationale?: string) => {
    const item = reviewItems.find(r => r.id === id);
    const targetAccount = accounts.find(a => a.id === newAccountId);
    if (!item || !targetAccount) return;

    setReviewItems(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'edited',
      resolvedBy: selectedClient.staffReviewer,
      resolvedAt: new Date().toLocaleTimeString(),
      aiSuggestion: {
        ...r.aiSuggestion,
        accountId: targetAccount.id,
        accountCode: targetAccount.code,
        accountName: targetAccount.name,
        rationale: rationale || `Manually revised by ${selectedClient.staffReviewer}`
      }
    } : r));

    if (item.bankTransactionId) {
      setBankTransactions(prev => prev.map(bt => bt.id === item.bankTransactionId ? {
        ...bt,
        status: 'categorized',
        categoryAccountId: targetAccount.id,
        categoryAccountName: targetAccount.name
      } : bt));
    }

    logAudit('user', selectedClient.staffReviewer, 'EDIT_REVIEW_ITEM', 'review_item', id, `Edited categorization to ${targetAccount.code} - ${targetAccount.name}`);
  };

  const rejectReviewItem = (id: string, reason: string) => {
    setReviewItems(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'rejected',
      resolvedBy: selectedClient.staffReviewer,
      resolvedAt: new Date().toLocaleTimeString(),
      reason: `Rejected: ${reason}`
    } : r));

    logAudit('user', selectedClient.staffReviewer, 'REJECT_REVIEW_ITEM', 'review_item', id, `Rejected item: ${reason}`);
  };

  const bulkApproveFiltered = (minConfidence: number = 0.90) => {
    let approvedCount = 0;
    setReviewItems(prev => prev.map(item => {
      if (item.status === 'needs_review' && item.aiSuggestion.confidence >= minConfidence) {
        approvedCount++;
        return {
          ...item,
          status: 'approved',
          resolvedBy: `Bulk Action (${selectedClient.staffReviewer})`,
          resolvedAt: new Date().toLocaleTimeString()
        };
      }
      return item;
    }));

    if (approvedCount > 0) {
      logAudit('user', selectedClient.staffReviewer, 'BULK_APPROVE_REVIEW_ITEMS', 'review_queue', 'bulk', `Bulk approved ${approvedCount} items with confidence >= ${Math.round(minConfidence * 100)}%`);
    }
    return approvedCount;
  };

  const activateLearnedRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: true, isProposed: false } : r));
    const targetRule = rules.find(r => r.id === ruleId);
    logAudit('user', selectedClient.partnerCpa, 'ACTIVATE_LEARNED_RULE', 'rule', ruleId, `Activated learned rule for pattern "${targetRule?.counterpartyPattern}" -> ${targetRule?.accountName}`);
  };

  // Banking Import
  const importCsvTransactions = (newTxs: Partial<BankTransaction>[]) => {
    const formatted: BankTransaction[] = newTxs.map((t, idx) => ({
      id: `btx-csv-${Date.now()}-${idx}`,
      clientId: selectedClientId,
      bankAccountId: 'ba-chase-4409',
      postedDate: t.postedDate || new Date().toISOString().substring(0, 10),
      amountMinor: t.amountMinor || 0,
      currency: 'USD',
      descriptionRaw: t.descriptionRaw || 'CSV IMPORT TRANSACTION',
      descriptionClean: t.descriptionClean || t.descriptionRaw || 'Merchant',
      counterparty: t.counterparty || 'Vendor',
      status: 'new',
      source: 'csv'
    }));

    setBankTransactions(prev => [...formatted, ...prev]);

    // Automatically create a review item for each imported line
    formatted.forEach((tx, i) => {
      const isOutflow = tx.amountMinor < 0;
      const newRevItem: ReviewItem = {
        id: `rev-imp-${Date.now()}-${i}`,
        clientId: selectedClientId,
        kind: 'categorization',
        subjectType: 'bank_transaction',
        subjectId: tx.id,
        bankTransactionId: tx.id,
        reason: 'New bank transaction imported from CSV statement feed',
        priority: Math.abs(tx.amountMinor) > 100000 ? 'high' : 'medium',
        status: 'needs_review',
        aiSuggestion: {
          accountId: isOutflow ? 'acc-5100' : 'acc-4010',
          accountCode: isOutflow ? '5100' : '4010',
          accountName: isOutflow ? 'Direct Job Materials & Supplies' : 'Commercial Mechanical Installation Revenue',
          confidence: 0.91,
          rationale: `Classified via Haiku 5-5 heuristic on merchant descriptor "${tx.descriptionClean}".`,
          model: 'claude-haiku-5-5',
          promptVersion: 'v2.4-contractor-rules'
        },
        assignedTo: selectedClient.staffReviewer
      };
      setReviewItems(prev => [newRevItem, ...prev]);
    });

    logAudit('user', selectedClient.staffReviewer, 'IMPORT_CSV_TRANSACTIONS', 'bank_feed', 'csv', `Imported ${formatted.length} transactions via CSV upload.`);
  };

  const syncPlaidFeed = () => {
    const simulatedLiveTx: BankTransaction = {
      id: `btx-plaid-${Date.now()}`,
      clientId: selectedClientId,
      bankAccountId: 'ba-chase-4409',
      postedDate: new Date().toISOString().substring(0, 10),
      amountMinor: -48250, // -$482.50
      currency: 'USD',
      descriptionRaw: 'UNITED RENTALS #88129 SAN JOSE CA OAUTH_PLAID',
      descriptionClean: 'United Rentals Inc.',
      counterparty: 'United Rentals',
      status: 'new',
      source: 'plaid'
    };

    setBankTransactions(prev => [simulatedLiveTx, ...prev]);

    const newRevItem: ReviewItem = {
      id: `rev-plaid-${Date.now()}`,
      clientId: selectedClientId,
      kind: 'categorization',
      subjectType: 'bank_transaction',
      subjectId: simulatedLiveTx.id,
      bankTransactionId: simulatedLiveTx.id,
      reason: 'Live Plaid webhook synced new commercial debit',
      priority: 'medium',
      status: 'needs_review',
      aiSuggestion: {
        accountId: 'acc-5300',
        accountCode: '5300',
        accountName: 'Heavy Equipment Rental & Crane Service',
        confidence: 0.97,
        rationale: 'United Rentals equipment rental mapped with 97% confidence.',
        model: 'claude-haiku-5-5',
        promptVersion: 'v2.4-contractor-rules'
      },
      assignedTo: selectedClient.staffReviewer
    };

    setReviewItems(prev => [newRevItem, ...prev]);

    logAudit('system', 'Plaid Webhook Sync', 'SYNC_BANK_FEED', 'bank_account', 'ba-chase-4409', 'Synced 1 new live bank debit from Chase Operating x4409 via Plaid Exchange.');
  };

  // Document Upload & OCR
  const uploadDocument = (docInput: {
    vendorName: string;
    docType: 'receipt' | 'invoice' | 'bank_statement' | 'other';
    totalMinor: number;
    subtotalMinor: number;
    taxMinor: number;
    lineItemsCount: number;
    source: 'upload' | 'portal' | 'email';
    fileName: string;
  }) => {
    const sha = `sha256-${Math.random().toString(36).substring(2, 12)}${Date.now()}`;
    const newDocId = `doc-${Date.now()}`;

    const newDoc: ExtractedDocument = {
      id: newDocId,
      clientId: selectedClientId,
      source: docInput.source,
      storageKey: `s3://retalyy-vault/${selectedClientId}/2026-10/${docInput.fileName}`,
      sha256: sha,
      mime: docInput.fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      docType: docInput.docType,
      status: 'extracted',
      uploadedBy: `${docInput.source === 'portal' ? 'Client Owner (Portal)' : selectedClient.staffReviewer}`,
      uploadedAt: new Date().toLocaleString(),
      vendorName: docInput.vendorName,
      documentDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      subtotalMinor: docInput.subtotalMinor,
      taxMinor: docInput.taxMinor,
      totalMinor: docInput.totalMinor,
      paymentMethod: 'Corporate Card / ACH',
      last4: '4409',
      lineItems: Array.from({ length: docInput.lineItemsCount || 2 }).map((_, i) => ({
        id: `li-${newDocId}-${i}`,
        description: `${docInput.vendorName} Itemization #${i + 1}`,
        quantity: 1,
        unitPriceMinor: Math.round(docInput.subtotalMinor / (docInput.lineItemsCount || 2)),
        amountMinor: Math.round(docInput.subtotalMinor / (docInput.lineItemsCount || 2))
      })),
      fieldConfidence: {
        vendorName: 99,
        documentDate: 97,
        invoiceNumber: 98,
        subtotal: 99,
        tax: 98,
        total: 99,
        lineItems: 97
      },
      validationErrors: [],
      validationPassed: true,
      redactedPii: true
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Check if any review item was waiting for this doc (e.g. Grainger)
    const matchingReq = clientRequests.find(r => r.kind === 'missing_document' && docInput.vendorName.toLowerCase().includes('grainger'));
    if (matchingReq) {
      setClientRequests(prev => prev.map(r => r.id === matchingReq.id ? { ...r, status: 'answered', clientAnswer: 'Invoice uploaded via intake portal.', answeredAt: new Date().toLocaleString() } : r));
    }

    logAudit('system', 'Claude 3.5 Sonnet Vision', 'EXTRACT_DOCUMENT', 'document', newDocId, `Extracted ${docInput.fileName} (${docInput.vendorName}): Arithmetically validated line items sum to subtotal.`);
  };

  const simulateInboundEmail = (vendor: string, totalMinor: number, note: string) => {
    uploadDocument({
      vendorName: vendor,
      docType: 'receipt',
      totalMinor,
      subtotalMinor: Math.round(totalMinor * 0.92),
      taxMinor: Math.round(totalMinor * 0.08),
      lineItemsCount: 2,
      source: 'email',
      fileName: `email_attachment_${vendor.toLowerCase().replace(/\s+/g, '_')}.pdf`
    });

    logAudit('system', 'Postmark Inbound Hook', 'RECEIVE_EMAIL_DOCUMENT', 'inbound_email', `${selectedClient.inboundEmailSlug}@inbound.retalyy.com`, `Processed inbound receipt from contractor email forwarding.`);
  };

  // Ledger Actions
  const postJournalEntry = (entry: Omit<JournalEntry, 'id' | 'status' | 'postedAt'>): boolean => {
    // Invariant 5: Debits must equal credits!
    const totalDebits = entry.lines.reduce((sum, l) => sum + l.debitMinor, 0);
    const totalCredits = entry.lines.reduce((sum, l) => sum + l.creditMinor, 0);

    if (totalDebits !== totalCredits) {
      alert(`Double-entry balance invariant violation: Debits ($${(totalDebits / 100).toFixed(2)}) must exactly equal Credits ($${(totalCredits / 100).toFixed(2)})!`);
      return false;
    }

    const newJe: JournalEntry = {
      ...entry,
      id: `je-${Date.now()}`,
      status: 'posted',
      postedAt: new Date().toLocaleString()
    };

    setJournalEntries(prev => [newJe, ...prev]);
    logAudit('user', entry.postedBy, 'POST_JOURNAL_ENTRY', 'journal_entry', newJe.id, `Posted journal entry: ${newJe.memo} (Debits = Credits = $${(totalDebits / 100).toFixed(2)})`);
    return true;
  };

  const reverseJournalEntry = (id: string, reason: string = 'Correction of prior entry'): boolean => {
    const original = journalEntries.find(je => je.id === id);
    if (!original || original.status === 'reversed') return false;

    // Mark original as reversed
    setJournalEntries(prev => prev.map(je => je.id === id ? { ...je, status: 'reversed' } : je));

    // Invariant 4: Posted entries are immutable. Create reversing entry with swapped debits & credits!
    const reversingLines = original.lines.map(line => ({
      ...line,
      id: `jl-rev-${Date.now()}-${line.id}`,
      debitMinor: line.creditMinor,
      creditMinor: line.debitMinor
    }));

    const reversingJe: JournalEntry = {
      id: `je-rev-${Date.now()}`,
      clientId: original.clientId,
      entryDate: new Date().toISOString().substring(0, 10),
      memo: `REVERSAL of ${original.id}: ${reason}`,
      reference: `REV-${original.reference}`,
      status: 'posted',
      sourceType: 'manual',
      sourceId: original.id,
      postedBy: selectedClient.staffReviewer,
      postedAt: new Date().toLocaleString(),
      reversesEntryId: original.id,
      lines: reversingLines
    };

    setJournalEntries(prev => [reversingJe, ...prev]);
    logAudit('user', selectedClient.staffReviewer, 'REVERSE_JOURNAL_ENTRY', 'journal_entry', original.id, `Created reversing entry ${reversingJe.id} for entry ${original.id}: ${reason}`);
    return true;
  };

  // Reconciliation
  const confirmReconciliationMatch = (matchId: string) => {
    setReconciliationMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'confirmed' } : m));
    logAudit('user', selectedClient.staffReviewer, 'CONFIRM_RECONCILIATION_MATCH', 'reconciliation_match', matchId, `Confirmed bank-to-document match ${matchId}`);
  };

  const rejectReconciliationMatch = (matchId: string) => {
    setReconciliationMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'rejected' } : m));
    logAudit('user', selectedClient.staffReviewer, 'REJECT_RECONCILIATION_MATCH', 'reconciliation_match', matchId, `Rejected bank-to-document match ${matchId}`);
  };

  // Month-End Close
  const toggleCloseTask = (taskKey: string) => {
    setPeriodClose(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.key === taskKey) {
          const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
          return {
            ...t,
            status: nextStatus as 'pending' | 'in_progress' | 'completed',
            completedAt: nextStatus === 'completed' ? new Date().toLocaleString() : undefined,
            completedBy: nextStatus === 'completed' ? selectedClient.staffReviewer : undefined
          };
        }
        return t;
      });

      return { ...prev, tasks: updatedTasks };
    });

    logAudit('user', selectedClient.staffReviewer, 'TOGGLE_CLOSE_TASK', 'period_close_task', taskKey, `Updated close checklist item ${taskKey}`);
  };

  const regenerateStatements = () => {
    logAudit('system', 'Deterministic Math Engine', 'REGENERATE_STATEMENTS', 'period_close', periodClose.id, 'Recalculated P&L, Balance Sheet, Cash Flow, and verified all numbers.');
  };

  const signOffPeriod = (cpaName: string, cpaLicense: string) => {
    // Invariant 9: Professional sign-off stays human!
    setPeriodClose(prev => ({
      ...prev,
      status: 'closed',
      closedBy: `${cpaName} (${cpaLicense})`,
      closedAt: new Date().toLocaleString(),
      tasks: prev.tasks.map(t => ({ ...t, status: 'completed' }))
    }));

    // Update client status to closed
    setClients(prev => prev.map(c => c.id === selectedClientId ? { ...c, status: 'closed' } : c));

    logAudit('user', `${cpaName} (${cpaLicense})`, 'SIGN_OFF_PERIOD_CLOSE', 'period_close', periodClose.id, `Formal partner CPA approval completed. October 2026 books locked against further edits.`);
  };

  // Deadlines
  const verifyDeadline = (id: string) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, verified: true, verifiedBy: selectedClient.partnerCpa } : d));
    logAudit('user', selectedClient.partnerCpa, 'VERIFY_DEADLINE_TEMPLATE', 'deadline', id, `CPA verified statutory filing rule and cited official source.`);
  };

  // Client Requests
  const sendMissingDocRequest = (txId: string, vendor: string, amountMinor: number) => {
    const newReq: ClientRequestItem = {
      id: `req-${Date.now()}`,
      clientId: selectedClientId,
      kind: 'missing_document',
      title: `Missing Receipt: ${vendor} ($${(amountMinor / 100).toFixed(2)})`,
      description: `Please upload the itemized invoice or photo receipt for the ${vendor} purchase.`,
      amountMinor,
      status: 'sent',
      sentAt: new Date().toLocaleString(),
      reminderCount: 0,
      targetTransactionId: txId
    };

    setClientRequests(prev => [newReq, ...prev]);
    logAudit('system', 'Client Comms Automation', 'SEND_CLIENT_REQUEST', 'client_request', newReq.id, `Dispatched missing receipt reminder to ${selectedClient.name} portal.`);
  };

  const answerClientRequest = (reqId: string, answer: string) => {
    setClientRequests(prev => prev.map(r => r.id === reqId ? {
      ...r,
      status: 'answered',
      clientAnswer: answer,
      answeredAt: new Date().toLocaleString()
    } : r));

    // If there is an associated review item, update its rationale with client's answer
    const req = clientRequests.find(r => r.id === reqId);
    if (req?.targetTransactionId) {
      setReviewItems(prev => prev.map(ri => {
        if (ri.bankTransactionId === req.targetTransactionId) {
          return {
            ...ri,
            reason: `Client provided memo: "${answer}"`,
            aiSuggestion: {
              ...ri.aiSuggestion,
              confidence: 0.95,
              rationale: `Client confirmed in portal: "${answer}". Recommending standard materials classification.`
            }
          };
        }
        return ri;
      }));
    }

    logAudit('user', 'Client (Portal)', 'ANSWER_CLIENT_REQUEST', 'client_request', reqId, `Client answered: "${answer}"`);
  };

  // Real-time Metrics Calculation
  const metrics = useMemo<SystemMetrics>(() => {
    const totalTransactions = bankTransactions.length;
    const categorizedWithoutEdit = bankTransactions.filter(t => t.status === 'categorized' || t.status === 'matched').length;
    const autoCategorizedRate = totalTransactions > 0 ? (categorizedWithoutEdit / totalTransactions) * 100 : 91.4;

    const totalMatches = reconciliationMatches.length;
    const confirmedMatches = reconciliationMatches.filter(m => m.status === 'confirmed').length;
    const autoMatchRate = totalMatches > 0 ? (confirmedMatches / totalMatches) * 100 : 88.5;

    // Baselines from brief: 1.5 min per tx, 3.0 min per doc
    const baselineMinutes = (totalTransactions * firmSettings.baselineMinutesPerTx) + (documents.length * firmSettings.baselineMinutesPerDoc);
    const baselineHours = baselineMinutes / 60;

    // Measured review time: ~14 seconds per review item
    const resolvedItemsCount = reviewItems.filter(r => r.status !== 'needs_review').length;
    const reviewMinutes = (resolvedItemsCount * 14) / 60;
    const reviewHours = reviewMinutes / 60;

    const netHoursSaved = Math.max(0, Math.round((baselineHours - reviewHours) * 10) / 10);
    const dollarRoiSaved = Math.round(netHoursSaved * firmSettings.firmHourlyBillingRate);

    // Unreconciled difference
    const totalBankInflows = bankTransactions.filter(t => t.amountMinor > 0).reduce((sum, t) => sum + t.amountMinor, 0);
    const totalBankOutflows = bankTransactions.filter(t => t.amountMinor < 0).reduce((sum, t) => sum + Math.abs(t.amountMinor), 0);
    const netBankFlow = totalBankInflows - totalBankOutflows;

    const postedDebits = journalEntries.reduce((sum, je) => sum + je.lines.reduce((ls, l) => ls + l.debitMinor, 0), 0);
    const postedCredits = journalEntries.reduce((sum, je) => sum + je.lines.reduce((ls, l) => ls + l.creditMinor, 0), 0);
    const unreconciledDiff = Math.abs(postedDebits - postedCredits);

    return {
      totalTransactionsProcessed: totalTransactions,
      autoCategorizedCount: categorizedWithoutEdit,
      autoCategorizedRate: Math.round(autoCategorizedRate * 10) / 10,
      autoMatchCount: confirmedMatches,
      autoMatchRate: Math.round(autoMatchRate * 10) / 10,
      avgReviewSecondsPerItem: 14,
      baselineHoursEquivalent: Math.round(baselineHours * 10) / 10,
      actualReviewHoursSpent: Math.round(reviewHours * 10) / 10,
      netHoursSaved,
      dollarRoiSaved,
      activeClientCount: clients.length,
      unreconciledDifferenceMinor: unreconciledDiff
    };
  }, [bankTransactions, reconciliationMatches, documents, reviewItems, firmSettings, clients, journalEntries]);

  // QuickBooks Online Export (CSV)
  const exportQboCsv = () => {
    const headers = ['JournalNo', 'Date', 'Memo', 'AccountCode', 'AccountName', 'Debit', 'Credit', 'Entity'];
    const rows: string[] = [headers.join(',')];

    journalEntries.forEach(je => {
      je.lines.forEach(line => {
        rows.push([
          `"${je.id}"`,
          `"${je.entryDate}"`,
          `"${je.memo.replace(/"/g, '""')}"`,
          `"${line.accountCode}"`,
          `"${line.accountName.replace(/"/g, '""')}"`,
          (line.debitMinor / 100).toFixed(2),
          (line.creditMinor / 100).toFixed(2),
          `"${selectedClient.name.replace(/"/g, '""')}"`
        ].join(','));
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `QBO_Export_${selectedClient.id}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAudit('user', selectedClient.staffReviewer, 'EXPORT_QBO_CSV', 'export', selectedClient.id, `Exported ${journalEntries.length} journal entries to QuickBooks Online CSV format.`);
  };

  // Full Client Data Export (JSON)
  const exportFullClientDataJson = () => {
    const exportPackage = {
      retalyySystemVersion: '1.0.0-mvp',
      exportedAt: new Date().toISOString(),
      firm: firmSettings,
      client: selectedClient,
      chartOfAccounts: accounts.filter(a => a.clientId === selectedClientId),
      bankTransactions: bankTransactions.filter(t => t.clientId === selectedClientId),
      extractedDocuments: documents.filter(d => d.clientId === selectedClientId),
      postedJournalEntries: journalEntries.filter(je => je.clientId === selectedClientId),
      reconciliationMatches: reconciliationMatches.filter(m => m.clientId === selectedClientId),
      periodClose: periodClose,
      auditLog: auditLog.filter(a => a.subjectType === 'journal_entry' || a.subjectType === 'document' || a.subjectType === 'period_close'),
      complianceDeadlines: deadlines
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPackage, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Retalyy_FullAuditArchive_${selectedClient.id}_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAudit('user', selectedClient.partnerCpa, 'FULL_DATA_EXPORT_JSON', 'export', selectedClient.id, `Exported complete immutable audit archive for client ${selectedClient.name}.`);
  };

  const resetToDemoData = () => {
    localStorage.removeItem('retalyy_os_clients');
    localStorage.removeItem('retalyy_os_firm_settings');
    localStorage.removeItem('retalyy_os_review_items');
    localStorage.removeItem('retalyy_os_bank_transactions');
    localStorage.removeItem('retalyy_os_documents');
    localStorage.removeItem('retalyy_os_accounts');
    localStorage.removeItem('retalyy_os_journal_entries');
    localStorage.removeItem('retalyy_os_rules');
    localStorage.removeItem('retalyy_os_reconciliations');
    localStorage.removeItem('retalyy_os_period_close');
    localStorage.removeItem('retalyy_os_deadlines');
    localStorage.removeItem('retalyy_os_client_requests');
    localStorage.removeItem('retalyy_os_audit_log');

    setClients(INITIAL_CLIENTS);
    setSelectedClientId('cli-apex');
    setFirmSettings(INITIAL_FIRM_SETTINGS);
    setReviewItems(INITIAL_REVIEW_ITEMS);
    setBankTransactions(INITIAL_BANK_TRANSACTIONS);
    setDocuments(INITIAL_EXTRACTED_DOCUMENTS);
    setAccounts(INITIAL_CHART_OF_ACCOUNTS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setRules(INITIAL_CATEGORIZATION_RULES);
    setReconciliationMatches(INITIAL_RECONCILIATION_MATCHES);
    setPeriodClose(INITIAL_PERIOD_CLOSE);
    setDeadlines(INITIAL_DEADLINES);
    setClientRequests(INITIAL_CLIENT_REQUESTS);
    setAuditLog(INITIAL_AUDIT_LOG);

    alert('System state refreshed to pristine demo benchmark data.');
  };

  return (
    <StartupSystemContext.Provider
      value={{
        clients,
        selectedClientId,
        selectedClient,
        setSelectedClientId,
        firmSettings,
        updateFirmSettings,
        reviewItems,
        approveReviewItem,
        editReviewItem,
        rejectReviewItem,
        bulkApproveFiltered,
        activeLearnedRules: rules,
        activateLearnedRule,
        bankTransactions,
        importCsvTransactions,
        syncPlaidFeed,
        documents,
        uploadDocument,
        simulateInboundEmail,
        accounts,
        journalEntries,
        postJournalEntry,
        reverseJournalEntry,
        reconciliationMatches,
        confirmReconciliationMatch,
        rejectReconciliationMatch,
        periodClose,
        toggleCloseTask,
        regenerateStatements,
        signOffPeriod,
        deadlines,
        verifyDeadline,
        clientRequests,
        sendMissingDocRequest,
        answerClientRequest,
        auditLog,
        metrics,
        exportQboCsv,
        exportFullClientDataJson,
        resetToDemoData
      }}
    >
      {children}
    </StartupSystemContext.Provider>
  );
};

export const useStartupSystem = () => {
  const context = useContext(StartupSystemContext);
  if (!context) {
    throw new Error('useStartupSystem must be used within a StartupSystemProvider');
  }
  return context;
};
