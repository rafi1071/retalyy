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
  ChevronRight
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
    color: '#22c55e',
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

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({ onLogin }) => {
  const [selectedPersona, setSelectedPersona] = useState<UserSession>(PERSONAS[0]);
  const [emailInput, setEmailInput] = useState(PERSONAS[0].email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [isHovering, setIsHovering] = useState<string | null>(null);

  const handleSelectPersona = (p: UserSession) => {
    setSelectedPersona(p);
    setEmailInput(p.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedPersona);
  };

  const config = ROLE_CONFIG[selectedPersona.role];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden"
         style={{ background: 'var(--bg-base)' }}>

      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
             style={{ background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
                      transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
             style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-[960px] space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3 animate-fade-in-up">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg tracking-tighter"
                 style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                          boxShadow: '0 0 24px rgba(99, 102, 241, 0.25)' }}>
              R
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}>
            Sign in to Retalyy
          </h1>
          <p className="text-sm max-w-md mx-auto"
             style={{ color: 'var(--text-tertiary)' }}>
            Select your workspace role to access your dedicated workflow.
          </p>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden animate-scale-in"
             style={{
               background: 'var(--bg-elevated)',
               border: '1px solid var(--border-primary)',
               borderRadius: 'var(--radius-2xl)',
               boxShadow: 'var(--shadow-xl), var(--shadow-glow)'
             }}>

          {/* Left: Persona List */}
          <div className="lg:col-span-7 p-6 sm:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-4"
                 style={{ color: 'var(--text-muted)' }}>
              Select Role
            </div>

            <div className="space-y-1.5">
              {PERSONAS.map((p, i) => {
                const isSelected = selectedPersona.id === p.id;
                const isHovered = isHovering === p.id;
                const roleConfig = ROLE_CONFIG[p.role];

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    onMouseEnter={() => setIsHovering(p.id)}
                    onMouseLeave={() => setIsHovering(null)}
                    className="group relative flex items-center gap-3.5 px-3.5 py-3 cursor-pointer transition-all"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      background: isSelected
                        ? 'var(--bg-surface-active)'
                        : isHovered
                          ? 'var(--bg-surface-hover)'
                          : 'transparent',
                      border: `1px solid ${isSelected ? 'var(--border-active)' : 'transparent'}`,
                      animationDelay: `${i * 50}ms`,
                      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Selected indicator bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                           style={{ background: roleConfig.color }} />
                    )}

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0 text-white"
                         style={{
                           background: isSelected
                             ? roleConfig.color
                             : 'var(--bg-surface)',
                           border: isSelected ? 'none' : '1px solid var(--border-primary)',
                           transition: 'all 200ms ease'
                         }}>
                      {p.name[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium truncate"
                              style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {p.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  background: isSelected ? `${roleConfig.color}18` : 'var(--bg-surface)',
                                  color: isSelected ? roleConfig.color : 'var(--text-muted)',
                                  border: `1px solid ${isSelected ? `${roleConfig.color}25` : 'var(--border-secondary)'}`,
                                }}>
                            {roleConfig.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity"
                                        style={{ color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                      <p className="text-[11px] mt-0.5 truncate"
                         style={{ color: 'var(--text-muted)' }}>
                        {p.roleTitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8"
               style={{
                 borderLeft: '1px solid var(--border-primary)',
                 background: 'var(--bg-surface)',
               }}>

            {/* Selected persona preview */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white text-sm"
                     style={{ background: config.color }}>
                  {selectedPersona.name[0]}
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedPersona.name}
                  </h4>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {selectedPersona.firmName}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium mb-1.5"
                         style={{ color: 'var(--text-tertiary)' }}>
                    Email
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] font-mono focus:outline-none"
                      style={{
                        background: 'var(--bg-base)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        transition: 'border-color 200ms ease',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1.5"
                         style={{ color: 'var(--text-tertiary)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] focus:outline-none"
                      style={{
                        background: 'var(--bg-base)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        transition: 'border-color 200ms ease',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
                    />
                  </div>
                </div>

                {/* Workspace badge */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                     style={{
                       background: `${config.color}08`,
                       border: `1px solid ${config.color}15`,
                     }}>
                  <div style={{ color: config.color }}>{config.icon}</div>
                  <div>
                    <span className="text-[11px] font-medium block" style={{ color: config.color }}>
                      {config.label} Workspace
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {config.description}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-[13px] font-semibold text-white flex items-center justify-center gap-2 group"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2), 0 0 20px rgba(99, 102, 241, 0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2), 0 0 32px rgba(99, 102, 241, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2), 0 0 20px rgba(99, 102, 241, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>

            <div className="text-[10px] text-center mt-6 pt-4"
                 style={{ borderTop: '1px solid var(--border-secondary)', color: 'var(--text-muted)' }}>
              Secure Multi-Tenant Architecture · SOC 2 Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
