import React from 'react';
import {
  Layers,
  FolderOpen,
  Cpu,
  BookOpen,
  Scale,
  Building2,
  AlertTriangle,
  FileCheck2,
  Lock,
  ChevronDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';
import { formatMoney } from '../services/ledgerEngine';

export type MainStepTab = 'step1_intake' | 'step2_processing' | 'step3_ledgerline';

export type Step1SubTab =
  | 'files'
  | 'onboarding'
  | 'onboard_new'
  | 'attention'
  | 'checklists'
  | 'portal'
  | 'cases'
  | 'simulator'
  | 'audit';

export type Step2SubTab =
  | 'workbench'
  | 'engine'
  | 'pipeline'
  | 'exceptions'
  | 'audit'
  | 'coa';

export type Step3SubTab =
  | 'dashboard'
  | 'invoices'
  | 'bills'
  | 'expenses'
  | 'bank'
  | 'accounts'
  | 'journal'
  | 'contacts'
  | 'reports';

interface UnifiedHeaderProps {
  currentStep: MainStepTab;
  onSelectStep: (step: MainStepTab) => void;
  // Step 1 Subtabs
  step1Tab: Step1SubTab;
  onSelectStep1Tab: (tab: Step1SubTab) => void;
  // Step 2 Subtabs
  step2Tab: Step2SubTab;
  onSelectStep2Tab: (tab: Step2SubTab) => void;
  // Step 3 Subtabs
  step3Tab: Step3SubTab;
  onSelectStep3Tab: (tab: Step3SubTab) => void;
  // Badges & Live Status
  attentionCount: number;
  pendingOnboardingCount: number;
  exceptionsCount: number;
  bankBalance: number;
  unreconciledCount: number;
  // Client selection
  selectedClientName: string;
  clientsList: { id: string; name: string }[];
  onSelectClient: (id: string) => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentStep,
  onSelectStep,
  step1Tab,
  onSelectStep1Tab,
  step2Tab,
  onSelectStep2Tab,
  step3Tab,
  onSelectStep3Tab,
  attentionCount,
  pendingOnboardingCount,
  exceptionsCount,
  bankBalance,
  unreconciledCount,
  selectedClientName,
  clientsList,
  onSelectClient
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl shadow-slate-950/40">
      {/* Tier 1: Brand Wordmark, Main Step Pipeline Switcher, Client Switcher, and Real-Time Financial Metric */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 border-b border-slate-800/60">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 font-black text-sm">
            R
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                Retalyy
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline-block">
                Autonomous CRM
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-tight hidden md:inline">
              QuickBooks & Xero Replacement
            </span>
          </div>
        </div>

        {/* Center: The 3 Master Workflow Steps */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          {/* Step 1 Button */}
          <button
            onClick={() => onSelectStep('step1_intake')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              currentStep === 'step1_intake'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Step 1: Intake & Onboarding</span>
            {(attentionCount > 0 || pendingOnboardingCount > 0) && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-400/20 text-sky-200 border border-sky-400/30 font-bold">
                {attentionCount + pendingOnboardingCount}
              </span>
            )}
          </button>

          {/* Arrow divider */}
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 mx-1 hidden lg:block" />

          {/* Step 2 Button */}
          <button
            onClick={() => onSelectStep('step2_processing')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              currentStep === 'step2_processing'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Step 2: AI Processing</span>
            {exceptionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30 font-bold">
                {exceptionsCount}
              </span>
            )}
          </button>

          {/* Arrow divider */}
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 mx-1 hidden lg:block" />

          {/* Step 3 Button */}
          <button
            onClick={() => onSelectStep('step3_ledgerline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              currentStep === 'step3_ledgerline'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Step 3: Accounting Core (Ledgerline)</span>
            {unreconciledCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 font-bold">
                {unreconciledCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Client Switcher & Live Bank Status */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Client Dropdown */}
          <div className="relative hidden sm:block">
            <select
              value={selectedClientName}
              onChange={e => onSelectClient(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm hover:border-slate-700"
            >
              {clientsList.map(c => (
                <option key={c.id} value={c.id}>
                  🏢 {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Live Books Bank Balance Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              Ledger Bank:
            </span>
            <span className="font-bold text-white tabular-nums">
              {formatMoney(bankBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Tier 2: Contextual Sub-navigation bar specific to the active step */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center justify-between gap-4 text-xs font-medium">
        {/* Step 1 Sub-nav */}
        {currentStep === 'step1_intake' && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onSelectStep1Tab('files')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step1Tab === 'files'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Client File Explorer
            </button>
            <button
              onClick={() => onSelectStep1Tab('onboarding')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                step1Tab === 'onboarding'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Onboarding Queue</span>
              {pendingOnboardingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                  {pendingOnboardingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectStep1Tab('onboard_new')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step1Tab === 'onboard_new'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              + Onboard New Client
            </button>
            <button
              onClick={() => onSelectStep1Tab('attention')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                step1Tab === 'attention'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Needs Attention</span>
              {attentionCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  {attentionCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectStep1Tab('checklists')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step1Tab === 'checklists'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expected Checklist Rules
            </button>
            <button
              onClick={() => onSelectStep1Tab('portal')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step1Tab === 'portal'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Client Upload Portal
            </button>
            <button
              onClick={() => onSelectStep1Tab('cases')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step1Tab === 'cases'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cases Dashboard
            </button>
            <button
              onClick={() => onSelectStep1Tab('simulator')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                step1Tab === 'simulator'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Intake Pipeline Simulator</span>
            </button>
            <button
              onClick={() => onSelectStep1Tab('audit')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step1Tab === 'audit'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Intake Audit Trail
            </button>
          </div>
        )}

        {/* Step 2 Sub-nav */}
        {currentStep === 'step2_processing' && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onSelectStep2Tab('workbench')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step2Tab === 'workbench'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transaction Workbench
            </button>
            <button
              onClick={() => onSelectStep2Tab('engine')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                step2Tab === 'engine'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Engine & Memory</span>
            </button>
            <button
              onClick={() => onSelectStep2Tab('pipeline')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step2Tab === 'pipeline'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pipeline Walkthrough
            </button>
            <button
              onClick={() => onSelectStep2Tab('exceptions')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                step2Tab === 'exceptions'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Exceptions Review</span>
              {exceptionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  {exceptionsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectStep2Tab('audit')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step2Tab === 'audit'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pre-Posting GL Audit
            </button>
          </div>
        )}

        {/* Step 3 Sub-nav */}
        {currentStep === 'step3_ledgerline' && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onSelectStep3Tab('dashboard')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'dashboard'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ledger Overview
            </button>
            <button
              onClick={() => onSelectStep3Tab('invoices')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'invoices'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Invoices (AR)
            </button>
            <button
              onClick={() => onSelectStep3Tab('bills')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'bills'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bills (AP)
            </button>
            <button
              onClick={() => onSelectStep3Tab('expenses')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'expenses'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Direct Expenses
            </button>
            <button
              onClick={() => onSelectStep3Tab('bank')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                step3Tab === 'bank'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bank Reconciliation</span>
              {unreconciledCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  {unreconciledCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectStep3Tab('journal')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'journal'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              General Journal
            </button>
            <button
              onClick={() => onSelectStep3Tab('accounts')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'accounts'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chart of Accounts
            </button>
            <button
              onClick={() => onSelectStep3Tab('contacts')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'contacts'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Contacts Directory
            </button>
            <button
              onClick={() => onSelectStep3Tab('reports')}
              className={`px-3 py-1 rounded-lg transition-all ${
                step3Tab === 'reports'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reports & Tax
            </button>
          </div>
        )}

        {/* Live Autonomous Pipeline Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>End-to-End AI Sync Active</span>
        </div>
      </div>
    </header>
  );
};
