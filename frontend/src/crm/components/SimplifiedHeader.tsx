import React, { useState } from 'react';
import {
  LogOut,
  ChevronDown,
  AlertTriangle,
  Scale,
  Cpu,
  ChevronRight,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { UserSession } from './Auth/AuthLoginView';
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
  | 'audit';

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

interface SimplifiedHeaderProps {
  session: UserSession;
  onLogout: () => void;
  onBackToMarketing?: () => void;
  onSwitchToBusinessCrm?: () => void;
  currentStep: MainStepTab;
  onSelectStep: (step: MainStepTab) => void;
  step1Tab: Step1SubTab;
  onSelectStep1Tab: (tab: Step1SubTab) => void;
  step2Tab: Step2SubTab;
  onSelectStep2Tab: (tab: Step2SubTab) => void;
  step3Tab: Step3SubTab;
  onSelectStep3Tab: (tab: Step3SubTab) => void;
  attentionCount: number;
  pendingOnboardingCount: number;
  exceptionsCount: number;
  bankBalance: number;
  unreconciledCount: number;
  selectedClientName: string;
  clientsList: { id: string; name: string }[];
  onSelectClient: (id: string) => void;
}

/* ─── Shared tab button component ─── */
const NavTab: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: string;
  icon?: React.ReactNode;
}> = ({ label, isActive, onClick, badge, badgeColor = '#f59e0b', icon }) => (
  <button
    onClick={onClick}
    className="relative flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium transition-all whitespace-nowrap"
    style={{
      borderRadius: 'var(--radius-md)',
      color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
      background: isActive ? 'var(--bg-surface-active)' : 'transparent',
      transition: 'all 150ms ease',
    }}
    onMouseEnter={e => {
      if (!isActive) {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'var(--bg-surface-hover)';
      }
    }}
    onMouseLeave={e => {
      if (!isActive) {
        e.currentTarget.style.color = 'var(--text-tertiary)';
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    {icon}
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span
        className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
        style={{ background: badgeColor }}
      >
        {badge}
      </span>
    )}
    {/* Active indicator line */}
    {isActive && (
      <div
        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
        style={{ background: 'var(--accent-primary)' }}
      />
    )}
  </button>
);

/* ─── Step Switcher tab for admin ─── */
const StepTab: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
  number: string;
}> = ({ label, isActive, onClick, accentColor, number }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium transition-all"
    style={{
      borderRadius: 'var(--radius-md)',
      color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
      background: isActive ? 'var(--bg-surface-active)' : 'transparent',
      transition: 'all 150ms ease',
    }}
    onMouseEnter={e => {
      if (!isActive) {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'var(--bg-surface-hover)';
      }
    }}
    onMouseLeave={e => {
      if (!isActive) {
        e.currentTarget.style.color = 'var(--text-tertiary)';
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    <span
      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
      style={{
        background: isActive ? accentColor : 'var(--bg-surface)',
        color: isActive ? '#fff' : 'var(--text-muted)',
        border: isActive ? 'none' : '1px solid var(--border-primary)',
      }}
    >
      {number}
    </span>
    <span>{label}</span>
  </button>
);

export const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({
  session,
  onLogout,
  onBackToMarketing,
  onSwitchToBusinessCrm,
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
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderBottom: '1px solid var(--border-primary)',
      }}
    >
      <div className="max-w-[1700px] mx-auto px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3">

        {/* ── Left: Brand & Return ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onBackToMarketing && (
            <button
              onClick={onBackToMarketing}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-full border border-[#D9F0E2] text-[#0C2B1C] hover:bg-[#EDF9F1] transition-all flex items-center gap-1 shadow-xs bg-white cursor-pointer"
              title="Return to Main Portal / Website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#27B665]" />
              <span className="hidden sm:inline">Main Site</span>
            </button>
          )}

          {onSwitchToBusinessCrm && (
            <button
              onClick={onSwitchToBusinessCrm}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-full border border-[#D9F0E2] text-[#0C2B1C] hover:bg-[#EDF9F1] transition-all flex items-center gap-1 shadow-xs bg-white cursor-pointer"
              title="Switch to Business Finance Department CRM"
            >
              <Building2 className="w-3.5 h-3.5 text-[#27B665]" />
              <span className="hidden md:inline">Business Finance</span>
            </button>
          )}

          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{
              background: 'linear-gradient(135deg, #0C2B1C 0%, #27B665 100%)',
            }}
          >
            R
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold tracking-tight font-display" style={{ color: 'var(--text-primary)' }}>
                Retalyy CPA Firm OS
              </span>
              <span
                className="h-4 w-px"
                style={{ background: 'var(--border-primary)' }}
              />
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {session.roleTitle}
              </span>
            </div>
          </div>
        </div>

        {/* ── Center: Navigation ── */}
        <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Client Portal */}
          {session.role === 'client' && (
            <NavTab label="Document Upload & Missing Checklist" isActive={true} onClick={() => {}} />
          )}

          {/* Intake Specialist */}
          {session.role === 'intake_specialist' && (
            <div className="flex items-center gap-0.5">
              <NavTab label="Client Files" isActive={step1Tab === 'files'} onClick={() => onSelectStep1Tab('files')} />
              <NavTab label="Onboarding" isActive={step1Tab === 'onboarding'} onClick={() => onSelectStep1Tab('onboarding')}
                      badge={pendingOnboardingCount} badgeColor="#0ea5e9" />
              <NavTab label="Attention" isActive={step1Tab === 'attention'} onClick={() => onSelectStep1Tab('attention')}
                      badge={attentionCount} badgeColor="#f59e0b"
                      icon={attentionCount > 0 ? <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} /> : undefined} />
              <NavTab label="Checklists" isActive={step1Tab === 'checklists'} onClick={() => onSelectStep1Tab('checklists')} />
              <NavTab label="Client Portal" isActive={step1Tab === 'portal'} onClick={() => onSelectStep1Tab('portal')} />
            </div>
          )}

          {/* Staff Accountant */}
          {session.role === 'staff_accountant' && (
            <div className="flex items-center gap-0.5">
              <NavTab label="Workbench" isActive={step2Tab === 'workbench'} onClick={() => onSelectStep2Tab('workbench')} />
              <NavTab label="AI Engine" isActive={step2Tab === 'engine'} onClick={() => onSelectStep2Tab('engine')}
                      icon={<Cpu className="w-3.5 h-3.5" />} />
              <NavTab label="Exceptions" isActive={step2Tab === 'exceptions'} onClick={() => onSelectStep2Tab('exceptions')}
                      badge={exceptionsCount} badgeColor="#f59e0b" />
              <NavTab label="GL Audit" isActive={step2Tab === 'audit'} onClick={() => onSelectStep2Tab('audit')} />
            </div>
          )}

          {/* CPA / Controller */}
          {session.role === 'cpa_controller' && (
            <div className="flex items-center gap-0.5">
              <NavTab label="Overview" isActive={step3Tab === 'dashboard'} onClick={() => onSelectStep3Tab('dashboard')} />
              <NavTab label="Invoices" isActive={step3Tab === 'invoices'} onClick={() => onSelectStep3Tab('invoices')} />
              <NavTab label="Bills" isActive={step3Tab === 'bills'} onClick={() => onSelectStep3Tab('bills')} />
              <NavTab label="Bank Feed" isActive={step3Tab === 'bank'} onClick={() => onSelectStep3Tab('bank')}
                      badge={unreconciledCount} badgeColor="#06b6d4"
                      icon={<Scale className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />} />
              <NavTab label="Journal" isActive={step3Tab === 'journal'} onClick={() => onSelectStep3Tab('journal')} />
              <NavTab label="Accounts" isActive={step3Tab === 'accounts'} onClick={() => onSelectStep3Tab('accounts')} />
              <NavTab label="Reports" isActive={step3Tab === 'reports'} onClick={() => onSelectStep3Tab('reports')} />
            </div>
          )}

          {/* Firm Admin */}
          {session.role === 'firm_admin' && (
            <div className="flex items-center gap-0.5">
              <StepTab label="Intake" isActive={currentStep === 'step1_intake'} onClick={() => onSelectStep('step1_intake')}
                       accentColor="#0ea5e9" number="1" />
              <ChevronRight className="w-3.5 h-3.5 mx-0.5" style={{ color: 'var(--text-muted)' }} />
              <StepTab label="AI Processing" isActive={currentStep === 'step2_processing'} onClick={() => onSelectStep('step2_processing')}
                       accentColor="#6366f1" number="2" />
              <ChevronRight className="w-3.5 h-3.5 mx-0.5" style={{ color: 'var(--text-muted)' }} />
              <StepTab label="Accounting" isActive={currentStep === 'step3_ledgerline'} onClick={() => onSelectStep('step3_ledgerline')}
                       accentColor="#22c55e" number="3" />
            </div>
          )}
        </nav>

        {/* ── Right: Client selector + User ── */}
        <div className="flex items-center gap-2 shrink-0">
          {session.role !== 'client' && (
            <div className="relative hidden sm:block">
              <select
                value={selectedClientName}
                onChange={e => onSelectClient(e.target.value)}
                className="appearance-none pr-7 pl-2.5 py-1.5 text-[12px] font-medium focus:outline-none cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  transition: 'border-color 150ms ease',
                }}
              >
                {clientsList.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                           style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          <div className="flex items-center gap-2 pl-2"
               style={{ borderLeft: '1px solid var(--border-primary)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-xs text-white shrink-0"
                 style={{
                   background: session.role === 'cpa_controller' ? '#22c55e'
                     : session.role === 'staff_accountant' ? '#6366f1'
                     : session.role === 'intake_specialist' ? '#0ea5e9'
                     : session.role === 'client' ? '#f59e0b'
                     : '#a855f7',
                 }}>
              {session.name[0]}
            </div>
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 text-[12px] font-medium flex items-center gap-1.5 group"
              style={{
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.color = 'var(--text-tertiary)';
              }}
              title="Switch Persona / Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Switch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
