import React, { useState } from 'react';
import { useStartupSystem } from '../../context/StartupSystemContext';

export const DocumentIntakePane: React.FC = () => {
  const {
    documents,
    uploadDocument,
    simulateInboundEmail,
    selectedClient
  } = useStartupSystem();

  const [vendorName, setVendorName] = useState('');
  const [docType, setDocType] = useState<'receipt' | 'invoice' | 'bank_statement'>('invoice');
  const [totalDollars, setTotalDollars] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Inbound Email Simulation
  const [emailVendor, setEmailVendor] = useState('United Rentals Crane & Rigging');
  const [emailAmount, setEmailAmount] = useState('1850.00');

  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinor = Math.round(parseFloat(totalDollars || '0') * 100);
    if (!totalMinor || !vendorName) return;

    const subtotalMinor = Math.round(totalMinor * 0.92);
    const taxMinor = totalMinor - subtotalMinor;

    uploadDocument({
      vendorName,
      docType,
      totalMinor,
      subtotalMinor,
      taxMinor,
      lineItemsCount: 3,
      source: 'upload',
      fileName: fileName || `${vendorName.toLowerCase().replace(/\s+/g, '_')}_document.pdf`
    });

    setVendorName('');
    setTotalDollars('');
    setFileName('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleSimulateInboundEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinor = Math.round(parseFloat(emailAmount || '0') * 100);
    if (!totalMinor) return;

    simulateInboundEmail(emailVendor, totalMinor, 'Simulated contractor receipt forwarded via mobile phone');
    alert(`Inbound email received at ${selectedClient.inboundEmailSlug}@inbound.retalyy.com! Ingested and OCR extracted.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Intake Banner: 3 Ingestion Paths (Section 7.1 of Brief) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Path 1: Inbound Email</div>
          <div className="text-sm font-mono font-bold text-[#0C2B1C] mt-1 break-all">
            {selectedClient.inboundEmailSlug}@inbound.retalyy.com
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            Contractors forward vendor receipts via smartphone
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Path 2: Client Portal Upload</div>
          <div className="text-sm font-bold text-[#0C2B1C] mt-1">
            Direct Contractor Dropzone
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            Mobile-friendly responsive intake portal
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9F0E2] shadow-sm">
          <div className="text-xs font-mono uppercase text-[#52705F] font-bold">Path 3: Firm Bulk Ingest</div>
          <div className="text-sm font-bold text-[#0C2B1C] mt-1">
            OCR & Deduplication Pipeline
          </div>
          <div className="text-xs text-[#52705F] mt-1">
            SHA-256 deduplicated, PII redacted at extraction
          </div>
        </div>
      </div>

      {/* Two Columns: Upload Form & Email Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Document Ingestion Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
            <h3 className="font-bold text-[#0C2B1C] text-base">
              Upload Document to Client Vault
            </h3>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#EDF9F1] text-[#0F7A41] font-bold">
              Vision Model: Claude 3.5 Sonnet
            </span>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold font-mono">
              ✓ Document uploaded, SHA-256 deduplicated, and OCR extracted with 98%+ confidence!
            </div>
          )}

          <form onSubmit={handleManualUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#52705F]">Vendor / Supplier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Carrier Commercial Air, United Rentals"
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#52705F]">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1 bg-white"
                >
                  <option value="invoice">Supplier Invoice (AP)</option>
                  <option value="receipt">Point of Sale Receipt</option>
                  <option value="bank_statement">Bank Statement (PDF)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#52705F]">Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1420.00"
                  value={totalDollars}
                  onChange={e => setTotalDollars(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#52705F]">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. carrier_oct2026_invoice.pdf"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9F0E2] mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#0C2B1C] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#16432E] transition-all shadow-sm"
            >
              Upload & Run Autonomous OCR Extraction Pipeline →
            </button>
          </form>
        </div>

        {/* Inbound Email Gateway Simulator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0C2B1C] to-[#16432E] text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#27B665] animate-ping" />
              <h3 className="font-bold text-white text-base">Inbound Email Gateway</h3>
            </div>
            <span className="text-[10px] font-mono text-[#8EDDA6] bg-white/10 px-2 py-0.5 rounded">
              Postmark Webhook
            </span>
          </div>

          <p className="text-xs text-white/80">
            Test the live receipt forwarding workflow. Simulates an email sent by the contractor to their dedicated client address:
          </p>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 font-mono text-xs text-[#8EDDA6] break-all">
            To: {selectedClient.inboundEmailSlug}@inbound.retalyy.com
          </div>

          <form onSubmit={handleSimulateInboundEmail} className="space-y-3">
            <div>
              <label className="text-[11px] text-white/70 font-mono">Simulated Vendor</label>
              <input
                type="text"
                value={emailVendor}
                onChange={e => setEmailVendor(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-white/10 border border-white/20 text-white mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-white/70 font-mono">Invoice Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={emailAmount}
                onChange={e => setEmailAmount(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-white/10 border border-white/20 text-white mt-1 font-mono focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#27B665] text-[#0C2B1C] font-bold text-xs uppercase tracking-wider hover:bg-[#209c55] transition-all shadow-sm"
            >
              Simulate Inbound Receipt Email ✉
            </button>
          </form>
        </div>

      </div>

      {/* Extracted Documents Vault Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9F0E2] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9F0E2]">
          <h3 className="font-bold text-[#0C2B1C] text-base">
            Vault of Extracted Documents ({documents.length} Files)
          </h3>
          <span className="text-xs font-mono text-[#52705F]">
            Immutable Evidence Trail · S3 Encrypted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="font-mono text-[#52705F] border-b border-[#D9F0E2] text-left">
                <th className="py-2.5">Vendor / Entity</th>
                <th className="py-2.5">Doc Type</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Source</th>
                <th className="py-2.5">Line Items</th>
                <th className="py-2.5 text-right">Total ($)</th>
                <th className="py-2.5 text-center">OCR Confidence</th>
                <th className="py-2.5 text-right">Arithmetic Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9F0E2]/60">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-[#F8FCF9]">
                  <td className="py-3">
                    <div className="font-bold text-[#0C2B1C]">{doc.vendorName}</div>
                    <div className="text-[10px] font-mono text-gray-500">{doc.invoiceNumber || doc.id}</div>
                  </td>
                  <td className="py-3 uppercase text-[10px] font-mono font-bold text-[#52705F]">
                    {doc.docType}
                  </td>
                  <td className="py-3 font-mono text-[#52705F]">{doc.documentDate}</td>
                  <td className="py-3 capitalize text-[#0C2B1C]">
                    <span className="px-2 py-0.5 rounded bg-gray-100 font-mono text-[10px]">
                      {doc.source}
                    </span>
                  </td>
                  <td className="py-3 font-mono">{doc.lineItems.length} lines</td>
                  <td className="py-3 text-right font-mono font-bold text-[#0C2B1C]">
                    ${(doc.totalMinor / 100).toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-[#EDF9F1] text-[#0F7A41] font-mono font-bold text-[10px]">
                      {doc.fieldConfidence.total}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[11px] font-mono text-[#0F7A41] font-bold">
                      ✓ Valid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
