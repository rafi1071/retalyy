import React from 'react';
import { Layers, FileSpreadsheet, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workbench' | 'engine' | 'pipeline' | 'exceptions' | 'audit' | 'coa';
  setActiveTab: (tab: 'workbench' | 'engine' | 'pipeline' | 'exceptions' | 'audit' | 'coa') => void;
  onExport: () => void;
  exceptionCount: number;
  approvedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExport,
  exceptionCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Single element brand mark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <a href="/" className="text-sm sm:text-base font-semibold tracking-tight text-white whitespace-nowrap hover:text-indigo-300 transition-colors">
              Retalyy
            </a>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight whitespace-nowrap hidden sm:inline">Step 2: Processing</span>
          </div>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6 text-xs lg:text-sm font-medium text-slate-300 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveTab('workbench')}
            className={`whitespace-nowrap pb-1 transition-colors shrink-0 ${
              activeTab === 'workbench'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Workbench
          </button>

          <button
            onClick={() => setActiveTab('engine')}
            className={`whitespace-nowrap pb-1 transition-colors shrink-0 flex items-center gap-1 ${
              activeTab === 'engine'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`whitespace-nowrap pb-1 transition-colors shrink-0 ${
              activeTab === 'pipeline'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pipeline
          </button>

          <button
            onClick={() => setActiveTab('exceptions')}
            className={`whitespace-nowrap pb-1 transition-colors shrink-0 flex items-center gap-1 ${
              activeTab === 'exceptions'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Exceptions</span>
            {exceptionCount > 0 && (
              <span className="text-[10px] font-mono font-semibold px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                {exceptionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap pb-1 transition-colors shrink-0 ${
              activeTab === 'audit'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GL Audit
          </button>

          <button
            onClick={() => setActiveTab('coa')}
            className={`whitespace-nowrap pb-1 transition-colors shrink-0 ${
              activeTab === 'coa'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Accounts
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/20 transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Output</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
