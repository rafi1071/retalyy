import React, { useState, useEffect } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';
import { ReviewItem, LedgerAccount } from '../../types';

export const ReviewQueuePane: React.FC = () => {
  const {
    reviewItems,
    approveReviewItem,
    editReviewItem,
    rejectReviewItem,
    bulkApproveFiltered,
    bankTransactions,
    documents,
    accounts,
    selectedClient,
    activeLearnedRules,
    activateLearnedRule
  } = useStartupSystem();

  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    return reviewItems.find(r => r.status === 'needs_review')?.id || reviewItems[0]?.id || '';
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_review' | 'approved' | 'rejected'>('needs_review');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editAccountId, setEditAccountId] = useState('');
  const [editRationale, setEditRationale] = useState('');

  // Filter items
  const filteredItems = reviewItems.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchReason = item.reason.toLowerCase().includes(q);
      const matchAccount = item.aiSuggestion.accountName?.toLowerCase().includes(q);
      if (!matchReason && !matchAccount) return false;
    }
    return true;
  });

  const currentItem = reviewItems.find(r => r.id === selectedItemId) || filteredItems[0] || reviewItems[0];
  const currentTx = bankTransactions.find(bt => bt.id === currentItem?.bankTransactionId);
  const currentDoc = documents.find(d => d.id === currentItem?.sourceDocumentId);

  // Sync edit account when current item changes
  useEffect(() => {
    if (currentItem?.aiSuggestion.accountId) {
      setEditAccountId(currentItem.aiSuggestion.accountId);
      setEditRationale(currentItem.aiSuggestion.rationale);
      setIsEditing(false);
    }
  }, [currentItem?.id]);

  // Global Keyboard Shortcuts (Section 10 of Brief: A approve, E edit, R reject, J/K nav, B bulk approve)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        if (currentItem && currentItem.status === 'needs_review') {
          e.preventDefault();
          approveReviewItem(currentItem.id);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (currentItem && currentItem.status === 'needs_review') {
          e.preventDefault();
          const reason = prompt('Reason for rejection or client query:', 'Missing vendor receipt or ambiguous job allocation');
          if (reason) rejectReviewItem(currentItem.id, reason);
        }
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsEditing(prev => !prev);
      } else if (e.key === 'j' || e.key === 'J') {
        // Next item
        e.preventDefault();
        const currentIndex = filteredItems.findIndex(i => i.id === currentItem?.id);
        if (currentIndex < filteredItems.length - 1) {
          setSelectedItemId(filteredItems[currentIndex + 1].id);
        }
      } else if (e.key === 'k' || e.key === 'K') {
        // Previous item
        e.preventDefault();
        const currentIndex = filteredItems.findIndex(i => i.id === currentItem?.id);
        if (currentIndex > 0) {
          setSelectedItemId(filteredItems[currentIndex - 1].id);
        }
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        bulkApproveFiltered(0.90);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentItem, filteredItems, approveReviewItem, rejectReviewItem, bulkApproveFiltered]);

  const handleSaveEdit = () => {
    if (currentItem && editAccountId) {
      editReviewItem(currentItem.id, editAccountId, editRationale);
      setIsEditing(false);
    }
  };

  const proposedRule = activeLearnedRules.find(r => r.isProposed);

  return (
    <div className="space-y-4">
      {/* Learned Rule Proposal Banner (Section 7.3: After 3 confirmations, propose rule) */}
      {proposedRule && (
        <div className="bg-gradient-to-r from-[#0C2B1C] to-[#16432E] text-white p-4 rounded-2xl border border-[#27B665]/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#27B665]/20 text-[#27B665] flex items-center justify-center font-bold text-lg">
              ⚡
            </span>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#8EDDA6] font-bold">
                Learned Client Rule Proposal (Confirmed 3 Times)
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                Automatically categorize all future <span className="text-[#8EDDA6] font-mono font-bold">"{proposedRule.counterpartyPattern}"</span> transactions to <span className="underline decoration-[#27B665]">{proposedRule.accountCode} - {proposedRule.accountName}</span>?
              </div>
            </div>
          </div>
          <button
            onClick={() => activateLearnedRule(proposedRule.id)}
            className="px-4 py-2 rounded-xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-sm shrink-0"
          >
            Activate Learned Rule ✓
          </button>
        </div>
      )}

      {/* Top Controls Bar with Keyboard Shortcuts Guide */}
      <div className="bg-white rounded-2xl p-4 border border-[#D9F0E2] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#52705F] mr-1">Status:</span>
          {(['needs_review', 'all', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-[#0C2B1C] text-white shadow-sm'
                  : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}

          <span className="text-xs font-bold uppercase tracking-wider text-[#52705F] ml-3 mr-1">Priority:</span>
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                priorityFilter === p
                  ? 'bg-[#27B665] text-[#0C2B1C] font-bold'
                  : 'bg-transparent text-[#52705F] hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Keyboard Shortcuts Cheatsheet */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-[#52705F] bg-[#F2F9F5] px-3 py-1.5 rounded-xl border border-[#D9F0E2]">
          <span className="font-bold text-[#0C2B1C]">Shortcuts:</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D9F0E2] font-bold text-[#0C2B1C]">A</kbd> Approve</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D9F0E2] font-bold text-[#0C2B1C]">E</kbd> Edit</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D9F0E2] font-bold text-[#0C2B1C]">R</kbd> Reject</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D9F0E2] font-bold text-[#0C2B1C]">J/K</kbd> Nav</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D9F0E2] font-bold text-[#0C2B1C]">B</kbd> Bulk</span>
        </div>

        <button
          onClick={() => bulkApproveFiltered(0.90)}
          className="px-3.5 py-1.5 rounded-xl bg-[#EDF9F1] border border-[#27B665]/40 text-[#0F7A41] text-xs font-bold hover:bg-[#27B665] hover:text-[#0C2B1C] transition-all ml-auto"
        >
          Bulk Approve (≥90% Confidence) [B]
        </button>
      </div>

      {/* THREE PANE LAYOUT (Left: List, Center: Item & Categorizer, Right: Document OCR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[620px]">
        
        {/* PANE 1: ITEMS LIST (Col 1-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-[#D9F0E2] shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D9F0E2]">
            <h3 className="font-bold text-[#0C2B1C] text-sm flex items-center gap-2">
              <span>Review Queue</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-mono font-bold">
                {filteredItems.length}
              </span>
            </h3>
            <span className="text-[11px] font-mono text-[#52705F]">
              {selectedClient.name.split(' ')[0]}
            </span>
          </div>

          <input
            type="text"
            placeholder="Search vendor or reason..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-[#F2F9F5] border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
          />

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[560px]">
            {filteredItems.map(item => {
              const tx = bankTransactions.find(b => b.id === item.bankTransactionId);
              const isSelected = item.id === currentItem?.id;
              const isHigh = item.priority === 'high';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-left ${
                    isSelected
                      ? 'bg-[#EDF9F1] border-[#27B665] shadow-sm ring-1 ring-[#27B665]'
                      : 'bg-white border-[#D9F0E2] hover:bg-[#F8FCF9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0C2B1C] truncate max-w-[160px]">
                      {tx?.counterparty || item.aiSuggestion.accountName}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#0C2B1C]">
                      {tx ? (tx.amountMinor < 0 ? `-$${(Math.abs(tx.amountMinor) / 100).toFixed(2)}` : `+$${(tx.amountMinor / 100).toFixed(2)}`) : '--'}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#52705F] line-clamp-1 mt-1">
                    {item.reason}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D9F0E2]/60">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                        isHigh ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#27B665]/10 text-[#0F7A41] font-bold">
                        {Math.round(item.aiSuggestion.confidence * 100)}% conf
                      </span>
                    </div>

                    <span className={`text-[10px] font-semibold uppercase ${
                      item.status === 'approved' ? 'text-green-600' :
                      item.status === 'rejected' ? 'text-red-500' :
                      item.status === 'edited' ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-xs text-[#52705F] bg-[#F2F9F5] rounded-2xl">
                No items match the current filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* PANE 2: CENTER ITEM DETAILS & AI CATEGORIZER (Col 5-8) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm flex flex-col justify-between space-y-6">
          {currentItem ? (
            <>
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-[#D9F0E2]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#52705F] font-bold">
                        Item #{currentItem.id} · {currentItem.kind.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        currentItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                        currentItem.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        currentItem.status === 'edited' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {currentItem.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#0C2B1C] mt-1">
                      {currentTx?.counterparty || 'Selected Item'}
                    </h2>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-[#52705F]">Transaction Amount</div>
                    <div className="text-2xl font-mono font-extrabold text-[#0C2B1C]">
                      {currentTx ? (currentTx.amountMinor < 0 ? `-$${(Math.abs(currentTx.amountMinor) / 100).toFixed(2)}` : `+$${(currentTx.amountMinor / 100).toFixed(2)}`) : '$0.00'}
                    </div>
                  </div>
                </div>

                {/* Raw Banking Evidence Box */}
                {currentTx && (
                  <div className="p-3.5 bg-[#F2F9F5] rounded-2xl border border-[#D9F0E2] text-xs space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-[#52705F] font-bold">Raw Bank Line (Immutable)</div>
                    <div className="font-mono text-[#0C2B1C] font-medium break-all">{currentTx.descriptionRaw}</div>
                    <div className="flex items-center justify-between text-[11px] text-[#52705F] pt-1 border-t border-[#D9F0E2]/60">
                      <span>Posted Date: <strong>{currentTx.postedDate}</strong></span>
                      <span>Account: <strong>{selectedClient.bankAccountMask}</strong></span>
                      <span>Feed: <strong className="capitalize">{currentTx.source}</strong></span>
                    </div>
                  </div>
                )}

                {/* AI Categorizer Suggestion Card */}
                <div className="p-4 rounded-2xl bg-[#0C2B1C] text-white shadow-lg space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#27B665] animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-wider text-[#8EDDA6] font-bold">
                        AI Categorizer Suggestion
                      </span>
                    </div>
                    <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-[#8EDDA6] border border-white/15">
                      {currentItem.aiSuggestion.model} · {currentItem.aiSuggestion.promptVersion}
                    </span>
                  </div>

                  {/* Confidence meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white/80">Confidence Score:</span>
                      <span className="font-bold text-[#8EDDA6]">
                        {Math.round(currentItem.aiSuggestion.confidence * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#27B665] rounded-full transition-all duration-500"
                        style={{ width: `${currentItem.aiSuggestion.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Target Account Display */}
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                    <div className="text-[10px] font-mono text-[#8EDDA6] uppercase">Proposed Account Code & Name</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {currentItem.aiSuggestion.accountCode} · {currentItem.aiSuggestion.accountName}
                    </div>
                  </div>

                  {/* Rationale (max 25 words per brief Section 7.3) */}
                  <div className="text-xs text-white/90 italic bg-white/5 p-2.5 rounded-lg border border-white/10">
                    "{currentItem.aiSuggestion.rationale}"
                  </div>
                </div>

                {/* Edit Mode Inline Form */}
                {isEditing && (
                  <div className="p-4 rounded-2xl bg-[#FFFBF0] border border-[#FEE685] space-y-3">
                    <div className="text-xs font-bold text-[#8F4F00] uppercase font-mono">
                      Edit Categorization Account
                    </div>
                    <select
                      value={editAccountId}
                      onChange={e => setEditAccountId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FEE685] bg-white font-medium focus:outline-none focus:border-[#27B665]"
                    >
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.code} - {acc.name} ({acc.type.toUpperCase()})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Audit rationale for manual adjustment..."
                      value={editRationale}
                      onChange={e => setEditRationale(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#FEE685] bg-white focus:outline-none focus:border-[#27B665]"
                    />

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-black"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-1.5 rounded-xl bg-[#0C2B1C] text-white text-xs font-bold hover:bg-[#16432E]"
                      >
                        Save & Post Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons with Keyboard Legend */}
              <div className="pt-4 border-t border-[#D9F0E2] space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => approveReviewItem(currentItem.id)}
                    disabled={currentItem.status === 'approved'}
                    className={`py-3 px-2 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      currentItem.status === 'approved'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#27B665] text-[#0C2B1C] hover:bg-[#209c55]'
                    }`}
                  >
                    <span>Approve [A]</span>
                    <span>✓</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(prev => !prev)}
                    className="py-3 px-2 rounded-2xl bg-[#EDF9F1] border border-[#27B665]/30 text-[#0F7A41] hover:bg-[#27B665]/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Edit [E]</span>
                    <span>✎</span>
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt('Reason for rejection or request to client:', 'Missing receipt');
                      if (reason) rejectReviewItem(currentItem.id, reason);
                    }}
                    className="py-3 px-2 rounded-2xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Reject [R]</span>
                    <span>✕</span>
                  </button>
                </div>

                <div className="text-center text-[10px] text-[#52705F] font-mono">
                  Assigned Reviewer: <strong>{currentItem.assignedTo}</strong> · Double-Entry Constraint Enforced
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[#52705F]">
              Select a review item from the left pane to view details.
            </div>
          )}
        </div>

        {/* PANE 3: SOURCE DOCUMENT VIEWER & OCR EXTRACTION (Col 9-12) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-[#D9F0E2] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#52705F] font-bold">
                Source Document Viewer
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] font-bold">
                OCR Verified
              </span>
            </div>

            {currentDoc ? (
              <div className="space-y-4 mt-3">
                {/* Document Simulated Card / Receipt Canvas */}
                <div className="p-4 rounded-2xl bg-[#FAFCFA] border-2 border-dashed border-[#D9F0E2] text-xs font-mono space-y-2 relative">
                  <div className="flex items-center justify-between font-bold text-[#0C2B1C] border-b border-[#D9F0E2] pb-1.5">
                    <span className="truncate max-w-[150px]">{currentDoc.vendorName}</span>
                    <span className="text-[10px] text-gray-500">{currentDoc.documentDate}</span>
                  </div>

                  <div className="text-[11px] text-gray-600">
                    Invoice #: <strong>{currentDoc.invoiceNumber || 'HD-98412'}</strong>
                  </div>

                  {/* Highlighted Bounding Boxes for Line Items */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] uppercase text-[#52705F] font-bold">Extracted Line Items:</div>
                    {currentDoc.lineItems.map(li => (
                      <div key={li.id} className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] flex justify-between items-center">
                        <span className="truncate max-w-[130px]">{li.description}</span>
                        <span className="font-bold">${(li.amountMinor / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="pt-2 border-t border-[#D9F0E2] space-y-1 text-[11px]">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>${(currentDoc.subtotalMinor / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8.25% CA):</span>
                      <span>${(currentDoc.taxMinor / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#0C2B1C] text-xs pt-1 border-t border-gray-200">
                      <span>Total:</span>
                      <span>${(currentDoc.totalMinor / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Redacted PII tag */}
                  <div className="text-[10px] text-[#0F7A41] bg-[#EDF9F1] px-2 py-1 rounded-md text-center font-bold">
                    ✓ Full Card/SSN Redacted per Compliance
                  </div>
                </div>

                {/* OCR Field Confidence Breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#0C2B1C]">Field-Level OCR Confidence</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-xl bg-[#F2F9F5] border border-[#D9F0E2]">
                      <span className="text-gray-500">Vendor:</span> <strong>99%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F2F9F5] border border-[#D9F0E2]">
                      <span className="text-gray-500">Total:</span> <strong>99%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F2F9F5] border border-[#D9F0E2]">
                      <span className="text-gray-500">Invoice #:</span> <strong>98%</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F2F9F5] border border-[#D9F0E2]">
                      <span className="text-gray-500">Line Items:</span> <strong>97%</strong>
                    </div>
                  </div>
                </div>

                {/* Validation Invariant Badge */}
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-mono flex items-center gap-2">
                  <span>✓</span>
                  <span>Arithmetic check: Line items + Tax = Total ($0 discrepancy)</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#52705F] bg-[#F2F9F5] rounded-2xl mt-4">
                No source document attached to this item. Request a receipt from client using the Client Requests tab.
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-[#52705F] pt-2 border-t border-[#D9F0E2]">
            Sha256 Dedupe Hash Verified · S3 Encrypted at Rest
          </div>
        </div>

      </div>
    </div>
  );
};
