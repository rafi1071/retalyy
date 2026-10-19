import React from 'react';
import { NavigationTab } from '../types';
import { RetalyyLogo } from './RetalyyLogo';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
  onTriggerLoading?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenBooking, onTriggerLoading }) => {
  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-14 pb-16 text-[#52705F] text-sm border-t border-[#D9F0E2] bg-white">
      <div className="wrap space-y-10">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#EEF6F1]">
          {/* Official Retalyy Logo */}
          <div className="flex items-center gap-3">
            <RetalyyLogo size="md" variant="dark" />
            {onTriggerLoading && (
              <button
                type="button"
                onClick={onTriggerLoading}
                className="text-[10px] font-mono font-medium text-[#0F7A41] bg-[#EDF9F1] hover:bg-[#D9F0E2] px-2 py-0.5 rounded border border-[#D9F0E2] transition-colors cursor-pointer"
                title="Replay Retalyy initialization loading screen"
              >
                Replay Boot
              </button>
            )}
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <button onClick={() => handleNav('home')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Platform</button>
            <button onClick={() => handleNav('solutions')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Solutions</button>
            <button onClick={() => handleNav('mission')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Mission</button>
            <button onClick={() => handleNav('portal')} className="hover:text-[#0C2B1C] font-bold text-[#0F7A41] transition-colors cursor-pointer">Client Portal</button>
            <button onClick={() => handleNav('calculator')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Operations Engine</button>
            <button onClick={() => handleNav('firms')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Partnership · Why Partner With Us</button>
            <button onClick={() => handleNav('findings')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Findings</button>
            <button onClick={() => handleNav('contact')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Contact Us</button>
            <button onClick={() => handleNav('legal')} className="hover:text-[#0C2B1C] transition-colors cursor-pointer">Security & Legal</button>
          </div>
        </div>

        {/* Disclaimer & Offices */}
        <div className="flex flex-col md:flex-row justify-between gap-8 text-xs text-[#52705F] leading-relaxed">
          <p className="max-w-[700px]">
            Retalyy Inc. is a financial management software and operational technology platform. Retalyy provides automated ledger synchronization, job costing, cash flow forecasting, and management reporting tools for accounting firm partners and businesses across diverse industries. Retalyy is not a certified public accounting firm or legal advisor; software calculations and projections are for managerial planning purposes only.
          </p>
          <div className="space-y-1 md:text-right shrink-0 font-mono text-[11px]">
            <div>Retalyy Inc. (retalyy.com) · San Francisco & Austin</div>
            <div>Inquiries: <a href="mailto:concierge@retalyy.com" className="text-[#0C2B1C] underline">concierge@retalyy.com</a></div>
            <div>© {new Date().getFullYear()} Retalyy Inc. All rights reserved.</div>
          </div>
        </div>

      </div>
    </footer>
  );
};
