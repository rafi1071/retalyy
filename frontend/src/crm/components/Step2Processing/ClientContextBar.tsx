import React from 'react';
import { Building2, ShieldCheck, UserCheck, Scale, ChevronDown } from 'lucide-react';
import { ClientProfile, UserRole } from '../types/accounting';
import { MOCK_CLIENTS } from '../data/mockData';

interface ClientContextBarProps {
  selectedClient?: ClientProfile;
  setSelectedClient?: (client: ClientProfile) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  // Optional aliases for flexibility
  client?: ClientProfile;
  role?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onOpenCoa?: () => void;
  onOpenBenchmark?: () => void;
}

export const ClientContextBar: React.FC<ClientContextBarProps> = ({
  selectedClient,
  setSelectedClient,
  currentRole: propRole,
  setCurrentRole: propSetRole,
  client: altClient,
  role: altRole,
  onRoleChange,
  onOpenCoa,
  onOpenBenchmark
}) => {
  const activeClient = selectedClient || altClient || MOCK_CLIENTS[0];
  const activeRole = propRole || altRole || 'staff_accountant';
  const handleRoleChange = propSetRole || onRoleChange || (() => {});

  const selectStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '4px 24px 4px 8px',
    transition: 'border-color 150ms ease',
  };

  return (
    <div
      className="w-full max-w-full overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-primary)',
      }}
    >
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Client Selector & Onboarding Context */}
        <div className="flex items-center gap-3 text-[12px]">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="font-medium" style={{ color: 'var(--text-tertiary)' }}>Entity:</span>
          </div>

          <div className="relative">
            <select
              value={activeClient.id}
              onChange={(e) => {
                const found = MOCK_CLIENTS.find((c) => c.id === e.target.value);
                if (found && setSelectedClient) setSelectedClient(found);
              }}
              className="appearance-none focus:outline-none"
              style={selectStyle}
            >
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                         style={{ color: 'var(--text-muted)' }} />
          </div>

          <span style={{ color: 'var(--border-hover)' }}>·</span>
          <span style={{ color: 'var(--text-muted)' }}>{activeClient.industry}</span>
          <span style={{ color: 'var(--border-hover)' }}>·</span>

          <span className="flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Step 1 Complete</span>
          </span>
        </div>

        {/* Accounting Policies & Role Switcher */}
        <div className="flex items-center gap-4 text-[12px]">
          {/* Policy Badges */}
          <div className="hidden lg:flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Scale className="w-3.5 h-3.5" />
            <span>{activeClient.accountingStandard}</span>
            <span style={{ color: 'var(--border-hover)' }}>·</span>
            <span>CapEx: <strong className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>${activeClient.capitalizationThreshold?.toLocaleString() || '2,500'}</strong></span>
            <span style={{ color: 'var(--border-hover)' }}>·</span>
            <span>Prepay: <strong className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>${activeClient.prepaymentThreshold?.toLocaleString() || '1,000'}</strong></span>
          </div>

          {/* User Role Selector */}
          <div className="flex items-center gap-2 pl-3"
               style={{ borderLeft: '1px solid var(--border-primary)' }}>
            <UserCheck className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="focus:outline-none"
              style={selectStyle}
            >
              <option value="bookkeeper">Bookkeeper (Extract & Standardize)</option>
              <option value="junior_accountant">Junior Accountant (Match & Flag)</option>
              <option value="staff_accountant">Staff Accountant (Classify & Journal)</option>
              <option value="senior_accountant">Senior Accountant / CPA (Approve & Post)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
