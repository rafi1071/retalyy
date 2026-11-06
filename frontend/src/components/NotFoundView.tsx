import React from 'react';
import { NavigationTab } from '../types';
import { RetalyyIconMark } from './RetalyyLogo';
import { ArrowLeft, Home, Search, Compass } from 'lucide-react';

interface NotFoundViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ setActiveTab }) => {
  const go = (tab: NavigationTab, href: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAFBF9] px-6 py-24">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#EBF7F0] text-[#27B665] border border-[#27B665]/20 mb-8 shadow-xs">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <div className="text-xs uppercase tracking-widest text-[#52705F] font-bold font-mono mb-3">
          Error 404 • Resource Not Found
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0C2B1C] mb-4 font-display">
          Page Not Found
        </h1>

        <p className="text-base text-[#465E51] leading-relaxed mb-10 max-w-md mx-auto">
          The general ledger entry or URL you requested does not exist or may have been relocated.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              go('home', '/');
            }}
            className="ret-btn px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </a>

          <a
            href="/firms"
            onClick={(e) => {
              e.preventDefault();
              go('firms', '/firms');
            }}
            className="px-6 py-3 text-sm font-semibold rounded-xl bg-white border border-[#D5DDD7] hover:border-[#27B665] text-[#0C2B1C] transition-colors"
          >
            For Accounting Firms
          </a>

          <a
            href="/trades"
            onClick={(e) => {
              e.preventDefault();
              go('trades', '/trades');
            }}
            className="px-6 py-3 text-sm font-semibold rounded-xl bg-white border border-[#D5DDD7] hover:border-[#27B665] text-[#0C2B1C] transition-colors"
          >
            For Trades & Business
          </a>
        </div>
      </div>
    </div>
  );
};
