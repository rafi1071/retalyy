import React from 'react';
import {
  Folder,
  AlertTriangle,
  CheckSquare,
  Globe,
  History,
  Plus,
  Building2,
  UploadCloud,
  UserPlus
} from 'lucide-react';

export type ActiveNavTab = 'files' | 'onboarding' | 'onboard-new' | 'attention' | 'checklists' | 'portal' | 'audit';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  attentionCount: number;
  pendingOnboardingCount: number;
  onOnboardClick: () => void;
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  attentionCount,
  pendingOnboardingCount,
  onOnboardClick,
  onUploadClick
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('files');
          }}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            R
          </span>
          Retalyy
        </a>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Client Intake & Onboarding
        </span>
      </div>

      {/* Zone 2: Navigation Links (single-line, clean prose, no buzzwords) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => onSelectTab('files')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'files'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-slate-500" />
          Client Files
        </button>

        <button
          onClick={() => onSelectTab('onboarding')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'onboarding'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          Client Onboarding
          {pendingOnboardingCount > 0 && (
            <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded font-mono">
              {pendingOnboardingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('attention')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'attention'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          Needs Attention
          {attentionCount > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded font-mono">
              {attentionCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('checklists')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'checklists'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
          Checklists
        </button>

        <button
          onClick={() => onSelectTab('portal')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'portal'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          Client Portal
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onUploadClick}
          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Upload Files
        </button>
        <button
          onClick={onOnboardClick}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Onboard Client
        </button>
      </div>
    </header>
  );
};
