import React, { useState } from 'react';
import { ClientProfile, NavigationTab } from '../types';
import { formatCurrency } from '../utils/taxCalculator';
import { RetalyyIconMark } from './RetalyyLogo';

interface VaultViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  clientProfile: ClientProfile;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
}

export const VaultView: React.FC<VaultViewProps> = ({ 
  setActiveTab, 
  clientProfile, 
  setClientProfile 
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(
    clientProfile.engagementLetterSigned ? 4 : clientProfile.consentSigned ? 3 : clientProfile.priorYearReturnUploaded ? 2 : 1
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(clientProfile.priorYearReturnUploaded);
  const [dragOver, setDragOver] = useState(false);

  // Digital Signature state for §7216 consent
  const [signatureText, setSignatureText] = useState(clientProfile.consentSignatureText || clientProfile.fullName || '');
  const [consentAccepted, setConsentAccepted] = useState(clientProfile.consentSigned);
  const [engagementSigned, setEngagementSigned] = useState(clientProfile.engagementLetterSigned);

  const handleSimulatedUpload = (fileName: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setClientProfile(prev => ({
        ...prev,
        priorYearReturnUploaded: true,
        priorYearFileName: fileName,
        extractedNetProfit: prev.extractedNetProfit || 175000
      }));
    }, 1100);
  };

  const handleSignConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureText.trim()) return;

    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    setClientProfile(prev => ({
      ...prev,
      consentSigned: true,
      consentTimestamp: timestamp,
      consentSignatureText: signatureText
    }));
    setConsentAccepted(true);
    setActiveStep(4);
  };

  const handleSignEngagement = () => {
    setEngagementSigned(true);
    setClientProfile(prev => ({
      ...prev,
      engagementLetterSigned: true
    }));
  };

  return (
    <div className="wrap py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9F0E2] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RetalyyIconMark size={20} />
            <div className="ret-pill">
              <i />
              <span>Section 3 · Secure Financial Vault</span>
            </div>
          </div>
          <h1 className="text-[clamp(32px,4vw,52px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
            Encrypted Client Onboarding & Documents
          </h1>
          <p className="text-sm text-[#52705F] mt-1.5">
            Enterprise-grade AES-256 encrypted cloud vault for financial ledgers & business records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-[#EDF9F1] border border-[#D9F0E2] text-[#0F7A41] rounded-full text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#27B665]" />
            <span>AES-256 Vault Active</span>
          </span>
          <button
            onClick={() => setActiveTab('findings')}
            className="ret-btn sm secondary"
          >
            View Live Plan
          </button>
        </div>
      </div>

      {/* 4-Step Progress Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveStep(1)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeStep === 1 
              ? 'bg-[#EDF9F1] border-[#27B665] shadow-sm' 
              : 'bg-white border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          <div className="text-[11px] font-mono font-bold uppercase text-[#52705F]">Step 1</div>
          <div className="font-bold text-sm text-[#0C2B1C] mt-0.5">Identity & Entity</div>
          <div className="text-xs text-[#52705F] truncate">{clientProfile.businessName || 'Business profile'}</div>
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeStep === 2 
              ? 'bg-[#EDF9F1] border-[#27B665] shadow-sm' 
              : 'bg-white border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          <div className="text-[11px] font-mono font-bold uppercase text-[#52705F]">Step 2</div>
          <div className="font-bold text-sm text-[#0C2B1C] mt-0.5">Financial Documents / P&L</div>
          <div className="text-xs text-[#52705F]">
            {uploadSuccess ? '✓ Documents Loaded' : 'Upload prior year'}
          </div>
        </button>

        <button
          onClick={() => setActiveStep(3)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeStep === 3 
              ? 'bg-[#EDF9F1] border-[#27B665] shadow-sm' 
              : 'bg-white border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          <div className="text-[11px] font-mono font-bold uppercase text-[#52705F]">Step 3</div>
          <div className="font-bold text-sm text-[#0C2B1C] mt-0.5">Data Authorization</div>
          <div className="text-xs text-[#52705F]">
            {consentAccepted ? '✓ Signed & Logged' : 'E-signature required'}
          </div>
        </button>

        <button
          onClick={() => setActiveStep(4)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeStep === 4 
              ? 'bg-[#EDF9F1] border-[#27B665] shadow-sm' 
              : 'bg-white border-[#D9F0E2] hover:border-[#8EDDA6]'
          }`}
        >
          <div className="text-[11px] font-mono font-bold uppercase text-[#52705F]">Step 4</div>
          <div className="font-bold text-sm text-[#0C2B1C] mt-0.5">Service Agreement</div>
          <div className="text-xs text-[#52705F]">
            {engagementSigned ? '✓ Verified Active' : 'Sign agreement'}
          </div>
        </button>
      </div>

      {/* STEP 1: IDENTITY & BUSINESS PROFILE */}
      {activeStep === 1 && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
              Business Entity & Contact Verification
            </h3>
            <p className="text-sm text-[#52705F] mt-1">
              Minimum business information required to configure your financial ledger and company workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Taxpayer / Contact Name</label>
              <input
                type="text"
                value={clientProfile.fullName}
                onChange={(e) => setClientProfile(p => ({ ...p, fullName: e.target.value }))}
                placeholder="Jordan Miller"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Email Address</label>
              <input
                type="email"
                value={clientProfile.email}
                onChange={(e) => setClientProfile(p => ({ ...p, email: e.target.value }))}
                placeholder="jordan@consulting.com"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Legal Entity Name</label>
              <input
                type="text"
                value={clientProfile.businessName}
                onChange={(e) => setClientProfile(p => ({ ...p, businessName: e.target.value }))}
                placeholder="Miller Cloud Architect LLC"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">DBA / Trade Name (if different)</label>
              <input
                type="text"
                value={clientProfile.dba}
                onChange={(e) => setClientProfile(p => ({ ...p, dba: e.target.value }))}
                placeholder="Miller Tech Strategy"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Employer Identification Number (EIN)</label>
              <input
                type="text"
                value={clientProfile.ein}
                onChange={(e) => setClientProfile(p => ({ ...p, ein: e.target.value }))}
                placeholder="XX-XXXXXXX (e.g. 84-1928471)"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] font-mono focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Industry NAICS Code</label>
              <select
                value={clientProfile.industryNaics}
                onChange={(e) => setClientProfile(p => ({ ...p, industryNaics: e.target.value }))}
                className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white focus:outline-none focus:border-[#27B665]"
              >
                <option value="541512">541512 — Computer Systems Design & Software</option>
                <option value="541611">541611 — Strategic Management Consulting</option>
                <option value="541810">541810 — Advertising & Creative Agency</option>
                <option value="621111">621111 — Offices of Physicians & 1099 Medical</option>
                <option value="454110">454110 — Electronic Shopping & E-Commerce</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="ret-btn"
            >
              Continue to Step 2: Upload Financials →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRIOR-YEAR TAX RETURN PDF DROPZONE */}
      {activeStep === 2 && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 space-y-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
              Prior-Year Financial & P&L Statement Upload
            </h3>
            <p className="text-sm text-[#52705F] mt-1">
              Upload your prior-year financial statements, Schedule C, or trial balance. Our engine automatically parses ledger accounts, margins, and operational lines.
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleSimulatedUpload(files[0].name);
              }
            }}
            className={`border-2 border-dashed rounded-[28px] p-10 sm:p-14 text-center transition-all ${
              dragOver ? 'border-[#27B665] bg-[#EDF9F1]' : 'border-[#D9F0E2] hover:border-[#8EDDA6] bg-[#EDF9F1]/30'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-[#EDF9F1] border border-[#D9F0E2] text-[#0F7A41] flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="font-display font-bold text-lg text-[#0C2B1C]">
              Drag & Drop your Financial Statements or Tax Return (PDF)
            </div>
            <p className="text-xs text-[#52705F] mt-1 max-w-md mx-auto">
              Enterprise AES-256 encrypted end-to-end. Supports P&L statements, balance sheets, Schedule C, or Form 1120-S.
            </p>

            {isUploading && (
              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-[#0F7A41]">
                <span className="w-4 h-4 border-2 border-[#27B665] border-t-transparent rounded-full animate-spin" />
                <span>Encrypted Parsing & Ledger OCR Analysis...</span>
              </div>
            )}

            {!isUploading && !uploadSuccess && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => handleSimulatedUpload('2024_Financial_Statement_P&L.pdf')}
                  className="ret-btn sm"
                >
                  Load Sample Financial Statement PDF
                </button>
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-5 p-5 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex items-center gap-2 text-[#0F7A41] font-bold text-sm">
                  <span>✓ Uploaded: {clientProfile.priorYearFileName || '2024_Financial_Statement_P&L.pdf'}</span>
                </div>
                <div className="text-[12px] text-[#52705F] space-y-1 border-t border-[#D9F0E2] pt-2 font-mono">
                  <div>✓ Detected Annual Net Operating Revenue: $175,000</div>
                  <div>✓ Estimated Operating Cash Reserve Target: $24,726</div>
                  <div>✓ Operational Overhead Efficiency Found: $9,400+ annual buffer</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveStep(1)}
              className="text-xs font-bold text-[#52705F] hover:text-[#0C2B1C]"
            >
              ← Back to Identity
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="ret-btn"
            >
              Continue to Step 3: Data Consent →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DATA PROCESSING AUTHORIZATION */}
      {activeStep === 3 && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 space-y-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
              Data Processing & Ledger Integration Authorization
            </h3>
            <p className="text-sm text-[#52705F] mt-1">
              Authorizes Retalyy software to securely parse, classify, and format records for your operational ledger.
            </p>
          </div>

          <div className="h-48 overflow-y-auto p-5 rounded-2xl border border-[#D9F0E2] bg-[#EDF9F1]/40 text-xs text-[#52705F] leading-relaxed space-y-3 font-mono">
            <p className="font-bold text-[#0C2B1C] uppercase">
              Authorization for Financial Ledger Processing & Operational Analysis
            </p>
            <p>
              By executing this authorization, you grant Retalyy Inc. permission to parse, classify, and format your uploaded financial statements and business ledger data for operational modeling, job costing, cash forecasting, and partner review.
            </p>
            <p>
              <strong>Software Scope & Notice:</strong> Retalyy Inc. provides operational management software and ledger automation. Retalyy is not a public accounting or legal firm and does not provide formal legal, tax preparation, or investment advice. All reports and models are prepared for internal managerial use or final review by your designated partner accounting firm.
            </p>
            <p>
              <strong>Data Standard:</strong> Enterprise AES-256 Cloud Encryption with Multi-Factor Access Controls.
            </p>
          </div>

          <form onSubmit={handleSignConsent} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1">
                Type Your Legal Full Name as Electronic Signature
              </label>
              <input
                type="text"
                required
                placeholder="Jordan Miller"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full text-sm font-display px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="vault-consent-confirm"
                required
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[#D9F0E2] text-[#27B665]"
              />
              <label htmlFor="vault-consent-confirm" className="text-xs text-[#52705F]">
                I hereby authorize Retalyy software to securely process my uploaded financial records under enterprise AES-256 encryption.
              </label>
            </div>

            {clientProfile.consentTimestamp && (
              <div className="p-3.5 rounded-xl bg-[#EDF9F1] border border-[#D9F0E2] text-xs text-[#0F7A41] font-mono">
                ✓ Recorded signature: "{clientProfile.consentSignatureText}" on {clientProfile.consentTimestamp} (v2.4)
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="text-xs font-bold text-[#52705F] hover:text-[#0C2B1C]"
              >
                ← Back to Upload
              </button>
              <button
                type="submit"
                className="ret-btn"
              >
                Sign Authorization & Proceed to Step 4 →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: SERVICE AGREEMENT & WORKSPACE */}
      {activeStep === 4 && (
        <div className="bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-2xl text-[#0C2B1C]">
                Platform Service Agreement & Onboarding Assignment
              </h3>
              <p className="text-sm text-[#52705F] mt-1">
                Your workspace is configured with dedicated review control and automated ledger routing.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#EDF9F1] text-[#0F7A41] font-mono text-xs font-bold rounded-full shrink-0">
              {engagementSigned ? 'Active Workspace' : 'Ready to Sign'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#EDF9F1] border border-[#D9F0E2] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#27B665] text-white font-display font-bold text-lg flex items-center justify-center shrink-0">
              MV
            </div>
            <div>
              <div className="font-display font-bold text-base text-[#0C2B1C]">
                Marcus Vance
              </div>
              <div className="text-xs text-[#52705F]">
                Assigned Client Onboarding Director · Financial Operations Team
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => setActiveStep(3)}
              className="text-xs font-bold text-[#52705F] hover:text-[#0C2B1C]"
            >
              ← Review Data Authorization
            </button>

            {!engagementSigned ? (
              <button
                onClick={handleSignEngagement}
                className="ret-btn"
              >
                Countersign Service Agreement
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('findings')}
                className="ret-btn"
              >
                View Operational Action Plan →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Deletion Rights */}
      <div className="p-6 rounded-[24px] bg-[#EDF9F1] border border-[#D9F0E2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#0C2B1C]">Data Minimization & Deletion Rights</div>
          <div className="text-xs text-[#52705F] mt-0.5">
            You hold total control over your financial records. You may permanently purge uploaded documents and consent records at any moment.
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Delete all uploaded financial documents and reset profile?')) {
              setUploadSuccess(false);
              setConsentAccepted(false);
              setEngagementSigned(false);
              setClientProfile(prev => ({
                ...prev,
                priorYearReturnUploaded: false,
                priorYearFileName: undefined,
                consentSigned: false,
                engagementLetterSigned: false
              }));
              setActiveStep(1);
            }
          }}
          className="text-xs font-bold text-rose-700 hover:text-rose-800 shrink-0"
        >
          Purge Vault Records
        </button>
      </div>

    </div>
  );
};
