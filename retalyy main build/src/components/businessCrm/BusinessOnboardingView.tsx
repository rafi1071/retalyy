import React, { useState, useEffect } from 'react';
import { 
  BusinessProfile, 
  BusinessIndustryKey, 
  RevenueModelType,
  AiDashboardBlueprint 
} from './types';
import { 
  INDUSTRY_PRESETS, 
  generateAiDashboardBlueprint, 
  detectIndustryKey 
} from './services/aiDashboardArchitect';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  FileText, 
  RotateCcw,
  Hammer,
  Cloud,
  ShoppingBag,
  Briefcase,
  Utensils,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Layers,
  DollarSign,
  Award,
  ChevronRight,
  Clock,
  Scale
} from 'lucide-react';

interface BusinessOnboardingViewProps {
  profile: BusinessProfile;
  onUpdateProfile: (updated: BusinessProfile) => void;
  onCompleteOnboarding: () => void;
}

export const BusinessOnboardingView: React.FC<BusinessOnboardingViewProps> = ({
  profile,
  onUpdateProfile,
  onCompleteOnboarding
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(() => {
    const p = { ...profile };
    if (!p.industryCategory) {
      p.industryCategory = detectIndustryKey(p.industry, p.companyName);
    }
    if (!p.dashboardBlueprint) {
      p.dashboardBlueprint = generateAiDashboardBlueprint(p);
    }
    return p;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisStage, setSynthesisStage] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleChange = (field: keyof BusinessProfile, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // If industry or category changes, re-sync defaults
      if (field === 'industryCategory') {
        const preset = INDUSTRY_PRESETS.find(p => p.key === value);
        if (preset) {
          updated.revenueModel = preset.suggestedRevenueModel;
          updated.primaryPainPoint = preset.defaultPainPoints;
          updated.compliancePriorities = preset.defaultCompliance;
        }
      }
      return updated;
    });
  };

  const handleSelectIndustryPreset = (key: BusinessIndustryKey) => {
    const preset = INDUSTRY_PRESETS.find(p => p.key === key);
    if (!preset) return;

    setFormData(prev => ({
      ...prev,
      industryCategory: key,
      industry: preset.label,
      revenueModel: preset.suggestedRevenueModel,
      primaryPainPoint: preset.defaultPainPoints,
      compliancePriorities: preset.defaultCompliance
    }));
  };

  const runAiSynthesis = () => {
    setIsSynthesizing(true);
    setSynthesisStage(1);

    setTimeout(() => {
      setSynthesisStage(2);
      setTimeout(() => {
        setSynthesisStage(3);
        setTimeout(() => {
          const generatedBlueprint = generateAiDashboardBlueprint(formData, customPrompt);
          setFormData(prev => ({
            ...prev,
            dashboardBlueprint: generatedBlueprint,
            isOnboarded: true
          }));
          onUpdateProfile({
            ...formData,
            dashboardBlueprint: generatedBlueprint,
            isOnboarded: true
          });
          setIsSynthesizing(false);
          setSynthesisStage(4);
        }, 800);
      }, 700);
    }, 600);
  };

  const handleSaveAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);

    if (currentStep === 4) {
      // Advance to Step 5: AI Dashboard Architect
      setCurrentStep(5);
      runAiSynthesis();
    } else if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final completion
      onUpdateProfile({ ...formData, isOnboarded: true });
      onCompleteOnboarding();
    }
  };

  // Quick industry autofills for fast demoing
  const handleQuickPresetAutofill = (industryType: 'contractor' | 'saas' | 'ecommerce' | 'agency') => {
    let autofilled: BusinessProfile;

    if (industryType === 'contractor') {
      autofilled = {
        companyName: 'Titan Mechanical & Commercial Contractors LLC',
        dba: 'Titan Commercial Trades',
        ein: '74-8839210',
        entityType: 'LLC',
        industry: 'Commercial HVAC, Electrical & General Contracting',
        industryCategory: 'contractor_trades',
        revenueModel: 'job_progress_billing',
        primaryPainPoint: 'Job-cost WIP margin tracking, 1099 subcontractor W-9 collection, and materials receipt chaos.',
        compliancePriorities: ['Form 1099-NEC $600 threshold', 'Preliminary Lien Notices', 'ASC 606 Job-cost WIP', 'Section 179 Fleet'],
        state: 'Texas / California',
        incorporationDate: '2021-03-12',
        fiscalYearEnd: 'December 31',
        accountingMethod: 'accrual',
        teamSize: 18,
        monthlyBurnTarget: 48500,
        primaryBank: 'JPMorgan Chase Commercial Checking (...4912)',
        primaryCard: 'Chase Ink Business Premier Visa (...9021)',
        stripeConnected: false,
        plaidConnected: true,
        capExThreshold: 2500,
        taxReserveRate: 25,
        isOnboarded: false
      };
    } else if (industryType === 'ecommerce') {
      autofilled = {
        companyName: 'Hudson & Harbor Goods Inc.',
        dba: 'Hudson Direct',
        ein: '47-9201844',
        entityType: 'C-Corp',
        industry: 'Omnichannel Apparel & D2C E-Commerce',
        industryCategory: 'ecommerce_retail',
        revenueModel: 'pos_ecommerce',
        primaryPainPoint: 'South Dakota v. Wayfair multi-state sales tax nexus, inventory holding FIFO, and Stripe/Shopify fee reconciliation.',
        compliancePriorities: ['Wayfair Economic Nexus', '1099-K Settlement Reconciliation', 'FIFO Inventory LCM'],
        state: 'Delaware / New York',
        incorporationDate: '2022-09-01',
        fiscalYearEnd: 'December 31',
        accountingMethod: 'accrual',
        teamSize: 9,
        monthlyBurnTarget: 36000,
        primaryBank: 'Mercury Bank Checking (...2104)',
        primaryCard: 'Brex Mastercard Corporate (...5581)',
        stripeConnected: true,
        plaidConnected: true,
        capExThreshold: 2500,
        taxReserveRate: 22,
        isOnboarded: false
      };
    } else if (industryType === 'agency') {
      autofilled = {
        companyName: 'Vanguard Strategy & Legal Advisory LLP',
        dba: 'Vanguard Advisory Group',
        ein: '94-3019284',
        entityType: 'Partnership',
        industry: 'Executive Advisory, Consulting & Corporate Legal',
        industryCategory: 'professional_services',
        revenueModel: 'hourly_retainer',
        primaryPainPoint: 'Client escrow retainer depletion, billable utilization rates, and top-client revenue concentration risk.',
        compliancePriorities: ['Trust / Escrow Segregation', 'ASC 606 Performance Obligation Retainers', 'Form 1099-NEC'],
        state: 'California (State Bar Escrow Compliance)',
        incorporationDate: '2020-01-15',
        fiscalYearEnd: 'December 31',
        accountingMethod: 'accrual',
        teamSize: 11,
        monthlyBurnTarget: 42000,
        primaryBank: 'First Republic / SVB Checking (...8823)',
        primaryCard: 'Amex Business Platinum Card (...1004)',
        stripeConnected: true,
        plaidConnected: true,
        capExThreshold: 2500,
        taxReserveRate: 30,
        isOnboarded: false
      };
    } else {
      // Default SaaS
      autofilled = {
        companyName: 'Apex Cloud Systems LLC',
        dba: 'Apex AI Software',
        ein: '86-3491820',
        entityType: 'S-Corp',
        industry: 'Enterprise SaaS & Cloud Infrastructure',
        industryCategory: 'saas_tech',
        revenueModel: 'recurring_subscription',
        primaryPainPoint: 'IRC § 174 software capitalization, cloud compute COGS vs gross margin, and cash runway.',
        compliancePriorities: ['IRC § 174 R&D Capitalization', 'Form 8974 Payroll Tax Offset', 'ASC 606 Deferred Revenue'],
        state: 'Delaware / California',
        incorporationDate: '2023-08-10',
        fiscalYearEnd: 'December 31',
        accountingMethod: 'accrual',
        teamSize: 12,
        monthlyBurnTarget: 32000,
        primaryBank: 'Mercury Bank (Operating Checking ...7719)',
        primaryCard: 'Ramp Visa Infinite Corporate Card (...3321)',
        stripeConnected: true,
        plaidConnected: true,
        capExThreshold: 2500,
        taxReserveRate: 25,
        isOnboarded: false
      };
    }

    setFormData(autofilled);
    onUpdateProfile(autofilled);
    setCurrentStep(1);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer': return Hammer;
      case 'Cloud': return Cloud;
      case 'ShoppingBag': return ShoppingBag;
      case 'Briefcase': return Briefcase;
      case 'Utensils': return Utensils;
      case 'Stethoscope': return Stethoscope;
      default: return Sparkles;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner / Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
            AI Dynamic Financial Architecture Setup
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0C2B1C] font-display">
            Autonomous Finance Department Setup
          </h2>
          <p className="text-sm text-[#52705F] mt-1 max-w-xl">
            Fill in your legal details, operations, and compliance needs. Our AI model will synthesize a 
            <strong className="text-[#0C2B1C]"> 100% custom finance dashboard</strong> with vertical-tailored KPIs, chart of accounts, and compliance monitors.
          </p>
        </div>

        {/* 1-Click Test Autofills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-[#52705F] uppercase tracking-wider block">1-Click Test Profiles:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickPresetAutofill('contractor')}
              className="px-2.5 py-1.5 rounded-xl border border-[#D9F0E2] text-[#0C2B1C] bg-[#F8FAF9] hover:bg-[#EDF9F1] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              title="Autofill Trades & Contractor profile"
            >
              <Hammer className="w-3 h-3 text-[#27B665]" />
              <span>Contractor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPresetAutofill('saas')}
              className="px-2.5 py-1.5 rounded-xl border border-[#D9F0E2] text-[#0C2B1C] bg-[#F8FAF9] hover:bg-[#EDF9F1] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              title="Autofill SaaS & Subscription profile"
            >
              <Cloud className="w-3 h-3 text-[#27B665]" />
              <span>SaaS</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPresetAutofill('ecommerce')}
              className="px-2.5 py-1.5 rounded-xl border border-[#D9F0E2] text-[#0C2B1C] bg-[#F8FAF9] hover:bg-[#EDF9F1] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              title="Autofill E-Commerce & Retail profile"
            >
              <ShoppingBag className="w-3 h-3 text-[#27B665]" />
              <span>E-Com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPresetAutofill('agency')}
              className="px-2.5 py-1.5 rounded-xl border border-[#D9F0E2] text-[#0C2B1C] bg-[#F8FAF9] hover:bg-[#EDF9F1] text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
              title="Autofill Agency / Professional Services profile"
            >
              <Briefcase className="w-3 h-3 text-[#27B665]" />
              <span>Agency</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Step Visual Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {[
          { num: 1, label: 'Legal Identity', icon: Building2 },
          { num: 2, label: 'Industry & Model', icon: FileText },
          { num: 3, label: 'Bank Feeds & Cards', icon: CreditCard },
          { num: 4, label: 'Financial Policies', icon: Sliders },
          { num: 5, label: 'AI Custom Dashboard', icon: Sparkles }
        ].map(s => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                isActive
                  ? 'bg-white border-[#27B665] ring-2 ring-[#27B665]/20 shadow-sm'
                  : isDone
                  ? 'bg-[#F8FAF9] border-[#D9F0E2] text-[#0C2B1C]'
                  : 'bg-white/60 border-neutral-200 text-neutral-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isActive
                    ? 'bg-[#27B665] text-white shadow-sm'
                    : isDone
                    ? 'bg-[#EDF9F1] text-[#0F7A41]'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 text-[#0F7A41]" /> : s.num}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#52705F]">Step {s.num}</div>
                <div className="text-xs font-bold truncate text-[#0C2B1C]">{s.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Configuration Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-sm">
        <form onSubmit={handleSaveAndProceed} className="space-y-6">

          {/* STEP 1: LEGAL IDENTITY */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#EDF9F1] pb-4">
                <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#27B665]" />
                  Step 1: Legal Entity & Registration Details
                </h3>
                <p className="text-xs text-[#52705F] mt-1">
                  Required for statutory IRS tax classifications, 1099 compliance, and accurate legal entity reporting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Legal Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={e => handleChange('companyName', e.target.value)}
                    placeholder="e.g. Titan Mechanical Contractors LLC"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Trade Name / DBA (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.dba}
                    onChange={e => handleChange('dba', e.target.value)}
                    placeholder="e.g. Titan Trades"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Federal EIN / Tax ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ein}
                    onChange={e => handleChange('ein', e.target.value)}
                    placeholder="XX-XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm font-mono text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Legal Entity Structure *
                  </label>
                  <select
                    value={formData.entityType}
                    onChange={e => handleChange('entityType', e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  >
                    <option value="LLC">Limited Liability Company (LLC)</option>
                    <option value="S-Corp">S-Corporation (Form 1120-S)</option>
                    <option value="C-Corp">C-Corporation (Form 1120)</option>
                    <option value="Partnership">Partnership (Form 1065)</option>
                    <option value="Sole Proprietorship">Sole Proprietorship (Schedule C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    State / Jurisdiction of Formation *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => handleChange('state', e.target.value)}
                    placeholder="e.g. California / Delaware / Texas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Incorporation / Inception Date
                  </label>
                  <input
                    type="date"
                    value={formData.incorporationDate}
                    onChange={e => handleChange('incorporationDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INDUSTRY & BUSINESS MODEL SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#EDF9F1] pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-[11px] font-bold border border-[#D9F0E2] mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#27B665]" />
                  Drives AI Custom Dashboard Blueprint
                </div>
                <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#27B665]" />
                  Step 2: Business Sector & Operating Model
                </h3>
                <p className="text-xs text-[#52705F] mt-1">
                  Select your core industry. Our AI engine uses this taxonomy to design custom KPI cards, chart of accounts, and compliance algorithms.
                </p>
              </div>

              {/* Visual Industry Cards Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-2.5">
                  Select Your Business Sector
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INDUSTRY_PRESETS.map(preset => {
                    const IconComponent = getPresetIcon(preset.iconName);
                    const isSelected = formData.industryCategory === preset.key;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => handleSelectIndustryPreset(preset.key)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#EDF9F1]/50 border-[#27B665] ring-2 ring-[#27B665]/20 shadow-sm'
                            : 'bg-white border-[#D9F0E2] hover:border-[#8EDDA6] hover:bg-[#F8FAF9]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-[#27B665] text-white' : 'bg-[#EDF9F1] text-[#0F7A41]'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-[#27B665] text-white' : 'bg-[#F0FDF4] text-[#0F7A41] border border-[#D9F0E2]'
                            }`}>
                              {preset.badge}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[#0C2B1C] mb-1">{preset.label}</div>
                          <div className="text-[11px] text-[#52705F] line-clamp-2 leading-relaxed">
                            {preset.description}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-2 border-t border-[#D9F0E2] flex items-center justify-between text-[11px] font-bold text-[#0F7A41]">
                            <span>Active Architecture</span>
                            <Check className="w-3.5 h-3.5 text-[#27B665]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Specific Sub-Industry / Niche Description
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={e => handleChange('industry', e.target.value)}
                    placeholder="e.g. Commercial HVAC & Piping Subcontractor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Primary Revenue Model *
                  </label>
                  <select
                    value={formData.revenueModel || 'job_progress_billing'}
                    onChange={e => handleChange('revenueModel', e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  >
                    <option value="job_progress_billing">Milestone & Job Cost Progress Billing (AIA Draw / Work-in-Progress)</option>
                    <option value="recurring_subscription">Monthly / Annual Recurring SaaS & Subscriptions (ASC 606)</option>
                    <option value="pos_ecommerce">Daily Point-of-Sale / Multi-Channel E-Commerce (Shopify, Toast, Stripe)</option>
                    <option value="hourly_retainer">Client Retainer & Billable Hours Draw (Trust / Escrow Accounting)</option>
                    <option value="insurance_fee_service">Insurance Payor & Fee-for-Service Claims (Healthcare & Clinical)</option>
                    <option value="mixed">Mixed / Hybrid Commercial Contracting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Accounting Basis *
                  </label>
                  <select
                    value={formData.accountingMethod}
                    onChange={e => handleChange('accountingMethod', e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  >
                    <option value="accrual">Accrual Basis (GAAP Standard - Invoices & Bills Recognized When Incurred)</option>
                    <option value="cash">Cash Basis (Recognized Upon Actual Cash Payment)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Fiscal Year End *
                  </label>
                  <input
                    type="text"
                    value={formData.fiscalYearEnd}
                    onChange={e => handleChange('fiscalYearEnd', e.target.value)}
                    placeholder="e.g. December 31"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Team Size (Employees + 1099 Contractors)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.teamSize}
                    onChange={e => handleChange('teamSize', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Monthly Operating Expense / Burn Target ($)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyBurnTarget}
                    onChange={e => handleChange('monthlyBurnTarget', Number(e.target.value))}
                    placeholder="e.g. 24500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm font-mono text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  Biggest Financial Bottleneck / Primary Focus
                </label>
                <input
                  type="text"
                  value={formData.primaryPainPoint || ''}
                  onChange={e => handleChange('primaryPainPoint', e.target.value)}
                  placeholder="e.g. Job costing accuracy, tracking 1099 subcontractor W-9s, or inventory turnover"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: BANKING & CARDS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#EDF9F1] pb-4">
                <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#27B665]" />
                  Step 3: Primary Banking & Payment Gateways
                </h3>
                <p className="text-xs text-[#52705F] mt-1">
                  Connect or designate your commercial bank accounts for automatic statement reconciliation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Primary Operating Checking Bank *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBank}
                    onChange={e => handleChange('primaryBank', e.target.value)}
                    placeholder="e.g. JPMorgan Chase Commercial Checking (...4912)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Primary Corporate Credit Card
                  </label>
                  <input
                    type="text"
                    value={formData.primaryCard}
                    onChange={e => handleChange('primaryCard', e.target.value)}
                    placeholder="e.g. Ramp Visa / Amex Business (...4402)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                </div>
              </div>

              {/* Feed Connectors Toggles */}
              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#0C2B1C]">
                  Direct Sync Gateways
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D9F0E2]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      P
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0C2B1C]">Plaid / Direct Bank Sync</div>
                      <div className="text-[11px] text-[#52705F]">Real-time statement feed & cleared ACH transactions</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.plaidConnected}
                    onChange={e => handleChange('plaidConnected', e.target.checked)}
                    className="w-4 h-4 accent-[#27B665] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D9F0E2]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0C2B1C]">Stripe / Square / Toast Merchant Feed</div>
                      <div className="text-[11px] text-[#52705F]">Auto-import gross payouts and interchange fees</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.stripeConnected}
                    onChange={e => handleChange('stripeConnected', e.target.checked)}
                    className="w-4 h-4 accent-[#27B665] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FINANCIAL POLICIES */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#EDF9F1] pb-4">
                <h3 className="text-lg font-bold text-[#0C2B1C] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#27B665]" />
                  Step 4: AI Financial Automation Policies
                </h3>
                <p className="text-xs text-[#52705F] mt-1">
                  Configure corporate accounting policies. The AI Finance Department enforces these guardrails on every receipt and bill.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5 flex items-center justify-between">
                    <span>CapEx Capitalization Threshold ($)</span>
                    <span className="text-[11px] text-[#27B665] font-mono font-bold">${formData.capExThreshold}</span>
                  </label>
                  <input
                    type="number"
                    step="250"
                    min="500"
                    max="10000"
                    value={formData.capExThreshold}
                    onChange={e => handleChange('capExThreshold', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm font-mono text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                  <span className="text-[11px] text-[#52705F] mt-1 block">
                    IRS De Minimis Safe Harbor is $2,500. Purchases over this amount are capitalized as Fixed Assets.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5 flex items-center justify-between">
                    <span>Tax Set-Aside Reserve Rate (%)</span>
                    <span className="text-[11px] text-[#27B665] font-mono font-bold">{formData.taxReserveRate}%</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="40"
                    value={formData.taxReserveRate}
                    onChange={e => handleChange('taxReserveRate', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-sm font-mono text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                  <span className="text-[11px] text-[#52705F] mt-1 block">
                    Automatically segregates estimated federal & state quarterly tax reserves from monthly profit.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#C6EDD4] text-xs text-[#0F7A41] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#27B665] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#0C2B1C]">Double-Entry Invariant Guardrails Active</div>
                  <p className="mt-0.5 leading-relaxed text-[#2C4B3B]">
                    All transactions generated by Retalyy must balance (Debits = Credits) prior to posting. In the next step, our AI Architect will assemble your custom dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: AI DASHBOARD ARCHITECT & BLUEPRINT SYNTHESIS */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#EDF9F1] pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
                  Step 5: AI Dashboard Architect Synthesis
                </div>
                <h3 className="text-xl font-bold text-[#0C2B1C]">
                  Custom Financial Dashboard for {formData.companyName}
                </h3>
                <p className="text-xs text-[#52705F] mt-1">
                  Our model analyzed your industry taxonomy ({formData.industry}), revenue model ({formData.revenueModel}), and {formData.accountingMethod} basis to design a dedicated financial workspace.
                </p>
              </div>

              {/* Real-Time AI Generation Simulation */}
              {isSynthesizing ? (
                <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#D9F0E2] text-center space-y-6 animate-pulse">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EDF9F1] text-[#27B665] flex items-center justify-center">
                    <Cpu className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0C2B1C]">
                      Synthesizing Custom Finance Dashboard Architecture...
                    </h4>
                    <p className="text-xs text-[#52705F] mt-1">
                      Applying specialized GAAP taxonomy, custom KPI formulas, and automated compliance watchdogs.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-2 text-left text-xs font-medium">
                    <div className={`p-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                      synthesisStage >= 1 ? 'bg-white text-[#0C2B1C] shadow-xs' : 'text-neutral-400'
                    }`}>
                      {synthesisStage > 1 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#27B665] border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>1. Mapping {formData.industry} Chart of Accounts & GL rules...</span>
                    </div>

                    <div className={`p-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                      synthesisStage >= 2 ? 'bg-white text-[#0C2B1C] shadow-xs' : 'text-neutral-400'
                    }`}>
                      {synthesisStage > 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
                      ) : synthesisStage === 2 ? (
                        <div className="w-4 h-4 border-2 border-[#27B665] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-neutral-200" />
                      )}
                      <span>2. Generating vertical-specific KPI metrics and algorithms...</span>
                    </div>

                    <div className={`p-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                      synthesisStage >= 3 ? 'bg-white text-[#0C2B1C] shadow-xs' : 'text-neutral-400'
                    }`}>
                      {synthesisStage > 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
                      ) : synthesisStage === 3 ? (
                        <div className="w-4 h-4 border-2 border-[#27B665] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-neutral-200" />
                      )}
                      <span>3. Assembling compliance radar and risk alert systems...</span>
                    </div>
                  </div>
                </div>
              ) : formData.dashboardBlueprint ? (
                /* Generated Blueprint Showcase */
                <div className="space-y-6 animate-fade-in">

                  {/* AI Blueprint Header Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0C2B1C] to-[#16442E] text-white shadow-md relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#27B665]/20 text-[#8EDDA6] text-xs font-bold border border-[#27B665]/30 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
                          {formData.dashboardBlueprint.industryDisplayName}
                        </div>
                        <h4 className="text-xl font-bold tracking-tight">
                          AI Financial Control Architecture Active
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-[#8EDDA6] flex items-center gap-1.5 border border-white/10">
                          <CheckCircle2 className="w-4 h-4 text-[#27B665]" />
                          <span>Confidence: {formData.dashboardBlueprint.confidenceScore}%</span>
                        </div>
                        <button
                          type="button"
                          onClick={runAiSynthesis}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-Synthesize</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/85 leading-relaxed max-w-3xl">
                      {formData.dashboardBlueprint.aiRationale}
                    </p>
                  </div>

                  {/* Dynamic KPI Cards Preview */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#52705F] mb-3 flex items-center justify-between">
                      <span>Synthesized Primary Financial KPIs (Live on Dashboard)</span>
                      <span className="text-[11px] text-[#27B665]">4 Specialized Metrics</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {formData.dashboardBlueprint.primaryKpis.map(kpi => (
                        <div key={kpi.id} className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2]">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#52705F] mb-1">
                            <span className="truncate">{kpi.label}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-[#D9F0E2] text-[#0F7A41]">
                              {kpi.badge || 'KPI'}
                            </span>
                          </div>
                          <div className="text-xl font-bold text-[#0C2B1C] font-mono my-1">
                            {kpi.value}
                          </div>
                          <div className="text-[10px] text-[#0F7A41] font-medium flex items-center justify-between">
                            <span>{kpi.subtext}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vertical Chart of Accounts & Compliance Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Specialized Chart of Accounts */}
                    <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2]">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#0C2B1C] mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#27B665]" />
                        <span>Vertical Chart of Accounts Injected</span>
                      </div>
                      <div className="space-y-2">
                        {formData.dashboardBlueprint.recommendedChartOfAccounts.slice(0, 4).map(acc => (
                          <div key={acc.code} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#F8FAF9] border border-[#EDF9F1]">
                            <span className="font-mono font-bold text-[#0F7A41]">{acc.code}</span>
                            <span className="font-medium text-[#0C2B1C] truncate mx-2">{acc.name}</span>
                            <span className="text-[10px] uppercase font-bold text-[#52705F]">{acc.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specialized Compliance Radar */}
                    <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2]">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#0C2B1C] mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#27B665]" />
                        <span>Specialized Statutory Compliance Radar</span>
                      </div>
                      <div className="space-y-2">
                        {formData.dashboardBlueprint.complianceChecklist.slice(0, 3).map(comp => (
                          <div key={comp.id} className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#EDF9F1] text-xs">
                            <div className="font-bold text-[#0C2B1C] flex items-center justify-between">
                              <span>{comp.title}</span>
                              <span className="text-[10px] text-[#0F7A41] font-mono">{comp.citation}</span>
                            </div>
                            <div className="text-[11px] text-[#52705F] mt-0.5">{comp.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Optional Custom AI Tuning Prompt */}
                  <div className="p-4 rounded-2xl bg-[#EDF9F1]/40 border border-[#D9F0E2] flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={e => setCustomPrompt(e.target.value)}
                      placeholder="Optional: Tell AI to focus on specific needs (e.g. 'Focus on heavy machinery lease depreciation')..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                    />
                    <button
                      type="button"
                      onClick={runAiSynthesis}
                      className="px-4 py-2 rounded-xl bg-[#0C2B1C] text-white hover:bg-[#16442E] text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#8EDDA6]" />
                      <span>Re-tune AI</span>
                    </button>
                  </div>

                </div>
              ) : null}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-6 border-t border-[#EDF9F1] flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-5 py-2.5 rounded-full border border-[#D9F0E2] text-[#0C2B1C] bg-white hover:bg-neutral-50 text-xs font-bold cursor-pointer transition-all"
              >
                ← Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {isSavedNotice && (
                <span className="text-xs text-[#27B665] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Changes Saved
                </span>
              )}
              <button
                type="submit"
                disabled={isSynthesizing}
                className="ret-btn sm"
              >
                <span>
                  {currentStep === 4 
                    ? 'Generate AI Custom Dashboard →' 
                    : currentStep === 5 
                    ? 'Launch Custom Financial Dashboard' 
                    : 'Save & Continue'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};
