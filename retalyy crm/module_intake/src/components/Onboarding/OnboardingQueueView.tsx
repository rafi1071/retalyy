import React, { useState, useRef } from 'react';
import {
  Client,
  ClientLifecycleStatus,
  IdentityDocument
} from '../../types';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Plus,
  Building2,
  ArrowRight,
  FolderOpen,
  DollarSign,
  Briefcase,
  Eye,
  UploadCloud,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';

interface OnboardingQueueViewProps {
  clients: Client[];
  onOpenOnboardingModal: () => void;
  onSelectClientFolder: (clientId: string) => void;
  onActivateClient: (clientId: string) => void;
  onUpdateClientIdentity?: (clientId: string, doc: IdentityDocument) => void;
}

export const OnboardingQueueView: React.FC<OnboardingQueueViewProps> = ({
  clients,
  onOpenOnboardingModal,
  onSelectClientFolder,
  onActivateClient,
  onUpdateClientIdentity
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredClients = clients.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const pendingCount = clients.filter(c => c.status === 'pending_verification').length;
  const activeCount = clients.filter(c => c.status === 'active').length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const lower = file.name.toLowerCase();
    let docType: 'passport' | 'drivers_license' | 'state_id' | 'national_id' | 'incorporation_cert' = 'passport';
    if (lower.includes('license') || lower.includes('dl')) docType = 'drivers_license';
    else if (lower.includes('corp') || lower.includes('inc') || lower.includes('cert')) docType = 'incorporation_cert';
    else if (lower.includes('national')) docType = 'national_id';

    const newDoc: IdentityDocument = {
      id: `iddoc-${Date.now()}`,
      fileName: file.name,
      fileSize: sizeFormatted,
      documentType: docType,
      idNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      issuingAuthority: 'State / Federal Identity Authority',
      expirationDate: '2034-12-31',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified'
    };

    onUpdateClientIdentity?.(selectedClient.id, newDoc);
    setNotification(`✓ Identity document successfully updated for ${selectedClient.name}: "${file.name}"`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700" />
            Client Onboarding & Profile Registry
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Client onboarding comes before document intake: identify the client entity, perform compliance checks, define engagement fees, and establish the master profile.
          </p>
        </div>

        <button
          onClick={onOpenOnboardingModal}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Onboard New Client
        </button>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Clients (${clients.length})` },
          { id: 'pending_verification', label: `Pending Verification (${pendingCount})`, isAlert: pendingCount > 0 },
          { id: 'active', label: `Active (${activeCount})` },
          { id: 'approved', label: 'Approved' },
          { id: 'prospective', label: 'Prospective' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 2-Column Split: Client List & Full 3-Record Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client List */}
        <div className="space-y-3">
          {filteredClients.map(client => {
            const isSelected = selectedClient?.id === client.id;
            const isPending = client.status === 'pending_verification';

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all bg-white space-y-2 ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {client.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold capitalize ${
                    client.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : client.status === 'pending_verification'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {client.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Assigned Accountant: <span className="font-medium text-slate-800">{client.owningAccountant}</span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {client.masterRecord?.taxId ? `EIN: ${client.masterRecord.taxId}` : 'Tax ID Pending'} · {client.serviceTypes.join(', ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Selected Client Master, Engagement & Compliance Record */}
        {selectedClient && (
          <div className="lg:col-span-2 space-y-5">
            {/* Action Bar for Selected Client */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedClient.name}</h3>
                <span className="text-[11px] text-slate-500">
                  Client ID: <span className="font-mono">{selectedClient.id}</span> · Status:{' '}
                  <span className="font-semibold capitalize">{selectedClient.status.replace('_', ' ')}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedClient.status === 'pending_verification' && (
                  <button
                    onClick={() => onActivateClient(selectedClient.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Activate Client
                  </button>
                )}

                <button
                  onClick={() => onSelectClientFolder(selectedClient.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Open Client Folder
                </button>
              </div>
            </div>

            {/* RECORD 1: CLIENT MASTER RECORD */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  1. Client Master Record
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Legal Entity Profile
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Legal Entity Name</span>
                  <span className="font-semibold text-slate-900">{selectedClient.masterRecord?.legalName || selectedClient.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Structure</span>
                  <span className="capitalize text-slate-800 font-medium">{selectedClient.masterRecord?.legalStructure.replace('_', ' ') || 'LLC'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Federal Tax ID (EIN)</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedClient.masterRecord?.taxId || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Industry</span>
                  <span className="text-slate-800">{selectedClient.masterRecord?.industry || 'Commercial Services'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Jurisdiction</span>
                  <span className="text-slate-800">{selectedClient.masterRecord?.stateJurisdiction || 'United States'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Accounting Basis</span>
                  <span className="capitalize text-slate-800 font-mono">{selectedClient.masterRecord?.accountingBasis || 'Accrual'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase mb-1">Registered Address</span>
                <span className="text-slate-700">{selectedClient.masterRecord?.registeredAddress || 'Corporate Address on file'}</span>
              </div>
            </div>

            {/* RECORD 2: ENGAGEMENT RECORD */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-600" />
                  2. Engagement & Agreement Record
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Purchased Services & Fees
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Monthly Retainer</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedClient.engagementRecord?.monthlyFee || '$1,850/mo'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Services Contracted</span>
                  <span className="text-slate-800 font-semibold">
                    {selectedClient.serviceTypes.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Signed Agreement</span>
                  <span className={`font-semibold ${
                    selectedClient.engagementRecord?.engagementAgreementSigned ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {selectedClient.engagementRecord?.engagementAgreementSigned ? '✓ Signed & on file' : 'Pending Client Signature'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">IRS Form 8821 Auth</span>
                  <span className={`font-semibold ${
                    selectedClient.engagementRecord?.taxAuthorizationForm8821 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {selectedClient.engagementRecord?.taxAuthorizationForm8821 ? '✓ Authorized' : 'Pending Authorization'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hidden file input for uploading/updating identity document */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            />

            {/* Notification alert */}
            {notification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* RECORD 3: COMPLIANCE & ACCEPTANCE RECORD */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  3. Acceptance & Compliance Checks
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Update Identity Doc</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    KYC / FinCEN BOI
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Assessed Risk Level</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {selectedClient.complianceRecord?.riskRating || 'LOW RISK'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Identity Verified</span>
                  <span className={`font-semibold ${
                    selectedClient.complianceRecord?.identityVerified ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {selectedClient.complianceRecord?.identityVerified ? '✓ Identity Verified' : '⚠️ Pending ID Upload'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Registration Verified</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedClient.complianceRecord?.businessRegistrationVerified ? '✓ Good Standing' : '⚠️ Pending Check'}
                  </span>
                </div>
              </div>

              {/* Verified Identity Document Details Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Primary Officer Identity Document On File
                  </span>
                  {selectedClient.complianceRecord?.identityDocument && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-100 text-emerald-800">
                      {selectedClient.complianceRecord.identityDocument.verificationStatus}
                    </span>
                  )}
                </div>

                {selectedClient.complianceRecord?.identityDocument ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">
                            {selectedClient.complianceRecord.identityDocument.fileName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({selectedClient.complianceRecord.identityDocument.fileSize})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          <span className="uppercase font-semibold text-slate-700">
                            {selectedClient.complianceRecord.identityDocument.documentType.replace('_', ' ')}
                          </span>
                          {' '}· ID #{selectedClient.complianceRecord.identityDocument.idNumber || 'N/A'} · Exp: {selectedClient.complianceRecord.identityDocument.expirationDate || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Update ID Doc
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <span className="font-bold text-amber-900 text-xs block">
                        No Officer Identity Document Attached
                      </span>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Upload passport or government driver's license to complete compliance due diligence.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload ID Document
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-800">Compliance Notes:</strong> {selectedClient.complianceRecord?.complianceNotes || 'Identity verification verified through state registration records and verified bank connection.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Identity Document Preview Modal */}
      {showPreviewModal && selectedClient.complianceRecord?.identityDocument && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Officer Identity Credential Record</h3>
                  <p className="text-[10px] text-slate-400">
                    {selectedClient.name} · Compliance Archive
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-lg relative overflow-hidden border border-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400">
                    {selectedClient.complianceRecord.identityDocument.documentType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 items-center">
                  <div className="w-20 h-24 rounded-lg bg-slate-800 border border-slate-600 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                    <Users className="w-8 h-8 text-slate-500 mb-1" />
                    <span className="text-[8px] font-mono uppercase text-slate-400">PHOTO ID</span>
                  </div>

                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Holder</span>
                      <span className="font-bold text-sm text-white">{selectedClient.masterRecord?.primaryContact.name || selectedClient.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/50">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 block">Doc Number</span>
                        <span className="font-mono font-bold text-amber-300">{selectedClient.complianceRecord.identityDocument.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 block">Expiration</span>
                        <span className="font-mono text-slate-200">{selectedClient.complianceRecord.identityDocument.expirationDate}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      <span>Issuing Authority: </span>
                      <strong className="text-slate-200">{selectedClient.complianceRecord.identityDocument.issuingAuthority}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 block">{selectedClient.complianceRecord.identityDocument.fileName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    File Size: {selectedClient.complianceRecord.identityDocument.fileSize}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Update Document</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
