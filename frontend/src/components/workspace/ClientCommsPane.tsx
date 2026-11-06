import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const ClientCommsPane: React.FC = () => {
  const {
    clientRequests,
    sendMissingDocRequest,
    answerClientRequest,
    selectedClient
  } = useStartupSystem();

  const [activeTab, setActiveTab] = useState<'requests' | 'portal_simulator'>('requests');
  const [selectedReqId, setSelectedReqId] = useState<string>(clientRequests[0]?.id || '');
  const [clientAnswerInput, setClientAnswerInput] = useState('');

  const currentReq = clientRequests.find(r => r.id === selectedReqId) || clientRequests[0];

  const handleClientSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientAnswerInput.trim() || !currentReq) return;
    answerClientRequest(currentReq.id, clientAnswerInput);
    setClientAnswerInput('');
    alert('Answer submitted from client portal! The review item in the Review Queue has been updated.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Section 7.7 of Brief */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D9F0E2]">
        <div>
          <h3 className="font-bold text-[#0C2B1C] text-lg">
            Client Communications & Missing Documents
          </h3>
          <p className="text-xs text-[#52705F]">
            Weekly digest grouping unmatched bank items · Client answers feed directly back to categorization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
            }`}
          >
            Firm Outbound Requests ({clientRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('portal_simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'portal_simulator'
                ? 'bg-[#0C2B1C] text-white shadow-sm'
                : 'bg-[#F2F9F5] text-[#52705F] hover:bg-[#E5F4EB]'
            }`}
          >
            Test Client Portal View 📱
          </button>
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#52705F] font-bold">
              Active Client Inquiries ({selectedClient.name})
            </span>
            <span className="text-xs font-mono text-[#52705F]">
              Reminders at 3, 7, and 14 days (Hard Cap Enforced)
            </span>
          </div>

          <div className="space-y-3">
            {clientRequests.map(req => {
              const isAnswered = req.status === 'answered';
              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isAnswered ? 'bg-[#EDF9F1] border-[#27B665]/40' : 'bg-white border-[#D9F0E2]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          isAnswered ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-xs font-mono text-[#52705F]">
                          {req.id} · Reminders sent: {req.reminderCount}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#0C2B1C] mt-1">{req.title}</h4>
                      <p className="text-xs text-[#52705F] mt-0.5">{req.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      {req.amountMinor && (
                        <div className="text-base font-mono font-bold text-[#0C2B1C]">
                          ${(req.amountMinor / 100).toFixed(2)}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500 font-mono">Sent {req.sentAt}</div>
                    </div>
                  </div>

                  {req.clientAnswer && (
                    <div className="mt-3 pt-3 border-t border-[#D9F0E2] text-xs bg-white/70 p-3 rounded-xl border border-[#D9F0E2]">
                      <span className="font-bold text-[#0F7A41]">Client Answer:</span> "{req.clientAnswer}"
                      <span className="text-[10px] text-gray-500 ml-2">({req.answeredAt})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PORTAL SIMULATOR */}
      {activeTab === 'portal_simulator' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#D9F0E2]">
            <div>
              <div className="text-[10px] font-mono text-[#52705F] uppercase font-bold">
                Client Portal · Mobile Simulation
              </div>
              <h3 className="font-bold text-lg text-[#0C2B1C]">
                {selectedClient.name}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] font-bold">
              Owner Mode
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9F0E2] text-xs space-y-1">
            <div className="font-bold text-[#0C2B1C]">Your Bookkeeping Team at Cascade CPAs:</div>
            <p className="text-[#52705F]">
              "Hi! We are closing your October 2026 books. Please clarify the item below so we can apply full tax deductions."
            </p>
          </div>

          {currentReq && (
            <form onSubmit={handleClientSubmitAnswer} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFFBF0] border border-[#FEE685] space-y-2">
                <div className="text-xs font-bold text-[#8F4F00]">{currentReq.title}</div>
                <p className="text-xs text-gray-700">{currentReq.description}</p>
                {currentReq.amountMinor && (
                  <div className="text-sm font-mono font-bold text-[#0C2B1C]">
                    Amount: ${(currentReq.amountMinor / 100).toFixed(2)}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#0C2B1C]">
                  Your Answer or Memo:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Purchased commercial HVAC fittings and replacement valves for the Highland Crest job site."
                  value={clientAnswerInput}
                  onChange={e => setClientAnswerInput(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#D9F0E2] mt-1 focus:outline-none focus:border-[#27B665]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-md"
              >
                Submit Answer to Bookkeeper →
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
