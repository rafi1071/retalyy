/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ClientContextBar } from './components/ClientContextBar';
import { WorkflowStepper } from './components/WorkflowStepper';
import { EfficiencyMetrics } from './components/EfficiencyMetrics';
import { TransactionTable } from './components/TransactionTable';
import { TransactionDrawer } from './components/TransactionDrawer';
import { BatchActionsBar } from './components/BatchActionsBar';
import { ExportModal } from './components/ExportModal';
import { ChartOfAccountsModal } from './components/ChartOfAccountsModal';
import { ExceptionsQueue } from './components/ExceptionsQueue';
import { GeneralLedgerView } from './components/GeneralLedgerView';
import { PipelineWalkthroughView } from './components/PipelineWalkthroughView';
import { EngineDashboard } from './components/EngineDashboard';
import { ContextWindowInspectorModal } from './components/ContextWindowInspectorModal';
import { BenchmarkModal } from './components/BenchmarkModal';
import { MOCK_CLIENTS, INITIAL_TRANSACTIONS } from './data/mockData';
import { TransactionRecord, ClientProfile, UserRole } from './types/accounting';
import { AssembledContext } from './types/engine';
import { assembleContext } from './services/contextBuilder';

export default function App() {
  const [selectedClient, setSelectedClient] = useState<ClientProfile>(MOCK_CLIENTS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('staff_accountant');
  const [activeTab, setActiveTab] = useState<'workbench' | 'engine' | 'pipeline' | 'exceptions' | 'audit' | 'coa'>('workbench');
  
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [selectedTxnIds, setSelectedTxnIds] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [activeDrawerTxn, setActiveDrawerTxn] = useState<TransactionRecord | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'needs_review' | 'matched' | 'approved' | 'posted'>('all');
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCoaOpen, setIsCoaOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [activeInspectedContext, setActiveInspectedContext] = useState<AssembledContext | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Synchronize active drawer transaction with state
  const handleOpenDrawer = (txn: TransactionRecord) => {
    setActiveDrawerTxn(txn);
  };

  const handleCloseDrawer = () => {
    setActiveDrawerTxn(null);
  };

  const handleUpdateTransaction = (updated: TransactionRecord) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    if (activeDrawerTxn?.id === updated.id) {
      setActiveDrawerTxn(updated);
    }
  };

  // Toggle single selection
  const handleToggleSelect = (id: string) => {
    setSelectedTxnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all visible
  const handleSelectAll = () => {
    if (selectedTxnIds.length === transactions.length) {
      setSelectedTxnIds([]);
    } else {
      setSelectedTxnIds(transactions.map((t) => t.id));
    }
  };

  // Batch action: Normalize & Validate
  const handleBatchNormalize = () => {
    setTransactions((prev) =>
      prev.map((t) => {
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

  // Batch action: Auto-Match Records
  const handleBatchMatch = () => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (selectedTxnIds.includes(t.id) && t.matching.confidence >= 90) {
          return {
            ...t,
            status: t.status === 'validated' || t.status === 'extracted' ? 'matched' : t.status
          };
        }
        return t;
      })
    );
    setSelectedTxnIds([]);
  };

  // Batch action: Post Approved to Ledger
  const handleBatchPost = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setTransactions((prev) =>
      prev.map((t) => {
        if (selectedTxnIds.includes(t.id) && (t.status === 'approved' || t.autoPostEligible)) {
          return {
            ...t,
            status: 'posted',
            postedAt: timestamp,
            approvalHistory: [
              ...t.approvalHistory,
              {
                id: `LOG-${Date.now()}-${t.id}`,
                timestamp,
                userRole: currentRole,
                userName: `Active User (${currentRole})`,
                stepNumber: 6,
                stepName: 'Batch Ledger Posting',
                action: 'Posted to General Ledger',
                details: 'Batch processed & posted to active accounting period.'
              }
            ]
          };
        }
        return t;
      })
    );
    setSelectedTxnIds([]);
  };

  // Run autonomous batch pipeline simulation
  const handleRunBatchPipeline = () => {
    setIsBatchProcessing(true);
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.status === 'extracted') {
            return { ...t, isNormalized: true, status: 'validated' };
          }
          if (t.status === 'validated' && t.matching.confidence >= 95) {
            return { ...t, status: 'matched' };
          }
          if (t.status === 'matched' && t.autoPostEligible) {
            return { ...t, status: 'posted', postedAt: new Date().toISOString() };
          }
          return t;
        })
      );
      setIsBatchProcessing(false);
    }, 1200);
  };

  // Handle flag resolution
  const handleResolveFlag = (txnId: string, flagId: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txnId) {
          return {
            ...t,
            validationFlags: t.validationFlags.map((f) =>
              f.id === flagId ? { ...f, resolved: true } : f
            )
          };
        }
        return t;
      })
    );
  };

  // Open context inspector modal for transaction
  const handleOpenContextForTxn = (ctx: AssembledContext) => {
    setActiveInspectedContext(ctx);
  };

  // Filtered by Workflow Stepper step click if selected
  const displayedTransactions = selectedStep !== null
    ? transactions.filter((t) => {
        if (selectedStep === 1) return t.sourceDocument !== undefined;
        if (selectedStep === 2) return t.isNormalized;
        if (selectedStep === 3) return t.matching.matchStatus === 'high_confidence';
        if (selectedStep === 4) return Boolean(t.accountCode);
        if (selectedStep === 5) return t.journalLines.length > 0;
        if (selectedStep === 6) return t.status === 'posted' || t.status === 'approved';
        return true;
      })
    : transactions;

  const exceptionCount = transactions.filter(
    (t) => t.status === 'needs_review' || t.validationFlags.some((f) => !f.resolved)
  ).length;

  const approvedCount = transactions.filter((t) => t.status === 'approved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Bar following 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'coa') {
            setIsCoaOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onExport={() => setIsExportOpen(true)}
        exceptionCount={exceptionCount}
        approvedCount={approvedCount}
      />

      {/* Client Context, Accounting Policies & User Role */}
      <ClientContextBar
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 min-w-0 overflow-x-hidden">
        {/* TAB 1: WORKBENCH */}
        {activeTab === 'workbench' && (
          <div>
            {/* 6-Stage Stepper */}
            <WorkflowStepper
              selectedStep={selectedStep}
              setSelectedStep={setSelectedStep}
              transactions={transactions}
              onRunBatchPipeline={handleRunBatchPipeline}
              isProcessing={isBatchProcessing}
            />

            {/* Time Efficiency Metrics Banner (Manual vs Retalyy AI) */}
            <EfficiencyMetrics transactions={transactions} />

            {/* Transaction Data Grid */}
            <TransactionTable
              transactions={displayedTransactions}
              selectedTxnIds={selectedTxnIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onOpenDrawer={handleOpenDrawer}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </div>
        )}

        {/* TAB 2: AI ACCOUNTING ENGINE & GUARDRAILS */}
        {activeTab === 'engine' && (
          <EngineDashboard
            transactions={transactions}
            client={selectedClient}
            onOpenContextInspector={(ctx) => setActiveInspectedContext(ctx)}
            onOpenBenchmark={() => setIsBenchmarkOpen(true)}
            onUpdateTransaction={handleUpdateTransaction}
          />
        )}

        {/* TAB 3: PIPELINE WALKTHROUGH */}
        {activeTab === 'pipeline' && (
          <PipelineWalkthroughView
            transactions={transactions}
            onOpenDrawer={handleOpenDrawer}
          />
        )}

        {/* TAB 4: EXCEPTIONS QUEUE */}
        {activeTab === 'exceptions' && (
          <ExceptionsQueue
            transactions={transactions}
            onOpenDrawer={handleOpenDrawer}
            onResolveFlag={handleResolveFlag}
          />
        )}

        {/* TAB 5: GENERAL LEDGER AUDIT */}
        {activeTab === 'audit' && (
          <GeneralLedgerView
            transactions={transactions}
            onOpenDrawer={handleOpenDrawer}
            onExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Floating Batch Actions Bar */}
      <BatchActionsBar
        selectedCount={selectedTxnIds.length}
        onClear={() => setSelectedTxnIds([])}
        onBatchNormalize={handleBatchNormalize}
        onBatchMatch={handleBatchMatch}
        onBatchPost={handleBatchPost}
      />

      {/* Transaction Detail Workbench Drawer */}
      <TransactionDrawer
        transaction={activeDrawerTxn}
        onClose={handleCloseDrawer}
        onUpdateTransaction={handleUpdateTransaction}
        currentRole={currentRole}
        clientContext={selectedClient}
        onOpenContextInspector={(ctx) => setActiveInspectedContext(ctx)}
      />

      {/* Export Final Output Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        transactions={transactions}
        client={selectedClient}
      />

      {/* Chart of Accounts Modal */}
      <ChartOfAccountsModal
        isOpen={isCoaOpen}
        onClose={() => setIsCoaOpen(false)}
      />

      {/* Context Window Inspector Modal */}
      <ContextWindowInspectorModal
        isOpen={Boolean(activeInspectedContext)}
        onClose={() => setActiveInspectedContext(null)}
        context={activeInspectedContext}
      />

      {/* Empirical Benchmark Suite Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />
    </div>
  );
}
