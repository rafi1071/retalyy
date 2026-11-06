import React, { useState } from 'react';
import { RetalyyIconMark } from './RetalyyLogo';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'firm' | 'self_employed';
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, defaultRole = 'firm' }) => {
  const [role, setRole] = useState<'firm' | 'self_employed'>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-20');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM PST');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C2B1C]/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] border border-[#D9F0E2] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-[#52705F] hover:text-[#0C2B1C] p-1.5 rounded-full hover:bg-[#EDF9F1] transition-colors"
          aria-label="Close booking modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <RetalyyIconMark size={24} />
                <div className="ret-pill">
                  <i />
                  <span>Private Consultation</span>
                </div>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0C2B1C] tracking-tight">
                Schedule a Tax Strategy Session
              </h3>
              <p className="text-sm text-[#52705F] mt-1">
                Meet with our lead CPA & advisory partner team. 30-minute private consultation.
              </p>
            </div>

            {/* Role selector */}
            <div className="flex rounded-full bg-[#EDF9F1] p-1 mb-5 border border-[#D9F0E2]">
              <button
                type="button"
                onClick={() => setRole('self_employed')}
                className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${role === 'self_employed' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'}`}
              >
                Self-Employed / Founder
              </button>
              <button
                type="button"
                onClick={() => setRole('firm')}
                className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${role === 'firm' ? 'bg-[#27B665] text-white shadow-sm' : 'text-[#52705F] hover:text-[#0C2B1C]'}`}
              >
                CPA / Accounting Firm Pilot
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Work Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-1">
                  {role === 'firm' ? 'Firm / Practice Name' : 'Company or DBA Name'}
                </label>
                <input 
                  type="text" 
                  placeholder={role === 'firm' ? 'Rivera & Partners CPAs' : 'Studio Vertex LLC'}
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Select Date</label>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-3 rounded-2xl border border-[#D9F0E2] bg-white focus:outline-none focus:border-[#27B665]"
                  >
                    <option value="2026-10-20">Tue, Oct 20, 2026</option>
                    <option value="2026-10-21">Wed, Oct 21, 2026</option>
                    <option value="2026-10-22">Thu, Oct 22, 2026</option>
                    <option value="2026-10-23">Fri, Oct 23, 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Time Slot</label>
                  <select 
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full text-sm px-3.5 py-3 rounded-2xl border border-[#D9F0E2] bg-white focus:outline-none focus:border-[#27B665]"
                  >
                    <option value="09:00 AM PST">09:00 AM PST</option>
                    <option value="10:00 AM PST">10:00 AM PST</option>
                    <option value="11:30 AM PST">11:30 AM PST</option>
                    <option value="01:30 PM PST">01:30 PM PST</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="ret-btn w-full text-center"
                >
                  Confirm Strategy Session
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#EDF9F1] text-[#0F7A41] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D9F0E2]">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0C2B1C] mb-2">
              Session Confirmed!
            </h3>
            <p className="text-sm text-[#52705F] mb-6 max-w-sm mx-auto">
              We have reserved your consultation for <strong className="text-[#0C2B1C]">{selectedDate}</strong> at <strong className="text-[#0C2B1C]">{selectedSlot}</strong>. A calendar invite has been sent to <strong className="text-[#0C2B1C]">{email}</strong>.
            </p>
            <button
              onClick={handleReset}
              className="ret-btn sm"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
