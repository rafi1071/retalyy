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
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-slate-700" />
            Checklist Templates & Account Registers
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            The checklist engine is plain rules: documents are only flagged missing if defined here. Accountants maintain checklists, and the system proposes updates when new accounts appear.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">Client:</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* System Proposed Updates Banner (Design doc requirement) */}
      {clientProposals.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            System Proposed Checklist Updates (Awaiting Accountant Review)
          </h3>
          <p className="text-xs text-slate-500">
            Strict system rule: The engine never modifies a checklist automatically. It observes recurring transaction patterns and proposes edits for human sign-off.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientProposals.map(prop => (
              <div
                key={prop.id}
                className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-950">{prop.proposedChange}</span>
                  <span className="text-[10px] font-mono text-amber-800">Detected from {prop.detectedFromDoc}</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  {prop.reason}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onAcceptProposal(prop.id)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    Accept & Update Checklist
                  </button>
                  <button
                    onClick={() => onDeclineProposal(prop.id)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors"
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
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Connected Client Accounts
              </h3>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {clientAccounts.length} accounts
              </span>
            </div>

            <div className="space-y-3">
              {clientAccounts.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No accounts registered for this client.
                </p>
              ) : (
                clientAccounts.map(acc => {
                  const isDormant = acc.status === 'dormant';
                  return (
                    <div
                      key={acc.id}
                      className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {acc.type === 'bank' && <Banknote className="w-4 h-4 text-slate-500" />}
                          {acc.type === 'card' && <CreditCard className="w-4 h-4 text-slate-500" />}
                          {acc.type === 'payroll' && <Users className="w-4 h-4 text-slate-500" />}
                          <span className="font-semibold text-xs text-slate-900">
                            {acc.institution}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                          ...{acc.identifierSuffix}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{acc.notes || acc.type}</span>
                        <button
                          onClick={() => onToggleAccountStatus(acc.id)}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                            isDormant
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {isDormant ? 'Dormant (Exempt)' : 'Active'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              Tip: Toggling an account to Dormant instructs the Checklist Engine to exempt it from monthly missing flags while zero activity persists.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Expected-Document Checklist Rules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Checklist Requirements ({selectedClient.name})
                </h3>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  Template Version v{clientChecklist?.version || 1} · Period Type: {clientChecklist?.periodType || 'monthly'}
                </span>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Requirement
              </button>
            </div>

            {/* Requirements Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Target Provider / Suffix</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Dormant Rule</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientChecklist && clientChecklist.requirements.length > 0 ? (
                    clientChecklist.requirements.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {req.description}
                        </td>
                        <td className="py-3 px-3 font-mono tabular-nums text-slate-600">
                          {req.targetInstitution || 'Any'} {req.targetAccountSuffix ? `...${req.targetAccountSuffix}` : ''}
                        </td>
                        <td className="py-3 px-3 capitalize text-slate-700">
                          {req.frequency}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-500">
                          {req.isExemptIfDormant ? 'Exempt if dormant' : 'Required regardless'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onRemoveRequirement(clientChecklist.id, req.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove requirement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No requirements configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Documented Exceptions */}
            {clientChecklist && clientChecklist.exceptions.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-slate-700 block">Documented Exceptions:</span>
                {clientChecklist.exceptions.map((ex, i) => (
                  <p key={i} className="text-slate-600 text-[11px]">
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Add Expected Document Requirement
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Document Classification
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as DocumentClassificationType)}
                  className="w-full p-2 border border-slate-300 rounded-md font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
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
                <label className="font-semibold text-slate-700 block mb-1">
                  Requirement Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Chase Checking Statement (...4102)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Institution (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JPMorgan Chase"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Account Suffix (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4102"
                    value={newSuffix}
                    onChange={(e) => setNewSuffix(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="exemptDormant"
                  checked={newExemptDormant}
                  onChange={(e) => setNewExemptDormant(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="exemptDormant" className="text-slate-700 cursor-pointer">
                  Exempt from missing flags if account is marked dormant
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition-colors"
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
