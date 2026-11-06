export type AccountType = 'asset' | 'liab' | 'rev' | 'exp';

export interface ChartAccount {
  code: string;
  name: string;
  type: AccountType;
  balance?: number;
  description?: string;
  isSystem?: boolean;
}

export interface JournalLine {
  a: string; // Account code
  dr?: number; // Debit
  cr?: number; // Credit
  memo?: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  memo: string;
  lines: JournalLine[];
  at: string;
  rec?: boolean;
  source?: 'manual' | 'invoice' | 'bill' | 'expense' | 'bank_feed' | 'ai_workbench';
  referenceId?: string;
}

export interface InvoiceLine {
  d: string; // Description
  q: number; // Quantity
  p: number; // Unit price
  t: number; // Tax %
}

export type InvoiceStatus = 'Paid' | 'Awaiting' | 'Overdue' | 'Draft' | 'Credited';

export interface Invoice {
  no: number;
  contact: string;
  date: string;
  due: string;
  lines: InvoiceLine[];
  sub: number;
  tax: number;
  total: number;
  paid: number;
  cn?: number;
  status?: InvoiceStatus;
  notes?: string;
  clientId?: string;
}

export interface Bill {
  no: string;
  supplier: string;
  date: string;
  due: string;
  category: string; // Account code
  total: number;
  paid: number;
  taxRate?: number;
  notes?: string;
  status?: InvoiceStatus;
  clientId?: string;
}

export interface BankStatementLine {
  id: number;
  date: string;
  desc: string;
  amt: number;
  done: boolean;
  matchedMemo?: string;
  matchedJeId?: number;
}

export interface ContactRecord {
  id: string;
  name: string;
  type: 'Customer' | 'Supplier' | 'Both';
  email?: string;
  phone?: string;
  totalBilled: number;
  outstanding: number;
  clientId?: string;
}

export interface AgedBucket {
  current: number;
  days30: number;
  days60: number;
  days90Plus: number;
}

export interface FinancialSummary {
  bankBalance: number;
  accountsReceivable: number;
  overdueReceivables: number;
  accountsPayable: number;
  netProfit: number;
  unreconciledBankCount: number;
}
