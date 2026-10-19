import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const BankFeedsPane: React.FC = () => {
  const {
    bankTransactions,
    syncPlaidFeed,
    importCsvTransactions,
    selectedClient
  } = useStartupSystem();

  const [csvRawText, setCsvRawText] = useState(
    `Date,Description,Amount\n2026-10-17,UNITED RENTALS EQUIPMENT #0921,-640.00\n2026-10-17,CHEVRON 0492 SAN JOSE CA,-84.50\n2026-10-18,DEPOSIT ACH PROGRESS DRAW 3,45000.00`
  );
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [plaidSyncing, setPlaidSyncing] = useState(false);

  const handleSyncPlaid = () => {
    setPlaidSyncing(true);
    setTimeout(() => {
      syncPlaidFeed();
      setPlaidSyncing(false);
      alert('Plaid cursor-based transaction sync complete! 1 new bank line ingested.');
    }, 1000);
  };

  const handleParseCsv = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvRawText.trim().split('\n');
    const newTxs = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 3) {
        const date = parts[0].trim();
        const desc = parts[1].trim();
        const amt = parseFloat(parts[2].trim());

        newTxs.push({
          postedDate: date,
          descriptionRaw: desc,
          descriptionClean: desc.replace(/[#0-9]/g, '').trim(),
          counterparty: desc.split(' ')[0] || 'Vendor',
          amountMinor: Math.round(amt * 100)
        });
      }
    }

    if (newTxs.length > 0) {
      importCsvTransactions(newTxs);
      setShowCsvModal(false);
      alert(`Imported ${newTxs.length} bank statement rows! Review items dispatched to queue.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bank Feeds Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Primary Connected Feed</div>
          <div className="text-base font-bold text-[#0C2B1C] mt-1">
            {selectedClient.bankAccountMask}
          </div>
          <div className="text-xs text-[#0F7A41] font-mono mt-1">
            ✓ Plaid Link OAuth 2.0 Token Valid
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Ingested Transactions</div>
          <div className="text-2xl font-mono font-extrabold text-[#0C2B1C] mt-1">
            {bankTransactions.length}
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            Cursor-based idempotent sync
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Import Actions</div>
            <div className="text-xs text-[#52705F] mt-1">Plaid sync or CSV mapping</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSyncPlaid}
              disabled={plaidSyncing}
              className="px-3 py-2 rounded-xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{plaidSyncing ? 'Syncing...' : 'Sync Plaid'}</span>
              <span>⚡</span>
            </button>
            <button
              onClick={() => setShowCsvModal(true)}
              className="px-3 py-2 rounded-xl bg-[#0C2B1C] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#16432E] transition-all shadow-sm"
            >
              + CSV
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
          <h3 className="font-bold text-[#0C2B1C] text-base">
            Bank Transactions Feed ({bankTransactions.length} Transactions)
          </h3>
          <span className="text-xs font-mono text-[#52705F]">
            Raw description preserved · Non-float minor units (cents)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-[#52705F] border-b border-[#D9F0E2] text-left">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Counterparty (Normalized)</th>
                <th className="py-2.5">Raw Bank Descriptor</th>
                <th className="py-2.5">Source</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9F0E2]/60">
              {bankTransactions.map(tx => {
                const isOutflow = tx.amountMinor < 0;
                return (
                  <tr key={tx.id} className="hover:bg-[#F8FCF9]">
                    <td className="py-3 font-bold text-[#0C2B1C]">{tx.postedDate}</td>
                    <td className="py-3 font-sans font-bold text-[#0C2B1C]">{tx.counterparty}</td>
                    <td className="py-3 text-[11px] text-gray-500 break-all max-w-[280px]">
                      {tx.descriptionRaw}
                    </td>
                    <td className="py-3 capitalize">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px]">
                        {tx.source}
                      </span>
                    </td>
                    <td className="py-3 capitalize">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'matched' ? 'bg-green-100 text-green-800' :
                        tx.status === 'categorized' ? 'bg-blue-100 text-blue-800' :
                        tx.status === 'exception' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-bold text-xs ${
                      isOutflow ? 'text-[#0C2B1C]' : 'text-[#0F7A41]'
                    }`}>
                      {isOutflow ? `-$${(Math.abs(tx.amountMinor) / 100).toFixed(2)}` : `+$${(tx.amountMinor / 100).toFixed(2)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV IMPORT MODAL */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D9F0E2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
              <h3 className="font-bold text-lg text-[#0C2B1C]">Import Bank Statement CSV</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-gray-400 hover:text-black font-bold">✕</button>
            </div>

            <p className="text-xs text-[#52705F]">
              Paste CSV rows below (Header: Date, Description, Amount). Inflows positive, Outflows negative.
            </p>

            <form onSubmit={handleParseCsv} className="space-y-4">
              <textarea
                rows={6}
                value={csvRawText}
                onChange={e => setCsvRawText(e.target.value)}
                className="w-full text-xs font-mono p-3 rounded-2xl border border-[#D9F0E2] bg-[#F8FCF9] focus:outline-none focus:border-[#27B665]"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0C2B1C] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#16432E] transition-all"
                >
                  Parse & Import CSV Rows →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
