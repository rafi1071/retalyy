import {
  ChartAccount,
  JournalEntry,
  Invoice,
  Bill,
  BankStatementLine,
  ContactRecord,
  FinancialSummary,
  AgedBucket,
  InvoiceStatus,
  AccountType
} from '../types/ledgerline';
import { TransactionRecord } from '../types/accounting';

export const INITIAL_CHART_OF_ACCOUNTS: ChartAccount[] = [
  { code: '1000', name: 'Operating Bank Account', type: 'asset', isSystem: true },
  { code: '1050', name: 'Payroll Clearing Account', type: 'asset', isSystem: true },
  { code: '1100', name: 'Accounts Receivable', type: 'asset', isSystem: true },
  { code: '1200', name: 'Prepaid Expenses', type: 'asset' },
  { code: '2000', name: 'Accounts Payable', type: 'liab', isSystem: true },
  { code: '2200', name: 'Sales Tax Payable', type: 'liab', isSystem: true },
  { code: '2400', name: 'Accrued Payroll Liabilities', type: 'liab' },
  { code: '4000', name: 'Client Retainer & Service Revenue', type: 'rev' },
  { code: '4100', name: 'Advisory & Setup Income', type: 'rev' },
  { code: '6000', name: 'Office Rent & Facilities', type: 'exp' },
  { code: '6100', name: 'Software Subscriptions & Cloud', type: 'exp' },
  { code: '6200', name: 'Marketing & Advertising', type: 'exp' },
  { code: '6300', name: 'Travel & Client Entertainment', type: 'exp' },
  { code: '6400', name: 'Utilities & Internet', type: 'exp' },
  { code: '6500', name: 'Bank & Merchant Processing Fees', type: 'exp' },
  { code: '6600', name: 'Professional Legal & Accounting Fees', type: 'exp' },
  { code: '6700', name: 'Hardware & Office Equipment', type: 'exp' }
];

export const todayISO = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const formatMoney = (n: number): string => {
  const isNeg = n < -0.0001;
  const abs = Math.abs(n);
  return (isNeg ? '-' : '') + '$' + abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export class LedgerEngine {
  accounts: ChartAccount[];
  journalEntries: JournalEntry[];
  invoices: Invoice[];
  bills: Bill[];
  bankStatements: BankStatementLine[];
  lockDate: string;
  nextInvoiceNo: number;

  constructor() {
    this.accounts = [...INITIAL_CHART_OF_ACCOUNTS];
    this.journalEntries = [];
    this.invoices = [];
    this.bills = [];
    this.bankStatements = [];
    this.lockDate = '';
    this.nextInvoiceNo = 1001;
    this.initDefaultLedgerState();
  }

  private initDefaultLedgerState() {
    // 1. Initial Sample Invoices
    this.addInvoice(
      'Northwind Traders',
      todayISO(-40),
      todayISO(-10),
      [{ d: 'Fractional Controller & Accounting Retainer', q: 1, p: 2400, t: 8.25 }]
    );

    this.addInvoice(
      'Blue Fern Studio',
      todayISO(-12),
      todayISO(18),
      [{ d: 'Financial Systems Setup & Bookkeeping Clean-up', q: 1, p: 1850, t: 0 }]
    );

    this.addInvoice(
      'Starlight Robotics',
      todayISO(-5),
      todayISO(25),
      [{ d: 'Tax Provisioning & R&D Credit Calculation', q: 1, p: 3200, t: 0 }]
    );

    // Northwind paid partially
    this.recordPayment(1001, 1200);

    // 2. Initial Sample Bills
    this.addBill('Amazon Web Services', todayISO(-18), todayISO(12), '6100', 489.50, 0);
    this.addBill('WeWork Co-Working HQ', todayISO(-22), todayISO(8), '6000', 1250.00, 0);
    this.addBill('Gusto Payroll Services', todayISO(-4), todayISO(10), '6500', 145.00, 0);

    // Pay one bill
    this.payBill('B1');

    // 3. Initial Sample Bank Statement Lines
    this.bankStatements = [
      { id: 1, date: todayISO(0), desc: 'Deposit: Northwind Traders Pmt', amt: 1200, done: true, matchedJeId: 2 },
      { id: 2, date: todayISO(-1), desc: 'ACH: WeWork Office Rent', amt: -1250, done: false },
      { id: 3, date: todayISO(-2), desc: 'ACH: AWS Cloud Infrastructure', amt: -489.50, done: false },
      { id: 4, date: todayISO(-3), desc: 'SaaS: Figma Design Monthly', amt: -45.00, done: false },
      { id: 5, date: todayISO(-4), desc: 'Merchant Deposit: Stripe Payout', amt: 3500.00, done: false }
    ];
  }

  // Double Entry Poster: Checks balanced debits and credits
  postJournalEntry(date: string, memo: string, lines: { a: string; dr?: number; cr?: number }[], source: JournalEntry['source'] = 'manual', referenceId?: string): JournalEntry {
    const totalDr = lines.reduce((s, l) => s + (l.dr || 0), 0);
    const totalCr = lines.reduce((s, l) => s + (l.cr || 0), 0);

    if (Math.abs(round2(totalDr) - round2(totalCr)) > 0.01) {
      throw new Error(`Unbalanced journal entry: Total Debits ($${totalDr.toFixed(2)}) != Total Credits ($${totalCr.toFixed(2)})`);
    }

    if (this.lockDate && date <= this.lockDate) {
      throw new Error(`Books are locked through ${this.lockDate}. Choose a later transaction date.`);
    }

    const entry: JournalEntry = {
      id: this.journalEntries.length + 1,
      date,
      memo,
      lines: lines.map(l => ({
        a: l.a,
        dr: l.dr ? round2(l.dr) : undefined,
        cr: l.cr ? round2(l.cr) : undefined
      })),
      at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      source,
      referenceId
    };

    this.journalEntries.push(entry);
    return entry;
  }

  // Query account balance dynamically from the general journal
  getAccountBalance(code: string): number {
    return round2(
      this.journalEntries
        .flatMap(j => j.lines)
        .filter(l => l.a === code)
        .reduce((sum, line) => sum + (line.dr || 0) - (line.cr || 0), 0)
    );
  }

  // Sum by type: 'asset', 'liab', 'rev', 'exp'
  getSumByType(type: AccountType): number {
    return this.accounts
      .filter(a => a.type === type)
      .reduce((sum, a) => sum + this.getAccountBalance(a.code), 0);
  }

  // Invoice creation with automatic accounts receivable & revenue posting
  addInvoice(contact: string, date: string, due: string, lines: { d: string; q: number; p: number; t: number }[]): Invoice {
    const sub = round2(lines.reduce((s, l) => s + l.q * l.p, 0));
    const tax = round2(lines.reduce((s, l) => s + (l.q * l.p * l.t) / 100, 0));
    const total = round2(sub + tax);

    const inv: Invoice = {
      no: this.nextInvoiceNo++,
      contact,
      date,
      due,
      lines,
      sub,
      tax,
      total,
      paid: 0,
      cn: 0,
      status: due < todayISO() ? 'Overdue' : 'Awaiting'
    };

    this.invoices.push(inv);

    // Double entry: Dr AR (1100), Cr Sales (4000), Cr Sales Tax (2200)
    this.postJournalEntry(
      date,
      `Invoice #${inv.no} – ${contact}`,
      [
        { a: '1100', dr: total },
        { a: '4000', cr: sub },
        ...(tax > 0 ? [{ a: '2200', cr: tax }] : [])
      ],
      'invoice',
      String(inv.no)
    );

    return inv;
  }

  // Pay invoice: Dr Bank (1000), Cr AR (1100)
  recordPayment(invoiceNo: number, amount?: number): void {
    const inv = this.invoices.find(i => i.no === invoiceNo);
    if (!inv) throw new Error('Invoice not found');

    const outstanding = round2(inv.total - inv.paid);
    const payAmt = amount ? Math.min(amount, outstanding) : outstanding;
    if (payAmt <= 0) return;

    inv.paid = round2(inv.paid + payAmt);
    inv.status = inv.paid >= inv.total - 0.01 ? 'Paid' : 'Awaiting';

    this.postJournalEntry(
      todayISO(),
      `Payment for invoice #${invoiceNo} (${inv.contact})`,
      [
        { a: '1000', dr: payAmt },
        { a: '1100', cr: payAmt }
      ],
      'invoice',
      String(invoiceNo)
    );
  }

  // Credit note: Dr Revenue, Cr AR
  issueCreditNote(invoiceNo: number): void {
    const inv = this.invoices.find(i => i.no === invoiceNo);
    if (!inv) throw new Error('Invoice not found');

    const outstanding = round2(inv.total - inv.paid);
    if (outstanding <= 0) return;

    const subPortion = round2((outstanding * inv.sub) / inv.total);
    const taxPortion = round2(outstanding - subPortion);

    inv.paid = round2(inv.paid + outstanding);
    inv.cn = round2((inv.cn || 0) + outstanding);
    inv.status = 'Credited';

    this.postJournalEntry(
      todayISO(),
      `Credit note for invoice #${invoiceNo} – ${inv.contact}`,
      [
        { a: '4000', dr: subPortion },
        ...(taxPortion > 0 ? [{ a: '2200', dr: taxPortion }] : []),
        { a: '1100', cr: outstanding }
      ],
      'invoice',
      String(invoiceNo)
    );
  }

  // Bill creation: Dr Expense Account, Cr Accounts Payable (2000)
  addBill(supplier: string, date: string, due: string, categoryAccount: string, amount: number, taxRate: number = 0): Bill {
    const net = round2(amount);
    const tax = round2((net * taxRate) / 100);
    const total = round2(net + tax);

    const b: Bill = {
      no: 'B' + (this.bills.length + 1),
      supplier,
      date,
      due,
      category: categoryAccount,
      total,
      paid: 0,
      taxRate,
      status: due < todayISO() ? 'Overdue' : 'Awaiting'
    };

    this.bills.push(b);

    this.postJournalEntry(
      date,
      `Bill ${b.no} – ${supplier}`,
      [
        { a: categoryAccount, dr: net },
        ...(tax > 0 ? [{ a: '2200', dr: tax }] : []),
        { a: '2000', cr: total }
      ],
      'bill',
      b.no
    );

    return b;
  }

  // Pay bill: Dr Accounts Payable (2000), Cr Bank (1000)
  payBill(billNo: string): void {
    const b = this.bills.find(x => x.no === billNo);
    if (!b) throw new Error('Bill not found');

    const outstanding = round2(b.total - b.paid);
    if (outstanding <= 0) return;

    b.paid = b.total;
    b.status = 'Paid';

    this.postJournalEntry(
      todayISO(),
      `Payment for bill ${billNo} – ${b.supplier}`,
      [
        { a: '2000', dr: outstanding },
        { a: '1000', cr: outstanding }
      ],
      'bill',
      billNo
    );
  }

  // Add Expense: Dr Expense Account, Cr Bank (1000)
  addExpense(description: string, categoryAccount: string, amount: number): void {
    const m = round2(amount);
    if (m <= 0) return;

    this.postJournalEntry(
      todayISO(),
      description || 'Direct Expense',
      [
        { a: categoryAccount, dr: m },
        { a: '1000', cr: m }
      ],
      'expense'
    );
  }

  // Bank Reconciliation
  matchBankLine(bankLineId: number, journalEntryId: number): void {
    const line = this.bankStatements.find(b => b.id === bankLineId);
    const entry = this.journalEntries.find(j => j.id === journalEntryId);
    if (line && entry) {
      line.done = true;
      line.matchedJeId = journalEntryId;
      line.matchedMemo = entry.memo;
      entry.rec = true;
    }
  }

  codeBankLine(bankLineId: number, accountCode: string): void {
    const line = this.bankStatements.find(b => b.id === bankLineId);
    if (!line) return;

    const amt = Math.abs(line.amt);
    const isDeposit = line.amt > 0;

    // Post balanced entry:
    // If deposit: Dr Bank (1000), Cr Selected Account
    // If withdrawal: Dr Selected Account, Cr Bank (1000)
    const entry = this.postJournalEntry(
      line.date,
      `Bank Feed: ${line.desc}`,
      isDeposit
        ? [{ a: '1000', dr: amt }, { a: accountCode, cr: amt }]
        : [{ a: accountCode, dr: amt }, { a: '1000', cr: amt }],
      'bank_feed'
    );

    entry.rec = true;
    line.done = true;
    line.matchedJeId = entry.id;
    line.matchedMemo = entry.memo;
  }

  // --- THE CRITICAL INTEGRATION BRIDGE: Post Approved AI Workbench Transactions directly to Ledgerline ---
  postBatchFromAIWorkbench(transactions: TransactionRecord[]): { postedCount: number; totalAmount: number } {
    let count = 0;
    let sum = 0;

    for (const txn of transactions) {
      const amt = round2(txn.amount);
      const isCredit = txn.direction === 'inflow';
      const categoryCode = txn.accountCode || (isCredit ? '4000' : '6100');
      const memo = `AI Ingestion #${txn.id}: ${txn.counterparty || txn.normalizedDescription || 'Transaction'}`;

      if (isCredit) {
        // Customer payment or revenue
        this.postJournalEntry(
          txn.transactionDate,
          memo,
          [
            { a: '1000', dr: amt },
            { a: categoryCode, cr: amt }
          ],
          'ai_workbench',
          txn.id
        );
      } else {
        // Expense / vendor bill
        this.postJournalEntry(
          txn.transactionDate,
          memo,
          [
            { a: categoryCode, dr: amt },
            { a: '1000', cr: amt }
          ],
          'ai_workbench',
          txn.id
        );

        // Also add to bills if it had an invoice number
        if (txn.extractedFields?.invoiceNumber) {
          const b: Bill = {
            no: 'B-' + txn.id.slice(0, 6),
            supplier: txn.counterparty || 'Supplier',
            date: txn.transactionDate,
            due: todayISO(14),
            category: categoryCode,
            total: amt,
            paid: amt,
            status: 'Paid'
          };
          this.bills.push(b);
        }
      }

      count++;
      sum += amt;
    }

    return { postedCount: count, totalAmount: round2(sum) };
  }

  // Real-time Financial KPI summary
  getFinancialSummary(): FinancialSummary {
    const bankBalance = this.getAccountBalance('1000');
    const ar = this.getAccountBalance('1100');
    const ap = -this.getAccountBalance('2000');
    const rev = -this.getSumByType('rev');
    const exp = this.getSumByType('exp');
    const netProfit = round2(rev - exp);

    const overdueReceivables = round2(
      this.invoices
        .filter(i => i.status === 'Overdue')
        .reduce((sum, i) => sum + (i.total - i.paid), 0)
    );

    const unreconciledBankCount = this.bankStatements.filter(b => !b.done).length;

    return {
      bankBalance,
      accountsReceivable: ar,
      overdueReceivables,
      accountsPayable: ap,
      netProfit,
      unreconciledBankCount
    };
  }

  // Aged Receivables & Payables Buckets
  getAgedReceivables(): AgedBucket {
    const bucket: AgedBucket = { current: 0, days30: 0, days60: 0, days90Plus: 0 };
    const today = new Date(todayISO());

    for (const inv of this.invoices) {
      const outstanding = round2(inv.total - inv.paid);
      if (outstanding <= 0.01) continue;

      const dueDate = new Date(inv.due);
      const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays <= 0) bucket.current = round2(bucket.current + outstanding);
      else if (diffDays <= 30) bucket.days30 = round2(bucket.days30 + outstanding);
      else if (diffDays <= 60) bucket.days60 = round2(bucket.days60 + outstanding);
      else bucket.days90Plus = round2(bucket.days90Plus + outstanding);
    }
    return bucket;
  }

  getAgedPayables(): AgedBucket {
    const bucket: AgedBucket = { current: 0, days30: 0, days60: 0, days90Plus: 0 };
    const today = new Date(todayISO());

    for (const bill of this.bills) {
      const outstanding = round2(bill.total - bill.paid);
      if (outstanding <= 0.01) continue;

      const dueDate = new Date(bill.due);
      const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays <= 0) bucket.current = round2(bucket.current + outstanding);
      else if (diffDays <= 30) bucket.days30 = round2(bucket.days30 + outstanding);
      else if (diffDays <= 60) bucket.days60 = round2(bucket.days60 + outstanding);
      else bucket.days90Plus = round2(bucket.days90Plus + outstanding);
    }
    return bucket;
  }

  getContacts(): ContactRecord[] {
    const map: Record<string, ContactRecord> = {};

    for (const inv of this.invoices) {
      if (!map[inv.contact]) {
        map[inv.contact] = {
          id: 'con-' + inv.contact.toLowerCase().replace(/\s+/g, '-'),
          name: inv.contact,
          type: 'Customer',
          totalBilled: 0,
          outstanding: 0
        };
      }
      map[inv.contact].totalBilled = round2(map[inv.contact].totalBilled + inv.total);
      map[inv.contact].outstanding = round2(map[inv.contact].outstanding + (inv.total - inv.paid));
    }

    for (const b of this.bills) {
      if (!map[b.supplier]) {
        map[b.supplier] = {
          id: 'con-' + b.supplier.toLowerCase().replace(/\s+/g, '-'),
          name: b.supplier,
          type: 'Supplier',
          totalBilled: 0,
          outstanding: 0
        };
      } else if (map[b.supplier].type === 'Customer') {
        map[b.supplier].type = 'Both';
      }
      map[b.supplier].totalBilled = round2(map[b.supplier].totalBilled + b.total);
      map[b.supplier].outstanding = round2(map[b.supplier].outstanding + (b.total - b.paid));
    }

    return Object.values(map);
  }
}
