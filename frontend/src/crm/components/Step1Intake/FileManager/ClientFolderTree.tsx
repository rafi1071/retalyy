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
    <div
      className="w-64 md:w-72 flex flex-col h-full shrink-0 select-none"
      style={{
        background: 'var(--bg-elevated)',
        borderRight: '1px solid var(--border-primary)'
      }}
    >
      {/* Top Section: Title & New Client Button */}
      <div
        className="p-3.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-primary)' }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-2"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Folder className="w-3.5 h-3.5 text-indigo-400" />
          Client Folders
        </span>
        {onNewClientClick && (
          <button
            onClick={onNewClientClick}
            className="px-2.5 py-1 text-[11px] font-medium rounded-md flex items-center gap-1.5 transition-all cursor-pointer"
            style={{
              background: 'var(--accent-primary)',
              color: '#ffffff',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Start Client Onboarding Workflow"
          >
            <Plus className="w-3 h-3" />
            <span>Onboard</span>
          </button>
        )}
      </div>

      {/* Main Client Folders Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-xs">
        {clients.map(client => {
          const isSelectedClient = selectedClientId === client.id && activeSpecialView === 'files';
          const clientPeriods = periods.filter(p => p.clientId === client.id);

          return (
            <div key={client.id} className="space-y-1">
              {/* Client Root Folder */}
              <button
                onClick={() => {
                  onSelectSpecialView('files');
                  const firstPeriod = clientPeriods[0]?.id || periods[0]?.id;
                  onSelectFolder(client.id, firstPeriod);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-all cursor-pointer group"
                style={{
                  background: isSelectedClient ? 'var(--bg-surface)' : 'transparent',
                  color: isSelectedClient ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isSelectedClient ? '1px solid var(--border-secondary)' : '1px solid transparent'
                }}
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2
                    className="w-3.5 h-3.5 shrink-0 transition-colors"
                    style={{ color: isSelectedClient ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
                  />
                  <span className="truncate font-medium">{client.name}</span>
                </div>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: 'var(--bg-base)',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  {clientPeriods.length}
                </span>
              </button>

              {/* Sub-folders: Accounting Periods (e.g. October 2026) */}
              <div className="pl-4 space-y-0.5 border-l ml-3.5" style={{ borderColor: 'var(--border-secondary)' }}>
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
                      className="w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs transition-all cursor-pointer"
                      style={{
                        background: isPeriodSelected ? 'var(--accent-primary-subtle)' : 'transparent',
                        color: isPeriodSelected ? 'var(--accent-primary-hover)' : 'var(--text-tertiary)',
                        border: isPeriodSelected ? '1px solid var(--border-accent)' : '1px solid transparent'
                      }}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Folder
                          className="w-3.5 h-3.5 shrink-0"
                          style={{
                            color: isPeriodSelected ? 'var(--accent-primary)' : 'var(--text-muted)'
                          }}
                        />
                        <span className="truncate">{period.label}</span>
                      </div>

                      {/* Status indicator badge */}
                      <div>
                        {hasMissing && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: 'var(--color-warning-subtle)',
                              color: 'var(--color-warning)'
                            }}
                          >
                            Missing
                          </span>
                        )}
                        {hasAttention && !hasMissing && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: 'var(--color-danger-subtle)',
                              color: 'var(--color-danger)'
                            }}
                          >
                            Review
                          </span>
                        )}
                        {isComplete && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: 'var(--color-success-subtle)',
                              color: 'var(--color-success)'
                            }}
                          >
                            ✓ Ready
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

      {/* Bottom Section: Quick Views */}
      <div
        className="p-2.5 space-y-1 text-xs"
        style={{
          borderTop: '1px solid var(--border-primary)',
          background: 'var(--bg-base)'
        }}
      >
        <button
          onClick={() => onSelectSpecialView('attention')}
          className="w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-all cursor-pointer"
          style={{
            background: activeSpecialView === 'attention' ? 'var(--color-warning-subtle)' : 'transparent',
            color: activeSpecialView === 'attention' ? 'var(--color-warning)' : 'var(--text-secondary)',
            border: activeSpecialView === 'attention' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid transparent'
          }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">Files to Check</span>
          </div>
          <span
            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--color-warning)'
            }}
          >
            2
          </span>
        </button>

        <button
          onClick={() => onSelectSpecialView('onboarding')}
          className="w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-all cursor-pointer"
          style={{
            background: activeSpecialView === 'onboarding' ? 'var(--bg-surface)' : 'transparent',
            color: activeSpecialView === 'onboarding' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: activeSpecialView === 'onboarding' ? '1px solid var(--border-hover)' : '1px solid transparent'
          }}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium">Onboarding & Profiles</span>
          </div>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{
              background: 'var(--bg-surface-active)',
              color: 'var(--text-tertiary)'
            }}
          >
            {clients.length}
          </span>
        </button>

        <button
          onClick={() => onSelectSpecialView('checklists')}
          className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
          style={{
            background: activeSpecialView === 'checklists' ? 'var(--bg-surface)' : 'transparent',
            color: activeSpecialView === 'checklists' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: activeSpecialView === 'checklists' ? '1px solid var(--border-hover)' : '1px solid transparent'
          }}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium">Checklists</span>
        </button>

        <button
          onClick={() => onSelectSpecialView('portal')}
          className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
          style={{
            background: activeSpecialView === 'portal' ? 'var(--bg-surface)' : 'transparent',
            color: activeSpecialView === 'portal' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: activeSpecialView === 'portal' ? '1px solid var(--border-hover)' : '1px solid transparent'
          }}
        >
          <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-medium">Client Upload View</span>
        </button>
      </div>
    </div>
  );
};
