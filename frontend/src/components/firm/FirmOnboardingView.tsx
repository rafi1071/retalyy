import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  FileText, 
  RotateCcw,
  BookOpen,
  Cpu,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import { UserSession } from '../../crm/components/Auth/AuthLoginView';

export interface FirmProfileData {
  firmName: string;
  managingPartner: string;
  state: string;
  licenseNumber: string;
  practiceFocus: 'cas' | 'tax_advisory' | 'fractional_cfo' | 'full_service';
  practiceSize: 'solo' | '2-10' | '11-50' | '50+';
  primarySoftware: string;
  autoReconcileThreshold: number;
  enforce7216Consent: boolean;
  chaseCadence: 'daily' | '48h' | 'weekly';
  initialClientName: string;
  initialClientIndustry: string;
}

export const INITIAL_FIRM_PROFILE: FirmProfileData = {
  firmName: 'Vance & Associates CPAs',
  managingPartner: 'Elena Vance, CPA',
  state: 'California (CBA #89214)',
  licenseNumber: 'CPA-89214-CA',
  practiceFocus: 'full_service',
  practiceSize: '2-10',
  primarySoftware: 'Migrating from QuickBooks Online',
  autoReconcileThreshold: 98,
  enforce7216Consent: true,
  chaseCadence: '48h',
  initialClientName: 'Miller Cloud Systems LLC',
  initialClientIndustry: 'Cloud Infrastructure & SaaS'
};

interface FirmOnboardingViewProps {
  initialData?: Partial<FirmProfileData>;
  onComplete: (firmSession: UserSession, profile: FirmProfileData) => void;
  onCancel?: () => void;
}

export const FirmOnboardingView: React.FC<FirmOnboardingViewProps> = ({
  initialData,
  onComplete,
  onCancel
}) => {
  const [formData, setFormData] = useState<FirmProfileData>({
    ...INITIAL_FIRM_PROFILE,
    ...initialData
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleChange = (field: keyof FirmProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickAutofill = () => {
    const autofilled: FirmProfileData = {
      firmName: 'Vance & Associates CPAs',
      managingPartner: 'Elena Vance, CPA',
      state: 'California (CBA #89214)',
      licenseNumber: 'CPA-89214-CA',
      practiceFocus: 'full_service',
      practiceSize: '2-10',
      primarySoftware: 'Migrating from QuickBooks Online',
      autoReconcileThreshold: 98,
      enforce7216Consent: true,
      chaseCadence: '48h',
      initialClientName: 'Miller Cloud Systems LLC',
      initialClientIndustry: 'Cloud Infrastructure & SaaS'
    };
    setFormData(autofilled);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleFinishOnboarding = () => {
    const session: UserSession = {
      id: `firm-user-${Date.now()}`,
      name: formData.managingPartner || 'Elena Vance, CPA',
      email: `${formData.managingPartner.toLowerCase().replace(/[^a-z]/g, '') || 'partner'}@${formData.firmName.toLowerCase().replace(/[^a-z]/g, '') || 'cpa'}.com`,
      role: 'cpa_controller',
      roleTitle: 'Senior CPA & Managing Partner',
      firmName: formData.firmName || 'Vance & Associates CPAs',
      avatarBg: 'bg-emerald-600',
      allowedStep: 'all'
    };

    localStorage.setItem('retalyy_firm_profile', JSON.stringify(formData));
    localStorage.setItem('retalyy_cpa_session', JSON.stringify(session));
    onComplete(session, formData);
  };

  const steps = [
    { num: 1, label: 'Firm Identity', desc: 'Credentials & Licensure' },
    { num: 2, label: 'Compliance & Triage', desc: '§7216 & AI Rules' },
    { num: 3, label: 'Roster & Clients', desc: 'Staff Roles & Client 1' },
    { num: 4, label: 'Certification', desc: 'Launch Firm OS' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in text-left">
      
      {/* Top Banner / Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2] mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#27B665]" />
            Accounting Firm Setup & Certification
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2B1C] font-display">
            Onboard Your Accounting Firm
          </h2>
          <p className="text-sm text-[#52705F] mt-1 max-w-xl">
            Configure your CPA practice jurisdiction, IRC §7216 consent policies, staff roles, and initial client workflow to launch Retalyy Multi-Role Firm OS.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleQuickAutofill}
            className="px-4 py-2.5 rounded-full border border-[#D9F0E2] text-[#0C2B1C] bg-[#F8FAF9] hover:bg-[#EDF9F1] text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#27B665]" />
            <span>1-Click Test Autofill</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map(step => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num;
          return (
            <button
              key={step.num}
              type="button"
              onClick={() => setCurrentStep(step.num)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0C2B1C] text-white border-[#0C2B1C] shadow-md'
                  : isDone
                  ? 'bg-[#EDF9F1] text-[#0C2B1C] border-[#C6EDD4]'
                  : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-[#27B665] text-white' : isDone ? 'bg-[#27B665] text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                  Step 0{step.num}
                </span>
              </div>
              <div className="font-bold text-sm tracking-tight">{step.label}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{step.desc}</div>
            </button>
          );
        })}
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-[#EDF9F1] border border-[#27B665] text-[#0F7A41] text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* STEP 1: FIRM IDENTITY & CREDENTIALS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#27B665]" />
              Practice Profile & Licensure
            </h3>
            <p className="text-xs text-[#52705F] mt-1">
              Provide your firm registration, license, and practice size for audit trail generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                Firm Legal Name
              </label>
              <input
                type="text"
                value={formData.firmName}
                onChange={e => handleChange('firmName', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                placeholder="e.g. Vance & Associates CPAs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                Managing Partner / Lead CPA
              </label>
              <input
                type="text"
                value={formData.managingPartner}
                onChange={e => handleChange('managingPartner', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                placeholder="e.g. Elena Vance, CPA"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                State Board of Accountancy Jurisdiction
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={e => handleChange('state', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                placeholder="e.g. California, Texas, New York"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                License / PTIN / Firm Registration #
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={e => handleChange('licenseNumber', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                placeholder="e.g. CPA-89214-CA"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                Primary Practice Focus
              </label>
              <select
                value={formData.practiceFocus}
                onChange={e => handleChange('practiceFocus', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665] bg-white"
              >
                <option value="full_service">Full-Service (CAS + Tax + Advisory)</option>
                <option value="cas">Client Accounting Services (Bookkeeping & Close)</option>
                <option value="tax_advisory">Strategic Tax Planning & S-Corp Advisory</option>
                <option value="fractional_cfo">Fractional CFO & Controller Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                Firm Staff Size
              </label>
              <select
                value={formData.practiceSize}
                onChange={e => handleChange('practiceSize', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665] bg-white"
              >
                <option value="solo">Solo Practitioner (1 CPA)</option>
                <option value="2-10">Boutique Practice (2-10 team members)</option>
                <option value="11-50">Mid-Market Firm (11-50 team members)</option>
                <option value="50+">Large Regional / National Firm (50+)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="ret-btn sm flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Compliance & Triage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMPLIANCE & TRIAGE RULES */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#27B665]" />
              Treasury Reg § 7216 & AI Triage Rules
            </h3>
            <p className="text-xs text-[#52705F] mt-1">
              Configure how client tax documents are guarded and automated double-entry postings are governed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-[#D9F0E2] bg-[#F8FAF9] flex items-start gap-4">
              <input
                type="checkbox"
                id="consent7216"
                checked={formData.enforce7216Consent}
                onChange={e => handleChange('enforce7216Consent', e.target.checked)}
                className="mt-1 w-4 h-4 text-[#27B665] rounded focus:ring-[#27B665]"
              />
              <label htmlFor="consent7216" className="cursor-pointer">
                <div className="text-sm font-bold text-[#0C2B1C]">
                  Mandatory IRC § 7216 Client Consent Vault
                </div>
                <div className="text-xs text-[#52705F] mt-0.5">
                  Clients must cryptographically sign electronic tax disclosure authorization before their 1040/1120S files can be ingested into the AI processing pipeline.
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                  Automated Missing Statement Chase Cadence
                </label>
                <select
                  value={formData.chaseCadence}
                  onChange={e => handleChange('chaseCadence', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665] bg-white"
                >
                  <option value="daily">Aggressive: Remind every 24 hours</option>
                  <option value="48h">Standard: Remind every 48 hours until period close</option>
                  <option value="weekly">Gentle: Weekly digest email & client portal ping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                  AI Auto-Post Confidence Threshold
                </label>
                <select
                  value={formData.autoReconcileThreshold}
                  onChange={e => handleChange('autoReconcileThreshold', Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665] bg-white"
                >
                  <option value={99}>Strict: 99% confidence (Senior Review for remainder)</option>
                  <option value={98}>Recommended: 98% confidence (Standard CPA practice)</option>
                  <option value={95}>Autonomous: 95% confidence with exception flagging</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                Legacy Software Being Replaced (e.g. QuickBooks / Xero)
              </label>
              <input
                type="text"
                value={formData.primarySoftware}
                onChange={e => handleChange('primarySoftware', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                placeholder="e.g. Migrating from QuickBooks Online, Xero, UltraTax"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="ret-btn sm flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Staff & Clients</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: STAFF ROLES & INITIAL CLIENT */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#27B665]" />
              Staff Roles & First Client Setup
            </h3>
            <p className="text-xs text-[#52705F] mt-1">
              Retalyy Firm OS configures 3 distinct role tiers out-of-the-box for segregation of duties.
            </p>
          </div>

          {/* 3 Preconfigured Role Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-[#D9F0E2] bg-[#F8FAF9]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <FileText className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-[#0C2B1C]">Intake Specialist</div>
                  <div className="text-[10px] text-[#52705F]">Step 1: Document Triage</div>
                </div>
              </div>
              <p className="text-[11px] text-[#52705F] leading-snug">
                Receives uploads, tags IRS schedules, manages client checklist completeness.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#D9F0E2] bg-[#F8FAF9]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-[#0C2B1C]">Staff Accountant</div>
                  <div className="text-[10px] text-[#52705F]">Step 2: AI Processing</div>
                </div>
              </div>
              <p className="text-[11px] text-[#52705F] leading-snug">
                Oversees OCR extraction, bank matching, split allocations, and ledger rules.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#D9F0E2] bg-[#F8FAF9]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <div>
                  <div className="text-xs font-bold text-[#0C2B1C]">CPA Controller</div>
                  <div className="text-[10px] text-[#52705F]">Step 3: Ledgerline Core</div>
                </div>
              </div>
              <p className="text-[11px] text-[#52705F] leading-snug">
                Reviews journal entries, executes period-end close, certifies P&L and Balance Sheet.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C2B1C] mb-3">
              Add Your First Pilot Client
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#52705F] mb-1">
                  Client Business Legal Name
                </label>
                <input
                  type="text"
                  value={formData.initialClientName}
                  onChange={e => handleChange('initialClientName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                  placeholder="e.g. Miller Cloud Systems LLC"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#52705F] mb-1">
                  Client Industry NAICS Pack
                </label>
                <input
                  type="text"
                  value={formData.initialClientIndustry}
                  onChange={e => handleChange('initialClientIndustry', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                  placeholder="e.g. Cloud Infrastructure, Construction, Medical"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="ret-btn sm flex items-center gap-2 cursor-pointer"
            >
              <span>Review & Finalize</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & LAUNCH FIRM OS */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#27B665]" />
              Onboarding Review & Firm OS Certification
            </h3>
            <p className="text-xs text-[#52705F] mt-1">
              Verify your setup below. Once confirmed, your firm workspace will be provisioned immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] space-y-2">
              <div className="text-[#52705F] font-mono uppercase text-[10px]">PRACTICE IDENTITY</div>
              <div className="font-bold text-sm text-[#0C2B1C]">{formData.firmName}</div>
              <div>Managing Partner: <strong className="text-[#0C2B1C]">{formData.managingPartner}</strong></div>
              <div>State / License: <strong className="text-[#0C2B1C]">{formData.state} · {formData.licenseNumber}</strong></div>
              <div>Practice Focus: <strong className="text-[#0C2B1C]">{formData.practiceFocus.toUpperCase()}</strong></div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] space-y-2">
              <div className="text-[#52705F] font-mono uppercase text-[10px]">COMPLIANCE & AUTOMATION</div>
              <div>IRC § 7216 Vault: <strong className="text-[#0F7A41]">ACTIVE (Encrypted)</strong></div>
              <div>AI Auto-Post: <strong className="text-[#0F7A41]">{formData.autoReconcileThreshold}% Confidence</strong></div>
              <div>Chase Cadence: <strong className="text-[#0C2B1C]">{formData.chaseCadence}</strong></div>
              <div>Initial Client: <strong className="text-[#0C2B1C]">{formData.initialClientName}</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#27B665] flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <div className="text-sm font-bold text-[#0C2B1C]">Ready to Launch Firm OS</div>
                <div className="text-xs text-[#52705F]">
                  Your practice configuration will be applied to Step 1 Intake, Step 2 AI Workbench, and Step 3 Ledgerline Core.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="ret-btn flex items-center gap-2 cursor-pointer shrink-0 shadow-lg"
            >
              <span>Launch CPA Firm OS Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-start pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              ← Back to Staff Setup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
