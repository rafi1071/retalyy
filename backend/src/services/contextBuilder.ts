import { TransactionRecord, ClientProfile } from '../types/accounting';
import { AssembledContext } from '../types/engine';
import { CHART_OF_ACCOUNTS } from '../data/mockData';

export function assembleContext(
  transaction: TransactionRecord,
  client: ClientProfile,
  allTransactions: TransactionRecord[] = []
): AssembledContext {
  const descLower = (transaction.rawDescription + ' ' + transaction.normalizedDescription).toLowerCase();

  // 1. Context-aware Account Subset Selection (Filter out irrelevant accounts to preserve token budget)
  let relevantAccountCodes: string[] = ['1010', '2000']; // Always include Operating Bank & Accounts Payable

  if (descLower.includes('software') || descLower.includes('cloud') || descLower.includes('tech') || descLower.includes('annual')) {
    relevantAccountCodes.push('1300', '6010', '6020'); // Prepaid, Software, Hosting
  } else if (descLower.includes('dell') || descLower.includes('hardware') || descLower.includes('workstation') || descLower.includes('equipment')) {
    relevantAccountCodes.push('1500', '1590', '6060'); // Fixed Asset, Accumulated Deprec, Supplies
  } else if (descLower.includes('dinner') || descLower.includes('steak') || descLower.includes('meal') || descLower.includes('restaurant')) {
    relevantAccountCodes.push('6040', '6030'); // Meals 50%, Travel
  } else if (descLower.includes('loan') || descLower.includes('servicing') || descLower.includes('svb loan')) {
    relevantAccountCodes.push('2600', '7010'); // Term Loan Principal, Interest Expense
  } else if (descLower.includes('draw') || descLower.includes('personal') || descLower.includes('distribution')) {
    relevantAccountCodes.push('3010', '3020'); // Equity, Owner Draws
  } else if (descLower.includes('wire incoming') || descLower.includes('retainer') || descLower.includes('deposit')) {
    relevantAccountCodes.push('1200', '2100', '4010', '4020'); // AR, Deferred Revenue, SaaS/Services Rev
  } else {
    relevantAccountCodes.push('6010', '6030', '6060', '1300');
  }

  const relevantAccountsSubset = CHART_OF_ACCOUNTS.filter((acc) =>
    relevantAccountCodes.includes(acc.code)
  ).map((acc) => ({
    code: acc.code,
    name: acc.name,
    category: acc.category,
    normalBalance: (acc.category === 'Asset' || acc.category === 'Expense' ? 'debit' : 'credit') as 'debit' | 'credit',
    description: acc.description
  }));

  // 2. Applicable Accounting Standards & Tax Guidance Retrieval
  const applicableStandards = [];
  if (transaction.amount >= client.prepaymentThreshold || descLower.includes('annual')) {
    applicableStandards.push({
      standardCode: 'ASC 340-20',
      title: 'Other Assets and Deferred Costs - Capitalized Contracts',
      summary: 'Requires expenditures providing future economic benefits over >90 days to be capitalized as Prepaid Asset and recognized systematically over the benefit period.',
      ruleCriteria: `Apply when duration >= 90 days AND amount >= $${client.prepaymentThreshold.toLocaleString()}`
    });
  }
  if (transaction.amount >= client.capitalizationThreshold || descLower.includes('hardware') || descLower.includes('computer')) {
    applicableStandards.push({
      standardCode: 'ASC 360 & Reg. § 1.263(a)-1(f)',
      title: 'Property, Plant, and Equipment - De Minimis Capitalization Safe Harbor',
      summary: 'Tangible property with useful life > 1 year exceeding firm threshold must be capitalized on Balance Sheet and depreciated.',
      ruleCriteria: `Capitalize tangible items exceeding $${client.capitalizationThreshold.toLocaleString()} per invoice`
    });
  }
  if (descLower.includes('meal') || descLower.includes('steak') || descLower.includes('dining')) {
    applicableStandards.push({
      standardCode: 'IRC § 274(n)',
      title: 'Limitation on Business Meals and Entertainment Deductions',
      summary: 'Federal and State tax statutes limit business meal deductions to exactly 50%. Entertainment activities are 100% non-deductible.',
      ruleCriteria: 'Deductibility capped at 50% for qualified business meals with substantiated attendees'
    });
  }
  if (descLower.includes('draw') || descLower.includes('distribution')) {
    applicableStandards.push({
      standardCode: 'IRC § 731 / GAAP Equity',
      title: 'Partner and Shareholder Distributions',
      summary: 'Non-wage equity distributions to owners reduce equity capital and are 0% deductible for business operating profit.',
      ruleCriteria: 'Balance sheet equity debit; excluded from P&L'
    });
  }
  if (descLower.includes('wire incoming') || descLower.includes('retainer')) {
    applicableStandards.push({
      standardCode: 'ASC 606',
      title: 'Revenue from Contracts with Customers - Advance Billings',
      summary: 'Cash received before satisfaction of performance obligation represents Deferred Revenue liability on Balance Sheet.',
      ruleCriteria: 'Credit liability until delivery milestone or subscription term begins'
    });
  }

  // 3. Historical Precedents Retrieval
  const historicalPrecedents = [];
  if (descLower.includes('cloudstack') || descLower.includes('aws')) {
    historicalPrecedents.push({
      vendorName: transaction.counterparty,
      pastTreatment: 'Software & Infrastructure',
      accountCode: '6010',
      sampleDate: '2026-06-15',
      cpaReviewerNotes: 'Standardized SaaS vendor. Monthly bills expensed; annual subscriptions amortized under ASC 340.',
      precedentConfidence: 'high' as const
    });
  }

  // 4. Related Records & Potential Duplicate Check
  const duplicates = allTransactions.filter(
    (t) =>
      t.id !== transaction.id &&
      t.amount === transaction.amount &&
      t.counterparty.toLowerCase() === transaction.counterparty.toLowerCase() &&
      Math.abs(new Date(t.transactionDate).getTime() - new Date(transaction.transactionDate).getTime()) < 86400000 * 5
  );

  // 5. Fact vs Assumption Epistemological Classification
  const verifiedFacts: string[] = [
    `Bank outflow of $${transaction.amount.toFixed(2)} settled on ${transaction.transactionDate} in ${transaction.currency}`,
    `Bank feed account: ${transaction.bankAccount}`,
    `Client entity: ${client.name} in jurisdiction ${client.taxJurisdiction}`
  ];

  if (transaction.sourceDocument) {
    verifiedFacts.push(
      `Collected document ${transaction.sourceDocument.filename} with OCR confidence ${transaction.sourceDocument.ocrConfidence}%`,
      `Extracted invoice number: ${transaction.sourceDocument.extractedInvoiceNumber || 'N/A'}`
    );
  }

  const clientProvidedInfo: string[] = [
    `Raw merchant descriptor: "${transaction.rawDescription}"`,
    `Normalized vendor: ${transaction.counterparty}`
  ];

  const historicalPatterns: string[] = [
    `Client capitalization policy threshold: $${client.capitalizationThreshold.toLocaleString()}`,
    `Client prepayment threshold: $${client.prepaymentThreshold.toLocaleString()}`
  ];

  const workingAssumptions: string[] = [];
  if (descLower.includes('annual')) {
    workingAssumptions.push('Subscription term estimated to be 12 months based on contract phrase "Annual"');
  }
  if (!transaction.sourceDocument) {
    workingAssumptions.push('Missing receipt: Expense legitimacy unconfirmed by itemized proof');
  }

  return {
    clientIdentity: {
      name: client.name,
      id: client.id,
      businessType: client.industry,
      industry: client.industry,
      taxJurisdiction: client.taxJurisdiction,
      entityStructure: 'C-Corporation / Multi-Entity'
    },
    accountingConfiguration: {
      fiscalYearEnd: client.fiscalYearEnd,
      baseCurrency: 'USD',
      accountingBasis: client.accountingStandard,
      relevantAccountsSubset
    },
    transactionEvidence: {
      transactionId: transaction.id,
      bankFeedEntry: {
        date: transaction.transactionDate,
        amount: transaction.amount,
        direction: transaction.direction,
        rawDescription: transaction.rawDescription,
        bankAccount: transaction.bankAccount
      },
      sourceDocument: transaction.sourceDocument
        ? {
            docId: transaction.sourceDocument.id,
            docType: transaction.sourceDocument.docType,
            filename: transaction.sourceDocument.filename,
            extractedDate: transaction.sourceDocument.extractedDate || transaction.transactionDate,
            extractedAmount: transaction.sourceDocument.extractedAmount || transaction.amount,
            extractedVendor: transaction.sourceDocument.extractedVendor || transaction.counterparty,
            extractedInvoiceNumber: transaction.sourceDocument.extractedInvoiceNumber,
            ocrConfidence: transaction.sourceDocument.ocrConfidence,
            rawTextExcerpt: transaction.sourceDocument.rawTextExcerpt || ''
          }
        : undefined,
      servicePeriod: descLower.includes('annual') ? '12 Months (Oct 2026 - Oct 2027)' : 'Current Period'
    },
    relevantPolicies: {
      capitalizationThreshold: client.capitalizationThreshold,
      prepaymentThreshold: client.prepaymentThreshold,
      prepaymentMinDurationDays: 90,
      deMinimisSafeHarborApplies: true,
      mealsAndEntertainmentDeductibilityLimit: 50
    },
    applicableStandards,
    historicalPrecedents,
    relatedRecords: {
      duplicateCandidateFound: duplicates.length > 0,
      duplicateReferenceId: duplicates[0]?.id,
      openInvoicesForVendor: 1
    },
    factClassification: {
      verifiedFacts,
      clientProvidedInfo,
      historicalPatterns,
      workingAssumptions
    },
    tokenBudget: {
      allocatedTokens: 4096,
      estimatedPromptTokens: 820,
      status: 'optimal'
    }
  };
}
