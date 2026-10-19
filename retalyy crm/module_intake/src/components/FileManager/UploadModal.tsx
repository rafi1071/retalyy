import React, { useState } from 'react';
import { Client, Period } from '../../types';
import { SAMPLE_TEST_DOCUMENTS } from '../../data/mockData';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface UploadModalProps {
  client: Client;
  period: Period;
  onClose: () => void;
  onUploadFile: (fileName: string, fileSize: number, content: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  client,
  period,
  onClose,
  onUploadFile
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customText, setCustomText] = useState('');
  const [customName, setCustomName] = useState('New_Statement.pdf');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadRealFile = () => {
    if (!selectedFile) return;
    onUploadFile(
      selectedFile.name,
      selectedFile.size,
      `Uploaded file ${selectedFile.name} for ${client.name}.`
    );
    onClose();
  };

  const handleUploadSample = (sample: typeof SAMPLE_TEST_DOCUMENTS[0]) => {
    onUploadFile(
      sample.name,
      380 * 1024,
      sample.content
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-fade-in">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-white">
              Add Documents to {client.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Folder: {period.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragActive
                ? 'border-slate-900 bg-slate-100'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">
              Drag and drop any PDF, scan, or photo here
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              The system automatically reads bank names, account numbers, and statement totals.
            </p>

            <label className="mt-3 inline-block px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-md font-semibold cursor-pointer transition-colors shadow-xs">
              Browse Computer
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div className="mt-3 p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-left">
                <div className="truncate">
                  <span className="font-semibold text-slate-900 block truncate">{selectedFile.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{Math.round(selectedFile.size / 1024)} KB</span>
                </div>
                <button
                  onClick={handleUploadRealFile}
                  className="px-3 py-1 bg-slate-900 text-white rounded font-semibold text-xs hover:bg-slate-800 transition-colors shrink-0"
                >
                  Upload File
                </button>
              </div>
            )}
          </div>

          {/* Quick 1-Click Sample Accounting Documents */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Or test with sample documents (1-click test):
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[1])}
                className="p-2.5 text-left border border-slate-200 hover:border-slate-900 rounded-lg bg-white hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">Amex Corporate Card (*8910)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Fulfills Acme's missing document checklist!
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[0])}
                className="p-2.5 text-left border border-slate-200 hover:border-slate-900 rounded-lg bg-white hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">Chase Operating Checking</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Standard clean bank statement (...4102).
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[4])}
                className="p-2.5 text-left border border-amber-200 hover:border-amber-400 rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Blurry Camera Photo</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Tests how the system alerts on unreadable glare.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUploadSample(SAMPLE_TEST_DOCUMENTS[5])}
                className="p-2.5 text-left border border-slate-200 hover:border-slate-900 rounded-lg bg-white hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">Duplicate Statement</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tests duplicate detection and alert.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
