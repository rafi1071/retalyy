import React, { useState } from 'react';
import { NavigationTab } from '../types';
import { RetalyyIconMark } from './RetalyyLogo';

interface ContactViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ setActiveTab, onOpenBooking }) => {
  const [formType, setFormType] = useState<'operator' | 'firm' | 'press'>('operator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <div className="wrap py-12 space-y-14">
      
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <RetalyyIconMark size={24} />
          <div className="ret-pill">
            <i />
            <span>Get in Touch</span>
          </div>
        </div>
        <h1 className="text-[clamp(34px,5vw,60px)] font-extrabold text-[#0C2B1C] tracking-[-0.035em] leading-[1.05]">
          Let’s discuss your tax architecture.
        </h1>
        <p className="text-lg text-[#52705F] leading-relaxed">
          Whether you’re an independent operator optimizing six-figure billing or an accounting firm scaling advisory services, our partners are ready to connect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-[#D9F0E2] p-8 sm:p-12 shadow-sm space-y-6">
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Type Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-2">How can we help?</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('operator')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      formType === 'operator' 
                        ? 'bg-[#27B665] text-white shadow-sm' 
                        : 'bg-[#EDF9F1] text-[#52705F] hover:text-[#0C2B1C]'
                    }`}
                  >
                    Founder / Contractor Advisory
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('firm')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      formType === 'firm' 
                        ? 'bg-[#27B665] text-white shadow-sm' 
                        : 'bg-[#EDF9F1] text-[#52705F] hover:text-[#0C2B1C]'
                    }`}
                  >
                    CPA / Accounting Practice Pilot
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('press')}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      formType === 'press' 
                        ? 'bg-[#27B665] text-white shadow-sm' 
                        : 'bg-[#EDF9F1] text-[#52705F] hover:text-[#0C2B1C]'
                    }`}
                  >
                    Press & General Inquiries
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Chen"
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
                    placeholder="alex@studio.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Company / Entity Name</label>
                <input
                  type="text"
                  placeholder="Chen Studio LLC"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0C2B1C] mb-1">Message / Key Objectives</label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    formType === 'firm' 
                      ? 'Tell us about your client count and software stack...' 
                      : 'Tell us about your estimated 2026 revenue and entity structure...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-2xl border border-[#D9F0E2] focus:outline-none focus:border-[#27B665]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="ret-btn w-full text-center"
                >
                  Send Inquiry to Partners
                </button>
              </div>

              <div className="text-[11px] text-[#52705F] text-center font-mono">
                Average response time: &lt; 2 hours during business hours
              </div>
            </form>
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EDF9F1] text-[#0F7A41] flex items-center justify-center mx-auto border border-[#D9F0E2]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#0C2B1C]">
                Message Received, {name.split(' ')[0]}!
              </h3>
              <p className="text-sm text-[#52705F] max-w-md mx-auto leading-relaxed">
                Your inquiry has been routed to our partner desk at <strong className="text-[#0C2B1C]">{email}</strong>. A tax strategist will review your requirements and respond promptly.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onOpenBooking()}
                  className="ret-btn sm"
                >
                  Schedule Video Call Now
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Direct Channels & Office Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#EDF9F1] border border-[#D9F0E2] rounded-[32px] p-8 space-y-5">
            <div className="flex items-center gap-3">
              <RetalyyIconMark size={28} />
              <h3 className="font-display font-bold text-xl text-[#0C2B1C]">
                Direct Inquiries
              </h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-[#52705F] uppercase font-bold block">Enterprise & CPA Pilots</span>
                <a href="mailto:enterprise@retalyy.com" className="font-display font-bold text-sm text-[#0C2B1C] hover:text-[#0F7A41] transition-colors">
                  enterprise@retalyy.com
                </a>
              </div>

              <div>
                <span className="font-mono text-[#52705F] uppercase font-bold block">Founder & Client Concierge</span>
                <a href="mailto:concierge@retalyy.com" className="font-display font-bold text-sm text-[#0C2B1C] hover:text-[#0F7A41] transition-colors">
                  concierge@retalyy.com
                </a>
              </div>

              <div>
                <span className="font-mono text-[#52705F] uppercase font-bold block">Press & Legal Notice</span>
                <a href="mailto:press@retalyy.com" className="font-display font-bold text-sm text-[#0C2B1C] hover:text-[#0F7A41] transition-colors">
                  press@retalyy.com
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D9F0E2]">
              <button
                onClick={onOpenBooking}
                className="ret-btn sm w-full text-center"
              >
                Schedule 30-Min Strategy Call →
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#D9F0E2] rounded-[32px] p-8 space-y-4">
            <h4 className="font-display font-bold text-lg text-[#0C2B1C]">Office Locations</h4>
            <div className="space-y-3 text-xs text-[#52705F]">
              <div>
                <strong className="text-[#0C2B1C] block text-sm">San Francisco HQ</strong>
                <span>548 Market Street, Suite 89200</span><br />
                <span>San Francisco, CA 94104</span>
              </div>
              <div className="pt-2 border-t border-[#EEF6F1]">
                <strong className="text-[#0C2B1C] block text-sm">Austin Office</strong>
                <span>401 Congress Ave, Suite 1500</span><br />
                <span>Austin, TX 78701</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
