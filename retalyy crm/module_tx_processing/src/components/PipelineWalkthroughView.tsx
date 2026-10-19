import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  GitCompare,
  Tags,
  Calculator,
  Send,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { TransactionRecord } from '../types/accounting';

interface PipelineWalkthroughViewProps {
  transactions: TransactionRecord[];
  onOpenDrawer: (txn: TransactionRecord) => void;
}

export const PipelineWalkthroughView: React.FC<PipelineWalkthroughViewProps> = ({
  transactions,
  onOpenDrawer,
}) => {
  // Select the showcase transaction ($1,200 CloudStack) or first transaction
  const showcaseTxn =
    transactions.find((t) => t.amount === 1200 && t.counterparty.includes('CloudStack')) ||
    transactions[0];

  const [activeStage, setActiveStage] = useState<number>(5);

  const stages = [
    {
      num: 1,
      title: 'Extract Transaction Data',
      subtitle: 'Read collected documents & bank feeds',
      icon: FileText,
      description:
        'Parses OCR text from collected PDF invoices, receipts, and bank statement feeds. Identifies dates, gross amounts, counterparty names, invoice numbers, tax lines, and currencies.',
      outputLabel: 'Structured Transaction Record',
      evidenceData: {
        rawFeed: showcaseTxn.rawDescription,
        extractedDate: showcaseTxn.extractedFields.date,
        extractedVendor: showcaseTxn.extractedFields.vendor,
        grossAmount: `$${showcaseTxn.extractedFields.grossAmount.toFixed(2)} ${showcaseTxn.extractedFields.currency}`,
        sourceDoc: showcaseTxn.sourceDocument?.filename,
        ocrQuality: `${showcaseTxn.sourceDocument?.ocrConfidence}% OCR confidence`
      }
    },
    {
      num: 2,
      title: 'Normalize and Validate',
      subtitle: 'Standardize formats and detect integrity risks',
      icon: CheckCircle,
      description:
        'Standardizes dates to ISO 8601, unifies currency symbols, resolves raw bank merchant strings into recognized corporate vendors, and checks for duplicates, sign direction, and missing fields.',
      outputLabel: 'Standardized Records with Validation Flags',
      evidenceData: {
        normalizedVendor: showcaseTxn.counterparty,
        standardDate: showcaseTxn.transactionDate,
        direction: 'Outflow (Bank Debit -)',
        integrityCheck: 'Zero Missing Required Fields',
        flagsTriggered: showcaseTxn.validationFlags.map((f) => f.code).join(', ') || 'Clean Record'
      }
    },
    {
      num: 3,
      title: 'Match Related Records',
      subtitle: '2-way & 3-way reconciliation linking',
      icon: GitCompare,
      description:
        'Matches bank transaction debit/credit records against collected invoices, receipts, bills, and purchase orders. Identifies full matches, partial payments, and unmatched exceptions.',
      outputLabel: 'Matched Transactions & Exception Queue',
      evidenceData: {
        matchConfidence: `${showcaseTxn.matching.confidence}% High Confidence Match`,
        matchedInvoice: showcaseTxn.matching.matchedInvoiceNumber || 'INV-2026-8812',
        variance: `$${showcaseTxn.matching.varianceAmount?.toFixed(2) || '0.00'} (Zero Variance)`,
        ruleApplied: showcaseTxn.matching.matchRuleUsed
      }
    },
    {
      num: 4,
      title: 'Classify Each Transaction',
      subtitle: 'Map into Client Chart of Accounts',
      icon: Tags,
      description:
        "Determines the fundamental accounting category using the client's Chart of Accounts, historical vendor mapping, and business context: Revenue, Expense, Asset, Liability, or Equity.",
      outputLabel: 'Proposed Account Code & Category',
      evidenceData: {
        accountCode: showcaseTxn.accountCode,
        accountName: showcaseTxn.accountName,
        accountCategory: showcaseTxn.accountCategory,
        taxCode: showcaseTxn.taxCode,
        initialCategory: 'Software Subscription / Prepaid Asset'
      }
    },
    {
      num: 5,
      title: 'Determine Accounting Treatment',
      subtitle: 'GAAP / IFRS rules, Prepayment vs Immediate OpEx',
      icon: Calculator,
      description:
        'Decides whether the event is an immediate expense, prepaid asset, capitalized equipment purchase, loan repayment, or owner draw. Formulates balanced Double-Entry journal entries with technical policy citations.',
      outputLabel: 'Balanced Journal Entry with Standard Citation',
      evidenceData: {
        decision: showcaseTxn.treatmentType.replace('_', ' '),
        justification: showcaseTxn.treatmentJustification,
        policyCitation: showcaseTxn.policyCitation,
        debitLine: `Dr. ${showcaseTxn.journalLines[0]?.accountNumber} ${showcaseTxn.journalLines[0]?.accountName} $${showcaseTxn.journalLines[0]?.amount.toFixed(2)}`,
        creditLine: `Cr. ${showcaseTxn.journalLines[1]?.accountNumber} ${showcaseTxn.journalLines[1]?.accountName} $${showcaseTxn.journalLines[1]?.amount.toFixed(2)}`,
        taxTreatment: showcaseTxn.taxTreatment
      }
    },
    {
      num: 6,
      title: 'Post or Queue for Approval',
      subtitle: 'Autonomous posting engine & review governance',
      icon: Send,
      description:
        'Automatically posts transactions that satisfy the firm’s confidence and materiality rules to the General Ledger. Routes exceptions, high-risk items, and material CapEx to Senior Accountants with complete audit trail.',
      outputLabel: 'Posted Ledger Entries or Pending Review Queue',
      evidenceData: {
        routingStatus: showcaseTxn.status,
        auditTrailEntries: `${showcaseTxn.approvalHistory.length} Recorded Governance Steps`,
        trialBalanceImpact: 'Ready for Step 3: Bank Reconciliation & Review',
        reviewedBy: showcaseTxn.reviewedBy || 'Staff Accountant'
      }
    }
  ];

  const current = stages[activeStage - 1];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">
            The 6-Stage Transaction Processing Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Follow the transformation of a raw bank payment and collected document into an audit-ready,
          double-entry general ledger journal entry. Interactive showcase based on the $1,200 annual subscription case.
        </p>

        {/* Stepper buttons */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-5">
          {stages.map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStage(st.num)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activeStage === st.num
                  ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] font-bold text-indigo-400">
                0{st.num}
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                {st.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Detail Deep Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-indigo-400">
                Step 0{current.num} Workflow Engine
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {current.title}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
              Step Output Deliverable
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {current.outputLabel}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed my-4">
          {current.description}
        </p>

        {/* Real Data Transformation Matrix */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Live Transformation:</span>
              <span className="font-mono text-indigo-400">{showcaseTxn.id} ({showcaseTxn.counterparty})</span>
            </span>
            <button
              onClick={() => onOpenDrawer(showcaseTxn)}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px]"
            >
              <span>Inspect in Workbench</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {Object.entries(current.evidenceData).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider block font-sans">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-slate-200 font-medium mt-0.5 block truncate" title={String(val)}>
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 5 Special Callout for the $1,200 Example */}
        {current.num === 5 && (
          <div className="mt-4 p-4 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>Prompt Example: Expensed Immediately vs. Capitalized as Prepaid</span>
            </div>
            <p className="leading-relaxed">
              If recorded as an <strong>Immediate Software Expense</strong>:
              Debit Software expense $1,200 | Credit Bank $1,200.
            </p>
            <p className="leading-relaxed">
              If recorded as a <strong>Prepaid Asset</strong>:
              Debit Prepaid Expenses $1,200 | Credit Bank $1,200, followed by monthly adjusting entries of $100/mo over 12 months.
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Tax Note: Bank payment alone does not prove an expense is deductible. Business purpose, jurisdiction, documentation, and IRC § 162 rules apply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
