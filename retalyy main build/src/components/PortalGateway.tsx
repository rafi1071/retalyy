import React, { useState } from 'react';
import { NavigationTab, ClientProfile } from '../types';
import { 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Layers, 
  Cpu, 
  BookOpen, 
  RotateCcw,
  KeyRound,
  FileText
} from 'lucide-react';
import { RetalyyLogo } from './RetalyyLogo';
import { UserSession, PERSONAS } from '../crm/components/Auth/AuthLoginView';
import { BusinessUserSession, BusinessProfile } from './businessCrm/types';
import { INITIAL_BUSINESS_PROFILE } from './businessCrm/mockData';
import { BusinessOnboardingView } from './businessCrm/BusinessOnboardingView';
import { FirmOnboardingView, FirmProfileData } from './firm/FirmOnboardingView';

export type PortalAccountType = 'accounting_firm' | 'individual_business';
export type PortalAuthMode = 'login' | 'signup';

interface PortalGatewayProps {
  setActiveTab: (tab: NavigationTab) => void;
  clientProfile: ClientProfile;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
  onViewClientDashboard?: () => void;
}

export const PortalGateway: React.FC<PortalGatewayProps> = ({
  setActiveTab,
  clientProfile,
  setClientProfile,
  onViewClientDashboard
}) => {
  // 1. Selection State: Account Type (Accounting Firm vs Individual Business)
  const [accountType, setAccountType] = useState<PortalAccountType>('accounting_firm');

  // 2. Auth Mode: Log In vs Sign Up
  const [authMode, setAuthMode] = useState<PortalAuthMode>('login');

  // 3. Active Onboarding Sub-View State (when a new account signs up)
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(false);
  const [newBusinessProfile, setNewBusinessProfile] = useState<BusinessProfile>(INITIAL_BUSINESS_PROFILE);
  const [newFirmProfile, setNewFirmProfile] = useState<Partial<FirmProfileData>>({});

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessEntityType, setBusinessEntityType] = useState<'S-Corp' | 'LLC' | 'C-Corp'>('S-Corp');
  const [firmPracticeSize, setFirmPracticeSize] = useState<'solo' | '2-10' | '11-50' | '50+'>('2-10');
  
  // Feedback & submission state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isAccountNotFound, setIsAccountNotFound] = useState<boolean>(false);

  // Switch between Account Types
  const handleSelectAccountType = (type: PortalAccountType) => {
    setAccountType(type);
    setIsOnboardingActive(false);
    setErrorMessage(null);
    setIsSubmitted(false);
    setIsAccountNotFound(false);
  };

  // Switch between Log In & Sign Up
  const handleSelectAuthMode = (mode: PortalAuthMode) => {
    setAuthMode(mode);
    setIsOnboardingActive(false);
    setErrorMessage(null);
    setIsSubmitted(false);
    setIsAccountNotFound(false);
  };

  // Handle Login Submission: verify existing account or display Account Not Found
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage(null);
    setIsAccountNotFound(false);

    setTimeout(() => {
      setIsLoggingIn(false);

      const targetEmail = email.trim().toLowerCase();

      // Check registered accounts in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('retalyy_registered_users') || '[]');
      const registeredUser = registeredUsers.find(
        (u: any) => u.email && u.email.toLowerCase() === targetEmail
      );

      // Check predefined persona accounts
      const persona = PERSONAS.find(p => p.email.toLowerCase() === targetEmail);

      // Check existing saved sessions
      const savedFirm = localStorage.getItem('retalyy_cpa_session');
      const firmObj = savedFirm ? JSON.parse(savedFirm) : null;
      const savedBiz = localStorage.getItem('retalyy_business_crm_user');
      const bizObj = savedBiz ? JSON.parse(savedBiz) : null;

      // Check default demo account
      const isJordan = targetEmail === 'jordan@cloudarchitecture.io';

      if (registeredUser) {
        if (registeredUser.type === 'individual_business') {
          localStorage.setItem('retalyy_business_crm_user', JSON.stringify(registeredUser));
          setActiveTab('business_crm');
        } else {
          localStorage.setItem('retalyy_cpa_session', JSON.stringify(registeredUser));
          setActiveTab('workspace');
        }
        return;
      }

      if (persona) {
        localStorage.setItem('retalyy_cpa_session', JSON.stringify(persona));
        if (persona.role === 'client' && onViewClientDashboard) {
          onViewClientDashboard();
        } else {
          setActiveTab('workspace');
        }
        return;
      }

      if (isJordan) {
        const businessSession: BusinessUserSession = {
          id: 'usr-jordan',
          fullName: 'Jordan Miller',
          email: 'jordan@cloudarchitecture.io',
          companyName: 'Miller Cloud Systems LLC',
          role: 'founder',
          loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        localStorage.setItem('retalyy_business_crm_user', JSON.stringify(businessSession));
        setActiveTab('business_crm');
        return;
      }

      if (firmObj && firmObj.email && firmObj.email.toLowerCase() === targetEmail) {
        setActiveTab('workspace');
        return;
      }

      if (bizObj && bizObj.email && bizObj.email.toLowerCase() === targetEmail) {
        setActiveTab('business_crm');
        return;
      }

      // If account does not exist, trigger Account Not Found view
      setIsAccountNotFound(true);
    }, 450);
  };

  // Handle Quick Demo Login
  const handleQuickDemoLogin = (personaRole: 'cpa' | 'staff' | 'admin' | 'business_founder') => {
    setIsLoggingIn(true);
    setTimeout(() => {
      if (personaRole === 'business_founder') {
        const businessSession: BusinessUserSession = {
          id: 'usr-jordan',
          fullName: 'Jordan Miller',
          email: 'jordan@cloudarchitecture.io',
          companyName: 'Miller Cloud Systems LLC',
          role: 'founder',
          loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        localStorage.setItem('retalyy_business_crm_user', JSON.stringify(businessSession));
        setActiveTab('business_crm');
      } else {
        const persona = PERSONAS.find(p => {
          if (personaRole === 'cpa') return p.role === 'cpa_controller';
          if (personaRole === 'staff') return p.role === 'staff_accountant';
          return p.role === 'firm_admin';
        }) || PERSONAS[0];

        localStorage.setItem('retalyy_cpa_session', JSON.stringify(persona));
        setActiveTab('workspace');
      }
      setIsLoggingIn(false);
    }, 300);
  };

  // Handle Sign Up Submission -> Launches dedicated onboarding process
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !orgName.trim()) {
      setErrorMessage('Please provide your name, organization name, and work email.');
      return;
    }

    setErrorMessage(null);

    if (accountType === 'individual_business') {
      const initial: BusinessProfile = {
        ...INITIAL_BUSINESS_PROFILE,
        companyName: orgName,
        entityType: businessEntityType,
        isOnboarded: false
      };
      setNewBusinessProfile(initial);
      setIsOnboardingActive(true);
    } else {
      const initial: Partial<FirmProfileData> = {
        firmName: orgName,
        managingPartner: fullName,
        practiceSize: firmPracticeSize
      };
      setNewFirmProfile(initial);
      setIsOnboardingActive(true);
    }
  };

  // Finish Business Onboarding
  const handleFinishBusinessOnboarding = () => {
    const user: BusinessUserSession = {
      id: `usr-${Date.now()}`,
      fullName: fullName || 'Jordan Miller',
      email: email,
      companyName: newBusinessProfile.companyName || orgName,
      role: 'founder',
      loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    localStorage.setItem('retalyy_business_crm_user', JSON.stringify(user));
    localStorage.setItem('retalyy_business_crm_profile', JSON.stringify({ ...newBusinessProfile, isOnboarded: true }));

    // Save into registered accounts
    const existing = JSON.parse(localStorage.getItem('retalyy_registered_users') || '[]');
    localStorage.setItem('retalyy_registered_users', JSON.stringify([
      ...existing.filter((u: any) => u.email?.toLowerCase() !== email.toLowerCase()),
      { ...user, type: 'individual_business', password }
    ]));

    setActiveTab('business_crm');
  };

  // Finish Firm Onboarding
  const handleFinishFirmOnboarding = (session: UserSession, profile: FirmProfileData) => {
    localStorage.setItem('retalyy_cpa_session', JSON.stringify(session));
    localStorage.setItem('retalyy_firm_profile', JSON.stringify(profile));

    // Save into registered accounts
    const existing = JSON.parse(localStorage.getItem('retalyy_registered_users') || '[]');
    localStorage.setItem('retalyy_registered_users', JSON.stringify([
      ...existing.filter((u: any) => u.email?.toLowerCase() !== (session.email || email).toLowerCase()),
      { ...session, type: 'accounting_firm', password }
    ]));

    setActiveTab('workspace');
  };

  // If in active onboarding flow for new accounts:
  if (isOnboardingActive) {
    if (accountType === 'individual_business') {
      return (
        <div className="wrap py-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setIsOnboardingActive(false)}
              className="text-xs font-semibold text-[#52705F] hover:text-[#0C2B1C] flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Portal Access
            </button>
            <span className="text-xs font-mono uppercase bg-[#EDF9F1] text-[#0F7A41] px-2.5 py-1 rounded-full font-bold">
              New Business Account Onboarding
            </span>
          </div>

          <BusinessOnboardingView
            profile={newBusinessProfile}
            onUpdateProfile={setNewBusinessProfile}
            onCompleteOnboarding={handleFinishBusinessOnboarding}
          />
        </div>
      );
    } else {
      return (
        <div className="wrap py-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setIsOnboardingActive(false)}
              className="text-xs font-semibold text-[#52705F] hover:text-[#0C2B1C] flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Portal Access
            </button>
            <span className="text-xs font-mono uppercase bg-[#EDF9F1] text-[#0F7A41] px-2.5 py-1 rounded-full font-bold">
              New Accounting Firm Onboarding
            </span>
          </div>

          <FirmOnboardingView
            initialData={newFirmProfile}
            onComplete={handleFinishFirmOnboarding}
            onCancel={() => setIsOnboardingActive(false)}
          />
        </div>
      );
    }
  }

  // STANDARD PORTAL ACCESS GATEWAY
  return (
    <div className="wrap py-8 sm:py-12 space-y-8 animate-fade-in text-left">
      
      {/* Top Welcome Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] text-xs font-bold border border-[#D9F0E2]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#27B665]" />
          <span>Retalyy Secure Single-Sign-On Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C2B1C] tracking-tight font-display">
          Welcome to the Retalyy Portal
        </h1>
        <p className="text-sm text-[#52705F]">
          Select your organization type to log into your account, or create a new account to begin your onboarding setup.
        </p>
      </div>

      {/* Main Gateway Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#D9F0E2] shadow-xl overflow-hidden">
        
        {/* Step 1: Select Organization Type */}
        <div className="p-6 sm:p-8 border-b border-neutral-100 bg-[#FAFCFB]">
          <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-3">
            1. Select Your Organization Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Accounting Firm Card */}
            <div
              onClick={() => handleSelectAccountType('accounting_firm')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                accountType === 'accounting_firm'
                  ? 'border-[#27B665] bg-[#F2FAF5] shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    accountType === 'accounting_firm' ? 'bg-[#0C2B1C] text-[#8EDDA6]' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#0C2B1C] text-[#8EDDA6]">
                    Firm Platform
                  </span>
                </div>
                <div className="font-bold text-base text-[#0C2B1C]">Accounting Firm</div>
                <p className="text-xs text-[#52705F] mt-1 leading-snug">
                  For CPAs, bookkeeping practices, and multi-client advisory firms managing client books & compliance.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-semibold text-[#0F7A41]">
                <span>CPA Firm OS Core</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  accountType === 'accounting_firm' ? 'border-[#27B665] bg-[#27B665]' : 'border-neutral-300'
                }`}>
                  {accountType === 'accounting_firm' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
            </div>

            {/* Individual Business Card */}
            <div
              onClick={() => handleSelectAccountType('individual_business')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                accountType === 'individual_business'
                  ? 'border-[#27B665] bg-[#F2FAF5] shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    accountType === 'individual_business' ? 'bg-[#27B665] text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] border border-[#D9F0E2]">
                    Company Portal
                  </span>
                </div>
                <div className="font-bold text-base text-[#0C2B1C]">Individual Business</div>
                <p className="text-xs text-[#52705F] mt-1 leading-snug">
                  For company founders, startups, LLCs, S-Corps, and contractors automating finance & taxes.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-semibold text-[#0F7A41]">
                <span>AI Finance Dept & Taxes</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  accountType === 'individual_business' ? 'border-[#27B665] bg-[#27B665]' : 'border-neutral-300'
                }`}>
                  {accountType === 'individual_business' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Step 2: Auth Mode Selector (Log In vs Sign Up) */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <div className="text-xs font-bold text-[#0C2B1C] uppercase tracking-wider">
                2. Choose Access Mode
              </div>
              <div className="text-xs text-[#52705F] mt-0.5">
                {authMode === 'login' ? 'Enter credentials for your existing account' : 'New accounts go through our guided onboarding process'}
              </div>
            </div>

            {/* Toggle Pills */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSelectAuthMode('login')}
                className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-[#0C2B1C] shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleSelectAuthMode('signup')}
                className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-[#27B665] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {isAccountNotFound ? (
            <div className="p-8 sm:p-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C2B1C] font-display">
                Account Not Found
              </h3>
              <p className="text-sm text-[#52705F] max-w-md mx-auto leading-relaxed">
                No account was found for <strong className="text-[#0C2B1C]">{email}</strong>. Sign up if you don't have an account yet, or try logging in with another email.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountNotFound(false);
                    handleSelectAuthMode('signup');
                  }}
                  className="ret-btn w-full sm:w-auto px-6 py-2.5 text-sm font-bold cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign Up for an Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountNotFound(false);
                    setErrorMessage("Account not found. Sign up if you don't have an account, or try another email.");
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-bold text-[#0C2B1C] cursor-pointer transition-all"
                >
                  Try Logging In Again
                </button>
              </div>

              {/* Quick demo account login chips */}
              <div className="pt-4 border-t border-neutral-100 max-w-md mx-auto text-center">
                <p className="text-[11px] text-[#52705F] mb-1.5 font-medium">
                  Testing? You can log in with an existing demo account:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const demoEmail = accountType === 'accounting_firm' ? 'elena@vanceaccounting.com' : 'jordan@cloudarchitecture.io';
                      setEmail(demoEmail);
                      setPassword('demo123');
                      setIsAccountNotFound(false);
                      setErrorMessage(null);
                    }}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-[#EDF9F1] hover:text-[#0F7A41] text-neutral-700 font-mono font-medium transition-colors cursor-pointer"
                  >
                    Use demo: {accountType === 'accounting_firm' ? 'elena@vanceaccounting.com' : 'jordan@cloudarchitecture.io'}
                  </button>
                </div>
              </div>
            </div>
          ) : isSubmitted ? (
            <div className="p-8 sm:p-12 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#EDF9F1] border border-[#27B665]/30 text-[#0F7A41] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#27B665]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0C2B1C] font-display">
                We'll get back to you soon!
              </h3>
              <p className="text-sm text-[#52705F] max-w-md mx-auto leading-relaxed">
                Thank you for submitting your details. We have received your information and our team will get in touch shortly at <strong className="text-[#0C2B1C]">{email || 'your email'}</strong> to set up your access.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="ret-btn px-6 py-2.5 text-sm font-bold cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectAuthMode('signup')}
                    className="text-xs text-[#0F7A41] font-bold underline hover:no-underline shrink-0 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* FORM: LOG IN (EXISTING ACCOUNT) */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                        Work Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          placeholder="you@yourcompany.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => alert('Password reset link sent. Please check your inbox.')}
                          className="text-xs text-[#0F7A41] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full ret-btn flex items-center justify-center gap-2 cursor-pointer shadow-md py-3"
                  >
                    {isLoggingIn ? (
                      <span>Logging in...</span>
                    ) : (
                      <>
                        <span>Log In to Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-[#52705F]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => handleSelectAuthMode('signup')}
                        className="text-[#0F7A41] font-bold hover:underline cursor-pointer"
                      >
                        Sign up if you don't have an account
                      </button>
                    </span>
                  </div>
                </form>
              )}

          {/* FORM: SIGN UP (NEW ACCOUNT -> GO THROUGH ONBOARDING) */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="p-3 bg-[#EDF9F1] border border-[#C6EDD4] rounded-2xl text-xs text-[#0F7A41] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-[#27B665]" />
                <span>
                  New accounts require a 4-step onboarding configuration to setup your accounting rules, tax entities, and compliance vault.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Elena Vance, CPA"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                    {accountType === 'accounting_firm' ? 'Firm Legal Name' : 'Company / Business Legal Name'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      required
                      placeholder={accountType === 'accounting_firm' ? 'e.g. Vance & Associates CPAs' : 'e.g. Apex Cloud Systems LLC'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="partner@yourfirm.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665]"
                    />
                  </div>
                </div>

                {accountType === 'individual_business' ? (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                      Business Entity Classification
                    </label>
                    <select
                      value={businessEntityType}
                      onChange={e => setBusinessEntityType(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665] bg-white"
                    >
                      <option value="S-Corp">S-Corporation (Form 1120S / §1362 Election)</option>
                      <option value="LLC">Single-Member / Multi-Member LLC</option>
                      <option value="C-Corp">C-Corporation (Delaware C-Corp / VC Backed)</option>
                    </select>
                  </div>
                ) : (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0C2B1C] uppercase tracking-wider mb-1.5">
                      Firm Size
                    </label>
                    <select
                      value={firmPracticeSize}
                      onChange={e => setFirmPracticeSize(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#27B665] bg-white"
                    >
                      <option value="solo">Solo Practitioner (1 CPA)</option>
                      <option value="2-10">Boutique Accounting Firm (2-10 staff members)</option>
                      <option value="11-50">Mid-Sized Firm (11-50 staff members)</option>
                      <option value="50+">Regional / Enterprise Firm (50+)</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full ret-btn flex items-center justify-center gap-2 cursor-pointer shadow-md py-3"
              >
                <span>Create Account & Start Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-xs text-[#52705F]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSelectAuthMode('login')}
                    className="text-[#0F7A41] font-bold hover:underline"
                  >
                    Log In with credentials
                  </button>
                </span>
              </div>
            </form>
          )}
        </>
      )}

        </div>

      </div>

      {/* Footer Info & Disclaimers */}
      <div className="max-w-2xl mx-auto text-center text-xs text-[#52705F] space-y-1">
        <div>Retalyy Multi-Channel Operations Platform · Enterprise AES-256 Cloud Encryption</div>
        <div>Need assistance? Contact our firm onboarding desk at <a href="mailto:concierge@retalyy.com" className="text-[#0C2B1C] underline">concierge@retalyy.com</a></div>
      </div>

    </div>
  );
};
