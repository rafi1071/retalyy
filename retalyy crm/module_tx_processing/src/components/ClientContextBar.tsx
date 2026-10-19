import React from 'react';
import { Building2, ShieldCheck, UserCheck, Scale, FileText, ChevronDown } from 'lucide-react';
import { ClientProfile, UserRole } from '../types/accounting';
import { MOCK_CLIENTS } from '../data/mockData';

interface ClientContextBarProps {
  selectedClient: ClientProfile;
  setSelectedClient: (client: ClientProfile) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export const ClientContextBar: React.FC<ClientContextBarProps> = ({
  selectedClient,
  setSelectedClient,
  currentRole,
  setCurrentRole,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Client Selector & Onboarding Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-slate-300">Client:</span>
          </div>

          <div className="relative">
            <select
              value={selectedClient.id}
              onChange={(e) => {
                const found = MOCK_CLIENTS.find((c) => c.id === e.target.value);
                if (found) setSelectedClient(found);
              }}
              className="appearance-none bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-medium pl-2.5 pr-7 py-1 rounded text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-slate-600">·</span>

          <span className="text-slate-400 font-normal">
            {selectedClient.industry}
          </span>

          <span className="text-slate-600">·</span>

          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Documents Ingested (Step 1 Complete)</span>
          </span>
        </div>

        {/* Accounting Policies & Role Switcher */}
        <div className="flex items-center gap-5">
          {/* Policy Badges */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedClient.accountingStandard}</span>
            <span className="text-slate-600">·</span>
            <span>CapEx: <strong className="text-slate-200 tabular-nums">${selectedClient.capitalizationThreshold.toLocaleString()}</strong></span>
            <span className="text-slate-600">·</span>
            <span>Prepay: <strong className="text-slate-200 tabular-nums">${selectedClient.prepaymentThreshold.toLocaleString()}</strong></span>
          </div>

          {/* User Role Selector */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-slate-800 border border-slate-700 text-white font-medium px-2 py-1 rounded text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
