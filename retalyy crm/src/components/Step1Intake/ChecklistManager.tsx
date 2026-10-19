import React, { useState } from 'react';
import {
  Client,
  ClientAccount,
  ChecklistTemplate,
  ChecklistRequirement,
  ChecklistProposal,
  DocumentClassificationType
} from '../types';
import {
  CheckSquare,
  Building,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Banknote,
  Users
} from 'lucide-react';

interface ChecklistManagerProps {
  clients: Client[];
  accounts: ClientAccount[];
  checklists: ChecklistTemplate[];
  proposals: ChecklistProposal[];
  onToggleAccountStatus: (accountId: string) => void;
  onAddRequirement: (templateId: string, req: Omit<ChecklistRequirement, 'id'>) => void;
  onRemoveRequirement: (templateId: string, reqId: string) => void;
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  clients,
  accounts,
  checklists,
  proposals,
  onToggleAccountStatus,
  onAddRequirement,
  onRemoveRequirement,
  onAcceptProposal,
  onDeclineProposal
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for adding requirement
  const [newDocType, setNewDocType] = useState<DocumentClassificationType>('bank_statement');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newInstitution, setNewInstitution] = useState<string>('');
  const [newSuffix, setNewSuffix] = useState<string>('');
  const [newFreq, setNewFreq] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [newExemptDormant, setNewExemptDormant] = useState<boolean>(true);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientAccounts = accounts.filter(a => a.clientId === selectedClientId);
  const clientChecklist = checklists.find(c => c.clientId === selectedClientId) || checklists[0];
  const clientProposals = proposals.filter(p => p.clientId === selectedClientId && p.status === 'pending_review');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !clientChecklist) return;

    onAddRequirement(clientChecklist.id, {
      documentType: newDocType,
      description: newDesc,
      targetInstitution: newInstitution || undefined,
      targetAccountSuffix: newSuffix || undefined,
      frequency: newFreq,
      isExemptIfDormant: newExemptDormant
    });

    setNewDesc('');
    setNewInstitution('');
    setNewSuffix('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Client Switcher */}
      <div
        className="p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Checklist Templates & Account Registers
          </h2>
          <p className="text-xs mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The checklist engine is plain rules: documents are only flagged missing if defined here. Accountants maintain checklists, and the system proposes updates when new accounts appear.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Client:</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="text-xs rounded-lg px-3 py-2 font-medium focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* System Proposed Updates Banner */}
      {clientProposals.length > 0 && (
        <div className="space-y-3">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: 'var(--color-warning)' }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            System Proposed Checklist Updates (Awaiting Accountant Review)
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Strict system rule: The engine never modifies a checklist automatically. It observes recurring transaction patterns and proposes edits for human sign-off.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientProposals.map(prop => (
              <div
                key={prop.id}
                className="p-4 rounded-xl space-y-3"
                style={{
                  background: 'var(--color-warning-subtle)',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs" style={{ color: 'var(--color-warning)' }}>{prop.proposedChange}</span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Detected from {prop.detectedFromDoc}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {prop.reason}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onAcceptProposal(prop.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      background: 'var(--accent-primary)',
                      color: '#ffffff'
                    }}
                  >
                    Accept & Update Checklist
                  </button>
                  <button
                    onClick={() => onDeclineProposal(prop.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Registered Financial & Payroll Accounts */}
        <div className="space-y-4">
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <h3
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Connected Client Accounts
              </h3>
              <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {clientAccounts.length} accounts
              </span>
            </div>

            <div className="space-y-2.5">
              {clientAccounts.length === 0 ? (
                <p className="text-xs py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  No accounts registered for this client.
                </p>
              ) : (
                clientAccounts.map(acc => {
                  const isDormant = acc.status === 'dormant';
                  return (
                    <div
                      key={acc.id}
                      className="p-3 rounded-xl space-y-2"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-secondary)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {acc.type === 'bank' && <Banknote className="w-4 h-4 text-indigo-400" />}
                          {acc.type === 'card' && <CreditCard className="w-4 h-4 text-indigo-400" />}
                          {acc.type === 'payroll' && <Users className="w-4 h-4 text-indigo-400" />}
                          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                            {acc.institution}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-medium tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          ...{acc.identifierSuffix}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{acc.notes || acc.type}</span>
                        <button
                          onClick={() => onToggleAccountStatus(acc.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer"
                          style={{
                            background: isDormant ? 'var(--color-warning-subtle)' : 'var(--color-success-subtle)',
                            color: isDormant ? 'var(--color-warning)' : 'var(--color-success)',
                            border: isDormant ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          {isDormant ? 'Dormant (Exempt)' : 'Active'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-[11px] leading-relaxed pt-3" style={{ borderTop: '1px solid var(--border-secondary)', color: 'var(--text-muted)' }}>
              Tip: Toggling an account to Dormant instructs the Checklist Engine to exempt it from monthly missing flags while zero activity persists.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Expected-Document Checklist Rules */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="p-5 rounded-2xl space-y-4"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <div>
                <h3
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Active Checklist Requirements ({selectedClient.name})
                </h3>
                <span className="text-[11px] font-mono tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  Template Version v{clientChecklist?.version || 1} · Period Type: {clientChecklist?.periodType || 'monthly'}
                </span>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff'
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Requirement
              </button>
            </div>

            {/* Requirements Table */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-secondary)'
              }}
            >
              <table className="w-full text-left text-xs">
                <thead
                  className="uppercase font-semibold text-[10px]"
                  style={{
                    borderBottom: '1px solid var(--border-secondary)',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Target Provider / Suffix</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Dormant Rule</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
                  {clientChecklist && clientChecklist.requirements.length > 0 ? (
                    clientChecklist.requirements.map(req => (
                      <tr key={req.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                          {req.description}
                        </td>
                        <td className="py-3 px-3 font-mono tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          {req.targetInstitution || 'Any'} {req.targetAccountSuffix ? `...${req.targetAccountSuffix}` : ''}
                        </td>
                        <td className="py-3 px-3 capitalize" style={{ color: 'var(--text-secondary)' }}>
                          {req.frequency}
                        </td>
                        <td className="py-3 px-3 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          {req.isExemptIfDormant ? 'Exempt if dormant' : 'Required regardless'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onRemoveRequirement(clientChecklist.id, req.id)}
                            className="p-1 rounded transition-colors cursor-pointer hover:text-rose-400"
                            style={{ color: 'var(--text-muted)' }}
                            title="Remove requirement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                        No requirements configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Documented Exceptions */}
            {clientChecklist && clientChecklist.exceptions.length > 0 && (
              <div
                className="p-3.5 rounded-xl text-xs space-y-1.5"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <span className="font-semibold block" style={{ color: 'var(--text-secondary)' }}>Documented Exceptions:</span>
                {clientChecklist.exceptions.map((ex, i) => (
                  <p key={i} className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    • {ex}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Requirement Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(5, 5, 10, 0.75)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            className="rounded-2xl max-w-md w-full p-6 space-y-4 animate-fade-in"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hover)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Add Expected Document Requirement
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Document Classification
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as DocumentClassificationType)}
                  className="w-full p-2.5 rounded-lg text-xs"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="bank_statement">Bank Statement</option>
                  <option value="card_statement">Card Statement</option>
                  <option value="payroll_report">Payroll Report</option>
                  <option value="tax_form_941">Quarterly Form 941</option>
                  <option value="sales_summary">Sales & Invoicing Summary</option>
                  <option value="vendor_invoice">Vendor Invoices Batch</option>
                </select>
              </div>

              <div>
                <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Requirement Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Chase Checking Statement (...4102)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs focus:outline-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Institution (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JPMorgan Chase"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    className="w-full p-2.5 rounded-lg text-xs focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
                <div>
                  <label className="font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Account Suffix (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4102"
                    value={newSuffix}
                    onChange={(e) => setNewSuffix(e.target.value)}
                    className="w-full p-2.5 rounded-lg text-xs font-mono focus:outline-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="exemptDormant"
                  checked={newExemptDormant}
                  onChange={(e) => setNewExemptDormant(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="exemptDormant" className="cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  Exempt from missing flags if account is marked dormant
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg font-medium text-xs cursor-pointer"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-xs cursor-pointer transition-all"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff'
                  }}
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
