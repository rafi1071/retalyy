import React, { useState, useMemo } from 'react';
import { CalculatorInputs, FilingStatus, EntityType, SCorpStatus, NavigationTab } from '../types';
import { US_STATES } from '../data/taxRules';
import { calculateTaxes, formatCurrency } from '../utils/taxCalculator';
import { FiveYearSavingsChart } from './FiveYearSavingsChart';

interface CalculatorViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
  onSaveToVault?: (inputs: CalculatorInputs) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ 
  setActiveTab, 
  onOpenBooking,
  onSaveToVault 
}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    fullName: '',
    email: '',
    phone: '',
    role: 'self_employed',
    filingStatus: 'single',
    state: 'CA',
    netIncome: 175000,
    entityType: 'single_member_llc',
    sCorpStatus: 'considering',
    retirementContribution: 6500,
    healthInsurancePaid: 6000,
    hasHomeOffice: true,
    marketingConsent: true,
    sourceUtm: 'organic_retalyy_scan'
  });

  const [leadCaptured, setLeadCaptured] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

  const results = useMemo(() => calculateTaxes(inputs), [inputs]);

  const handleInputChange = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleCaptureLead = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string } = {};
    if (!inputs.fullName.trim()) errors.name = 'Please provide your full name';
    if (!inputs.email.trim() || !inputs.email.includes('@')) errors.email = 'Valid work email required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLeadCaptured(true);
    if (onSaveToVault) {
      onSaveToVault(inputs);
    }
  };

  const proceedToVault = () => {
    if (onSaveToVault) {
      onSaveToVault(inputs);
    }
    setActiveTab('vault');
  };

  const stateObj = US_STATES.find(s => s.code === inputs.state) || US_STATES[4];
  const sliderFillPercent = ((inputs.netIncome - 40000) / (600000 - 40000)) * 100;
  const barBHeightPercent = Math.max(25, Math.round((results.optimizedTotalTax / results.currentTotalTax) * 100));

  return (
    <div className="wrap py-12 space-y-10">
      
      {/* Header */}
      <div className="max-w-2xl">
        <div className="ret-pill mb-4">
          <i />
          <span>Section 2 · Operations & Financial Capacity Model</span>
        </div>
        <h1 className="text-[clamp(34px,4.5vw,56px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
          Business Operating Efficiency & Financial Model
        </h1>
        <p className="text-lg text-[#52705F] mt-3 leading-relaxed">
          Model operational overhead, working capital buffers, entity structure efficiency, and tax reserve planning across all 50 states.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Form & 8 Inputs */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-10 shadow-lg shadow-[#0F7A41]/5 space-y-8">
          
          {/* Section 1: Earnings & State */}
          <div className="space-y-5">
            <h3 className="font-display font-bold text-xl text-[#0C2B1C] pb-2 border-b border-[#EEF6F1]">
              1. Business Earnings & Nexus
            </h3>

            {/* Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="net-income-calc" className="text-sm font-bold text-[#0C2B1C]">
                  Annual Net Operating Revenue / Self-Employment Billings
                </label>
                <div className="font-display font-extrabold text-2xl text-[#0F7A41] tabular-nums">
                  {formatCurrency(inputs.netIncome)}
                </div>
              </div>
              <input
                id="net-income-calc"
                type="range"
                min={40000}
                max={600000}
                step={5000}
                value={inputs.netIncome}
                style={{ '--f': `${sliderFillPercent}%` } as any}
                onChange={(e) => handleInputChange('netIncome', Number(e.target.value))}
                aria-label="Annual Net Operating Revenue"
              />
              <div className="flex justify-between text-xs text-[#52705F] mt-1 font-mono">
                <span>$40,000</span>
                <span>$300,000</span>
                <span>$600,000+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-state-select" className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  Operating State (Nexus)
                </label>
                <select
                  id="calc-state-select"
                  value={inputs.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                >
                  {US_STATES.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.rate === 0 ? '0% State Tax' : `${(st.rate * 100).toFixed(1)}%`})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-[#52705F] mt-1 font-mono">
                  {stateObj.ptetAvailable ? '✓ Pass-Through Entity Tax (PTET) Available' : 'No state PTET needed / available'}
                </div>
              </div>

              <div>
                <label htmlFor="calc-filing-status" className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  Filing Status
                </label>
                <select
                  id="calc-filing-status"
                  value={inputs.filingStatus}
                  onChange={(e) => handleInputChange('filingStatus', e.target.value as FilingStatus)}
                  className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                >
                  <option value="single">Single</option>
                  <option value="married_joint">Married Filing Jointly</option>
                  <option value="head_household">Head of Household</option>
                  <option value="married_separate">Married Filing Separately</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Entity & S-Corp */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-[#0C2B1C] pb-2 border-b border-[#EEF6F1]">
              2. Entity Structure & S-Corp Readiness
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-entity-type" className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  Current Business Entity
                </label>
                <select
                  id="calc-entity-type"
                  value={inputs.entityType}
                  onChange={(e) => handleInputChange('entityType', e.target.value as EntityType)}
                  className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                >
                  <option value="single_member_llc">Single-Member LLC (Disregarded)</option>
                  <option value="sole_proprietorship">Sole Proprietorship (No LLC)</option>
                  <option value="multi_member_llc">Multi-Member LLC (Partnership)</option>
                  <option value="s_corporation">Existing S-Corporation</option>
                  <option value="c_corporation">C-Corporation</option>
                </select>
              </div>

              <div>
                <label htmlFor="calc-scorp-status" className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  S-Corp Election Status
                </label>
                <select
                  id="calc-scorp-status"
                  value={inputs.sCorpStatus}
                  onChange={(e) => handleInputChange('sCorpStatus', e.target.value as SCorpStatus)}
                  className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                >
                  <option value="considering">Considering S-Corp for this tax year</option>
                  <option value="not_elected">Not elected (paying full 15.3% SE tax)</option>
                  <option value="already_active">Already active S-Corp (audit wages)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Deductions & Shelters */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl text-[#0C2B1C] pb-2 border-b border-[#EEF6F1]">
              3. Retirement, Health & Home Office Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-retirement" className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  Current Retirement Saved ($/yr)
                </label>
                <input
                  id="calc-retirement"
                  type="number"
                  step={500}
                  value={inputs.retirementContribution}
                  onChange={(e) => handleInputChange('retirementContribution', Math.max(0, Number(e.target.value)))}
                  className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                />
                <div className="text-[11px] text-[#52705F] mt-1">Solo 401(k) cap is $69,000 / $70,000</div>
              </div>

              <div>
                <label htmlFor="calc-health" className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                  Health Insurance Premiums ($/yr)
                </label>
                <input
                  id="calc-health"
                  type="number"
                  step={250}
                  value={inputs.healthInsurancePaid}
                  onChange={(e) => handleInputChange('healthInsurancePaid', Math.max(0, Number(e.target.value)))}
                  className="w-full text-sm font-medium px-4 py-3 rounded-2xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                />
                <div className="text-[11px] text-[#52705F] mt-1">Deductible under IRC §162(l)</div>
              </div>
            </div>

            {/* Home Office Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#D9F0E2] bg-[#EDF9F1]/40">
              <div>
                <div className="text-sm font-bold text-[#0C2B1C]">Dedicated Home Office Used Exclusively for Business</div>
                <div className="text-xs text-[#52705F]">Corporate accountable plan reimbursement under IRC §280A</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.hasHomeOffice}
                  onChange={(e) => handleInputChange('hasHomeOffice', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27B665]"></div>
              </label>
            </div>
          </div>

          {/* Lead Capture Box */}
          <div className="bg-[#EDF9F1] border border-[#D9F0E2] rounded-[24px] p-6 space-y-4">
            <div>
              <div className="font-display font-bold text-lg text-[#0C2B1C]">
                Save Financial Model & Action Plan
              </div>
              <div className="text-xs text-[#52705F] mt-1">
                We'll email you this full operational blueprint, cash reserve schedule, and workflow setup checklist.
              </div>
            </div>

            <form onSubmit={handleCaptureLead} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="calc-name" className="block text-xs font-bold text-[#0C2B1C] mb-1">Your Full Name</label>
                  <input
                    id="calc-name"
                    type="text"
                    required
                    placeholder="Jordan Miller"
                    value={inputs.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-600 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="calc-email" className="block text-xs font-bold text-[#0C2B1C] mb-1">Work Email</label>
                  <input
                    id="calc-email"
                    type="email"
                    required
                    placeholder="jordan@consulting.com"
                    value={inputs.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="calc-consent"
                  checked={inputs.marketingConsent}
                  onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                  className="rounded border-[#D9F0E2] text-[#27B665] focus:ring-[#27B665]"
                />
                <label htmlFor="calc-consent" className="text-xs text-[#52705F]">
                  I consent to receive operational updates and financial modeling findings. Zero spam, unsubscribe anytime.
                </label>
              </div>

              <button
                type="submit"
                className="ret-btn sm w-full mt-2 text-center"
              >
                {leadCaptured ? '✓ Model Saved — View Action Plan' : 'Save Financial Model & Action Plan'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Comparative Bars and Big Output */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#EDF9F1] border border-[#D9F0E2] rounded-[32px] p-8 shadow-xl shadow-[#0F7A41]/10 space-y-6">
            
            <div className="flex justify-between items-center border-b border-[#D9F0E2] pb-4">
              <div>
                <small className="text-xs font-bold text-[#0F7A41] uppercase tracking-wider font-mono">Retalyy Engine</small>
                <div className="text-sm font-bold text-[#0C2B1C]">Annual Financial Optimization</div>
              </div>
              <span className="px-3 py-1 bg-[#27B665] text-white text-xs font-bold font-mono rounded-full">
                Live
              </span>
            </div>

            {/* Big Net Savings Stat */}
            <div>
              <div className="text-xs text-[#52705F] mb-1">Estimated Annual Overhead & Tax Shield Savings</div>
              <div className="font-display font-extrabold text-[clamp(36px,4.5vw,52px)] text-[#0F7A41] tracking-[-0.04em] tabular-nums leading-none">
                {formatCurrency(results.netAnnualSavings)}
              </div>
              <div className="text-xs text-[#52705F] mt-2">
                Net of estimated corporate compliance & payroll administration ($1,200)
              </div>
              <div className="mt-3 pt-3 border-t border-[#D9F0E2] flex items-center justify-between">
                <span className="text-xs text-[#52705F]">5-Year Compounding Model:</span>
                <a 
                  href="#five-year-horizon" 
                  className="text-xs font-bold font-mono text-[#0F7A41] hover:underline inline-flex items-center gap-1"
                >
                  <span>+{formatCurrency(results.netAnnualSavings * 5.3)} 5-yr gap</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* Comparative Bars */}
            <div className="flex gap-4 items-end h-[200px] pt-4">
              <div className="flex-1 rounded-t-[18px] rounded-b-[6px] bg-white border border-[#D9F0E2] p-3 flex flex-col justify-between h-full">
                <small className="font-semibold text-xs text-[#52705F]">Taxes Today</small>
                <b className="font-display font-bold text-lg text-[#0C2B1C] tabular-nums">
                  {formatCurrency(results.currentTotalTax)}
                </b>
              </div>

              <div 
                className="flex-1 rounded-t-[18px] rounded-b-[6px] bg-gradient-to-b from-[#8EDDA6] to-[#27B665] text-white p-3 flex flex-col justify-between transition-all duration-500"
                style={{ height: `${barBHeightPercent}%` }}
              >
                <small className="font-semibold text-xs text-white/90">With Retalyy</small>
                <b className="font-display font-bold text-lg text-white tabular-nums">
                  {formatCurrency(results.optimizedTotalTax)}
                </b>
              </div>
            </div>

            {/* Itemized Strategy Contributions */}
            <div className="p-4 rounded-2xl bg-white border border-[#D9F0E2] space-y-2 text-xs">
              <div className="font-bold text-[#0C2B1C] mb-1">Strategy Breakdown:</div>
              <div className="flex justify-between text-[#52705F]">
                <span>S-Corp Payroll Tax Shield (IRC §1362):</span>
                <span className="font-mono font-bold text-[#0F7A41]">+{formatCurrency(results.sCorpSavings)}</span>
              </div>
              <div className="flex justify-between text-[#52705F]">
                <span>Solo 401(k) Shelter Expansion (IRC §401):</span>
                <span className="font-mono font-bold text-[#0F7A41]">+{formatCurrency(results.retirementSavings)}</span>
              </div>
              <div className="flex justify-between text-[#52705F]">
                <span>Home Office Accountable Plan (IRC §280A):</span>
                <span className="font-mono font-bold text-[#0F7A41]">+{formatCurrency(results.homeOfficeSavings)}</span>
              </div>
              <div className="flex justify-between text-[#52705F]">
                <span>Health Deduction FICA Exemption (§162):</span>
                <span className="font-mono font-bold text-[#0F7A41]">+{formatCurrency(results.healthInsuranceSavings)}</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="pt-2 space-y-3">
              <button
                onClick={proceedToVault}
                className="ret-btn w-full text-center"
              >
                Upload Prior-Year Financials to Vault →
              </button>
              <button
                onClick={onOpenBooking}
                className="ret-btn secondary w-full text-center"
              >
                Schedule Operations Consultation
              </button>
            </div>

          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#D9F0E2] text-xs text-[#52705F] leading-relaxed">
            <strong className="text-[#0C2B1C]">Managerial Planning Notice:</strong> Calculations are algorithmic projections for operational and managerial planning. Retalyy is financial management software and does not provide formal legal, tax, or public accounting advice. All ledger projections should be reviewed by your licensed advisor or partner accounting firm.
          </div>

        </div>

      </div>

      {/* 5-Year Horizon Visualization with Recharts */}
      <div id="five-year-horizon" className="pt-4 scroll-mt-24">
        <FiveYearSavingsChart
          inputs={inputs}
          onOpenBooking={onOpenBooking}
          onProceedToVault={proceedToVault}
        />
      </div>

    </div>
  );
};
