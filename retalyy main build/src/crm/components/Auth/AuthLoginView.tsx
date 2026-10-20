import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Cpu,
  BookOpen,
  ArrowRight,
  User,
  Lock,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export type UserPersonaRole =
  | 'client'
  | 'intake_specialist'
  | 'staff_accountant'
  | 'cpa_controller'
  | 'firm_admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserPersonaRole;
  roleTitle: string;
  firmName: string;
  avatarBg: string;
  allowedStep: 'client_portal' | 'step1_intake' | 'step2_processing' | 'step3_ledgerline' | 'all';
}

export const PERSONAS: UserSession[] = [
  {
    id: 'user-cpa',
    name: 'Elena Vance, CPA',
    email: 'elena@vanceaccounting.com',
    role: 'cpa_controller',
    roleTitle: 'Senior CPA & Controller',
    firmName: 'Vance & Associates CPAs',
    avatarBg: 'bg-emerald-600',
    allowedStep: 'step3_ledgerline'
  },
  {
    id: 'user-tx',
    name: 'Marcus Chen',
    email: 'marcus@vanceaccounting.com',
    role: 'staff_accountant',
    roleTitle: 'Transaction Processing Accountant',
    firmName: 'Vance & Associates CPAs',
    avatarBg: 'bg-indigo-600',
    allowedStep: 'step2_processing'
  },
  {
    id: 'user-intake',
    name: 'Alex Rivera',
    email: 'alex@vanceaccounting.com',
    role: 'intake_specialist',
    roleTitle: 'Document Intake & Onboarding Specialist',
    firmName: 'Vance & Associates CPAs',
    avatarBg: 'bg-sky-600',
    allowedStep: 'step1_intake'
  },
  {
    id: 'user-client',
    name: 'Sarah Lin',
    email: 'sarah@acmecorp.com',
    role: 'client',
    roleTitle: 'Client Owner (Acme Corporation)',
    firmName: 'Acme Corporation',
    avatarBg: 'bg-amber-600',
    allowedStep: 'client_portal'
  },
  {
    id: 'user-admin',
    name: 'David Ross, CPA',
    email: 'david@vanceaccounting.com',
    role: 'firm_admin',
    roleTitle: 'Managing Partner (Firm Admin)',
    firmName: 'Vance & Associates CPAs',
    avatarBg: 'bg-purple-600',
    allowedStep: 'all'
  }
];

interface AuthLoginViewProps {
  onLogin: (session: UserSession) => void;
  onBackToMarketing?: () => void;
  onSwitchToBusinessCrm?: () => void;
}

const ROLE_CONFIG: Record<UserPersonaRole, {
  icon: React.ReactNode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  label: string;
  description: string;
}> = {
  cpa_controller: {
    icon: <BookOpen className="w-4 h-4" />,
    color: '#27B665',
    gradientFrom: 'from-emerald-500/10',
    gradientTo: 'to-emerald-500/5',
    label: 'Accounting Core',
    description: 'Invoices, Bills, Bank Reconciliation, General Journal, P&L, Balance Sheet'
  },
  staff_accountant: {
    icon: <Cpu className="w-4 h-4" />,
    color: '#6366f1',
    gradientFrom: 'from-indigo-500/10',
    gradientTo: 'to-indigo-500/5',
    label: 'AI Processing',
    description: 'Transaction workbench, OCR inspection, bank matching, and posting to ledger'
  },
  intake_specialist: {
    icon: <FileText className="w-4 h-4" />,
    color: '#0ea5e9',
    gradientFrom: 'from-sky-500/10',
    gradientTo: 'to-sky-500/5',
    label: 'Document Intake',
    description: 'Client onboarding, folder management, checklist rules, and triage'
  },
  client: {
    icon: <Building2 className="w-4 h-4" />,
    color: '#f59e0b',
    gradientFrom: 'from-amber-500/10',
    gradientTo: 'to-amber-500/5',
    label: 'Client Portal',
    description: 'Upload bank statements, receipts, and track missing checklist items'
  },
  firm_admin: {
    icon: <Layers className="w-4 h-4" />,
    color: '#a855f7',
    gradientFrom: 'from-purple-500/10',
    gradientTo: 'to-purple-500/5',
    label: 'Full Access',
    description: 'Master access across all workflows with firm-wide executive controls'
  }
};

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({ 
  onLogin,
  onBackToMarketing,
  onSwitchToBusinessCrm
}) => {
  const [firmName, setFirmName] = useState('');
  const [contactName, setContactName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [role, setRole] = useState<UserPersonaRole>('cpa_controller');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isAccountNotFound, setIsAccountNotFound] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const targetEmail = emailInput.trim().toLowerCase();
    const persona = PERSONAS.find(p => p.email.toLowerCase() === targetEmail);
    const registeredUsers = JSON.parse(localStorage.getItem('retalyy_registered_users') || '[]');
    const registered = registeredUsers.find((u: any) => u.email && u.email.toLowerCase() === targetEmail);

    if (persona) {
      onLogin(persona);
      return;
    }

    if (registered) {
      const session: UserSession = {
        id: registered.id || `usr-${Date.now()}`,
        name: registered.fullName || contactName || 'Elena Vance, CPA',
        email: registered.email,
        role: (registered.role as any) || role,
        roleTitle: 'Senior CPA & Controller',
        firmName: registered.orgName || firmName || 'Vance & Associates CPAs',
        avatarBg: 'bg-emerald-600',
        allowedStep: 'step3_ledgerline'
      };
      onLogin(session);
      return;
    }

    setIsAccountNotFound(true);
  };

  return (
    <div className="retalyy-crm-scope min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden"
         style={{ background: 'var(--bg-base)' }}>

      {/* Top Header Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          {onBackToMarketing && (
            <button
              type="button"
              onClick={onBackToMarketing}
              className="px-3 py-1.5 rounded-full border border-[#D9F0E2] bg-white text-[#0C2B1C] hover:bg-[#EDF9F1] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-[#27B665]" />
              <span>Back to Website</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: 'linear-gradient(135deg, #0C2B1C 0%, #27B665 100%)',
              }}
            >
              R
            </div>
            <span className="font-bold text-base tracking-tight font-display text-[#0C2B1C]">
              Retalyy CPA Firm OS
            </span>
          </div>
        </div>

        {onSwitchToBusinessCrm && (
          <button
            type="button"
            onClick={onSwitchToBusinessCrm}
            className="px-3.5 py-1.5 rounded-full border border-[#D9F0E2] bg-[#EDF9F1] text-[#0C2B1C] hover:bg-[#D9F0E2] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#27B665] animate-pulse" />
            <span>Switch to Business AI Finance Dept →</span>
          </button>
        )}
      </header>

      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.05]"
             style={{ background: 'radial-gradient(circle, #27B665 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
             style={{ background: 'radial-gradient(circle, #0C2B1C 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-[960px] mx-auto space-y-6 relative z-10 my-auto py-6">
        {/* Brand Header */}
        <div className="text-center space-y-2 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2]">
            <Building2 className="w-3.5 h-3.5 text-[#27B665]" />
            Multi-Role CPA Firm Accounting Platform
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-[#0C2B1C]">
            Sign in to Retalyy Firm OS
          </h1>
          <p className="text-xs sm:text-sm text-[#52705F] max-w-md mx-auto">
            Access your dedicated multi-client firm workbench, review queue, and continuous ledger engine.
          </p>
        </div>

        {isAccountNotFound ? (
          <div className="bg-white border border-[#D9F0E2] rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-4 animate-fade-in max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0C2B1C] font-display">
              Account Not Found
            </h2>
            <p className="text-sm text-[#52705F] max-w-sm mx-auto leading-relaxed">
              No existing firm account was found for <strong className="text-[#0C2B1C]">{emailInput}</strong>. Sign in if you have an account or choose an existing firm persona below.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAccountNotFound(false)}
                className="ret-btn px-6 py-2.5 text-xs font-bold cursor-pointer"
              >
                Try Another Email
              </button>
              {onBackToMarketing && (
                <button
                  type="button"
                  onClick={onBackToMarketing}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-bold text-[#0C2B1C] cursor-pointer"
                >
                  Back to Website
                </button>
              )}
            </div>
          </div>
        ) : isSubmitted ? (
          <div className="bg-white border border-[#D9F0E2] rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-4 animate-fade-in max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EDF9F1] border border-[#27B665]/30 text-[#0F7A41] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#27B665]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0C2B1C] font-display">
              We'll get back to you soon!
            </h2>
            <p className="text-sm text-[#52705F] max-w-sm mx-auto leading-relaxed">
              Thank you for submitting your details. Our firm onboarding desk is reviewing your information and we will reach out shortly to <strong className="text-[#0C2B1C]">{emailInput || 'your email'}</strong> to provision your firm portal access.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {onBackToMarketing && (
                <button
                  type="button"
                  onClick={onBackToMarketing}
                  className="ret-btn px-6 py-2.5 text-sm font-bold cursor-pointer"
                >
                  Back to Website
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Main Card */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden animate-scale-in border border-[#D9F0E2] rounded-3xl bg-white shadow-xl">

            {/* Left: Firm OS Value Pillars */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#FAFDFB] border-b lg:border-b-0 lg:border-r border-[#D9F0E2] space-y-5">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#0F7A41] tracking-wider">
                  Partner Advantages
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#0C2B1C] mt-1">
                  Engineered Exclusively for Accounting Practices
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D9F0E2] flex items-center justify-center text-[#0F7A41] shrink-0 shadow-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0C2B1C]">Multi-Client CAS Command Center</h4>
                    <p className="text-[11px] text-[#52705F] leading-relaxed mt-0.5">
                      Monitor all contractor & SMB client close deadlines and transaction volumes from one central view.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D9F0E2] flex items-center justify-center text-[#0F7A41] shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0C2B1C]">Autonomous First-Pass Processing</h4>
                    <p className="text-[11px] text-[#52705F] leading-relaxed mt-0.5">
                      Vision OCR, rule-based job costing, and automated reconciliations so your reviewers touch only ~5% of exceptions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#D9F0E2] flex items-center justify-center text-[#0F7A41] shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0C2B1C]">Firm of Record (Your Brand)</h4>
                    <p className="text-[11px] text-[#52705F] leading-relaxed mt-0.5">
                      Client-facing reports, portals, and engagement communications feature your accounting firm's branding.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D9F0E2]">
                <div className="text-[11px] font-mono text-[#52705F] bg-white border border-[#D9F0E2] rounded-xl p-3 text-center">
                  Zero setup fee · Migration handled 100% by Retalyy
                </div>
              </div>
            </div>

            {/* Right: Firm Access Form */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-4 text-[#52705F]">
                  Enter Firm Credentials
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0C2B1C] mb-1">
                      Accounting Firm Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={firmName}
                        onChange={e => setFirmName(e.target.value)}
                        placeholder="e.g. Vance & Associates CPAs"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0C2B1C] mb-1">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="e.g. Elena Vance, CPA"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0C2B1C] mb-1">
                      Work Email *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        placeholder="you@yourfirm.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0C2B1C] mb-1">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value as any)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D9F0E2] bg-white focus:outline-none focus:border-[#27B665]"
                      >
                        <option value="cpa_controller">Senior CPA & Controller</option>
                        <option value="staff_accountant">Staff Accountant</option>
                        <option value="firm_admin">Managing Partner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0C2B1C] mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={e => setPasswordInput(e.target.value)}
                          placeholder="Password"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="ret-btn w-full justify-center mt-3 text-xs font-bold cursor-pointer"
                  >
                    <span>Submit Credentials & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="text-[10px] text-center mt-4 pt-3 border-t border-neutral-100 text-[#52705F]">
                Secure Multi-Tenant Architecture · SOC 2 Compliant · 256-Bit SSL
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
