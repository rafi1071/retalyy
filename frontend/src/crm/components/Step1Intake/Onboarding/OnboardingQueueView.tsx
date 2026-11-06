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
            <Users className="w-5 h-5 text-indigo-400" />
            Client Onboarding & Profile Registry
          </h2>
          <p className="text-xs mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Client onboarding comes before document intake: identify the client entity, perform compliance checks, define engagement fees, and establish the master profile.
          </p>
        </div>

        <button
          onClick={onOpenOnboardingModal}
          className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          style={{
            background: 'var(--accent-primary)',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
          }}
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
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            style={{
              background: statusFilter === tab.id ? 'var(--accent-primary)' : 'var(--bg-surface)',
              border: statusFilter === tab.id ? '1px solid transparent' : '1px solid var(--border-primary)',
              color: statusFilter === tab.id ? '#ffffff' : 'var(--text-secondary)'
            }}
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

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className="p-4 rounded-xl cursor-pointer transition-all space-y-2"
                style={{
                  background: 'var(--bg-surface)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                  boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.15)' : 'var(--shadow-sm)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                    {client.name}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-medium capitalize"
                    style={{
                      background: client.status === 'active'
                        ? 'var(--color-success-subtle)'
                        : client.status === 'pending_verification'
                        ? 'var(--color-warning-subtle)'
                        : 'var(--bg-elevated)',
                      color: client.status === 'active'
                        ? 'var(--color-success)'
                        : client.status === 'pending_verification'
                        ? 'var(--color-warning)'
                        : 'var(--text-tertiary)'
                    }}
                  >
                    {client.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  Assigned Accountant: <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{client.owningAccountant}</span>
                </div>

                <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
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
            <div
              className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedClient.name}</h3>
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  Client ID: <span className="font-mono">{selectedClient.id}</span> · Status:{' '}
                  <span className="font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>{selectedClient.status.replace('_', ' ')}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedClient.status === 'pending_verification' && (
                  <button
                    onClick={() => onActivateClient(selectedClient.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    style={{
                      background: 'var(--color-success)',
                      color: '#ffffff'
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Activate Client
                  </button>
                )}

                <button
                  onClick={() => onSelectClientFolder(selectedClient.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Open Client Folder
                </button>
              </div>
            </div>

            {/* RECORD 1: CLIENT MASTER RECORD */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <h4
                  className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  1. Client Master Record
                </h4>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Legal Entity Profile
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Legal Entity Name</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedClient.masterRecord?.legalName || selectedClient.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Structure</span>
                  <span className="capitalize" style={{ color: 'var(--text-secondary)' }}>{selectedClient.masterRecord?.legalStructure.replace('_', ' ') || 'LLC'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Federal Tax ID (EIN)</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{selectedClient.masterRecord?.taxId || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Industry</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedClient.masterRecord?.industry || 'Commercial Services'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Jurisdiction</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedClient.masterRecord?.stateJurisdiction || 'United States'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Accounting Basis</span>
                  <span className="capitalize font-mono" style={{ color: 'var(--text-secondary)' }}>{selectedClient.masterRecord?.accountingBasis || 'Accrual'}</span>
                </div>
              </div>

              <div className="pt-2 text-xs" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                <span className="text-[10px] uppercase block mb-1" style={{ color: 'var(--text-muted)' }}>Registered Address</span>
                <span style={{ color: 'var(--text-secondary)' }}>{selectedClient.masterRecord?.registeredAddress || 'Corporate Address on file'}</span>
              </div>
            </div>

            {/* RECORD 2: ENGAGEMENT RECORD */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <h4
                  className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  2. Engagement & Agreement Record
                </h4>
                <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  Purchased Services & Fees
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Monthly Retainer</span>
                  <span className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {selectedClient.engagementRecord?.monthlyFee || '$1,850/mo'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Services Contracted</span>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {selectedClient.serviceTypes.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Signed Agreement</span>
                  <span
                    className="font-medium"
                    style={{
                      color: selectedClient.engagementRecord?.engagementAgreementSigned
                        ? 'var(--color-success)'
                        : 'var(--color-warning)'
                    }}
                  >
                    {selectedClient.engagementRecord?.engagementAgreementSigned ? '✓ Signed & on file' : 'Pending Signature'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>IRS Form 8821 Auth</span>
                  <span
                    className="font-medium"
                    style={{
                      color: selectedClient.engagementRecord?.taxAuthorizationForm8821
                        ? 'var(--color-success)'
                        : 'var(--color-warning)'
                    }}
                  >
                    {selectedClient.engagementRecord?.taxAuthorizationForm8821 ? '✓ Authorized' : 'Pending Authorization'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            />

            {/* Notification alert */}
            {notification && (
              <div
                className="p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in"
                style={{
                  background: 'var(--color-success-subtle)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: 'var(--color-success)'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* RECORD 3: COMPLIANCE & ACCEPTANCE RECORD */}
            <div
              className="p-5 rounded-2xl space-y-4"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <h4
                  className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  3. Acceptance & Compliance Checks
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <UploadCloud className="w-3 h-3 text-indigo-400" />
                    <span>Update Identity Doc</span>
                  </button>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    KYC / FinCEN BOI
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)'
                  }}
                >
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Assessed Risk Level</span>
                  <span className="font-semibold uppercase" style={{ color: 'var(--text-primary)' }}>
                    {selectedClient.complianceRecord?.riskRating || 'LOW RISK'}
                  </span>
                </div>

                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)'
                  }}
                >
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Identity Verified</span>
                  <span
                    className="font-semibold"
                    style={{
                      color: selectedClient.complianceRecord?.identityVerified
                        ? 'var(--color-success)'
                        : 'var(--color-warning)'
                    }}
                  >
                    {selectedClient.complianceRecord?.identityVerified ? '✓ Identity Verified' : '⚠️ Pending ID Upload'}
                  </span>
                </div>

                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)'
                  }}
                >
                  <span className="text-[10px] uppercase block" style={{ color: 'var(--text-muted)' }}>Registration Verified</span>
                  <span className="font-semibold" style={{ color: 'var(--color-success)' }}>
                    {selectedClient.complianceRecord?.businessRegistrationVerified ? '✓ Good Standing' : '⚠️ Pending Check'}
                  </span>
                </div>
              </div>

              {/* Verified Identity Document Details Box */}
              <div
                className="p-3.5 rounded-xl space-y-2.5"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Primary Officer Identity Document On File
                  </span>
                  {selectedClient.complianceRecord?.identityDocument && (
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase"
                      style={{
                        background: 'var(--color-success-subtle)',
                        color: 'var(--color-success)'
                      }}
                    >
                      {selectedClient.complianceRecord.identityDocument.verificationStatus}
                    </span>
                  )}
                </div>

                {selectedClient.complianceRecord?.identityDocument ? (
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--accent-primary-hover)'
                        }}
                      >
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                            {selectedClient.complianceRecord.identityDocument.fileName}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            ({selectedClient.complianceRecord.identityDocument.fileSize})
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          <span className="uppercase font-medium" style={{ color: 'var(--text-secondary)' }}>
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
                        className="px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1 transition-all cursor-pointer"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-secondary)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        View Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1 transition-all cursor-pointer"
                        style={{
                          background: 'var(--accent-primary)',
                          color: '#ffffff'
                        }}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Update ID Doc
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl"
                    style={{
                      background: 'var(--color-warning-subtle)',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <div>
                      <span className="font-semibold text-xs block" style={{ color: 'var(--color-warning)' }}>
                        No Officer Identity Document Attached
                      </span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        Upload passport or government driver&apos;s license to complete compliance due diligence.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: 'var(--color-warning)'
                      }}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload ID Document
                    </button>
                  </div>
                )}
              </div>

              <div
                className="text-xs leading-relaxed p-3 rounded-xl"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)',
                  color: 'var(--text-secondary)'
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>Compliance Notes:</strong> {selectedClient.complianceRecord?.complianceNotes || 'Identity verification verified through state registration records and verified bank connection.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Identity Document Preview Modal */}
      {showPreviewModal && selectedClient.complianceRecord?.identityDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(5, 5, 10, 0.75)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            className="rounded-2xl max-w-lg w-full overflow-hidden animate-fade-in"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hover)',
              boxShadow: 'var(--shadow-xl)'
            }}
          >
            <div
              className="p-4 px-5 flex items-center justify-between"
              style={{
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-primary)'
              }}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Officer Identity Credential Record</h3>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                    {selectedClient.name} · Compliance Archive
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                className="p-5 rounded-xl relative overflow-hidden"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
                    {selectedClient.complianceRecord.identityDocument.documentType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
                    style={{
                      background: 'var(--color-success-subtle)',
                      color: 'var(--color-success)',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 items-center">
                  <div
                    className="w-20 h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center"
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-secondary)'
                    }}
                  >
                    <Users className="w-8 h-8 mb-1" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[8px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>PHOTO ID</span>
                  </div>

                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>Holder</span>
                      <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedClient.masterRecord?.primaryContact.name || selectedClient.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                      <div>
                        <span className="text-[9px] uppercase block" style={{ color: 'var(--text-muted)' }}>Doc Number</span>
                        <span className="font-mono font-semibold" style={{ color: 'var(--color-warning)' }}>{selectedClient.complianceRecord.identityDocument.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase block" style={{ color: 'var(--text-muted)' }}>Expiration</span>
                        <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{selectedClient.complianceRecord.identityDocument.expirationDate}</span>
                      </div>
                    </div>

                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                      <span>Issuing Authority: </span>
                      <strong style={{ color: 'var(--text-secondary)' }}>{selectedClient.complianceRecord.identityDocument.issuingAuthority}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-xl flex items-center justify-between text-xs"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-secondary)'
                }}
              >
                <div>
                  <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>{selectedClient.complianceRecord.identityDocument.fileName}</span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    File Size: {selectedClient.complianceRecord.identityDocument.fileSize}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff'
                  }}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Update Document</span>
                </button>
              </div>
            </div>

            <div
              className="p-4 px-6 flex justify-end"
              style={{
                background: 'var(--bg-elevated)',
                borderTop: '1px solid var(--border-primary)'
              }}
            >
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-secondary)',
                  color: 'var(--text-secondary)'
                }}
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
