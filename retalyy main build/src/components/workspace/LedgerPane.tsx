import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';
import { JournalLine } from '../../types';

export const LedgerPane: React.FC = () => {
  const {
    accounts,
    journalEntries,
    postJournalEntry,
    reverseJournalEntry,
    selectedClient
  } = useStartupSystem();

  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'chart_of_accounts'>('journal');
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  // New Journal Entry Form State
  const [entryDate, setEntryDate] = useState(new Date().toISOString().substring(0, 10));
  const [memo, setMemo] = useState('');
  const [reference, setReference] = useState('');
  const [lines, setLines] = useState<JournalLine[]>([
    { id: '1', accountId: accounts[0]?.id || '', accountCode: accounts[0]?.code || '1010', accountName: accounts[0]?.name || '', debitMinor: 0, creditMinor: 0 },
    { id: '2', accountId: accounts[1]?.id || '', accountCode: accounts[1]?.code || '5100', accountName: accounts[1]?.name || '', debitMinor: 0, creditMinor: 0 }
  ]);

  const totalDebits = lines.reduce((sum, l) => sum + (l.debitMinor || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + (l.creditMinor || 0), 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  const handleLineChange = (index: number, field: string, val: any) => {
    setLines(prev => {
      const copy = [...prev];
      if (field === 'accountId') {
        const acc = accounts.find(a => a.id === val);
        copy[index] = {
          ...copy[index],
          accountId: val,
          accountCode: acc?.code || '',
          accountName: acc?.name || ''
        };
      } else if (field === 'debit') {
        copy[index] = {
          ...copy[index],
          debitMinor: Math.round(parseFloat(val || '0') * 100),
          creditMinor: 0 // Invariant: exactly one is non-zero
        };
      } else if (field === 'credit') {
        copy[index] = {
          ...copy[index],
          creditMinor: Math.round(parseFloat(val || '0') * 100),
          debitMinor: 0
        };
      }
      return copy;
    });
  };

  const handleAddLine = () => {
    setLines(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        accountId: accounts[0]?.id || '',
        accountCode: accounts[0]?.code || '',
        accountName: accounts[0]?.name || '',
        debitMinor: 0,
        creditMinor: 0
      }
    ]);
  };

  const handlePostEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      alert('Debits must exactly equal Credits before posting!');
      return;
    }

    const success = postJournalEntry({
      clientId: selectedClient.id,
      entryDate,
      memo: memo || 'Manual adjustment journal entry',
      reference: reference || `REF-${Date.now().toString().slice(-6)}`,
      sourceType: 'manual',
      postedBy: selectedClient.staffReviewer,
      lines: lines.filter(l => l.debitMinor > 0 || l.creditMinor > 0)
    });

    if (success) {
      setShowNewEntryModal(false);
      setMemo('');
      setReference('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D9F0E2]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('journal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'journal'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
            }`}
          >
            General Journal ({journalEntries.length} Posted Entries)
          </button>
          <button
            onClick={() => setActiveSubTab('chart_of_accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'chart_of_accounts'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
            }`}
          >
            Chart of Accounts ({accounts.length} Accounts)
          </button>
        </div>

        <button
          onClick={() => setShowNewEntryModal(true)}
          className="px-4 py-2 rounded-xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-sm"
        >
          + Post Journal Entry
        </button>
      </div>

      {/* SUBVIEW 1: GENERAL JOURNAL TABLE */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#EDF9F1] border border-[#27B665]/30 text-xs font-mono text-[#0F7A41] flex items-center justify-between">
            <span>
              <strong>Non-Negotiable Invariants 4 & 5:</strong> Posted entries are immutable. Debits strictly equal credits. Corrections are reversing entries.
            </span>
            <span className="font-bold">Integer Minor Units (Cents)</span>
          </div>

          <div className="space-y-4">
            {journalEntries.map(entry => {
              const entryTotalDebits = entry.lines.reduce((s, l) => s + l.debitMinor, 0);
              const isReversed = entry.status === 'reversed';

              return (
                <div
                  key={entry.id}
                  className={`bg-white rounded-3xl p-6 border transition-all ${
                    isReversed ? 'border-red-200 bg-red-50/20 opacity-75' : 'border-[#D9F0E2] shadow-sm'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#D9F0E2]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#52705F]">
                          {entry.id} · Ref: {entry.reference}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          isReversed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.status}
                        </span>
                        {entry.reversesEntryId && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            Reverses {entry.reversesEntryId}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-[#0C2B1C] text-base mt-1">
                        {entry.memo}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-mono text-[#52705F]">Entry Total</div>
                        <div className="text-lg font-mono font-bold text-[#0C2B1C]">
                          ${(entryTotalDebits / 100).toFixed(2)}
                        </div>
                      </div>

                      {!isReversed && (
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for reversing entry:', 'Correction of categorization error');
                            if (reason) reverseJournalEntry(entry.id, reason);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-all"
                        >
                          Reverse Entry ↺
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Journal Lines Table */}
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-[#52705F] border-b border-[#D9F0E2]/60 text-left">
                          <th className="py-2">Account Code</th>
                          <th className="py-2">Account Name</th>
                          <th className="py-2 text-right">Debit ($)</th>
                          <th className="py-2 text-right">Credit ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9F0E2]/40">
                        {entry.lines.map(line => (
                          <tr key={line.id}>
                            <td className="py-2 font-bold text-[#0C2B1C]">{line.accountCode}</td>
                            <td className="py-2 text-[#0C2B1C]">{line.accountName}</td>
                            <td className="py-2 text-right font-bold text-[#0C2B1C]">
                              {line.debitMinor > 0 ? `$${(line.debitMinor / 100).toFixed(2)}` : '—'}
                            </td>
                            <td className="py-2 text-right font-bold text-[#0C2B1C]">
                              {line.creditMinor > 0 ? `$${(line.creditMinor / 100).toFixed(2)}` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#52705F] mt-3 pt-2 border-t border-[#D9F0E2]/60">
                    <span>Posted Date: <strong>{entry.entryDate}</strong></span>
                    <span>Posted By: <strong>{entry.postedBy}</strong></span>
                    <span>Source: <strong className="capitalize">{entry.sourceType}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBVIEW 2: CHART OF ACCOUNTS TREE */}
      {activeSubTab === 'chart_of_accounts' && (
        <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
            <h3 className="font-bold text-[#0C2B1C] text-base">
              Chart of Accounts · {selectedClient.name}
            </h3>
            <span className="text-xs font-mono text-[#52705F]">
              Standard US Contractor & Services Hierarchy
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="font-mono text-[#52705F] border-b border-[#D9F0E2] text-left">
                  <th className="py-2.5">Code</th>
                  <th className="py-2.5">Account Name</th>
                  <th className="py-2.5">Category Type</th>
                  <th className="py-2.5">Normal Balance</th>
                  <th className="py-2.5 text-right">Current Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9F0E2]/60 font-mono">
                {accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-[#F8FCF9]">
                    <td className="py-2.5 font-bold text-[#0C2B1C]">{acc.code}</td>
                    <td className="py-2.5 font-sans font-semibold text-[#0C2B1C]">{acc.name}</td>
                    <td className="py-2.5 uppercase text-[10px] text-[#52705F] font-bold">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-2.5 uppercase text-[#52705F]">{acc.normalBalance}</td>
                    <td className="py-2.5 text-right font-bold text-[#0C2B1C]">
                      ${(acc.currentBalanceMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW JOURNAL ENTRY MODAL */}
      {showNewEntryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#D9F0E2] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
              <h3 className="font-bold text-lg text-[#0C2B1C]">Create Double-Entry Journal Entry</h3>
              <button
                onClick={() => setShowNewEntryModal(false)}
                className="text-gray-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#52705F]">Date</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={e => setEntryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#52705F]">Reference #</label>
                  <input
                    type="text"
                    placeholder="e.g. ADJ-2026-01"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#52705F]">Memo / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Month-end depreciation adjustment"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1"
                    required
                  />
                </div>
              </div>

              {/* Lines Input */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0C2B1C]">Journal Lines (Debits must equal Credits)</span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="text-xs text-[#0F7A41] font-bold hover:underline"
                  >
                    + Add Line
                  </button>
                </div>

                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-center bg-[#F8FCF9] p-2.5 rounded-xl border border-[#D9F0E2]">
                      <div className="col-span-6">
                        <select
                          value={line.accountId}
                          onChange={e => handleLineChange(idx, 'accountId', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-[#D9F0E2] bg-white font-medium"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.code} - {acc.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Debit $"
                          value={line.debitMinor > 0 ? (line.debitMinor / 100) : ''}
                          onChange={e => handleLineChange(idx, 'debit', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-[#D9F0E2] font-mono text-right"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Credit $"
                          value={line.creditMinor > 0 ? (line.creditMinor / 100) : ''}
                          onChange={e => handleLineChange(idx, 'credit', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-[#D9F0E2] font-mono text-right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Balance Summary Invariant Check */}
              <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                isBalanced
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div>
                  <span>Total Debits: <strong>${(totalDebits / 100).toFixed(2)}</strong></span>
                  <span className="mx-2">|</span>
                  <span>Total Credits: <strong>${(totalCredits / 100).toFixed(2)}</strong></span>
                </div>
                <div className="font-bold">
                  {isBalanced ? '✓ Balanced (Debits = Credits)' : `Out of balance: $${(Math.abs(totalDebits - totalCredits) / 100).toFixed(2)}`}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#D9F0E2]">
                <button
                  type="button"
                  onClick={() => setShowNewEntryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    isBalanced
                      ? 'bg-[#27B665] text-[#0C2B1C] hover:bg-[#209c55] shadow-sm'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Post to Ledger ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
