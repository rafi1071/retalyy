import { CalculatorInputs, TaxCalculationResults } from '../types';
import { US_STATES } from '../data/taxRules';

export function calculateTaxes(inputs: CalculatorInputs): TaxCalculationResults {
  const net = Math.max(0, inputs.netIncome);
  const stateObj = US_STATES.find(s => s.code === inputs.state) || US_STATES.find(s => s.code === 'CA')!;
  const stateRate = stateObj.rate;

  // 1. Current Baseline: Sole Proprietorship / Single-Member LLC
  // Self-Employment Tax: 15.3% on 92.35% of net profit
  const seTaxableBase = net * 0.9235;
  const ssCap = 176100; // 2025/2026 average benchmark
  const ssTax = Math.min(seTaxableBase, ssCap) * 0.124;
  const medTax = seTaxableBase * 0.029;
  const addMedThreshold = inputs.filingStatus === 'married_joint' ? 250000 : 200000;
  const addMedTax = seTaxableBase > addMedThreshold ? (seTaxableBase - addMedThreshold) * 0.009 : 0;
  const currentSeTax = ssTax + medTax + addMedTax;

  // Half of SE tax is deductible above-the-line (IRC §164(f))
  const halfSeDeduction = currentSeTax * 0.5;

  // Baseline Standard Deduction
  let standardDeduction = 15000;
  if (inputs.filingStatus === 'married_joint') standardDeduction = 30000;
  else if (inputs.filingStatus === 'head_household') standardDeduction = 22500;

  // Adjusted Gross Income (AGI) Baseline
  const currentAgi = Math.max(0, net - halfSeDeduction - inputs.healthInsurancePaid - inputs.retirementContribution);

  // Baseline QBI Deduction (IRC §199A) - 20% of net income minus half SE tax
  const currentQbiBase = Math.max(0, net - halfSeDeduction);
  const currentQbiDeduction = currentQbiBase * 0.20;

  const currentTaxableIncome = Math.max(0, currentAgi - standardDeduction - currentQbiDeduction);

  // Progressive Federal Tax Brackets (2025/2026 approximated)
  const currentFederalIncomeTax = estimateFederalIncomeTax(currentTaxableIncome, inputs.filingStatus);
  const currentStateIncomeTax = Math.max(0, currentAgi - standardDeduction * 0.5) * stateRate;
  const currentTotalTax = currentSeTax + currentFederalIncomeTax + currentStateIncomeTax;

  // 2. Retalyy Optimized Plan (S-Corp Election + Strategic Deductions)
  // Determine Reasonable W-2 Compensation (IRS Rev. Rul. 74-44)
  // Balance between audit safety and payroll tax minimization
  let recommendedSalary = 0;
  let recommendedDistribution = 0;

  if (net <= 60000) {
    // Under $60k, S-corp administrative costs ($1,200-$1,800) usually exceed tax savings
    recommendedSalary = net;
    recommendedDistribution = 0;
  } else if (net <= 120000) {
    recommendedSalary = Math.round(net * 0.55);
    recommendedDistribution = net - recommendedSalary;
  } else if (net <= 250000) {
    recommendedSalary = Math.round(Math.max(68000, net * 0.45));
    recommendedDistribution = net - recommendedSalary;
  } else {
    // For $250k+, reasonable wage reaches market benchmarks ($110k - $140k)
    recommendedSalary = Math.min(140000, Math.round(net * 0.38));
    recommendedDistribution = net - recommendedSalary;
  }

  // FICA tax on W-2 salary only (employer + employee share = 15.3% up to SS cap, 2.9% beyond)
  const salarySsTax = Math.min(recommendedSalary, ssCap) * 0.124;
  const salaryMedTax = recommendedSalary * 0.029;
  const salaryAddMedTax = recommendedSalary > addMedThreshold ? (recommendedSalary - addMedThreshold) * 0.009 : 0;
  const optimizedSeTax = salarySsTax + salaryMedTax + salaryAddMedTax;

  // S-Corp payroll tax savings
  const sCorpPayrollSavings = Math.max(0, currentSeTax - optimizedSeTax);

  // Strategic Home Office & Accountable Plan Reimbursements (§62(a)(2)(A), §280A)
  const homeOfficeAmount = inputs.hasHomeOffice ? 3600 : 0;
  const homeOfficeSavings = inputs.hasHomeOffice ? Math.round(3600 * (0.24 + stateRate)) : 0;

  // Strategic Solo 401(k) / Pension Optimization
  // With S-Corp, employee can defer $23,500 + employer profit share of 25% of W-2 salary!
  const maxSolo401kEmployer = Math.round(recommendedSalary * 0.25);
  const potentialRetirementContribution = Math.max(inputs.retirementContribution, Math.min(70000, 23500 + maxSolo401kEmployer));
  const additionalRetirementDeduction = Math.max(0, potentialRetirementContribution - inputs.retirementContribution);
  const retirementSavings = Math.round(additionalRetirementDeduction * (0.24 + stateRate));

  // Health Insurance deduction under §162(l) included in S-Corp W-2 box 14 / W-2 reporting
  const healthInsuranceSavings = Math.round(inputs.healthInsurancePaid * 0.07); // Payroll FICA exemptions when properly structured

  // Optimized Federal and State Income Tax
  const optimizedAgi = Math.max(0, net - (optimizedSeTax * 0.5) - inputs.healthInsurancePaid - potentialRetirementContribution - homeOfficeAmount);
  // S-Corp QBI applies to the net pass-through profit after W-2 wage
  const optimizedQbiBase = Math.max(0, recommendedDistribution - homeOfficeAmount);
  const optimizedQbiDeduction = optimizedQbiBase * 0.20;
  const optimizedTaxableIncome = Math.max(0, optimizedAgi - standardDeduction - optimizedQbiDeduction);

  const optimizedFederalIncomeTax = estimateFederalIncomeTax(optimizedTaxableIncome, inputs.filingStatus);
  const optimizedStateIncomeTax = Math.max(0, optimizedAgi - standardDeduction * 0.5) * stateRate;

  // Account for estimated $1,200 S-Corp annual payroll & corporate compliance cost
  const complianceAdminCost = net > 60000 ? 1200 : 0;
  const rawTotalSavings = (currentTotalTax - (optimizedSeTax + optimizedFederalIncomeTax + optimizedStateIncomeTax)) - complianceAdminCost;
  const netAnnualSavings = Math.max(1200, Math.round(rawTotalSavings / 50) * 50);

  return {
    currentSeTax: Math.round(currentSeTax),
    currentFederalIncomeTax: Math.round(currentFederalIncomeTax),
    currentStateIncomeTax: Math.round(currentStateIncomeTax),
    currentTotalTax: Math.round(currentTotalTax),

    optimizedSeTax: Math.round(optimizedSeTax),
    optimizedFederalIncomeTax: Math.round(optimizedFederalIncomeTax),
    optimizedStateIncomeTax: Math.round(optimizedStateIncomeTax),
    optimizedTotalTax: Math.round(optimizedSeTax + optimizedFederalIncomeTax + optimizedStateIncomeTax),

    netAnnualSavings,
    sCorpSavings: Math.max(0, Math.round((sCorpPayrollSavings - complianceAdminCost) / 50) * 50),
    retirementSavings,
    homeOfficeSavings,
    healthInsuranceSavings,
    qbiSavings: Math.round(currentQbiDeduction * 0.24),
    recommendedSalary,
    recommendedDistribution
  };
}

function estimateFederalIncomeTax(taxableIncome: number, filingStatus: string): number {
  if (taxableIncome <= 0) return 0;

  // 2025/2026 Federal Tax Brackets
  const singleBrackets = [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ];

  const mfjBrackets = [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 }
  ];

  const brackets = filingStatus === 'married_joint' ? mfjBrackets : singleBrackets;

  let tax = 0;
  let previousLimit = 0;

  for (const b of brackets) {
    if (taxableIncome > b.limit) {
      tax += (b.limit - previousLimit) * b.rate;
      previousLimit = b.limit;
    } else {
      tax += (taxableIncome - previousLimit) * b.rate;
      break;
    }
  }

  return tax;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
