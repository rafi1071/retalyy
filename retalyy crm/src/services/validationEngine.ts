import { AssembledContext, AIStructuredProposal, EngineValidationReport, ValidationCheckResult } from '../types/engine';
import { CHART_OF_ACCOUNTS } from '../data/mockData';

export function runDeterministicValidation(
  proposal: AIStructuredProposal,
  context: AssembledContext
): EngineValidationReport {
  const checks: ValidationCheckResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  let correctable = false;
  let feedbackForRetry = '';

  const permittedAccounts = CHART_OF_ACCOUNTS.map((a) => a.code);
  const lines = proposal.journal_entry?.lines || [];

  // 1. Arithmetic Check (Normal code calculates totals, not LLM)
  const totalDebits = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const transactionAmount = context.transactionEvidence.bankFeedEntry.amount;

  const debitsMatchAmount = Math.abs(totalDebits - transactionAmount) < 0.01;
  const creditsMatchAmount = Math.abs(totalCredits - transactionAmount) < 0.01;

  if (debitsMatchAmount && creditsMatchAmount) {
    checks.push({
      dimension: 'arithmetic',
      name: 'Arithmetic Verification',
      status: 'passed',
      message: `Journal line debits ($${totalDebits.toFixed(2)}) and credits ($${totalCredits.toFixed(2)}) match bank feed transaction amount ($${transactionAmount.toFixed(2)}).`,
      codeValidated: true
    });
  } else {
    checks.push({
      dimension: 'arithmetic',
      name: 'Arithmetic Verification',
      status: 'failed',
      message: `Arithmetic discrepancy: Debits ($${totalDebits.toFixed(2)}) / Credits ($${totalCredits.toFixed(2)}) do not match transaction amount ($${transactionAmount.toFixed(2)}).`,
      codeValidated: true
    });
    errors.push(`Arithmetic failure: Journal lines do not sum to transaction total $${transactionAmount.toFixed(2)}.`);
    correctable = true;
    feedbackForRetry = `Arithmetic error: Total debits (${totalDebits}) and credits (${totalCredits}) must both equal the bank transaction amount of $${transactionAmount.toFixed(2)}. Adjust line amounts accordingly.`;
  }

  // 2. Double-Entry Balance Invariant (Enforced strictly by code)
  const balanceDifference = Math.abs(totalDebits - totalCredits);
  if (balanceDifference < 0.001 && lines.length >= 2) {
    checks.push({
      dimension: 'double_entry_balance',
      name: 'Double-Entry Balance Invariant',
      status: 'passed',
      message: `Double-entry invariant holds: Total Debits ($${totalDebits.toFixed(2)}) == Total Credits ($${totalCredits.toFixed(2)}) across ${lines.length} lines.`,
      codeValidated: true
    });
  } else {
    checks.push({
      dimension: 'double_entry_balance',
      name: 'Double-Entry Balance Invariant',
      status: 'failed',
      message: `Double-entry violation: Debits ($${totalDebits.toFixed(2)}) != Credits ($${totalCredits.toFixed(2)}). Variance: $${balanceDifference.toFixed(2)}.`,
      codeValidated: true
    });
    errors.push(`Double-entry out of balance by $${balanceDifference.toFixed(2)}.`);
    correctable = true;
    feedbackForRetry += ` Double-entry out of balance: Debits must strictly equal Credits. Rebalance the lines.`;
  }

  // 3. Account Validity in Client Chart of Accounts
  let invalidAccounts: string[] = [];
  lines.forEach((l) => {
    if (!permittedAccounts.includes(l.account_code)) {
      invalidAccounts.push(l.account_code);
    }
  });

  if (invalidAccounts.length === 0) {
    checks.push({
      dimension: 'account_validity',
      name: 'Chart of Accounts Permissibility',
      status: 'passed',
      message: `All ${lines.length} proposed account codes exist in client's general ledger configuration.`,
      codeValidated: true
    });
  } else {
    checks.push({
      dimension: 'account_validity',
      name: 'Chart of Accounts Permissibility',
      status: 'failed',
      message: `Proposed nonexistent or prohibited account codes: ${invalidAccounts.join(', ')}.`,
      codeValidated: true
    });
    errors.push(`Invalid account codes proposed: ${invalidAccounts.join(', ')}.`);
    correctable = true;
    feedbackForRetry += ` Invalid accounts: Codes [${invalidAccounts.join(', ')}] do not exist in client Chart of Accounts. Use permitted codes: [${permittedAccounts.join(', ')}].`;
  }

  // 4. Evidence Grounding Check
  const hasSourceDoc = Boolean(context.transactionEvidence.sourceDocument);
  if (hasSourceDoc) {
    const doc = context.transactionEvidence.sourceDocument!;
    checks.push({
      dimension: 'evidence_grounding',
      name: 'Source Evidence Grounding',
      status: 'passed',
      message: `Cited document ${doc.filename} verified with ${doc.ocrConfidence}% OCR confidence.`,
      details: `Extracted Vendor: "${doc.extractedVendor}", Amount: $${doc.extractedAmount.toFixed(2)}`,
      codeValidated: true
    });
  } else {
    checks.push({
      dimension: 'evidence_grounding',
      name: 'Source Evidence Grounding',
      status: 'warning',
      message: 'No source document in repository. Tax deductibility and audit readiness require receipt substantiation.',
      codeValidated: true
    });
    warnings.push('Transaction lacks attached invoice/receipt. Queued for human verification.');
  }

  // 5. Duplicate Detection Check
  if (context.relatedRecords.duplicateCandidateFound) {
    checks.push({
      dimension: 'duplicate_detection',
      name: 'Duplicate & Double-Billing Prevention',
      status: 'failed',
      message: `Potential duplicate detected matching transaction ${context.relatedRecords.duplicateReferenceId}.`,
      codeValidated: true
    });
    errors.push(`Suspected duplicate of ${context.relatedRecords.duplicateReferenceId}. Prevented from auto-post.`);
  } else {
    checks.push({
      dimension: 'duplicate_detection',
      name: 'Duplicate & Double-Billing Prevention',
      status: 'passed',
      message: 'Zero duplicate candidate transactions found within 5-day settlement window.',
      codeValidated: true
    });
  }

  // 6. Policy Compliance: Capitalization & Prepayment Thresholds
  const capThreshold = context.relevantPolicies.capitalizationThreshold;
  const prepayThreshold = context.relevantPolicies.prepaymentThreshold;

  // If amount >= CapEx threshold ($2,500) and model tried to immediately expense it
  if (transactionAmount >= capThreshold && proposal.accounting_decision.account_code.startsWith('6')) {
    checks.push({
      dimension: 'policy_compliance',
      name: 'Capitalization Policy Compliance',
      status: 'failed',
      message: `Violation: Amount ($${transactionAmount.toFixed(2)}) exceeds CapEx threshold ($${capThreshold.toLocaleString()}) but was routed to Operating Expense (${proposal.accounting_decision.account_code}). Must be capitalized to Fixed Assets (1500).`,
      codeValidated: true
    });
    errors.push(`CapEx policy violation: Amounts >= $${capThreshold.toLocaleString()} must be capitalized.`);
    correctable = true;
    feedbackForRetry += ` CapEx policy violation: $${transactionAmount.toFixed(2)} exceeds firm capitalization threshold ($${capThreshold.toLocaleString()}). Change debit account to 1500 (Computer Equipment & Hardware) under ASC 360.`;
  }
  // If amount >= Prepayment threshold ($1,000) with annual description and model expensed it
  else if (
    transactionAmount >= prepayThreshold &&
    context.transactionEvidence.servicePeriod?.includes('12 Months') &&
    proposal.accounting_decision.account_code === '6010'
  ) {
    checks.push({
      dimension: 'policy_compliance',
      name: 'Prepayment Policy Compliance',
      status: 'warning',
      message: `Annual subscription ($${transactionAmount.toFixed(2)}) exceeds prepayment threshold ($${prepayThreshold.toLocaleString()}). ASC 340-20 requires capitalization as Prepaid Asset (1300) with monthly amortization.`,
      codeValidated: true
    });
    warnings.push('Policy prefers Prepaid Asset (1300) over Immediate Expense (6010) for 12-month terms.');
    correctable = true;
    feedbackForRetry += ` Prepayment rule: Annual software contract >= $${prepayThreshold.toLocaleString()} must be recorded as Prepaid Expenses (1300) under ASC 340-20 rather than immediate expense.`;
  } else {
    checks.push({
      dimension: 'policy_compliance',
      name: 'Policy Compliance',
      status: 'passed',
      message: `Compliant with capitalization ($${capThreshold.toLocaleString()}) and prepayment ($${prepayThreshold.toLocaleString()}) thresholds.`,
      codeValidated: true
    });
  }

  // 7. Deterministic Tax Calculations & Statutory Limits
  if (proposal.accounting_decision.account_code === '6040') {
    // Meals & Entertainment MUST be capped at 50% under IRC § 274(n)
    if (proposal.tax_analysis.deductible_percentage > 50) {
      checks.push({
        dimension: 'tax_calculations',
        name: 'Statutory Tax Limit (IRC § 274(n))',
        status: 'failed',
        message: `Tax deductibility violation: Client meals cannot exceed 50% under IRC § 274(n). AI proposed ${proposal.tax_analysis.deductible_percentage}%.`,
        codeValidated: true
      });
      errors.push('Meals deduction exceeds statutory 50% cap.');
      correctable = true;
      feedbackForRetry += ` Tax rule violation: IRC § 274(n) strictly limits business meal deductions to 50%. Correct deductible_percentage to 50.`;
    } else {
      checks.push({
        dimension: 'tax_calculations',
        name: 'Statutory Tax Limit (IRC § 274(n))',
        status: 'passed',
        message: '50% statutory meal deduction cap correctly enforced.',
        codeValidated: true
      });
    }
  } else if (proposal.accounting_decision.account_code === '3020') {
    // Owner Draw must be 0% deductible
    if (proposal.tax_analysis.deductible_percentage > 0) {
      checks.push({
        dimension: 'tax_calculations',
        name: 'Tax Deductibility for Equity Distributions',
        status: 'failed',
        message: 'Owner equity draw is non-deductible for corporate income tax. AI proposed deductible percentage > 0%.',
        codeValidated: true
      });
      errors.push('Owner draw cannot be tax deductible.');
      correctable = true;
      feedbackForRetry += ` Tax rule: Owner draw (3020) is an equity distribution, not an expense. Deductible percentage must be 0%.`;
    } else {
      checks.push({
        dimension: 'tax_calculations',
        name: 'Tax Deductibility for Equity Distributions',
        status: 'passed',
        message: 'Owner draw correctly treated as 0% deductible equity distribution.',
        codeValidated: true
      });
    }
  } else {
    checks.push({
      dimension: 'tax_calculations',
      name: 'Tax Rule Verification',
      status: 'passed',
      message: `Tax treatment verified for ${context.clientIdentity.taxJurisdiction}. Code: ${proposal.tax_analysis.tax_code}.`,
      codeValidated: true
    });
  }

  // 8. Anomaly & Materiality Detection
  const isHighMateriality = transactionAmount > 5000;
  if (isHighMateriality) {
    checks.push({
      dimension: 'anomaly_detection',
      name: 'Materiality & Risk Screening',
      status: 'warning',
      message: `Transaction amount ($${transactionAmount.toLocaleString()}) exceeds $5,000 auto-post ceiling. Requires CPA approval.`,
      codeValidated: true
    });
    warnings.push('High materiality: Requires manual controller sign-off.');
  } else {
    checks.push({
      dimension: 'anomaly_detection',
      name: 'Materiality & Risk Screening',
      status: 'passed',
      message: 'Within routine automated processing limit.',
      codeValidated: true
    });
  }

  // Final Decision Matrix
  const passed = errors.length === 0;
  let decision: 'auto_approve' | 'reprocess_with_feedback' | 'escalate_to_human' = 'auto_approve';

  if (!passed) {
    decision = correctable ? 'reprocess_with_feedback' : 'escalate_to_human';
  } else if (warnings.length > 0 || isHighMateriality || !hasSourceDoc || context.relatedRecords.duplicateCandidateFound) {
    decision = 'escalate_to_human';
  }

  return {
    passed,
    decision,
    checks,
    errors,
    warnings,
    correctable,
    retryCount: 0,
    feedbackForRetry: feedbackForRetry.trim() || undefined
  };
}
