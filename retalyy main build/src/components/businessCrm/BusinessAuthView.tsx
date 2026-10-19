import React, { useState } from 'react';
import { BusinessUserSession, BusinessProfile } from './types';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  ArrowLeft,
  CheckCircle2,
  Layers,
  Cpu,
  Check
} from 'lucide-react';

interface BusinessAuthViewProps {
  onAuthenticate: (user: BusinessUserSession, initialCompany?: Partial<BusinessProfile>) => void;
  onBackToMarketing?: () => void;
  onSwitchToFirmCrm?: () => void;
}

export const BusinessAuthView: React.FC<BusinessAuthViewProps> = ({
  onAuthenticate,
  onBackToMarketing,
  onSwitchToFirmCrm
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  
  // Registration Form State
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [entityType, setEntityType] = useState<'LLC' | 'S-Corp' | 'C-Corp'>('S-Corp');
  const [role, setRole] = useState<'founder' | 'cfo' | 'controller'>('founder');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="retalyy-crm-scope min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          {onBackToMarketing && (
            <button
              type="button"
              onClick={onBackToMarketing}
              className="px-3 py-1.5 rounded-full border border-[#D9F0E2] bg-white text-[#0C2B1C] hover:bg-[#EDF9F1] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#27B665]" />
              <span>Back to Website</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: 'linear-gradient(135deg, #0C2B1C 0%, #27B665 100%)',
              }}
            >
              R
            </div>
            <span className="font-bold text-base tracking-tight font-display text-[#0C2B1C]">
              Retalyy Business Finance
            </span>
          </div>
        </div>

        {onSwitchToFirmCrm && (
          <button
            type="button"
            onClick={onSwitchToFirmCrm}
            className="px-3.5 py-1.5 rounded-full border border-[#D9F0E2] bg-white text-[#0C2B1C] hover:bg-[#EDF9F1] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#27B665]" />
            <span className="hidden sm:inline">CPA Firm OS Portal →</span>
          </button>
        )}
      </header>

      {/* Main Center Auth Container */}
      <div className="max-w-md w-full mx-auto my-auto py-8 z-10">
        
        {/* Welcome Branding */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2]">
            <Sparkles className="w-3.5 h-3.5 text-[#27B665]" />
            Autonomous AI Finance Department
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C2B1C] font-display tracking-tight">
            {authMode === 'register' ? 'Register Your Business' : 'Sign In to Your Finance Dept'}
          </h1>
          <p className="text-xs text-[#52705F] max-w-sm mx-auto">
            {authMode === 'register' 
              ? 'Register your company, onboard details, and unlock real-time autonomous bookkeeping & cash runway.' 
              : 'Access your continuous general ledger, P&L, balance sheet, and AP/AR dashboard.'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#D9F0E2] shadow-xl text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#EDF9F1] border border-[#27B665]/30 text-[#0F7A41] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#27B665]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0C2B1C] font-display">
              We'll get back to you soon!
            </h2>
            <p className="text-sm text-[#52705F] max-w-sm mx-auto leading-relaxed">
              Thank you for submitting your details. Our team is reviewing your information and we will reach out shortly to <strong className="text-[#0C2B1C]">{email || 'your email'}</strong> to get your workspace set up.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {onBackToMarketing && (
                <button
                  type="button"
                  onClick={onBackToMarketing}
                  className="ret-btn px-6 py-2.5 text-sm font-bold cursor-pointer"
                >
                  Back to Website
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Auth Card */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F0E2] shadow-xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F8FAF9] border border-[#D9F0E2] text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#0C2B1C] text-white shadow-xs'
                  : 'text-[#52705F] hover:text-[#0C2B1C]'
              }`}
            >
              1. Register New Company
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#0C2B1C] text-white shadow-xs'
                  : 'text-[#52705F] hover:text-[#0C2B1C]'
              }`}
            >
              2. Sign In to Company
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Legal Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme SaaS Technologies Inc."
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                      Entity Type *
                    </label>
                    <select
                      value={entityType}
                      onChange={e => setEntityType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                    >
                      <option value="S-Corp">S-Corporation</option>
                      <option value="LLC">LLC</option>
                      <option value="C-Corp">C-Corporation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                      Your Role *
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                    >
                      <option value="founder">Founder / CEO</option>
                      <option value="cfo">CFO / Finance Lead</option>
                      <option value="controller">Controller</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. jordan@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0C2B1C] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9F0E2] bg-white text-xs text-[#0C2B1C] focus:outline-none focus:border-[#27B665]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="ret-btn w-full justify-center mt-2"
            >
              <span>{authMode === 'register' ? 'Register & Begin Onboarding' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

        {/* Security / Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-[#52705F]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27B665]" /> SOC-2 & 256-Bit SSL
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#27B665]" /> Balanced Double-Entry
          </span>
        </div>

      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-[#7E9E8C] py-2 z-10">
        © 2026 Retalyy Technologies, Inc. Autonomous Finance Department for Businesses.
      </footer>

    </div>
  );
};
