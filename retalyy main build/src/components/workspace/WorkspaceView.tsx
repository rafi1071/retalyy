import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';
import { NavigationTab } from '../../types';
import { ReviewQueuePane } from './ReviewQueuePane';
import { ReconciliationPane } from './ReconciliationPane';
import { LedgerPane } from './LedgerPane';
import { DocumentIntakePane } from './DocumentIntakePane';
import { BankFeedsPane } from './BankFeedsPane';
import { MonthClosePane } from './MonthClosePane';
import { ClientCommsPane } from './ClientCommsPane';
import { DeadlinesPane } from './DeadlinesPane';
import { AuditLogPane } from './AuditLogPane';
import { RoiMetricsPane } from './RoiMetricsPane';
import { ExportPane } from './ExportPane';

interface WorkspaceViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export type WorkspaceSubTab =
  | 'review_queue'
  | 'reconciliation'
  | 'ledger'
  | 'documents'
  | 'bank_feeds'
  | 'month_close'
  | 'comms'
  | 'deadlines'
  | 'audit'
  | 'roi'
  | 'export';

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const {
    clients,
    selectedClientId,
    setSelectedClientId,
    selectedClient,
    reviewItems,
    metrics,
    periodClose,
    firmSettings
  } = useStartupSystem();

  const [activeSubTab, setActiveSubTab] = useState<WorkspaceSubTab>('review_queue');

  const pendingReviewCount = reviewItems.filter(r => r.status === 'needs_review').length;

  return (
    <div className="wrap py-8 space-y-6">
      
      {/* TOP WORKSPACE NAVIGATION & CLIENT CONTEXT BAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9F0E2] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#0C2B1C] text-[#8EDDA6] font-display font-extrabold flex items-center justify-center text-lg shadow-sm">
              R
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#52705F] font-bold tracking-wider">
                Firm Operations Platform · {firmSettings.firmName}
              </div>
              <div className="text-lg font-bold text-[#0C2B1C]">
                Autonomous Month-End Close OS
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-[#D9F0E2] hidden sm:block" />

          {/* Client Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#52705F] font-mono">Client:</span>
            <select
              value={selectedClientId}
              onChange={e => setSelectedClientId(e.target.value)}
              className="text-xs font-bold text-[#0C2B1C] bg-[#F2F9F5] border border-[#D9F0E2] rounded-xl px-3 py-2 focus:outline-none focus:border-[#27B665]"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.industry.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Client Status Badges & Quick Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#F8FCF9] border border-[#D9F0E2] text-xs font-mono">
            <span className="text-gray-500">Period: </span>
            <strong className="text-[#0C2B1C]">{selectedClient.currentPeriod}</strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#EDF9F1] border border-[#27B665]/30 text-xs font-mono text-[#0F7A41] font-bold">
            Hours Saved: {metrics.netHoursSaved} hrs (${metrics.dollarRoiSaved.toLocaleString()})
          </div>

          <button
            onClick={() => setActiveTab('portal')}
            className="px-3.5 py-1.5 rounded-xl bg-[#0C2B1C] text-white text-xs font-bold hover:bg-[#16432E] transition-all"
          >
            Switch to Client Portal ↗
          </button>
        </div>
      </div>

      {/* PLATFORM SUB-TABS NAVIGATION BAR */}
      <div className="bg-white rounded-2xl p-2 border border-[#D9F0E2] shadow-sm flex items-center overflow-x-auto gap-1">
        {[
          { id: 'review_queue', label: 'Review Queue', badge: pendingReviewCount > 0 ? pendingReviewCount : undefined, highlight: pendingReviewCount > 0 },
          { id: 'reconciliation', label: 'Reconciliation', badge: metrics.unreconciledDifferenceMinor === 0 ? '✓ Reconciled' : '$ Diff' },
          { id: 'ledger', label: 'General Ledger' },
          { id: 'documents', label: 'Document Intake (OCR)' },
          { id: 'bank_feeds', label: 'Bank Feeds & CSV' },
          { id: 'month_close', label: 'Month Close & Statements', badge: periodClose.status === 'closed' ? '🔒 Locked' : 'In Review' },
          { id: 'comms', label: 'Client Requests' },
          { id: 'deadlines', label: 'Deadlines & Calendar' },
          { id: 'audit', label: 'Audit Trail' },
          { id: 'roi', label: 'ROI Analytics' },
          { id: 'export', label: 'QBO & Export' }
        ].map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as WorkspaceSubTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0C2B1C] text-white shadow-sm'
                  : 'text-[#52705F] hover:bg-[#F2F9F5] hover:text-[#0C2B1C]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-[#27B665] text-[#0C2B1C]' :
                  tab.highlight ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="transition-all">
        {activeSubTab === 'review_queue' && <ReviewQueuePane />}
        {activeSubTab === 'reconciliation' && <ReconciliationPane />}
        {activeSubTab === 'ledger' && <LedgerPane />}
        {activeSubTab === 'documents' && <DocumentIntakePane />}
        {activeSubTab === 'bank_feeds' && <BankFeedsPane />}
        {activeSubTab === 'month_close' && <MonthClosePane />}
        {activeSubTab === 'comms' && <ClientCommsPane />}
        {activeSubTab === 'deadlines' && <DeadlinesPane />}
        {activeSubTab === 'audit' && <AuditLogPane />}
        {activeSubTab === 'roi' && <RoiMetricsPane />}
        {activeSubTab === 'export' && <ExportPane />}
      </main>

    </div>
  );
};
