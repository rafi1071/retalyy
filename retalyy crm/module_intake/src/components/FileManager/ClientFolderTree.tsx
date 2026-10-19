import React from 'react';
import {
  Client,
  Period,
  Submission
} from '../../types';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CheckSquare,
  Globe,
  Plus,
  Building2,
  Inbox
} from 'lucide-react';

interface ClientFolderTreeProps {
  clients: Client[];
  periods: Period[];
  submissions: Record<string, Submission>;
  selectedClientId: string;
  selectedPeriodId: string;
  onSelectFolder: (clientId: string, periodId: string) => void;
  activeSpecialView: 'files' | 'attention' | 'checklists' | 'portal' | 'onboarding';
  onSelectSpecialView: (view: 'files' | 'attention' | 'checklists' | 'portal' | 'onboarding') => void;
  onNewClientClick?: () => void;
}

export const ClientFolderTree: React.FC<ClientFolderTreeProps> = ({
  clients,
  periods,
  submissions,
  selectedClientId,
  selectedPeriodId,
  onSelectFolder,
  activeSpecialView,
  onSelectSpecialView,
  onNewClientClick
}) => {
  return (
    <div className="w-64 md:w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none">
      {/* Top Section: Title & New Client Button */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Folder className="w-4 h-4 text-slate-600" />
          Client Folders
        </span>
        {onNewClientClick && (
          <button
            onClick={onNewClientClick}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs"
            title="Start Client Onboarding Workflow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard</span>
          </button>
        )}
      </div>

      {/* Main Client Folders Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {clients.map(client => {
          const isSelectedClient = selectedClientId === client.id && activeSpecialView === 'files';
          const clientPeriods = periods.filter(p => p.clientId === client.id);

          return (
            <div key={client.id} className="space-y-0.5">
              {/* Client Root Folder */}
              <button
                onClick={() => {
                  onSelectSpecialView('files');
                  const firstPeriod = clientPeriods[0]?.id || periods[0]?.id;
                  onSelectFolder(client.id, firstPeriod);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                  isSelectedClient
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{client.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {clientPeriods.length}
                </span>
              </button>

              {/* Sub-folders: Accounting Periods (e.g. October 2026) */}
              <div className="pl-6 space-y-0.5">
                {clientPeriods.map(period => {
                  const isPeriodSelected =
                    selectedClientId === client.id &&
                    selectedPeriodId === period.id &&
                    activeSpecialView === 'files';

                  // Determine status of this client's folder
                  const submission = Object.values(submissions).find(
                    s => s.clientId === client.id && s.periodId === period.id
                  );

                  const hasMissing =
                    submission?.checklistMatches?.some(m => m.status === 'missing');
                  const hasAttention =
                    submission?.findings && submission.findings.length > 0;
                  const isComplete =
                    submission && !hasMissing && !hasAttention;

                  return (
                    <button
                      key={period.id}
                      onClick={() => {
                        onSelectSpecialView('files');
                        onSelectFolder(client.id, period.id);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors ${
                        isPeriodSelected
                          ? 'bg-slate-900 text-white font-medium shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Folder className={`w-3.5 h-3.5 shrink-0 ${isPeriodSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{period.label}</span>
                      </div>

                      {/* Clear simple status indicator */}
                      <div>
                        {hasMissing && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            isPeriodSelected ? 'bg-amber-400/20 text-amber-200' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Missing 1
                          </span>
                        )}
                        {hasAttention && !hasMissing && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            isPeriodSelected ? 'bg-rose-400/20 text-rose-200' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Check
                          </span>
                        )}
                        {isComplete && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            isPeriodSelected ? 'bg-emerald-400/20 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            ✓ Complete
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Quick Help & Views */}
      <div className="p-3 border-t border-slate-200 space-y-1 bg-slate-50 text-xs">
        <button
          onClick={() => onSelectSpecialView('attention')}
          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
            activeSpecialView === 'attention'
              ? 'bg-amber-100 text-amber-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Files to Check</span>
          </div>
          <span className="text-[11px] font-bold font-mono text-amber-800">
            2
          </span>
        </button>

        <button
          onClick={() => onSelectSpecialView('onboarding')}
          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
            activeSpecialView === 'onboarding'
              ? 'bg-slate-200 text-slate-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
            <span>Onboarding & Profiles</span>
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono">
            {clients.length}
          </span>
        </button>

        <button
          onClick={() => onSelectSpecialView('checklists')}
          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeSpecialView === 'checklists'
              ? 'bg-slate-200 text-slate-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-slate-600 shrink-0" />
          <span>Checklists (What to collect)</span>
        </button>

        <button
          onClick={() => onSelectSpecialView('portal')}
          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            activeSpecialView === 'portal'
              ? 'bg-slate-200 text-slate-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-200/60'
          }`}
        >
          <Globe className="w-4 h-4 text-slate-600 shrink-0" />
          <span>Client Upload View</span>
        </button>
      </div>
    </div>
  );
};
