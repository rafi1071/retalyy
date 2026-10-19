import React from 'react';
import { CheckCircle2, GitCompare, Send, X, Sparkles } from 'lucide-react';

interface BatchActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onBatchNormalize: () => void;
  onBatchMatch: () => void;
  onBatchPost: () => void;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount,
  onClear,
  onBatchNormalize,
  onBatchMatch,
  onBatchPost,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-indigo-500/40 shadow-2xl rounded-xl px-4 py-2.5 flex items-center gap-2 sm:gap-4 text-xs max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-bottom-3 duration-150">
      <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-[11px]">
          {selectedCount}
        </span>
        <span className="text-white font-medium">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onBatchNormalize}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium border border-slate-700"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Batch Standardize</span>
        </button>

        <button
          onClick={onBatchMatch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium border border-slate-700"
        >
          <GitCompare className="w-3.5 h-3.5 text-teal-400" />
          <span>Auto-Match Records</span>
        </button>

        <button
          onClick={onBatchPost}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm font-semibold transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Batch Post to Ledger</span>
        </button>
      </div>

      <button
        onClick={onClear}
        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
        title="Deselect All"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
